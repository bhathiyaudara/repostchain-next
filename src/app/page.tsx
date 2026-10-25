'use client';

import { useState } from 'react';
import Link from 'next/link';

const TESTIMONIALS = [
  {
    quote:
      "RepostChain's fair exchange system is brilliant. I've built real relationships with other artists and my fanbase has grown organically.",
    name: 'Riley Monroe',
    role: 'Song Writer',
    image: '/frontend/images/testimonial/1.jpg',
  },
  {
    quote:
      'Best decision I made for my music career. The analytics help me understand my audience, and the community is incredibly supportive.',
    name: 'Kai Rivers',
    role: 'Hip Hop Artist',
    image: '/frontend/images/testimonial/2.jpg',
  },
  {
    quote:
      'RepostChain helped me gain over 2,500 genuine followers in just 3 months. The engagement is real, and my plays have increased dramatically.',
    name: 'The Velvet Echoes',
    role: 'Band',
    image: '/frontend/images/testimonial/3.jpg',
  },
  {
    quote:
      'I was struggling to break through until I found RepostChain. Now my tracks are being discovered by the right audience. Incredible platform!',
    name: 'Midnight Skyline',
    role: 'Record Label',
    image: '/frontend/images/testimonial/4.jpg',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header - Exact match to resources/views/backend/user/layouts/partials/f_header.blade.php */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3.5 sm:py-4 flex justify-between items-center gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img
              src="/assets/logo/rc-logo-white.png"
              alt="RepostChain"
              className="w-32 sm:w-36 lg:w-48 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-2 sm:space-x-3 xl:space-x-6">
            <a
              href="#home"
              className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
            >
              Home
            </a>
            <Link
              href="/user/plans"
              className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <a
              href="#about"
              className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
            >
              How it Works
            </a>
            <a
              href="#plan"
              className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
            >
              Testimonials
            </a>

            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300 text-sm font-medium px-3 py-2 border border-orange-500/40 rounded-lg transition-colors"
            >
              Dev / Admin Login
            </Link>

            <a
              href="/api/auth/soundcloud/redirect"
              className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 px-4 py-2 text-base"
            >
              Continue with SoundCloud
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-200 hover:text-white"
            >
              {!mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-900 border-t border-zinc-800">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <Link
                href="/user/plans"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Testimonials
              </a>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-3 py-2 rounded-md border border-orange-500 text-orange-400 hover:bg-orange-500/10"
              >
                Dev / Admin Login
              </Link>
              <a
                href="/api/auth/soundcloud/redirect"
                className="block text-center w-full px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
              >
                Continue with SoundCloud
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="bg-black px-3 sm:px-4 md:px-8">
        {/* Hero Section - Exact match to includes/hero.blade.php */}
        <section className="relative pt-28 pb-16 md:pt-40 md:pb-32 overflow-hidden" id="home">
          <div className="container mx-auto px-2 sm:px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  Grow Your Music Reach
                  <span className="block text-gradient">Build Fans, Share Feedback</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                  Join More than thousands of music creators and grow audience Through our
                  collaborative platform.
                  <br /> 100% Free to use
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <a
                    href="/api/auth/soundcloud/redirect"
                    className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 px-6 py-3 text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    Connect SoundCloud
                  </a>

                  <a
                    href="#how-it-works"
                    className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    See How It Works
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative flex justify-center lg:justify-end w-full">
                  <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-2xl">
                    <img
                      src="/frontend/user/image/FeaturedArtist.png"
                      alt="Featured Artist"
                      className="w-full h-auto relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Exact match to includes/about.blade.php */}
        <section id="about" className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                What is RepostChain?
              </h2>
              <p className="text-lg text-gray-300">
                RepostChain is a revolutionary platform that connects musicians and content
                creators, enabling organic growth through collaborative promotion and authentic
                engagement.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-[#ff5500]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ff5500]/20 transition-all">
                  <svg
                    className="w-7 h-7 text-[#ff5500]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Collaborative Growth</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Join a community of artists who support each other through strategic reposts,
                  creating a network effect that amplifies everyone&apos;s reach.
                </p>
              </div>
              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-[#ff5500]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ff5500]/20 transition-all">
                  <svg
                    className="w-7 h-7 text-[#ff5500]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real Engagement</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Our platform ensures all interactions are genuine, helping you build a real
                  fanbase that truly appreciates your music.
                </p>
              </div>
              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-[#ff5500]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ff5500]/20 transition-all">
                  <svg
                    className="w-7 h-7 text-[#ff5500]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Fair System</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Our system ensures fair Collaboration between artists, preventing spam and
                  promoting quality content.
                </p>
              </div>
              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-[#ff5500]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ff5500]/20 transition-all">
                  <svg
                    className="w-7 h-7 text-[#ff5500]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Analytics &amp; Growth</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Track your growth with detailed analytics and insights, helping you optimize your
                  promotion strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Exact match to includes/how-it-works.blade.php */}
        <section id="how-it-works" className="py-20 bg-black relative">
          <div className="max-w-[1400px] mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How RepostChain Works
              </h2>
              <p className="text-lg md:text-xl text-zinc-300 max-w-4xl mx-auto leading-relaxed">
                Our platform makes it easy to grow your audience through a fair exchange system that
                benefits everyone involved.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Connect SoundCloud',
                  desc: 'Link your SoundCloud account to get started. It only takes a few seconds.',
                  path: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
                },
                {
                  step: '2',
                  title: 'Earn Points',
                  desc: 'Listen to and repost tracks from other artists to earn promotion points.',
                  path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                },
                {
                  step: '3',
                  title: 'Repost Tracks',
                  desc: 'Use your points to get your tracks reposted by other artists.',
                  path: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
                },
                {
                  step: '4',
                  title: 'Grow Followers',
                  desc: 'Watch your fan base grow as your music reaches new audiences.',
                  path: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300 hover:scale-[1.05] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff5500] to-orange-600" />
                  <span className="text-4xl font-bold text-[#ff5500] mb-6 block">{item.step}</span>
                  <div className="bg-[#ff5500]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ff5500]/20 transition-all">
                    <svg
                      className="w-8 h-8 text-[#ff5500]"
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
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SoundCloud Pro Section - Exact match to includes/sound-cloud-pro.blade.php */}
        <section
          id="plan"
          className="py-24 relative overflow-hidden bg-gradient-to-b from-black via-[#ff5500]/5 to-black"
        >
          <div className="max-w-[1400px] mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-[#ff5500]/10 border border-[#ff5500]/30 px-4 py-2 rounded-full mb-6">
                  <svg
                    className="w-4 h-4 text-[#ff5500]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <span className="text-[#ff5500] text-sm font-semibold">Partner Spotlight</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Supercharge Your Music with
                  <br />
                  <span className="text-[#ff5500]">SoundCloud Pro</span>
                </h2>
                <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
                  SoundCloud Pro gives you the tools to take your music career to the next level.
                  Get advanced stats, unlimited uploads, and more control over your content.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#ff5500]/10 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-[#ff5500]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Advanced Analytics</h4>
                      <p className="text-zinc-400 text-sm">
                        Track your audience with detailed insights and performance metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#ff5500]/10 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-[#ff5500]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Unlimited Uploads</h4>
                      <p className="text-zinc-400 text-sm">
                        Upload as much music as you want with no storage limits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#ff5500]/10 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-[#ff5500]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Spotlight Features</h4>
                      <p className="text-zinc-400 text-sm">
                        Pin your best tracks and get featured placement on your profile
                      </p>
                    </div>
                  </div>
                </div>
                <a
                  href="https://invite.soundcloud.com/pjoy4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-[#ff5500]/30"
                >
                  Upgrade to SoundCloud Pro
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
                <p className="text-sm text-zinc-500 mt-4">
                  Special offer for RepostChain users • Start your free trial today
                </p>
              </div>

              <div className="relative hidden lg:block">
                <div className="w-full max-w-lg mx-auto">
                  <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 backdrop-blur-sm p-8 rounded-3xl border border-[#ff5500]/30 shadow-2xl shadow-[#ff5500]/20 relative">
                    <div className="absolute top-3 right-3 bg-[#ff5500] text-white px-3 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </div>
                    <div className="bg-[#ff5500]/5 rounded-2xl p-6 mb-4 border border-[#ff5500]/10 mt-2">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Artist Pro</h3>
                          <p className="text-zinc-400 text-xs">Unlimited access to all tools</p>
                        </div>
                        <div className="bg-[#ff5500] text-white px-3 py-1.5 rounded-lg font-bold text-xl">
                          $8.25<span className="text-xs font-normal">/mo</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          'Unlimited uploads',
                          'Boost tracks unlimited',
                          'Distribute & monetize tracks',
                          'Replace tracks anytime',
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-zinc-300 text-sm">
                            <div className="w-5 h-5 rounded-full bg-[#ff5500]/20 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-[#ff5500]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <a
                      href="https://invite.soundcloud.com/pjoy4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105 w-full text-center"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section - Exact match to includes/statistics.blade.php */}
        <section id="statistics" className="py-20 bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff5500]/5 via-transparent to-[#ff5500]/5" />
          <div className="max-w-[1400px] mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                RepostChain in Numbers
              </h2>
              <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of artists already growing their audience with our platform.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Tracks Reposted' },
                { value: '2K+', label: 'Feedback Circulated' },
                { value: '5K+', label: 'Artists Registered' },
                { value: '2M+', label: 'Total Followers Reached' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 backdrop-blur-sm p-10 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300 text-center group hover:scale-[1.05]"
                >
                  <span className="text-5xl md:text-6xl font-bold text-[#ff5500] block mb-4">
                    {stat.value}
                  </span>
                  <p className="text-zinc-300 text-lg font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Exact match to includes/testimonials.blade.php */}
        <section id="testimonials" className="py-20 bg-black relative">
          <div className="max-w-[1400px] mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Success Stories</h2>
              <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                See how artists like you are growing their audience with RepostChain.
              </p>
            </div>
            <div className="overflow-hidden relative w-full">
              <div className="flex gap-6 animate-scroll">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[400px] bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-zinc-800/50 hover:border-[#ff5500]/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="bg-[#00b67a] p-1">
                          <svg
                            className="w-4 h-4 text-white fill-white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <p className="text-zinc-300 text-base leading-relaxed mb-6 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        className="ring-1 ring-gray-400 rounded-full w-10 h-10 object-cover"
                        src={t.image}
                        alt={t.name}
                      />
                      <div>
                        <p className="text-white font-semibold">{t.name}</p>
                        <p className="text-[#ff5500] text-sm">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Exact match to includes/cta.blade.php */}
        <section id="cta" className="py-20 bg-black relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#ff5500]/20 via-orange-600/10 to-transparent backdrop-blur-sm border border-[#ff5500]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff5500]/5 via-transparent to-[#ff5500]/5" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Take Your Music Career
                  <br />
                  <span className="text-[#ff5500]">To The Next Level?</span>
                </h2>
                <p className="text-base sm:text-xl text-zinc-300 mb-8">
                  Join 5,000+ artists already growing their fanbase with RepostChain
                </p>
                <a
                  href="/api/auth/soundcloud/redirect"
                  className="bg-gradient-to-r from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700 text-white px-6 py-3.5 sm:px-12 sm:py-5 rounded-lg text-base sm:text-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-[#ff5500]/30 inline-block w-full sm:w-auto"
                >
                  Start Your Music Growth
                </a>
                <p className="text-sm text-zinc-500 mt-8">
                  No credit card required • 100% Free for Artists
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Exact match to f_footer.blade.php */}
      <footer className="border-t border-zinc-800/50 py-12 sm:py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/assets/logo/rc-logo-white.png"
                  alt="RepostChain"
                  className="w-36 lg:w-48 object-contain"
                />
              </div>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The collaborative music promotion platform for SoundCloud artists.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#plan"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/user/plans"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                  >
                    Developer / Admin Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-zinc-400 text-sm">Terms of Service</span>
                </li>
                <li>
                  <span className="text-zinc-400 text-sm">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-zinc-400 text-sm">Refund Policy</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@repostchain.com"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                  >
                    support@repostchain.com
                  </a>
                </li>
                <li>
                  <Link
                    href="/user/help"
                    className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800/50 pt-8 text-center">
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} RepostChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
