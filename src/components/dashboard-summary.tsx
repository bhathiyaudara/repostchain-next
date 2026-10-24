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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-2 gap-4 lg:col-span-2">
          {/* Stat Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <span>
                <BarChart2 className="w-6 h-6 text-orange-500" />
              </span>
              <span className="text-sm font-medium text-[#718096] dark:text-gray-100">
                Earnings per Repost
              </span>
            </div>
            <div className="text-xl font-semibold mt-3 text-slate-900 dark:text-gray-100">
              {earnings}
            </div>
          </div>

          {/* Repost Limit */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <div className="flex items-center gap-2 font-medium">
              <span>
                <Gauge className="w-6 h-6 text-orange-500" />
              </span>
              <span className="text-sm font-medium text-[#718096] dark:text-gray-100">
                Daily repost limit
              </span>
            </div>
            <div className="text-xl font-semibold mt-3 text-slate-900 dark:text-gray-100">
              {dailyRepostCurrent}/{dailyRepostMax}
            </div>
            <div className="mt-2 bg-[#e2e8f0] dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full transition-all duration-500"
                style={{ width: `${repostPercentage}%` }}
              />
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <div className="flex items-center gap-2 font-medium">
              <span>
                <Percent className="w-6 h-6 text-orange-500" />
              </span>
              <span className="text-sm font-medium text-[#718096] dark:text-gray-100">
                Response Rate
              </span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="text-xl font-semibold text-slate-900 dark:text-gray-100">
                {responseRate}%
              </div>
              <button
                type="button"
                disabled={!canResetResponseRate}
                onClick={onResetResponseRate}
                className={`text-sm font-semibold text-orange-500 ${
                  canResetResponseRate
                    ? 'hover:underline cursor-pointer'
                    : '!cursor-not-allowed opacity-60'
                }`}
              >
                Reset
              </button>
            </div>
            <div className="mt-2 bg-[#e2e8f0] dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${responseRate}%` }} />
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <span>
                <Bell className="w-6 h-6 text-orange-500" />
              </span>
              <span className="text-sm font-medium text-[#718096] dark:text-gray-100">
                Pending Direct Requests
              </span>
            </div>
            <div className="text-xl font-semibold mt-3 text-slate-900 dark:text-gray-100">
              {pendingRequests} / {requestLimit}
            </div>
            <Link
              href="/user/plans"
              className="inline-block mt-2 text-sm font-semibold text-orange-500 hover:underline"
            >
              Get higher limit
            </Link>
          </div>
        </div>

        {/* Promotion Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
            Promotion Stats
          </h3>

          <div className="flex justify-around text-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <span>
                  <CreditCard className="w-6 h-6 text-orange-500" />
                </span>
                <div className="text-xl font-semibold text-slate-900 dark:text-gray-100">
                  {credits}
                </div>
              </div>
              <div className="text-sm font-medium text-[#718096] dark:text-gray-100">
                Available Credits
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <span>
                  <Signal className="w-6 h-6 text-orange-500" />
                </span>
                <div className="text-xl font-semibold text-slate-900 dark:text-gray-100">
                  {campaigns}/{campaignLimit}
                </div>
              </div>
              <div className="text-sm font-medium text-[#718096] dark:text-gray-100">
                Active Campaign Limit
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <Link
              href="/user/plans"
              className="flex items-center justify-center gap-2 text-sm font-semibold py-2 bg-orange-500 text-white rounded-lg hover:opacity-90 transition"
            >
              <span>
                <Rocket className="w-6 h-6 text-white" />
              </span>
              Upgrade plan
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow min-h-56 hidden 2xl:block">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-50 mb-2">
            About Direct Requests
          </h2>
          <p className="text-sm text-[#718096] dark:text-gray-100">
            Direct Requests allow artists to connect and collaborate directly with other creators on
            RepostChain. Instead of waiting for repost campaigns, you can manually send a request to
            another user, playlist, or curator. This feature gives you full control to choose who
            you want to network with, build relationships, and promote your tracks more
            strategically.
          </p>
          <p className="text-sm text-[#718096] dark:text-gray-100 mt-2">
            You can include a personal message with your Direct Request to explain why your music
            fits their audience — making your outreach more authentic and effective.
          </p>
        </div>
      </div>
    </section>
  );
}
