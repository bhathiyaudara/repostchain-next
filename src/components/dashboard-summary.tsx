'use client';

import Link from 'next/link';
import {
  BarChart2,
  Gauge,
  Percent,
  Bell,
  CreditCard,
  Signal,
  Rocket,
  Sparkles,
} from 'lucide-react';

interface DashboardSummaryProps {
  earnings?: number;
  dailyRepostCurrent?: number;
  dailyRepostMax?: number;
  responseRate?: number;
  pendingRequests?: number;
  requestLimit?: number;
  credits?: number;
  campaigns?: number;
  campaignLimit?: number;
  canResetResponseRate?: boolean;
  onResetResponseRate?: () => void;
}

export function DashboardSummary({
  earnings = 1,
  dailyRepostCurrent = 0,
  dailyRepostMax = 20,
  responseRate = 100,
  pendingRequests = 0,
  requestLimit = 20,
  credits = 0,
  campaigns = 0,
  campaignLimit = 2,
  canResetResponseRate = false,
  onResetResponseRate,
}: DashboardSummaryProps) {
  const repostPercentage =
    dailyRepostMax > 0 ? Math.min(100, (dailyRepostCurrent / dailyRepostMax) * 100) : 0;

  return (
    <section>
      <div className="max-w-screen-xl h-full mx-auto flex flex-col gap-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-2 gap-3.5">
          {/* Earnings per Repost */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="rounded-[15px] bg-[#121212] p-4 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500]">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Earnings / Repost
                </span>
              </div>
              <div className="text-2xl font-black font-mono mt-3 text-white">
                +{earnings} <span className="text-xs font-sans font-medium text-zinc-500">credit</span>
              </div>
            </div>
          </div>

          {/* Daily Repost Limit */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="rounded-[15px] bg-[#121212] p-4 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500]">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Daily Reposts
                </span>
              </div>
              <div className="text-2xl font-black font-mono mt-3 text-white">
                {dailyRepostCurrent}
                <span className="text-base text-zinc-500 font-normal"> / {dailyRepostMax}</span>
              </div>
              <div className="mt-2 bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF5500] to-[#FF7730] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${repostPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Response Rate */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="rounded-[15px] bg-[#121212] p-4 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500]">
                  <Percent className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Response Rate
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-3">
                <div className="text-2xl font-black font-mono text-white">
                  {responseRate}%
                </div>
                <button
                  type="button"
                  disabled={!canResetResponseRate}
                  onClick={onResetResponseRate}
                  className={`text-xs font-bold uppercase tracking-wider text-[#FF5500] ${
                    canResetResponseRate
                      ? 'hover:underline cursor-pointer'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  Reset
                </button>
              </div>
              <div className="mt-2 bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full rounded-full"
                  style={{ width: `${responseRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="rounded-[15px] bg-[#121212] p-4 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500]">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Direct Requests
                </span>
              </div>
              <div className="text-2xl font-black font-mono mt-3 text-white">
                {pendingRequests}
                <span className="text-base text-zinc-500 font-normal"> / {requestLimit}</span>
              </div>
              <Link
                href="/user/plans"
                className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-[#FF5500] hover:underline"
              >
                Higher Limit &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Promotion Stats Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl">
          <div className="rounded-[15px] bg-[#121212] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="sc-display text-sm font-black text-white tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5500]" />
                <span>PROMOTION STATS</span>
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/5">
                LIVE TIER
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <CreditCard className="w-4 h-4 text-[#FF5500]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Credits</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {credits}
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">Available</span>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Signal className="w-4 h-4 text-[#FF5500]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Campaigns</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {campaigns}
                  <span className="text-xs text-zinc-500 font-normal">/{campaignLimit}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">Active Limit</span>
              </div>
            </div>

            <div>
              <Link
                href="/user/plans"
                className="sc-pill-orange w-full py-3 text-xs font-black tracking-wider uppercase shadow-lg shadow-[#FF5500]/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Upgrade Plan & Limits</span>
              </Link>
            </div>
          </div>
        </div>

        {/* About Direct Requests Explainer Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-xl min-h-56 hidden 2xl:block">
          <div className="rounded-[15px] bg-[#121212] p-5 h-full">
            <h2 className="sc-display text-sm font-black text-white tracking-wider mb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              <span>ABOUT DIRECT REQUESTS</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Direct Requests allow artists to connect and collaborate directly with other creators on
              RepostChain. Instead of waiting for repost campaigns, you can manually send a request to
              another user, playlist, or curator. This feature gives you full control to choose who
              you want to network with, build relationships, and promote your tracks more strategically.
            </p>
            <p className="text-xs text-zinc-500 mt-2.5 leading-relaxed font-normal">
              You can include a personal message with your Direct Request to explain why your music
              fits their audience — making your outreach authentic and effective.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
