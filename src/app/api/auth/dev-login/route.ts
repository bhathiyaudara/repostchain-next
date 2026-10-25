import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializePrisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';
import { FALLBACK_USER } from '@/lib/fallback-data';

/**
 * Matches `/dev/login` in `routes/web.php`:
 * Logs in as the first active user in the existing MySQL `users` table,
 * or falls back to preview user if local MySQL is not currently running.
 */
export async function GET(request: NextRequest) {
  const appUrl = new URL(request.url).origin;

  if (process.env.ALLOW_DEV_LOGIN === 'false') {
    return NextResponse.redirect(`${appUrl}/`);
  }

  try {
    const firstUser =
      (await prisma.user.findUnique({
        where: { urn: FALLBACK_USER.urn },
        include: {
          userInfo: true,
          genres: { where: { deleted_at: null } },
        },
      })) ??
      (await prisma.user.findFirst({
        where: {
          deleted_at: null,
          banned_at: null,
          status: 1,
        },
        include: {
          userInfo: true,
          genres: { where: { deleted_at: null } },
        },
        orderBy: { id: 'desc' },
      }));

    if (firstUser) {
      const serialized = serializePrisma(firstUser);
      const followersCount = Number(serialized.userInfo?.followers_count ?? 0);
      await setSessionCookie({
        id: Number(serialized.id),
        urn: serialized.urn,
        name: serialized.name,
        nickname: serialized.nickname,
        email: serialized.email,
        avatar: serialized.avatar,
        soundcloud_id: Number(serialized.soundcloud_id),
        soundcloud_permalink_url: serialized.soundcloud_permalink_url,
        email_verified_at: serialized.email_verified_at
          ? new Date(serialized.email_verified_at).toISOString()
          : null,
        followers_count: followersCount,
        repost_price: Math.max(1, Math.min(50, Math.ceil(followersCount / 100) || 1)),
        genres: serialized.genres.map((g: { genre: string }) => g.genre),
        guard: 'web',
      });

      return NextResponse.redirect(`${appUrl}/user/dashboard`);
    }
  } catch {
    // MySQL not running locally yet — use fallback session user for instant preview
  }

  await setSessionCookie(FALLBACK_USER);
  return NextResponse.redirect(`${appUrl}/user/dashboard`);
}
