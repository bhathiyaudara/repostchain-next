'use client';

import { useEffect, useState } from 'react';

interface ActivityItem {
  id: string;
  artistName: string;
  avatar: string;
  action: string;
  trackTitle: string;
  genre: string;
  timeAgo: string;
}

const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    artistName: 'Flute Network',
    avatar: '/default_img/no_img.jpg',
    action: 'launched a new repost campaign for',
    trackTitle: 'Ethereal Winds (Original Mix)',
    genre: 'Ambient / Instrumental',
    timeAgo: '14 mins ago',
  },
  {
    id: 'act-2',
    artistName: 'Kai Rivers',
    avatar: '/frontend/images/testimonial/singh.png',
    action: 'earned +45 credits supporting artists in',
    trackTitle: 'Late Night Frequencies',
    genre: 'Hip-Hop & Rap',
    timeAgo: '32 mins ago',
  },
  {
    id: 'act-3',
    artistName: 'Riley Monroe',
    avatar: '/frontend/images/testimonial/smith.png',
    action: 'received 18 organic reposts on',
    trackTitle: 'Golden Hour Acoustic',
    genre: 'Indie & Pop',
    timeAgo: '1 hour ago',
  },
  {
    id: 'act-4',
    artistName: 'The Velvet Echoes',
    avatar: '/frontend/images/testimonial/mic_check.png',
    action: 'gained +64 new SoundCloud followers via',
    trackTitle: 'Neon Horizon',
    genre: 'Electronic / Synthwave',
    timeAgo: '2 hours ago',
  },
  {
    id: 'act-5',
    artistName: 'Midnight Skyline',
    avatar: '/frontend/images/testimonial/greenn.png',
    action: 'completed a 500-credit campaign for',
    trackTitle: 'Afterhours Club Mix',
    genre: 'House & Techno',
    timeAgo: '3 hours ago',
  },
  {
    id: 'act-6',
    artistName: 'Marcus Chen',
    avatar: '/frontend/images/testimonial/chen.png',
    action: 'reposted & reviewed 6 tracks in',
    trackTitle: 'Bassline Theory VIP',
    genre: 'Trap & Bass',
    timeAgo: '4 hours ago',
  },
];

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  useEffect(() => {
    let active = true;
    fetch('/api/public/live-activity')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.activities) && data.activities.length > 0) {
          setActivities(data.activities);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Live Platform Activity
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Happening Now on RepostChain
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md">
            Real SoundCloud artists launching campaigns, exchanging reposts, and growing their
            audience right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 border border-zinc-800/70 hover:border-[#ff5500]/40 transition-all duration-300"
            >
              <img
                src={item.avatar}
                alt={item.artistName}
                width={44}
                height={44}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                }}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ff5500]/40 shrink-0 mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-200 leading-snug">
                  <span className="font-semibold text-white">{item.artistName}</span>{' '}
                  <span className="text-zinc-400">{item.action}</span>{' '}
                  <span className="text-[#ff5500] font-medium">&ldquo;{item.trackTitle}&rdquo;</span>
                </p>
                <div className="flex items-center justify-between gap-2 mt-2 text-xs text-zinc-500">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 truncate">
                    {item.genre}
                  </span>
                  <span className="shrink-0">{item.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReachEstimator() {
  const [repostsPerWeek, setRepostsPerWeek] = useState(8);

  const monthlyCredits = repostsPerWeek * 4 * 15;
  const estimatedListeners = repostsPerWeek * 2850;
  const minFollowers = Math.round(repostsPerWeek * 24);
  const maxFollowers = Math.round(repostsPerWeek * 58);

  return (
    <section className="py-14 sm:py-20 bg-black relative">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900/95 via-zinc-900/80 to-zinc-800/60 border border-zinc-800/80 p-6 sm:p-10 md:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-[#ff5500]/10 border border-[#ff5500]/30 px-4 py-1.5 rounded-full mb-4">
              <span className="text-[#ff5500] text-xs sm:text-sm font-semibold">
                Interactive Growth Calculator
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Estimate Your Monthly SoundCloud Reach
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              See how supporting fellow artists translates directly into organic reach and new fans
              for your own releases.
            </p>
          </div>

          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label
                htmlFor="reposts-slider"
                className="text-sm sm:text-base font-medium text-zinc-200"
              >
                Tracks you support &amp; repost per week:
              </label>
              <span className="inline-flex items-center self-start sm:self-auto px-3.5 py-1 rounded-lg bg-[#ff5500] text-white font-bold text-base sm:text-lg">
                {repostsPerWeek} tracks / week
              </span>
            </div>
            <input
              id="reposts-slider"
              type="range"
              min={1}
              max={25}
              value={repostsPerWeek}
              onChange={(e) => setRepostsPerWeek(Number(e.target.value))}
              aria-label="Tracks you support and repost per week"
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ff5500]"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>1 / week (Casual)</span>
              <span>10 / week (Active Artist)</span>
              <span>25 / week (Power Networker)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="rounded-2xl bg-black/50 border border-zinc-800/80 p-5 text-center">
              <span className="text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                Monthly Credits Earned
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                +{monthlyCredits.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400 block mt-1">100% Free via Exchange</span>
            </div>

            <div className="rounded-2xl bg-black/50 border border-[#ff5500]/40 p-5 text-center">
              <span className="text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                Est. Listener Reach / Mo
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#ff5500]">
                {estimatedListeners.toLocaleString()}+
              </span>
              <span className="text-xs text-zinc-400 block mt-1">Real SoundCloud Feeds</span>
            </div>

            <div className="rounded-2xl bg-black/50 border border-zinc-800/80 p-5 text-center">
              <span className="text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                Est. Organic Followers / Mo
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                +{minFollowers} – {maxFollowers}
              </span>
              <span className="text-xs text-zinc-400 block mt-1">Genre-Matched Fans</span>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/api/auth/soundcloud/redirect"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700 text-white font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-[#ff5500]/25"
            >
              Claim Free Welcome Credits &amp; Start Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
