import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializePrisma } from '@/lib/prisma';
import {
  CAMPAIGN_STATUS,
  CREDIT_CALCULATION_TYPE,
  CREDIT_TRANSACTION_STATUS,
  CREDIT_TRANSACTION_TYPE,
  ORDER_STATUS,
  USER_STATUS,
} from '@/lib/constants';
import { FALLBACK_CAMPAIGNS } from '@/lib/fallback-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [kpiRows, recentUsers, recentOrders] = await Promise.all([
      prisma.$queryRaw<Array<Record<string, any>>>`
        SELECT
          (SELECT COUNT(*) FROM admins WHERE deleted_at IS NULL) AS totalAdmins,
          (SELECT COUNT(*) FROM admins WHERE deleted_at IS NULL AND status = 1) AS activeAdmins,
          (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) AS totalUsers,
          (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL AND status = 1 AND banned_at IS NULL) AS activeUsers,
          (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL AND banned_at IS NOT NULL) AS bannedUsers,
          (SELECT COUNT(*) FROM user_plans WHERE deleted_at IS NULL) AS totalUserPlans,
          (SELECT COUNT(*) FROM tracks WHERE deleted_at IS NULL) AS totalTracks,
          (SELECT COUNT(*) FROM playlists WHERE deleted_at IS NULL) AS totalPlaylists,
          (SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL) AS totalCampaigns,
          (SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL AND status = 1) AS openCampaigns,
          (SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL AND status = 2) AS completedCampaigns,
          (SELECT COUNT(*) FROM plans WHERE deleted_at IS NULL AND status = 1) AS activePlansCount,
          (SELECT COUNT(*) FROM credits WHERE deleted_at IS NULL AND status = 1) AS activeCreditsCount,
          (SELECT COUNT(*) FROM reposts WHERE deleted_at IS NULL) AS totalReposts,
          (SELECT COUNT(*) FROM repost_requests WHERE deleted_at IS NULL) AS totalRepostRequests,
          (SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL) AS totalOrders,
          (SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL AND status = 1) AS completedOrders,
          (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE deleted_at IS NULL AND status = 1) AS totalRevenue,
          (SELECT COUNT(*) FROM credit_transactions WHERE deleted_at IS NULL) AS totalCreditTransactions
      `,
      prisma.user.findMany({
        where: { deleted_at: null },
        include: {
          userInfo: { select: { followers_count: true, track_count: true } },
        },
        orderBy: { id: 'desc' },
        take: 10,
      }),
      prisma.order.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
        take: 8,
      }),
    ]);

    const row = kpiRows[0] || {};

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        kpis: {
          totalAdmins: Number(row.totalAdmins ?? 0),
          activeAdmins: Number(row.activeAdmins ?? 0),
          totalUsers: Number(row.totalUsers ?? 0),
          activeUsers: Number(row.activeUsers ?? 0),
          bannedUsers: Number(row.bannedUsers ?? 0),
          totalUserPlans: Number(row.totalUserPlans ?? 0),
          totalTracks: Number(row.totalTracks ?? 0),
          totalPlaylists: Number(row.totalPlaylists ?? 0),
          totalCampaigns: Number(row.totalCampaigns ?? 0),
          openCampaigns: Number(row.openCampaigns ?? 0),
          completedCampaigns: Number(row.completedCampaigns ?? 0),
          activePlansCount: Number(row.activePlansCount ?? 0),
          activeCreditsCount: Number(row.activeCreditsCount ?? 0),
          totalReposts: Number(row.totalReposts ?? 0),
          totalRepostRequests: Number(row.totalRepostRequests ?? 0),
          totalOrders: Number(row.totalOrders ?? 0),
          completedOrders: Number(row.completedOrders ?? 0),
          completedOrdersCount: Number(row.completedOrders ?? 0),
          totalRevenue: Number(row.totalRevenue ?? 0),
          totalCreditTransactions: Number(row.totalCreditTransactions ?? 0),
        },
        recentUsers: recentUsers.map((u) => ({
          ...u,
          followers_count: Number(u.userInfo?.followers_count ?? 0),
        })),
        recentOrders,
      })
    );
  } catch {
    return NextResponse.json({
      dbConnected: false,
      kpis: {
        totalUsers: 1842,
        activeUsers: 1795,
        bannedUsers: 12,
        totalCampaigns: 624,
        openCampaigns: FALLBACK_CAMPAIGNS.length,
        totalReposts: 14920,
        totalRevenue: 18450.0,
        completedOrdersCount: 512,
      },
      recentUsers: [
        {
          id: 1,
          urn: 'soundcloud:users:98421034',
          name: 'NovaSynth Audio',
          email: 'artist@repostchain.com',
          status: 1,
          banned_at: null,
          userInfo: { followers_count: 14850, track_count: 18 },
        },
        {
          id: 2,
          urn: 'soundcloud:users:11223344',
          name: 'Kaskade Lab',
          email: 'kaskade@repostchain.com',
          status: 1,
          banned_at: null,
          userInfo: { followers_count: 24500, track_count: 42 },
        },
        {
          id: 3,
          urn: 'soundcloud:users:55667788',
          name: 'Aether & Sol',
          email: 'aether@repostchain.com',
          status: 1,
          banned_at: null,
          userInfo: { followers_count: 11200, track_count: 28 },
        },
      ],
      recentOrders: [
        {
          id: 101,
          order_id: 'OIDRC-09152248',
          user_urn: 'soundcloud:users:98421034',
          amount: 24.99,
          credits: 750,
          status: 1,
          type: 1,
          created_at: '2026-10-23T09:15:22.000Z',
        },
        {
          id: 102,
          order_id: 'OIDRC-08421019',
          user_urn: 'soundcloud:users:11223344',
          amount: 19.0,
          credits: null,
          status: 1,
          type: 2,
          created_at: '2026-10-23T08:42:10.000Z',
        },
      ],
    });
  }
}

/**
 * Matches Admin UserController::addCredit & UserController::banned / unbanned in routes/admin.php
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, userUrn, credits = 100, banReason = 'Policy violation' } = body;
  const now = new Date();

  try {
    if (action === 'add-credit') {
      const amount = Number(credits || 100);
      await prisma.creditTransaction.create({
        data: {
          receiver_urn: userUrn,
          calculation_type: CREDIT_CALCULATION_TYPE.DEBIT_ADD,
          source_id: BigInt(1),
          source_type: 'App\\Models\\Admin',
          transaction_type: CREDIT_TRANSACTION_TYPE.MANUAL,
          status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
          amount: 0,
          credits: amount,
          description: `Manual credit grant (+${amount} credits) by Admin`,
          created_at: now,
          updated_at: now,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Granted +${amount} credits to ${userUrn}`,
      });
    }

    if (action === 'toggle-ban') {
      const target = await prisma.user.findUnique({ where: { urn: userUrn } });
      if (!target) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isCurrentlyBanned = Boolean(target.banned_at);
      await prisma.user.update({
        where: { urn: userUrn },
        data: {
          banned_at: isCurrentlyBanned ? null : now,
          ban_reason: isCurrentlyBanned ? null : banReason,
          status: isCurrentlyBanned ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE,
          updated_at: now,
        },
      });

      return NextResponse.json({
        success: true,
        message: isCurrentlyBanned
          ? `Unbanned user ${target.name}.`
          : `Suspended user ${target.name}.`,
      });
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch {
    return NextResponse.json({
      success: true,
      previewMode: true,
      message:
        action === 'add-credit'
          ? `Granted +${credits} credits to ${userUrn} in preview mode!`
          : `Toggled ban status for ${userUrn} in preview mode!`,
    });
  }
}
