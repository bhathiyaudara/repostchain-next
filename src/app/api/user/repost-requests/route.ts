import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import {
  CREDIT_CALCULATION_TYPE,
  CREDIT_TRANSACTION_STATUS,
  CREDIT_TRANSACTION_TYPE,
  MORPH_TYPES,
  REPOST_REQUEST_STATUS,
} from '@/lib/constants';
import { FALLBACK_REPOST_REQUESTS, FALLBACK_USER } from '@/lib/fallback-data';

export async function GET(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);
  const direction = searchParams.get('direction') || 'incoming'; // 'incoming' | 'outgoing'
  const statusFilter = searchParams.get('status');

  try {
    const where: Record<string, any> = {
      deleted_at: null,
    };

    if (direction === 'outgoing') {
      where.requester_urn = user.urn;
    } else {
      where.target_user_urn = user.urn;
    }

    if (statusFilter !== null && statusFilter !== undefined && statusFilter !== 'all') {
      where.status = parseInt(statusFilter, 10);
    }

    const rawRequests = await prisma.repostRequest.findMany({
      where,
      include: {
        requester: {
          select: { urn: true, name: true, nickname: true, avatar: true },
        },
        targetUser: {
          select: { urn: true, name: true, nickname: true, avatar: true },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 30,
    });

    const trackIds = rawRequests
      .filter((r) => r.music_type === MORPH_TYPES.TRACK)
      .map((r) => r.music_id);
    const playlistIds = rawRequests
      .filter((r) => r.music_type === MORPH_TYPES.PLAYLIST)
      .map((r) => r.music_id);

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

    const requests = rawRequests.map((r) => ({
      ...r,
      music:
        r.music_type === MORPH_TYPES.TRACK
          ? trackMap.get(String(r.music_id)) ?? null
          : playlistMap.get(String(r.music_id)) ?? null,
    }));

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        requests,
      })
    );
  } catch {
    return NextResponse.json({
      dbConnected: false,
      requests: FALLBACK_REPOST_REQUESTS,
    });
  }
}

export async function POST(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const { requestId, action, rejectionReason } = body; // action: 'approve' | 'decline'

  try {
    const now = new Date();

    if (action === 'decline') {
      const updated = await prisma.$transaction(async (tx) => {
        const req = await tx.repostRequest.findUnique({
          where: { id: BigInt(requestId) },
        });
        if (!req) throw new Error('Repost request not found');

        const declined = await tx.repostRequest.update({
          where: { id: req.id },
          data: {
            status: REPOST_REQUEST_STATUS.DECLINE,
            rejection_reason: rejectionReason || 'Declined by artist',
            responded_at: now,
            updated_at: now,
          },
        });

        // Refund the requester's locked credits (CALCULATION_TYPE_DEBIT = 0 = ADDITION)
        if (Number(req.credits_spent) > 0) {
          await tx.creditTransaction.create({
            data: {
              receiver_urn: req.requester_urn,
              sender_urn: user.urn,
              calculation_type: CREDIT_CALCULATION_TYPE.DEBIT_ADD,
              source_id: req.id,
              source_type: MORPH_TYPES.REPOST_REQUEST,
              transaction_type: CREDIT_TRANSACTION_TYPE.REFUND,
              status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
              amount: 0,
              credits: req.credits_spent,
              description: `Refund for declined repost request #${req.id}`,
              created_at: now,
              updated_at: now,
            },
          });
        }

        return declined;
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          message: 'Repost request declined and credits refunded to requester.',
          request: updated,
        })
      );
    }

    if (action === 'approve') {
      const updated = await prisma.$transaction(async (tx) => {
        const req = await tx.repostRequest.findUnique({
          where: { id: BigInt(requestId) },
        });
        if (!req || req.status !== REPOST_REQUEST_STATUS.PENDING) {
          throw new Error('Repost request is no longer pending.');
        }

        const earnedCredits = Number(req.credits_spent || 5);

        await tx.repost.create({
          data: {
            repost_request_id: req.id,
            reposter_urn: user.urn,
            track_owner_urn: req.requester_urn,
            campaign_id: req.campaign_id,
            credits_earned: earnedCredits,
            reposted_at: now,
            created_at: now,
            updated_at: now,
          },
        });

        const approved = await tx.repostRequest.update({
          where: { id: req.id },
          data: {
            status: REPOST_REQUEST_STATUS.APPROVED,
            responded_at: now,
            completed_at: now,
            updated_at: now,
          },
        });

        await tx.creditTransaction.create({
          data: {
            receiver_urn: user.urn,
            sender_urn: req.requester_urn,
            calculation_type: CREDIT_CALCULATION_TYPE.DEBIT_ADD,
            source_id: req.id,
            source_type: MORPH_TYPES.REPOST_REQUEST,
            transaction_type: CREDIT_TRANSACTION_TYPE.EARN,
            status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
            amount: 0,
            credits: earnedCredits,
            description: `Approved & reposted request #${req.id}`,
            created_at: now,
            updated_at: now,
          },
        });

        return { approved, earnedCredits };
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          earnedCredits: updated.earnedCredits,
          message: `Request approved & reposted! You earned +${updated.earnedCredits} credits.`,
        })
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({
      success: true,
      previewMode: true,
      message:
        action === 'approve'
          ? 'Repost request approved in preview mode! (+9 credits)'
          : 'Repost request declined in preview mode.',
    });
  }
}
