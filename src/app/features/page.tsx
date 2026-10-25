import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader, PublicFooter, SoundCloudMark } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Platform Features — RepostChain | Organic SoundCloud Music Promotion',
  description:
    'Explore RepostChain features: direct artist-to-artist SoundCloud reposts, smart genre matching, reputation scoring, real-time analytics, and fair credit exchange.',
  alternates: {
    canonical: '/features',
  },
};

const FEATURES = [
  {
    category: 'AUTHENTICITY',
    title: 'Grow Organically with Real Artists',
    desc: 'RepostChain connects independent musicians and producers to exchange reposts within a verified artist network. Every repost comes from real, active creators who genuinely support music — zero bots, zero fake engagement.',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  },
  {
    category: 'PEER EXCHANGE',
    title: 'Direct Artist-to-Artist Reposts',
    desc: 'Send and receive reposts directly from other musicians in your exact genre. Build lasting industry connections, expand your listener base, and increase your track visibility through community collaboration.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    category: 'DISCOVERY',
    title: 'Smart Genre Matching System',
    desc: 'Our intelligent matching algorithm pairs you with creators of matching genres, audience sizes, and engagement levels, guaranteeing that every repost reaches a hyper-targeted, receptive audience.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    category: 'OUTREACH',
    title: 'Direct Curator Requests',
    desc: 'Reach out directly to artists, curators, and labels you admire. Pitch your latest track for reposts, constructive feedback, or collaborative releases — all seamlessly managed inside the platform.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    category: 'TRUST & SAFETY',
    title: 'Reputation & Trust Score',
    desc: 'Earn community trust and priority queue visibility through our automated Reputation Score. Artists who consistently review tracks, repost on time, and provide quality feedback rank highest.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  },
  {
    category: 'ANALYTICS',
    title: 'Real-Time Track Analytics',
    desc: 'Monitor every single repost, view, and engagement metric in your personal artist dashboard. See exactly which genres and creator campaigns generate the highest listener conversion in real-time.',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
  {
    category: 'EXCHANGE',
    title: 'Fair Credit Economy',
    desc: 'Use Repost Credits to launch campaigns and schedule reposts. Earn credits organically by supporting fellow musicians, or upgrade to Pro Artist to enjoy a continuous 2X credit multiplier.',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    category: 'SECURITY',
    title: 'Official SoundCloud OAuth',
    desc: 'All profile connections and exchanges operate safely through the official SoundCloud API. Your account credentials and passwords are never requested or stored. 100% compliant and secure.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    category: 'GLOBAL NETWORK',
    title: 'Worldwide Creator Community',
    desc: "Join a fast-growing international network of independent producers, songwriters, and record labels across 150+ countries collaborating to accelerate each other's SoundCloud presence.",
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const FEATURE_FAQS = [
  {
    question: 'How do direct artist reposts work on RepostChain?',
    answer:
      'When you submit a track for promotion, fellow artists in your matched genre listen, review, and repost your track directly to their SoundCloud profile feed. Your track immediately appears in their followers’ stream, generating organic plays, likes, and followers.',
  },
  {
    question: 'Is RepostChain safe for my SoundCloud profile?',
    answer:
      'Yes, 100%. RepostChain connects via official SoundCloud OAuth. We never ask for or store your login password. Every action is performed by real, logged-in creators adhering to SoundCloud’s terms of service.',
  },
  {
    question: 'What is the Reputation Score?',
    answer:
      'The Reputation Score is an automated metric that tracks how reliably an artist reviews tracks, fulfills repost requests, and supports peers. High-reputation creators receive top-priority placement in campaign queues.',
  },
  {
    question: 'Can I choose which genres my music is shared with?',
    answer:
      'Yes! When launching a campaign, you specify your track’s exact genres (e.g., Hip-Hop, Electronic, Indie, R&B). Our smart matching system ensures only creators in those genres receive your repost requests.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5500] selection:text-white overflow-x-hidden font-sans">
      {/* Header */}
      <PublicHeader />

      <main>
        {/* ========================================================= */}
        {/* HERO SECTION — Modern SoundCloud Editorial Heading        */}
        {/* ========================================================= */}
        <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-[#0A0A0A]">
          {/* Subtle Ambient Radial Glows */}
          <div
            className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 -right-32 w-[460px] h-[460px] bg-[#FF5500]/[0.06] rounded-full blur-[150px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-6 backdrop-blur-sm">
              <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                BUILT FOR SOUNDCLOUD CREATORS
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="sc-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.93] mb-5">
              PLATFORM <span className="text-[#FF5500]">FEATURES</span>
            </h1>

            {/* Subheadline */}
            <p className="text-zinc-400 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-10">
              Everything you need to grow your music career through authentic artist collaboration,
              smart genre matching, and organic promotion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <a
                href="/api/auth/soundcloud/redirect"
                className="sc-pill-white px-8 py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-white/5"
              >
                <SoundCloudMark className="w-5 h-3.5" />
                <span>Connect with SoundCloud</span>
              </a>
              <Link href="/plan" className="sc-pill-dark px-7 py-3.5 text-sm sm:text-base font-semibold">
                <span>View Plans &amp; Pricing</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* METRICS STRIP — Minimalist Divider Layout                  */}
        {/* ========================================================= */}
        <section
          aria-label="Platform Statistics"
          className="border-y border-white/10 bg-[#0E0E0E] py-12 sm:py-16"
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {[
                {
                  value: '5,000+',
                  label: 'VERIFIED ARTISTS',
                  desc: 'Active independent musicians & producers',
                },
                {
                  value: '10,000+',
                  label: 'REPOSTS EXCHANGED',
                  desc: 'Direct peer campaign shares completed',
                },
                {
                  value: '150+',
                  label: 'COUNTRIES REACHED',
                  desc: 'Global listener impressions across genres',
                },
                {
                  value: '100%',
                  label: 'ORGANIC STREAMING',
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
        {/* 9 CORE FEATURES GRID (Modern Editorial Cards)             */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 sm:mb-18">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                  FULL PLATFORM SUITE
                </span>
                <h2 className="sc-display text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                  POWERFUL TOOLS FOR <span className="text-[#FF5500]">CREATORS</span>
                </h2>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md">
                Engineered from the ground up to give independent SoundCloud artists the leverage of a
                major label promotion network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-[#121212] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-[#FF5500]/60 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] group-hover:bg-[#FF5500] group-hover:text-white transition-colors duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 bg-white/[0.04] px-2.5 py-1 rounded">
                        {f.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FULL-BLEED ELECTRIC ORANGE EDITORIAL CALLOUT               */}
        {/* ========================================================= */}
        <section
          aria-label="Editorial Statement"
          className="bg-[#FF5500] text-black py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto text-center relative z-10">
            <span className="inline-block text-xs font-black uppercase tracking-[0.2em] bg-black text-[#FF5500] px-3.5 py-1 rounded-full mb-6">
              THE REPOSTCHAIN GUARANTEE
            </span>

            <h2 className="sc-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.96] tracking-tight text-black max-w-5xl mx-auto">
              NO BOTS. NO FAKE ALGORITHMS. JUST REAL ARTISTS PROMOTING REAL MUSIC.
            </h2>

            <p className="mt-6 text-black/85 font-medium text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Every repost on RepostChain lands on verified SoundCloud stream feeds, giving your tracks
              authentic listener exposure and real community feedback.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/api/auth/soundcloud/redirect"
                className="inline-flex items-center gap-2.5 bg-black text-white hover:bg-white hover:text-black font-bold px-8 py-4 rounded-full text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-xl"
              >
                <span>Start Growing Free</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHY CHOOSE REPOSTCHAIN? (4 Trust Pillars)                  */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                CREATOR PEACE OF MIND
              </span>
              <h2 className="sc-display text-3xl sm:text-5xl font-black text-white mb-4">
                WHY CHOOSE <span className="text-[#FF5500]">REPOSTCHAIN?</span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                The trusted platform for independent artists who demand real, measurable results without
                putting their SoundCloud profile at risk.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: 'Real, Organic Engagement Only',
                  desc: 'Every repost, like, and comment is executed by real, logged-in music creators who actively listen to your sound.',
                },
                {
                  title: 'Zero Bot & Automation Tolerance',
                  desc: 'Our automated systems permanently ban bot networks and spam farms. Your music only touches genuine human listeners.',
                },
                {
                  title: 'Transparent Credit System',
                  desc: 'Every credit transaction is clear. Earn credits by supporting peers, or spend them to schedule targeted reposts.',
                },
                {
                  title: 'Official SoundCloud OAuth API',
                  desc: 'We never ask for or store your SoundCloud passwords. All integrations follow SoundCloud’s strict API guidelines.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-[#121212] border border-white/10 p-7 sm:p-8 hover:border-white/20 transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center shrink-0 text-[#FF5500] mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1.5">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MINIMALIST LINE-ACCORDION FAQ                              */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14 sm:mb-18">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                COMMON INQUIRIES
              </span>
              <h2 className="sc-display text-3xl sm:text-5xl font-black text-white">
                FEATURES <span className="text-[#FF5500]">FAQ</span>
              </h2>
            </div>

            <div className="border-t border-white/10 divide-y divide-white/10">
              {FEATURE_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group py-6 transition-all duration-200 cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-white group-hover:text-[#FF5500] transition-colors">
                    <span className="tracking-tight">{faq.question}</span>
                    <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-open:rotate-45 transition-transform duration-200 text-zinc-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM FINALE BANNER                                       */}
        {/* ========================================================= */}
        <section
          aria-label="Get Started"
          className="py-24 sm:py-32 bg-[#0A0A0A] px-4 sm:px-6 relative text-center overflow-hidden"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5500] block mb-4">
              READY TO BE HEARD?
            </span>

            <h2 className="sc-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-6">
              GET YOUR TRACKS <span className="text-[#FF5500]">OUT THERE.</span>
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
                <span>Connect with SoundCloud</span>
              </a>
              <Link href="/plan" className="sc-pill-dark px-8 py-4 text-base font-semibold">
                <span>Compare Plans</span>
              </Link>
            </div>

            <p className="text-xs text-zinc-500 font-medium mt-8">
              Free forever • No credit card required • Instant setup
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
