'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';
import { DashboardSummary } from '@/components/dashboard-summary';

export default function RepostRequestsPage() {
  const queryClient = useQueryClient();
  const [activeMainTab, setActiveMainTab] = useState<
    'incoming_request' | 'outgoing_request' | 'previously_reposted'
  >('incoming_request');
  const [acceptingRequests, setAcceptingRequests] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['repost-requests', activeMainTab],
    queryFn: async () => {
      const direction =
        activeMainTab === 'outgoing_request' ? 'outgoing' : 'incoming';
      const res = await fetch(`/api/user/repost-requests?direction=${direction}`);
      if (!res.ok) throw new Error('Failed to load requests');
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

  const actionMutation = useMutation({
    mutationFn: async ({
      requestId,
      action,
    }: {
      requestId: string;
      action: 'confirm' | 'decline';
    }) => {
      const res = await fetch('/api/user/repost-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repost-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-summary'] });
    },
  });

  const requests = data?.requests || [];

  return (
    <div>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Side - Exact match to resources/views/livewire/user/repost-request.blade.php */}
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl text-black dark:text-gray-100 font-bold">
                Repost Requests
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/user/members"
                className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 text-base"
              >
                <Plus className="w-5 h-5 mr-1" />
                Send a New Request
              </Link>

              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className="xl:hidden flex items-center gap-1 text-sm text-orange-500 cursor-pointer"
              >
                <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
                {showStats ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {showStats && (
            <div className="xl:hidden mb-8">
              <DashboardSummary
                earnings={1}
                dailyRepostCurrent={2}
                dailyRepostMax={20}
                responseRate={98}
                pendingRequests={requests.length}
                requestLimit={25}
                credits={dashData?.kpis?.availableCredits ?? 250}
                campaigns={dashData?.kpis?.activeCampaigns ?? 2}
                campaignLimit={10}
              />
            </div>
          )}

          {/* Underline Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('incoming_request')}
                  className={`tab-button py-3 px-2 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    activeMainTab === 'incoming_request'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Incoming requests
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMainTab('outgoing_request')}
                  className={`tab-button py-3 px-2 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    activeMainTab === 'outgoing_request'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Outgoing request
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMainTab('previously_reposted')}
                  className={`tab-button py-3 px-2 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    activeMainTab === 'previously_reposted'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Previously Reposted
                </button>
              </nav>
            </div>
          </div>

          {/* Quick Tip Box - Exact match to repost-request.blade.php lines 67-110 */}
          {activeMainTab === 'incoming_request' && (
            <div className="flex flex-col md:flex-row md:items-start md:space-x-3 p-4 rounded bg-gray-100 dark:bg-gray-800 mb-8 gap-6">
              <div className="flex items-center space-x-2 mb-2 md:mb-0 shrink-0">
                <svg
                  className="w-4 h-4 text-sky-600 dark:text-sky-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-4 10.49V15a1 1 0 001 1h6a1 1 0 001-1v-2.51A6 6 0 0010 2zm1 13h-2v-1h2v1zm1-2H8v-1h4v1zm-.44-2.93a1 1 0 01-.32 1.36L10 11l-.24-.14a1 1 0 111.36-1.36l.44.57z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-white">
                  Quick Tip
                </span>
              </div>
              <div className="flex-1 flex flex-col space-y-2">
                <p className="text-sm text-gray-700 dark:text-white">
                  Your response rate could be better! Improve your response rate and get more
                  requests by accepting OR declining requests quickly.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span className="text-xs text-orange-600 font-semibold">
                    98%{' '}
                    <span className="text-gray-900 dark:text-white">Response rate.</span>
                  </span>
                </div>
                <div
                  onClick={() => setAcceptingRequests(!acceptingRequests)}
                  className="inline-flex items-center cursor-pointer w-fit"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-4 rounded-full relative transition-colors ${
                        acceptingRequests ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                          acceptingRequests ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-white">
                      Accepting Requests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Cards */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
                />
              ))}
            </div>
          ) : requests.length > 0 ? (
            requests.map(
              (req: {
                id: string;
                credits_spent: number;
                status: number;
                created_at?: string;
                description?: string;
                requester?: { name?: string; avatar?: string; urn?: string };
                music?: {
                  id?: string;
                  title?: string;
                  genre?: string;
                  artwork_url?: string;
                  permalink_url?: string;
                };
              }) => (
                <div
                  key={req.id}
                  className="request-card bg-white dark:bg-gray-800 border border-gray-200 mb-4 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Column - Track Info */}
                    <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <SoundCloudPlayer track={req.music} visual={false} />
                    </div>

                    {/* Right Column - Request Info */}
                    <div className="w-full lg:w-1/2 p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-12 h-12 rounded-full object-cover"
                            src={req.requester?.avatar || '/default_img/no_img.jpg'}
                            alt={req.requester?.name || 'Artist'}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                '/default_img/no_img.jpg';
                            }}
                          />
                          <div>
                            <span className="text-slate-700 dark:text-gray-300 font-medium block">
                              {req.requester?.name || 'SoundCloud Artist'}
                            </span>
                            <Star className="w-4 h-4 mt-1 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {req.created_at
                              ? new Date(req.created_at).toLocaleDateString()
                              : 'RECENT REQUEST'}
                          </div>
                          <span className="text-orange-500 font-bold text-sm mt-1 inline-block">
                            +{req.credits_spent ?? 1} Credits
                          </span>
                        </div>
                      </div>

                      {req.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic my-2 bg-gray-50 dark:bg-slate-700/50 p-2 rounded">
                          &ldquo;{req.description}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-2">
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                          {req.music?.genre || 'Electronic'}
                        </span>

                        {activeMainTab === 'incoming_request' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                actionMutation.mutate({
                                  requestId: req.id,
                                  action: 'decline',
                                })
                              }
                              className="px-4 py-2 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 text-sm font-medium cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                actionMutation.mutate({
                                  requestId: req.id,
                                  action: 'confirm',
                                })
                              }
                              className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 text-sm font-medium cursor-pointer"
                            >
                              Repost
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
              No repost requests found for this tab.
            </div>
          )}
        </div>

        {/* Right Side Dashboard Summary */}
        <div className="w-full lg:max-w-[380px] hidden xl:block shrink-0">
          <DashboardSummary
            earnings={1}
            dailyRepostCurrent={2}
            dailyRepostMax={20}
            responseRate={98}
            pendingRequests={requests.length}
            requestLimit={25}
            credits={dashData?.kpis?.availableCredits ?? 250}
            campaigns={dashData?.kpis?.activeCampaigns ?? 2}
            campaignLimit={10}
          />
        </div>
      </section>
    </div>
  );
}
