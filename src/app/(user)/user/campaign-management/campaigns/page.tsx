'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { DashboardSummary } from '@/components/dashboard-summary';

const GENRES = [
  'All Genres',
  'Electronic',
  'Melodic Techno',
  'Deep House',
  'Hip-Hop & Rap',
  'Tech House',
  'Pop',
  'Drum & Bass',
  'Trap',
];

export default function CampaignsFeedPage() {
  const queryClient = useQueryClient();
  const [activeMainTab, setActiveMainTab] = useState<'recommended_pro' | 'recommended' | 'all'>('all');
  const [trackType, setTrackType] = useState<'all' | 'track' | 'playlist'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [search, setSearch] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [openTrackTypeDropdown, setOpenTrackTypeDropdown] = useState(false);
  const [openGenreDropdown, setOpenGenreDropdown] = useState(false);
  const [playingCampaignId, setPlayingCampaignId] = useState<string | null>(null);
  const [playTimes, setPlayTimes] = useState<Record<string, number>>({});
  const [repostedIds, setRepostedIds] = useState<Record<string, boolean>>({});
  const [starredUrns, setStarredUrns] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['campaigns-feed', activeMainTab, trackType, selectedGenre, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedGenre !== 'All Genres') params.set('genre', selectedGenre);
      if (search) params.set('search', search);
      const res = await fetch(`/api/user/campaigns?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load campaigns');
      return res.json();
    },
  });

  const { data: dashData } = useQuery({
    queryKey: ['user-dashboard-summary'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  // 15-second playback timer for active playing track
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

  const repostMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      await fetch('/api/user/playback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          action: 'complete',
          playDurationSeconds: 15,
        }),
      });
      return campaignId;
    },
    onSuccess: (campaignId) => {
      setRepostedIds((prev) => ({ ...prev, [campaignId]: true }));
      queryClient.invalidateQueries({ queryKey: ['campaigns-feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-summary'] });
    },
  });

  const rawCampaigns = data?.campaigns || [];
  const campaigns = rawCampaigns.filter((c: { music_type?: string; is_featured?: number; is_boost?: number }) => {
    if (trackType === 'track' && c.music_type && !c.music_type.includes('Track')) return false;
    if (trackType === 'playlist' && c.music_type && !c.music_type.includes('Playlist')) return false;
    if (activeMainTab === 'recommended_pro' && !c.is_featured && !c.is_boost) return true;
    return true;
  });

  const togglePlay = (campaignId: string) => {
    setPlayingCampaignId((prev) => (prev === campaignId ? null : campaignId));
  };

  return (
    <div>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Main Feed Column - Exact match to redesign-campaign.blade.php */}
        <div className="w-full">
          {/* Top Tabs + Start Campaign Button */}
          <div className="mb-4">
            <div className="border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-3 pb-2">
              <nav className="-mb-px flex flex-wrap space-x-4 md:space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('recommended_pro')}
                  className={`tab-button py-2 px-1 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    activeMainTab === 'recommended_pro'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 dark:text-gray-200 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recommended Pro ({campaigns.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMainTab('recommended')}
                  className={`tab-button py-2 px-1 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    activeMainTab === 'recommended'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 dark:text-gray-200 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recommended ({campaigns.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMainTab('all')}
                  className={`tab-button py-2 px-1 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    activeMainTab === 'all'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 dark:text-gray-200 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All ({campaigns.length})
                </button>
              </nav>

              <div className="flex items-center gap-3">
                <a
                  href="/user/dashboard"
                  className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 text-sm"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Start a new campaign
                </a>

                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="2xl:hidden flex items-center gap-1 text-sm text-orange-500 cursor-pointer"
                >
                  <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                  {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Collapsible Dashboard Summary */}
          {showStats && (
            <div className="2xl:hidden mb-8">
              <DashboardSummary
                earnings={1}
                dailyRepostCurrent={Object.keys(repostedIds).length}
                dailyRepostMax={20}
                responseRate={98}
                pendingRequests={dashData?.pendingRequests?.length ?? 2}
                requestLimit={20}
                credits={dashData?.kpis?.availableCredits ?? 250}
                campaigns={dashData?.kpis?.activeCampaigns ?? 2}
                campaignLimit={10}
              />
            </div>
          )}

          {/* Filter by track type + Filter by genre + Search tags */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 gap-3 relative z-30">
            <div className="flex items-center gap-3">
              {/* Track Type Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenTrackTypeDropdown(!openTrackTypeDropdown);
                    setOpenGenreDropdown(false);
                  }}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 text-sm font-medium rounded shadow flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>Filter by track type / {trackType}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {openTrackTypeDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 z-50">
                    <div className="py-1">
                      {(['all', 'track', 'playlist'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setTrackType(type);
                            setOpenTrackTypeDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm border-b border-gray-100 dark:border-gray-700 capitalize ${
                            trackType === type
                              ? 'bg-orange-100 dark:bg-gray-900 font-semibold text-orange-600'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {type === 'all' ? 'All Types' : `${type}s Only`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Genre Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenGenreDropdown(!openGenreDropdown);
                    setOpenTrackTypeDropdown(false);
                  }}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 text-sm font-medium rounded shadow flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>
                    Filter by genre / {selectedGenre === 'All Genres' ? '0' : '1'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {openGenreDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
                    <div className="py-1">
                      {GENRES.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => {
                            setSelectedGenre(genre);
                            setOpenGenreDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm border-b border-gray-100 dark:border-gray-700 ${
                            selectedGenre === genre
                              ? 'bg-orange-500 text-white font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Box */}
            <div className="w-full flex-1 relative">
              <div className="relative flex items-center text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                <Search className="w-4 h-4 absolute left-2.5 text-gray-500 dark:text-slate-300 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type to search tags..."
                  className="w-full py-2 pl-8 pr-3 text-sm dark:text-slate-300 dark:bg-gray-800 border-0 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
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
                    className="h-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
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

                  return (
                    <div
                      key={campaign.id}
                      className="campaign-card bg-white dark:bg-gray-800 border border-gray-200 mb-4 dark:border-gray-700 shadow-sm"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Left Column - Track Info */}
                        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 relative">
                          <SoundCloudPlayer
                            track={campaign.music}
                            height={166}
                            visual={false}
                            isPlaying={playingCampaignId === campaign.id}
                            playSeconds={playSec}
                            onTogglePlay={() => togglePlay(campaign.id)}
                          />

                          <div className="absolute top-2 left-2 flex items-center space-x-2">
                            {campaign.is_featured ? (
                              <div className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow z-10 tracking-wide">
                                FEATURED
                              </div>
                            ) : null}
                            {campaign.is_boost ? (
                              <div className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow z-10 tracking-wide">
                                Boosted
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Right Column - Campaign Info */}
                        <div className="w-full lg:w-1/2 p-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col sm:flex-row relative items-start sm:items-center justify-between gap-4 mb-4">
                              {/* Artist Avatar & Name */}
                              <div className="flex items-center gap-3 w-full">
                                <img
                                  className="w-14 h-14 rounded-full object-cover"
                                  src={campaign.user?.avatar || '/default_img/no_img.jpg'}
                                  alt={campaign.user?.name || 'Artist'}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      '/default_img/no_img.jpg';
                                  }}
                                />

                                <div className="inline-block text-left">
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-700 dark:text-gray-300 font-medium">
                                      {campaign.user?.name ||
                                        campaign.music?.author_username ||
                                        'SoundCloud Artist'}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setStarredUrns((prev) => ({
                                        ...prev,
                                        [artistUrn]: !prev[artistUrn],
                                      }))
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Star
                                      className={`w-5 h-5 mt-1 ${
                                        starredUrns[artistUrn]
                                          ? 'text-orange-400 fill-orange-400'
                                          : 'text-gray-400 dark:text-gray-500'
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* Remaining Credits + Repost Button */}
                              <div className="flex items-center justify-between gap-4 w-full">
                                <div className="flex flex-col items-center sm:items-start text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1.5">
                                    <svg
                                      width="26"
                                      height="18"
                                      viewBox="0 0 26 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
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
                                    <span className="text-sm sm:text-base font-medium">
                                      {remainingCredits}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    REMAINING
                                  </span>
                                </div>

                                {/* Repost Button Container with 15s Countdown Tooltip */}
                                <div className="relative">
                                  {!isReposted && !isEligible && playSec > 0 && (
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                      <span>{Math.max(0, Math.ceil(15 - playSec))}s remaining</span>
                                    </div>
                                  )}

                                  {!isReposted && isEligible && (
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                      <span>Ready ✓</span>
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    disabled={!isEligible || isReposted || repostMutation.isPending}
                                    onClick={() => repostMutation.mutate(campaign.id)}
                                    className="repost-button relative overflow-hidden flex items-center gap-2 py-2 px-4 sm:px-5 focus:outline-none rounded-lg shadow-sm text-sm sm:text-base transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                                  >
                                    {/* Disabled gray background */}
                                    {!isEligible && !isReposted && (
                                      <span className="absolute top-0 left-0 w-full h-full bg-gray-300 dark:bg-gray-600" />
                                    )}

                                    {/* Animated orange progress fill */}
                                    {!isReposted && (
                                      <div
                                        className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out z-0"
                                        style={{ width: `${playPct}%` }}
                                      />
                                    )}

                                    {/* Reposted green background */}
                                    {isReposted && (
                                      <span className="absolute top-0 left-0 w-full h-full bg-green-500" />
                                    )}

                                    <div className="relative z-10 flex items-center gap-2 text-white font-medium">
                                      <svg
                                        width="24"
                                        height="16"
                                        viewBox="0 0 26 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                      <span>{isReposted ? 'Reposted' : '1 Repost'}</span>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                                {campaign.target_genre && campaign.target_genre !== 'anyGenre'
                                  ? campaign.target_genre
                                  : campaign.music?.genre || 'Any Genre'}
                              </span>
                              {!isEligible && !isReposted && (
                                <span className="text-xs text-slate-400">
                                  Play track for 15s to unlock Repost
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-6 py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p>No campaigns available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Dashboard Summary (Visible on large screens) */}
        <div className="w-full lg:max-w-[380px] hidden xl:block shrink-0">
          <DashboardSummary
            earnings={1}
            dailyRepostCurrent={Object.keys(repostedIds).length}
            dailyRepostMax={20}
            responseRate={98}
            pendingRequests={dashData?.pendingRequests?.length ?? 2}
            requestLimit={20}
            credits={dashData?.kpis?.availableCredits ?? 250}
            campaigns={dashData?.kpis?.activeCampaigns ?? 2}
            campaignLimit={10}
          />
        </div>
      </section>
    </div>
  );
}
