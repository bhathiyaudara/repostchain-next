'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  Search,
  Star,
  Crown,
  Zap,
  Users,
  Repeat2,
  Send,
  X,
} from 'lucide-react';

const GENRES = [
  'All Genres',
  'Electronic',
  'Melodic Techno',
  'Deep House',
  'Hip-Hop & Rap',
  'Tech House',
  'Pop',
  'Drum & Bass',
];

export default function MembersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [costOrder, setCostOrder] = useState<'none' | 'high_to_low' | 'low_to_high'>('none');
  const [openByGenre, setOpenByGenre] = useState(false);
  const [openByCost, setOpenByCost] = useState(false);
  const [starredUrns, setStarredUrns] = useState<Record<string, boolean>>({});
  const [requestTarget, setRequestTarget] = useState<{
    urn: string;
    name: string;
    repost_price: number;
  } | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [requestSentMessage, setRequestSentMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['members-directory', search, selectedGenre],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedGenre !== 'All Genres') params.set('genre', selectedGenre);
      const res = await fetch(`/api/user/members?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load members');
      return res.json();
    },
  });

  const sendRequestMutation = useMutation({
    mutationFn: async () => {
      if (!requestTarget) return;
      const res = await fetch('/api/user/repost-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserUrn: requestTarget.urn,
          musicId: 1,
          musicType: 'track',
          creditsSpent: requestTarget.repost_price || 1,
          description: requestNote,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      setRequestSentMessage(`Direct Repost Request sent to ${requestTarget?.name}!`);
      setRequestTarget(null);
      setRequestNote('');
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-summary'] });
      setTimeout(() => setRequestSentMessage(null), 4000);
    },
  });

  let members = [...(data?.members || [])];
  if (costOrder === 'high_to_low') {
    members.sort((a, b) => Number(b.repost_price || 1) - Number(a.repost_price || 1));
  } else if (costOrder === 'low_to_high') {
    members.sort((a, b) => Number(a.repost_price || 1) - Number(b.repost_price || 1));
  }

  return (
    <div className="px-2 py-4 lg:px-4 lg:py-8">
      {/* Header - Exact match to resources/views/livewire/user/member.blade.php */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-xl font-bold mb-2 dark:text-white">Browse Members</h1>
        <p className="text-gray-500 text-sm md:text-base dark:text-white">
          Search, filter or browse the list of recommended members that can repost your music.
        </p>
      </div>

      {requestSentMessage && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-medium">
          {requestSentMessage}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-4 lg:mb-8 flex flex-col lg:flex-row gap-4">
        {/* Filter Buttons */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenByGenre(!openByGenre);
                setOpenByCost(false);
              }}
              className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
            >
              Filter by genre
              <ChevronDown className="w-5 h-5" />
            </button>

            {openByGenre && (
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg z-50 overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <div className="max-h-96 overflow-y-auto py-1">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        setSelectedGenre(genre);
                        setOpenByGenre(false);
                      }}
                      className={`block px-4 py-2 text-sm border-b border-gray-100 dark:border-gray-700 w-full text-left ${
                        selectedGenre === genre
                          ? 'bg-orange-500 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenByCost(!openByCost);
                setOpenByGenre(false);
              }}
              className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
            >
              Filter by cost
              <ChevronDown className="w-5 h-5" />
            </button>

            {openByCost && (
              <div className="absolute right-0 sm:left-0 mt-2 w-56 rounded-md shadow-lg z-50 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCostOrder('high_to_low');
                      setOpenByCost(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    High to Low
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCostOrder('low_to_high');
                      setOpenByCost(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Low to High
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative mt-2 lg:mt-0">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by soundcloud profile url or Name"
            className="w-full bg-white border border-gray-300 dark:border-gray-600 hover:border-orange-500 transition-colors rounded-md pl-10 pr-4 py-2 text-gray-900 dark:text-white dark:bg-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Member Cards Grid - Exact match to member.blade.php lines 112-260 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 animate-pulse"
            />
          ))
        ) : members.length > 0 ? (
          members.map(
            (member: {
              urn: string;
              name: string;
              avatar?: string;
              followers_count?: number;
              repost_price?: number;
              created_at?: string;
              isPro?: boolean;
              genres?: { genre: string }[] | string[];
            }) => {
              const genreList = Array.isArray(member.genres)
                ? member.genres.map((g) => (typeof g === 'string' ? g : g.genre))
                : ['Electronic', 'House'];

              return (
                <div
                  key={member.urn}
                  className="relative overflow-hidden bg-white/60 dark:bg-slate-800 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/70 dark:border-slate-600 flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:border-orange-300/40 dark:hover:border-orange-500/50"
                >
                  {/* Subtle Background Orbs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/5 dark:bg-orange-500/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 dark:bg-blue-500/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none z-0" />

                  {/* Star Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setStarredUrns((prev) => ({ ...prev, [member.urn]: !prev[member.urn] }))
                    }
                    className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-slate-600 z-20 cursor-pointer"
                    title="Favorite this member"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        starredUrns[member.urn]
                          ? 'text-orange-400 fill-orange-400'
                          : 'text-gray-300 dark:text-gray-500 group-hover:text-gray-400'
                      }`}
                    />
                  </button>

                  <div className="flex-1 relative z-10">
                    {/* Profile Header */}
                    <div className="flex items-start gap-3 mb-6">
                      <div className="relative shrink-0 mt-2">
                        <img
                          src={member.avatar || '/default_img/no_img.jpg'}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                      </div>

                      <div className="flex-1 pr-8 min-w-0">
                        <div className="mb-1">
                          {member.isPro ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20 dark:ring-orange-500/30">
                              <Crown className="w-3 h-3" />
                              Artist Pro
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 dark:bg-slate-400/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/20 dark:ring-slate-400/20">
                              <Zap className="w-3 h-3" />
                              Free Plan
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 mb-2">
                          Member since{' '}
                          {member.created_at
                            ? new Date(member.created_at).toLocaleDateString()
                            : 'Jan 2025'}
                        </p>

                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                          {genreList.map((g) => (
                            <span
                              key={g}
                              className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] rounded-full font-medium whitespace-nowrap shrink-0"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Action Footer */}
                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-orange-500" />
                          <strong>{Number(member.followers_count || 1200).toLocaleString()}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Repeat2 className="w-4 h-4 text-orange-500" />
                          <strong>{member.repost_price || 1} Credits</strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setRequestTarget({
                            urn: member.urn,
                            name: member.name,
                            repost_price: Number(member.repost_price || 1),
                          })
                        }
                        className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Request
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No members match your filter criteria.
          </div>
        )}
      </div>

      {/* Direct Repost Request Modal */}
      {requestTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Send Direct Request to {requestTarget.name}
              </h3>
              <button
                type="button"
                onClick={() => setRequestTarget(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Cost: <strong className="text-orange-500">{requestTarget.repost_price} Credits</strong>
            </p>
            <textarea
              rows={3}
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="Write a personal note about your track..."
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-sm text-gray-900 dark:text-white mb-4 focus:outline-none focus:border-orange-500"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRequestTarget(null)}
                className="flex-1 py-2.5 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 font-medium text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => sendRequestMutation.mutate()}
                disabled={sendRequestMutation.isPending}
                className="flex-1 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-500 font-medium text-sm cursor-pointer"
              >
                {sendRequestMutation.isPending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
