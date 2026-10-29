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
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/80 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Earnings / Repost
              </span>
            </div>
            <div className="text-2xl font-black font-mono mt-3 text-slate-900 dark:text-white">
              +{earnings} <span className="text-xs font-sans font-medium text-slate-400 dark:text-zinc-500">credit</span>
            </div>
          </div>

          {/* Daily Repost Limit */}
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/80 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                <Gauge className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Daily Reposts
              </span>
            </div>
            <div className="text-2xl font-black font-mono mt-3 text-slate-900 dark:text-white">
              {dailyRepostCurrent}
              <span className="text-base text-slate-400 dark:text-zinc-500 font-normal"> / {dailyRepostMax}</span>
            </div>
            <div className="mt-2 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${repostPercentage}%` }}
              />
            </div>
          </div>

          {/* Response Rate */}
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/80 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Response Rate
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-3">
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {responseRate}%
              </div>
              <button
                type="button"
                disabled={!canResetResponseRate}
                onClick={onResetResponseRate}
                className={`text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 ${
                  canResetResponseRate
                    ? 'hover:underline cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Reset
              </button>
            </div>
            <div className="mt-2 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>

          {/* Pending Requests */}
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/80 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Direct Requests
              </span>
            </div>
            <div className="text-2xl font-black font-mono mt-3 text-slate-900 dark:text-white">
              {pendingRequests}
              <span className="text-base text-slate-400 dark:text-zinc-500 font-normal"> / {requestLimit}</span>
            </div>
            <Link
              href="/user/plans"
              className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 hover:underline"
            >
              Higher Limit &rarr;
            </Link>
          </div>
        </div>

        {/* Promotion Stats Card */}
        <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/80 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>PROMOTION STATS</span>
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 font-semibold">
              LIVE TIER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-gray-700/50 p-3 flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 mb-1">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Credits</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {credits}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Available</span>
            </div>

            <div className="rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-gray-700/50 p-3 flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 mb-1">
                <Signal className="w-4 h-4 text-orange-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Campaigns</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {campaigns}
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-normal">/{campaignLimit}</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Active Limit</span>
            </div>
          </div>

          <div>
            <Link
              href="/user/plans"
              className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Upgrade Plan & Limits</span>
            </Link>
          </div>
        </div>

        {/* About Direct Requests Explainer Card */}
        <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/80 p-5 shadow-sm min-h-56 hidden 2xl:block">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>ABOUT DIRECT REQUESTS</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            Direct Requests allow artists to connect and collaborate directly with other creators on
            RepostChain. Instead of waiting for repost campaigns, you can manually send a request to
            another user, playlist, or curator. This feature gives you full control to choose who
            you want to network with, build relationships, and promote your tracks more strategically.
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2.5 leading-relaxed font-normal">
            You can include a personal message with your Direct Request to explain why your music
            fits their audience — making your outreach authentic and effective.
          </p>
        </div>
      </div>
    </section>
  );
}
