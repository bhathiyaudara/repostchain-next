import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import { FALLBACK_USER } from '@/lib/fallback-data';

const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'm.youtube.com',
  'music.youtube.com',
  'spotify.com',
  'open.spotify.com',
  'soundcloud.com',
  'm.soundcloud.com',
  'on.soundcloud.com',
];

function validateMessageLinks(body: string): string | null {
  const urlMatches = body.match(/((https?:\/\/)|(www\.))[^\s]+/gi);
  if (!urlMatches) return null;

  for (const rawUrl of urlMatches) {
    try {
      const normalized = rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`;
      const parsed = new URL(normalized);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      const isAllowed = ALLOWED_DOMAINS.some(
        (domain) => host === domain || host.endsWith(`.${domain}`)
      );
      if (!isAllowed) {
        return 'Only YouTube, Spotify, and SoundCloud links are allowed in chat.';
      }
    } catch {
      return 'That link could not be verified. Only YouTube, Spotify, and SoundCloud links are allowed.';
    }
  }
  return null;
}

const FALLBACK_CONVERSATIONS = [
  {
    id: 1,
    partner: {
      urn: 'soundcloud:users:11223344',
      name: 'Kaskade Lab',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      followers_count: 24500,
    },
    otherUser: {
      urn: 'soundcloud:users:11223344',
      name: 'Kaskade Lab',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      followers_count: 24500,
    },
    pinned: true,
    last_message_at: '2026-10-23T14:20:00.000Z',
    messages: [
      {
        id: 1001,
        sender_urn: 'soundcloud:users:11223344',
        body: 'Hey! Loved your latest Melodic Techno mix — just reposted it on our main channel: https://soundcloud.com/kaskadelab/melodic-pulse',
        created_at: '2026-10-23T14:15:00.000Z',
      },
      {
        id: 1002,
        sender_urn: 'soundcloud:users:98421034',
        body: 'Appreciate the support! Would you be down to exchange reposts on our Friday release?',
        created_at: '2026-10-23T14:18:00.000Z',
      },
      {
        id: 1003,
        sender_urn: 'soundcloud:users:11223344',
        body: '100% — send over the direct request whenever it goes live!',
        created_at: '2026-10-23T14:20:00.000Z',
      },
    ],
  },
  {
    id: 2,
    partner: {
      urn: 'soundcloud:users:55667788',
      name: 'Aether & Sol',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      followers_count: 11200,
    },
    otherUser: {
      urn: 'soundcloud:users:55667788',
      name: 'Aether & Sol',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      followers_count: 11200,
    },
    pinned: false,
    last_message_at: '2026-10-23T11:10:00.000Z',
    messages: [
      {
        id: 2001,
        sender_urn: 'soundcloud:users:55667788',
        body: 'Hi! Are you open to a vocal progressive house collab next month? Here is our Spotify profile: https://open.spotify.com/artist/aether-sol',
        created_at: '2026-10-23T11:10:00.000Z',
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);
  const conversationIdParam = searchParams.get('conversationId');

  try {
    const rawConversations = await prisma.conversation.findMany({
      where: {
        deleted_at: null,
        OR: [{ user_one_urn: user.urn }, { user_two_urn: user.urn }],
      },
      include: {
        messages: {
          where: { deleted_at: null },
          orderBy: { created_at: 'asc' },
          take: 50,
        },
      },
      orderBy: { last_message_at: 'desc' },
      take: 30,
    });

    const partnerUrns = Array.from(
      new Set(
        rawConversations.map((c) =>
          c.user_one_urn === user.urn ? c.user_two_urn : c.user_one_urn
        )
      )
    );

    const partners =
      partnerUrns.length > 0
        ? await prisma.user.findMany({
            where: { urn: { in: partnerUrns } },
            select: {
              urn: true,
              name: true,
              nickname: true,
              avatar: true,
              userInfo: { select: { followers_count: true } },
            },
          })
        : [];

    const partnerMap = new Map(
      partners.map((p) => [
        p.urn,
        {
          urn: p.urn,
          name: p.name,
          avatar: p.avatar,
          followers_count: Number(p.userInfo?.followers_count ?? 0),
        },
      ])
    );

    const conversations = rawConversations.map((c) => {
      const isUserOne = c.user_one_urn === user.urn;
      const partnerUrn = isUserOne ? c.user_two_urn : c.user_one_urn;
      const partner = partnerMap.get(partnerUrn) ?? {
        urn: partnerUrn,
        name: 'Artist',
        avatar: null,
        followers_count: 0,
      };
      const lastMsg = c.messages[c.messages.length - 1];
      return {
        id: Number(c.id),
        partner,
        otherUser: partner,
        lastMessage: lastMsg?.body || null,
        pinned: isUserOne ? c.pinned_by_one : c.pinned_by_two,
        last_message_at: c.last_message_at,
        messages: c.messages,
      };
    });

    const selectedConv =
      conversations.find((c) => String(c.id) === String(conversationIdParam)) ||
      conversations[0];

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        currentUserUrn: user.urn,
        conversations,
        messages: selectedConv ? selectedConv.messages : [],
      })
    );
  } catch {
    const selectedConv =
      FALLBACK_CONVERSATIONS.find((c) => String(c.id) === String(conversationIdParam)) ||
      FALLBACK_CONVERSATIONS[0];

    return NextResponse.json({
      dbConnected: false,
      currentUserUrn: user.urn,
      conversations: FALLBACK_CONVERSATIONS,
      messages: selectedConv ? selectedConv.messages : [],
    });
  }
}

export async function POST(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const { conversationId, partnerUrn } = body;
  const message = body.message || body.body;

  if (!message || !String(message).trim()) {
    return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
  }

  // Strict domain verification matching Laravel ChatService::validateContent
  const linkError = validateMessageLinks(String(message).trim());
  if (linkError) {
    return NextResponse.json({ error: linkError }, { status: 400 });
  }

  const now = new Date();

  try {
    let targetConvId = conversationId ? BigInt(conversationId) : null;

    if (!targetConvId && partnerUrn) {
      const [u1, u2] = [user.urn, String(partnerUrn)].sort();
      const existing = await prisma.conversation.findFirst({
        where: {
          OR: [
            { user_one_urn: u1, user_two_urn: u2 },
            { user_one_urn: u2, user_two_urn: u1 },
          ],
        },
      });

      if (existing) {
        targetConvId = existing.id;
      } else {
        const created = await prisma.conversation.create({
          data: {
            user_one_urn: u1,
            user_two_urn: u2,
            last_message_at: now,
            created_at: now,
            updated_at: now,
          },
        });
        targetConvId = created.id;
      }
    }

    if (!targetConvId) {
      return NextResponse.json({ error: 'Conversation target required' }, { status: 400 });
    }

    const [createdMessage] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversation_id: targetConvId,
          sender_urn: user.urn,
          body: String(message).trim(),
          created_at: now,
          updated_at: now,
        },
      }),
      prisma.conversation.update({
        where: { id: targetConvId },
        data: { last_message_at: now, updated_at: now },
      }),
    ]);

    return NextResponse.json(
      serializePrisma({
        success: true,
        message: createdMessage,
      })
    );
  } catch {
    return NextResponse.json({
      success: true,
      previewMode: true,
      message: {
        id: Date.now(),
        conversation_id: conversationId || 1,
        sender_urn: user.urn,
        body: String(message).trim(),
        created_at: now.toISOString(),
      },
    });
  }
}

export async function PATCH(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const { conversationId } = body;

  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
  }

  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: BigInt(conversationId) },
    });

    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const isUserOne = conv.user_one_urn === user.urn;
    const isUserTwo = conv.user_two_urn === user.urn;

    if (!isUserOne && !isUserTwo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updated = await prisma.conversation.update({
      where: { id: BigInt(conversationId) },
      data: isUserOne
        ? { pinned_by_one: !conv.pinned_by_one }
        : { pinned_by_two: !conv.pinned_by_two },
    });

    const isPinned = isUserOne ? updated.pinned_by_one : updated.pinned_by_two;

    return NextResponse.json({ success: true, pinned: isPinned });
  } catch {
    return NextResponse.json({ success: true, previewMode: true });
  }
}

export async function DELETE(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('messageId');

  if (!messageId) {
    return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
  }

  try {
    const msg = await prisma.message.findUnique({
      where: { id: BigInt(messageId) },
    });

    if (!msg || msg.sender_urn !== user.urn) {
      return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 403 });
    }

    await prisma.message.update({
      where: { id: BigInt(messageId) },
      data: { deleted_at: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, previewMode: true });
  }
}
