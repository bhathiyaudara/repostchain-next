'use client';

import { useState } from 'react';

const SPOTLIGHT_PLANS = [
  {
    front: true,
    title: 'Artist Pro',
    sub: 'Unlimited access to all tools',
    price: '$8.25',
    accent: '#FF5500',
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
    accent: '#4E83DB',
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
      <div className="w-full max-w-lg mx-auto h-[390px] sm:h-[410px]" style={{ perspective: '1000px' }}>
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
                className="bg-[#181818] p-5 sm:p-6 rounded-[6px] border h-full relative flex flex-col justify-between shadow-2xl"
                style={{
                  borderColor: plan.accent,
                  borderTopWidth: '3px',
                }}
              >
                {plan.popular && (
                  <div className="absolute top-3 right-3 bg-[#FF5500] text-white px-2.5 py-0.5 rounded-[3px] text-[10px] font-bold tracking-wider uppercase">
                    MOST POPULAR
                  </div>
                )}
                <div className="rounded-[4px] p-4 sm:p-5 mb-3 bg-[#121212] border border-[#272727] mt-3 sm:mt-0">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#272727]">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#FAFAFA] tracking-tight mb-0.5">
                        {plan.title}
                      </h3>
                      <p className="text-[#999999] text-xs">{plan.sub}</p>
                    </div>
                    <div
                      className="text-white px-3 py-1.5 rounded-[4px] font-bold text-lg sm:text-xl shrink-0"
                      style={{ backgroundColor: plan.accent }}
                    >
                      {plan.price}
                      <span className="text-xs font-normal">/mo</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2.5 text-[#FAFAFA] text-xs sm:text-[13px]">
                        <div
                          className="w-4 h-4 rounded-[3px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: plan.accent + '26' }}
                        >
                          <svg
                            className="w-3 h-3"
                            style={{ color: plan.accent }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
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
                  <div className="text-center mb-2.5">
                    <a
                      href="https://invite.soundcloud.com/pjoy4"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center text-white px-6 py-2.5 rounded-[4px] text-sm font-semibold transition-opacity hover:opacity-90 w-full"
                      style={{ backgroundColor: plan.accent }}
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
                      className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ color: plan.accent }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
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
      </div>
    </div>
  );
}
