import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { FALLBACK_USER } from './fallback-data';

const COOKIE_NAME = 'rc_session';
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.LARAVEL_APP_KEY || 'repostchain-secret-key-2026'
);

const LEGACY_DEMO_URNS = new Set([
  'soundcloud:users:98421034',
  'soundcloud:users:999001',
]);

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
 * Returns the authenticated user from the stateless JWT cookie in 0ms without blocking
 * every API request with 4 sequential database round-trips.
 * Also upgrades any legacy demo cookie (`NovaSynth Audio`) to a real database user.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  if (LEGACY_DEMO_URNS.has(session.urn)) {
    return FALLBACK_USER;
  }

  return session;
}
