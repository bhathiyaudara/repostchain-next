'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  Music,
  ExternalLink,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { DashboardSummary } from '@/components/dashboard-summary';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { RepostChainMark } from '@/components/public-layout';

function CreditCoinIcon({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1"
        y="1"
        width="24"
        height="16"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="8"
        cy="9"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

const ALL_GENRES = [
  'All Genres',
  'Electronic',
  'Melodic Techno',
  'Deep House',
  'Hip-Hop & Rap',
  'Tech House',
  'Pop',
  'Drum & Bass',
  'Trap',
  'Progressive House',
  'Ambient',
  'Future Bass',
  'House',
  'R&B',
  'Rock',
];

export default function CampaignsFeedPage() {
  const queryClient = useQueryClient();
  const [activeMainTab, setActiveMainTab] = useState<'recommended_pro' | 'recommended' | 'all'>('recommended_pro');
  const [trackType, setTrackType] = useState<'all' | 'track' | 'playlist'>('all');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showStats, setShowStats] = useState(false);
  const [openTrackTypeDropdown, setOpenTrackTypeDropdown] = useState(false);
  const [openGenreDropdown, setOpenGenreDropdown] = useState(false);
  const [playingCampaignId, setPlayingCampaignId] = useState<string | null>(null);
  const [playTimes, setPlayTimes] = useState<Record<string, number>>({});
  const [repostedIds, setRepostedIds] = useState<Record<string, boolean>>({});
  const [starredUrns, setStarredUrns] = useState<Record<string, boolean>>({});
  const [openArtistMenuId, setOpenArtistMenuId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch campaigns feed
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns-feed', activeMainTab, trackType, selectedGenres, search, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set(
        'tab',
        activeMainTab === 'recommended_pro' ? 'recommendedPro' : activeMainTab
      );
      if (trackType !== 'all') params.set('trackType', trackType);
      if (selectedGenres.length > 0) params.set('genre', selectedGenres.join(','));
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('perPage', '12');

      const res = await fetch(`/api/user/campaigns?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load campaigns');
      return res.json();
    },
  });

  // Fetch user dashboard data
  const { data: dashData } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  // 15-second playback timer for active track
  useEffect(() => {
    if (!playingCampaignId) return;
    const interval = setInterval(() => {
      setPlayTimes((prev) => {
        const nextVal = Math.min(15, (prev[playingCampaignId] || 0) + 1);
        return { ...prev, [playingCampaignId]: nextVal };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playingCampaignId]);

  // Sync already reposted IDs from feed query
  useEffect(() => {
    if (data?.campaigns) {
      const initialReposts: Record<string, boolean> = {};
      data.campaigns.forEach((c: { id: string | number; alreadyReposted?: boolean }) => {
        if (c.alreadyReposted) {
          initialReposts[String(c.id)] = true;
        }
      });
      setRepostedIds((prev) => ({ ...initialReposts, ...prev }));
    }
  }, [data]);

  // Handle genre toggle
  const toggleGenre = (genre: string) => {
    if (genre === 'All Genres') {
      setSelectedGenres([]);
      setPage(1);
      return;
    }
    setSelectedGenres((prev) => {
      const exists = prev.includes(genre);
      const updated = exists ? prev.filter((g) => g !== genre) : [...prev, genre];
      return updated;
    });
    setPage(1);
  };

  // Repost mutation
  const repostMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      // 1. Notify playback threshold
      await fetch('/api/user/playback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: campaignId,
          targetType: 'campaign',
          actualPlayTime: 15,
          action: 'eligible',
        }),
      });

      // 2. Perform database repost & credit earning
      const res = await fetch('/api/user/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'repost',
          campaignId,
          liked: true,
          comment: '',
          followed: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to repost campaign');
      }
      return campaignId;
    },
    onSuccess: (campaignId) => {
      setRepostedIds((prev) => ({ ...prev, [campaignId]: true }));
      queryClient.invalidateQueries({ queryKey: ['campaigns-feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
    },
  });

  // Star Artist mutation
  const starMutation = useMutation({
    mutationFn: async (targetUrn: string) => {
      const res = await fetch('/api/user/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-star',
          targetUrn,
        }),
      });
      return res.json();
    },
    onSuccess: (resData, targetUrn) => {
      if (resData && typeof resData.isStarred === 'boolean') {
        setStarredUrns((prev) => ({ ...prev, [targetUrn]: resData.isStarred }));
      }
    },
  });

  const handleToggleStar = (urn: string) => {
    setStarredUrns((prev) => ({ ...prev, [urn]: !prev[urn] }));
    starMutation.mutate(urn);
  };

  const campaigns = data?.campaigns || [];
  const counts = data?.counts || {
    recommendedPro: campaigns.length,
    recommended: campaigns.length,
    all: campaigns.length,
  };
  const pagination = data?.pagination || {
    page: 1,
    perPage: 12,
    total: campaigns.length,
    totalPages: Math.ceil((campaigns.length || 1) / 12),
  };

  const togglePlay = (campaignId: string) => {
    setPlayingCampaignId((prev) => (prev === campaignId ? null : campaignId));
  };

  const availableCredits = dashData?.kpis?.availableCredits ?? 0;
  const recentTracks = dashData?.recentTracks || [];
  const userRepostPrice = dashData?.user?.repost_price || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* SoundCloud Widget API Script */}
      <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />

      {/* ========================================================= */}
      {/* 1. HERO SECTION (ADAPTABLE TO LIGHT & DARK THEMES) */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-b from-black/[0.04] to-black/[0.01] dark:from-white/[0.08] dark:to-white/[0.02] p-[1px] shadow-lg dark:shadow-2xl">
        <div className="rounded-[23px] bg-white dark:bg-[#121212] border border-gray-200/80 dark:border-transparent p-6 sm:p-8 relative overflow-hidden transition-colors">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF5500]/10 dark:bg-[#FF5500]/15 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Official Rounded Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 mb-3.5 backdrop-blur-sm">
                <RepostChainMark className="w-3.5 h-3.5 text-[#FF5500] drop-shadow-[0_0_6px_rgba(255,85,0,0.4)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-zinc-300">
                  CAMPAIGN HUB
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                <span className="text-[10px] font-mono text-[#FF5500] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  COMMUNITY EXCHANGE
                </span>
              </div>

              {/* Bold All-Caps Display Headline */}
              <h1 className="sc-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.95]">
                CAMPAIGN <span className="text-[#FF5500]">FEED</span>
              </h1>
              <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Discover and repost community tracks to earn credits and expand your SoundCloud reach.
              </p>
            </div>

            {/* Quick Action Buttons matching Dashboard and Collab Chat */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className="2xl:hidden px-5 py-3 text-xs sm:text-sm font-bold rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.08] text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/[0.12] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-[#FF5500]/25 bg-[#FF5500] hover:bg-[#ff6a1a] text-white cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Start a new campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. UNDERLINE TABS (Light & Dark theme support) */}
      {/* ========================================================= */}
      <div className="border-b border-gray-200 dark:border-white/[0.1] mb-5">
        <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('recommended_pro');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeMainTab === 'recommended_pro'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <span>Recommended Pro</span>
            <span className="text-xs font-mono text-[#FF5500]">
              ({counts.recommendedPro})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('recommended');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeMainTab === 'recommended'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <span>Recommended</span>
            <span className="text-xs font-mono text-[#FF5500]">
              ({counts.recommended})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('all');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeMainTab === 'all'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <span>All</span>
            <span className="text-xs font-mono text-[#FF5500]">
              ({counts.all})
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile/Tablet Collapsible Dashboard Summary */}
      {showStats && (
        <div className="2xl:hidden mb-6">
          <DashboardSummary
            earnings={1}
            dailyRepostCurrent={Object.keys(repostedIds).length}
            dailyRepostMax={20}
            responseRate={98}
            pendingRequests={dashData?.pendingRequests?.length ?? 2}
            requestLimit={20}
            credits={availableCredits}
            campaigns={dashData?.kpis?.activeCampaigns ?? 2}
            campaignLimit={10}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FILTER CONTROLS BAR (SEARCH BAR NEAR FILTERS & RESIZED) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 relative z-30 mb-6">
        {/* Filter by track type */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenTrackTypeDropdown(!openTrackTypeDropdown);
              setOpenGenreDropdown(false);
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#181818] text-slate-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center justify-between gap-2.5 transition-all shadow-sm cursor-pointer"
          >
            <span className="text-slate-500 dark:text-zinc-400 truncate">Filter by /</span>
            <span className="text-[#FF5500] capitalize font-bold">
              {trackType === 'all' ? 'All' : `${trackType}s`}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
          </button>

          {openTrackTypeDropdown && (
            <div className="absolute left-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 p-1.5 z-50">
              {(['all', 'track', 'playlist'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setTrackType(type);
                    setOpenTrackTypeDropdown(false);
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg capitalize flex items-center justify-between transition-colors cursor-pointer ${
                    trackType === type
                      ? 'bg-[#FF5500] text-white font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{type === 'all' ? 'All Types' : `${type}s Only`}</span>
                  {trackType === type && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter by genre (Multi-select Popover) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenGenreDropdown(!openGenreDropdown);
              setOpenTrackTypeDropdown(false);
            }}
            className={`w-full sm:w-auto px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-between sm:justify-start gap-2 transition-all shadow-sm cursor-pointer ${
              selectedGenres.length > 0
                ? 'bg-[#FF5500]/10 dark:bg-[#FF5500]/15 border border-[#FF5500]/40 dark:border-[#FF5500]/50 text-[#FF5500]'
                : 'border border-gray-300 dark:border-white/10 bg-white dark:bg-[#181818] text-slate-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-white/[0.06]'
            }`}
          >
            <Music className="w-4 h-4 text-[#FF5500] shrink-0" />
            <span className="truncate">
              Genre / {selectedGenres.length}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
          </button>

          {openGenreDropdown && (
            <div className="absolute left-0 sm:left-auto mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl shadow-2xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 p-3.5 max-h-96 overflow-y-auto z-50">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100 dark:border-white/[0.08]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
                  SELECT GENRES ({selectedGenres.length} ACTIVE)
                </span>
                {selectedGenres.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenres([]);
                      setPage(1);
                    }}
                    className="text-xs font-bold text-[#FF5500] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map((genre) => {
                  const isSelected =
                    genre === 'All Genres'
                      ? selectedGenres.length === 0
                      : selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30'
                          : 'bg-gray-100 dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-white/[0.12] border border-gray-200 dark:border-white/5'
                      }`}
                    >
                      <span>{genre}</span>
                      {isSelected && genre !== 'All Genres' && (
                        <CheckCircle2 className="w-3 h-3 ml-1.5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search tags input (Resized and positioned directly next to filters) */}
        <div className="relative w-full sm:w-64 md:w-72">
          <div className="relative flex items-center bg-white dark:bg-[#181818] border border-gray-300 dark:border-white/10 focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/20 rounded-full transition-all shadow-sm">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Type to search tags..."
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

      {/* ========================================================= */}
      {/* 4. MAIN SECTION (FEED + SIDEBAR) */}
      {/* ========================================================= */}
      <section className="flex flex-col 2xl:flex-row gap-6 items-start">
        {/* Left Column: Campaigns Feed */}
        <div className="w-full min-w-0 flex-1 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            campaigns.map(
              (campaign: {
                id: string;
                budget_credits: number;
                credits_spent: number;
                target_genre?: string;
                is_featured?: number;
                is_boost?: number;
                user?: {
                  urn?: string;
                  name?: string;
                  avatar?: string;
                  soundcloud_permalink_url?: string;
                };
                music?: {
                  id?: string;
                  title?: string;
                  genre?: string;
                  artwork_url?: string;
                  permalink_url?: string;
                  author_username?: string;
                };
              }) => {
                const playSec = playTimes[campaign.id] || 0;
                const playPct = Math.min(100, (playSec / 15) * 100);
                const isEligible = playSec >= 15;
                const isReposted = !!repostedIds[campaign.id];
                const remainingCredits = Math.max(
                  0,
                  Number(campaign.budget_credits || 50) - Number(campaign.credits_spent || 0)
                );
                const artistUrn = campaign.user?.urn || campaign.id;
                const isStarred = !!starredUrns[artistUrn];
                const isArtistMenuOpen = openArtistMenuId === campaign.id;

                return (
                  <div
                    key={campaign.id}
                    className="campaign-card relative rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Left Column: Authentic SoundCloud Player (Height 166px) */}
                      <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-black rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl overflow-hidden relative flex flex-col justify-center min-h-[166px] lg:h-[166px] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/[0.08]">
                        <SoundCloudPlayer
                          track={campaign.music}
                          height={166}
                          visual={false}
                          className="w-full h-full border-none rounded-none overflow-hidden"
                          isPlaying={playingCampaignId === campaign.id}
                          playSeconds={playSec}
                          onTogglePlay={() => togglePlay(campaign.id)}
                          onProgress={(sec) => {
                            setPlayTimes((prev) => ({
                              ...prev,
                              [campaign.id]: Math.min(15, sec),
                            }));
                          }}
                          onEligible={() => {
                            setPlayTimes((prev) => ({
                              ...prev,
                              [campaign.id]: 15,
                            }));
                          }}
                        />

                        {/* Floating Editorial Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none z-10">
                          {campaign.is_featured ? (
                            <div className="bg-gradient-to-r from-[#FF5500] to-[#FF7730] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                              <Flame className="w-3 h-3 fill-white" />
                              <span>FEATURED</span>
                            </div>
                          ) : null}
                          {campaign.is_boost ? (
                            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-white" />
                              <span>BOOSTED</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Right Column: Campaign Info (Sized exactly to match SoundCloud player height: 166px) */}
                      <div className="w-full lg:w-1/2 p-4 lg:p-5 flex flex-col justify-between min-h-[166px] lg:h-[166px] gap-2">
                        {/* Top Line: Avatar + Name + Remaining Credits */}
                        <div className="flex items-start justify-between gap-3">
                          {/* Artist Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              className="w-12 h-12 lg:w-13.5 lg:h-13.5 rounded-full object-cover ring-2 ring-gray-100 dark:ring-white/10 shrink-0"
                              src={campaign.user?.avatar || '/default_img/no_img.jpg'}
                              alt={campaign.user?.name || 'Avatar'}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                              }}
                            />

                            <div className="min-w-0 relative">
                              <div
                                onClick={() =>
                                  setOpenArtistMenuId(isArtistMenuOpen ? null : campaign.id)
                                }
                                className="flex items-center gap-1 cursor-pointer group/name"
                              >
                                <span className="text-slate-900 dark:text-white group-hover/name:text-[#FF5500] font-bold text-sm sm:text-base truncate transition-colors">
                                  {campaign.user?.name ||
                                    campaign.music?.author_username ||
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
                                  VERIFIED
                                </span>
                              </button>

                              {/* Dropdown Menu */}
                              {isArtistMenuOpen && (
                                <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-1.5 z-40">
                                  {campaign.user?.soundcloud_permalink_url && (
                                    <a
                                      href={campaign.user.soundcloud_permalink_url}
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

                          {/* Remaining Credits Counter */}
                          <div className="flex flex-col items-end shrink-0">
                            <div className="flex items-center gap-1.5 text-[#FF5500]">
                              <CreditCoinIcon className="w-5 h-3.5 shrink-0 text-[#FF5500]" />
                              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                                {remainingCredits}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mt-0.5">
                              REMAINING
                            </span>
                          </div>
                        </div>

                        {/* Bottom Line: Genre Badge + Repost Button with Laravel-style button fill animation */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 truncate max-w-[170px] sm:max-w-none">
                            <Music className="w-3 h-3 text-[#FF5500] shrink-0" />
                            <span className="truncate">
                              {campaign.target_genre && campaign.target_genre !== 'anyGenre'
                                ? campaign.target_genre
                                : campaign.music?.genre || 'All Genres'}
                            </span>
                          </span>

                          {/* Repost Button Container with Laravel-style button filling animation */}
                          <div className="relative">
                            {/* Countdown Tooltip */}
                            {!isReposted && !isEligible && playSec > 0 && (
                              <div className="absolute -top-10 right-0 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-30 pointer-events-none">
                                <span>{Math.max(0, Math.ceil(15 - playSec))}s remaining</span>
                                <div className="absolute top-full right-4 -mt-px">
                                  <div className="border-4 border-transparent border-t-slate-900" />
                                </div>
                              </div>
                            )}

                            {/* Ready Tooltip */}
                            {!isReposted && isEligible && (
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

                            {/* Repost Button with Internal Animated Progress Fill */}
                            <button
                              type="button"
                              disabled={!isEligible || isReposted || repostMutation.isPending}
                              onClick={() => repostMutation.mutate(campaign.id)}
                              className={`repost-button relative overflow-hidden flex items-center justify-center gap-2 py-2 px-4 sm:px-5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                isReposted
                                  ? 'bg-[#10B981] text-white !cursor-not-allowed shadow-sm'
                                  : isEligible
                                  ? 'bg-[#FF5500] hover:bg-[#ff6a1a] text-white shadow-md shadow-[#FF5500]/30 hover:scale-[1.02] active:scale-95'
                                  : 'bg-gray-200 dark:bg-white/[0.08] text-gray-500 dark:text-zinc-400 border border-gray-300/60 dark:border-white/10 !cursor-not-allowed'
                              }`}
                            >
                              {/* Animated fill background inside button (Exact match to Laravel) */}
                              {!isReposted && !isEligible && playSec > 0 && (
                                <div
                                  className="absolute inset-0 bg-gradient-to-r from-[#FF5500] to-[#FF7730] transition-all duration-300 ease-out z-0 pointer-events-none opacity-90"
                                  style={{ width: `${playPct}%` }}
                                />
                              )}

                              {/* Button content */}
                              <span className="relative z-10 flex items-center gap-2">
                                {isReposted ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                    <span>Reposted</span>
                                  </>
                                ) : repostMutation.isPending ? (
                                  <span>Reposting...</span>
                                ) : (
                                  <>
                                    <CreditCoinIcon
                                      className={`w-5 h-3.5 ${
                                        isEligible || playSec > 0
                                          ? 'text-white'
                                          : 'text-gray-500 dark:text-zinc-400'
                                      }`}
                                    />
                                    <span
                                      className={
                                        isEligible || playSec > 0
                                          ? 'text-white font-bold'
                                          : ''
                                      }
                                    >
                                      {userRepostPrice} Repost
                                    </span>
                                  </>
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] shadow-sm">
              <div className="p-8">
                <Music className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="sc-display text-xl font-black text-slate-900 dark:text-white tracking-wide">
                  NO CAMPAIGNS AVAILABLE
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                  There are currently no active campaigns matching your selected filters. Try switching tabs or resetting your genre and search filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('all');
                    setSelectedGenres([]);
                    setTrackType('all');
                    setSearch('');
                    setPage(1);
                  }}
                  className="mt-6 px-6 py-2.5 text-xs font-bold rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.08] text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/[0.12] cursor-pointer shadow-sm transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Editorial Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-white/[0.08] mt-6 pt-4 gap-3">
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                SHOWING <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * 12 + 1}</span> TO{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {Math.min(page * 12, pagination.total)}
                </span>{' '}
                OF <span className="font-bold text-slate-900 dark:text-white">{pagination.total}</span> CAMPAIGNS
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

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
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
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
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
            earnings={1}
            dailyRepostCurrent={Object.keys(repostedIds).length}
            dailyRepostMax={20}
            responseRate={98}
            pendingRequests={dashData?.pendingRequests?.length ?? 2}
            requestLimit={20}
            credits={availableCredits}
            campaigns={dashData?.kpis?.activeCampaigns ?? 2}
            campaignLimit={10}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CAMPAIGN CREATION MODAL */}
      {/* ========================================================= */}
      {showCreateModal && (
        <CreateCampaignModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          tracks={recentTracks}
          availableCredits={availableCredits}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ['campaigns-feed'] });
            queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
          }}
        />
      )}
    </div>
  );
}
