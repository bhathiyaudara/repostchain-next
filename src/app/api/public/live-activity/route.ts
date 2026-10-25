import { NextResponse } from 'next/server';
import { prisma, serializePrisma } from '@/lib/prisma';

const FALLBACK_ACTIVITY = [
  {
    id: 'act-1',
    artistName: 'Flute Network',
    avatar: '/default_img/no_img.jpg',
    action: 'launched a new repost campaign for',
    trackTitle: 'Ethereal Winds (Original Mix)',
    genre: 'Ambient / Instrumental',
    timeAgo: '14 mins ago',
  },
  {
    id: 'act-2',
    artistName: 'Kai Rivers',
    avatar: '/frontend/images/testimonial/singh.png',
    action: 'earned +45 credits supporting artists in',
    trackTitle: 'Late Night Frequencies',
    genre: 'Hip-Hop & Rap',
    timeAgo: '32 mins ago',
  },
  {
    id: 'act-3',
    artistName: 'Riley Monroe',
    avatar: '/frontend/images/testimonial/smith.png',
    action: 'received 18 organic reposts on',
    trackTitle: 'Golden Hour Acoustic',
    genre: 'Indie & Pop',
    timeAgo: '1 hour ago',
  },
  {
    id: 'act-4',
    artistName: 'The Velvet Echoes',
    avatar: '/frontend/images/testimonial/mic_check.png',
    action: 'gained +64 new SoundCloud followers via',
    trackTitle: 'Neon Horizon',
    genre: 'Electronic / Synthwave',
    timeAgo: '2 hours ago',
  },
  {
    id: 'act-5',
    artistName: 'Midnight Skyline',
    avatar: '/frontend/images/testimonial/greenn.png',
    action: 'completed a 500-credit campaign for',
    trackTitle: 'Afterhours Club Mix',
    genre: 'House & Techno',
    timeAgo: '3 hours ago',
  },
  {
    id: 'act-6',
    artistName: 'Marcus Chen',
    avatar: '/frontend/images/testimonial/chen.png',
    action: 'reposted & reviewed 6 tracks in',
    trackTitle: 'Bassline Theory VIP',
    genre: 'Trap & Bass',
    timeAgo: '4 hours ago',
  },
];

export async function GET() {
  try {
    const recentCampaigns = await prisma.campaign.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
      take: 6,
      include: {
        user: {
          select: {
            name: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    if (recentCampaigns.length > 0) {
      const serialized = serializePrisma(recentCampaigns);
      const mapped = serialized.map((c, idx: number) => ({
        id: String(c.id || idx),
        artistName: c.user?.name || c.user?.nickname || 'SoundCloud Artist',
        avatar: c.user?.avatar || FALLBACK_ACTIVITY[idx % FALLBACK_ACTIVITY.length].avatar,
        action:
          Number(c.playback_count || 0) > 0
            ? `received ${c.playback_count} organic engagements on`
            : 'launched a repost campaign for',
        trackTitle: c.title || FALLBACK_ACTIVITY[idx % FALLBACK_ACTIVITY.length].trackTitle,
        genre: FALLBACK_ACTIVITY[idx % FALLBACK_ACTIVITY.length].genre,
        timeAgo: idx === 0 ? 'Just now' : `${(idx + 1) * 18} mins ago`,
      }));

      const combined = [...mapped, ...FALLBACK_ACTIVITY].slice(0, 6);
      return NextResponse.json(
        { activities: combined },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }
  } catch {
    // Instant fallback if DB is unreachable
  }

  return NextResponse.json(
    { activities: FALLBACK_ACTIVITY },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
