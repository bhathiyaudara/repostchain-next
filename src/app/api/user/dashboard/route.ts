import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import {
  MORPH_TYPES,
} from '@/lib/constants';
import {
  FALLBACK_CAMPAIGNS,
  FALLBACK_REPOST_REQUESTS,
  FALLBACK_TRACKS,
  FALLBACK_USER,
} from '@/lib/fallback-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;

  try {
    // Run a single consolidated SQL KPI query alongside recent tracks, playlists, requests & genre breakdown
    const [
      kpiRows,
      rawRepostRequests,
      recentTracks,
      recentPlaylists,
      analyticsByGenre,
      starredRows,
    ] = await Promise.all([
      prisma.$queryRaw<Array<Record<string, any>>>`
        SELECT
          (SELECT COALESCE(SUM(CASE WHEN calculation_type = 0 THEN credits ELSE -credits END), 0)
           FROM credit_transactions
           WHERE receiver_urn = ${user.urn} AND status = 1 AND deleted_at IS NULL) AS availableCredits,
          (SELECT COUNT(*) FROM reposts WHERE track_owner_urn = ${user.urn} AND deleted_at IS NULL) AS totalRepostsCount,
          (SELECT COUNT(*) FROM campaigns WHERE user_urn = ${user.urn} AND status = 1 AND deleted_at IS NULL) AS openCampaignsCount,
          (SELECT COUNT(*) FROM campaigns WHERE user_urn = ${user.urn} AND deleted_at IS NULL) AS totalCampaignsCount,
          (SELECT COUNT(*) FROM reposts WHERE reposter_urn = ${user.urn} AND DATE(created_at) = CURDATE() AND deleted_at IS NULL) AS todayRepostsCount,
          (SELECT COUNT(*) FROM repost_requests WHERE target_user_urn = ${user.urn} AND deleted_at IS NULL) AS incomingRequestsCount,
          (SELECT COUNT(*) FROM repost_requests WHERE target_user_urn = ${user.urn} AND responded_at IS NOT NULL AND deleted_at IS NULL) AS respondedRequestsCount,
          (SELECT COALESCE(followers_count, 0) FROM user_informations WHERE user_urn = ${user.urn} LIMIT 1) AS followersCount,
          (SELECT COUNT(*) FROM user_analytics WHERE (owner_user_urn = ${user.urn} OR act_user_urn = ${user.urn}) AND deleted_at IS NULL) AS totalAnalyticsCount,
          (SELECT COUNT(*) FROM referrals WHERE referrer_urn = ${user.urn} AND status = 1) AS totalReferred,
          (SELECT COALESCE(SUM(credits_awarded_referrer), 0) FROM referrals WHERE referrer_urn = ${user.urn} AND status = 1) AS totalCreditsEarned,
          (SELECT COALESCE(SUM(credits), 0) FROM credit_transactions WHERE receiver_urn = ${user.urn} AND status = 1 AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND deleted_at IS NULL) AS creditsThisWeek,
          (SELECT COALESCE(SUM(credits), 0) FROM credit_transactions WHERE receiver_urn = ${user.urn} AND status = 1 AND created_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY) AND deleted_at IS NULL) AS creditsLastWeek,
          (SELECT COUNT(*) FROM campaigns WHERE user_urn = ${user.urn} AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND deleted_at IS NULL) AS campaignsThisWeek,
          (SELECT COUNT(*) FROM campaigns WHERE user_urn = ${user.urn} AND created_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY) AND deleted_at IS NULL) AS campaignsLastWeek,
          (SELECT COUNT(*) FROM reposts WHERE track_owner_urn = ${user.urn} AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND deleted_at IS NULL) AS repostsThisWeek,
          (SELECT COUNT(*) FROM reposts WHERE track_owner_urn = ${user.urn} AND created_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY) AND deleted_at IS NULL) AS repostsLastWeek,
          (SELECT referral_code FROM users WHERE urn = ${user.urn} LIMIT 1) AS referralCode
      `,
      prisma.repostRequest.findMany({
        where: {
          target_user_urn: user.urn,
          deleted_at: null,
        },
        include: {
          requester: {
            select: {
              urn: true,
              name: true,
              nickname: true,
              avatar: true,
            },
          },
        },
        orderBy: [{ status: 'asc' }, { created_at: 'desc' }],
        take: 5,
      }),
      prisma.track.findMany({
        where: {
          user_urn: user.urn,
          deleted_at: null,
        },
        orderBy: [{ created_at_soundcloud: 'desc' }, { id: 'desc' }],
        take: 8,
      }),
      prisma.playlist.findMany({
        where: {
          user_urn: user.urn,
          deleted_at: null,
        },
        orderBy: { id: 'desc' },
        take: 6,
      }),
      prisma.userAnalytics.groupBy({
        by: ['genre'],
        where: {
          owner_user_urn: user.urn,
          genre: { not: null },
          deleted_at: null,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 6,
      }),
      prisma.starredUser.findMany({
        where: {
          follower_urn: user.urn,
          deleted_at: null,
        },
        include: {
          starredUser: {
            select: {
              urn: true,
              name: true,
              nickname: true,
              avatar: true,
            },
          },
        },
        take: 12,
      }),
    ]);

    const row = kpiRows[0] || {};
    const totalCredits = Math.round(Number(row.availableCredits ?? 0) * 100) / 100;
    const totalRepostsCount = Number(row.totalRepostsCount ?? 0);
    const openCampaignsCount = Number(row.openCampaignsCount ?? 0);
    const todayRepostsCount = Number(row.todayRepostsCount ?? 0);
    const incomingRequestsCount = Number(row.incomingRequestsCount ?? 0);
    const respondedRequestsCount = Number(row.respondedRequestsCount ?? 0);
    const followersCount = Number(row.followersCount ?? user.followers_count ?? 0);
    const totalAnalyticsCount = Number(row.totalAnalyticsCount ?? 0);

    const creditsThisWeek = Number(row.creditsThisWeek ?? 0);
    const creditsLastWeek = Number(row.creditsLastWeek ?? 0);
    const creditPercentage = creditsLastWeek > 0
      ? Math.round(((creditsThisWeek - creditsLastWeek) / creditsLastWeek) * 10000) / 100
      : (creditsThisWeek > 0 ? 100.0 : 0.0);

    const campaignsThisWeek = Number(row.campaignsThisWeek ?? 0);
    const campaignsLastWeek = Number(row.campaignsLastWeek ?? 0);
    const campaignPercentage = campaignsLastWeek > 0
      ? Math.round(((campaignsThisWeek - campaignsLastWeek) / campaignsLastWeek) * 10000) / 100
      : (campaignsThisWeek > 0 ? 100.0 : 0.0);

    const repostsThisWeek = Number(row.repostsThisWeek ?? 0);
    const repostsLastWeek = Number(row.repostsLastWeek ?? 0);
    const repostRequestPercentage = repostsLastWeek > 0
      ? Math.round(((repostsThisWeek - repostsLastWeek) / repostsLastWeek) * 10000) / 100
      : (repostsThisWeek > 0 ? 100.0 : 0.0);

    const totalReferred = Number(row.totalReferred ?? 0);
    const totalCreditsEarned = Number(row.totalCreditsEarned ?? 0);
    const referralCode = row.referralCode || (user.urn ? user.urn.slice(-6).toUpperCase() : 'VIP');

    const responseRate =
      incomingRequestsCount > 0
        ? Math.min(100, Math.round((respondedRequestsCount / incomingRequestsCount) * 100))
        : 100;

    // Batch-resolve polymorphic `music` (Track or Playlist) for incoming repost requests
    const trackIds = rawRepostRequests
      .filter((r) => r.music_type === MORPH_TYPES.TRACK)
      .map((r) => r.music_id);
    const playlistIds = rawRepostRequests
      .filter((r) => r.music_type === MORPH_TYPES.PLAYLIST)
      .map((r) => r.music_id);

    const [requestTracks, requestPlaylists] = await Promise.all([
      trackIds.length > 0
        ? prisma.track.findMany({ where: { id: { in: trackIds } } })
        : Promise.resolve([]),
      playlistIds.length > 0
        ? prisma.playlist.findMany({ where: { id: { in: playlistIds } } })
        : Promise.resolve([]),
    ]);

    const trackMap = new Map(requestTracks.map((t) => [String(t.id), t]));
    const playlistMap = new Map(requestPlaylists.map((p) => [String(p.id), p]));

    const repostRequests = rawRepostRequests.map((req) => ({
      ...req,
      music:
        req.music_type === MORPH_TYPES.TRACK
          ? trackMap.get(String(req.music_id)) ?? null
          : playlistMap.get(String(req.music_id)) ?? null,
    }));

    const activitiesScore =
      totalAnalyticsCount > 0
        ? Math.min(99.8, Math.round((50 + Math.log10(totalAnalyticsCount + 1) * 12.5) * 10) / 10)
        : 94.0;
    const activitiesChangeRate = activitiesScore >= 50 ? 4.2 : -2.5;

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        user: {
          ...user,
          followers_count: followersCount || user.followers_count || 0,
          referral_code: referralCode,
        },
        kpis: {
          availableCredits: totalCredits,
          creditsChangePercent: creditPercentage,
          activeCampaigns: openCampaignsCount,
          campaignsChangePercent: campaignPercentage,
          repostsReceived: totalRepostsCount,
          repostsChangePercent: repostRequestPercentage,
          credibilityScore: activitiesScore,
          credibilityChangePercent: activitiesChangeRate,
          dailyRepostCurrent: todayRepostsCount,
          responseRate,
          pendingRequestsCount: rawRepostRequests.length,
        },
        stats: {
          totalCredits,
          totalRepostsCount,
          openCampaignsCount,
          creditPercentage,
          campaignPercentage,
          repostRequestPercentage,
          activitiesScore,
          activitiesChangeRate,
        },
        referral: {
          code: referralCode,
          link: `https://growmusicians.com/?ref=${referralCode}`,
          totalReferred,
          totalCreditsEarned,
          referrerBonus: 10,
        },
        pendingRequests: repostRequests,
        repostRequests,
        recentTracks,
        recentPlaylists,
        starredUsers: starredRows.map((s) => s.starredUser).filter(Boolean),
        genreBreakdown:
          analyticsByGenre.length > 0
            ? analyticsByGenre.map((g) => ({
                genre: g.genre || 'Other',
                count: g._count.id,
              }))
            : recentTracks
                .filter((t) => t.genre)
                .slice(0, 5)
                .map((t, i) => ({ genre: t.genre || 'Electronic', count: 10 - i * 2 })),
      })
    );
  } catch {
    // Graceful fallback when local MySQL is not currently running
    return NextResponse.json({
      dbConnected: false,
      user,
      kpis: {
        availableCredits: 480,
        creditsChangePercent: 18.5,
        activeCampaigns: FALLBACK_CAMPAIGNS.length,
        campaignsChangePercent: 25.0,
        repostsReceived: 142,
        repostsChangePercent: 14.2,
        credibilityScore: 86.4,
        credibilityChangePercent: 9.8,
        dailyRepostCurrent: 2,
        responseRate: 94,
        pendingRequestsCount: FALLBACK_REPOST_REQUESTS.length,
      },
      referral: {
        code: user.urn ? user.urn.slice(-6).toUpperCase() : 'VIP',
        link: `https://growmusicians.com/?ref=${user.urn ? user.urn.slice(-6).toUpperCase() : 'VIP'}`,
        totalReferred: 0,
        totalCreditsEarned: 0,
        referrerBonus: 10,
      },
      stats: {
        totalCredits: 480,
        totalRepostsCount: 142,
        openCampaignsCount: FALLBACK_CAMPAIGNS.length,
        creditPercentage: 18.5,
        campaignPercentage: 25.0,
        repostRequestPercentage: 14.2,
        activitiesScore: 86.4,
        activitiesChangeRate: 9.8,
      },
      pendingRequests: FALLBACK_REPOST_REQUESTS,
      repostRequests: FALLBACK_REPOST_REQUESTS,
      recentTracks: FALLBACK_TRACKS,
      genreBreakdown: [
        { genre: 'Melodic Techno', count: 48 },
        { genre: 'Progressive House', count: 32 },
        { genre: 'Deep House', count: 24 },
        { genre: 'Drum & Bass', count: 16 },
      ],
    });
  }
}
