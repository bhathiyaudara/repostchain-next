'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  Search,
  Star,
  Crown,
  Zap,
  Users,
  Music,
  Radio,
  Send,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Wallet,
  ArrowRight,
  ListMusic,
} from 'lucide-react';
import { RepostChainMark, SoundCloudMark } from '@/components/public-layout';

const ALL_GENRES = [
  'All Genres',
  'Electronic',
  'Melodic Techno',
  'Deep House',
  'Hip-Hop & Rap',
  'Tech House',
  'Pop',
  'Drum & Bass',
  'Trap',
  'Progressive House',
  'Dance & EDM',
  'Ambient',
  'Alternative Rock',
  'Indie',
  'Classical',
  'Dubstep',
  'Disco',
];

interface MemberItem {
  urn: string;
  name: string;
  nickname?: string | null;
  avatar?: string;
  followers_count: number;
  track_count: number;
  reposts_count: number;
  response_rate: number;
  repost_price: number;
  isOnline: boolean;
  offlineStatus: string;
  isPro: boolean;
  planName: string;
  genres: string[];
  isStarred: boolean;
  soundcloud_permalink_url: string;
  created_at: string;
}

interface UserTrackItem {
  id: number;
  title: string;
  artwork_url?: string;
  genre?: string;
  permalink_url?: string;
}

interface UserPlaylistItem {
  id: number;
  title: string;
  artwork_url?: string;
  track_count?: number;
  permalink_url?: string;
}

export default function MembersPage() {
  const queryClient = useQueryClient();

  // Filter and search states
  const [activeTab, setActiveTab] = useState<'all' | 'favourites' | 'pro'>('all');
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [costOrder, setCostOrder] = useState<'none' | 'low_to_high' | 'high_to_low'>('none');
  const [page, setPage] = useState(1);

  // Dropdown states
  const [openGenreDropdown, setOpenGenreDropdown] = useState(false);
  const [openCostDropdown, setOpenCostDropdown] = useState(false);

  // Direct Request Modal state
  const [selectedTargetMember, setSelectedTargetMember] = useState<MemberItem | null>(null);
  const [modalStep, setModalStep] = useState<'select-music' | 'configure-request'>('select-music');
  const [musicTab, setMusicTab] = useState<'tracks' | 'playlists'>('tracks');
  const [selectedMusic, setSelectedMusic] = useState<UserTrackItem | UserPlaylistItem | null>(null);
  const [musicSearchQuery, setMusicSearchQuery] = useState('');
  const [description, setDescription] = useState('');
  const [likeable, setLikeable] = useState(true);
  const [commentable, setCommentable] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showLowCreditModal, setShowLowCreditModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Query members directory
  const { data, isLoading } = useQuery({
    queryKey: ['members-directory', activeTab, search, selectedGenres, costOrder, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('tab', activeTab);
      if (search) params.set('search', search);
      if (selectedGenres.length > 0) params.set('genre', selectedGenres.join(','));
      if (costOrder !== 'none') params.set('costOrder', costOrder);
      params.set('page', String(page));
      params.set('perPage', '12');

      const res = await fetch(`/api/user/members?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load members');
      return res.json();
    },
  });

  const members: MemberItem[] = data?.members || [];
  const counts = data?.counts || { all: 0, favourites: 0, pro: 0 };
  const pagination = data?.pagination || { page: 1, perPage: 12, total: 0, totalPages: 1 };
  const userCredits: number = data?.userCredits ?? 120;
  const userTracks: UserTrackItem[] = data?.userTracks || [];
  const userPlaylists: UserPlaylistItem[] = data?.userPlaylists || [];

  // Toggle Favourite / Star Mutation
  const toggleStarMutation = useMutation({
    mutationFn: async (targetUrn: string) => {
      const res = await fetch('/api/user/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-star', targetUrn }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members-directory'] });
    },
  });

  // Send Direct Repost Request Mutation
  const sendDirectRequestMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTargetMember || !selectedMusic) return;

      const res = await fetch('/api/user/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-direct-request',
          targetUrn: selectedTargetMember.urn,
          musicId: selectedMusic.id,
          musicType: musicTab === 'playlists' ? 'playlist' : 'track',
          description,
          likeable,
          commentable,
          following,
          repostPrice: selectedTargetMember.repost_price,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.lowCredit) {
          setShowLowCreditModal(true);
        }
        throw new Error(json.error || 'Failed to send request');
      }
      return json;
    },
    onSuccess: (data) => {
      setSuccessToast(data?.message || 'Direct repost request sent successfully!');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['members-directory'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      setTimeout(() => setSuccessToast(null), 5000);
    },
  });

  const toggleGenre = (genre: string) => {
    if (genre === 'All Genres') {
      setSelectedGenres([]);
      setPage(1);
      return;
    }
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setPage(1);
  };

  const openRequestModal = (member: MemberItem) => {
    // Check minimum credit requirement (50 credits matching Laravel)
    if (userCredits < 50 || userCredits < member.repost_price) {
      setShowLowCreditModal(true);
      return;
    }

    setSelectedTargetMember(member);
    setModalStep('select-music');
    setSelectedMusic(null);
    setDescription('');
    setLikeable(true);
    setCommentable(false);
    setFollowing(false);
    setMusicSearchQuery('');
  };

  const closeModal = () => {
    setSelectedTargetMember(null);
    setSelectedMusic(null);
    setModalStep('select-music');
    setDescription('');
  };

  // Filter user's tracks / playlists by modal search query
  const filteredUserTracks = userTracks.filter((t) =>
    t.title.toLowerCase().includes(musicSearchQuery.toLowerCase())
  );
  const filteredUserPlaylists = userPlaylists.filter((p) =>
    p.title.toLowerCase().includes(musicSearchQuery.toLowerCase())
  );

  // Total cost calculation: base repost price + (commentable ? 2 : 0) + (likeable ? 2 : 0)
  const currentTotalCost =
    (selectedTargetMember?.repost_price || 10) +
    (commentable ? 2 : 0) +
    (likeable ? 2 : 0);

  return (
    <div className="sc-dash space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================= */}
      {/* 1. SIGNATURE EDITORIAL HERO SECTION */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-[1px] shadow-2xl">
        <div className="rounded-[23px] bg-[#121212] p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF5500]/15 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Official Rounded Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-3.5 backdrop-blur-sm">
                <RepostChainMark className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(255,85,0,0.4)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                  CREATOR COMMUNITY
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-[#FF5500] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  SOUNDCLOUD NETWORK
                </span>
              </div>

              {/* Bold All-Caps Display Headline */}
              <h1 className="sc-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">
                ARTIST <span className="text-[#FF5500]">COMMUNITY</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Connect directly with verified SoundCloud artists, explore genre curators, and send direct repost requests to expand your reach.
              </p>
            </div>

            {/* Quick Action Navigation matching other pages */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/user/chat"
                className="sc-pill-dark px-5 py-3 text-xs sm:text-sm font-bold border border-white/15 hover:border-white/40 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#FF5500]" />
                <span>Collab Chat</span>
              </Link>

              <Link
                href="/user/reposts-request"
                className="sc-pill-dark px-5 py-3 text-xs sm:text-sm font-bold border border-white/15 hover:border-white/40 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#FF5500]" />
                <span>Direct Requests</span>
              </Link>

              <Link
                href="/user/campaign-management/campaigns"
                className="sc-pill-white px-6 py-3 text-xs sm:text-sm font-bold shadow-xl shadow-white/5 flex items-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>Campaign Feed</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. UNDERLINE TABS (Matching Performance Overview & Feed) */}
      {/* ========================================================= */}
      <div className="border-b border-gray-200 dark:border-white/[0.1] mb-5">
        <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'all'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <span>All Artists</span>
            <span className="text-xs font-mono text-[#FF5500]">({counts.all})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('favourites');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'favourites'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-[#FF5500] text-[#FF5500]" />
            <span>Favourites</span>
            <span className="text-xs font-mono text-[#FF5500]">({counts.favourites})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('pro');
              setPage(1);
            }}
            className={`tab-button pb-3 text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'pro'
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Artist Pro</span>
            <span className="text-xs font-mono text-[#FF5500]">({counts.pro})</span>
          </button>
        </nav>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTER CONTROLS BAR (SEARCH BAR RESIZED NEXT TO FILTERS) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 relative z-30 mb-6">
        {/* Filter by Genre (Multi-select Popover) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenGenreDropdown(!openGenreDropdown);
              setOpenCostDropdown(false);
            }}
            className={`w-full sm:w-auto px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-between sm:justify-start gap-2 transition-all shadow-sm cursor-pointer ${
              selectedGenres.length > 0
                ? 'bg-orange-50 dark:bg-[#FF5500]/15 border border-orange-300 dark:border-[#FF5500]/50 text-[#FF5500]'
                : 'border border-gray-300 dark:border-white/10 bg-white hover:bg-gray-50 text-slate-700 dark:bg-[#181818] dark:hover:bg-[#202020] dark:text-white'
            }`}
          >
            <Music className="w-4 h-4 text-[#FF5500] shrink-0" />
            <span className="truncate">
              Genre {selectedGenres.length > 0 ? `/ ${selectedGenres.length}` : ''}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
          </button>

          {openGenreDropdown && (
            <div className="absolute left-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl shadow-2xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 p-3.5 max-h-96 overflow-y-auto z-50">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-200 dark:border-white/[0.08]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
                  SELECT GENRES ({selectedGenres.length} ACTIVE)
                </span>
                {selectedGenres.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenres([]);
                      setPage(1);
                    }}
                    className="text-xs font-bold text-[#FF5500] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map((g) => {
                  const isSelected =
                    g === 'All Genres'
                      ? selectedGenres.length === 0
                      : selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30'
                          : 'bg-gray-100 dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-white/[0.12]'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter / Sort by Cost */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenCostDropdown(!openCostDropdown);
              setOpenGenreDropdown(false);
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-gray-300 dark:border-white/10 bg-white hover:bg-gray-50 text-slate-700 dark:bg-[#181818] dark:hover:bg-[#202020] dark:text-white flex items-center justify-between gap-2.5 transition-all shadow-sm cursor-pointer"
          >
            <span className="text-slate-500 dark:text-zinc-400 truncate">Sort /</span>
            <span className="text-[#FF5500] font-bold">
              {costOrder === 'low_to_high'
                ? 'Price: Low to High'
                : costOrder === 'high_to_low'
                ? 'Price: High to Low'
                : 'Recently Active'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
          </button>

          {openCostDropdown && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 p-1.5 z-50">
              <button
                type="button"
                onClick={() => {
                  setCostOrder('none');
                  setOpenCostDropdown(false);
                  setPage(1);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  costOrder === 'none'
                    ? 'bg-[#FF5500] text-white font-bold'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]'
                }`}
              >
                <span>Recently Active (Default)</span>
                {costOrder === 'none' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCostOrder('low_to_high');
                  setOpenCostDropdown(false);
                  setPage(1);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  costOrder === 'low_to_high'
                    ? 'bg-[#FF5500] text-white font-bold'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]'
                }`}
              >
                <span>Price: Low to High</span>
                {costOrder === 'low_to_high' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCostOrder('high_to_low');
                  setOpenCostDropdown(false);
                  setPage(1);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  costOrder === 'high_to_low'
                    ? 'bg-[#FF5500] text-white font-bold'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]'
                }`}
              >
                <span>Price: High to Low</span>
                {costOrder === 'high_to_low' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Compact Search Bar directly aligned with filters */}
        <div className="flex-1 sm:max-w-md w-full">
          <div className="relative flex items-center bg-white dark:bg-[#181818] border border-gray-300 dark:border-white/10 focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/20 rounded-full transition-all shadow-sm">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 ml-3.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by artist name or SoundCloud URL..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 py-2 pl-2.5 pr-8 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 text-slate-400 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Genre Pills Strip */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-zinc-400 mr-1">
            Active:
          </span>
          {selectedGenres.map((g) => (
            <span
              key={g}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-[#FF5500]/20 text-[#FF5500] border border-orange-200 dark:border-[#FF5500]/30"
            >
              <span>{g}</span>
              <button
                type="button"
                onClick={() => toggleGenre(g)}
                className="hover:text-orange-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => {
              setSelectedGenres([]);
              setPage(1);
            }}
            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-[#FF5500] underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MEMBER CARDS GRID */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] animate-pulse shadow-sm"
            />
          ))}
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {members.map((member) => (
            <div
              key={member.urn}
              className="relative rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between p-5 group"
            >
              {/* Top Row: Avatar, Badge, Star */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Avatar with Online Pulse */}
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar || '/default_img/no_img.jpg'}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-white/10 shadow-sm"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                        }}
                      />
                      {member.isOnline ? (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white dark:border-[#121212] shadow-sm"
                          title="Online now"
                        />
                      ) : member.offlineStatus !== 'Offline' ? (
                        <div
                          className="absolute -bottom-1 -right-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 rounded-full text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 text-[9px] font-bold tracking-tight whitespace-nowrap shadow-xs"
                          title={`Last seen: ${member.offlineStatus}`}
                        >
                          {member.offlineStatus}
                        </div>
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Plan Badge */}
                      <div className="mb-1">
                        {member.isPro ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#FF5500]/15 to-[#FF7730]/15 text-[#FF5500] border border-[#FF5500]/30 shadow-xs">
                            <Crown className="w-3 h-3 text-[#FF5500]" />
                            <span>{member.planName}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/[0.06] text-slate-600 dark:text-zinc-400 border border-gray-200 dark:border-white/5">
                            <Zap className="w-3 h-3 text-slate-400 dark:text-zinc-400" />
                            <span>Free Plan</span>
                          </span>
                        )}
                      </div>

                      {/* Artist Name & Joined Date */}
                      <a
                        href={member.soundcloud_permalink_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base text-slate-900 dark:text-white hover:text-[#FF5500] dark:hover:text-[#FF5500] transition-colors truncate flex items-center gap-1 group/link"
                      >
                        <span className="truncate">{member.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 text-[#FF5500]" />
                      </a>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">
                        Joined {new Date(member.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Star / Favorite Button */}
                  <button
                    type="button"
                    onClick={() => toggleStarMutation.mutate(member.urn)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
                    title={member.isStarred ? 'Remove from Favourites' : 'Add to Favourites'}
                  >
                    <Star
                      className={`w-5 h-5 transition-transform active:scale-125 ${
                        member.isStarred
                          ? 'fill-[#FF5500] text-[#FF5500]'
                          : 'text-gray-300 dark:text-zinc-600 hover:text-gray-400 dark:hover:text-zinc-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Genres Pills Strip */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mb-4">
                  {member.genres.slice(0, 3).map((g) => (
                    <span
                      key={g}
                      className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 text-[10px] rounded-full font-semibold whitespace-nowrap shrink-0 border border-gray-200/60 dark:border-white/5"
                    >
                      {g}
                    </span>
                  ))}
                  {member.genres.length > 3 && (
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                      +{member.genres.length - 3}
                    </span>
                  )}
                </div>

                {/* KPI Stats Grid */}
                <div className="grid grid-cols-4 gap-2 py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 mb-4 text-center">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-[#FF5500]" />
                      <span>Fans</span>
                    </div>
                    <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5">
                      {member.followers_count >= 1000
                        ? `${(member.followers_count / 1000).toFixed(1)}k`
                        : member.followers_count}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500 flex items-center justify-center gap-1">
                      <Music className="w-3 h-3 text-[#FF5500]" />
                      <span>Tracks</span>
                    </div>
                    <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5">
                      {member.track_count}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500">
                      Response
                    </div>
                    <div className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {member.response_rate}%
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500">
                      Cost
                    </div>
                    <div className="text-xs font-black font-mono text-[#FF5500] mt-0.5">
                      {member.repost_price}c
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => openRequestModal(member)}
                  className="flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF5500] hover:bg-[#ff6a1a] text-white shadow-md shadow-[#FF5500]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request ({member.repost_price}c)</span>
                </button>

                <Link
                  href={`/user/chat?partner=${encodeURIComponent(member.urn)}`}
                  className="px-3 py-2 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-zinc-300 border border-gray-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  title="Send message in Collab Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/[0.08] shadow-sm">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500]">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="sc-display text-xl font-bold text-slate-900 dark:text-white mb-1">
            No Members Found
          </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-md mx-auto mb-5 font-normal">
            No creators match the current filter criteria or search query. Try resetting filters to explore more artists.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedGenres([]);
              setCostOrder('none');
              setActiveTab('all');
              setPage(1);
            }}
            className="sc-pill-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PAGINATION CONTROLS */}
      {/* ========================================================= */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-white/[0.08] mt-6 pt-4 gap-3">
          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            SHOWING <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * 12 + 1}</span> TO{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(page * 12, pagination.total)}
            </span>{' '}
            OF <span className="font-bold text-slate-900 dark:text-white">{pagination.total}</span> ARTISTS
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <span key={p} className="flex items-center">
                    {prev && p - prev > 1 && (
                      <span className="px-2 text-xs font-mono text-gray-400 dark:text-zinc-500">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                        page === p
                          ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30'
                          : 'bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.12]'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TWO-STEP DIRECT REPOST REQUEST MODAL (Matching Laravel) */}
      {/* ========================================================= */}
      {selectedTargetMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5500]/15 flex items-center justify-center text-[#FF5500]">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="sc-display text-lg font-black text-slate-900 dark:text-white tracking-wider">
                    {modalStep === 'select-music' ? 'SELECT YOUR TRACK OR PLAYLIST' : 'CONFIRM DIRECT REQUEST'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Sending to <strong className="text-slate-800 dark:text-white">{selectedTargetMember.name}</strong> ({selectedTargetMember.repost_price} base credits)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: Select Track or Playlist */}
            {modalStep === 'select-music' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {/* Tabs: Tracks vs Playlists */}
                <div className="flex rounded-full bg-gray-100 dark:bg-white/[0.04] p-1 border border-gray-200 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setMusicTab('tracks')}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      musicTab === 'tracks'
                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>My Tracks ({userTracks.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMusicTab('playlists')}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      musicTab === 'playlists'
                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ListMusic className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>My Playlists ({userPlaylists.length})</span>
                  </button>
                </div>

                {/* Search input */}
                <div className="relative flex items-center bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
                  <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={musicSearchQuery}
                    onChange={(e) => setMusicSearchQuery(e.target.value)}
                    placeholder={
                      musicTab === 'tracks'
                        ? 'Filter your tracks by title...'
                        : 'Filter your playlists by title...'
                    }
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                {/* Items List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {musicTab === 'tracks' ? (
                    filteredUserTracks.length > 0 ? (
                      filteredUserTracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => {
                            setSelectedMusic(track);
                            setModalStep('configure-request');
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] border border-gray-200/60 hover:border-orange-300 dark:border-white/5 dark:hover:border-[#FF5500]/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={track.artwork_url || '/default_img/no_img.jpg'}
                              alt={track.title}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#FF5500] transition-colors">
                                {track.title}
                              </p>
                              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                                {track.genre || 'Electronic'} • Track
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-[#FF5500] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              Select <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-500 dark:text-zinc-400 text-xs">
                        No tracks found matching your search.
                      </div>
                    )
                  ) : filteredUserPlaylists.length > 0 ? (
                    filteredUserPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => {
                          setSelectedMusic(pl);
                          setModalStep('configure-request');
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] border border-gray-200/60 hover:border-orange-300 dark:border-white/5 dark:hover:border-[#FF5500]/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={pl.artwork_url || '/default_img/no_img.jpg'}
                            alt={pl.title}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#FF5500] transition-colors">
                              {pl.title}
                            </p>
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                              {pl.track_count || 1} tracks • Playlist
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-[#FF5500] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Select <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-zinc-400 text-xs">
                      No playlists found matching your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Configure Request (Message + Comment/Like Plus) */}
            {modalStep === 'configure-request' && selectedMusic && (
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {/* Target & Selected Music Summary */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedMusic.artwork_url || '/default_img/no_img.jpg'}
                      alt={selectedMusic.title}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#FF5500] font-bold">
                        Selected {musicTab === 'playlists' ? 'Playlist' : 'Track'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {selectedMusic.title}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalStep('select-music')}
                    className="text-xs font-bold text-[#FF5500] hover:underline cursor-pointer shrink-0"
                  >
                    Change
                  </button>
                </div>

                {/* Personal Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Personal Message (Optional)
                    </label>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                      {description.length} / 200
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Introduce your track, share the genre vibe, and explain why their audience would love it..."
                    className="w-full rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#181818] p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF5500] transition-colors"
                  />
                </div>

                {/* Comment Plus & Like Plus (From Laravel) */}
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={commentable}
                        onChange={(e) => setCommentable(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5500] rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Comment Plus
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Incentivize artist to leave a comment on SoundCloud
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF5500]">+2 credits</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={likeable}
                        onChange={(e) => setLikeable(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5500] rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Like Plus
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Incentivize artist to like track on SoundCloud
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF5500]">+2 credits</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={following}
                        onChange={(e) => setFollowing(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5500] rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Follow Artist
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Follow {selectedTargetMember.name} on SoundCloud
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500">Free</span>
                  </label>
                </div>

                {/* Total Cost Breakdown Strip */}
                <div className="p-3.5 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Total Cost: <span className="text-[#FF5500] font-black">{currentTotalCost} Credits</span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                      Your Available Balance: {userCredits} credits
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    24h Guarantee
                  </span>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 dark:border-white/10 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {modalStep === 'select-music' ? (
                <button
                  type="button"
                  disabled={!selectedMusic}
                  onClick={() => setModalStep('configure-request')}
                  className="sc-pill-orange px-6 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  disabled={sendDirectRequestMutation.isPending}
                  onClick={() => sendDirectRequestMutation.mutate()}
                  className="sc-pill-orange px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg shadow-[#FF5500]/25 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {sendDirectRequestMutation.isPending
                      ? 'Sending Request...'
                      : `Send Request (${currentTotalCost} Credits)`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. LOW CREDIT WARNING MODAL (From Laravel member.blade.php) */}
      {/* ========================================================= */}
      {showLowCreditModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/15 rounded-3xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-500 mx-auto mb-4 flex items-center justify-center">
              <Wallet className="w-8 h-8" />
            </div>

            <h3 className="sc-display text-xl font-black text-slate-900 dark:text-white tracking-wider mb-2">
              LOW CREDIT WARNING
            </h3>

            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-2 leading-relaxed">
              You need a minimum of <strong>50 credits</strong> to send a direct request.
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mb-6">
              Your current balance is <strong>{userCredits} credits</strong>. Please add more credits to your account to proceed with direct requests.
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/user/billing"
                className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF5500] hover:bg-[#ff6a1a] text-white shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Buy Credits Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowLowCreditModal(false)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
