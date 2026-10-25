import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import { USER_ANALYTICS_TYPE } from '@/lib/constants';
import { FALLBACK_TRACKS, FALLBACK_USER } from '@/lib/fallback-data';

export async function GET(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d'; // '7d' | '30d' | '90d'

  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    const [currentCounts, prevCounts, genreStats, topTracks] = await Promise.all([
      prisma.userAnalytics.groupBy({
        by: ['type'],
        where: {
          owner_user_urn: user.urn,
          created_at: { gte: startDate, lte: now },
          deleted_at: null,
        },
        _count: { id: true },
      }),
      prisma.userAnalytics.groupBy({
        by: ['type'],
        where: {
          owner_user_urn: user.urn,
          created_at: { gte: prevStartDate, lt: startDate },
          deleted_at: null,
        },
        _count: { id: true },
      }),
      prisma.userAnalytics.groupBy({
        by: ['genre'],
        where: {
          owner_user_urn: user.urn,
          created_at: { gte: startDate, lte: now },
          genre: { not: null },
          deleted_at: null,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 8,
      }),
      prisma.track.findMany({
        where: {
          user_urn: user.urn,
          deleted_at: null,
        },
        orderBy: [{ reposts_count: 'desc' }, { playback_count: 'desc' }],
        take: 6,
      }),
    ]);

    const currMap = new Map(currentCounts.map((r) => [r.type, r._count.id]));
    const prevMap = new Map(prevCounts.map((r) => [r.type, r._count.id]));

    const buildMetric = (type: number) => {
      const total = currMap.get(type) ?? 0;
      const prev = prevMap.get(type) ?? 0;
      const delta = prev > 0 ? Math.round(((total - prev) / prev) * 1000) / 10 : total > 0 ? 100 : 0;
      return { total, prev, delta };
    };

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        range,
        totals: {
          views: buildMetric(USER_ANALYTICS_TYPE.VIEW).total,
          plays: buildMetric(USER_ANALYTICS_TYPE.PLAY).total,
          reposts: buildMetric(USER_ANALYTICS_TYPE.REPOST).total,
          likes: buildMetric(USER_ANALYTICS_TYPE.LIKE).total,
          comments: buildMetric(USER_ANALYTICS_TYPE.COMMENT).total,
          followers: buildMetric(USER_ANALYTICS_TYPE.FOLLOW).total,
        },
        metrics: {
          views: buildMetric(USER_ANALYTICS_TYPE.VIEW),
          plays: buildMetric(USER_ANALYTICS_TYPE.PLAY),
          reposts: buildMetric(USER_ANALYTICS_TYPE.REPOST),
          likes: buildMetric(USER_ANALYTICS_TYPE.LIKE),
          comments: buildMetric(USER_ANALYTICS_TYPE.COMMENT),
          follows: buildMetric(USER_ANALYTICS_TYPE.FOLLOW),
        },
        genres: genreStats.map((g) => ({
          genre: g.genre || 'Electronic',
          count: g._count.id,
        })),
        topTracks,
      })
    );
  } catch {
    const multiplier = range === '7d' ? 0.35 : range === '90d' ? 2.6 : 1;
    return NextResponse.json({
      dbConnected: false,
      range,
      metrics: {
        views: { total: Math.round(4820 * multiplier), prev: 3910, delta: 23.3 },
        plays: { total: Math.round(2940 * multiplier), prev: 2410, delta: 22.0 },
        reposts: { total: Math.round(142 * multiplier), prev: 118, delta: 20.3 },
        likes: { total: Math.round(128 * multiplier), prev: 104, delta: 23.1 },
        comments: { total: Math.round(96 * multiplier), prev: 81, delta: 18.5 },
        follows: { total: Math.round(84 * multiplier), prev: 69, delta: 21.7 },
      },
      genres: [
        { genre: 'Melodic Techno', count: Math.round(64 * multiplier) },
        { genre: 'Progressive House', count: Math.round(42 * multiplier) },
        { genre: 'Deep House', count: Math.round(31 * multiplier) },
        { genre: 'Drum & Bass', count: Math.round(19 * multiplier) },
      ],
      topTracks: FALLBACK_TRACKS,
    });
  }
}
