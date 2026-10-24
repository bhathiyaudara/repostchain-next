'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Zap,
  Music,
  Repeat2,
  Award,
  Plus,
  X,
  ListMusic,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';

const GENRE_COLORS = ['#ff6b35', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function UserDashboardPage() {
  const queryClient = useQueryClient();
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [modalTab, setModalTab] = useState<'tracks' | 'playlists'>('tracks');
  const [trackSearchQuery, setTrackSearchQuery] = useState('');
  const [selectedTrackUrn, setSelectedTrackUrn] = useState<string | null>(null);
  const [campaignBudget, setCampaignBudget] = useState(50);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard');
      return res.json();
    },
  });

  const requestActionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'confirm' | 'decline' }) => {
      const res = await fetch('/api/user/repost-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, action }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-summary'] });
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      setCampaignError(null);
      const res = await fetch('/api/user/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musicUrn: selectedTrackUrn,
          musicType: 'track',
          budgetCredits: campaignBudget,
          title: 'New Track Campaign',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create campaign');
      return json;
    },
    onSuccess: () => {
      setShowCampaignsModal(false);
      setSelectedTrackUrn(null);
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-summary'] });
    },
    onError: (err: Error) => {
      setCampaignError(err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6" />
          ))}
        </div>
      </div>
    );
  }

  const user = data?.user || { name: 'SoundCloud Artist', urn: 'soundcloud:users:999001' };
  const kpis = data?.kpis || {
    availableCredits: 250,
    creditsChangePercent: 18.5,
    activeCampaigns: 2,
    campaignsChangePercent: 12.0,
    repostsReceived: 48,
    repostsChangePercent: 24.5,
    credibilityScore: 96.4,
    credibilityChangePercent: 4.2,
  };
  const recentTracks = data?.recentTracks || [];
  const pendingRequests = data?.pendingRequests || [];
  const genreBreakdown = data?.genreBreakdown || [
    { genre: 'Electronic', count: 14 },
    { genre: 'Melodic Techno', count: 9 },
    { genre: 'Deep House', count: 7 },
    { genre: 'Progressive', count: 5 },
  ];

  // SVG Chart data points for Followers & Repost Reach
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const followersPoints = [30, 42, 38, 55, 64, 72, 88];
  const reachPoints = [20, 35, 50, 48, 70, 82, 95];

  const copyReferralLink = () => {
    navigator.clipboard?.writeText(`https://repostchain.com/?ref=${user.urn.slice(-6).toUpperCase()}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div>
      {/* Top Row + 4 KPI Cards - Exact match to resources/views/livewire/user/dashboard.blade.php */}
      <div className="p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Welcome back! <span className="font-semibold text-orange-500">{user.name}</span>.
              Here&apos;s an overview of your RepostChain activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/user/campaign-management/campaigns"
              className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-100 text-orange-800 hover:bg-orange-200 active:bg-orange-300 px-4 py-2 text-base"
            >
              💰 Earn Credits
            </Link>

            <button
              type="button"
              onClick={() => setShowCampaignsModal(true)}
              className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 px-4 py-2 text-base cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-1" />
              Start a new campaign
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Available Credits */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:-translate-y-2 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-white text-sm font-medium">
                Available Credits
              </h3>
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-700 dark:text-white">
                {Number(kpis.availableCredits).toFixed(2)}
              </p>
              <p
                className={`text-sm flex items-center space-x-1 ${
                  kpis.creditsChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <span>
                  {kpis.creditsChangePercent >= 0 ? '+' : ''}
                  {Number(kpis.creditsChangePercent).toFixed(2)}% from last week
                </span>
              </p>
            </div>
          </div>

          {/* Card 2: Active Campaigns */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:-translate-y-2 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-white text-sm font-medium">
                Active Campaigns
              </h3>
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                <Music className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-700 dark:text-white">
                {Number(kpis.activeCampaigns).toFixed(2)}
              </p>
              <p
                className={`text-sm flex items-center space-x-1 ${
                  kpis.campaignsChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <span>
                  {kpis.campaignsChangePercent >= 0 ? '+' : ''}
                  {Number(kpis.campaignsChangePercent).toFixed(2)}% from last week
                </span>
              </p>
            </div>
          </div>

          {/* Card 3: Reposts Received */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:-translate-y-2 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-white text-sm font-medium">
                Reposts Received
              </h3>
              <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                <Repeat2 className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-700 dark:text-white">
                {Number(kpis.repostsReceived).toFixed(2)}
              </p>
              <p
                className={`text-sm flex items-center space-x-1 ${
                  kpis.repostsChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <span>
                  {kpis.repostsChangePercent >= 0 ? '+' : ''}
                  {Number(kpis.repostsChangePercent).toFixed(2)}% from last week
                </span>
              </p>
            </div>
          </div>

          {/* Card 4: Credibility Score */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:-translate-y-2 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-white text-sm font-medium">
                Credibility Score
              </h3>
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-500">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-700 dark:text-white">
                {Number(kpis.credibilityScore).toFixed(2)}%
              </p>
              <p
                className={`text-sm flex items-center space-x-1 ${
                  kpis.credibilityChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <span>
                  {kpis.credibilityChangePercent >= 0 ? '+' : ''}
                  {Number(kpis.credibilityChangePercent).toFixed(2)}% from last week
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid - Charts + Recent Tracks + Latest Repost Requests */}
      <div className="p-2 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 dark:text-white">
          {/* Left Section: Performance Overview Chart */}
          <div className="lg:col-span-2 rounded-lg p-4 shadow-sm bg-white dark:bg-slate-800">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center p-2">
              <div>
                <h2 className="dark:text-white text-lg font-semibold">Performance Overview</h2>
                <p className="text-sm text-slate-400">Track the impact of your campaigns</p>
              </div>
              <Link
                href="/user/analytics"
                className="text-orange-400 text-sm font-medium mt-4 sm:mt-0 hover:text-orange-300 transition-colors"
              >
                View all →
              </Link>
            </div>

            {/* Interactive SVG Line Chart matching Chart.js Followers (#f5540b) & Repost Reach (#3bdeff) */}
            <div className="p-4">
              <div className="flex items-center justify-center gap-6 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f5540b] inline-block" />
                  <span className="text-slate-600 dark:text-slate-300">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3bdeff] inline-block" />
                  <span className="text-slate-600 dark:text-slate-300">Repost Reach</span>
                </div>
              </div>

              <div className="relative h-72 w-full">
                <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                  {/* Horizontal Grid Lines */}
                  {[0, 60, 120, 180, 220].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke="currentColor"
                      className="text-gray-100 dark:text-slate-700/60"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Followers Line (#f5540b) */}
                  <polyline
                    fill="none"
                    stroke="#f5540b"
                    strokeWidth="3"
                    points={followersPoints
                      .map((v, i) => `${60 + i * 100},${220 - v * 2}`)
                      .join(' ')}
                  />
                  {followersPoints.map((v, i) => (
                    <circle
                      key={`f-${i}`}
                      cx={60 + i * 100}
                      cy={220 - v * 2}
                      r="4.5"
                      fill="#f5540b"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Repost Reach Line (#3bdeff) */}
                  <polyline
                    fill="none"
                    stroke="#3bdeff"
                    strokeWidth="3"
                    points={reachPoints
                      .map((v, i) => `${60 + i * 100},${220 - v * 2}`)
                      .join(' ')}
                  />
                  {reachPoints.map((v, i) => (
                    <circle
                      key={`r-${i}`}
                      cx={60 + i * 100}
                      cy={220 - v * 2}
                      r="4.5"
                      fill="#3bdeff"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* X-axis Labels */}
                  {chartLabels.map((label, i) => (
                    <text
                      key={label}
                      x={60 + i * 100}
                      y="238"
                      textAnchor="middle"
                      className="fill-slate-400 text-[11px]"
                    >
                      {label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section: Genre Distribution + Referral Widget */}
          <div className="rounded-lg p-4 sm:p-6 shadow-sm bg-white dark:bg-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="dark:text-white text-lg font-semibold">Genre Distribution</h3>
              <p className="text-slate-400 text-sm mb-5">What your audience listens to</p>

              {/* Genre Donut Visualization */}
              <div className="flex justify-center my-4">
                <div className="relative w-44 h-44 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      'conic-gradient(#ff6b35 0deg 140deg, #10b981 140deg 230deg, #8b5cf6 230deg 300deg, #f59e0b 300deg 360deg)',
                  }}
                >
                  <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400">Top Genre</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {genreBreakdown[0]?.genre || 'Electronic'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-xs mt-4">
                {genreBreakdown.map((g: { genre: string; count: number }, idx: number) => {
                  const color = GENRE_COLORS[idx % GENRE_COLORS.length];
                  return (
                    <div key={g.genre} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium" style={{ color }}>
                        {g.genre}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inline Referral Widget matching @livewire('user.referral-widget', ['mode' => 'inline']) */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="bg-orange-50/70 dark:bg-slate-700/50 rounded-xl p-4 border border-orange-200/60 dark:border-slate-600">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                  Invite Artists &amp; Earn Free Credits
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-300 mb-3">
                  Share your referral link and earn bonus credits for every artist who joins.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://repostchain.com/?ref=${user.urn.slice(-6).toUpperCase()}`}
                    className="flex-1 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={copyReferralLink}
                    className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedReferral ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Section: Recent Tracks */}
          <div className="lg:col-span-2 rounded-lg p-4 shadow-sm bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-lg font-semibold">Recent Tracks</h3>
                <p className="text-slate-400 text-sm">Your latest submissions</p>
              </div>
              {recentTracks.length > 0 && (
                <Link
                  className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                  href="/user/my-account"
                >
                  View all →
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {recentTracks.length > 0 ? (
                recentTracks.map((track: {
                  id: string;
                  urn: string;
                  title: string;
                  permalink_url?: string | null;
                  artwork_url?: string | null;
                  genre?: string | null;
                  author_username?: string | null;
                }) => (
                  <SoundCloudPlayer key={track.id || track.urn} track={track} visual={false} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="font-medium mb-2">No upcoming campaigns scheduled</h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Submit a track to start a new campaign
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCampaignsModal(true)}
                    className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 text-base cursor-pointer"
                  >
                    <Plus className="inline-block h-4 w-4 text-white mr-1" />
                    Create Campaign
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Right Section: Latest Repost Requests */}
          <div className="rounded-lg shadow-sm p-4 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between p-2">
              <div>
                <h3 className="text-lg font-semibold">Latest Repost Requests</h3>
              </div>
              {pendingRequests.length > 0 && (
                <Link
                  className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                  href="/user/reposts-request"
                >
                  View all →
                </Link>
              )}
            </div>

            {pendingRequests.length > 0 ? (
              <div className="space-y-4 mt-2">
                {pendingRequests.map(
                  (
                    req: {
                      id: string;
                      credits_spent: number;
                      requester?: { name?: string; avatar?: string };
                      music?: { title?: string; genre?: string };
                    },
                    index: number
                  ) => (
                    <div
                      key={req.id}
                      className="shadow-sm border border-gray-100 dark:border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between text-sm mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-500 font-bold">#{index + 1}</span>
                          <span className="text-sm max-w-[200px] truncate">
                            {req.music?.title || 'Untitled Track'}
                          </span>
                        </div>
                        <span className="text-slate-400">{req.music?.genre || 'Electronic'}</span>
                      </div>
                      <div className="flex items-start space-x-3 mb-3">
                        <img
                          src={req.requester?.avatar || '/default_img/no_img.jpg'}
                          className="w-8 h-8 rounded-full object-cover"
                          alt={req.requester?.name || 'Requester'}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">
                            {req.requester?.name || 'Artist'}
                          </h4>
                        </div>
                        <span className="text-orange-500 font-semibold text-sm">
                          +{req.credits_spent ?? 0} credits
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() =>
                              requestActionMutation.mutate({ id: req.id, action: 'decline' })
                            }
                            className="w-full font-medium transition-colors duration-200 rounded-lg inline-flex items-center justify-center bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() =>
                              requestActionMutation.mutate({ id: req.id, action: 'confirm' })
                            }
                            className="w-full font-medium transition-colors duration-200 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 text-sm cursor-pointer"
                          >
                            Repost
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No repost requests available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Choose a track or playlist Modal - Exact match to dashboard.blade.php lines 516-660 */}
      {showCampaignsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <div className="flex items-center gap-3">
                <div>
                  <img
                    src="/assets/favicons/fav icon 1.svg"
                    alt="RepostChain"
                    className="w-10 dark:hidden"
                  />
                  <img
                    src="/assets/favicons/fav icon 2 (1).svg"
                    alt="RepostChain"
                    className="w-10 hidden dark:block"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choose a track or playlist
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCampaignsModal(false)}
                className="cursor-pointer w-10 h-10 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 flex items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                type="button"
                onClick={() => setModalTab('tracks')}
                className={`cursor-pointer flex-1 py-4 px-6 text-center font-semibold text-base transition-all duration-300 ease-in-out border-b-2 hover:bg-white dark:hover:bg-gray-700 ${
                  modalTab === 'tracks'
                    ? 'border-orange-500 text-orange-600 bg-white dark:bg-gray-700'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Music className="w-4 h-4" />
                  Tracks
                </div>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('playlists')}
                className={`cursor-pointer flex-1 py-4 px-6 text-center font-semibold text-base transition-all duration-300 ease-in-out border-b-2 hover:bg-white dark:hover:bg-gray-700 ${
                  modalTab === 'playlists'
                    ? 'border-orange-500 text-orange-600 bg-white dark:bg-gray-700'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ListMusic className="w-4 h-4" />
                  Playlists
                </div>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {modalTab === 'tracks'
                    ? 'Paste a SoundCloud track link'
                    : 'Paste a SoundCloud playlist link'}
                </label>
                <div className="flex w-full mt-2">
                  <input
                    type="text"
                    value={trackSearchQuery}
                    onChange={(e) => setTrackSearchQuery(e.target.value)}
                    placeholder={
                      modalTab === 'tracks'
                        ? 'Paste a SoundCloud track link'
                        : 'Paste a SoundCloud playlist link'
                    }
                    className="flex-grow p-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-500 border-2 border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    className="bg-orange-500 text-white p-3 w-14 flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {campaignError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                  {campaignError}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Select a track to promote:
                </p>
                {recentTracks.map(
                  (t: {
                    id: string;
                    urn: string;
                    title: string;
                    genre?: string;
                    artwork_url?: string;
                  }) => (
                    <div
                      key={t.urn}
                      onClick={() => setSelectedTrackUrn(t.urn)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTrackUrn === t.urn
                          ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/30'
                          : 'border-gray-200 dark:border-slate-700 hover:border-orange-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={t.artwork_url || '/default_img/no_img.jpg'}
                          alt={t.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {t.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t.genre || 'Electronic'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-orange-500">
                        {selectedTrackUrn === t.urn ? 'Selected ✓' : 'Select'}
                      </span>
                    </div>
                  )
                )}
              </div>

              {selectedTrackUrn && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Campaign Budget (Credits):
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      step={10}
                      value={campaignBudget}
                      onChange={(e) => setCampaignBudget(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-right font-bold text-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={createCampaignMutation.isPending}
                    onClick={() => createCampaignMutation.mutate()}
                    className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold cursor-pointer"
                  >
                    {createCampaignMutation.isPending
                      ? 'Launching Campaign...'
                      : `Launch Campaign (${campaignBudget} Credits)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
