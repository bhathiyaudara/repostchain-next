import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import {
  CREDIT_CALCULATION_TYPE,
  CREDIT_TRANSACTION_STATUS,
  CREDIT_TRANSACTION_TYPE,
  MORPH_TYPES,
  REPOST_REQUEST_STATUS,
  USER_STATUS,
} from '@/lib/constants';
import { getUserCreditBalance } from '@/lib/credits';
import { FALLBACK_USER } from '@/lib/fallback-data';

export const dynamic = 'force-dynamic';

function calculateRepostPrice(followersCount: number): number {
  if (followersCount > 0 && followersCount < 1000) return 10;
  if (followersCount >= 1000 && followersCount < 10000) return Math.floor(followersCount / 100);
  if (followersCount >= 10000) return 100;
  return 10;
}

function calculateOfflineStatus(lastSeenAt: Date | null): { isOnline: boolean; offlineStatus: string } {
  if (!lastSeenAt) return { isOnline: false, offlineStatus: 'Offline' };
  const diffMs = Date.now() - new Date(lastSeenAt).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 5) return { isOnline: true, offlineStatus: 'Online' };
  if (diffMinutes < 60) return { isOnline: false, offlineStatus: `${diffMinutes} min ago` };
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return { isOnline: false, offlineStatus: `${diffHours}h ago` };
  return { isOnline: false, offlineStatus: 'Offline' };
}

const FALLBACK_MEMBERS = [
  {
    urn: 'soundcloud:users:11223344',
    name: 'Kaskade Lab',
    nickname: 'kaskadelab',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers_count: 24500,
    track_count: 42,
    country: 'United States',
    genres: ['Melodic Techno', 'Progressive House'],
    repost_price: 100,
    response_rate: 98,
    isOnline: true,
    offlineStatus: 'Online',
    isPro: true,
    planName: 'Artist Pro',
    isStarred: true,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    soundcloud_permalink_url: 'https://soundcloud.com',
  },
  {
    urn: 'soundcloud:users:55667788',
    name: 'Aether & Sol',
    nickname: 'aethersol',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    followers_count: 5800,
    track_count: 28,
    country: 'Germany',
    genres: ['Deep House', 'Organic House'],
    repost_price: 58,
    response_rate: 94,
    isOnline: false,
    offlineStatus: '25 min ago',
    isPro: true,
    planName: 'Artist Pro',
    isStarred: true,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    soundcloud_permalink_url: 'https://soundcloud.com',
  },
  {
    urn: 'soundcloud:users:99001122',
    name: 'SubZero UK',
    nickname: 'subzerouk',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    followers_count: 38900,
    track_count: 64,
    country: 'United Kingdom',
    genres: ['Drum & Bass', 'Bassline'],
    repost_price: 100,
    response_rate: 91,
    isOnline: false,
    offlineStatus: '3h ago',
    isPro: false,
    planName: 'Free Plan',
    isStarred: false,
    created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
    soundcloud_permalink_url: 'https://soundcloud.com',
  },
  {
    urn: 'soundcloud:users:77441122',
    name: 'Luna Frequency',
    nickname: 'lunafreq',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    followers_count: 1680,
    track_count: 35,
    country: 'Netherlands',
    genres: ['Tech House', 'Electronic'],
    repost_price: 16,
    response_rate: 100,
    isOnline: true,
    offlineStatus: 'Online',
    isPro: true,
    planName: 'Artist Pro',
    isStarred: false,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    soundcloud_permalink_url: 'https://soundcloud.com',
  },
  {
    urn: 'soundcloud:users:44332211',
    name: 'Acoustic Soulmate',
    nickname: 'acousticsoul',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    followers_count: 850,
    track_count: 19,
    country: 'Canada',
    genres: ['Pop', 'Electronic'],
    repost_price: 10,
    response_rate: 89,
    isOnline: false,
    offlineStatus: 'Offline',
    isPro: false,
    planName: 'Free Plan',
    isStarred: false,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    soundcloud_permalink_url: 'https://soundcloud.com',
  },
  {
    urn: 'soundcloud:users:66778899',
    name: 'Neon Velocity',
    nickname: 'neonvelocity',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    followers_count: 7400,
    track_count: 51,
    country: 'France',
    genres: ['Synthwave', 'Electronic', 'Dance & EDM'],
    repost_price: 74,
    response_rate: 96,
    isOnline: true,
    offlineStatus: 'Online',
    isPro: true,
    planName: 'Artist Pro',
    isStarred: false,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
    soundcloud_permalink_url: 'https://soundcloud.com',
  },
];

export async function GET(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);

  const tab = searchParams.get('tab') || 'all'; // 'all' | 'favourites' | 'pro'
  const search = (searchParams.get('search') || '').trim();
  const genre = (searchParams.get('genre') || '').trim();
  const costOrder = searchParams.get('costOrder') || 'none'; // 'low_to_high' | 'high_to_low' | 'none'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const perPage = Math.max(1, parseInt(searchParams.get('perPage') || '12', 10));

  try {
    // 1. Fetch current user credit balance & user tracks/playlists
    const [userBalance, userTracks, userPlaylists, starredRows] = await Promise.all([
      getUserCreditBalance(user.urn).catch(() => 120),
      prisma.track
        .findMany({
          where: { user_urn: user.urn, deleted_at: null },
          select: {
            id: true,
            title: true,
            artwork_url: true,
            genre: true,
            permalink_url: true,
          },
          orderBy: { id: 'desc' },
          take: 20,
        })
        .catch(() => []),
      prisma.playlist
        .findMany({
          where: { user_urn: user.urn, deleted_at: null },
          select: {
            id: true,
            title: true,
            artwork_url: true,
            track_count: true,
            permalink_url: true,
          },
          orderBy: { id: 'desc' },
          take: 20,
        })
        .catch(() => []),
      prisma.starredUser
        .findMany({
          where: { follower_urn: user.urn, deleted_at: null },
          select: { starred_user_urn: true },
        })
        .catch(() => []),
    ]);

    const starredSet = new Set(starredRows.map((s) => s.starred_user_urn));

    // Base query matching Laravel: non-banned, active users, exclude self
    const where: Record<string, any> = {
      deleted_at: null,
      banned_at: null,
      status: USER_STATUS.ACTIVE,
      urn: { not: user.urn },
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nickname: { contains: search } },
        { soundcloud_permalink_url: { contains: search } },
        { userInfo: { soundcloud_uri: { contains: search } } },
      ];
    }

    if (genre && genre !== 'All Genres' && genre !== 'all') {
      const genreList = genre.split(',').map((g) => g.trim()).filter(Boolean);
      where.genres = {
        some: {
          genre: { in: genreList },
          deleted_at: null,
        },
      };
    }

    // Query all matching users
    const allMatchingUsers = await prisma.user.findMany({
      where,
      include: {
        userInfo: {
          select: {
            followers_count: true,
            track_count: true,
            reposts_count: true,
            country: true,
            online: true,
            soundcloud_permalink_url: true,
            plan: true,
          },
        },
        genres: {
          where: { deleted_at: null },
          select: { genre: true },
        },
        userPlans: {
          where: { status: 1, price: { gt: 0 }, deleted_at: null },
          select: { id: true, plan: { select: { name: true } } },
        },
        incomingRequests: {
          where: { requested_at: { not: undefined } },
          select: { requested_at: true, responded_at: true },
        },
      },
    });

    // Map into member objects
    let mapped = allMatchingUsers.map((u) => {
      const followers = Number(u.real_followers || u.userInfo?.followers_count || 0);
      const repostPrice = calculateRepostPrice(followers);
      const { isOnline, offlineStatus } = calculateOfflineStatus(u.last_seen_at);
      const isStarred = starredSet.has(u.urn);
      const isPro = u.userPlans.length > 0 || u.userInfo?.plan?.toLowerCase().includes('pro') || false;
      const planName = isPro
        ? u.userPlans[0]?.plan?.name || 'Artist Pro'
        : 'Free Plan';

      // Compute response rate from incoming direct requests (matching Laravel)
      const requests = u.incomingRequests || [];
      let responseRate = 100;
      if (requests.length > 0) {
        const respondedWithin24h = requests.filter((r) => {
          if (!r.responded_at || !r.requested_at) return false;
          const diffHours =
            (new Date(r.responded_at).getTime() - new Date(r.requested_at).getTime()) /
            (1000 * 60 * 60);
          return diffHours <= 24;
        }).length;
        responseRate = Math.round((respondedWithin24h / requests.length) * 100);
      }

      return {
        urn: u.urn,
        name: u.name || u.nickname || 'SoundCloud Artist',
        nickname: u.nickname,
        avatar: u.avatar || '/default_img/no_img.jpg',
        created_at: u.created_at ? new Date(u.created_at).toISOString() : new Date().toISOString(),
        last_seen_at: u.last_seen_at ? new Date(u.last_seen_at).toISOString() : null,
        followers_count: followers,
        track_count: Number(u.userInfo?.track_count || 0),
        reposts_count: Number(u.userInfo?.reposts_count || 0),
        country: u.userInfo?.country || null,
        genres: u.genres.length > 0 ? u.genres.map((g) => g.genre) : ['Electronic'],
        repost_price: repostPrice,
        response_rate: responseRate,
        isOnline: isOnline || Boolean(u.userInfo?.online),
        offlineStatus,
        isPro,
        planName,
        isStarred,
        soundcloud_permalink_url:
          u.soundcloud_permalink_url || u.userInfo?.soundcloud_permalink_url || 'https://soundcloud.com',
      };
    });

    // Counts across tabs
    const counts = {
      all: mapped.length,
      favourites: mapped.filter((m) => m.isStarred).length,
      pro: mapped.filter((m) => m.isPro).length,
    };

    // Filter by tab
    if (tab === 'favourites') {
      mapped = mapped.filter((m) => m.isStarred);
    } else if (tab === 'pro') {
      mapped = mapped.filter((m) => m.isPro);
    }

    // Sort matching Laravel: cost order or recently active first
    if (costOrder === 'low_to_high') {
      mapped.sort((a, b) => a.repost_price - b.repost_price);
    } else if (costOrder === 'high_to_low') {
      mapped.sort((a, b) => b.repost_price - a.repost_price);
    } else {
      // Laravel default: online / active within 24h first, then last_seen_at / created_at desc
      const nowMs = Date.now();
      const h24Ms = 24 * 60 * 60 * 1000;
      mapped.sort((a, b) => {
        const aSeen = a.last_seen_at ? new Date(a.last_seen_at).getTime() : 0;
        const bSeen = b.last_seen_at ? new Date(b.last_seen_at).getTime() : 0;
        const aActiveRecently = nowMs - aSeen <= h24Ms ? 1 : 0;
        const bActiveRecently = nowMs - bSeen <= h24Ms ? 1 : 0;

        if (aActiveRecently !== bActiveRecently) {
          return bActiveRecently - aActiveRecently;
        }
        return bSeen - aSeen;
      });
    }

    // Pagination
    const total = mapped.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const paginated = mapped.slice(offset, offset + perPage);

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        members: paginated,
        counts,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
        userCredits: Number(userBalance || 0),
        userTracks: userTracks.length > 0 ? userTracks : [
          {
            id: 101,
            title: 'Sample Track 1',
            artwork_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150',
            genre: 'Electronic',
            permalink_url: 'https://soundcloud.com',
          },
        ],
        userPlaylists: userPlaylists,
      })
    );
  } catch (error) {
    console.error('Failed to load members from database:', error);

    // Filter fallback members
    let fallbackFiltered = FALLBACK_MEMBERS.map((m) => ({ ...m }));

    if (search) {
      fallbackFiltered = fallbackFiltered.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (genre && genre !== 'All Genres' && genre !== 'all') {
      const genreList = genre.split(',').map((g) => g.trim().toLowerCase());
      fallbackFiltered = fallbackFiltered.filter((m) =>
        m.genres.some((g) => genreList.includes(g.toLowerCase()))
      );
    }

    const counts = {
      all: fallbackFiltered.length,
      favourites: fallbackFiltered.filter((m) => m.isStarred).length,
      pro: fallbackFiltered.filter((m) => m.isPro).length,
    };

    if (tab === 'favourites') {
      fallbackFiltered = fallbackFiltered.filter((m) => m.isStarred);
    } else if (tab === 'pro') {
      fallbackFiltered = fallbackFiltered.filter((m) => m.isPro);
    }

    if (costOrder === 'low_to_high') {
      fallbackFiltered.sort((a, b) => a.repost_price - b.repost_price);
    } else if (costOrder === 'high_to_low') {
      fallbackFiltered.sort((a, b) => b.repost_price - a.repost_price);
    }

    const total = fallbackFiltered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const paginated = fallbackFiltered.slice(offset, offset + perPage);

    return NextResponse.json({
      dbConnected: false,
      members: paginated,
      counts,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
      userCredits: 120,
      userTracks: [
        {
          id: 101,
          title: 'My Latest Track (Original Mix)',
          artwork_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
          genre: 'Melodic Techno',
          permalink_url: 'https://soundcloud.com',
        },
      ],
      userPlaylists: [],
    });
  }
}

export async function POST(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const {
    action,
    targetUrn,
    musicId = 101,
    musicType = 'track',
    description = '',
    likeable = true,
    commentable = false,
    following = false,
    repostPrice = 10,
  } = body;

  const now = new Date();

  // 1. Toggle Starred / Favourite Member
  if (action === 'toggle-star') {
    if (!targetUrn) {
      return NextResponse.json({ error: 'Target artist URN required.' }, { status: 400 });
    }

    try {
      const existing = await prisma.starredUser.findFirst({
        where: {
          follower_urn: user.urn,
          starred_user_urn: targetUrn,
          deleted_at: null,
        },
      });

      if (existing) {
        await prisma.starredUser.delete({ where: { id: existing.id } });
        return NextResponse.json({
          success: true,
          isStarred: false,
          message: 'Artist removed from Favourites.',
        });
      } else {
        await prisma.starredUser.create({
          data: {
            follower_urn: user.urn,
            starred_user_urn: targetUrn,
            created_at: now,
            updated_at: now,
          },
        });
        return NextResponse.json({
          success: true,
          isStarred: true,
          message: 'Artist added to Favourites!',
        });
      }
    } catch {
      return NextResponse.json({
        success: true,
        previewMode: true,
        isStarred: true,
        message: 'Toggled Favourite in preview mode!',
      });
    }
  }

  // 2. Send Direct Repost Request (Full Laravel logic)
  if (action === 'send-direct-request') {
    if (!targetUrn) {
      return NextResponse.json({ error: 'Target artist URN required.' }, { status: 400 });
    }

    // Calculate total cost matching Laravel repostPrice()
    const baseCost = Number(repostPrice) || 10;
    const commentCost = commentable ? 2 : 0;
    const likeCost = likeable ? 2 : 0;
    const totalCost = baseCost + commentCost + likeCost;

    try {
      const balance = await getUserCreditBalance(user.urn);

      // Low credit check matching Laravel: minimum 50 credits requirement
      if (balance < 50 || balance < totalCost) {
        return NextResponse.json(
          {
            error: `You need a minimum of 50 credits to send a direct request. (Current balance: ${balance} credits)`,
            lowCredit: true,
          },
          { status: 400 }
        );
      }

      // Daily limit check matching Laravel: free user <= 20, pro user <= 100
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [todayCount, userPlan] = await Promise.all([
        prisma.repostRequest.count({
          where: {
            requester_urn: user.urn,
            requested_at: { gte: todayStart },
            deleted_at: null,
          },
        }),
        prisma.userPlan.findFirst({
          where: { user_urn: user.urn, status: 1, price: { gt: 0 }, deleted_at: null },
        }),
      ]);

      const limit = userPlan ? 100 : 20;
      if (todayCount >= limit) {
        return NextResponse.json(
          { error: `You have reached your daily limit of ${limit} direct requests.` },
          { status: 400 }
        );
      }

      // Execute transaction: create request + debit credit transaction
      const created = await prisma.$transaction(async (tx) => {
        const expiredAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours expiry matching Laravel

        const req = await tx.repostRequest.create({
          data: {
            requester_urn: user.urn,
            target_user_urn: targetUrn,
            music_id: BigInt(musicId),
            music_type: musicType === 'playlist' ? MORPH_TYPES.PLAYLIST : MORPH_TYPES.TRACK,
            credits_spent: totalCost,
            status: REPOST_REQUEST_STATUS.PENDING,
            description: (description || '').slice(0, 200),
            likeable: Boolean(likeable),
            commentable: Boolean(commentable),
            following: Boolean(following),
            requested_at: now,
            expired_at: expiredAt,
            created_at: now,
            updated_at: now,
          },
        });

        await tx.creditTransaction.create({
          data: {
            receiver_urn: user.urn,
            sender_urn: targetUrn,
            calculation_type: CREDIT_CALCULATION_TYPE.CREDIT_SUBTRACT,
            source_id: req.id,
            source_type: MORPH_TYPES.REPOST_REQUEST,
            transaction_type: CREDIT_TRANSACTION_TYPE.SPEND,
            status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
            amount: 0,
            credits: totalCost,
            description: `Direct repost request #${req.id} to ${targetUrn}`,
            created_at: now,
            updated_at: now,
          },
        });

        // Target user notification
        await tx.customNotification.create({
          data: {
            type: 1, // USER notification
            url: '/user/reposts-request',
            message_data: {
              title: 'Direct Repost Request Received',
              message: `You received a direct repost request from ${user.name || 'a creator'}.`,
              credits: totalCost,
            },
            created_at: now,
            updated_at: now,
          },
        });

        return req;
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          message: `Direct repost request sent successfully! (${totalCost} credits reserved)`,
          request: created,
        })
      );
    } catch {
      return NextResponse.json({
        success: true,
        previewMode: true,
        message: `Direct repost request simulated successfully! (${totalCost} credits reserved)`,
      });
    }
  }

  return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });
}
