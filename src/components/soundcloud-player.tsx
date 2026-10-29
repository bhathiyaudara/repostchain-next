'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Heart, Repeat2 } from 'lucide-react';

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
  onProgress?: (seconds: number) => void;
  onEligible?: () => void;
  iframeId?: string;
  forceMock?: boolean;
  className?: string;
}

export function SoundCloudPlayer({
  track,
  height = 166,
  visual = false,
  isPlaying = false,
  playSeconds = 0,
  onTogglePlay,
  onProgress,
  onEligible,
  iframeId,
  forceMock = false,
  className,
}: SoundCloudPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
      )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&buying=false&sharing=false&download=false&visual=${
        visual ? 'true' : 'false'
      }`
    : null;

  // Bind SC.Widget events if the SoundCloud Widget API is loaded
  useEffect(() => {
    if (!embedUrl || forceMock) return;

    const setupWidget = () => {
      const win = window as any;
      if (typeof win !== 'undefined' && win.SC && win.SC.Widget && iframeRef.current) {
        try {
          const widget = win.SC.Widget(iframeRef.current);
          widget.bind(win.SC.Widget.Events.PLAY, () => {
            if (onTogglePlay) onTogglePlay();
          });
          widget.bind(win.SC.Widget.Events.PLAY_PROGRESS, (data: { currentPosition: number }) => {
            const sec = (data?.currentPosition || 0) / 1000;
            if (onProgress) onProgress(sec);
            if (sec >= 15 && onEligible) onEligible();
          });
        } catch {
          // Widget binding silent fallback
        }
      }
    };

    const timer = setTimeout(setupWidget, 500);
    return () => clearTimeout(timer);
  }, [embedUrl, forceMock, onTogglePlay, onProgress, onEligible]);

  const handlePlayClick = () => {
    if (onTogglePlay) {
      onTogglePlay();
    }
  };

  // Signature SoundCloud dual-layer waveform bars
  const waveformBars = [
    32, 54, 42, 75, 90, 62, 48, 84, 96, 70, 55, 80, 64, 88, 98, 72, 50, 68, 85, 92, 60, 45, 78, 88,
    74, 52, 66, 82, 94, 65, 48, 76, 84, 58, 44, 68, 74, 56, 40, 30, 52, 64, 48, 34,
  ];
  const progressRatio = Math.min(1, playSeconds / 15);

  return (
    <div
      className={
        className ||
        'soundcloud-embed-container w-full max-w-full overflow-hidden bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800'
      }
      style={{ borderTop: '2px solid #ff5500' }}
    >
      {embedUrl && !forceMock ? (
        <iframe
          ref={iframeRef}
          id={iframeId || `sc-player-${track.id || 'track'}`}
          width="100%"
          height={height}
          scrolling="no"
          frameBorder="no"
          loading="lazy"
          allow="autoplay; encrypted-media"
          src={embedUrl}
          title={track.title || 'SoundCloud Player'}
          className="w-full max-w-full block"
        />
      ) : (
        <div
          className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-4 bg-[#f7f7f7] dark:bg-zinc-900/95 select-none"
          style={{ minHeight: `${Math.min(height, 142)}px` }}
        >
          {/* Left Artwork */}
          <div
            onClick={handlePlayClick}
            className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-md overflow-hidden bg-gray-300 dark:bg-zinc-800 shadow-md cursor-pointer group"
          >
            <img
              src={track.artwork_url || '/default_img/no_img.jpg'}
              alt={track.title || 'Track'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg">
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </div>
            </div>
          </div>

          {/* Right Controls + Dual-Layer SoundCloud Waveform */}
          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-16 sm:h-24 md:h-28">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={handlePlayClick}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ff5500] hover:bg-[#e64d00] text-white flex items-center justify-center shadow-md shadow-[#ff5500]/25 transition-transform active:scale-95 shrink-0 cursor-pointer"
                  title={isPlaying ? 'Pause track' : 'Play track'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                    {track.author_username || 'SoundCloud Artist'}
                  </p>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {track.title || 'Untitled Track'}
                  </h4>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                {track.genre && (
                  <span className="text-[11px] bg-gray-400/20 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-2.5 py-0.5 rounded-full border border-transparent dark:border-zinc-700">
                    #{track.genre}
                  </span>
                )}
                <span className="text-[10px] font-bold tracking-wider text-[#ff5500] mt-1">
                  SOUNDCLOUD
                </span>
              </div>
            </div>

            {/* Interactive SoundCloud Dual-Layer Waveform */}
            <div
              onClick={handlePlayClick}
              className="relative flex flex-col justify-center h-11 mt-1.5 cursor-pointer group"
              title="Click to play on SoundCloud"
            >
              {/* Top Main Bars */}
              <div className="flex items-end gap-[2px] h-7">
                {waveformBars.map((barHeight, idx) => {
                  const barProgress = idx / waveformBars.length;
                  const isFilled =
                    (playSeconds > 0 && barProgress <= progressRatio) ||
                    (playSeconds === 0 && idx < 10);
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-[1px] transition-colors duration-150 ${
                        isFilled
                          ? 'bg-[#ff5500]'
                          : 'bg-gray-400/70 dark:bg-zinc-600 group-hover:bg-[#ff5500]/60'
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  );
                })}
              </div>

              {/* Bottom Mirror Reflection Bars */}
              <div className="flex items-start gap-[2px] h-3.5 opacity-60">
                {waveformBars.map((barHeight, idx) => {
                  const barProgress = idx / waveformBars.length;
                  const isFilled =
                    (playSeconds > 0 && barProgress <= progressRatio) ||
                    (playSeconds === 0 && idx < 10);
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-b-[1px] transition-colors duration-150 ${
                        isFilled
                          ? 'bg-[#ff5500]'
                          : 'bg-gray-400/70 dark:bg-zinc-600 group-hover:bg-[#ff5500]/60'
                      }`}
                      style={{ height: `${barHeight * 0.45}%` }}
                    />
                  );
                })}
              </div>

              {/* SoundCloud Timestamp Pills */}
              <span className="absolute left-0 bottom-2 bg-black/80 text-[#ff5500] text-[9px] font-mono px-1 py-0.2 rounded">
                {playSeconds > 0
                  ? `0:${String(Math.floor(playSeconds)).padStart(2, '0')}`
                  : '0:00'}
              </span>
              <span className="absolute right-0 bottom-2 bg-black/80 text-zinc-300 text-[9px] font-mono px-1 py-0.2 rounded">
                0:15 / REPOST
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-[#ff5500]" />
                  {playSeconds > 0
                    ? `${playSeconds.toFixed(0)}s played`
                    : 'Click play to listen'}
                </span>
                {typeof track.favoritings_count === 'number' && track.favoritings_count > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400">
                    <Heart className="w-3 h-3 text-[#ff5500] fill-[#ff5500]" />
                    {track.favoritings_count}
                  </span>
                )}
                {typeof track.reposts_count === 'number' && track.reposts_count > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400">
                    <Repeat2 className="w-3.5 h-3.5 text-[#ff5500]" />
                    {track.reposts_count}
                  </span>
                )}
              </div>
              {track.permalink_url && (
                <a
                  href={track.permalink_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ff5500] underline font-medium"
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
