import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma, serializePrisma } from './prisma';

const COOKIE_NAME = 'rc_session';
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.LARAVEL_APP_KEY || 'repostchain-secret-key-2026'
);

export interface SessionUser {
  id: number | string;
  urn: string;
  name: string;
  nickname?: string | null;
  email?: string | null;
  avatar?: string | null;
  soundcloud_id: number | string;
  soundcloud_permalink_url?: string | null;
  email_verified_at?: string | null;
  isPro?: boolean;
  repost_price?: number;
  followers_count?: number;
  genres?: string[];
  guard: 'web' | 'admin';
}

export async function createSessionToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Returns the authenticated user from the stateless JWT cookie, enriched with fresh DB data
 * when the MySQL database is reachable.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { urn: session.urn },
      include: {
        userInfo: {
          select: {
            followers_count: true,
            username: true,
          },
        },
        genres: {
          where: { deleted_at: null },
          select: { genre: true },
        },
        userPlans: {
          where: {
            status: 1,
            deleted_at: null,
          },
          select: {
            price: true,
            end_date: true,
          },
        },
      },
    });

    if (!dbUser) return session;

    const serialized = serializePrisma(dbUser);
    const followersCount = Number(serialized.userInfo?.followers_count ?? 0);
    const repostPrice = Math.max(1, Math.min(50, Math.ceil(followersCount / 100) || 1));
    const isPro = serialized.userPlans.some((p: { price: unknown }) => Number(p.price) > 0);

    return {
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
      isPro,
      repost_price: repostPrice,
      followers_count: followersCount,
      genres: serialized.genres.map((g: { genre: string }) => g.genre),
      guard: 'web',
    };
  } catch {
    // If local MySQL is not currently running, return the verified JWT session user seamlessly
    return session;
  }
}
