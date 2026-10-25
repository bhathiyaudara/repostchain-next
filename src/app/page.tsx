import type { Metadata } from 'next';
import { PublicHeader, PublicFooter, SoundCloudMark } from '@/components/public-layout';
import { PartnerSpotlightCard } from '@/components/partner-spotlight-card';

export const metadata: Metadata = {
  title: 'RepostChain — Grow Your Music Reach | Build Fans & Share Feedback',
  description:
    'Join 5,000+ SoundCloud artists on RepostChain. Grow your audience organically through collaborative repost exchanges, real listener feedback, and detailed SoundCloud analytics. 100% free to use.',
  alternates: {
    canonical: '/',
  },
};

const TESTIMONIALS = [
  {
    quote:
      "RepostChain's fair exchange system is brilliant. I've built real relationships with other artists and my fanbase has grown organically.",
    name: 'Riley Monroe',
    role: 'Song Writer',
    image: '/frontend/images/testimonial/smith.png',
  },
  {
    quote:
      'Best decision I made for my music career. The analytics help me understand my audience, and the community is incredibly supportive.',
    name: 'Kai Rivers',
    role: 'Hip Hop Artist',
    image: '/frontend/images/testimonial/singh.png',
  },
  {
    quote:
      'RepostChain helped me gain over 2,500 genuine followers in just 3 months. The engagement is real, and my plays have increased dramatically.',
    name: 'The Velvet Echoes',
    role: 'Band',
    image: '/frontend/images/testimonial/mic_check.png',
  },
  {
    quote:
      'I was struggling to break through until I found RepostChain. Now my tracks are being discovered by the right audience. Incredible platform!',
    name: 'Midnight Skyline',
    role: 'Record Label',
    image: '/frontend/images/testimonial/greenn.png',
  },
  {
    quote:
      "RepostChain's fair exchange system is brilliant. I've built real relationships with other artists and my fanbase has grown organically.",
    name: 'Riley Monroe',
    role: 'Song Writer',
    image: '/frontend/images/testimonial/chen.png',
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
      description: 'The collaborative music promotion platform for SoundCloud artists.',
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
        reviewCount: '2000',
        bestRating: '5',
        worstRating: '1',
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* Header - SoundCloud Media Kit Dark Navigation */}
      <PublicHeader />

      <main className="bg-[#121212]">
        {/* Hero Section */}
        <section
          id="home"
          className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 md:pt-36 md:pb-28 border-b border-[#272727] overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#1E1E1E] border border-[#272727] mb-6">
                  <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FAFAFA]">
                    For SoundCloud Creators &amp; Artists
                  </span>
                </div>

                <h1 className="sc-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold mb-6 leading-[1.1]">
                  Grow Your Music Reach
                  <span className="block text-[#FF5500] mt-1.5">Build Fans, Share Feedback</span>
                </h1>

                <p className="text-[15px] sm:text-[17px] text-[#999999] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Join more than thousands of music creators and grow your audience through our
                  collaborative platform.
                  <span className="block text-[#FAFAFA] font-medium mt-1">100% Free to use.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <a
                    href="/api/auth/soundcloud/redirect"
                    className="sc-btn-orange px-6 py-3.5 text-[15px]"
                  >
                    <SoundCloudMark className="w-5 h-3.5" />
                    <span>Connect SoundCloud</span>
                  </a>

                  <a
                    href="#how-it-works"
                    className="sc-btn-outline px-6 py-3.5 text-[15px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#FF5500]"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>See How It Works</span>
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative flex justify-center lg:justify-end w-full">
                  <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl">
                    <img
                      src="/frontend/user/image/FeaturedArtist.png"
                      alt="Featured Artist on RepostChain"
                      width={720}
                      height={540}
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-auto relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-24 bg-[#121212] border-b border-[#272727]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-[#FF5500] mb-3">
                Community-Driven Promotion
              </span>
              <h2 className="sc-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                What is RepostChain?
              </h2>
              <p className="text-[15px] sm:text-[17px] text-[#999999] leading-relaxed">
                RepostChain is a revolutionary platform that connects musicians and content
                creators, enabling organic growth through collaborative promotion and authentic
                engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {[
                {
                  title: 'Collaborative Growth',
                  desc: "Join a community of artists who support each other through strategic reposts, creating a network effect that amplifies everyone's reach.",
                  icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
                },
                {
                  title: 'Real Engagement',
                  desc: 'Our platform ensures all interactions are genuine, helping you build a real fanbase that truly appreciates your music.',
                  icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                },
                {
                  title: 'Fair System',
                  desc: 'Our system ensures fair collaboration between artists, preventing spam and promoting quality content.',
                  icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                },
                {
                  title: 'Analytics & Growth',
                  desc: 'Track your growth with detailed analytics and insights, helping you optimize your promotion strategy.',
                  icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                },
              ].map((item) => (
                <div key={item.title} className="sc-card p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-[#FF5500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-2.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#999999] text-[14px] sm:text-[15px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-[#121212] border-b border-[#272727]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-[#FF5500] mb-3">
                4 Simple Steps
              </span>
              <h2 className="sc-heading text-3xl sm:text-4xl font-bold mb-4">
                How RepostChain Works
              </h2>
              <p className="text-[15px] sm:text-[17px] text-[#999999] max-w-3xl mx-auto leading-relaxed">
                Our platform makes it easy to grow your audience through a fair exchange system that
                benefits everyone involved.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  step: '01',
                  title: 'Connect SoundCloud',
                  desc: 'Link your SoundCloud account to get started. It only takes a few seconds.',
                  path: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
                },
                {
                  step: '02',
                  title: 'Earn Points',
                  desc: 'Listen to and repost tracks from other artists to earn promotion points.',
                  path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                },
                {
                  step: '03',
                  title: 'Repost Tracks',
                  desc: 'Use your points to get your tracks reposted by other artists.',
                  path: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
                },
                {
                  step: '04',
                  title: 'Grow Followers',
                  desc: 'Watch your fan base grow as your music reaches new audiences.',
                  path: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                },
              ].map((item) => (
                <div key={item.step} className="sc-card p-6 sm:p-7 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF5500]" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-[4px] bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#FF5500]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={item.path}
                        />
                      </svg>
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#FF5500]">{item.step}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FAFAFA] mb-2.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#999999] text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Spotlight Section - SoundCloud Pro */}
        <section
          id="plan"
          className="py-16 sm:py-24 bg-[#121212] border-b border-[#272727] relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-[#1E1E1E] border border-[#272727] px-3 py-1 rounded-[4px] mb-6">
                  <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
                  <span className="text-[#FF5500] text-xs font-bold uppercase tracking-wider">
                    Partner Spotlight
                  </span>
                </div>
                <h2 className="sc-heading text-3xl sm:text-4xl md:text-[42px] font-bold mb-5 leading-tight">
                  Supercharge Your Music with{' '}
                  <span className="text-[#FF5500] block sm:inline">SoundCloud Pro</span>
                </h2>
                <p className="text-[15px] sm:text-[17px] text-[#999999] mb-8 leading-relaxed">
                  SoundCloud Pro gives you the tools to take your music career to the next level.
                  Get advanced stats, unlimited uploads, and more control over your content.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      title: 'Advanced Analytics',
                      desc: 'Track your audience with detailed insights and performance metrics',
                      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                    },
                    {
                      title: 'Unlimited Uploads',
                      desc: 'Upload as much music as you want with no storage limits',
                      d: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
                    },
                    {
                      title: 'Spotlight Features',
                      desc: 'Pin your best tracks and get featured placement on your profile',
                      d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                    },
                  ].map((f) => (
                    <div key={f.title} className="flex items-start gap-3.5">
                      <div className="bg-[#181818] border border-[#272727] w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          className="w-5 h-5 text-[#FF5500]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={f.d}
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-[#FAFAFA] font-semibold text-[15px] mb-0.5">
                          {f.title}
                        </h4>
                        <p className="text-[#999999] text-[13px]">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="https://invite.soundcloud.com/pjoy4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sc-btn-orange w-full sm:w-auto px-7 py-3.5 text-[15px]"
                >
                  <span>Upgrade to SoundCloud Pro</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
                <p className="text-xs text-[#666666] mt-3.5">
                  Special offer for RepostChain users • Start your free trial today
                </p>
              </div>

              <PartnerSpotlightCard />
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="py-16 sm:py-24 bg-[#121212] border-b border-[#272727]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-[#FF5500] mb-3">
                Proven Results
              </span>
              <h2 className="sc-heading text-3xl sm:text-4xl font-bold mb-4">
                RepostChain in Numbers
              </h2>
              <p className="text-[15px] sm:text-[17px] text-[#999999] max-w-2xl mx-auto">
                Join thousands of artists already growing their audience with our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { value: '10K+', label: 'Tracks Reposted' },
                { value: '2K+', label: 'Feedback Circulated' },
                { value: '5K+', label: 'Artists Registered' },
                { value: '2M+', label: 'Total Followers Reached' },
              ].map((stat) => (
                <div key={stat.label} className="sc-card p-6 sm:p-8 text-center">
                  <span className="text-4xl sm:text-5xl font-bold text-[#FF5500] block mb-2.5 tracking-tight">
                    {stat.value}
                  </span>
                  <p className="text-[#999999] text-[14px] font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-24 bg-[#121212] border-b border-[#272727]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-[#FF5500] mb-3">
                Artist Community
              </span>
              <h2 className="sc-heading text-3xl sm:text-4xl font-bold mb-4">Success Stories</h2>
              <p className="text-[15px] sm:text-[17px] text-[#999999] max-w-2xl mx-auto">
                See how artists like you are growing their audience with RepostChain.
              </p>
            </div>

            <div className="overflow-hidden relative w-full">
              <div className="flex gap-5 animate-scroll">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-[280px] sm:w-[350px] md:w-[380px] sc-card p-6 sm:p-7"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="bg-[#FF5500] p-1 rounded-[2px]">
                          <svg className="w-3.5 h-3.5 text-white fill-white" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <p className="text-[#FAFAFA] text-[14px] sm:text-[15px] leading-relaxed mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#272727]">
                      <div className="w-11 h-11 rounded-full bg-[#FF5500] p-[2px] shrink-0">
                        <img
                          className="w-full h-full object-cover rounded-full"
                          src={t.image}
                          alt={t.name}
                          width={44}
                          height={44}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div>
                        <p className="text-[#FAFAFA] font-semibold text-[14px]">{t.name}</p>
                        <p className="text-[#FF5500] text-[12px]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-16 sm:py-24 bg-[#121212] px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-[#181818] border border-[#272727] rounded-[6px] p-8 sm:p-12 text-center relative overflow-hidden"
              style={{ borderTop: '3px solid #FF5500' }}
            >
              <div className="relative z-10">
                <h2 className="sc-heading text-2xl sm:text-4xl font-bold mb-4">
                  Ready to Take Your Music Career{' '}
                  <span className="text-[#FF5500] block sm:inline">To The Next Level?</span>
                </h2>
                <p className="text-[15px] sm:text-[17px] text-[#999999] mb-8 max-w-xl mx-auto">
                  Join 5,000+ artists already growing their fanbase with RepostChain
                </p>
                <a
                  href="/api/auth/soundcloud/redirect"
                  className="sc-btn-orange px-8 py-4 text-[15px] sm:text-[16px] w-full sm:w-auto"
                >
                  <SoundCloudMark className="w-5 h-3.5" />
                  <span>Start Your Music Growth</span>
                </a>
                <p className="text-[12px] text-[#666666] mt-6">
                  No credit card required • 100% Free for Artists
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
