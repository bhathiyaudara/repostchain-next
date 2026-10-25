'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

const PLANS = [
  {
    id: 1,
    name: 'Free Plan',
    notes: 'Perfect for getting started and exploring organic repost exchanges.',
    monthly_price: 0,
    yearly_price: 0,
    features: [
      { name: 'Active Campaigns', value: '2 Concurrent', included: true, note: 'Run up to 2 campaigns at once' },
      { name: 'Direct Repost Requests', value: '20 / month', included: true, note: 'Reach curators directly' },
      { name: 'Earn Credits by Reposting', value: 'Unlimited', included: true, note: 'Support artists to earn credits' },
      { name: 'Basic Analytics', value: 'Included', included: true, note: 'Track plays, likes & reposts' },
      { name: 'Priority Matching', value: '', included: false, note: 'Featured placement in campaign feed' },
      { name: 'Multi-Account Management', value: '', included: false, note: 'Promote multiple artist profiles' },
    ],
  },
  {
    id: 2,
    name: 'Pro Artist',
    notes: 'Supercharge your SoundCloud growth with priority placement & 5x more direct requests.',
    monthly_price: 9.99,
    yearly_price: 95.9,
    features: [
      { name: 'Active Campaigns', value: '10 Concurrent', included: true, note: 'Run up to 10 campaigns at once' },
      { name: 'Direct Repost Requests', value: '100 / month', included: true, note: '5x more direct outreach' },
      { name: 'Earn Credits by Reposting', value: '2x Multiplier', included: true, note: 'Earn bonus credits per repost' },
      { name: 'Advanced Analytics', value: 'Full Suite', included: true, note: 'Audience insights & growth metrics' },
      { name: 'Priority Matching', value: 'Included', included: true, note: 'Top placement in campaign feed' },
      { name: 'Priority Support', value: '24/7 Dedicated', included: true, note: 'Fast-track artist support' },
    ],
  },
];

export default function PublicPlanPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="bg-gradient-to-b from-black via-zinc-950 to-black pt-28 sm:pt-32 pb-16">
        <div className="container mx-auto px-4" id="plans">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Choose Your Perfect Plan</h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
              Pro Plans unlock the full potential of RepostChain with exclusive features designed to
              supercharge your music promotion.
            </p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-zinc-900 p-1.5 rounded-xl shadow-lg border border-zinc-800 inline-flex items-center">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  !isYearly ? 'bg-zinc-800 shadow-md text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Billed Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 relative ${
                  isYearly ? 'bg-zinc-800 shadow-md text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Billed Annually
                <span className="absolute -top-2.5 -right-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {PLANS.map((plan) => {
              const price = isYearly ? plan.yearly_price : plan.monthly_price;
              const period = plan.monthly_price > 0 ? (isYearly ? 'year' : 'month') : 'Forever';
              return (
                <div
                  key={plan.id}
                  className="relative bg-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-800 hover:border-[#ff5500]/50 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{plan.name}</h2>
                      <p className="text-slate-300 text-sm sm:text-base mb-6">{plan.notes}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl sm:text-6xl font-bold text-white">
                          ${price.toFixed(2)}
                        </span>
                        <span className="text-slate-400 ml-2">/{period}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((f) => (
                        <div key={f.name} className="flex items-start space-x-3">
                          {f.included ? (
                            <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500/20 text-green-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                          ) : (
                            <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-red-500/20 text-red-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6 6 18M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="text-sm font-medium text-white">{f.name}</span>
                              {f.value && (
                                <span className="text-xs font-bold text-orange-400">{f.value}</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{f.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.monthly_price > 0 ? (
                    <a
                      href="/api/auth/soundcloud/redirect"
                      className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-center transition-colors block"
                    >
                      Choose Plan
                    </a>
                  ) : (
                    <Link
                      href="/user/dashboard"
                      className="w-full py-3.5 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-center transition-colors block"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Join 10,000+ Artists */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Join <span className="text-orange-400">10,000+</span> Artists Already Growing
              </h2>
              <p className="text-base sm:text-xl text-slate-300">
                See how artists are transforming their careers with RepostChain
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { val: '500%', title: 'Average Growth', sub: 'in followers within 30 days' },
                { val: '2.5M+', title: 'Total Plays', sub: 'generated for our artists' },
                { val: '48hrs', title: 'Average Response', sub: 'time for campaigns' },
              ].map((stat) => (
                <div key={stat.title} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{stat.val}</div>
                  <div className="text-white font-semibold mb-1">{stat.title}</div>
                  <div className="text-slate-400 text-sm">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Artists Choose Pro Plans */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl p-6 sm:p-8 border border-orange-500/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                Why Artists Choose <span className="text-orange-400">Pro Plans</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-2">5x More Exposure</h3>
                  <p className="text-slate-300 text-sm">
                    Get 100 direct requests vs 20 on free plan. Reach more curators and grow faster.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Multi-Account Power</h3>
                  <p className="text-slate-300 text-sm">
                    Promote unlimited accounts simultaneously. Perfect for labels and serious artists.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-slate-300 text-sm">
                    Track reach, followers, and reposts with detailed insights to optimize your strategy.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Priority Support</h3>
                  <p className="text-slate-300 text-sm">
                    Get faster responses and dedicated support to maximize your promotion success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
