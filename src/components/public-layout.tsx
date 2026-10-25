'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Official SoundCloud Cloudmark Icon (Media Kit standard)
 */
export function SoundCloudMark({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 18" fill="currentColor" aria-hidden="true">
      <rect x="0" y="9" width="1.6" height="8" rx="0.8" />
      <rect x="2.6" y="6" width="1.6" height="11" rx="0.8" />
      <rect x="5.2" y="7.5" width="1.6" height="9.5" rx="0.8" />
      <rect x="7.8" y="4" width="1.6" height="13" rx="0.8" />
      <rect x="10.4" y="2.5" width="1.6" height="14.5" rx="0.8" />
      <rect x="13" y="4.5" width="1.6" height="12.5" rx="0.8" />
      <path d="M21.5 1.5C18.4 1.5 15.8 3.6 15.1 6.5V16.2C15.1 16.6 15.4 17 15.9 17H27.2C29.8 17 32 14.8 32 12.2C32 9.7 30.1 7.6 27.6 7.4C27.1 4 24.5 1.5 21.5 1.5Z" />
    </svg>
  );
}

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<{
    type: 'error' | 'warning';
    text: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const warning = params.get('warning');
    if (error) {
      setBannerMessage({ type: 'error', text: error });
    } else if (warning) {
      setBannerMessage({ type: 'warning', text: warning });
    }

    fetch('/api/auth/session')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { href: '/#how-it-works', label: 'HOW IT WORKS' },
    { href: '/#about', label: 'ABOUT' },
    { href: '/#plan', label: 'PARTNER SPOTLIGHT' },
    { href: '/plan', label: 'PRICING' },
    { href: '/features', label: 'FEATURES' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/[0.07]">
      {bannerMessage && (
        <div
          className={`px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-3 ${
            bannerMessage.type === 'error'
              ? 'bg-[#EC2E10] text-white'
              : 'bg-[#FFB200] text-[#0A0A0A] font-medium'
          }`}
        >
          <span className="truncate">{bannerMessage.text}</span>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            className="shrink-0 opacity-80 hover:opacity-100 font-bold px-2"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <img
            src="/assets/logo/rc-logo-white.png"
            alt="RepostChain"
            width={176}
            height={40}
            className="w-32 sm:w-36 lg:w-44 h-auto object-contain"
          />
        </Link>

        {/* Center Uppercase Editorial Navigation (matches SoundCloud for Artists screenshot) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] xl:text-[12px] font-bold tracking-[0.08em] text-zinc-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Pill CTA: Single official Connect with SoundCloud button */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/user/dashboard" className="sc-pill-white px-5 py-2 text-[13px]">
              Dashboard
            </Link>
          ) : (
            <a
              href="/api/auth/soundcloud/redirect"
              className="sc-pill-white px-5 py-2.5 text-[13px]"
            >
              <SoundCloudMark className="w-4 h-3" />
              <span>Connect with SoundCloud</span>
            </a>
          )}
        </div>

        {/* Mobile Action & Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/user/dashboard"
              className="sc-pill-white px-3.5 py-1.5 text-[12px]"
            >
              Dashboard
            </Link>
          ) : (
            <a
              href="/api/auth/soundcloud/redirect"
              className="sc-pill-white px-3.5 py-1.5 text-[12px]"
            >
              <SoundCloudMark className="w-3.5 h-2.5" />
              <span>Connect</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="text-zinc-300 hover:text-white p-1.5"
          >
            {!mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
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
                width="26"
                height="26"
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-t border-white/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-5 py-5 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-bold tracking-[0.08em] text-zinc-300 hover:text-[#FF5500] transition-colors border-b border-white/[0.06]"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <Link
                  href="/user/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="sc-pill-white w-full py-3 text-sm"
                >
                  Open Artist Dashboard
                </Link>
              ) : (
                <a
                  href="/api/auth/soundcloud/redirect"
                  className="sc-pill-orange w-full py-3 text-sm"
                >
                  <SoundCloudMark className="w-5 h-3.5" />
                  <span>Connect with SoundCloud</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 pt-14 sm:pt-20 pb-10 px-4 sm:px-8 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 mb-14">
          {/* Left Editorial Tagline (matches Screenshot 2 bottom-left) */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-5">
              <img
                src="/assets/logo/rc-logo-white.png"
                alt="RepostChain"
                width={176}
                height={40}
                className="w-36 lg:w-44 h-auto object-contain"
              />
            </Link>
            <p className="sc-display text-xl sm:text-2xl text-[#FF5500] mb-3">
              YOUR SOUND.
              <br />
              <span className="text-white">AMPLIFIED BY THE CHAIN.</span>
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              The collaborative music promotion network for independent SoundCloud artists,
              producers, DJs, and labels.
            </p>
          </div>

          {/* Center Navigation Columns */}
          <div className="md:col-span-2">
            <h4 className="text-zinc-500 font-bold mb-4 text-[11px] uppercase tracking-[0.12em]">
              PLATFORM
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/plan"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/#plan"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  SoundCloud Pro
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-zinc-500 font-bold mb-4 text-[11px] uppercase tracking-[0.12em]">
              LEGAL
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-zinc-500 font-bold mb-4 text-[11px] uppercase tracking-[0.12em]">
                SUPPORT &amp; SOCIAL
              </h4>
              <ul className="space-y-2.5 mb-6">
                <li>
                  <Link
                    href="/faq"
                    className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-zinc-300 hover:text-[#FF5500] transition-colors text-xs sm:text-[13px]"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@repostchain.com"
                    className="text-zinc-400 hover:text-white transition-colors text-xs"
                  >
                    support@repostchain.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              {[
                {
                  label: 'X / Twitter',
                  href: 'https://x.com',
                  d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com',
                  d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                },
                {
                  label: 'Facebook',
                  href: 'https://facebook.com',
                  d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                },
                {
                  label: 'Instagram',
                  href: 'https://instagram.com',
                  d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label={s.label}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-xs">
          <p>&copy; {new Date().getFullYear()} RepostChain (Tunexa Limited). All rights reserved.</p>
          <p className="flex items-center gap-2 text-zinc-400">
            <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
            <span>Built for SoundCloud Artists</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
