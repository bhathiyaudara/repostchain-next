'use client';

import { Play, Pause, Volume2 } from 'lucide-react';

interface SoundCloudPlayerProps {
  track?: {
    id?: string | number;
    title?: string;
    permalink_url?: string | null;
    artwork_url?: string | null;
    genre?: string | null;
    author_username?: string | null;
    playback_count?: number;
    favoritings_count?: number;
    reposts_count?: number;
  } | null;
  height?: number;
  visual?: boolean;
  isPlaying?: boolean;
  playSeconds?: number;
  onTogglePlay?: () => void;
}

export function SoundCloudPlayer({
  track,
  height = 166,
  visual = false,
  isPlaying = false,
  playSeconds = 0,
  onTogglePlay,
}: SoundCloudPlayerProps) {
  if (!track) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        SoundCloud track data not available for embed.
      </div>
    );
  }

  const hasValidRealSoundcloudUrl =
    track.permalink_url &&
    track.permalink_url.startsWith('https://soundcloud.com/') &&
    !track.permalink_url.includes('soundcloud.com/demo');

  const embedUrl = hasValidRealSoundcloudUrl
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        track.permalink_url!
      )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=${
        visual ? 'true' : 'false'
      }`
    : null;

  // Deterministic waveform bars for interactive SoundCloud-styled player
  const waveformBars = [
    35, 58, 42, 75, 90, 62, 48, 84, 95, 70, 55, 80, 64, 88, 96, 72, 50, 68, 85, 92, 60, 45, 78, 88,
    74, 52, 66, 82, 94, 65, 48, 76, 84, 58, 40, 62, 70, 50, 38, 28,
  ];
  const progressRatio = Math.min(1, playSeconds / 15);

  return (
    <div
      className="soundcloud-embed-container w-full max-w-full overflow-hidden bg-white dark:bg-slate-800"
      style={{ borderTop: '2px solid #ff5500' }}
    >
      {embedUrl && !onTogglePlay ? (
        <iframe
          width="100%"
          height={height}
          scrolling="no"
          frameBorder="no"
          allow="autoplay; encrypted-media"
          src={embedUrl}
          title={track.title || 'SoundCloud Player'}
          className="w-full max-w-full block"
        />
      ) : (
        <div
          className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-4 bg-[#f2f2f2] dark:bg-slate-800/95 select-none"
          style={{ minHeight: `${Math.min(height, 140)}px` }}
        >
          {/* Left Artwork */}
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded overflow-hidden bg-gray-300 dark:bg-slate-700 shadow">
            <img
              src={track.artwork_url || '/default_img/no_img.jpg'}
              alt={track.title || 'Track'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
              }}
            />
          </div>

          {/* Right Controls + Waveform */}
          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-16 sm:h-24 md:h-28">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ff5500] hover:bg-[#e64d00] text-white flex items-center justify-center shadow transition-transform active:scale-95 shrink-0 cursor-pointer"
                  title={isPlaying ? 'Pause track' : 'Play track (15s required to repost)'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {track.author_username || 'SoundCloud Artist'}
                  </p>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {track.title || 'Untitled Track'}
                  </h4>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                {track.genre && (
                  <span className="text-[11px] bg-gray-400/20 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    #{track.genre}
                  </span>
                )}
                <span className="text-[10px] font-bold text-[#ff5500] mt-1">SOUNDCLOUD</span>
              </div>
            </div>

            {/* Interactive SoundCloud Waveform */}
            <div
              onClick={onTogglePlay}
              className="flex items-end gap-[2px] h-10 mt-2 cursor-pointer"
              title="Click to play/pause"
            >
              {waveformBars.map((barHeight, idx) => {
                const barProgress = idx / waveformBars.length;
                const isFilled = barProgress <= progressRatio && playSeconds > 0;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-xs transition-colors duration-200 ${
                      isFilled
                        ? 'bg-[#ff5500]'
                        : 'bg-gray-400/60 dark:bg-slate-600 hover:bg-orange-400/70'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#ff5500]" />
                {playSeconds > 0 ? `${playSeconds.toFixed(0)}s played` : 'Click play to listen'}
              </span>
              {track.permalink_url && (
                <a
                  href={track.permalink_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ff5500] underline"
                >
                  Open on SoundCloud
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
