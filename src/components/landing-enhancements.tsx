'use client';

import { useEffect, useState } from 'react';

const HERO_WAVEFORM_BARS = [
  28, 45, 62, 50, 78, 92, 65, 52, 85, 96, 74, 58, 82, 90, 68, 54, 76, 94, 88, 64, 48, 72, 86, 95,
  70, 56, 80, 92, 75, 60, 84, 72, 55, 66, 78, 62, 46, 58, 42, 32,
];

const HERO_COMMENTS = [
  {
    time: '0:42',
    user: 'Kai Rivers',
    avatar: '/frontend/images/testimonial/singh.png',
    text: '🔥 Huge bassline at the drop! Reposted to 14.2K followers',
    barIndex: 11,
  },
  {
    time: '1:18',
    user: 'Riley Monroe',
    avatar: '/frontend/images/testimonial/smith.png',
    text: '✨ Clean vocal mix & arrangement — instant repost + like!',
    barIndex: 21,
  },
  {
    time: '2:05',
    user: 'The Velvet Echoes',
    avatar: '/frontend/images/testimonial/mic_check.png',
    text: '⚡ Added to our Weekly Indie & Electronic Discovery playlist!',
    barIndex: 31,
  },
];

export function SoundCloudHeroWaveform() {
  const [playing, setPlaying] = useState(true);
  const [activeBar, setActiveBar] = useState(14);
  const [commentIdx, setCommentIdx] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setActiveBar((prev) => {
        const next = (prev + 1) % HERO_WAVEFORM_BARS.length;
        if (next === 11) setCommentIdx(0);
        else if (next === 21) setCommentIdx(1);
        else if (next === 31) setCommentIdx(2);
        return next;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [playing]);

  const activeComment = HERO_COMMENTS[commentIdx];

  return (
    <div className="mt-4 w-full max-w-sm sm:max-w-md lg:max-w-2xl mx-auto rounded-2xl bg-zinc-900/95 border border-zinc-800/90 p-3.5 sm:p-4 shadow-2xl shadow-black/80 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff5500] via-orange-500 to-[#ff5500]" />

      {/* Top Track Info Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause waveform preview' : 'Play waveform preview'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ff5500]/30 transition-transform active:scale-95 cursor-pointer"
          >
            {playing ? (
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </button>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 truncate">Flute Network</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-[#ff5500]/20 text-[#ff5500] text-[9px] font-bold">
                ★ ARTIST PRO
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white truncate">
              Midnight Horizon (RepostChain Exclusive)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
            #Electronic
          </span>
          <span className="px-2 py-0.5 rounded bg-[#ff5500] text-white text-[10px] font-bold">
            +15 CREDITS
          </span>
        </div>
      </div>

      {/* SoundCloud Dual-Layer Waveform */}
      <div
        onClick={() => setPlaying((p) => !p)}
        className="relative cursor-pointer py-1 select-none"
        title="Click to toggle SoundCloud waveform animation"
      >
        <div className="flex items-end gap-[2px] h-8 sm:h-9">
          {HERO_WAVEFORM_BARS.map((h, i) => {
            const filled = i <= activeBar;
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-[1px] transition-colors duration-150 ${
                  filled ? 'bg-[#ff5500]' : 'bg-zinc-700 hover:bg-zinc-500'
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        <div className="flex items-start gap-[2px] h-2.5 mt-[1px] opacity-40">
          {HERO_WAVEFORM_BARS.map((h, i) => {
            const filled = i <= activeBar;
            return (
              <div
                key={i}
                className={`flex-1 rounded-b-[1px] ${filled ? 'bg-[#ff8833]' : 'bg-zinc-700'}`}
                style={{ height: `${Math.max(20, Math.round(h * 0.45))}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Timestamped SoundCloud Artist Comment Bubble */}
      <div className="mt-2.5 flex items-center justify-between gap-2 bg-black/60 border border-zinc-800/80 rounded-xl px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={activeComment.avatar}
            alt={activeComment.user}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-[#ff5500] shrink-0"
          />
          <p className="text-[11px] sm:text-xs text-zinc-300 truncate">
            <span className="text-[#ff5500] font-mono mr-1">@{activeComment.time}</span>
            <span className="font-semibold text-white">{activeComment.user}:</span>{' '}
            {activeComment.text}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 text-[11px] text-zinc-400 shrink-0">
          <span>▶ 18.4K</span>
          <span className="text-[#ff5500]">♥ 1.4K</span>
          <span className="text-emerald-400 font-semibold">⇄ 685</span>
        </div>
      </div>
    </div>
  );
}

const GENRE_CURATOR_DATA: Record<
  string,
  { curators: number; avgReach: string; sampleTitle: string }
> = {
  'Electronic & EDM': {
    curators: 1420,
    avgReach: '28,500+',
    sampleTitle: 'Neon Skyline (Original Club Mix)',
  },
  'Hip-Hop & Rap': {
    curators: 1180,
    avgReach: '24,200+',
    sampleTitle: 'Late Night Hustle (Prod. Kai)',
  },
  'House & Techno': {
    curators: 960,
    avgReach: '21,800+',
    sampleTitle: 'Afterhours Warehouse Groove',
  },
  'Lo-Fi & Chill': {
    curators: 840,
    avgReach: '19,400+',
    sampleTitle: 'Rainy Tokyo Coffee Beats',
  },
  'Trap & Bass': {
    curators: 790,
    avgReach: '22,100+',
    sampleTitle: '808 Earthquake VIP',
  },
  'Pop & R&B': {
    curators: 910,
    avgReach: '20,600+',
    sampleTitle: 'Golden Hour Melodies',
  },
  'Indie & Alternative': {
    curators: 670,
    avgReach: '16,900+',
    sampleTitle: 'Velvet Echoes - Live Session',
  },
};

export function TrackCampaignPreviewer() {
  const [selectedGenre, setSelectedGenre] = useState('Electronic & EDM');
  const [customTitle, setCustomTitle] = useState('');

  const genreStats = GENRE_CURATOR_DATA[selectedGenre] || GENRE_CURATOR_DATA['Electronic & EDM'];
  const displayTitle = customTitle.trim() || genreStats.sampleTitle;

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900/95 via-zinc-900/85 to-zinc-800/70 border border-zinc-800 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Input Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#ff5500]/10 border border-[#ff5500]/30 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
                <span className="text-[#ff5500] text-xs font-semibold uppercase tracking-wider">
                  Instant Campaign Simulator
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                See How Your Track Looks on <span className="text-[#ff5500]">RepostChain</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                Enter your track title and select your genre to preview your live SoundCloud
                campaign card and see how many active artists are ready to repost your music.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="preview-track-title"
                    className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2"
                  >
                    1. Your SoundCloud Track Title (or URL)
                  </label>
                  <input
                    id="preview-track-title"
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={genreStats.sampleTitle}
                    className="w-full px-4 py-3 rounded-xl bg-black/70 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5500] text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    2. Choose Your Music Genre
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(GENRE_CURATOR_DATA).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGenre(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedGenre === g
                            ? 'bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/25'
                            : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live SoundCloud Campaign Card Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-black border border-[#ff5500]/40 p-5 sm:p-6 shadow-xl relative">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {genreStats.curators.toLocaleString()} Active {selectedGenre} Artists Matched
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff5500]/15 text-[#ff5500] text-xs font-bold">
                    FEATURED CAMPAIGN
                  </span>
                </div>

                {/* Simulated SoundCloud Player Card */}
                <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff5500] to-orange-600 flex items-center justify-center text-white shrink-0 shadow">
                      <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-400 truncate">Your Artist Profile • #{selectedGenre}</p>
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {displayTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Mini Waveform */}
                  <div className="flex items-end gap-[2px] h-8 mb-2">
                    {HERO_WAVEFORM_BARS.slice(0, 32).map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-[1px] ${
                          i < 18 ? 'bg-[#ff5500]' : 'bg-zinc-700'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Est. Campaign Reach: <strong className="text-white">{genreStats.avgReach} listeners</strong></span>
                    <span className="text-[#ff5500] font-bold">SOUNDCLOUD</span>
                  </div>
                </div>

                <a
                  href="/api/auth/soundcloud/redirect"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-[#ff5500]/25"
                >
                  Launch This Campaign with SoundCloud →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
