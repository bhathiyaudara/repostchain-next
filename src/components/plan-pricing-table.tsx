'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SoundCloudMark } from '@/components/public-layout';

export function PlanPricingTable() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="w-full">
      {/* Monthly / Yearly Pill Toggle Switch */}
      <div className="flex items-center justify-center mb-12 sm:mb-16">
        <div className="bg-[#141414] p-1.5 rounded-full border border-white/10 inline-flex items-center gap-1 shadow-lg">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              !isYearly
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Billed Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 relative ${
              isYearly
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Billed Annually
            <span className="ml-2 inline-block bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Side-by-Side High-Impact Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 items-stretch">
        {/* Plan 1: Free Artist */}
        <div className="rounded-3xl bg-[#121212] border border-white/10 p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                COMMUNITY TIER
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 bg-white/[0.06] px-3 py-1 rounded-full">
                Free Forever
              </span>
            </div>

            <h2 className="sc-display text-3xl sm:text-4xl font-black text-white mb-2">
              FREE ARTIST
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Essential organic promotion tools for emerging musicians building their foundation.
            </p>

            <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
              <span className="sc-display text-5xl sm:text-6xl font-black text-white">$0</span>
              <span className="text-zinc-500 text-sm font-semibold">/ forever</span>
            </div>

            <ul className="space-y-4 text-sm text-zinc-300 mb-8">
              {[
                { name: '2 Concurrent Active Campaigns', note: 'Run up to 2 track campaigns simultaneously' },
                { name: '20 Direct Repost Requests / mo', note: 'Directly reach top curators in your genre' },
                { name: 'Unlimited Credit Earning', note: 'Listen, review, and repost fellow creators' },
                { name: 'Standard Campaign Queue', note: 'Featured across active community streams' },
                { name: 'Basic Track Analytics', note: 'Track plays, likes, and listener feedback' },
                { name: '100% Real SoundCloud Accounts', note: 'Strict zero-bot verification policy' },
              ].map((f) => (
                <li key={f.name} className="flex items-start gap-3">
                  <span className="text-zinc-400 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="text-white font-medium block">{f.name}</span>
                    <span className="text-xs text-zinc-500">{f.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="/api/auth/soundcloud/redirect"
            className="sc-pill-white w-full py-3.5 text-center text-sm font-bold justify-center"
          >
            <SoundCloudMark className="w-4 h-3" />
            <span>Get Started Free</span>
          </a>
        </div>

        {/* Plan 2: Pro Artist (SoundCloud Focus) */}
        <div className="rounded-3xl bg-[#161616] border-2 border-[#FF5500] p-8 sm:p-10 flex flex-col justify-between relative shadow-2xl shadow-[#FF5500]/10">
          {/* Top Floating Badge */}
          <div className="absolute -top-3.5 right-6 bg-[#FF5500] text-white text-[11px] font-black uppercase tracking-[0.14em] px-3.5 py-1 rounded-full shadow-md">
            MOST POPULAR
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <SoundCloudMark className="w-4 h-3 text-[#FF5500]" />
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#FF5500]">
                RECOMMENDED FOR CREATORS
              </span>
            </div>

            <h2 className="sc-display text-3xl sm:text-4xl font-black text-white mb-2">
              PRO ARTIST
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Supercharge your SoundCloud reach with priority placement, 5x requests, and bonus credits.
            </p>

            <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
              <span className="sc-display text-5xl sm:text-6xl font-black text-[#FF5500]">
                ${isYearly ? '7.99' : '9.99'}
              </span>
              <span className="text-zinc-500 text-sm font-semibold">
                / {isYearly ? 'month ($95.90 billed yearly)' : 'month'}
              </span>
            </div>

            <ul className="space-y-4 text-sm text-white mb-8">
              {[
                { name: '10 Concurrent Active Campaigns', note: '5x more campaign slots to promote full EPs & singles' },
                { name: '100 Direct Repost Requests / mo', note: '5x direct outreach to key SoundCloud curators' },
                { name: '2X Credit Multiplier', note: 'Earn double promotion points on every repost you make' },
                { name: 'Priority Queue Placement', note: 'Pinned to the top of genre discovery feeds' },
                { name: 'Advanced Demographics & Analytics', note: 'Deep insights into listener locations & retention' },
                { name: 'Multi-Account Support', note: 'Manage multiple artist aliases or label profiles' },
                { name: '24/7 Dedicated Artist Support', note: 'Fast-track campaign matching and assistance' },
              ].map((f) => (
                <li key={f.name} className="flex items-start gap-3">
                  <span className="text-[#FF5500] font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="text-white font-medium block">{f.name}</span>
                    <span className="text-xs text-zinc-400">{f.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <a
              href="/api/auth/soundcloud/redirect"
              className="sc-pill-orange w-full py-3.5 text-center text-sm font-bold justify-center"
            >
              <SoundCloudMark className="w-4 h-3" />
              <span>Upgrade to Pro Artist</span>
            </a>
            <p className="text-[11px] text-zinc-500 text-center mt-3">
              Instant activation • Cancel anytime • 100% money-back guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Official SoundCloud Partner Spotlight Banner */}
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#181818] via-[#1A1A1A] to-[#181818] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center shrink-0">
            <SoundCloudMark className="w-6 h-4 text-[#FF5500]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500]">
                Official Partner Perk
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Save with SoundCloud Pro</span>
            </div>
            <h3 className="text-white font-bold text-lg">
              Want Unlimited Uploads on SoundCloud?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
              Get SoundCloud Pro through RepostChain partner perks for just $8.25/mo to unlock unlimited audio storage.
            </p>
          </div>
        </div>
        <a
          href="https://invite.soundcloud.com/pjoy4"
          target="_blank"
          rel="noopener noreferrer"
          className="sc-pill-dark px-6 py-3 text-xs sm:text-sm whitespace-nowrap shrink-0"
        >
          <span>Claim SoundCloud Pro Deal</span>
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
