'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Music, ListMusic, Users, Star, ExternalLink } from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists' | 'starred'>('tracks');

  const { data } = useQuery({
    queryKey: ['user-dashboard-account'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  const user = data?.user || {
    name: 'Demo SoundCloud Artist',
    urn: 'soundcloud:users:999001',
    avatar: '/default_img/no_img.jpg',
    followers_count: 4250,
  };
  const recentTracks = data?.recentTracks || [];

  return (
    <div className="p-2 space-y-6">
      {/* Profile Banner Card - Matches livewire/user/my-account.blade.php */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600" />
        <div className="px-6 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <img
              src={user.avatar || '/default_img/no_img.jpg'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg bg-white"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
              }}
            />
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">URN: {user.urn}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60">
              <p className="text-lg font-bold text-orange-500">
                {Number(user.followers_count || 4250).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Followers</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60">
              <p className="text-lg font-bold text-orange-500">{recentTracks.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Tracks</p>
            </div>
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium inline-flex items-center gap-1.5"
            >
              SoundCloud <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('tracks')}
            className={`py-3 px-2 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'tracks'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Music className="w-4 h-4" /> Tracks ({recentTracks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playlists')}
            className={`py-3 px-2 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'playlists'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListMusic className="w-4 h-4" /> Playlists
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('starred')}
            className={`py-3 px-2 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'starred'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Star className="w-4 h-4" /> Starred Artists
          </button>
        </nav>
      </div>

      {activeTab === 'tracks' && (
        <div className="space-y-4">
          {recentTracks.map(
            (t: {
              id: string;
              urn: string;
              title: string;
              genre?: string;
              artwork_url?: string;
              permalink_url?: string;
            }) => (
              <SoundCloudPlayer key={t.id || t.urn} track={t} />
            )
          )}
        </div>
      )}

      {activeTab !== 'tracks' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 text-orange-500" />
          <p>Synced with your SoundCloud account.</p>
        </div>
      )}
    </div>
  );
}
