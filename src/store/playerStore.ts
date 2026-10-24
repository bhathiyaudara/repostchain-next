import { create } from 'zustand';
import { PLAYBACK_ELIGIBILITY_SECONDS } from '@/lib/constants';

export interface PlayableItem {
  targetId: string;
  targetType: 'campaign' | 'request' | 'track';
  title: string;
  artist: string;
  artworkUrl?: string | null;
  permalinkUrl?: string | null;
  genre?: string | null;
  creditsReward?: number;
}

interface PlayerState {
  currentItem: PlayableItem | null;
  isPlaying: boolean;
  playSecondsMap: Record<string, number>;
  eligibleMap: Record<string, boolean>;
  repostedMap: Record<string, boolean>;
  playItem: (item: PlayableItem) => void;
  togglePlayPause: () => void;
  tickSecond: () => void;
  markReposted: (key: string) => void;
  closePlayer: () => void;
}

export function getTargetKey(targetType: string, targetId: string | number) {
  return `${targetType}:${targetId}`;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentItem: null,
  isPlaying: false,
  playSecondsMap: {},
  eligibleMap: {},
  repostedMap: {},

  playItem: (item) => {
    const current = get().currentItem;
    if (
      current &&
      current.targetId === item.targetId &&
      current.targetType === item.targetType
    ) {
      set({ isPlaying: !get().isPlaying });
      return;
    }
    set({ currentItem: item, isPlaying: true });
  },

  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  tickSecond: () => {
    const { currentItem, isPlaying, playSecondsMap, eligibleMap } = get();
    if (!currentItem || !isPlaying) return;

    const key = getTargetKey(currentItem.targetType, currentItem.targetId);
    const nextSeconds = Math.round(((playSecondsMap[key] || 0) + 1) * 10) / 10;
    const wasEligible = Boolean(eligibleMap[key]);
    const nowEligible = nextSeconds >= PLAYBACK_ELIGIBILITY_SECONDS;

    set({
      playSecondsMap: { ...playSecondsMap, [key]: nextSeconds },
      eligibleMap: nowEligible ? { ...eligibleMap, [key]: true } : eligibleMap,
    });

    // Notify backend once when crossing the 15-second eligibility threshold
    if (!wasEligible && nowEligible) {
      fetch('/api/user/playback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: currentItem.targetId,
          targetType: currentItem.targetType,
          actualPlayTime: nextSeconds,
          action: 'eligible',
        }),
      }).catch(() => {});
    }
  },

  markReposted: (key) => {
    set((state) => ({
      repostedMap: { ...state.repostedMap, [key]: true },
    }));
  },

  closePlayer: () => {
    set({ currentItem: null, isPlaying: false });
  },
}));
