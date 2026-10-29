import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import {
  CAMPAIGN_STATUS,
  CREDIT_CALCULATION_TYPE,
  CREDIT_TRANSACTION_STATUS,
  CREDIT_TRANSACTION_TYPE,
  MORPH_TYPES,
  USER_ANALYTICS_TYPE,
  calculateRepostPrice,
} from '@/lib/constants';
import { getUserCreditBalance } from '@/lib/credits';
import { FALLBACK_CAMPAIGNS, FALLBACK_USER } from '@/lib/fallback-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);

  const tab = searchParams.get('tab') || 'recommendedPro'; // 'recommendedPro' | 'recommended' | 'all' | 'mine'
  const search = (searchParams.get('search') || '').trim();
  const genre = searchParams.get('genre') || searchParams.get('genres') || '';
  const trackType = searchParams.get('trackType') || 'all'; // 'all' | 'track' | 'playlist'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const defaultPerPage = tab === 'mine' ? 50 : 12;
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('perPage') || String(defaultPerPage), 10)));

  try {
    const baseWhere: Record<string, any> = {
      deleted_at: null,
    };

    const proUserCondition = {
      OR: [
        { pro_feature: true },
        {
          user: {
            userPlans: {
              some: {
                status: 1,
                price: { gt: 0 },
                deleted_at: null,
              },
            },
          },
        },
      ],
    };

    if (tab === 'mine') {
      baseWhere.user_urn = user.urn;
    } else {
      baseWhere.status = CAMPAIGN_STATUS.OPEN;
      baseWhere.user_urn = { not: user.urn };
      if (tab === 'recommendedPro') {
        Object.assign(baseWhere, proUserCondition);
      }
    }

    if (genre && genre !== 'all' && genre !== 'All Genres') {
      const genreList = genre.split(',').map((g) => g.trim()).filter(Boolean);
      if (genreList.length === 1) {
        baseWhere.target_genre = { contains: genreList[0] };
      } else if (genreList.length > 1) {
        baseWhere.OR = [
          ...genreList.map((g) => ({ target_genre: { contains: g } })),
          { target_genre: 'anyGenre' },
        ];
      }
    }

    if (trackType === 'track') {
      baseWhere.music_type = MORPH_TYPES.TRACK;
    } else if (trackType === 'playlist') {
      baseWhere.music_type = MORPH_TYPES.PLAYLIST;
    }

    if (search) {
      baseWhere.AND = [
        ...(baseWhere.AND || []),
        {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { target_genre: { contains: search } },
          ],
        },
      ];
    }

    // Fetch paginated campaigns, counts, and user's reposted campaign IDs concurrently
    const [campaigns, total, countRows, myRepostedCampaigns] = await Promise.all([
      prisma.campaign.findMany({
        where: baseWhere,
        include: {
          user: {
            select: {
              urn: true,
              name: true,
              nickname: true,
              avatar: true,
              userInfo: { select: { followers_count: true } },
            },
          },
        },
        orderBy: [{ is_boost: 'desc' }, { is_featured: 'desc' }, { created_at: 'desc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.campaign.count({ where: baseWhere }),
      prisma.$queryRaw<Array<Record<string, any>>>`
        SELECT
          (SELECT COUNT(*) FROM campaigns c
           WHERE c.deleted_at IS NULL AND c.status = 1 AND c.user_urn != ${user.urn}
             AND (c.pro_feature = 1 OR EXISTS (
               SELECT 1 FROM user_plans up
               WHERE up.user_urn = c.user_urn AND up.status = 1 AND up.price > 0 AND up.deleted_at IS NULL
             ))) AS proCount,
          (SELECT COUNT(*) FROM campaigns c
           WHERE c.deleted_at IS NULL AND c.status = 1 AND c.user_urn != ${user.urn}) AS allOpenCount
      `,
      prisma.repost.findMany({
        where: {
          reposter_urn: user.urn,
          campaign_id: { not: null },
          deleted_at: null,
        },
        select: { campaign_id: true },
      }),
    ]);

    const proCount = Number(countRows[0]?.proCount ?? 0);
    const allOpenCount = Number(countRows[0]?.allOpenCount ?? 0);

    const repostedSet = new Set(myRepostedCampaigns.map((r) => String(r.campaign_id)));

    // Batch-resolve polymorphic music (Track or Playlist) in 2 queries instead of N queries
    const trackIds = campaigns
      .filter((c) => c.music_type === MORPH_TYPES.TRACK)
      .map((c) => c.music_id);
    const playlistIds = campaigns
      .filter((c) => c.music_type === MORPH_TYPES.PLAYLIST)
      .map((c) => c.music_id);

    const [tracks, playlists] = await Promise.all([
      trackIds.length > 0
        ? prisma.track.findMany({ where: { id: { in: trackIds } } })
        : Promise.resolve([]),
      playlistIds.length > 0
        ? prisma.playlist.findMany({ where: { id: { in: playlistIds } } })
        : Promise.resolve([]),
    ]);

    const trackMap = new Map(tracks.map((t) => [String(t.id), t]));
    const playlistMap = new Map(playlists.map((p) => [String(p.id), p]));

    const enrichedCampaigns = campaigns.map((c) => ({
      ...c,
      alreadyReposted: repostedSet.has(String(c.id)),
      music:
        c.music_type === MORPH_TYPES.TRACK
          ? trackMap.get(String(c.music_id)) ?? null
          : playlistMap.get(String(c.music_id)) ?? null,
    }));

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        campaigns: enrichedCampaigns,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
        counts: {
          recommendedPro: proCount,
          recommended: allOpenCount,
          all: allOpenCount,
        },
      })
    );
  } catch {
    // Fallback preview mode when local MySQL is not running
    const filtered = FALLBACK_CAMPAIGNS.filter((c) => {
      if (tab === 'recommendedPro' && !c.pro_feature) return false;
      if (genre && genre !== 'all' && genre !== 'All Genres') {
        const genreList = genre.split(',').map((g) => g.trim().toLowerCase()).filter(Boolean);
        const cGenre = (c.target_genre || '').toLowerCase();
        if (genreList.length > 0 && !genreList.some((g) => cGenre.includes(g) || cGenre === 'anygenre')) {
          return false;
        }
      }
      if (trackType === 'track' && c.music_type !== 'App\\Models\\Track') return false;
      if (trackType === 'playlist' && c.music_type !== 'App\\Models\\Playlist') return false;
      if (
        search &&
        !c.title.toLowerCase().includes(search.toLowerCase()) &&
        !(c.target_genre || '').toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      dbConnected: false,
      campaigns: filtered,
      pagination: {
        page: 1,
        perPage,
        total: filtered.length,
        totalPages: 1,
      },
      counts: {
        recommendedPro: FALLBACK_CAMPAIGNS.filter((c) => c.pro_feature).length,
        recommended: FALLBACK_CAMPAIGNS.length,
        all: FALLBACK_CAMPAIGNS.length,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const action = body.action || 'create';

  // --------------------------------------------------------------------------
  // ACTION 1: CREATE CAMPAIGN (Matches MyCampaignService::createTrackCampaign)
  // --------------------------------------------------------------------------
  if (action === 'create') {
    const {
      musicId,
      musicType = MORPH_TYPES.TRACK,
      title,
      description,
      budgetCredits,
      targetGenre = 'anyGenre',
      likeable = true,
      commentable = true,
      proFeature = false,
      maxFollowers = null,
    } = body;

    const budget = Number(budgetCredits || 50);
    if (budget < 50) {
      return NextResponse.json(
        { error: 'Minimum campaign budget is 50 credits.' },
        { status: 400 }
      );
    }

    try {
      const availableCredits = await getUserCreditBalance(user.urn);
      if (budget > availableCredits) {
        return NextResponse.json(
          { error: `Insufficient credits. Available: ${availableCredits} credits.` },
          { status: 400 }
        );
      }

      let resolvedMusicId = musicId ? BigInt(musicId) : null;
      if (!resolvedMusicId && body.musicUrn) {
        const foundTrack = await prisma.track.findFirst({
          where: { urn: String(body.musicUrn) },
          select: { id: true },
        });
        if (foundTrack) resolvedMusicId = foundTrack.id;
      }
      if (!resolvedMusicId) {
        const fallbackTrack = await prisma.track.findFirst({
          where: { user_urn: user.urn, deleted_at: null },
          select: { id: true },
        });
        resolvedMusicId = fallbackTrack?.id ?? BigInt(1);
      }

      const now = new Date();
      const endDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // +5 days matching Campaign::booted()

      const created = await prisma.$transaction(async (tx) => {
        const campaign = await tx.campaign.create({
          data: {
            user_urn: user.urn,
            music_id: resolvedMusicId,
            music_type: musicType === 'track' ? MORPH_TYPES.TRACK : musicType === 'playlist' ? MORPH_TYPES.PLAYLIST : musicType,
            title: title || 'Untitled Campaign',
            description: description || null,
            budget_credits: budget,
            credits_spent: 0,
            target_genre: targetGenre,
            likeable: Boolean(likeable),
            commentable: Boolean(commentable),
            pro_feature: Boolean(proFeature),
            max_followers: maxFollowers ? BigInt(maxFollowers) : null,
            status: CAMPAIGN_STATUS.OPEN,
            start_date: now,
            end_date: endDate,
            created_at: now,
            updated_at: now,
            creater_id: BigInt(user.id),
            creater_type: MORPH_TYPES.USER,
          },
        });

        // Deduct campaign budget via CreditTransaction (CALCULATION_TYPE_CREDIT = 1 = SUBTRACTION)
        await tx.creditTransaction.create({
          data: {
            receiver_urn: user.urn,
            sender_urn: user.urn,
            calculation_type: CREDIT_CALCULATION_TYPE.CREDIT_SUBTRACT,
            source_id: campaign.id,
            source_type: MORPH_TYPES.CAMPAIGN,
            transaction_type: CREDIT_TRANSACTION_TYPE.SPEND,
            status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
            amount: 0,
            credits: budget,
            description: `Created campaign '${campaign.title}' with budget of ${budget} credits.`,
            created_at: now,
            updated_at: now,
          },
        });

        return campaign;
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          message: 'Campaign launched successfully!',
          campaign: created,
        })
      );
    } catch {
      // Offline preview response
      return NextResponse.json({
        success: true,
        previewMode: true,
        message: 'Campaign created in preview mode (connect MySQL to persist).',
      });
    }
  }

  // --------------------------------------------------------------------------
  // ACTION 2: REPOST CAMPAIGN & EARN CREDITS (Matches CampaignService::syncReposts)
  // --------------------------------------------------------------------------
  if (action === 'repost') {
    const {
      campaignId,
      liked = true,
      comment = '',
      followed = true,
    } = body;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const campaign = await tx.campaign.findUnique({
          where: { id: BigInt(campaignId) },
          include: { user: true },
        });

        if (!campaign || campaign.status !== CAMPAIGN_STATUS.OPEN) {
          throw new Error('This campaign is no longer open.');
        }

        const existingRepost = await tx.repost.findFirst({
          where: {
            reposter_urn: user.urn,
            campaign_id: campaign.id,
            deleted_at: null,
          },
        });

        if (existingRepost) {
          throw new Error('You have already reposted this campaign.');
        }

        const remainingBudget =
          Number(campaign.budget_credits) - Number(campaign.credits_spent);
        const basePrice = Number(user.repost_price || 5);
        const canAffordLike =
          campaign.likeable && Boolean(liked) && remainingBudget >= basePrice + 2;
        const canAffordComment =
          campaign.commentable &&
          Boolean(comment?.trim()) &&
          remainingBudget >= basePrice + (canAffordLike ? 4 : 2);

        const earnedCredits = Math.min(
          remainingBudget,
          calculateRepostPrice(basePrice, canAffordComment, canAffordLike)
        );

        const now = new Date();

        // 1. Create Repost record
        const repost = await tx.repost.create({
          data: {
            reposter_urn: user.urn,
            track_owner_urn: campaign.user_urn,
            campaign_id: campaign.id,
            credits_earned: earnedCredits,
            reposted_at: now,
            created_at: now,
            updated_at: now,
          },
        });

        // 2. Increment Campaign counters & auto-complete if budget reached
        const newSpent = Number(campaign.credits_spent) + earnedCredits;
        const reachedBudget = newSpent >= Number(campaign.budget_credits);

        await tx.campaign.update({
          where: { id: campaign.id },
          data: {
            completed_reposts: { increment: 1 },
            credits_spent: { increment: earnedCredits },
            like_count: canAffordLike ? { increment: 1 } : undefined,
            comment_count: canAffordComment ? { increment: 1 } : undefined,
            followers_count: followed ? { increment: 1 } : undefined,
            status: reachedBudget ? CAMPAIGN_STATUS.COMPLETED : campaign.status,
            updated_at: now,
          },
        });

        // 3. Credit the Reposter (CALCULATION_TYPE_DEBIT = 0 = ADDITION)
        await tx.creditTransaction.create({
          data: {
            receiver_urn: user.urn,
            sender_urn: campaign.user_urn,
            calculation_type: CREDIT_CALCULATION_TYPE.DEBIT_ADD,
            source_id: campaign.id,
            source_type: MORPH_TYPES.CAMPAIGN,
            transaction_type: CREDIT_TRANSACTION_TYPE.EARN,
            status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
            amount: 0,
            credits: earnedCredits,
            description: `Repost of campaign '${campaign.title}' by ${campaign.user.name}. Repost ID: ${repost.id}.`,
            metadata: {
              repost_id: Number(repost.id),
              campaign_id: Number(campaign.id),
              like_credited: canAffordLike,
              comment_credited: canAffordComment,
            },
            created_at: now,
            updated_at: now,
          },
        });

        // 4. Record Analytics entry
        await tx.userAnalytics.create({
          data: {
            owner_user_urn: campaign.user_urn,
            act_user_urn: user.urn,
            source_id: campaign.music_id,
            source_type: campaign.music_type,
            actionable_id: campaign.id,
            actionable_type: MORPH_TYPES.CAMPAIGN,
            type: USER_ANALYTICS_TYPE.REPOST,
            genre: campaign.target_genre,
            created_at: now,
            updated_at: now,
          },
        });

        return { repost, earnedCredits };
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          earnedCredits: result.earnedCredits,
          message: `Reposted! You earned +${result.earnedCredits} credits.`,
        })
      );
    } catch (err: any) {
      if (err?.message?.includes('already reposted') || err?.message?.includes('no longer open')) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      // Fallback preview mode calculation
      const earned = calculateRepostPrice(
        Number(user.repost_price || 5),
        Boolean(comment?.trim()),
        Boolean(liked)
      );
      return NextResponse.json({
        success: true,
        previewMode: true,
        earnedCredits: earned,
        message: `Reposted in preview mode! (+${earned} credits)`,
      });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
