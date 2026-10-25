'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/75 backdrop-blur-md border-b border-zinc-900/80">
      {bannerMessage && (
        <div
          className={`px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-3 ${
            bannerMessage.type === 'error'
              ? 'bg-red-900/90 text-red-100 border-b border-red-700'
              : 'bg-amber-900/90 text-amber-100 border-b border-amber-700'
          }`}
        >
          <span className="truncate">{bannerMessage.text}</span>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            className="shrink-0 text-white/80 hover:text-white font-bold px-2"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-3.5 sm:py-4 flex justify-between items-center gap-3">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src="/assets/logo/rc-logo-white.png"
            alt="RepostChain - SoundCloud Music Promotion Platform"
            width={192}
            height={44}
            className="w-32 sm:w-36 lg:w-48 h-auto object-contain"
          />
        </Link>

        {/* Desktop Menu - Exact match to f_header.blade.php */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center space-x-2 sm:space-x-3 xl:space-x-6"
        >
          <Link
            href="/#home"
            className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/plan"
            className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#about"
            className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/#how-it-works"
            className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/features"
            className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            className="text-gray-300 text-sm xl:text-base hover:text-white transition-colors"
          >
            Testimonials
          </Link>

          {isLoggedIn ? (
            <Link
              href="/user/dashboard"
              className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 px-4 py-2 text-base"
            >
              Dashboard
            </Link>
          ) : (
            <a
              href="/api/auth/soundcloud/redirect"
              className="font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 px-4 py-2 text-base"
            >
              Continue with SoundCloud
            </a>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="text-gray-200 hover:text-white p-1"
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
        <div className="lg:hidden bg-zinc-900 border-t border-zinc-800 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/plan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              Testimonials
            </Link>
            {isLoggedIn ? (
              <Link
                href="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-3 py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <a
                href="/api/auth/soundcloud/redirect"
                className="block text-center w-full px-3 py-2.5 rounded-md bg-orange-600 text-white hover:bg-orange-700 font-medium"
              >
                Continue with SoundCloud
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-800/50 py-12 sm:py-16 px-4 sm:px-8 bg-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Link href="/">
                <img
                  src="/assets/logo/rc-logo-white.png"
                  alt="RepostChain"
                  width={192}
                  height={44}
                  className="w-36 lg:w-48 h-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              The collaborative music promotion platform for SoundCloud artists.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#ff5500] transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#ff5500] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#ff5500] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#ff5500] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/plan"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  Refund Policy
                </Link>
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
                  href="/contact-us"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
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
  );
}
