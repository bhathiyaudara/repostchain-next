'use client';

import { useState } from 'react';

const SPOTLIGHT_PLANS = [
  {
    front: true,
    title: 'Artist Pro',
    sub: 'Unlimited access to all tools',
    price: '$8.25',
    accent: '#ff5500',
    features: [
      'Unlimited uploads',
      'Boost tracks unlimited',
      'Distribute & monetize tracks',
      'Replace tracks anytime',
    ],
    popular: true,
  },
  {
    front: false,
    title: 'Artist',
    sub: 'Essential artist tools',
    price: '$3.25',
    accent: '#3b82f6',
    features: [
      '3 hours of uploads',
      'Boost tracks (2x per month)',
      'Distribute & monetize tracks',
      'Replace tracks (3x per month)',
    ],
    popular: false,
  },
];

export function PartnerSpotlightCard() {
  const [flippedPlan, setFlippedPlan] = useState(false);

  return (
    <div
      className="relative block mt-4 lg:mt-0 cursor-pointer"
      onClick={() => setFlippedPlan((prev) => !prev)}
    >
      <div className="w-full max-w-lg mx-auto h-[390px] sm:h-[420px]" style={{ perspective: '1000px' }}>
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            flippedPlan ? '' : 'animate-flip'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: flippedPlan ? 'rotateY(180deg)' : undefined,
          }}
        >
          {SPOTLIGHT_PLANS.map((plan) => (
            <div
              key={plan.title}
              className="absolute inset-0 backface-hidden"
              style={plan.front ? undefined : { transform: 'rotateY(180deg)' }}
            >
              <div
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border shadow-2xl h-full relative flex flex-col justify-between"
                style={{
                  borderColor: plan.accent + '4D',
                  boxShadow: '0 25px 50px -12px ' + plan.accent + '33',
                }}
              >
                {plan.popular && (
                  <div className="absolute top-3 right-3 bg-[#ff5500] text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div
                  className="rounded-2xl p-4 sm:p-5 mb-3 border mt-3 sm:mt-0"
                  style={{
                    backgroundColor: plan.accent + '0D',
                    borderColor: plan.accent + '1A',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{plan.title}</h3>
                      <p className="text-zinc-400 text-xs">{plan.sub}</p>
                    </div>
                    <div
                      className="text-white px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-lg sm:text-xl shrink-0"
                      style={{ backgroundColor: plan.accent }}
                    >
                      {plan.price}
                      <span className="text-xs font-normal">/mo</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-zinc-300 text-xs">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: plan.accent + '33' }}
                        >
                          <svg
                            className="w-2.5 h-2.5"
                            style={{ color: plan.accent }}
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
                <div>
                  <div className="text-center mb-2">
                    <a
                      href="https://invite.soundcloud.com/pjoy4"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={
                        'inline-block text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 w-full text-center bg-gradient-to-r ' +
                        (plan.popular
                          ? 'from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700'
                          : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700')
                      }
                    >
                      Get Started
                    </a>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedPlan((prev) => !prev);
                      }}
                      className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: plan.accent }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Click to see other plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-6 -left-6 w-48 h-48 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
