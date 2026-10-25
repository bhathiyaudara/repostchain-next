'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Music, ListMusic, Users, Star, ExternalLink } from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists' | 'starred'>('tracks');

  const { data } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  const user = data?.user || {
    name: 'Flute Network',
    urn: 'soundcloud:users:387603023',
    avatar: '/default_img/no_img.jpg',
    followers_count: 547,
  };
  const recentTracks = data?.recentTracks || [];
  const recentPlaylists = data?.recentPlaylists || [];
  const starredUsers = data?.starredUsers || [];

  return (
    <div className="p-2 space-y-6">
      {/* Profile Banner Card - Matches livewire/user/my-account.blade.php */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600" />
        <div className="px-4 sm:px-6 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-3 sm:gap-4 min-w-0">
            <img
              src={user.avatar || '/default_img/no_img.jpg'}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg bg-white shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
              }}
            />
            <div className="mb-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">{user.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">URN: {user.urn}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="text-center px-3 sm:px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60">
              <p className="text-base sm:text-lg font-bold text-orange-500">
                {Number(user.followers_count || 4250).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Followers</p>
            </div>
            <div className="text-center px-3 sm:px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60">
              <p className="text-base sm:text-lg font-bold text-orange-500">{recentTracks.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Tracks</p>
            </div>
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 sm:px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium inline-flex items-center gap-1.5"
            >
              SoundCloud <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex overflow-x-auto no-scrollbar whitespace-nowrap space-x-4 sm:space-x-8">
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
            <ListMusic className="w-4 h-4" /> Playlists ({recentPlaylists.length})
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
            <Star className="w-4 h-4" /> Starred Artists ({starredUsers.length})
          </button>
        </nav>
      </div>

      {activeTab === 'tracks' && (
        <div className="space-y-4">
          {recentTracks.length > 0 ? (
            recentTracks.map(
              (t: {
                id: string;
                urn: string;
                title: string;
                genre?: string;
                artwork_url?: string;
                permalink_url?: string;
              }) => <SoundCloudPlayer key={t.id || t.urn} track={t} />
            )
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <Music className="w-10 h-10 mx-auto mb-3 text-orange-500" />
              <p>No tracks synced yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="space-y-4">
          {recentPlaylists.length > 0 ? (
            recentPlaylists.map(
              (p: {
                id: string;
                soundcloud_urn?: string;
                title: string;
                genre?: string;
                artwork_url?: string;
                permalink_url?: string;
              }) => <SoundCloudPlayer key={p.id || p.soundcloud_urn} track={p} />
            )
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <ListMusic className="w-10 h-10 mx-auto mb-3 text-orange-500" />
              <p>No playlists found for this SoundCloud account.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'starred' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {starredUsers.length > 0 ? (
            starredUsers.map(
              (s: { urn: string; name?: string; nickname?: string; avatar?: string }) => (
                <div
                  key={s.urn}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 flex items-center gap-3 shadow-sm"
                >
                  <img
                    src={s.avatar || '/default_img/no_img.jpg'}
                    alt={s.name || 'Artist'}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {s.name || s.nickname || 'Artist'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.urn}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 text-orange-500" />
              <p>You haven&apos;t starred any artists yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
