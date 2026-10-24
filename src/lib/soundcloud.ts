import { prisma } from './prisma';
import { USER_STATUS } from './constants';

const SOUNDCLOUD_AUTH_URL = 'https://secure.soundcloud.com/authorize';
const SOUNDCLOUD_TOKEN_URL = 'https://secure.soundcloud.com/oauth/token';
const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com';

export function getSoundCloudAuthorizeUrl(origin?: string, state = 'repostchain'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || 'http://localhost:3000';
  const redirectUri =
    process.env.SOUNDCLOUD_REDIRECT_URI || `${baseUrl.replace(/\/$/, '')}/auth/soundcloud/callback`;

  const params = new URLSearchParams({
    client_id: process.env.SOUNDCLOUD_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  });

  return `${SOUNDCLOUD_AUTH_URL}?${params.toString()}`;
}

export async function exchangeSoundCloudCode(code: string, origin?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || 'http://localhost:3000';
  const redirectUri =
    process.env.SOUNDCLOUD_REDIRECT_URI || `${baseUrl.replace(/\/$/, '')}/auth/soundcloud/callback`;

  const res = await fetch(SOUNDCLOUD_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json; charset=utf-8',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SOUNDCLOUD_CLIENT_ID || '',
      client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET || '',
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!res.ok) {
    throw new Error(`SoundCloud token exchange failed: ${res.status}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  }>;
}

export async function fetchSoundCloudMe(accessToken: string) {
  const res = await fetch(`${SOUNDCLOUD_API_URL}/me`, {
    headers: {
      Authorization: `OAuth ${accessToken}`,
      Accept: 'application/json; charset=utf-8',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch SoundCloud profile: ${res.status}`);
  }

  return res.json();
}

/**
 * Matches `SoundCloudController::findOrCreateUser` & `syncUserInformation`
 * Preserves existing user records by `soundcloud_id` / `urn` with zero data loss.
 */
export async function upsertSoundCloudUserInDb(
  scUser: Record<string, any>,
  tokens: { access_token: string; refresh_token?: string; expires_in?: number }
) {
  const scId = BigInt(scUser.id);
  const urn = String(scUser.urn || `soundcloud:users:${scUser.id}`);
  const now = new Date();

  const user = await prisma.user.upsert({
    where: { soundcloud_id: scId },
    update: {
      name: scUser.full_name || scUser.username || 'Artist',
      nickname: scUser.username || null,
      avatar: scUser.avatar_url || null,
      token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expires_in: tokens.expires_in ? BigInt(tokens.expires_in) : null,
      soundcloud_permalink_url: scUser.permalink_url || null,
      last_synced_at: now,
      last_seen_at: now,
      updated_at: now,
    },
    create: {
      soundcloud_id: scId,
      urn,
      name: scUser.full_name || scUser.username || 'Artist',
      nickname: scUser.username || null,
      avatar: scUser.avatar_url || null,
      token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expires_in: tokens.expires_in ? BigInt(tokens.expires_in) : null,
      soundcloud_permalink_url: scUser.permalink_url || null,
      status: USER_STATUS.ACTIVE,
      referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      last_synced_at: now,
      last_seen_at: now,
      created_at: now,
      updated_at: now,
    },
  });

  // Upsert `user_informations` table
  await prisma.userInformation.upsert({
    where: { user_urn: urn },
    update: {
      first_name: scUser.first_name || null,
      last_name: scUser.last_name || null,
      full_name: scUser.full_name || null,
      username: scUser.username || null,
      followers_count: BigInt(scUser.followers_count || 0),
      following_count: BigInt(scUser.followings_count || 0),
      track_count: BigInt(scUser.track_count || 0),
      playlist_count: BigInt(scUser.playlist_count || 0),
      reposts_count: BigInt(scUser.reposts_count || 0),
      updated_at: now,
    },
    create: {
      user_urn: urn,
      soundcloud_id: scId,
      soundcloud_urn: urn,
      soundcloud_kind: scUser.kind || 'user',
      soundcloud_permalink_url: scUser.permalink_url || `https://soundcloud.com/${scUser.permalink || scUser.id}`,
      soundcloud_permalink: scUser.permalink || String(scUser.id),
      soundcloud_uri: scUser.uri || `https://api.soundcloud.com/users/${scUser.id}`,
      soundcloud_created_at: scUser.created_at ? new Date(scUser.created_at) : now,
      first_name: scUser.first_name || null,
      last_name: scUser.last_name || null,
      full_name: scUser.full_name || null,
      username: scUser.username || null,
      country: scUser.country || null,
      city: scUser.city || null,
      description: scUser.description || null,
      plan: scUser.plan || 'Free',
      followers_count: BigInt(scUser.followers_count || 0),
      following_count: BigInt(scUser.followings_count || 0),
      track_count: BigInt(scUser.track_count || 0),
      playlist_count: BigInt(scUser.playlist_count || 0),
      reposts_count: BigInt(scUser.reposts_count || 0),
      created_at: now,
      updated_at: now,
    },
  });

  return user;
}

/**
 * Executes SoundCloud repost, like, comment, and follow actions in parallel where safe,
 * avoiding the sequential blocking bottleneck of the legacy PHP code.
 */
export async function performSoundCloudRepostActions(params: {
  accessToken: string;
  musicUrn: string;
  isPlaylist: boolean;
  ownerUrn: string;
  like: boolean;
  comment?: string;
  follow: boolean;
}) {
  const { accessToken, musicUrn, isPlaylist, ownerUrn, like, comment, follow } = params;
  const headers = {
    Authorization: `OAuth ${accessToken}`,
    Accept: 'application/json; charset=utf-8',
    'Content-Type': 'application/json',
  };

  const entityPath = isPlaylist ? 'playlists' : 'tracks';

  // 1. Perform Repost on SoundCloud
  const repostRes = await fetch(`${SOUNDCLOUD_API_URL}/reposts/${entityPath}/${musicUrn}`, {
    method: 'POST',
    headers,
  });

  if (!repostRes.ok) {
    throw new Error(`SoundCloud repost failed with status ${repostRes.status}`);
  }

  // 2. Run optional Like, Comment, and Follow concurrently (non-blocking)
  const [likeRes, commentRes, followRes] = await Promise.allSettled([
    like
      ? fetch(`${SOUNDCLOUD_API_URL}/likes/${entityPath}/${musicUrn}`, {
          method: 'POST',
          headers,
        })
      : Promise.resolve(null),
    comment && comment.trim().length > 0
      ? fetch(`${SOUNDCLOUD_API_URL}/${entityPath}/${musicUrn}/comments`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            comment: {
              body: comment.trim(),
              timestamp: Math.floor(Date.now() / 1000),
            },
          }),
        })
      : Promise.resolve(null),
    follow
      ? fetch(`${SOUNDCLOUD_API_URL}/me/followings/${ownerUrn}`, {
          method: 'PUT',
          headers,
        })
      : Promise.resolve(null),
  ]);

  return {
    reposted: true,
    liked: likeRes.status === 'fulfilled' && Boolean(likeRes.value?.ok),
    commented: commentRes.status === 'fulfilled' && Boolean(commentRes.value?.ok),
    followed: followRes.status === 'fulfilled' && Boolean(followRes.value?.ok),
  };
}
