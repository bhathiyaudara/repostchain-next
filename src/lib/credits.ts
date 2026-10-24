import { prisma } from './prisma';
import {
  CAMPAIGN_STATUS,
  CREDIT_CALCULATION_TYPE,
  CREDIT_TRANSACTION_STATUS,
} from './constants';

/**
 * Computes a user's exact credit balance using a single SQL aggregation query
 * instead of loading all CreditTransaction rows into memory (which caused severe lag in Laravel).
 *
 * Matches `userCredits()` in `app/Http/Helpers/MainHelper.php`:
 *   Balance = SUM(DEBIT [0] where status=SUCCEEDED [1]) - SUM(CREDIT [1] where status=SUCCEEDED [1])
 */
export async function getUserCreditBalance(userUrn: string): Promise<number> {
  const grouped = await prisma.creditTransaction.groupBy({
    by: ['calculation_type'],
    where: {
      receiver_urn: userUrn,
      status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
      deleted_at: null,
    },
    _sum: {
      credits: true,
    },
  });

  let debitAdditions = 0;
  let creditSubtractions = 0;

  for (const row of grouped) {
    const sum = Number(row._sum.credits ?? 0);
    if (row.calculation_type === CREDIT_CALCULATION_TYPE.DEBIT_ADD) {
      debitAdditions += sum;
    } else if (row.calculation_type === CREDIT_CALCULATION_TYPE.CREDIT_SUBTRACT) {
      creditSubtractions += sum;
    }
  }

  return Math.round((debitAdditions - creditSubtractions) * 100) / 100;
}

/**
 * Calculates weekly percentage deltas for Credits, Campaigns, and Reposts concurrently.
 */
export async function getWeeklyDashboardMetrics(userUrn: string) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(startOfWeek);
  lastWeekStart.setDate(startOfWeek.getDate() - 7);

  const lastWeekEnd = new Date(now);
  lastWeekEnd.setDate(now.getDate() - 7);
  lastWeekEnd.setHours(23, 59, 59, 999);

  const [
    currentWeekCredits,
    lastWeekCredits,
    currentWeekCampaigns,
    lastWeekCampaigns,
    currentWeekReposts,
    lastWeekReposts,
  ] = await Promise.all([
    prisma.creditTransaction.aggregate({
      where: {
        receiver_urn: userUrn,
        status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
        deleted_at: null,
        created_at: { gte: startOfWeek, lte: now },
      },
      _sum: { credits: true },
    }),
    prisma.creditTransaction.aggregate({
      where: {
        receiver_urn: userUrn,
        status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
        deleted_at: null,
        created_at: { gte: lastWeekStart, lte: lastWeekEnd },
      },
      _sum: { credits: true },
    }),
    prisma.campaign.count({
      where: {
        user_urn: userUrn,
        deleted_at: null,
        status: { in: [CAMPAIGN_STATUS.OPEN, CAMPAIGN_STATUS.COMPLETED] },
        created_at: { gte: startOfWeek, lte: now },
      },
    }),
    prisma.campaign.count({
      where: {
        user_urn: userUrn,
        deleted_at: null,
        status: { in: [CAMPAIGN_STATUS.OPEN, CAMPAIGN_STATUS.COMPLETED] },
        created_at: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    }),
    prisma.repost.count({
      where: {
        track_owner_urn: userUrn,
        deleted_at: null,
        created_at: { gte: startOfWeek, lte: now },
      },
    }),
    prisma.repost.count({
      where: {
        track_owner_urn: userUrn,
        deleted_at: null,
        created_at: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    }),
  ]);

  const calcDelta = (curr: number, prev: number) => {
    if (prev > 0) return Math.round(((curr - prev) / prev) * 10000) / 100;
    return curr > 0 ? 100 : 0;
  };

  return {
    creditPercentage: calcDelta(
      Number(currentWeekCredits._sum.credits ?? 0),
      Number(lastWeekCredits._sum.credits ?? 0)
    ),
    campaignPercentage: calcDelta(currentWeekCampaigns, lastWeekCampaigns),
    repostRequestPercentage: calcDelta(currentWeekReposts, lastWeekReposts),
  };
}
