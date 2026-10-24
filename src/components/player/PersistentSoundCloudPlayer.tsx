'use client';

import { useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { usePlayerStore, getTargetKey } from '@/store/playerStore';
import { PLAYBACK_ELIGIBILITY_SECONDS } from '@/lib/constants';

export function PersistentSoundCloudPlayer() {
  const {
    currentItem,
    isPlaying,
    playSecondsMap,
    eligibleMap,
    togglePlayPause,
    tickSecond,
    closePlayer,
  } = usePlayerStore();

  useEffect(() => {
    if (!currentItem || !isPlaying) return;
    const interval = setInterval(() => {
      tickSecond();
    }, 1000);
    return () => clearInterval(interval);
  }, [currentItem, isPlaying, tickSecond]);

  if (!currentItem) return null;

  const key = getTargetKey(currentItem.targetType, currentItem.targetId);
  const playedSeconds = playSecondsMap[key] || 0;
  const isEligible = Boolean(eligibleMap[key]);
  const progressPercent = Math.min(
    100,
    Math.round((playedSeconds / PLAYBACK_ELIGIBILITY_SECONDS) * 100)
  );
  const remainingSeconds = Math.max(0, Math.ceil(PLAYBACK_ELIGIBILITY_SECONDS - playedSeconds));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl text-white shadow-2xl">
      {/* Top thin progress indicator for 15s repost unlock */}
      <div className="h-1 w-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isEligible ? 'bg-emerald-500' : 'bg-orange-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700">
            {currentItem.artworkUrl ? (
              <img
                src={currentItem.artworkUrl}
                alt={currentItem.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-orange-500/20 text-orange-400">
                <Volume2 className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white truncate">{currentItem.title}</p>
              {currentItem.genre && (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {currentItem.genre}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate">{currentItem.artist}</p>
          </div>
        </div>

        {/* Playback Controls + 15s Repost Eligibility Gate */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition shadow-lg shadow-orange-500/25 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="text-xs">
              {isEligible ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Repost Unlocked! ({playedSeconds}s played)
                    {currentItem.creditsReward ? ` • Earn +${currentItem.creditsReward} Credits` : ''}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>
                    Listen {remainingSeconds}s more to unlock Repost ({playedSeconds}s /{' '}
                    {PLAYBACK_ELIGIBILITY_SECONDS}s)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentItem.permalinkUrl && (
              <a
                href={currentItem.permalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-orange-400 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span className="hidden md:inline">SoundCloud</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={closePlayer}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
