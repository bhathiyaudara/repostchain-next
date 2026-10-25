'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  ExternalLink,
  TrendingUp,
  CheckCircle,
  XCircle,
  Ban,
  SquarePen,
  Repeat,
  UserPlus,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { DashboardSummary } from '@/components/dashboard-summary';

export default function MyCampaignsPage() {
  const [activeMainTab, setActiveMainTab] = useState<'all' | 'active' | 'completed'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['my-campaigns', activeMainTab],
    queryFn: async () => {
      const res = await fetch('/api/user/campaigns');
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

  const allCampaigns = data?.campaigns || [];
  const campaigns = allCampaigns.filter((c: { status?: number }) => {
    if (activeMainTab === 'active') return c.status === 1 || c.status === undefined;
    if (activeMainTab === 'completed') return c.status === 2;
    return true;
  });

  return (
    <section>
      <div className="md:p-6">
        {/* Header - Exact match to my-campaign.blade.php */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <div>
            <h1 className="text-xl text-black dark:text-gray-100 font-bold">My Campaigns</h1>
          </div>

          <Link
            href="/user/dashboard"
            className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 text-base"
          >
            <Plus className="w-5 h-5 mr-1" />
            Start a new campaign
          </Link>
        </div>

        {/* Underline Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex overflow-x-auto no-scrollbar whitespace-nowrap space-x-4 sm:space-x-8">
              <button
                type="button"
                onClick={() => setActiveMainTab('all')}
                className={`tab-button py-3 px-2 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                  activeMainTab === 'all'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ALL Campaigns
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('active')}
                className={`tab-button py-3 px-2 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                  activeMainTab === 'active'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('completed')}
                className={`tab-button py-3 px-2 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                  activeMainTab === 'completed'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
            </nav>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row justify-between gap-6">
          {/* Main Content */}
          <div className="w-full min-w-0 flex-1 flex flex-col gap-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : campaigns.length > 0 ? (
              campaigns.map(
                (campaign: {
                  id: string;
                  budget_credits: number;
                  credits_spent: number;
                  status?: number;
                  is_featured?: number;
                  is_boost?: number;
                  created_at?: string;
                  followers_count?: number;
                  like_count?: number;
                  comment_count?: number;
                  music?: {
                    title?: string;
                    artwork_url?: string;
                    permalink_url?: string;
                  };
                }) => {
                  const isRunning = campaign.status === 1 || campaign.status === undefined;
                  return (
                    <div
                      key={campaign.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 overflow-hidden relative shadow-xs"
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-3 md:gap-4">
                            <img
                              src={campaign.music?.artwork_url || '/default_img/no_img.jpg'}
                              alt={campaign.music?.title || 'Track'}
                              className="w-20 h-20 rounded-lg object-cover shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  '/default_img/no_img.jpg';
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-black dark:text-gray-100 font-semibold text-lg">
                                  {campaign.music?.title || 'Untitled Track'}
                                </h3>
                                {campaign.music?.permalink_url && (
                                  <a
                                    href={campaign.music.permalink_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="cursor-pointer"
                                  >
                                    <ExternalLink className="w-5 h-5 text-gray-500 hover:text-orange-500 transition-colors" />
                                  </a>
                                )}
                                {campaign.is_featured ? (
                                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-orange-500 text-white">
                                    Featured
                                  </span>
                                ) : null}
                                {campaign.is_boost ? (
                                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-orange-500 text-white">
                                    Boosted
                                  </span>
                                ) : null}
                              </div>

                              <div className="mb-4 text-sm text-slate-400">
                                Budget used: {Number(campaign.credits_spent || 0).toLocaleString()}{' '}
                                / {Number(campaign.budget_credits || 50).toLocaleString()} credits
                              </div>
                            </div>
                          </div>

                          {/* Right Stats Block */}
                          <div className="sm:text-right">
                            <div className="flex items-center sm:justify-end">
                              {isRunning ? (
                                <>
                                  <TrendingUp className="mr-1.5 w-5 h-5 text-green-600" />
                                  <span className="text-green-600 dark:text-gray-100 font-medium">
                                    Running
                                  </span>
                                </>
                              ) : campaign.status === 2 ? (
                                <>
                                  <CheckCircle className="mr-1.5 w-5 h-5 text-green-600" />
                                  <span className="text-green-600 dark:text-gray-100 font-medium">
                                    Completed
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="mr-1.5 w-5 h-5 text-red-600" />
                                  <span className="text-red-600 dark:text-gray-100 font-medium">
                                    Stopped
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                              {campaign.created_at
                                ? new Date(campaign.created_at).toLocaleDateString()
                                : 'Active Campaign'}
                            </p>
                            {isRunning && (
                              <div className="flex flex-wrap sm:justify-end items-center gap-3 mt-2">
                                <button
                                  type="button"
                                  className="flex items-center cursor-pointer text-sm text-slate-500 hover:text-red-500"
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  <span>Stop</span>
                                </button>
                                <button
                                  type="button"
                                  className="flex items-center cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-orange-500"
                                >
                                  <SquarePen className="w-4 h-4 mr-1" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <hr className="my-3 border-gray-200 dark:border-gray-700" />

                        {/* Bottom Stats */}
                        <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
                          <div className="flex gap-4 md:gap-6">
                            <div className="flex items-center gap-1.5">
                              <Repeat className="text-gray-500 w-5 h-5 dark:text-white" />
                              <span className="text-black dark:text-white text-sm">
                                {Math.floor(Number(campaign.credits_spent || 12))}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <UserPlus className="text-gray-500 w-5 h-5 dark:text-white" />
                              <span className="text-black dark:text-gray-100 text-sm">
                                {campaign.followers_count ?? 8}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Heart className="text-gray-500 w-5 h-5 dark:text-white" />
                              <span className="text-black dark:text-gray-100 text-sm">
                                {campaign.like_count ?? 14}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="text-gray-500 w-5 h-5 dark:text-white" />
                              <span className="text-black dark:text-gray-100 text-sm">
                                {campaign.comment_count ?? 5}
                              </span>
                            </div>
                          </div>

                          <Link
                            href="/user/plans"
                            className="text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Need to get featured? (Pro)
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                No campaigns found in this tab.
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="w-full xl:max-w-[380px] shrink-0">
            <DashboardSummary
              earnings={1}
              dailyRepostCurrent={3}
              dailyRepostMax={20}
              responseRate={98}
              pendingRequests={dashData?.pendingRequests?.length ?? 2}
              requestLimit={20}
              credits={dashData?.kpis?.availableCredits ?? 250}
              campaigns={campaigns.length}
              campaignLimit={10}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
