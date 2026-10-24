'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    notes: 'Essential tools to start promoting your music organically on RepostChain.',
    monthly_price: 0,
    yearly_price: 0,
    isCurrent: true,
    features: [
      { name: 'Active Campaigns Limit', value: '2 Campaigns', included: true, note: 'Run up to 2 active campaigns simultaneously' },
      { name: 'Daily Direct Requests', value: '20 / day', included: true, note: 'Send up to 20 direct repost requests daily' },
      { name: 'Earn Credits by Reposting', value: 'Unlimited', included: true, note: 'Listen and repost tracks to earn credits' },
      { name: 'Featured Campaign Placement', value: '', included: false, note: 'Priority top placement in the campaign feed' },
      { name: 'Free Campaign Boosts', value: '', included: false, note: 'Instant visibility boost for new releases' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    notes: 'Supercharge your reach with priority campaign placement, higher limits, and Pro badges.',
    monthly_price: 9.99,
    yearly_price: 89.99,
    isCurrent: false,
    features: [
      { name: 'Active Campaigns Limit', value: '10 Campaigns', included: true, note: 'Run up to 10 active campaigns simultaneously' },
      { name: 'Daily Direct Requests', value: '100 / day', included: true, note: 'Send up to 100 direct repost requests daily' },
      { name: 'Earn Credits by Reposting', value: '2x Multiplier', included: true, note: 'Priority access to high-credit Pro campaigns' },
      { name: 'Featured Campaign Placement', value: 'Included', included: true, note: 'Priority top placement in the campaign feed' },
      { name: 'Free Campaign Boosts', value: 'Included', included: true, note: 'Instant visibility boost for new releases' },
    ],
  },
];

export default function PlansPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section>
      {/* Exact match to resources/views/livewire/user/plans.blade.php */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Choose Your Perfect Plan
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Pro Plans unlock the full potential of RepostChain with exclusive features designed to
          supercharge your music promotion.
        </p>
      </div>

      {/* Monthly / Yearly Toggle */}
      <div className="flex items-center justify-center mb-12">
        <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-xl shadow-lg border border-slate-300 dark:border-slate-600">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                !isYearly
                  ? 'bg-slate-300 dark:bg-slate-600 shadow-md text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Billed Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
                isYearly
                  ? 'bg-slate-300 dark:bg-slate-600 shadow-md text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Billed Annually
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-slate-700 rounded-3xl shadow-2xl border transition-all duration-300 hover:scale-[1.02] border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 ${
              plan.isCurrent ? 'opacity-75' : ''
            }`}
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  {plan.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{plan.notes}</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-6xl font-bold text-slate-900 dark:text-white">
                      ${isYearly ? plan.yearly_price.toFixed(2) : plan.monthly_price.toFixed(2)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">
                      /{plan.monthly_price > 0 ? (isYearly ? 'year' : 'month') : 'Forever'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((f) => (
                  <div key={f.name} className="flex items-start space-x-3">
                    {!f.included ? (
                      <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-red-500/20 text-red-400">
                        <X className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500/20 text-green-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {f.name}
                        </span>
                        {f.value && (
                          <span className="text-sm font-bold text-orange-400">{f.value}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {plan.monthly_price > 0 ? (
                <Link
                  href="/user/billing"
                  className="w-full py-4 px-6 font-medium transition-colors duration-200 rounded-lg inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500"
                >
                  Choose Plan
                </Link>
              ) : (
                <Link
                  href="/user/dashboard"
                  className="w-full py-4 px-6 font-medium transition-colors duration-200 rounded-lg inline-flex items-center justify-center bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  Current Plan
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
