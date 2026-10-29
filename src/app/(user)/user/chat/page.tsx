'use client';

import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Send,
  Star,
  Trash2,
  Search,
  ExternalLink,
  AlertTriangle,
  Radio,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { RepostChainMark, SoundCloudMark } from '@/components/public-layout';

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

function validateLink(body: string): string | null {
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

function renderMessageBody(text: string) {
  const urlRegex = /((https?:\/\/)|(www\.))[^\s]+/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const start = match.index;
    const end = urlRegex.lastIndex;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    const rawUrl = match[0];
    const href = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const isSoundCloud = rawUrl.includes('soundcloud.com');
    const isSpotify = rawUrl.includes('spotify.com');
    const isYouTube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');

    parts.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all mx-1 ${
          isSoundCloud
            ? 'text-white hover:text-white/90 bg-black/30 px-2 py-0.5 rounded'
            : isSpotify
            ? 'text-[#1DB954] hover:underline'
            : isYouTube
            ? 'text-red-400 hover:underline'
            : 'text-zinc-300 hover:text-white'
        }`}
      >
        <span>{rawUrl}</span>
        <ExternalLink className="w-3 h-3 inline shrink-0" />
      </a>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function CollabChatContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startUrn = searchParams.get('partner') || searchParams.get('startUrn') || null;
  const queryConvId = searchParams.get('conversationId') || null;

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pinned'>('all');
  const [newMessage, setNewMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: convData, isLoading: isConvLoading } = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async () => {
      const res = await fetch('/api/user/chat');
      if (!res.ok) throw new Error('Failed to load conversations');
      return res.json();
    },
  });

  const currentUserUrn = convData?.currentUserUrn || 'soundcloud:users:999001';
  const conversations = convData?.conversations || [];

  // Determine active conversation ID
  const activeConversationId = useMemo(() => {
    if (selectedConversationId) return selectedConversationId;
    if (queryConvId) return queryConvId;
    if (startUrn) {
      const match = conversations.find(
        (c: { partner?: { urn?: string } }) => c.partner?.urn === startUrn
      );
      if (match) return String(match.id);
    }
    return conversations[0]?.id ? String(conversations[0].id) : null;
  }, [selectedConversationId, queryConvId, startUrn, conversations]);

  const activeConversation = useMemo(() => {
    return conversations.find(
      (c: { id: string | number }) => String(c.id) === String(activeConversationId)
    );
  }, [conversations, activeConversationId]);

  const { data: msgData, isLoading: isMsgLoading } = useQuery({
    queryKey: ['chat-messages', activeConversationId],
    enabled: !!activeConversationId,
    queryFn: async () => {
      const res = await fetch(`/api/user/chat?conversationId=${activeConversationId}`);
      if (!res.ok) throw new Error('Failed to load messages');
      return res.json();
    },
    refetchInterval: 5000,
  });

  const messages = msgData?.messages || activeConversation?.messages || [];

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      setErrorMessage(null);
      const validationErr = validateLink(text);
      if (validationErr) {
        throw new Error(validationErr);
      }

      const res = await fetch('/api/user/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          partnerUrn: activeConversation?.partner?.urn || startUrn,
          body: text,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send message');
      return json;
    },
    onSuccess: () => {
      setNewMessage('');
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ['chat-messages', activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
    },
  });

  // Toggle pin mutation
  const togglePinMutation = useMutation({
    mutationFn: async () => {
      if (!activeConversationId) return;
      const res = await fetch('/api/user/chat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversationId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string | number) => {
      const res = await fetch(`/api/user/chat?messageId=${messageId}`, {
        method: 'DELETE',
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations
      .filter((c: { partner?: { name?: string }; otherUser?: { name?: string }; pinned?: boolean }) => {
        const name = (c.partner?.name || c.otherUser?.name || '').toLowerCase();
        const matchesSearch = name.includes(searchQuery.toLowerCase());
        const matchesPin = filterMode === 'all' || (filterMode === 'pinned' && c.pinned);
        return matchesSearch && matchesPin;
      })
      .sort((a: { pinned?: boolean; last_message_at?: string }, b: { pinned?: boolean; last_message_at?: string }) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return timeB - timeA;
      });
  }, [conversations, searchQuery, filterMode]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendMutation.isPending) return;
    sendMutation.mutate(newMessage.trim());
  };

  const handleQuickPrompt = (prompt: string) => {
    setNewMessage(prompt);
  };

  return (
    <div className="sc-dash space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================= */}
      {/* 1. EDITORIAL HEADER & WELCOME STRIP */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-[1px] shadow-2xl">
        <div className="rounded-[23px] bg-[#121212] p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF5500]/15 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Official Rounded Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-3.5 backdrop-blur-sm">
                <RepostChainMark className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(255,85,0,0.4)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                  CREATOR COLLABORATION
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-[#FF5500] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  LIVE NETWORK
                </span>
              </div>

              {/* Bold All-Caps Display Headline */}
              <h1 className="sc-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">
                COLLAB CHAT
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Connect directly with fellow SoundCloud artists for track feedback, repost swaps, and collaborative projects.
              </p>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/user/members"
                className="sc-pill-dark px-5 py-3 text-xs sm:text-sm font-bold border border-white/15 hover:border-white/40 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#FF5500]" />
                <span>Browse Artists</span>
              </Link>

              <Link
                href="/user/campaign-management/campaigns"
                className="sc-pill-white px-6 py-3 text-xs sm:text-sm font-bold shadow-xl shadow-white/5 flex items-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>Campaign Feed</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN COLLAB CHAT TWO-PANEL INTERFACE */}
      {/* ========================================================= */}
      {conversations.length === 0 && !isConvLoading ? (
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-2xl">
          <div className="rounded-[23px] bg-[#121212] flex flex-col items-center justify-center text-center px-6 py-20 sm:py-24 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-72 h-72 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            <h2 className="sc-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              NO ACTIVE CONVERSATIONS YET
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mt-2 leading-relaxed">
              Just chat for collaboration and music knowledge sharing — no external links. Only SoundCloud, Spotify, and YouTube links allowed.
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Visit an artist&apos;s profile or catalogue and hit &ldquo;Send Message&rdquo; to start one.
            </p>

            <div className="mt-7">
              <Link
                href="/user/members"
                className="sc-pill-orange px-6 py-3 text-xs sm:text-sm font-bold tracking-tight inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF5500]/25"
              >
                <Users className="w-4 h-4" />
                <span>Explore Verified Artists</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-2xl overflow-hidden">
          <div className="rounded-[23px] bg-[#121212] flex flex-col md:flex-row h-[760px] max-h-[82vh] min-h-[580px] overflow-hidden">
            {/* ---------------------------------------------------- */}
            {/* LEFT COLUMN: CONVERSATION LIST */}
            {/* ---------------------------------------------------- */}
            <div className="w-full md:w-[340px] lg:w-[380px] border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#151515] flex flex-col shrink-0">
              {/* Search & Header Strip */}
              <div className="p-4 border-b border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF5500]">
                      ARTIST THREADS
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 font-mono text-[10px] font-bold">
                      {filteredConversations.length}
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFilterMode('all')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        filterMode === 'all'
                          ? 'bg-white text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('pinned')}
                      className={`px-2 py-1 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        filterMode === 'pinned'
                          ? 'bg-[#FF5500] text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>Pinned</span>
                    </button>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artist name..."
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#FF5500] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversations Scrollable List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] divide-solid">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(
                    (c: {
                      id: string | number;
                      partner?: { name?: string; avatar?: string; followers_count?: number };
                      otherUser?: { name?: string; avatar?: string; followers_count?: number };
                      lastMessage?: string;
                      last_message_at?: string;
                      pinned?: boolean;
                    }) => {
                      const isSelected = String(activeConversationId) === String(c.id);
                      const partner = c.partner || c.otherUser;
                      const partnerName = partner?.name || 'SoundCloud Artist';

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedConversationId(String(c.id))}
                          className={`w-full text-left p-4 flex items-center gap-3 transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-white/[0.07] border-l-3 border-[#FF5500]'
                              : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          {/* Avatar with Status Ring */}
                          <div className="relative shrink-0">
                            <img
                              src={partner?.avatar || '/default_img/avatar_2.jpg'}
                              alt={partnerName}
                              className="w-11 h-11 rounded-full object-cover border border-white/10 group-hover:border-[#FF5500]/50 transition-colors"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/default_img/avatar_2.jpg';
                              }}
                            />
                            {c.pinned && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5500] text-white flex items-center justify-center shadow">
                                <Star className="w-2.5 h-2.5 fill-current" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                                  isSelected ? 'text-[#FF5500]' : 'text-white group-hover:text-zinc-200'
                                }`}
                              >
                                {partnerName}
                              </span>
                              {c.last_message_at && (
                                <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                                  {new Date(c.last_message_at).toLocaleDateString([], {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300">
                              {c.lastMessage || 'Say hi 👋'}
                            </p>
                          </div>
                        </button>
                      );
                    }
                  )
                ) : (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    {searchQuery ? 'No artist matching search' : 'No conversations in this filter'}
                  </div>
                )}
              </div>

              {/* Bottom Quick Directory Helper */}
              <div className="p-3 border-t border-white/[0.08] bg-white/[0.01]">
                <Link
                  href="/user/members"
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Find New Artists</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Directory →</span>
                </Link>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT COLUMN: ACTIVE CONVERSATION THREAD */}
            {/* ---------------------------------------------------- */}
            <div className="flex-1 flex flex-col bg-[#121212] min-h-0">
              {activeConversation ? (
                <>
                  {/* Thread Top Bar */}
                  <div className="p-4 border-b border-white/[0.08] bg-[#141414] flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={activeConversation.partner?.avatar || '/default_img/avatar_2.jpg'}
                        alt={activeConversation.partner?.name || 'Artist'}
                        className="w-10 h-10 rounded-full object-cover border border-[#FF5500]/40 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/default_img/avatar_2.jpg';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm sm:text-base font-bold text-white truncate">
                            {activeConversation.partner?.name || 'SoundCloud Artist'}
                          </h2>
                          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase">
                            <SoundCloudMark className="w-3 h-3" />
                            ARTIST
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {activeConversation.partner?.followers_count
                            ? `${activeConversation.partner.followers_count.toLocaleString()} followers`
                            : 'Verified Collab Network Member'}
                        </p>
                      </div>
                    </div>

                    {/* Thread Header Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePinMutation.mutate()}
                        title={activeConversation.pinned ? 'Unpin conversation' : 'Pin conversation'}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          activeConversation.pinned
                            ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${activeConversation.pinned ? 'fill-current' : ''}`} />
                      </button>

                      <Link
                        href="/user/members"
                        className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold border border-white/10 transition-colors"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </Link>
                    </div>
                  </div>

                  {/* Thread Policy Banner Strip */}
                  <div className="px-4 py-2 border-b border-white/[0.04] bg-[#FF5500]/5 flex items-center justify-between gap-2 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                      <span>Allowed Links: <strong>SoundCloud</strong>, <strong>Spotify</strong>, and <strong>YouTube</strong> only.</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">Anti-Spam Protected</span>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
                    {messages.length > 0 ? (
                      messages.map(
                        (
                          m: {
                            id: string | number;
                            sender_urn: string;
                            body: string;
                            created_at?: string;
                            timestamp?: string;
                            isMine?: boolean;
                          },
                          idx: number
                        ) => {
                          const isMine =
                            m.isMine ??
                            (m.sender_urn === currentUserUrn ||
                              m.sender_urn === 'soundcloud:users:999001' ||
                              m.sender_urn === 'soundcloud:users:98421034');

                          return (
                            <div
                              key={m.id || idx}
                              className={`flex ${isMine ? 'justify-end' : 'justify-start'} group py-0.5`}
                            >
                              <div
                                className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${
                                  isMine ? 'flex-row-reverse' : 'flex-row'
                                }`}
                              >
                                {isMine && (
                                  <button
                                    type="button"
                                    onClick={() => deleteMessageMutation.mutate(m.id)}
                                    title="Delete message"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <div
                                  className={`rounded-2xl px-4 py-3 shadow-md ${
                                    isMine
                                      ? 'bg-gradient-to-r from-[#FF5500] to-[#FF6611] text-white rounded-br-xs shadow-[#FF5500]/15'
                                      : 'bg-white/[0.05] border border-white/10 text-zinc-100 rounded-bl-xs'
                                  }`}
                                >
                                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {renderMessageBody(m.body)}
                                  </div>

                                  <div
                                    className={`text-[10px] font-mono mt-1.5 ${
                                      isMine ? 'text-white/70 text-right' : 'text-zinc-500 text-left'
                                    }`}
                                  >
                                    {m.timestamp ||
                                      (m.created_at
                                        ? new Date(m.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })
                                        : 'Just now')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                        <div className="w-14 h-14 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] mb-3">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="sc-display text-xl font-bold text-white mb-1">
                          SAY HI TO {activeConversation.partner?.name?.toUpperCase() || 'THE ARTIST'}
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-sm mb-5 leading-relaxed">
                          Start the collaboration by sending a message or pasting a track link from SoundCloud, Spotify, or YouTube.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {[
                            'Hey! Would love feedback on my new track 🎵',
                            'Are you down to swap reposts this week? 🔁',
                            'Loved your latest mix, open to collaborating? 🎹',
                          ].map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => handleQuickPrompt(prompt)}
                              className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Box & Allowed Links Area */}
                  <div className="p-4 border-t border-white/[0.08] bg-[#141414]">
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{errorMessage}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="text-red-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message or paste a SoundCloud / Spotify / YouTube link..."
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#FF5500] rounded-full px-5 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all pr-10"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sendMutation.isPending}
                        className="w-11 h-11 rounded-full bg-[#FF5500] hover:bg-[#FF6611] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5500]/25 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-zinc-500">
                      <div className="flex items-center gap-2">
                        <span>Permitted:</span>
                        <span className="text-zinc-400 font-semibold flex items-center gap-1">
                          <SoundCloudMark className="w-3 h-3 text-[#FF5500]" /> SoundCloud
                        </span>
                        <span>•</span>
                        <span className="text-[#1DB954] font-semibold">Spotify</span>
                        <span>•</span>
                        <span className="text-red-500 font-semibold">YouTube</span>
                      </div>
                      <span className="font-mono text-[10px]">Press Enter to send</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500">
                  <MessageSquare className="w-10 h-10 text-zinc-600 mb-2" />
                  <p className="text-sm font-semibold text-zinc-400">Select a conversation to start chatting</p>
                  <p className="text-xs text-zinc-600 mt-1">Choose an artist from the left list or search by name</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollabChatPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse max-w-7xl mx-auto p-4">
          <div className="h-28 bg-white/[0.04] rounded-3xl" />
          <div className="h-[600px] bg-white/[0.04] rounded-3xl" />
        </div>
      }
    >
      <CollabChatContent />
    </Suspense>
  );
}
