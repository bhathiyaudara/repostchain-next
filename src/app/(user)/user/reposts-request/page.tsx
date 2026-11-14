'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  CheckCircle2,
  Music,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Inbox,
  Send,
  History,
  Check,
  AlertCircle,
  Clock,
  Ban,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { DashboardSummary } from '@/components/dashboard-summary';

function RepostChainMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 2l4 4-4 4M21 6H9a5 5 0 00-5 5v1M7 22l-4-4 4-4M3 18h12a5 5 0 005-5v-1"
        stroke="#FF5500"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CreditCoinIcon({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="24" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const ALL_GENRES = [
  'All Genres',
  'Electronic',
  'Hip-hop & Rap',
  'Pop',
  'House',
  'Techno',
  'Dance & EDM',
  'R&B & Soul',
  'Rock',
  'Trap',
  'Ambient',
  'Dubstep',
  'Future Bass',
];

interface RepostRequestItem {
  id: string | number;
  credits_spent: number;
  status: number;
  created_at?: string;
  description?: string;
  requester_urn?: string;
  target_user_urn?: string;
  requester?: {
    urn?: string;
    name?: string;
    nickname?: string;
    avatar?: string;
    soundcloud_permalink_url?: string;
  };
  targetUser?: {
    urn?: string;
    name?: string;
    nickname?: string;
    avatar?: string;
    soundcloud_permalink_url?: string;
  };
  music?: {
    id?: string | number;
    title?: string;
    genre?: string;
    artwork_url?: string;
    permalink_url?: string;
    author_username?: string;
  };
}

export default function RepostRequestsPage() {
  const queryClient = useQueryClient();

  // Navigation & Filter State
  const [activeMainTab, setActiveMainTab] = useState<
    'incoming_request' | 'outgoing_request' | 'previously_reposted'
  >('incoming_request');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'declined' | 'cancelled'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Dropdown UI states
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [openGenreDropdown, setOpenGenreDropdown] = useState(false);
  const [openArtistMenuId, setOpenArtistMenuId] = useState<string | number | null>(null);

  // Quick Tip & Responsive Sidebar State
  const [showStats, setShowStats] = useState(false);
  const [acceptingRequests, setAcceptingRequests] = useState(true);

  // Soundcloud Player 15-second tracking
  const [playingRequestId, setPlayingRequestId] = useState<string | number | null>(null);
  const [playTimes, setPlayTimes] = useState<Record<string, number>>({});

  // Favorites / Starred Creators
  const [starredUrns, setStarredUrns] = useState<Record<string, boolean>>({});

  // Inline Toast / Feedback Banner
  const [toastFeedback, setToastFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Load starred creators from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('starred_creators');
      if (stored) {
        setStarredUrns(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleStar = (urn?: string) => {
    if (!urn) return;
    setStarredUrns((prev) => {
      const updated = { ...prev, [urn]: !prev[urn] };
      try {
        localStorage.setItem('starred_creators', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['repost-requests', activeMainTab, statusFilter],
    queryFn: async () => {
      const direction = activeMainTab === 'outgoing_request' ? 'outgoing' : 'incoming';
      const params = new URLSearchParams();
      params.set('direction', direction);
      params.set('tab', activeMainTab);

      if (statusFilter !== 'all') {
        const map: Record<string, number> = {
          pending: 0,
          approved: 1,
          declined: 2,
          cancelled: 5,
        };
        if (map[statusFilter] !== undefined) {
          params.set('status', String(map[statusFilter]));
        }
      }

      const res = await fetch(`/api/user/repost-requests?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load requests');
      return res.json();
    },
  });

  const { data: dashData } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Action Mutation (confirm/repost, decline, cancel)
  const actionMutation = useMutation({
    mutationFn: async ({
      requestId,
      action,
      rejectionReason,
    }: {
      requestId: string | number;
      action: 'confirm' | 'decline' | 'cancel';
      rejectionReason?: string;
    }) => {
      const res = await fetch('/api/user/repost-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action, rejectionReason }),
      });
      if (!res.ok) throw new Error('Action failed');
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['repost-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-summary'] });

      const actionText =
        variables.action === 'confirm'
          ? 'Track successfully reposted! Credits added to your balance.'
          : variables.action === 'cancel'
          ? 'Request cancelled and credits refunded.'
          : 'Request declined.';

      setToastFeedback({
        type: 'success',
        text: data?.message || actionText,
      });

      setTimeout(() => setToastFeedback(null), 5000);
    },
    onError: () => {
      setToastFeedback({
        type: 'error',
        text: 'Action could not be completed. Please try again.',
      });
      setTimeout(() => setToastFeedback(null), 5000);
    },
  });

  const rawRequests: RepostRequestItem[] = data?.requests || [];
  const counts = data?.counts || {
    incoming: rawRequests.filter((r) => r.status === 0).length,
    outgoing: 1,
    previouslyReposted: rawRequests.filter((r) => r.status === 1).length,
  };

  // Filter requests by search and genre locally
  const filteredRequests = useMemo(() => {
    return rawRequests.filter((req) => {
      // Genre filter
      if (selectedGenre !== 'All Genres') {
        const itemGenre = req.music?.genre || '';
        if (!itemGenre.toLowerCase().includes(selectedGenre.toLowerCase())) {
          return false;
        }
      }

      // Search keyword
      if (search.trim()) {
        const query = search.toLowerCase();
        const titleMatch = req.music?.title?.toLowerCase().includes(query);
        const genreMatch = req.music?.genre?.toLowerCase().includes(query);
        const requesterMatch = req.requester?.name?.toLowerCase().includes(query);
        const targetMatch = req.targetUser?.name?.toLowerCase().includes(query);
        const descMatch = req.description?.toLowerCase().includes(query);

        if (!titleMatch && !genreMatch && !requesterMatch && !targetMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });
  }, [rawRequests, selectedGenre, search]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRequests.slice(start, start + perPage);
  }, [filteredRequests, page, perPage]);

  // Player toggle handler
  const togglePlay = (id: string | number) => {
    if (playingRequestId === id) {
      setPlayingRequestId(null);
    } else {
      setPlayingRequestId(id);
    }
  };

  const availableCredits = dashData?.kpis?.availableCredits ?? 250;
  const userRepostPrice = dashData?.user?.repost_price || 1;

  return (
    <div className="sc-dash space-y-6 max-w-7xl mx-auto pb-12">
      {/* SoundCloud Widget API Script for 15s play tracking */}
      <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />

      {/* ========================================================= */}
      {/* 1. EDITORIAL HERO SECTION (MATCHING CAMPAIGNS & DASHBOARD) */}
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
                  DIRECT REPOSTS
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-[#FF5500] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  COLLABORATION HUB
                </span>
              </div>

              <h1 className="sc-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.95]">
                REPOST REQUESTS
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Review incoming track requests from fellow artists, earn credits by reposting music to your SoundCloud profile, or manage your sent requests.
              </p>
            </div>

            {/* Quick Action Buttons matching Campaigns and Dashboard */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className="2xl:hidden sc-pill-dark px-5 py-3 text-xs sm:text-sm font-bold border border-white/15 hover:border-white/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <Link
                href="/user/members"
                className="sc-pill-white px-6 py-3 text-xs sm:text-sm font-bold shadow-xl shadow-white/5 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#FF5500]" />
                <span>Send a new request</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. UNDERLINE TABS (Light & Dark theme adaptability) */}
      {/* ========================================================= */}
      <div className="border-b border-gray-200 dark:border-white/[0.1] mb-5">
        <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('incoming_request');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeMainTab === 'incoming_request'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Requests</span>
            <span className="text-xs font-mono text-[#FF5500]">
              ({counts.incoming ?? 0})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('outgoing_request');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeMainTab === 'outgoing_request'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Outgoing Requests</span>
            <span className="text-xs font-mono text-[#FF5500]">
              ({counts.outgoing ?? 0})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('previously_reposted');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeMainTab === 'previously_reposted'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Previously Reposted</span>
            <span className="text-xs font-mono text-[#FF5500]">
              ({counts.previouslyReposted ?? 0})
            </span>
          </button>
        </nav>
      </div>

      {/* Optional Feedback Alert */}
      {toastFeedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold transition-all ${
            toastFeedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastFeedback.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toastFeedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastFeedback(null)}
            className="text-current opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile/Tablet Collapsible Dashboard Summary */}
      {showStats && (
        <div className="2xl:hidden mb-6">
          <DashboardSummary
            earnings={userRepostPrice}
            dailyRepostCurrent={Object.keys(playTimes).filter((k) => playTimes[k] >= 15).length}
            dailyRepostMax={20}
            responseRate={98}
            pendingRequests={counts.incoming ?? 2}
            requestLimit={25}
            credits={availableCredits}
            campaigns={dashData?.kpis?.activeCampaigns ?? 2}
            campaignLimit={10}
          />
        </div>
      )}

      {/* Quick Tip Editorial Card for Incoming Requests */}
      {activeMainTab === 'incoming_request' && (
        <div className="relative rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5500] font-bold">
                    PRO TIP • RESPONSE RATE
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    98% Response Rate
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                  Your response rate boosts your rank in the Members directory. Keep artists engaged by accepting or declining incoming requests within 24 hours.
                </p>
              </div>
            </div>

            {/* Accepting Requests Toggle */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5 shrink-0">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Accepting Requests
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={acceptingRequests}
                onClick={() => setAcceptingRequests(!acceptingRequests)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  acceptingRequests ? 'bg-[#10B981]' : 'bg-gray-300 dark:bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                    acceptingRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN SECTION (FEED + SIDEBAR) */}
      {/* ========================================================= */}
      <section className="flex flex-col 2xl:flex-row gap-6 items-start">
        {/* Left Column: Requests Feed */}
        <div className="w-full min-w-0 flex-1 space-y-4">
          {/* Filter Controls Bar (Search bar width aligned exactly with cards) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 relative z-30 pb-1">
            {/* Filter by status dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenStatusDropdown(!openStatusDropdown);
                  setOpenGenreDropdown(false);
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-gray-300 dark:border-white/10 bg-white hover:bg-gray-50 text-slate-700 dark:bg-[#181818] dark:hover:bg-[#202020] dark:text-white flex items-center justify-between gap-2.5 transition-all shadow-sm cursor-pointer"
              >
                <span className="text-slate-500 dark:text-zinc-400 truncate">Status /</span>
                <span className="text-[#FF5500] capitalize font-bold">
                  {statusFilter === 'all' ? 'All' : statusFilter}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
              </button>

              {openStatusDropdown && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 p-1.5 z-50">
                  {(['all', 'pending', 'approved', 'declined', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setStatusFilter(st);
                        setOpenStatusDropdown(false);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg capitalize flex items-center justify-between transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-[#FF5500] text-white font-bold'
                          : 'text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{st === 'all' ? 'All Statuses' : st}</span>
                      {statusFilter === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter by genre dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenGenreDropdown(!openGenreDropdown);
                  setOpenStatusDropdown(false);
                }}
                className={`w-full sm:w-auto px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-between sm:justify-start gap-2 transition-all shadow-sm cursor-pointer ${
                  selectedGenre !== 'All Genres'
                    ? 'bg-orange-50 dark:bg-[#FF5500]/15 border border-orange-300 dark:border-[#FF5500]/50 text-[#FF5500]'
                    : 'border border-gray-300 dark:border-white/10 bg-white hover:bg-gray-50 text-slate-700 dark:bg-[#181818] dark:hover:bg-[#202020] dark:text-white'
                }`}
              >
                <Music className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span className="truncate">
                  {selectedGenre === 'All Genres' ? 'All Genres' : selectedGenre}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
              </button>

              {openGenreDropdown && (
                <div className="absolute left-0 sm:left-auto mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl shadow-2xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 p-3.5 max-h-96 overflow-y-auto z-50">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-200 dark:border-white/[0.08]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
                      SELECT GENRE
                    </span>
                    {selectedGenre !== 'All Genres' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGenre('All Genres');
                          setPage(1);
                        }}
                        className="text-xs font-bold text-[#FF5500] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_GENRES.map((g) => {
                      const isSelected = selectedGenre === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setSelectedGenre(g);
                            setOpenGenreDropdown(false);
                            setPage(1);
                          }}
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30'
                              : 'bg-gray-100 dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-white/[0.12] border border-gray-200 dark:border-white/5'
                          }`}
                        >
                          <span>{g}</span>
                          {isSelected && g !== 'All Genres' && (
                            <CheckCircle2 className="w-3 h-3 ml-1.5 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Search tags input (Extends across remaining row to card end point) */}
            <div className="relative flex-1 w-full min-w-0">
              <div className="relative flex items-center bg-white dark:bg-[#181818] border border-gray-300 dark:border-white/10 focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/20 rounded-full transition-all shadow-sm">
                <Search className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by artist, track title, or tags..."
                  className="w-full py-2 pl-10 pr-8 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-transparent border-0 rounded-full focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="absolute right-3 text-slate-400 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Request Cards Feed List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : paginatedRequests.length > 0 ? (
            paginatedRequests.map((req) => {
              const playSec = playTimes[String(req.id)] || 0;
              const playPct = Math.min(100, (playSec / 15) * 100);
              const isEligible = playSec >= 15;
              const isApproved = req.status === 1;
              const isDeclined = req.status === 2;
              const isExpired = req.status === 3;
              const isCancelled = req.status === 5;
              const isPending = req.status === 0;

              // Requester info vs Target User info
              const displayUser =
                activeMainTab === 'outgoing_request' ? req.targetUser : req.requester;
              const artistUrn = displayUser?.urn || String(req.id);
              const isStarred = !!starredUrns[artistUrn];
              const isArtistMenuOpen = openArtistMenuId === req.id;

              return (
                <div
                  key={req.id}
                  className="campaign-card relative rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="rounded-[15px] overflow-hidden flex flex-col lg:flex-row relative">
                    {/* Left Column: Authentic SoundCloud Player (Height 166px) */}
                    <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-black relative flex flex-col justify-center min-h-[166px] lg:h-[166px] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/[0.08]">
                      <SoundCloudPlayer
                        track={req.music}
                        height={166}
                        visual={false}
                        className="w-full h-full border-none rounded-none overflow-hidden"
                        isPlaying={playingRequestId === req.id}
                        playSeconds={playSec}
                        onTogglePlay={() => togglePlay(req.id)}
                        onProgress={(sec) => {
                          setPlayTimes((prev) => ({
                            ...prev,
                            [String(req.id)]: Math.min(15, sec),
                          }));
                        }}
                        onEligible={() => {
                          setPlayTimes((prev) => ({
                            ...prev,
                            [String(req.id)]: 15,
                          }));
                        }}
                      />

                      {/* Floating Status Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none z-10">
                        {isPending && (
                          <div className="bg-amber-500/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1 backdrop-blur-sm">
                            <Clock className="w-3 h-3 fill-white" />
                            <span>PENDING</span>
                          </div>
                        )}
                        {isApproved && (
                          <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 fill-white" />
                            <span>APPROVED</span>
                          </div>
                        )}
                        {isDeclined && (
                          <div className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            <span>DECLINED</span>
                          </div>
                        )}
                        {isCancelled && (
                          <div className="bg-slate-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            <span>CANCELLED</span>
                          </div>
                        )}
                        {isExpired && (
                          <div className="bg-gray-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>EXPIRED</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Request Info (Sized exactly to match SoundCloud player height: 166px) */}
                    <div className="w-full lg:w-1/2 p-4 lg:p-5 flex flex-col justify-between min-h-[166px] lg:h-[166px] gap-2">
                      {/* Top Line: Avatar + User Info + Credits */}
                      <div className="flex items-start justify-between gap-3">
                        {/* User Profile Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            className="w-12 h-12 lg:w-13.5 lg:h-13.5 rounded-full object-cover ring-2 ring-gray-100 dark:ring-white/10 shrink-0"
                            src={displayUser?.avatar || '/default_img/no_img.jpg'}
                            alt={displayUser?.name || 'Artist'}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                            }}
                          />

                          <div className="min-w-0 relative">
                            <div
                              onClick={() =>
                                setOpenArtistMenuId(isArtistMenuOpen ? null : req.id)
                              }
                              className="flex items-center gap-1 cursor-pointer group/name"
                            >
                              <span className="text-slate-900 dark:text-white group-hover/name:text-[#FF5500] font-bold text-sm sm:text-base truncate transition-colors">
                                {displayUser?.name ||
                                  req.music?.author_username ||
                                  'SoundCloud Artist'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 group-hover/name:text-[#FF5500] transition-colors shrink-0" />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleStar(artistUrn)}
                              className="cursor-pointer mt-0.5 flex items-center gap-1.5"
                              title={isStarred ? 'Unstar creator' : 'Star creator'}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  isStarred
                                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                                    : 'text-gray-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                                }`}
                              />
                              <span className="text-[10px] font-mono text-gray-500 dark:text-zinc-500 uppercase font-bold">
                                {activeMainTab === 'outgoing_request' ? 'TARGETED ARTIST' : 'REQUESTER'}
                              </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isArtistMenuOpen && (
                              <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-1.5 z-40">
                                {displayUser?.soundcloud_permalink_url && (
                                  <a
                                    href={displayUser.soundcloud_permalink_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded-lg transition-colors"
                                  >
                                    <span>Visit SoundCloud Profile</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                                  </a>
                                )}
                                <Link
                                  href="/user/members"
                                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded-lg transition-colors"
                                >
                                  <span>View RepostChain Profile</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Credits Counter */}
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1.5 text-[#FF5500]">
                            <CreditCoinIcon className="w-5 h-3.5 shrink-0 text-[#FF5500]" />
                            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                              {req.credits_spent ?? 1}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mt-0.5">
                            {activeMainTab === 'outgoing_request' ? 'OFFERED' : 'CREDITS'}
                          </span>
                        </div>
                      </div>

                      {/* Middle Line: Note or Created Date */}
                      {req.description ? (
                        <p className="text-xs text-slate-600 dark:text-zinc-300 italic line-clamp-1 bg-gray-50 dark:bg-white/[0.04] px-2.5 py-1 rounded-lg border border-gray-100 dark:border-white/5">
                          &ldquo;{req.description}&rdquo;
                        </p>
                      ) : (
                        <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#FF5500]" />
                          <span>
                            {req.created_at
                              ? new Date(req.created_at).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recent Direct Request'}
                          </span>
                        </div>
                      )}

                      {/* Bottom Line: Genre Badge + Dynamic Action Buttons */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 truncate max-w-[150px] sm:max-w-none">
                          <Music className="w-3 h-3 text-[#FF5500] shrink-0" />
                          <span className="truncate">{req.music?.genre || 'All Genres'}</span>
                        </span>

                        {/* Interactive Buttons per Tab */}
                        <div className="flex items-center gap-2">
                          {/* INCOMING REQUESTS ACTIONS */}
                          {activeMainTab === 'incoming_request' && (
                            <>
                              {isPending ? (
                                <>
                                  {/* Decline Button */}
                                  <button
                                    type="button"
                                    disabled={actionMutation.isPending}
                                    onClick={() =>
                                      actionMutation.mutate({
                                        requestId: req.id,
                                        action: 'decline',
                                      })
                                    }
                                    className="px-3.5 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-gray-300 dark:border-white/10 transition-all cursor-pointer"
                                  >
                                    Decline
                                  </button>

                                  {/* Repost Button Container with 15s fill animation */}
                                  <div className="relative">
                                    {/* Countdown Tooltip */}
                                    {!isEligible && playSec > 0 && (
                                      <div className="absolute -top-10 right-0 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-30 pointer-events-none">
                                        <span>{Math.max(0, Math.ceil(15 - playSec))}s remaining</span>
                                        <div className="absolute top-full right-4 -mt-px">
                                          <div className="border-4 border-transparent border-t-slate-900" />
                                        </div>
                                      </div>
                                    )}

                                    {/* Ready Tooltip */}
                                    {isEligible && (
                                      <div className="absolute -top-10 right-0 bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-30 pointer-events-none animate-pulse">
                                        <div className="flex items-center gap-1.5">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>Ready ✓</span>
                                        </div>
                                        <div className="absolute top-full right-4 -mt-px">
                                          <div className="border-4 border-transparent border-t-emerald-600" />
                                        </div>
                                      </div>
                                    )}

                                    {/* Repost Button with Internal Animated Fill */}
                                    <button
                                      type="button"
                                      disabled={!isEligible || actionMutation.isPending}
                                      onClick={() =>
                                        actionMutation.mutate({
                                          requestId: req.id,
                                          action: 'confirm',
                                        })
                                      }
                                      className={`repost-button relative overflow-hidden flex items-center justify-center gap-2 py-2 px-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                        isEligible
                                          ? 'bg-[#FF5500] hover:bg-[#ff6a1a] text-white shadow-lg shadow-[#FF5500]/30 hover:scale-[1.02] active:scale-95'
                                          : 'bg-gray-200 dark:bg-white/[0.08] text-slate-500 dark:text-zinc-400 border border-gray-300 dark:border-white/10 !cursor-not-allowed'
                                      }`}
                                    >
                                      {/* Animated fill background inside button */}
                                      {!isEligible && playSec > 0 && (
                                        <div
                                          className="absolute inset-0 bg-gradient-to-r from-[#FF5500] to-[#FF7730] transition-all duration-300 ease-out z-0 pointer-events-none opacity-90 rounded-full"
                                          style={{ width: `${playPct}%` }}
                                        />
                                      )}

                                      <span className="relative z-10 flex items-center gap-2">
                                        {actionMutation.isPending ? (
                                          <span>Reposting...</span>
                                        ) : (
                                          <>
                                            <CreditCoinIcon
                                              className={`w-5 h-3.5 ${
                                                isEligible || playSec > 0
                                                  ? 'text-white'
                                                  : 'text-slate-500 dark:text-zinc-400'
                                              }`}
                                            />
                                            <span
                                              className={
                                                isEligible || playSec > 0
                                                  ? 'text-white font-bold'
                                                  : ''
                                              }
                                            >
                                              +{req.credits_spent ?? 1} Repost
                                            </span>
                                          </>
                                        )}
                                      </span>
                                    </button>
                                  </div>
                                </>
                              ) : isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Reposted</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/[0.06] text-slate-500 dark:text-zinc-400">
                                  Declined
                                </span>
                              )}
                            </>
                          )}

                          {/* OUTGOING REQUESTS ACTIONS */}
                          {activeMainTab === 'outgoing_request' && (
                            <>
                              {isPending ? (
                                <button
                                  type="button"
                                  disabled={actionMutation.isPending}
                                  onClick={() =>
                                    actionMutation.mutate({
                                      requestId: req.id,
                                      action: 'cancel',
                                    })
                                  }
                                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-300 dark:border-white/10 transition-all cursor-pointer"
                                >
                                  {actionMutation.isPending ? 'Cancelling...' : 'Cancel Request'}
                                </button>
                              ) : isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Accepted</span>
                                </span>
                              ) : isCancelled ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/[0.06] text-slate-500 dark:text-zinc-400">
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                  Declined
                                </span>
                              )}
                            </>
                          )}

                          {/* PREVIOUSLY REPOSTED */}
                          {activeMainTab === 'previously_reposted' && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reposted</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] shadow-sm">
              <div className="p-8">
                <Music className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="sc-display text-xl font-black text-slate-900 dark:text-white tracking-wide">
                  NO REPOST REQUESTS FOUND
                </h3>
                <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                  {activeMainTab === 'incoming_request'
                    ? "You don't have any incoming requests matching your selected filters. Explore the Members directory to connect with creators!"
                    : activeMainTab === 'outgoing_request'
                    ? "You haven't sent any requests matching your filters yet. Connect with verified artists to get your tracks reposted."
                    : 'No previously reposted tracks found for this view.'}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {(selectedGenre !== 'All Genres' || search || statusFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGenre('All Genres');
                        setSearch('');
                        setStatusFilter('all');
                        setPage(1);
                      }}
                      className="px-6 py-2.5 text-xs font-bold rounded-full border border-gray-300 dark:border-white/15 bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:text-white cursor-pointer shadow-sm transition-all"
                    >
                      Reset All Filters
                    </button>
                  )}
                  <Link
                    href="/user/members"
                    className="sc-pill-orange px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF5500]/25 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Send a new request</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Editorial Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-white/[0.08] mt-6 pt-4 gap-3">
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                SHOWING <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * perPage + 1}</span> TO{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {Math.min(page * perPage, filteredRequests.length)}
                </span>{' '}
                OF <span className="font-bold text-slate-900 dark:text-white">{filteredRequests.length}</span> REQUESTS
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, index, array) => {
                    const prev = array[index - 1];
                    return (
                      <span key={p} className="flex items-center">
                        {prev && p - prev > 1 && (
                          <span className="px-2 text-xs font-mono text-gray-400 dark:text-zinc-500">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                            page === p
                              ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30'
                              : 'bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.12]'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Desktop Dashboard Summary Sidebar (Light & Dark theme adaptability) */}
        <div className="w-full 2xl:max-w-[360px] 3xl:max-w-[380px] hidden 2xl:block shrink-0">
          <DashboardSummary
            earnings={userRepostPrice}
            dailyRepostCurrent={Object.keys(playTimes).filter((k) => playTimes[k] >= 15).length}
            dailyRepostMax={20}
            responseRate={98}
            pendingRequests={counts.incoming ?? 2}
            requestLimit={25}
            credits={availableCredits}
            campaigns={dashData?.kpis?.activeCampaigns ?? 2}
            campaignLimit={10}
          />
        </div>
      </section>
    </div>
  );
}
