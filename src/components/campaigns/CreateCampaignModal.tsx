'use client';

import { useState } from 'react';
import { X, Flame, Music, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateFollowersLimit, MORPH_TYPES } from '@/lib/constants';

interface TrackOption {
  id: number | string;
  title: string;
  genre?: string | null;
  artwork_url?: string | null;
  playback_count?: number;
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: TrackOption[];
  availableCredits: number;
  onSuccess: () => void;
}

const GENRES = [
  'anyGenre',
  'Melodic Techno',
  'Progressive House',
  'Deep House',
  'Drum & Bass',
  'Tech House',
  'Hip-Hop & Rap',
  'Electronic',
  'Pop',
  'Ambient',
];

export function CreateCampaignModal({
  isOpen,
  onClose,
  tracks,
  availableCredits,
  onSuccess,
}: CreateCampaignModalProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string | number>(
    tracks[0]?.id ?? 101
  );
  const [budgetCredits, setBudgetCredits] = useState<number>(100);
  const [targetGenre, setTargetGenre] = useState<string>('Melodic Techno');
  const [description, setDescription] = useState<string>('');
  const [likeable, setLikeable] = useState<boolean>(true);
  const [commentable, setCommentable] = useState<boolean>(true);
  const [proFeature, setProFeature] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedTrack =
    tracks.find((t) => String(t.id) === String(selectedTrackId)) || tracks[0];
  const estimatedReach = calculateFollowersLimit(budgetCredits, likeable, commentable);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (budgetCredits < 50) {
      setError('Minimum campaign budget is 50 credits.');
      return;
    }
    if (budgetCredits > availableCredits) {
      setError(`You only have ${availableCredits} credits available.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          musicId: selectedTrack?.id ?? 101,
          musicType: MORPH_TYPES.TRACK,
          title: selectedTrack?.title ?? 'New Track Campaign',
          description,
          budgetCredits,
          targetGenre,
          likeable,
          commentable,
          proFeature,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create campaign');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error while creating campaign.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Launch Repost Campaign</h2>
              <p className="text-xs text-zinc-400">
                Available Balance:{' '}
                <span className="text-orange-400 font-semibold">{availableCredits} Credits</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Track Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              1. Select SoundCloud Track
            </label>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {tracks.map((track) => {
                const isSelected = String(track.id) === String(selectedTrackId);
                return (
                  <button
                    type="button"
                    key={track.id}
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {track.artwork_url ? (
                        <img
                          src={track.artwork_url}
                          alt={track.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                          <Music className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{track.title}</p>
                        <p className="text-xs text-zinc-400">{track.genre || 'Electronic'}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Target Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Budget Credits (Min 50)
              </label>
              <input
                type="number"
                min={50}
                max={availableCredits || 5000}
                step={10}
                value={budgetCredits}
                onChange={(e) => setBudgetCredits(Number(e.target.value))}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Target Genre
              </label>
              <select
                value={targetGenre}
                onChange={(e) => setTargetGenre(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g === 'anyGenre' ? 'Any Genre' : g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Engagement Options */}
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={likeable}
                onChange={(e) => setLikeable(e.target.checked)}
                className="accent-orange-500"
              />
              <span className="text-xs text-zinc-200">Enable Likes (+2)</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={commentable}
                onChange={(e) => setCommentable(e.target.checked)}
                className="accent-orange-500"
              />
              <span className="text-xs text-zinc-200">Comments (+2)</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={proFeature}
                onChange={(e) => setProFeature(e.target.checked)}
                className="accent-orange-500"
              />
              <span className="text-xs text-orange-400 font-medium">Pro Priority</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Campaign Note (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Looking for support from Melodic Techno & Progressive channels!"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Estimated Reach Summary */}
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-xs text-zinc-300">Estimated Follower Reach</p>
                <p className="text-sm font-bold text-white">
                  Up to {estimatedReach.toLocaleString()} SoundCloud Followers
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-xs font-semibold text-white transition shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              {submitting ? 'Launching...' : `Launch Campaign (${budgetCredits} Credits)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
