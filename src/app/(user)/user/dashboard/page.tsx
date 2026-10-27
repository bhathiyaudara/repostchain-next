'use client';

import { useState, useMemo } from 'react';
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
  TrendingUp,
  Sparkles,
  Coins,
  Radio,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { RepostChainMark, SoundCloudMark } from '@/components/public-layout';

const GENRE_COLORS = ['#FF5500', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#3B82F6'];
const SOUNDCLOUD_REFERRAL_URL =
  process.env.NEXT_PUBLIC_SOUNDCLOUD_REFERRAL_URL || 'https://invite.soundcloud.com/pjoy4';

export default function UserDashboardPage() {
  const queryClient = useQueryClient();
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [modalTab, setModalTab] = useState<'tracks' | 'playlists'>('tracks');
  const [trackSearchQuery, setTrackSearchQuery] = useState('');
  const [selectedTrackUrn, setSelectedTrackUrn] = useState<string | null>(null);
  const [campaignBudget, setCampaignBudget] = useState(50);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'both' | 'followers' | 'reach'>('both');
  const [referralEmail, setReferralEmail] = useState('');

  const handleClaimSoundCloud = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(SOUNDCLOUD_REFERRAL_URL, '_blank', 'noopener,noreferrer');
  };

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
          musicType: modalTab === 'playlists' ? 'playlist' : 'track',
          budgetCredits: campaignBudget,
          title: 'New Campaign',
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

  // SVG Chart points
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const followersPoints = [30, 42, 38, 55, 64, 72, 88];
  const reachPoints = [20, 35, 50, 48, 70, 82, 95];

  const chartPaths = useMemo(() => {
    const width = 640;
    const height = 220;
    const paddingX = 40;
    const paddingY = 30;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;
    const stepX = chartW / (chartLabels.length - 1);

    const getCoords = (pts: number[]) => {
      return pts.map((val, idx) => ({
        x: paddingX + idx * stepX,
        y: height - paddingY - (val / 100) * chartH,
      }));
    };

    const makeSmoothPath = (pts: number[]) => {
      const coords = getCoords(pts);
      let d = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const curr = coords[i];
        const next = coords[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 2;
        const cp1y = curr.y;
        const cp2x = curr.x + (next.x - curr.x) / 2;
        const cp2y = next.y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
      }
      const area = `${d} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
      return { line: d, area, coords };
    };

    return {
      followers: makeSmoothPath(followersPoints),
      reach: makeSmoothPath(reachPoints),
      width,
      height,
      paddingY,
    };
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard?.writeText(
      `https://growmusicians.com/?ref=${user.urn ? user.urn.slice(-6).toUpperCase() : 'VIP'}`
    );
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-14 bg-white/[0.04] rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-white/[0.04] rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/[0.04] rounded-2xl" />
          <div className="h-96 bg-white/[0.04] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="sc-dash space-y-8 max-w-7xl mx-auto pb-12">
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
                  CREATOR HUB
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-[#FF5500] font-bold">LIVE METRICS</span>
              </div>

              {/* Bold All-Caps Display Headline */}
              <h1 className="sc-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">
                WELCOME BACK, <span className="text-[#FF5500]">{user.name?.toUpperCase()}</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Monitor your live repost campaigns, track listener velocity, and circulation across
                5,000+ verified SoundCloud artists.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/user/campaign-management/campaigns"
                className="sc-pill-dark px-5 py-3 text-xs sm:text-sm font-bold border border-white/15 hover:border-white/40 transition-all"
              >
                <Coins className="w-4 h-4 text-[#FF5500]" />
                <span>Earn Credits</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowCampaignsModal(true)}
                className="sc-pill-white px-6 py-3 text-xs sm:text-sm font-bold shadow-xl shadow-white/5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 4 EDITORIAL KPI CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Available Credits */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="rounded-[15px] bg-[#121212] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                AVAILABLE CREDITS
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="sc-display text-4xl sm:text-[42px] font-black text-white tracking-tight leading-none mb-2">
                {Number(kpis.availableCredits).toFixed(0)}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  +{Number(kpis.creditsChangePercent).toFixed(1)}% this week
                </span>
                <Link
                  href="/user/billing"
                  className="text-zinc-400 hover:text-white font-medium text-[11px] transition-colors"
                >
                  Add +
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Campaigns */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="rounded-[15px] bg-[#121212] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                ACTIVE CAMPAIGNS
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                <Music className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="sc-display text-4xl sm:text-[42px] font-black text-white tracking-tight leading-none mb-2">
                {Number(kpis.activeCampaigns).toFixed(0)}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1.5 text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Live in artist loop
                </span>
                <Link
                  href="/user/campaign-management/my-campaigns"
                  className="text-[#FF5500] hover:text-white font-medium text-[11px] transition-colors"
                >
                  Manage →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Reposts Received */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="rounded-[15px] bg-[#121212] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                REPOSTS RECEIVED
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <Repeat2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="sc-display text-4xl sm:text-[42px] font-black text-white tracking-tight leading-none mb-2">
                {Number(kpis.repostsReceived).toFixed(0)}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  +{Number(kpis.repostsChangePercent).toFixed(1)}% organic reach
                </span>
                <Link
                  href="/user/analytics"
                  className="text-zinc-400 hover:text-white font-medium text-[11px] transition-colors"
                >
                  Stats →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Credibility Score */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="rounded-[15px] bg-[#121212] p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                CREDIBILITY SCORE
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="sc-display text-4xl sm:text-[42px] font-black text-white tracking-tight leading-none mb-2">
                {Number(kpis.credibilityScore).toFixed(1)}%
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1 text-[#8B5CF6] font-semibold">
                  ★ Verified Artist Status
                </span>
                <span className="text-zinc-500 text-[11px]">Top 5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. PERFORMANCE OVERVIEW CHART + GENRE DISTRIBUTION */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: 2026 SoundCloud Editorial Line Chart (2 Cols) */}
        <div className="lg:col-span-2 relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl">
          <div className="rounded-[15px] bg-[#121212] p-6 sm:p-7 flex flex-col justify-between h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5500]">
                  ANALYTICS VELOCITY
                </span>
                <h2 className="sc-display text-2xl font-black text-white tracking-tight mt-0.5">
                  AUDIENCE REACH &amp; FOLLOWER GROWTH
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Track real listener impressions and follower conversion from RepostChain campaigns
                </p>
              </div>

              {/* Chart Metric Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-full bg-white/[0.04] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveChartMetric('both')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    activeChartMetric === 'both'
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartMetric('followers')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    activeChartMetric === 'followers'
                      ? 'bg-[#FF5500] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Followers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartMetric('reach')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    activeChartMetric === 'reach'
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Reach
                </button>
              </div>
            </div>

            {/* Glowing SVG Analytics Chart */}
            <div className="relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${chartPaths.width} ${chartPaths.height}`} className="w-full h-64 overflow-visible">
                <defs>
                  {/* Followers Orange Glow Gradient */}
                  <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5500" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FF5500" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Reach Blue Glow Gradient */}
                  <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = chartPaths.height - chartPaths.paddingY - (val / 100) * (chartPaths.height - chartPaths.paddingY * 2);
                  return (
                    <g key={val}>
                      <line
                        x1="30"
                        y1={y}
                        x2={chartPaths.width - 30}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="20"
                        y={y + 3}
                        textAnchor="end"
                        className="fill-zinc-600 text-[10px] font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Repost Reach Path */}
                {(activeChartMetric === 'both' || activeChartMetric === 'reach') && (
                  <>
                    <path d={chartPaths.reach.area} fill="url(#reachGradient)" />
                    <path
                      d={chartPaths.reach.line}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {chartPaths.reach.coords.map((c, i) => (
                      <circle
                        key={`r-${i}`}
                        cx={c.x}
                        cy={c.y}
                        r="4"
                        fill="#3B82F6"
                        stroke="#121212"
                        strokeWidth="2"
                        className="hover:scale-150 transition-transform cursor-pointer"
                      />
                    ))}
                  </>
                )}

                {/* Followers Path */}
                {(activeChartMetric === 'both' || activeChartMetric === 'followers') && (
                  <>
                    <path d={chartPaths.followers.area} fill="url(#followerGradient)" />
                    <path
                      d={chartPaths.followers.line}
                      fill="none"
                      stroke="#FF5500"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {chartPaths.followers.coords.map((c, i) => (
                      <circle
                        key={`f-${i}`}
                        cx={c.x}
                        cy={c.y}
                        r="4.5"
                        fill="#FF5500"
                        stroke="#121212"
                        strokeWidth="2"
                        className="hover:scale-150 transition-transform cursor-pointer"
                      />
                    ))}
                  </>
                )}

                {/* X-axis Day Labels */}
                {chartLabels.map((lbl, i) => {
                  const x = 40 + i * ((chartPaths.width - 80) / (chartLabels.length - 1));
                  return (
                    <text
                      key={lbl}
                      x={x}
                      y={chartPaths.height - 8}
                      textAnchor="middle"
                      className="fill-zinc-500 font-mono text-[11px] uppercase tracking-wider"
                    >
                      {lbl}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Legend & Direct Link */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-white/[0.08] text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
                  <span className="text-zinc-300 font-medium">Follower Velocity (+88)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-zinc-300 font-medium">Repost Impressions (+95k)</span>
                </div>
              </div>
              <Link
                href="/user/analytics"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white font-bold transition-colors"
              >
                <span>Full Demographic Reports</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section: SoundCloud Referral Program Card + Creator Referral Hub (1 Col) */}
        <div className="space-y-6">
          {/* Official SoundCloud Referral Program Card: One Free Month of Artist Pro */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl">
            <div className="rounded-[15px] bg-[#121212] p-6 sm:p-7 relative overflow-hidden">
              {/* Subtle ambient accent glow */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
                    <SoundCloudMark className="w-3.5 h-3.5" />
                    SOUNDCLOUD PARTNER PROGRAM
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    FREE 30 DAYS
                  </span>
                </div>

                <h3 className="sc-display text-2xl font-black text-white tracking-tight leading-tight mt-1">
                  One Free Month of Artist Pro
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  You&apos;ve been given a free month of our best plan for music creators! Enter your email below to get started. If you decide to purchase, the person who referred you will earn a reward.
                </p>

                {/* Email submission form linking to the referral program */}
                <form onSubmit={handleClaimSoundCloud} className="mt-5 space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={referralEmail}
                      onChange={(e) => setReferralEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full text-xs sm:text-sm bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] transition-colors"
                    />
                  </div>

                  <a
                    href={SOUNDCLOUD_REFERRAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#FF5500] hover:bg-[#FF6611] text-white font-extrabold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-lg shadow-[#FF5500]/25 hover:scale-[1.01] cursor-pointer text-center"
                  >
                    <span>Claim Free Month of Artist Pro</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </form>

                <p className="text-[11px] text-zinc-500 text-center mt-3">
                  Official SoundCloud referral offer • Free trial terms apply
                </p>
              </div>
            </div>
          </div>

          {/* Artist Referral Multiplier Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#FF5500]/30 to-white/[0.02] p-[1px] shadow-xl">
            <div className="rounded-[15px] bg-[#121212] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  +10 FREE CREDITS
                </span>
                <span className="text-xs font-mono text-zinc-400">Referral Code</span>
              </div>
              <h4 className="sc-display text-lg font-black text-white tracking-tight mt-1">
                INVITE ARTISTS, MULTIPLY REACH
              </h4>
              <p className="text-zinc-400 text-xs mt-1 mb-4 leading-relaxed">
                Earn 10 bonus campaign credits for every SoundCloud creator who joins via your link.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://growmusicians.com/?ref=${user.urn ? user.urn.slice(-6).toUpperCase() : 'VIP'}`}
                  className="flex-1 text-xs bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-200 font-mono select-all focus:outline-none focus:border-[#FF5500]"
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="sc-pill-orange px-4 py-2.5 text-xs font-bold cursor-pointer shrink-0"
                >
                  {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. RECENT TRACKS & REPOST REQUESTS QUEUE */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Track Campaigns (2 Cols) */}
        <div className="lg:col-span-2 relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl">
          <div className="rounded-[15px] bg-[#121212] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5500]">
                  SOUNDCLOUD DISCOVERY
                </span>
                <h3 className="sc-display text-2xl font-black text-white tracking-tight mt-0.5">
                  RECENT TRACK CAMPAIGNS
                </h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Tracks circulating in the active RepostChain exchange queue
                </p>
              </div>
              {recentTracks.length > 0 && (
                <Link
                  href="/user/my-account"
                  className="text-[#FF5500] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  View All Catalogue →
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
                  playback_count?: number;
                }) => (
                  <div
                    key={track.id || track.urn}
                    className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 sm:p-4 hover:border-white/20 transition-all group"
                  >
                    <SoundCloudPlayer track={track} visual={false} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                    <Music className="w-7 h-7 text-[#FF5500]" />
                  </div>
                  <h4 className="sc-display text-xl font-bold text-white mb-1">
                    NO CAMPAIGNS CURRENTLY RUNNING
                  </h4>
                  <p className="text-zinc-400 text-xs max-w-sm mx-auto mb-5">
                    Launch your first repost campaign to get your tracks shared across real listener
                    follower streams.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCampaignsModal(true)}
                    className="sc-pill-white px-6 py-2.5 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Campaign Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Direct Repost Requests (1 Col) */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl">
          <div className="rounded-[15px] bg-[#121212] p-6 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5500]">
                    COLLABORATION QUEUE
                  </span>
                  <h3 className="sc-display text-xl font-black text-white tracking-tight mt-0.5">
                    REPOST REQUESTS
                  </h3>
                </div>
                {pendingRequests.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500] text-white text-[11px] font-bold">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-xs mb-5">
                Artists requesting reposts on your SoundCloud profile
              </p>

              {pendingRequests.length > 0 ? (
                <div className="space-y-3.5">
                  {pendingRequests.map(
                    (
                      req: {
                        id: string;
                        credits_spent: number;
                        requester?: { name?: string; avatar?: string };
                        music?: { title?: string; genre?: string; artwork_url?: string };
                      },
                      idx: number
                    ) => (
                      <div
                        key={req.id}
                        className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs mb-2.5 pb-2 border-b border-white/[0.06]">
                          <span className="text-zinc-500 font-mono">#{idx + 1} DIRECT REQUEST</span>
                          <span className="text-[#FF5500] font-black text-xs">
                            +{req.credits_spent ?? 1} CREDITS
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={req.requester?.avatar || '/default_img/no_img.jpg'}
                            alt={req.requester?.name || 'Artist'}
                            className="w-10 h-10 rounded-full object-cover border border-[#FF5500]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">
                              {req.music?.title || 'Untitled Track'}
                            </h4>
                            <p className="text-xs text-zinc-400 truncate">
                              By {req.requester?.name || 'SoundCloud Artist'}
                            </p>
                          </div>
                        </div>

                        {/* Dual Accept / Decline Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              requestActionMutation.mutate({ id: req.id, action: 'decline' })
                            }
                            disabled={requestActionMutation.isPending}
                            className="w-full py-2 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              requestActionMutation.mutate({ id: req.id, action: 'confirm' })
                            }
                            disabled={requestActionMutation.isPending}
                            className="sc-pill-white w-full py-2 text-xs font-bold cursor-pointer"
                          >
                            <Repeat2 className="w-3.5 h-3.5" />
                            <span>Repost</span>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <CheckCircle2 className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-300 font-semibold text-sm">All caught up!</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    No pending direct repost requests right now.
                  </p>
                </div>
              )}
            </div>

            {pendingRequests.length > 0 && (
              <div className="pt-4 mt-4 border-t border-white/[0.08]">
                <Link
                  href="/user/reposts-request"
                  className="w-full block text-center py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-zinc-300 transition-colors"
                >
                  View All Requests Queue →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. 2026 SOUNDCLOUD CAMPAIGN LAUNCH MODAL */}
      {/* ========================================================= */}
      {showCampaignsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#121212] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center">
                  <RepostChainMark className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]" />
                </div>
                <div>
                  <h2 className="sc-display text-2xl font-black text-white tracking-tight">
                    LAUNCH CAMPAIGN
                  </h2>
                  <p className="text-xs text-zinc-400">Promote your track across the artist chain</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCampaignsModal(false)}
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Type Pills */}
            <div className="flex gap-2 p-4 border-b border-white/[0.08] bg-white/[0.01]">
              <button
                type="button"
                onClick={() => setModalTab('tracks')}
                className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  modalTab === 'tracks'
                    ? 'bg-white text-black'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Single Track</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('playlists')}
                className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  modalTab === 'playlists'
                    ? 'bg-white text-black'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white'
                }`}
              >
                <ListMusic className="w-4 h-4" />
                <span>Playlist / Album</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Paste SoundCloud {modalTab === 'tracks' ? 'Track' : 'Playlist'} Link:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={trackSearchQuery}
                      onChange={(e) => setTrackSearchQuery(e.target.value)}
                      placeholder={`https://soundcloud.com/artist/${modalTab === 'tracks' ? 'track-name' : 'sets/playlist'}`}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-[#FF5500] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    className="sc-pill-orange px-5 py-3 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {campaignError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
                  {campaignError}
                </div>
              )}

              {/* Select Existing Track */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                  Or choose from your synced SoundCloud catalogue:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {recentTracks.length > 0 ? (
                    recentTracks.map(
                      (t: {
                        id: string;
                        urn: string;
                        title: string;
                        genre?: string;
                        artwork_url?: string;
                      }) => {
                        const isSelected = selectedTrackUrn === t.urn;
                        return (
                          <div
                            key={t.urn}
                            onClick={() => setSelectedTrackUrn(t.urn)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF5500]/15 border-[#FF5500] text-white shadow-lg shadow-[#FF5500]/10'
                                : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={t.artwork_url || '/default_img/no_img.jpg'}
                                alt={t.title}
                                className="w-11 h-11 rounded-lg object-cover border border-white/10"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                                }}
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-white truncate">{t.title}</h4>
                                <span className="text-[11px] text-zinc-400">{t.genre || 'Electronic'}</span>
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                isSelected ? 'bg-[#FF5500] text-white' : 'bg-white/[0.06] text-zinc-400'
                              }`}
                            >
                              {isSelected ? 'Selected ✓' : 'Select'}
                            </span>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p className="text-zinc-500 text-xs italic py-4 text-center">
                      No tracks found. Paste a SoundCloud track URL above.
                    </p>
                  )}
                </div>
              </div>

              {/* Budget Allocation */}
              {selectedTrackUrn && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Campaign Credit Budget</h4>
                      <p className="text-xs text-zinc-400">
                        Credits allocated to other artists for reposting this track
                      </p>
                    </div>
                    <div className="sc-display text-2xl font-black text-[#FF5500]">
                      {campaignBudget} <span className="text-xs font-sans text-zinc-400">CREDITS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {[25, 50, 100, 250].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCampaignBudget(preset)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          campaignBudget === preset
                            ? 'bg-[#FF5500] text-white'
                            : 'bg-white/[0.06] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {preset} Credits
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(Number(e.target.value))}
                    className="w-full accent-[#FF5500] cursor-pointer"
                  />

                  <p className="text-[11px] text-zinc-400">
                    Est. Reach: <span className="text-white font-bold">~{Math.round(campaignBudget * 180)} impressions</span> across {Math.round(campaignBudget / 2)} verified artist profiles.
                  </p>

                  <button
                    type="button"
                    disabled={createCampaignMutation.isPending}
                    onClick={() => createCampaignMutation.mutate()}
                    className="sc-pill-white w-full py-3.5 text-sm font-bold shadow-xl shadow-white/5 cursor-pointer mt-2"
                  >
                    {createCampaignMutation.isPending ? (
                      <span>Launching Campaign...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#FF5500]" />
                        <span>Launch Campaign ({campaignBudget} Credits)</span>
                      </>
                    )}
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
