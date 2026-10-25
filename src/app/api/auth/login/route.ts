import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializePrisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';
import { verifyLaravelPassword } from '@/lib/crypto';
import { FALLBACK_USER } from '@/lib/fallback-data';

// Passwordless / demo shortcuts are enabled unless explicitly disabled.
const DEV_LOGIN_ALLOWED = process.env.ALLOW_DEV_LOGIN !== 'false';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { role = 'user', email = '', password = '' } = body;
  const instant = DEV_LOGIN_ALLOWED && Boolean(body.instant);

  // ==========================================================================
  // 1. ADMIN LOGIN (DB `admins` table OR Temporary Admin Credentials)
  // ==========================================================================
  if (role === 'admin') {
    try {
      const dbAdmin = email
        ? await prisma.admin.findUnique({ where: { email } })
        : await prisma.admin.findFirst({ where: { deleted_at: null } });

      if (dbAdmin) {
        const validPassword =
          instant ||
          (DEV_LOGIN_ALLOWED && password === 'admin123') ||
          (await verifyLaravelPassword(password, dbAdmin.password));

        if (!validPassword) {
          return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
        }

        const serialized = serializePrisma(dbAdmin);
        await setSessionCookie({
          id: Number(serialized.id),
          urn: `admin:${serialized.id}`,
          name: serialized.name,
          email: serialized.email,
          avatar: serialized.image,
          soundcloud_id: 0,
          guard: 'admin',
        });

        return NextResponse.json({
          success: true,
          redirectUrl: '/admin/dashboard',
        });
      }
    } catch {
      // Fallback if local MySQL is not running
    }

    // Temporary Admin Login fallback (`admin@repostchain.com` / `admin123` or 1-click instant)
    if (
      DEV_LOGIN_ALLOWED &&
      (instant || (email.toLowerCase() === 'admin@repostchain.com' && password === 'admin123'))
    ) {
      await setSessionCookie({
        id: 1,
        urn: 'admin:1',
        name: 'Super Admin',
        email: 'admin@repostchain.com',
        soundcloud_id: 0,
        guard: 'admin',
      });

      return NextResponse.json({
        success: true,
        redirectUrl: '/admin/dashboard',
      });
    }

    return NextResponse.json(
      { error: 'Use admin@repostchain.com / admin123 or click 1-Click Admin Login.' },
      { status: 401 }
    );
  }

  // ==========================================================================
  // 2. USER / ARTIST LOGIN (DB `users` table OR Temporary User Credentials)
  // ==========================================================================
  try {
    const isDefaultDemoEmail =
      DEV_LOGIN_ALLOWED &&
      (instant || email.toLowerCase() === 'artist@repostchain.com' || !email);

    const dbUser = isDefaultDemoEmail
      ? (await prisma.user.findUnique({
          where: { urn: FALLBACK_USER.urn },
          include: { userInfo: true },
        })) ??
        (await prisma.user.findFirst({
          where: {
            deleted_at: null,
            banned_at: null,
            status: 1,
          },
          include: { userInfo: true },
          orderBy: { id: 'desc' },
        }))
      : await prisma.user.findFirst({
          where: {
            deleted_at: null,
            OR: [{ email }, { urn: email }, { nickname: email }, { name: email }],
          },
          include: { userInfo: true },
        });

    if (dbUser) {
      const serialized = serializePrisma(dbUser);
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
        followers_count: followersCount,
        repost_price: Math.max(1, Math.min(50, Math.ceil(followersCount / 100) || 5)),
        guard: 'web',
      });

      return NextResponse.json({
        success: true,
        redirectUrl: '/user/dashboard',
      });
    }
  } catch {
    // Fallback if local MySQL is not running
  }

  if (
    DEV_LOGIN_ALLOWED &&
    (instant || (email.toLowerCase() === 'artist@repostchain.com' && password === 'artist123'))
  ) {
    await setSessionCookie(FALLBACK_USER);
    return NextResponse.json({
      success: true,
      redirectUrl: '/user/dashboard',
    });
  }

  return NextResponse.json(
    { error: 'Use artist@repostchain.com / artist123 or click 1-Click Artist Login.' },
    { status: 401 }
  );
}
