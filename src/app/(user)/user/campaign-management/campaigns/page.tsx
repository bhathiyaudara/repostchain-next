'use client';

import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { DashboardSummary } from '@/components/dashboard-summary';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';

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

  // Suggested tags autocomplete
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

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

  // Fetch dashboard summary
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
    <div>
      {/* SoundCloud Widget API Script */}
      <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />

      <section className="flex flex-col xl:flex-row gap-4 lg:gap-6 max-w-screen-2xl mx-auto">
        {/* ========================================================= */}
        {/* LEFT COLUMN: MAIN CAMPAIGN FEED */}
        {/* ========================================================= */}
        <div className="w-full min-w-0 flex-1">
          {/* Top Tabs + Start Campaign Button (Exact match to redesign-campaign.blade.php) */}
          <div className="mb-4">
            <div className="border-b border-gray-200 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-3 pb-2">
              {/* Tab Navigation */}
              <nav className="-mb-px flex overflow-x-auto no-scrollbar whitespace-nowrap space-x-4 md:space-x-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('recommended_pro');
                    setPage(1);
                  }}
                  className={`tab-button py-2.5 px-1 text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
                    activeMainTab === 'recommended_pro'
                      ? 'border-[#FF5500] text-[#FF5500]'
                      : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                  }`}
                >
                  <span>Recommended Pro</span>
                  <span className="text-xs text-[#FF5500] font-mono">
                    ({counts.recommendedPro})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('recommended');
                    setPage(1);
                  }}
                  className={`tab-button py-2.5 px-1 text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
                    activeMainTab === 'recommended'
                      ? 'border-[#FF5500] text-[#FF5500]'
                      : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                  }`}
                >
                  <span>Recommended</span>
                  <span className="text-xs text-[#FF5500] font-mono">
                    ({counts.recommended})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab('all');
                    setPage(1);
                  }}
                  className={`tab-button py-2.5 px-1 text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
                    activeMainTab === 'all'
                      ? 'border-[#FF5500] text-[#FF5500]'
                      : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                  }`}
                >
                  <span>All</span>
                  <span className="text-xs text-[#FF5500] font-mono">
                    ({counts.all})
                  </span>
                </button>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5500] focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-[#FF5500] hover:bg-[#ff6614] text-white px-4 py-2 text-sm shadow-md shadow-[#FF5500]/25 cursor-pointer active:scale-95"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  <span>Start a new campaign</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="xl:hidden flex items-center gap-1 text-sm font-medium text-[#FF5500] cursor-pointer"
                >
                  <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                  {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Collapsible Dashboard Summary */}
          {showStats && (
            <div className="xl:hidden mb-6">
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

          {/* Filter options (Track Type + Multi-select Genre + Search tags) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 relative z-30">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Filter by track type */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenTrackTypeDropdown(!openTrackTypeDropdown);
                    setOpenGenreDropdown(false);
                  }}
                  className="w-full sm:w-auto bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-[#FF5500] px-4 py-2 text-sm font-medium rounded-md shadow-sm flex items-center justify-between gap-2 transition-colors cursor-pointer border border-orange-500/20"
                >
                  <span>
                    Filter by track type /{' '}
                    {trackType === 'all' ? 'All' : trackType === 'track' ? 'Tracks' : 'Playlists'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {openTrackTypeDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 z-50 py-1">
                    {(['all', 'track', 'playlist'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setTrackType(type);
                          setOpenTrackTypeDropdown(false);
                          setPage(1);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm border-b border-gray-100 dark:border-zinc-800 capitalize transition-colors ${
                          trackType === type
                            ? 'bg-orange-100 dark:bg-zinc-800 text-[#FF5500] font-semibold'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : `${type}s Only`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter by genre (Multi-select popover) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenGenreDropdown(!openGenreDropdown);
                    setOpenTrackTypeDropdown(false);
                  }}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
                    selectedGenres.length > 0
                      ? 'bg-orange-100 dark:bg-orange-950/40 text-[#FF5500] border border-orange-500/30'
                      : 'bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-[#FF5500] border border-orange-500/20'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>
                    Filter by genre / {selectedGenres.length}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {openGenreDropdown && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 z-50 p-3 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-zinc-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                        Select Genres
                      </span>
                      {selectedGenres.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGenres([]);
                            setPage(1);
                          }}
                          className="text-xs text-[#FF5500] hover:underline font-medium cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF5500] text-white shadow-sm'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <span>{genre}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Box */}
            <div className="w-full flex-1 relative">
              <div className="relative flex items-center text-gray-600 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900">
                <Search className="w-4 h-4 absolute left-2.5 text-gray-500 dark:text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Type to search tags..."
                  className="w-full py-2 pl-8 pr-8 text-sm text-gray-900 dark:text-zinc-200 bg-transparent border-0 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Cards List */}
          <div className="flex flex-col space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg animate-pulse"
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
                      className="campaign-card bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Left Column: Authentic SoundCloud Player */}
                        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 relative">
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

                          {/* Featured & Boosted Badges */}
                          <div className="absolute top-2 left-2 flex items-center space-x-2 pointer-events-none z-10">
                            {campaign.is_featured ? (
                              <div className="bg-[#FF5500] text-white text-xs font-semibold px-2 py-0.5 rounded shadow z-10 tracking-wide">
                                FEATURED
                              </div>
                            ) : null}
                            {campaign.is_boost ? (
                              <div className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded shadow z-10 tracking-wide">
                                Boosted
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Right Column: Campaign Info & Repost Action */}
                        <div className="w-full lg:w-1/2 p-4 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row relative items-start sm:items-center justify-between gap-4 mb-4">
                            {/* Artist Avatar & Name Dropdown */}
                            <div className="flex items-center gap-3 w-full">
                              <img
                                className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
                                src={campaign.user?.avatar || '/default_img/no_img.jpg'}
                                alt={campaign.user?.name || 'Avatar'}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                                }}
                              />

                              <div className="inline-block text-left relative min-w-0">
                                <div
                                  onClick={() =>
                                    setOpenArtistMenuId(isArtistMenuOpen ? null : campaign.id)
                                  }
                                  className="flex items-center gap-1 cursor-pointer group"
                                >
                                  <span className="text-gray-900 dark:text-zinc-200 font-medium truncate group-hover:text-[#FF5500] transition-colors">
                                    {campaign.user?.name ||
                                      campaign.music?.author_username ||
                                      'SoundCloud Artist'}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 shrink-0" />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleStar(artistUrn)}
                                  className="cursor-pointer mt-1"
                                  title={isStarred ? 'Unstar creator' : 'Star creator'}
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      isStarred
                                        ? 'text-orange-400 fill-orange-400'
                                        : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600'
                                    }`}
                                  />
                                </button>

                                {/* Artist Links Popover */}
                                {isArtistMenuOpen && (
                                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-xl bg-gray-900 text-white text-sm p-2 space-y-1 z-50">
                                    {campaign.user?.soundcloud_permalink_url && (
                                      <a
                                        href={campaign.user.soundcloud_permalink_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block hover:bg-gray-800 px-3 py-1.5 rounded transition-colors text-xs flex items-center justify-between"
                                      >
                                        <span>Visit SoundCloud Profile</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                                      </a>
                                    )}
                                    <a
                                      href="/user/members"
                                      className="block hover:bg-gray-800 px-3 py-1.5 rounded transition-colors text-xs flex items-center justify-between"
                                    >
                                      <span>Visit RepostChain Profile</span>
                                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remaining Credits + Repost Button */}
                            <div className="flex items-center justify-between gap-4 w-full sm:w-auto shrink-0">
                              {/* Remaining Budget Credits */}
                              <div className="flex flex-col items-center sm:items-start text-gray-600 dark:text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                  <svg
                                    width="26"
                                    height="18"
                                    viewBox="0 0 26 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="shrink-0"
                                  >
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
                                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-zinc-100">
                                    {remainingCredits}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5 font-medium">
                                  REMAINING
                                </span>
                              </div>

                              {/* Repost Button Container with 15s Countdown Tooltip */}
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
                                      <span>Ready</span>
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                      <div className="border-4 border-transparent border-t-green-600" />
                                    </div>
                                  </div>
                                )}

                                {/* Repost Button */}
                                <button
                                  type="button"
                                  disabled={!isEligible || isReposted || repostMutation.isPending}
                                  onClick={() => repostMutation.mutate(campaign.id)}
                                  className={`repost-button relative overflow-hidden flex items-center gap-2 py-2 px-4 sm:px-5 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-sm text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                                    isReposted
                                      ? 'bg-green-500 text-white !cursor-not-allowed'
                                      : isEligible
                                      ? 'bg-[#FF5500] hover:bg-[#ff6614] text-white hover:shadow-lg focus:ring-[#FF5500]'
                                      : 'bg-gray-300 dark:bg-zinc-700 text-white dark:text-zinc-300 !cursor-not-allowed'
                                  }`}
                                >
                                  {/* Animated Orange Progress Fill */}
                                  {!isReposted && (
                                    <div
                                      className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out z-0"
                                      style={{ width: `${playPct}%` }}
                                    />
                                  )}

                                  {/* Reposted Green Background */}
                                  {isReposted && (
                                    <span className="absolute top-0 left-0 w-full h-full bg-green-500 z-0" />
                                  )}

                                  <div className="relative z-10 flex items-center gap-2 text-white font-medium">
                                    {!isReposted ? (
                                      <>
                                        <svg
                                          width="26"
                                          height="18"
                                          viewBox="0 0 26 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="shrink-0"
                                        >
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
                                        <span>
                                          {repostMutation.isPending
                                            ? 'Reposting...'
                                            : `${userRepostPrice} Repost`}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                        <span>Reposted</span>
                                      </>
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Genre Pill + Playback Note */}
                          <div className="mt-auto flex items-center justify-between">
                            <span className="inline-block bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm border border-transparent dark:border-zinc-700">
                              {campaign.target_genre && campaign.target_genre !== 'anyGenre'
                                ? campaign.target_genre
                                : campaign.music?.genre || 'Any Genre'}
                            </span>
                            {!isEligible && !isReposted && (
                              <span className="text-xs text-gray-400 dark:text-zinc-500">
                                Play track for 15s to unlock Repost
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="text-center text-gray-500 dark:text-zinc-400 mt-6 py-16 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <Music className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                <p className="text-base font-semibold text-gray-800 dark:text-zinc-200">
                  No campaigns available at the moment.
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                  Try switching tabs or resetting your genre and search filters.
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
                  className="mt-4 px-4 py-2 bg-orange-100 dark:bg-zinc-800 text-[#FF5500] font-semibold text-xs rounded-lg hover:bg-orange-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 mt-6 pt-4">
              <div className="text-xs text-gray-500 dark:text-zinc-400">
                Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
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
                          <span className="px-2 text-xs text-gray-400">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            page === p
                              ? 'bg-[#FF5500] text-white'
                              : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
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
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
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
      {/* CAMPAIGN CREATION MODAL */}
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
