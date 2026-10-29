'use client';

import { useState, useEffect, useRef } from 'react';
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
  SlidersHorizontal,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { DashboardSummary } from '@/components/dashboard-summary';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';

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
    <div className="sc-dash space-y-6 max-w-screen-2xl mx-auto pb-16 px-2 sm:px-4 lg:px-6">
      {/* SoundCloud Widget API Script */}
      <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />

      {/* ========================================================= */}
      {/* 1. EDITORIAL HEADER & TAB STRIP */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-[1px] shadow-2xl">
        <div className="rounded-[23px] bg-[#121212] p-5 sm:p-7 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF5500]/15 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col gap-5">
            {/* Top Bar: Badge & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-2.5 backdrop-blur-sm">
                  <RepostChainMark className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(255,85,0,0.4)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                    CAMPAIGN EXCHANGE
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-mono text-[#FF5500] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    LIVE FEED
                  </span>
                </div>

                <h1 className="sc-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.95]">
                  CAMPAIGN FEED
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal">
                  Listen to verified community tracks for 15 seconds to unlock reposts, earn promotion credits, and boost your SoundCloud reach.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="sc-pill-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xl shadow-white/5 cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#FF5500]" />
                  <span>Start a new campaign</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="xl:hidden sc-pill-dark px-4 py-2.5 text-xs font-bold border border-white/15 flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer"
                >
                  <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                  {showStats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bottom Strip: Navigation Tabs */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('recommended_pro');
                    setPage(1);
                  }}
                  className={`tab-button pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
                    activeMainTab === 'recommended_pro'
                      ? 'border-[#FF5500] text-[#FF5500]'
                      : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span>Recommended Pro</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      activeMainTab === 'recommended_pro'
                        ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 font-bold'
                        : 'bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    {counts.recommendedPro}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('recommended');
                    setPage(1);
                  }}
                  className={`tab-button pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
                    activeMainTab === 'recommended'
                      ? 'border-[#FF5500] text-[#FF5500]'
                      : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span>Recommended</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      activeMainTab === 'recommended'
                        ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 font-bold'
                        : 'bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    {counts.recommended}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('all');
                    setPage(1);
                  }}
                  className={`tab-button pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
                    activeMainTab === 'all'
                      ? 'border-[#FF5500] text-[#FF5500]'
                      : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      activeMainTab === 'all'
                        ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 font-bold'
                        : 'bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    {counts.all}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Collapsible Dashboard Summary */}
      {showStats && (
        <div className="xl:hidden">
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
      {/* 2. MAIN FEED + SIDEBAR LAYOUT */}
      {/* ========================================================= */}
      <section className="flex flex-col xl:flex-row gap-6">
        {/* Left Column: Campaigns Feed */}
        <div className="w-full min-w-0 flex-1 space-y-4">
          {/* Editorial Filter Controls Bar */}
          <div className="relative rounded-2xl bg-[#141414] border border-white/[0.08] p-3.5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-30">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Track Type Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenTrackTypeDropdown(!openTrackTypeDropdown);
                    setOpenGenreDropdown(false);
                  }}
                  className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 hover:border-[#FF5500]/50 text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between gap-2.5 transition-all shadow-md cursor-pointer"
                >
                  <span className="text-zinc-400">Type:</span>
                  <span className="text-white capitalize">
                    {trackType === 'all' ? 'All' : `${trackType}s`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {openTrackTypeDropdown && (
                  <div className="absolute left-0 mt-2 w-48 rounded-xl shadow-2xl bg-[#161616] border border-white/10 p-1.5 z-50 backdrop-blur-xl">
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
                            : 'text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span>{type === 'all' ? 'All Types' : `${type}s Only`}</span>
                        {trackType === type && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Genre Multi-Select Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenGenreDropdown(!openGenreDropdown);
                    setOpenTrackTypeDropdown(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                    selectedGenres.length > 0
                      ? 'bg-[#FF5500]/15 border border-[#FF5500]/40 text-[#FF5500]'
                      : 'bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 hover:border-[#FF5500]/50 text-white'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>
                    Genre / {selectedGenres.length}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {openGenreDropdown && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl bg-[#161616] border border-white/10 p-3.5 max-h-96 overflow-y-auto z-50 backdrop-blur-xl">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        SELECT GENRES ({selectedGenres.length} ACTIVE)
                      </span>
                      {selectedGenres.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGenres([]);
                            setPage(1);
                          }}
                          className="text-[11px] font-bold text-[#FF5500] hover:underline cursor-pointer flex items-center gap-1"
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
                                : 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12] hover:text-white border border-white/5'
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
            </div>

            {/* Tag Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <div className="relative flex items-center bg-[#1A1A1A] border border-white/10 focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/20 rounded-xl transition-all">
                <Search className="w-4 h-4 absolute left-3 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search tags or track title..."
                  className="w-full py-2 pl-9 pr-8 text-xs font-medium text-white placeholder-zinc-500 bg-transparent border-0 rounded-xl focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="absolute right-2.5 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Feed Cards List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-3xl bg-[#141414] border border-white/[0.06] animate-pulse"
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
                      className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-[1px] hover:from-[#FF5500]/30 hover:to-white/[0.06] transition-all duration-300 shadow-xl group"
                    >
                      <div className="rounded-[23px] bg-[#121212] overflow-hidden flex flex-col lg:flex-row">
                        {/* Left Column: Authentic SoundCloud Player */}
                        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0c0c0c] relative flex flex-col justify-center min-h-[166px]">
                          <SoundCloudPlayer
                            track={campaign.music}
                            height={166}
                            visual={false}
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

                          {/* Editorial Floating Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none z-10">
                            {campaign.is_featured ? (
                              <div className="bg-gradient-to-r from-[#FF5500] to-[#FF7730] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg shadow-[#FF5500]/40 flex items-center gap-1">
                                <Flame className="w-3 h-3 fill-white" />
                                <span>FEATURED</span>
                              </div>
                            ) : null}
                            {campaign.is_boost ? (
                              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg shadow-[#8B5CF6]/40 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-white" />
                                <span>BOOSTED</span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Right Column: Campaign Info & Repost Action */}
                        <div className="w-full lg:w-1/2 p-5 sm:p-6 flex flex-col justify-between gap-4 bg-gradient-to-b from-transparent to-white/[0.01]">
                          {/* Top Row: Artist & Credits */}
                          <div className="flex items-start justify-between gap-4">
                            {/* Artist Avatar & Name Dropdown */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-[#FF5500]/40 transition-all shadow-md shrink-0"
                                src={campaign.user?.avatar || '/default_img/no_img.jpg'}
                                alt={campaign.user?.name || 'Artist Avatar'}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                                }}
                              />

                              <div className="min-w-0 relative">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenArtistMenuId(isArtistMenuOpen ? null : campaign.id)
                                    }
                                    className="text-white hover:text-[#FF5500] font-bold text-sm sm:text-base truncate transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>
                                      {campaign.user?.name ||
                                        campaign.music?.author_username ||
                                        'SoundCloud Artist'}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStar(artistUrn)}
                                    title={isStarred ? 'Unstar creator' : 'Star creator'}
                                    className="cursor-pointer hover:scale-110 transition-transform"
                                  >
                                    <Star
                                      className={`w-4 h-4 ${
                                        isStarred
                                          ? 'text-[#FFB200] fill-[#FFB200] drop-shadow-[0_0_8px_rgba(255,178,0,0.5)]'
                                          : 'text-zinc-500 hover:text-zinc-300'
                                      }`}
                                    />
                                  </button>
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                    VERIFIED CREATOR
                                  </span>
                                </div>

                                {/* Artist Links Popover */}
                                {isArtistMenuOpen && (
                                  <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-2xl bg-[#181818] border border-white/10 p-1.5 z-40 backdrop-blur-xl">
                                    {campaign.user?.soundcloud_permalink_url && (
                                      <a
                                        href={campaign.user.soundcloud_permalink_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                                      >
                                        <span>Visit SoundCloud Profile</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                                      </a>
                                    )}
                                    <Link
                                      href="/user/members"
                                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                                    >
                                      <span>View RepostChain Profile</span>
                                      <RepostChainMark className="w-3 h-3" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remaining Credits Counter */}
                            <div className="flex flex-col items-end shrink-0">
                              <div className="flex items-center gap-1.5 text-[#FF5500]">
                                <CreditCoinIcon className="w-6 h-4 shrink-0 text-[#FF5500]" />
                                <span className="text-xl sm:text-2xl font-black font-mono text-white">
                                  {remainingCredits}
                                </span>
                              </div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mt-0.5">
                                REMAINING
                              </span>
                            </div>
                          </div>

                          {/* Middle Row: Progress Bar & Repost Countdown */}
                          <div className="space-y-2">
                            {/* 15s Timer Progress Bar */}
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-zinc-400 font-medium">
                                  {isReposted ? (
                                    <span className="text-[#10B981] font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Completed Repost
                                    </span>
                                  ) : isEligible ? (
                                    <span className="text-[#FF5500] font-bold flex items-center gap-1">
                                      <Zap className="w-3.5 h-3.5 fill-[#FF5500]" />
                                      Ready to Repost!
                                    </span>
                                  ) : playSec > 0 ? (
                                    <span className="text-zinc-300">
                                      Listening... {15 - playSec}s left
                                    </span>
                                  ) : (
                                    <span className="text-zinc-500">
                                      Play track for 15s to unlock repost
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono text-[11px] text-zinc-500">
                                  {playSec}s / 15s
                                </span>
                              </div>

                              <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden p-0.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isReposted
                                      ? 'bg-gradient-to-r from-[#10B981] to-[#34D399]'
                                      : 'bg-gradient-to-r from-[#FF5500] to-[#FF7730]'
                                  }`}
                                  style={{ width: `${isReposted ? 100 : playPct}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Genre Badge & Repost Button Container */}
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/[0.06] border border-white/10 text-zinc-300">
                              <Music className="w-3 h-3 text-[#FF5500]" />
                              <span>
                                {campaign.target_genre && campaign.target_genre !== 'anyGenre'
                                  ? campaign.target_genre
                                  : campaign.music?.genre || 'All Genres'}
                              </span>
                            </span>

                            {/* Repost Button Container with Tooltip */}
                            <div className="relative">
                              {/* Countdown Tooltip */}
                              {!isReposted && !isEligible && playSec > 0 && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                  <span>{Math.max(0, Math.ceil(15 - playSec))}s remaining</span>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                    <div className="border-4 border-transparent border-t-gray-900" />
                                  </div>
                                </div>
                              )}

                              {/* Ready Tooltip */}
                              {!isReposted && isEligible && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none animate-pulse">
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Ready ✓</span>
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                    <div className="border-4 border-transparent border-t-green-600" />
                                  </div>
                                </div>
                              )}

                              <button
                                type="button"
                                disabled={!isEligible || isReposted || repostMutation.isPending}
                                onClick={() => repostMutation.mutate(campaign.id)}
                                className={`repost-button relative overflow-hidden flex items-center gap-2 py-2.5 px-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                  isReposted
                                    ? 'bg-[#10B981] text-white !cursor-not-allowed shadow-md shadow-[#10B981]/25'
                                    : isEligible
                                    ? 'sc-pill-orange shadow-lg shadow-[#FF5500]/30 hover:scale-[1.02] active:scale-95'
                                    : 'bg-white/[0.06] text-zinc-400 border border-white/10 !cursor-not-allowed'
                                }`}
                              >
                                {isReposted ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                    <span>Reposted</span>
                                  </>
                                ) : repostMutation.isPending ? (
                                  <span>Reposting...</span>
                                ) : isEligible ? (
                                  <>
                                    <CreditCoinIcon className="w-5 h-3.5 text-white" />
                                    <span>{userRepostPrice} Repost</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCoinIcon className="w-5 h-3.5 text-zinc-400" />
                                    <span>{userRepostPrice} Repost</span>
                                  </>
                                )}
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
              <div className="text-center py-16 px-4 rounded-3xl bg-[#121212] border border-white/[0.08] shadow-2xl">
                <Music className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="sc-display text-xl font-black text-white tracking-wide">
                  NO CAMPAIGNS AVAILABLE
                </h3>
                <p className="text-zinc-400 text-sm mt-1 max-w-md mx-auto">
                  There are currently no active campaigns matching your selected filters. Try switching tabs or selecting &ldquo;All Genres&rdquo;.
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
                  className="mt-5 sc-pill-dark px-5 py-2.5 text-xs font-bold border border-white/15 hover:border-white/40 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Editorial Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.08] mt-6 pt-4 gap-3">
              <div className="text-xs font-mono text-zinc-400">
                SHOWING <span className="font-bold text-white">{(page - 1) * 12 + 1}</span> TO{' '}
                <span className="font-bold text-white">
                  {Math.min(page * 12, pagination.total)}
                </span>{' '}
                OF <span className="font-bold text-white">{pagination.total}</span> CAMPAIGNS
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/[0.06] border border-white/10 text-zinc-300 hover:bg-white/[0.12] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
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
                          <span className="px-2 text-xs font-mono text-zinc-500">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                            page === p
                              ? 'bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/30'
                              : 'bg-white/[0.06] border border-white/10 text-zinc-300 hover:bg-white/[0.12] hover:text-white'
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
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/[0.06] border border-white/10 text-zinc-300 hover:bg-white/[0.12] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: DESKTOP DASHBOARD SUMMARY SIDEBAR */}
        {/* ========================================================= */}
        <div className="w-full xl:max-w-[360px] 2xl:max-w-[380px] hidden xl:block shrink-0">
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
      {/* 3. CAMPAIGN CREATION MODAL */}
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
