import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeSoundCloudCode,
  fetchSoundCloudMe,
  upsertSoundCloudUserInDb,
} from '@/lib/soundcloud';
import { setSessionCookie } from '@/lib/auth';
import { serializePrisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const origin = request.nextUrl.origin;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || origin || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );

  if (error || !code) {
    return NextResponse.redirect(
      `${appUrl}/?error=${encodeURIComponent('SoundCloud authentication was cancelled or failed.')}`
    );
  }

  try {
    const tokens = await exchangeSoundCloudCode(code, origin);
    const scUser = await fetchSoundCloudMe(tokens.access_token);

    // Artist verification check matching SoundCloudController::notAnArtist
    if ((scUser.track_count ?? 0) <= 0 || !scUser.avatar_url) {
      return NextResponse.redirect(
        `${appUrl}/?warning=${encodeURIComponent(
          'Artist Access Only! To maintain quality and fairness, only artists with tracks and an avatar can create accounts.'
        )}`
      );
    }

    const dbUser = await upsertSoundCloudUserInDb(scUser, tokens);
    const serialized = serializePrisma(dbUser);

    if (serialized.banned_at) {
      return NextResponse.redirect(
        `${appUrl}/?error=${encodeURIComponent(
          `Account suspended: ${serialized.ban_reason || 'Please contact support.'}`
        )}`
      );
    }

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
      followers_count: Number(scUser.followers_count || 0),
      repost_price: Math.max(1, Math.min(50, Math.ceil(Number(scUser.followers_count || 0) / 100))),
      guard: 'web',
    });

    return NextResponse.redirect(`${appUrl}/user/dashboard`);
  } catch (err) {
    console.error('SoundCloud OAuth callback error:', err);
    return NextResponse.redirect(
      `${appUrl}/?error=${encodeURIComponent('Failed to authenticate with SoundCloud. Please try again.')}`
    );
  }
}
