import type { Metadata } from 'next';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Platform Features — Organic SoundCloud Music Promotion',
  description:
    'Explore RepostChain features: direct artist-to-artist SoundCloud reposts, smart genre matching, reputation score, real-time analytics, and fair credit exchange.',
  alternates: {
    canonical: '/features',
  },
};

const FEATURES = [
  {
    title: 'Grow Organically with Real Artists',
    desc: 'RepostChain connects independent musicians and producers to exchange reposts within a verified artist network. Every repost comes from real, active users who genuinely support music promotion — no bots, no fake engagement.',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  },
  {
    title: 'Direct Artist-to-Artist Reposts',
    desc: 'Send and receive reposts directly from other artists in your genre. Build lasting connections, grow your fan base, and increase your visibility naturally through community-driven collaboration.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    title: 'Smart Matching System',
    desc: 'Our intelligent matching system helps you find artists with similar genres, follower counts, and engagement levels, ensuring your repost exchanges bring real results and relevant audiences.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Direct Requests',
    desc: 'Reach out directly to artists you admire or collaborate with using our Direct Request feature. Pitch your track for reposts, collaborations, or feedback — all from within the platform.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    title: 'Reputation & Trust System',
    desc: 'Earn trust and visibility through our Reputation Score. Artists with consistent engagement, successful reposts, and positive feedback rank higher — helping you stand out in the community.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  },
  {
    title: 'Track Your Growth',
    desc: 'Monitor every repost, view, and engagement metric in your personal dashboard. See exactly how your promotion efforts are performing in real-time.',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
  {
    title: 'Fair Credit System',
    desc: 'Use Repost Credits to request reposts from other artists. Earn credits by reposting others or purchase extra credits when you want faster results. Every credit transaction is transparent and secure.',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    title: '100% Secure Platform',
    desc: 'All exchanges are managed safely through RepostChain. We value artist privacy, protect your data, and ensure fair play across the platform — powered by Tunexa Limited.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Worldwide Artist Community',
    desc: "Join a fast-growing global network of artists, producers, and labels who collaborate to support each other's music careers. Whether you're a beginner or a pro, RepostChain helps you reach your next milestone.",
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff5500]/10 to-[#ff8833]/10 border border-[#ff5500]/20 mb-6">
            <svg className="w-4 h-4 text-[#ff5500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span className="text-sm font-medium text-[#ff5500]">Platform Features</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">RepostChain Features</h1>
          <p className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto">
            Everything you need to grow your music career through authentic artist collaboration and
            organic promotion
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all duration-300 sm:hover:scale-[1.03]"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#ff8833] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">
                {f.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="rounded-3xl bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-500/10 border border-orange-500/20 p-6 sm:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Why Choose RepostChain?</h2>
            <p className="text-base sm:text-xl text-zinc-300 mb-8">
              The trusted platform for independent artists who want real results
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                'Real, organic engagement only',
                'No bots or automation',
                'Transparent and fair system',
                'Designed for independent artists',
              ].map((reason) => (
                <div
                  key={reason}
                  className="flex items-center gap-3 p-4 rounded-xl bg-black/30 border border-orange-500/20"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5500] to-[#ff8833] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium text-left text-sm sm:text-base">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {[
            { value: '5,000+', label: 'Active Artists' },
            { value: '10,000+', label: 'Reposts Exchanged' },
            { value: '150+', label: 'Countries Worldwide' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border border-zinc-800/50 p-8 text-center"
            >
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl bg-gradient-to-r from-[#ff5500] to-[#ff8833] p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready to grow your music career?
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of artists who are already using RepostChain to expand their reach and
            build their fanbase organically
          </p>
          <a
            href="/api/auth/soundcloud/redirect"
            className="px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-zinc-900 transition-all duration-300 hover:scale-105 inline-block"
          >
            Get Started Today
          </a>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
