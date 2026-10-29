'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './campaigns.module.css';
import Script from 'next/script';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  ChevronDown,
  ArrowUpRight,
  Repeat2,
  Headphones,
  Coins,
  Search,
  Star,
  Music,
  ExternalLink,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/soundcloud-player';

import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';

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
  'Ambient',
  'Future Bass',
  'House',
  'R&B',
  'Rock',
];

export default function CampaignsFeedPage() {
  const queryClient = useQueryClient();
  const [activeMainTab, setActiveMainTab] = useState<'recommended_pro' | 'recommended' | 'all'>('recommended_pro');
  const [trackType, setTrackType] = useState<'all' | 'track' | 'playlist'>('all');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openGenreDropdown, setOpenGenreDropdown] = useState(false);
  const [playingCampaignId, setPlayingCampaignId] = useState<string | null>(null);
  const [playTimes, setPlayTimes] = useState<Record<string, number>>({});
  const [repostedIds, setRepostedIds] = useState<Record<string, boolean>>({});
  const [starredUrns, setStarredUrns] = useState<Record<string, boolean>>({});
  const [openArtistMenuId, setOpenArtistMenuId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  // Fetch campaigns feed
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['campaigns-feed', activeMainTab, trackType, selectedGenres, search, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set(
        'tab',
        activeMainTab === 'recommended_pro' ? 'recommendedPro' : activeMainTab
      );
      if (trackType !== 'all') params.set('trackType', trackType);
      if (selectedGenres.length > 0) params.set('genre', selectedGenres.join(','));
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('perPage', '12');

      const res = await fetch(`/api/user/campaigns?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load campaigns');
      return res.json();
    },
  });

  // Fetch dashboard summary
  const { data: dashData } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  // 15-second playback timer for active track
  useEffect(() => {
    if (!playingCampaignId) return;
    const interval = setInterval(() => {
      setPlayTimes((prev) => {
        const nextVal = Math.min(15, (prev[playingCampaignId] || 0) + 1);
        return { ...prev, [playingCampaignId]: nextVal };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playingCampaignId]);

  // Sync already reposted IDs from feed query
  useEffect(() => {
    if (data?.campaigns) {
      const initialReposts: Record<string, boolean> = {};
      data.campaigns.forEach((c: { id: string | number; alreadyReposted?: boolean }) => {
        if (c.alreadyReposted) {
          initialReposts[String(c.id)] = true;
        }
      });
      setRepostedIds((prev) => ({ ...initialReposts, ...prev }));
    }
  }, [data]);

  // Handle genre toggle
  const toggleGenre = (genre: string) => {
    if (genre === 'All Genres') {
      setSelectedGenres([]);
      setPage(1);
      return;
    }
    setSelectedGenres((prev) => {
      const exists = prev.includes(genre);
      const updated = exists ? prev.filter((g) => g !== genre) : [...prev, genre];
      return updated;
    });
    setPage(1);
  };

  // Repost mutation
  const repostMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      // 1. Notify playback threshold
      await fetch('/api/user/playback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: campaignId,
          targetType: 'campaign',
          actualPlayTime: 15,
          action: 'eligible',
        }),
      });

      // 2. Perform database repost & credit earning
      const res = await fetch('/api/user/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'repost',
          campaignId,
          liked: true,
          comment: '',
          followed: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to repost campaign');
      }
      return campaignId;
    },
    onSuccess: (campaignId) => {
      setRepostedIds((prev) => ({ ...prev, [campaignId]: true }));
      queryClient.invalidateQueries({ queryKey: ['campaigns-feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
    },
  });

  // Star Artist mutation
  const starMutation = useMutation({
    mutationFn: async (targetUrn: string) => {
      const res = await fetch('/api/user/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-star',
          targetUrn,
        }),
      });
      return res.json();
    },
    onSuccess: (resData, targetUrn) => {
      if (resData && typeof resData.isStarred === 'boolean') {
        setStarredUrns((prev) => ({ ...prev, [targetUrn]: resData.isStarred }));
      }
    },
  });

  const handleToggleStar = (urn: string) => {
    setStarredUrns((prev) => ({ ...prev, [urn]: !prev[urn] }));
    starMutation.mutate(urn);
  };

  const campaigns = data?.campaigns || [];
  const counts = data?.counts || {
    recommendedPro: campaigns.length,
    recommended: campaigns.length,
    all: campaigns.length,
  };
  const pagination = data?.pagination || {
    page: 1,
    perPage: 12,
    total: campaigns.length,
    totalPages: Math.ceil((campaigns.length || 1) / 12),
  };

  const togglePlay = (campaignId: string) => {
    setPlayingCampaignId((prev) => (prev === campaignId ? null : campaignId));
  };

  const availableCredits = dashData?.kpis?.availableCredits ?? 0;
  const recentTracks = dashData?.recentTracks || [];
  const userRepostPrice = dashData?.user?.repost_price || 1;

  const resetFilters = () => {
    setSelectedGenres([]);
    setTrackType('all');
    setSearch('');
    setPage(1);
  };
  const hasFilters = selectedGenres.length > 0 || trackType !== 'all' || !!search;

  return (
    <div className={styles.page}>
      <Script src="https://w.soundcloud.com/player/api.js" strategy="lazyOnload" />
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><span className={styles.liveDot} /> THE REPOST EXCHANGE</p>
          <h1 className={`sc-display ${styles.title}`}>FIND YOUR<br /><span>NEXT REPOST.</span></h1>
          <p className={styles.intro}>Discover independent sounds. Support another artist.<br className="hidden sm:block" /> Earn credits to take your own music further.</p>
        </div>
        <div className={styles.heroAction}>
          <button type="button" className="sc-pill-orange" onClick={() => setShowCreateModal(true)}><Plus size={18} /> Start a campaign</button>
          <Link href="/user/campaign-management/my-campaigns">Manage my campaigns <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.feed} aria-label="Discover campaigns">
          <nav className={styles.tabs} aria-label="Campaign feeds">
            {([
              ['recommended_pro', 'Recommended Pro', counts.recommendedPro],
              ['recommended', 'For you', counts.recommended],
              ['all', 'All campaigns', counts.all],
            ] as const).map(([value, label, count]) => (
              <button key={value} type="button" aria-current={activeMainTab === value ? 'page' : undefined} onClick={() => { setActiveMainTab(value); setPage(1); }} className={activeMainTab === value ? styles.activeTab : ''}>
                {label}<span>{count}</span>
              </button>
            ))}
          </nav>

          <div className={styles.filters}>
            <label className={styles.search}>
              <Search size={17} aria-hidden="true" />
              <input aria-label="Search campaigns" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search tracks, genres, tags…" />
              {search ? <button type="button" aria-label="Clear search" onClick={() => { setSearch(''); setPage(1); }}><X size={15} /></button> : null}
            </label>
            <label className={styles.typeFilter}>
              <span className="sr-only">Track type</span>
              <select value={trackType} onChange={(e) => { setTrackType(e.target.value as 'all' | 'track' | 'playlist'); setPage(1); }}>
                <option value="all">All formats</option><option value="track">Tracks</option><option value="playlist">Playlists</option>
              </select>
            </label>
            <div className={styles.genreFilter}>
              <button type="button" aria-expanded={openGenreDropdown} aria-controls="campaign-genres" onClick={() => setOpenGenreDropdown(!openGenreDropdown)} className={styles.filterButton}>
                Genres {selectedGenres.length ? `(${selectedGenres.length})` : ''}<ChevronDown size={15} />
              </button>
              {openGenreDropdown ? <>
                <button type="button" className={styles.dismiss} aria-label="Close genre filter" onClick={() => setOpenGenreDropdown(false)} />
                <div id="campaign-genres" className={styles.genrePopover} onKeyDown={(e) => { if (e.key === 'Escape') setOpenGenreDropdown(false); }}>
                  <div className={styles.popoverHeading}><span>MAKE IT YOUR SOUND</span><button type="button" aria-label="Close genres" onClick={() => setOpenGenreDropdown(false)}><X size={16} /></button></div>
                  <div className={styles.genreOptions}>{ALL_GENRES.map((genre) => <button type="button" key={genre} aria-pressed={genre === 'All Genres' ? selectedGenres.length === 0 : selectedGenres.includes(genre)} onClick={() => toggleGenre(genre)}>{genre}</button>)}</div>
                </div>
              </> : null}
            </div>
          </div>
          {hasFilters ? <div className={styles.activeFilters}>
            {selectedGenres.map((genre) => <button type="button" key={genre} onClick={() => toggleGenre(genre)}>{genre}<X size={12} /></button>)}
            <button type="button" onClick={resetFilters}>Clear filters <X size={12} /></button>
          </div> : null}

          <div className={styles.feedHeading}><span>{isLoading ? 'FINDING YOUR SOUND' : `${pagination.total} CAMPAIGNS TO EXPLORE`}</span><span>LISTEN. REPOST. GROW.</span></div>
          {repostMutation.isError ? <p role="alert" className={styles.error}>{repostMutation.error.message}</p> : null}
          <div aria-busy={isLoading}>
            {isLoading ? <div role="status" aria-label="Loading campaigns">{[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}</div>
            : isError ? <div className={styles.empty} role="alert"><Music size={32} /><h2>Couldn't load the music.</h2><p>Please try loading the campaigns again.</p><button type="button" className="sc-pill-orange" onClick={() => refetch()}>Try again</button></div>
            : campaigns.length ? campaigns.map((campaign: {
              id: string; budget_credits: number; credits_spent: number; target_genre?: string; is_featured?: number; is_boost?: number;
              user?: { urn?: string; name?: string; avatar?: string; soundcloud_permalink_url?: string };
              music?: { id?: string; title?: string; genre?: string; artwork_url?: string; permalink_url?: string; author_username?: string };
            }, index: number) => {
              const campaignId = String(campaign.id);
              const playSec = playTimes[campaignId] || 0;
              const isEligible = playSec >= 15;
              const isReposted = !!repostedIds[campaignId];
              const remainingCredits = Math.max(0, Number(campaign.budget_credits ?? 0) - Number(campaign.credits_spent ?? 0));
              const artistUrn = campaign.user?.urn;
              const artistName = campaign.user?.name || campaign.music?.author_username || 'SoundCloud Artist';
              const isPending = repostMutation.isPending && repostMutation.variables === campaignId;
              return <article key={campaignId} className={styles.campaign}>
                <div className={styles.rowHeading}>
                  <span className={styles.index}>{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
                  <span className={styles.genre}>{campaign.target_genre && campaign.target_genre !== 'anyGenre' ? campaign.target_genre : campaign.music?.genre || 'Any genre'}</span>
                  {campaign.is_featured ? <span className={styles.featured}>FEATURED</span> : null}
                  {campaign.is_boost ? <span className={styles.boosted}>BOOSTED</span> : null}
                  <span className={styles.budget}>{remainingCredits.toLocaleString()} credits remaining</span>
                </div>
                <div className={styles.player}>
                  <SoundCloudPlayer track={campaign.music} height={166} visual={false} isPlaying={playingCampaignId === campaignId} playSeconds={playSec}
                    onTogglePlay={() => togglePlay(campaignId)}
                    onProgress={(sec) => setPlayTimes((prev) => ({ ...prev, [campaignId]: Math.min(15, sec) }))}
                    onEligible={() => setPlayTimes((prev) => ({ ...prev, [campaignId]: 15 }))} />
                </div>
                <div className={styles.rowFooter}>
                  <div className={styles.artist}>
                    <img src={campaign.user?.avatar || '/default_img/no_img.jpg'} alt="" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/default_img/no_img.jpg'; }} />
                    <div className={styles.artistName}>
                      <button type="button" aria-expanded={openArtistMenuId === campaignId} onClick={() => setOpenArtistMenuId(openArtistMenuId === campaignId ? null : campaignId)}>{artistName}<ChevronDown size={13} /></button>
                      <span>Independent artist</span>
                      {openArtistMenuId === campaignId ? <div className={styles.artistPopover}>
                        {campaign.user?.soundcloud_permalink_url ? <a href={campaign.user.soundcloud_permalink_url} target="_blank" rel="noopener noreferrer">SoundCloud profile <ExternalLink size={13} /></a> : null}
                        <Link href="/user/members">Explore artists <ArrowUpRight size={13} /></Link>
                        <button type="button" onClick={() => setOpenArtistMenuId(null)}>Close <X size={13} /></button>
                      </div> : null}
                    </div>
                    {artistUrn ? <button type="button" className={styles.star} aria-label={`${starredUrns[artistUrn] ? 'Unstar' : 'Star'} ${artistName}`} aria-pressed={!!starredUrns[artistUrn]} onClick={() => handleToggleStar(artistUrn)}><Star size={17} fill={starredUrns[artistUrn] ? 'currentColor' : 'none'} /></button> : null}
                  </div>
                  <div className={styles.repostAction}>
                    <span className={styles.listenNote}>{isReposted ? 'Thanks for supporting this artist' : isEligible ? 'Ready to support this sound' : playSec ? `${Math.ceil(15 - playSec)}s more to unlock` : 'Listen for 15s to unlock'}</span>
                    <button type="button" className={styles.repostButton} disabled={!isEligible || isReposted || isPending} data-complete={isReposted} onClick={() => repostMutation.mutate(campaignId)}>
                      {isReposted ? <CheckCircle2 size={17} /> : <Repeat2 size={17} />}
                      {isReposted ? 'Reposted' : isPending ? 'Reposting…' : `Repost +${userRepostPrice}`}
                    </button>
                  </div>
                </div>
              </article>;
            }) : <div className={styles.empty}><Music size={36} /><h2>A fresh sound is on its way.</h2><p>No campaigns match this selection. Explore another genre or try all campaigns.</p><button type="button" className="sc-pill-orange" onClick={() => { resetFilters(); setActiveMainTab('all'); }}>Explore all campaigns <ArrowUpRight size={16} /></button></div>}
          </div>
          {pagination.totalPages > 1 ? <nav className={styles.pagination} aria-label="Campaign pagination">
            <span>Page {page} of {pagination.totalPages}</span>
            <div><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={18} /></button><button type="button" aria-label="Next page" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={18} /></button></div>
          </nav> : null}
        </section>

        <aside className={styles.sidebar} aria-label="Your exchange overview">
          <section className={styles.wallet}>
            <div className={styles.walletLabel}><Coins size={18} /><span>YOUR NEXT MOVE</span></div>
            <p className={styles.creditValue}>{dashData ? availableCredits.toLocaleString() : '—'}</p>
            <p className={styles.creditLabel}>credits to grow your sound</p>
            <button type="button" onClick={() => setShowCreateModal(true)}>Put them to work <ArrowUpRight size={18} /></button>
            <div className={styles.walletStats}><span>Active campaigns</span><strong>{dashData?.kpis?.activeCampaigns ?? '—'}</strong></div>
            <div className={styles.walletStats}><span>Reposted this session</span><strong>{Object.values(repostedIds).filter(Boolean).length}</strong></div>
          </section>
          <section className={styles.guide}>
            <p className={styles.eyebrow}>GOOD MUSIC GOES BOTH WAYS.</p>
            <h2 className="sc-display">GIVE A REPOST.<br />GET HEARD.</h2>
            <div><Headphones size={19} /><p><strong>Find your sound</strong><span>Explore tracks and listen for at least 15 seconds.</span></p></div>
            <div><Repeat2 size={19} /><p><strong>Back another artist</strong><span>Repost a track you connect with to earn credits.</span></p></div>
            <div><ArrowUpRight size={19} /><p><strong>Build your momentum</strong><span>Use your credits to launch your own campaign.</span></p></div>
          </section>
          <p className={styles.sidebarNote}>INDEPENDENT SOUNDS. SHARED AMBITION.</p>
        </aside>
      </div>
      {showCreateModal ? <CreateCampaignModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} tracks={recentTracks} availableCredits={availableCredits} onSuccess={() => {
        setShowCreateModal(false);
        queryClient.invalidateQueries({ queryKey: ['campaigns-feed'] });
        queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      }} /> : null}
    </div>
  );
}
