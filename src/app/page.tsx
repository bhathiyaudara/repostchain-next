import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader, PublicFooter, SoundCloudMark } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'RepostChain — Grow Your Music Reach | SoundCloud Repost Exchange',
  description:
    'Join 5,000+ verified SoundCloud artists on RepostChain. Expand your organic audience through collaborative repost exchanges, authentic listener feedback, and detailed SoundCloud analytics. 100% free to use.',
  alternates: {
    canonical: '/',
  },
};

const ARTIST_SPOTLIGHTS = [
  {
    name: 'Kai Rivers',
    genre: 'Hip Hop / Trap',
    stat: '+12.4K Streams',
    quote:
      'RepostChain gave my track the initial organic push it needed to hit SoundCloud’s curated algorithm.',
    image: '/frontend/user/image/pexels-photo-1040881.jpeg',
    followers: '18.2K',
  },
  {
    name: 'Riley Monroe',
    genre: 'Indie Pop & Songwriter',
    stat: '+8.6K Followers',
    quote:
      'The feedback from fellow producers is genuinely constructive. It feels like an actual music family.',
    image: '/frontend/user/image/pexels-photo-1540338.jpeg',
    followers: '24.1K',
  },
  {
    name: 'The Velvet Echoes',
    genre: 'Electronic / Synthwave',
    stat: '+35K Plays',
    quote:
      'Our monthly plays tripled within two months. Everything comes from verified active creator accounts.',
    image: '/frontend/user/image/pexels-photo-1763075.jpeg',
    followers: '31.5K',
  },
  {
    name: 'Midnight Skyline',
    genre: 'R&B / Neo-Soul',
    stat: '+4.8K Reposts',
    quote:
      'No sketchy bots, no fake spam accounts. Just real musicians lifting each other’s music.',
    image: '/frontend/user/image/pexels-photo-2379004.jpeg',
    followers: '14.9K',
  },
];

const FAQS = [
  {
    question: 'How does the RepostChain credit exchange work?',
    answer:
      'RepostChain operates on a fair peer-to-peer credit system. When you listen, review, and repost tracks by fellow independent artists, you earn credits. You then spend those credits to launch promotion campaigns for your own songs, which are reposted by other active artists in your genre.',
  },
  {
    question: 'Are the reposts, plays, and followers 100% real?',
    answer:
      'Yes, 100%. Every single account on RepostChain connects directly via official SoundCloud OAuth. We actively monitor engagement quality and permanently ban bot accounts or inactive profiles. Your tracks are heard and shared by real, passionate music creators and their genuine follower bases.',
  },
  {
    question: 'Do I need a paid SoundCloud Pro subscription to use RepostChain?',
    answer:
      'No! RepostChain is 100% free for any SoundCloud creator. You can join, earn unlimited credits, and launch campaigns without spending a single dollar. If you also use SoundCloud Pro, you can take advantage of our partner benefits including bonus credits and priority campaign placement.',
  },
  {
    question: 'How do I launch my first repost campaign?',
    answer:
      'After linking your SoundCloud profile with one click, choose any public track from your SoundCloud catalogue, set your target genres, and select how many credits you want to allocate. Your campaign immediately enters the artist discovery queue for other musicians to review and repost.',
  },
  {
    question: 'Is RepostChain safe for my SoundCloud account?',
    answer:
      'Completely safe. We interact strictly through the official SoundCloud API and never ask for or store your SoundCloud password. All reposts and likes are performed by genuine logged-in artists adhering to SoundCloud’s terms of service.',
  },
  {
    question: 'What is the difference between Free Artist and Artist Pro?',
    answer:
      'The Free Artist plan gives you complete access to listen, earn credits, and launch repost campaigns forever. The Artist Pro tier (partnered with SoundCloud Pro) unlocks unlimited track uploads on SoundCloud, a 2X credit multiplier on every repost you make, priority campaign positioning, and deep demographic analytics.',
  },
];

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://growmusicians.com/#organization',
      name: 'RepostChain',
      legalName: 'Tunexa Limited',
      url: 'https://growmusicians.com',
      logo: 'https://growmusicians.com/assets/logo/rc-logo-white.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@repostchain.com',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://growmusicians.com/#website',
      url: 'https://growmusicians.com',
      name: 'RepostChain',
      description: 'The premier collaborative music promotion network for SoundCloud artists.',
      publisher: {
        '@id': 'https://growmusicians.com/#organization',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'RepostChain',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      url: 'https://growmusicians.com',
      description:
        'Collaborative SoundCloud music promotion platform connecting 5,000+ independent artists for organic repost exchanges, real listener feedback, and analytics.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '2150',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5500] selection:text-white overflow-x-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* Global Header */}
      <PublicHeader />

      <main>
        {/* ========================================================= */}
        {/* HERO SECTION — 2026 SoundCloud for Artists Display Canvas */}
        {/* ========================================================= */}
        <section
          id="home"
          className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-28 overflow-hidden bg-[#0A0A0A]"
        >
          {/* Subtle Ambient Radial Glows */}
          <div
            className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 -right-32 w-[460px] h-[460px] bg-[#FF5500]/[0.06] rounded-full blur-[150px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Massive Grotesque Typography & CTAs */}
              <div className="lg:col-span-7 text-left">
                {/* Official Tagline Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-6 backdrop-blur-sm">
                  <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                    BUILT FOR SOUNDCLOUD CREATORS
                  </span>
                </div>

                {/* Ultra-bold All-Caps Display Headline */}
                <h1 className="sc-display text-4xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-black tracking-tight leading-[0.93] mb-6">
                  <span className="block text-white">YOUR SOUND.</span>
                  <span className="block text-[#FF5500]">YOUR CHAIN.</span>
                  <span className="block text-white">YOUR MOMENT.</span>
                </h1>

                {/* Punchy Subheadline */}
                <p className="text-zinc-400 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mb-9">
                  The collaborative music promotion platform for independent artists. Exchange real
                  reposts, collect verified listener feedback, and expand your SoundCloud reach
                  organically.
                </p>

                {/* High-Contrast Pill Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                  <a
                    href="/api/auth/soundcloud/redirect"
                    className="sc-pill-white px-7 sm:px-8 py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-white/5"
                  >
                    <SoundCloudMark className="w-5 h-3.5" />
                    <span>Connect SoundCloud</span>
                  </a>

                  <a
                    href="#how-it-works"
                    className="sc-pill-dark px-7 sm:px-8 py-3.5 text-sm sm:text-base font-semibold"
                  >
                    <span>How It Works</span>
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {/* Reassurance Checklist */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-zinc-500 text-xs sm:text-[13px] font-medium mt-8 pt-6 border-t border-white/[0.08]">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-[#FF5500]">✓</span> 100% Free for Artists
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-[#FF5500]">✓</span> Zero Bot Tolerance
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-[#FF5500]">✓</span> Official SoundCloud API
                  </span>
                </div>
              </div>

              {/* Right Column: Sleek Modern Artist Showcase Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  {/* Outer Framed Glow Canvas */}
                  <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-[1px] shadow-2xl">
                    <div className="rounded-[23px] bg-[#121212] overflow-hidden p-5 sm:p-6">
                      {/* Top Bar with SoundCloud Audio Indicator */}
                      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                            Now In Repost Loop
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
                          LIVE
                        </span>
                      </div>

                      {/* Featured Artist Artwork */}
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 mb-5">
                        <img
                          src="/frontend/user/image/FeaturedArtist.png"
                          alt="SoundCloud artist featured on RepostChain"
                          width={600}
                          height={450}
                          fetchPriority="high"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5500] bg-black/60 px-2 py-0.5 rounded">
                              ELECTRONIC / FUTURE BASS
                            </span>
                            <h2 className="text-white font-bold text-lg leading-tight mt-1">
                              Midnight Odyssey
                            </h2>
                          </div>
                          <span className="text-xs font-mono text-zinc-300 bg-black/70 px-2 py-1 rounded">
                            03:42
                          </span>
                        </div>
                      </div>

                      {/* SoundCloud Signature Simulated Waveform */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                          <span>01:14</span>
                          <span className="text-[#FF5500] font-semibold">1,480 Reposts</span>
                          <span>03:42</span>
                        </div>
                        <div className="h-9 flex items-end gap-[3px] py-1">
                          {[
                            25, 40, 65, 85, 45, 30, 70, 95, 60, 40, 80, 100, 75, 50, 88, 92, 60, 45,
                            70, 85, 100, 80, 55, 35, 65, 90, 75, 45, 60, 80, 95, 70, 40, 60, 85, 65,
                            45, 30, 50, 70, 85, 60, 40, 25,
                          ].map((height, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-full transition-all duration-300"
                              style={{
                                height: `${height}%`,
                                backgroundColor: i < 18 ? '#FF5500' : 'rgba(255, 255, 255, 0.2)',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Live Network Feedback Notification */}
                      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src="/frontend/images/testimonial/singh.png"
                            alt="Artist"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover border border-[#FF5500]"
                          />
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">
                              Kai Rivers reposted track
                            </p>
                            <p className="text-[11px] text-zinc-400">Reached 18,200 followers</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-[#FF5500] font-bold">+120 Plays</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* GIANT MINIMALIST METRICS STRIP (Directly from Screenshot 2) */}
        {/* ========================================================= */}
        <section
          aria-label="Platform Statistics"
          className="border-y border-white/10 bg-[#0E0E0E] py-12 sm:py-16"
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {[
                {
                  value: '10K+',
                  label: 'TRACKS REPOSTED',
                  desc: 'Amplified across creator streams',
                },
                {
                  value: '5K+',
                  label: 'VERIFIED ARTISTS',
                  desc: 'Active independent musicians',
                },
                {
                  value: '2M+',
                  label: 'AUDIENCE REACHED',
                  desc: 'Real listener impressions touched',
                },
                {
                  value: '100%',
                  label: 'ORGANIC REACH',
                  desc: 'Zero bot policy strictly enforced',
                },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col justify-center ${
                    idx !== 0 ? 'lg:border-l lg:border-white/10 lg:pl-10 xl:pl-12' : ''
                  }`}
                >
                  <span className="sc-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#FF5500] tracking-tight leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-white mt-2">
                    {stat.label}
                  </span>
                  <span className="text-zinc-500 text-xs sm:text-[13px] mt-1 hidden sm:block">
                    {stat.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ARTIST SPOTLIGHT (TALL EDITORIAL PORTRAIT CARDS) */}
        {/* ========================================================= */}
        <section id="community" className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            {/* Header: Two-tone grotesque uppercase */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 sm:mb-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                  COMMUNITY IN ACTION
                </span>
                <h2 className="sc-display text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                  ARTIST <span className="text-[#FF5500]">SPOTLIGHT</span>
                </h2>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md">
                Meet the independent creators accelerating their audience reach through authentic
                peer promotion on RepostChain.
              </p>
            </div>

            {/* 4 Tall Portrait Cards (aspect-[3/4]) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ARTIST_SPOTLIGHTS.map((artist) => (
                <div
                  key={artist.name}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-900 border border-white/10 hover:border-[#FF5500]/60 transition-all duration-300 shadow-lg flex flex-col justify-end p-5"
                >
                  {/* Photo with subtle hover zoom */}
                  <img
                    src={artist.image}
                    alt={artist.name}
                    width={480}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Editorial Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {artist.genre}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#FF5500] bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {artist.stat}
                    </span>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="relative z-10">
                    <p className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed mb-3 line-clamp-3 italic opacity-95">
                      &ldquo;{artist.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/15">
                      <div>
                        <h3 className="text-white font-bold text-base tracking-tight leading-tight">
                          {artist.name}
                        </h3>
                        <p className="text-[11px] text-zinc-400">
                          {artist.followers} SoundCloud followers
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:bg-[#FF5500] group-hover:text-white transition-colors">
                        <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FULL-BLEED ELECTRIC ORANGE EDITORIAL (Screenshot 2 Signature) */}
        {/* ========================================================= */}
        <section
          aria-label="Editorial Manifesto"
          className="bg-[#FF5500] text-black py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto text-center relative z-10">
            <span className="inline-block text-xs font-black uppercase tracking-[0.2em] bg-black text-[#FF5500] px-3.5 py-1 rounded-full mb-6">
              THE REPOSTCHAIN ADVANTAGE
            </span>

            <h2 className="sc-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.96] tracking-tight text-black max-w-5xl mx-auto">
              REAL DISCOVERY ON SOUNDCLOUD HAPPENS BETWEEN REAL ARTISTS — IN REPOSTS, FEEDBACK, AND DMs.
            </h2>

            <p className="mt-6 text-black/85 font-medium text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
              No shady bot algorithms. No fake vanity numbers. Just independent creators empowering
              each other through genuine music exchanges and community engagement.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/api/auth/soundcloud/redirect"
                className="inline-flex items-center gap-2.5 bg-black text-white hover:bg-white hover:text-black font-bold px-8 py-4 rounded-full text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-xl"
              >
                <span>Start Growing Free</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS (4 TALL MINIMALIST EDITORIAL COLUMNS) */}
        {/* ========================================================= */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 sm:mb-18">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                  THE SYSTEM
                </span>
                <h2 className="sc-display text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                  HOW REPOSTCHAIN <span className="text-[#FF5500]">WORKS</span>
                </h2>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md">
                Four simple steps to turn community peer engagement into continuous organic reach.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  action: 'CONNECT',
                  title: 'Link SoundCloud',
                  desc: 'Authenticate securely via official SoundCloud OAuth. Your tracks, stats, and profile sync automatically in seconds.',
                },
                {
                  step: '02',
                  action: 'LISTEN',
                  title: 'Earn Credits',
                  desc: 'Discover rising tracks from other creators in your niche. Listen, review, and repost to build your promotion credit balance.',
                },
                {
                  step: '03',
                  action: 'LAUNCH',
                  title: 'Start Campaign',
                  desc: 'Pick your latest single, specify your target genres, and allocate credits. Your song enters fellow artists’ discovery streams.',
                },
                {
                  step: '04',
                  action: 'GROW',
                  title: 'Gain Real Fans',
                  desc: 'Real listeners discover your sound on their personal SoundCloud feed. Experience organic plays, saves, and long-term followers.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl bg-[#121212] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-[#FF5500]/60 transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
                      <span className="sc-display text-3xl font-black text-zinc-600 group-hover:text-[#FF5500] transition-colors">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded">
                        {item.action}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center text-xs font-semibold text-[#FF5500] gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Explore Step {item.step}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PRICING & SOUNDCLOUD PRO PARTNER SPOTLIGHT (Side-by-side) */}
        {/* ========================================================= */}
        <section id="plan" className="py-20 sm:py-28 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                TRANSPARENT VALUE
              </span>
              <h2 className="sc-display text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
                CHOOSE YOUR <span className="text-[#FF5500]">PLAN</span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                Start 100% free through community exchange or power up with our official SoundCloud
                Pro partner tier.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
              {/* Plan 1: Free Artist */}
              <div className="rounded-3xl bg-[#121212] border border-white/10 p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                      COMMUNITY
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 bg-white/[0.06] px-3 py-1 rounded-full">
                      Free Forever
                    </span>
                  </div>

                  <h3 className="sc-display text-3xl font-black text-white mb-2">ARTIST</h3>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Essential community promotion tools for emerging creators building their
                    foundation.
                  </p>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                    <span className="sc-display text-5xl font-black text-white">$0</span>
                    <span className="text-zinc-500 text-sm font-semibold">/ month</span>
                  </div>

                  <ul className="space-y-3.5 text-sm text-zinc-300 mb-8">
                    {[
                      'Unlimited credit earning through peer listens',
                      'Launch active repost campaigns',
                      'Receive authentic feedback from verified creators',
                      'Standard campaign queue placement',
                      'Access to all public music genre categories',
                      '100% genuine creator accounts — 0 bots',
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="text-zinc-400 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="/api/auth/soundcloud/redirect"
                  className="sc-pill-white w-full py-3.5 text-center text-sm font-bold justify-center"
                >
                  Start Free Forever
                </a>
              </div>

              {/* Plan 2: Artist Pro (SoundCloud Partner Spotlight) */}
              <div className="rounded-3xl bg-[#161616] border-2 border-[#FF5500] p-8 sm:p-10 flex flex-col justify-between relative shadow-2xl shadow-[#FF5500]/10">
                {/* Official Partner Ribbon */}
                <div className="absolute -top-3.5 right-6 bg-[#FF5500] text-white text-[11px] font-black uppercase tracking-[0.14em] px-3.5 py-1 rounded-full shadow-md">
                  OFFICIAL PARTNER
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-[#FF5500]">
                      SOUNDCLOUD PRO
                    </span>
                  </div>

                  <h3 className="sc-display text-3xl font-black text-white mb-2">ARTIST PRO</h3>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Complete promotional power for creators wanting unlimited SoundCloud uploads and
                    2X growth speed.
                  </p>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                    <span className="sc-display text-5xl font-black text-[#FF5500]">$8.25</span>
                    <span className="text-zinc-500 text-sm font-semibold">/ month</span>
                  </div>

                  <ul className="space-y-3.5 text-sm text-white mb-8">
                    {[
                      'Unlimited track uploads on SoundCloud',
                      '2X Credit multiplier on all repost activity',
                      'Priority placement at top of campaign discovery queues',
                      'Distribute and monetize tracks across all platforms',
                      'Pin spotlight tracks to top of artist profile',
                      'Deep listener demographics and audience analytics',
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="text-[#FF5500] font-bold shrink-0 mt-0.5">✓</span>
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a
                    href="https://invite.soundcloud.com/pjoy4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sc-pill-orange w-full py-3.5 text-center text-sm font-bold justify-center"
                  >
                    <span>Upgrade with SoundCloud Pro</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                  <p className="text-[11px] text-zinc-500 text-center mt-3">
                    Special promotional discount for RepostChain creators
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MINIMALIST LINE-ACCORDION FAQ (Clean Full-Width Questions) */}
        {/* ========================================================= */}
        <section id="faq" className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14 sm:mb-18">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                HAVE QUESTIONS?
              </span>
              <h2 className="sc-display text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                FREQUENTLY ASKED <span className="text-[#FF5500]">QUESTIONS</span>
              </h2>
            </div>

            {/* Native Clean Accordion with Hairline Dividers */}
            <div className="border-t border-white/10 divide-y divide-white/10">
              {FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group py-6 transition-all duration-200 cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-white group-hover:text-[#FF5500] transition-colors">
                    <span className="tracking-tight">{faq.question}</span>
                    <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-open:rotate-45 transition-transform duration-200 text-zinc-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center text-sm text-zinc-400">
              Still have questions?{' '}
              <Link href="/help" className="text-[#FF5500] font-semibold hover:underline">
                Visit our Help Center
              </Link>{' '}
              or email{' '}
              <a href="mailto:support@repostchain.com" className="text-white hover:underline">
                support@repostchain.com
              </a>
              .
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM FINALE BANNER (GET YOUR MUSIC OUT THERE.) */}
        {/* ========================================================= */}
        <section
          aria-label="Get Started"
          className="py-24 sm:py-32 bg-[#0A0A0A] px-4 sm:px-6 relative text-center overflow-hidden"
        >
          {/* Subtle Orange Glow in Center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5500] block mb-4">
              READY TO BE HEARD?
            </span>

            <h2 className="sc-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-6">
              GET YOUR MUSIC <span className="text-[#FF5500]">OUT THERE.</span>
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join over 5,000 independent musicians exchanging reposts, feedback, and real listeners
              on RepostChain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/api/auth/soundcloud/redirect"
                className="sc-pill-white px-9 py-4 text-base font-bold shadow-2xl shadow-white/10"
              >
                <SoundCloudMark className="w-5 h-3.5" />
                <span>Connect SoundCloud</span>
              </a>
              <Link
                href="/features"
                className="sc-pill-dark px-8 py-4 text-base font-semibold"
              >
                <span>Explore All Features</span>
              </Link>
            </div>

            <p className="text-xs text-zinc-500 font-medium mt-8">
              Free forever • No credit card required • 30-second setup
            </p>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <PublicFooter />
    </div>
  );
}
