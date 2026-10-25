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

const FALLBACK_MEMBERS = [
  {
    urn: 'soundcloud:users:11223344',
    name: 'Kaskade Lab',
    nickname: 'kaskadelab',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers_count: 24500,
    track_count: 42,
    country: 'United States',
    genres: ['Melodic Techno', 'Progressive House'],
    repost_price: 9,
    isStarred: true,
  },
  {
    urn: 'soundcloud:users:55667788',
    name: 'Aether & Sol',
    nickname: 'aethersol',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    followers_count: 11200,
    track_count: 28,
    country: 'Germany',
    genres: ['Deep House', 'Organic House'],
    repost_price: 6,
    isStarred: true,
  },
  {
    urn: 'soundcloud:users:99001122',
    name: 'SubZero UK',
    nickname: 'subzerouk',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    followers_count: 38900,
    track_count: 64,
    country: 'United Kingdom',
    genres: ['Drum & Bass', 'Bassline'],
    repost_price: 12,
    isStarred: false,
  },
  {
    urn: 'soundcloud:users:77441122',
    name: 'Luna Frequency',
    nickname: 'lunafreq',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    followers_count: 16800,
    track_count: 35,
    country: 'Netherlands',
    genres: ['Tech House', 'Electronic'],
    repost_price: 7,
    isStarred: false,
  },
];

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all'; // 'all' | 'starred'
  const search = (searchParams.get('search') || '').trim();
  const genre = (searchParams.get('genre') || '').trim();

  try {
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
      ];
    }

    if (genre && genre !== 'All Genres' && genre !== 'all') {
      where.genres = {
        some: {
          genre: { contains: genre },
          deleted_at: null,
        },
      };
    }

    const [starredRows, users] = await Promise.all([
      prisma.starredUser.findMany({
        where: { follower_urn: user.urn, deleted_at: null },
        select: { starred_user_urn: true },
      }),
      prisma.user.findMany({
        where,
        include: {
          userInfo: {
            select: {
              followers_count: true,
              track_count: true,
              country: true,
            },
          },
          genres: {
            where: { deleted_at: null },
            select: { genre: true },
          },
          userPlans: {
            where: { status: 1, price: { gt: 0 }, deleted_at: null },
            select: { id: true },
          },
        },
        orderBy: { id: 'desc' },
        take: 30,
      }),
    ]);

    const starredSet = new Set(starredRows.map((s) => s.starred_user_urn));

    const members = users
      .filter((u) => (filter === 'starred' ? starredSet.has(u.urn) : true))
      .map((u) => {
        const followers = Number(u.userInfo?.followers_count ?? 0);
        const repostPrice =
          followers >= 10000
            ? 100
            : followers >= 1000
            ? Math.floor(followers / 100)
            : 10;
        return {
          urn: u.urn,
          name: u.name || u.nickname || 'SoundCloud Artist',
          nickname: u.nickname,
          avatar: u.avatar,
          created_at: u.created_at,
          followers_count: followers,
          track_count: Number(u.userInfo?.track_count ?? 0),
          country: u.userInfo?.country ?? null,
          genres: u.genres.length > 0 ? u.genres.map((g) => g.genre) : ['Electronic', 'Music'],
          repost_price: repostPrice,
          isPro: u.userPlans.length > 0,
          isStarred: starredSet.has(u.urn),
        };
      });

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        members,
      })
    );
  } catch {
    const filtered = FALLBACK_MEMBERS.filter((m) => {
      if (filter === 'starred' && !m.isStarred) return false;
      if (
        search &&
        !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      dbConnected: false,
      members: filtered,
    });
  }
}

export async function POST(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const { action, targetUrn, musicId = 101, description = '', creditsCost = 9 } = body;

  const now = new Date();

  // 1. Toggle Starred / Favourite Member (`starred_users` table)
  if (action === 'toggle-star') {
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
          message: 'Removed artist from Favourites.',
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
          message: 'Added artist to Favourites!',
        });
      }
    } catch {
      return NextResponse.json({
        success: true,
        previewMode: true,
        message: 'Toggled Favourite status in preview mode!',
      });
    }
  }

  // 2. Send Direct Repost Request (`repost_requests` table + lock credits)
  if (action === 'send-request') {
    const cost = Number(creditsCost || 5);
    const expiredAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days expiry

    try {
      const balance = await getUserCreditBalance(user.urn);
      if (balance < cost) {
        return NextResponse.json(
          { error: `Insufficient credits. Need ${cost} credits.` },
          { status: 400 }
        );
      }

      const created = await prisma.$transaction(async (tx) => {
        const req = await tx.repostRequest.create({
          data: {
            requester_urn: user.urn,
            target_user_urn: targetUrn,
            music_id: BigInt(musicId),
            music_type: MORPH_TYPES.TRACK,
            credits_spent: cost,
            status: REPOST_REQUEST_STATUS.PENDING,
            description: description || 'Would love your support on this release!',
            likeable: true,
            commentable: true,
            following: true,
            requested_at: now,
            expired_at: expiredAt,
            created_at: now,
            updated_at: now,
          },
        });

        await tx.creditTransaction.create({
          data: {
            receiver_urn: user.urn,
            sender_urn: user.urn,
            calculation_type: CREDIT_CALCULATION_TYPE.CREDIT_SUBTRACT,
            source_id: req.id,
            source_type: MORPH_TYPES.REPOST_REQUEST,
            transaction_type: CREDIT_TRANSACTION_TYPE.SPEND,
            status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
            amount: 0,
            credits: cost,
            description: `Sent direct repost request #${req.id} to ${targetUrn}`,
            created_at: now,
            updated_at: now,
          },
        });

        return req;
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          message: `Direct repost request sent! (${cost} credits reserved)`,
          request: created,
        })
      );
    } catch {
      return NextResponse.json({
        success: true,
        previewMode: true,
        message: `Direct repost request sent in preview mode! (${cost} credits)`,
      });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
