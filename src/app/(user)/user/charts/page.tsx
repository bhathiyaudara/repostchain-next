'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Trophy } from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';

const GENRES = ['All Genres', 'Electronic', 'Melodic Techno', 'Deep House', 'Hip-Hop & Rap', 'Tech House'];

export default function ChartsPage() {
  const [selectedGenre, setSelectedGenre] = useState('All Genres');

  const { data } = useQuery({
    queryKey: ['charts-tracks', selectedGenre],
    queryFn: async () => {
      const res = await fetch('/api/user/campaigns');
      if (!res.ok) return { campaigns: [] };
      return res.json();
    },
  });

  const campaigns = data?.campaigns || [];

  return (
    <div className="p-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            RepostChain Top Charts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Most reposted and highest performing SoundCloud tracks on RepostChain this week.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-orange-500'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {campaigns.map(
          (
            c: {
              id: string;
              credits_spent?: number;
              music?: {
                id?: string;
                title?: string;
                genre?: string;
                artwork_url?: string;
                permalink_url?: string;
                author_username?: string;
              };
            },
            idx: number
          ) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4"
            >
              <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                    idx === 0
                      ? 'bg-orange-500 text-white'
                      : idx === 1
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white'
                  }`}
                >
                  #{idx + 1}
                </div>
                {idx === 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500">
                    <Trophy className="w-4 h-4" /> #1 Trending
                  </span>
                )}
              </div>

              <div className="w-full flex-1">
                <SoundCloudPlayer track={c.music} height={140} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
