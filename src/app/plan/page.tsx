import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PublicHeader,
  PublicFooter,
  SoundCloudMark,
  RepostChainMark,
} from '@/components/public-layout';
import { PlanPricingTable } from '@/components/plan-pricing-table';

export const metadata: Metadata = {
  title: 'Pricing & Plans — RepostChain | Organic SoundCloud Promotion',
  description:
    'Compare RepostChain plans. Start free with community repost exchanges or supercharge your SoundCloud reach with Pro Artist. Transparent pricing, no hidden fees.',
  alternates: {
    canonical: '/plan',
  },
};

const PLAN_FAQS = [
  {
    question: 'Can I cancel or change my plan anytime?',
    answer:
      'Yes, absolutely. You can upgrade, downgrade, or cancel your Pro Artist subscription at any time directly from your billing settings. If you cancel, you will continue to enjoy Pro features until the end of your current billing cycle with no extra fees.',
  },
  {
    question: 'How does the annual billing discount work?',
    answer:
      'When you choose annual billing, you receive an instant 20% discount on the Pro Artist tier—paying just $7.99/month ($95.90 billed annually) instead of the standard $9.99 monthly rate.',
  },
  {
    question: 'Do I get to keep my earned credits if I downgrade?',
    answer:
      'Yes! Any credits you have earned through listening, reviewing, and reposting other creators belong to you permanently. They will never expire, even if you switch back to the Free Artist plan.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) as well as secure digital wallets via Stripe. All transactions are SSL encrypted and processed with bank-level security.',
  },
  {
    question: 'Are all reposts and followers 100% genuine?',
    answer:
      'Yes, 100%. RepostChain strictly integrates via official SoundCloud OAuth. Every repost comes from a real, active SoundCloud creator. We enforce automated monitoring and immediately ban fake accounts or bot traffic.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Chen',
    role: 'Electronic Producer',
    avatar: '/frontend/images/testimonial/chen.png',
    quote:
      'RepostChain Pro gave my latest EP the early momentum it needed. Having 10 active campaign slots let me promote every track simultaneously.',
  },
  {
    name: 'Riley Monroe',
    role: 'Songwriter & Indie Artist',
    avatar: '/frontend/images/testimonial/smith.png',
    quote:
      'The 2X credit multiplier makes a huge difference. I earn credits twice as fast, which keeps my tracks in continuous repost loops.',
  },
  {
    name: 'Kai Rivers',
    role: 'Hip-Hop Creator',
    avatar: '/frontend/images/testimonial/singh.png',
    quote:
      'Priority matching and direct curator outreach helped me connect with taste-makers who genuinely love the sound. Zero bot fluff.',
  },
];

export default function PublicPlanPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5500] selection:text-white overflow-x-hidden font-sans">
      {/* Header */}
      <PublicHeader />

      <main>
        {/* ========================================================= */}
        {/* HERO SECTION — Modern SoundCloud Editorial Heading        */}
        {/* ========================================================= */}
        <section
          id="plans"
          className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-[#0A0A0A]"
        >
          {/* Subtle Ambient Radial Glows */}
          <div
            className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 -right-32 w-[460px] h-[460px] bg-[#FF5500]/[0.06] rounded-full blur-[150px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-6 backdrop-blur-sm shadow-sm">
              <RepostChainMark className="w-4 h-4 shrink-0 drop-shadow-[0_0_8px_rgba(255,85,0,0.35)]" />
              <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                TRANSPARENT CREATOR PRICING
              </span>
              <SoundCloudMark className="w-4 h-3 text-[#FF5500] shrink-0" />
            </div>

            {/* Display Headline */}
            <h1 className="sc-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.93] mb-5">
              CHOOSE YOUR <span className="text-[#FF5500]">PERFECT PLAN</span>
            </h1>

            {/* Subheadline */}
            <p className="text-zinc-400 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-12">
              Start 100% free with peer community exchanges or unlock Pro Artist features designed to
              accelerate your SoundCloud fanbase.
            </p>

            {/* Pricing Table Component (Interactive Toggle + Cards + Partner Banner) */}
            <PlanPricingTable />
          </div>
        </section>

        {/* ========================================================= */}
        {/* METRICS STRIP — Clean Minimalist Divider Layout            */}
        {/* ========================================================= */}
        <section
          aria-label="Platform Results"
          className="border-y border-white/10 bg-[#0E0E0E] py-12 sm:py-16"
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                PROVEN TRACTION
              </span>
              <h2 className="sc-display text-2xl sm:text-4xl font-black text-white">
                JOIN <span className="text-[#FF5500]">10,000+</span> ARTISTS ALREADY GROWING
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {[
                {
                  value: '500%',
                  label: 'AVERAGE GROWTH',
                  desc: 'In follower reach within first 30 days',
                },
                {
                  value: '2.5M+',
                  label: 'TOTAL PLAYS REACHED',
                  desc: 'Organic streams across creator networks',
                },
                {
                  value: '48hrs',
                  label: 'AVERAGE RESPONSE',
                  desc: 'Fast campaign fulfillment across queues',
                },
                {
                  value: '100%',
                  label: 'ORGANIC REPOSTS',
                  desc: 'Zero bot policy strictly enforced',
                },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col justify-center ${
                    idx !== 0 ? 'lg:border-l lg:border-white/10 lg:pl-10 xl:pl-12' : ''
                  }`}
                >
                  <span className="sc-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#FF5500] tracking-tight leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-white mt-2">
                    {stat.label}
                  </span>
                  <span className="text-zinc-500 text-xs sm:text-[13px] mt-1 hidden sm:block">
                    {stat.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHY ARTISTS CHOOSE PRO PLANS (4 Core Pillars)              */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 sm:mb-18">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                  THE PRO ADVANTAGE
                </span>
                <h2 className="sc-display text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                  WHY ARTISTS CHOOSE <span className="text-[#FF5500]">PRO PLANS</span>
                </h2>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md">
                Built specifically for independent musicians, producers, and labels looking for
                continuous reach without algorithmic limits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: '5x More Direct Reach',
                  desc: 'Get 100 direct requests each month (vs 20 on Free). Directly submit your tracks to influential genre curators and taste-makers.',
                  icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                },
                {
                  title: 'Multi-Account Power',
                  desc: 'Promote multiple artist profiles, collaborative side-projects, or label accounts simultaneously from one unified command dashboard.',
                  icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
                },
                {
                  title: 'Deep Track Analytics',
                  desc: 'Gain granular demographic data on where your listeners originate, which tracks hold high retention, and how your fanbase expands.',
                  icon: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
                },
                {
                  title: 'Priority Matching & 24/7',
                  desc: 'Skip the standard queue. Your campaigns receive top-priority placement in fellow musicians’ feeds for lightning-fast reposts.',
                  icon: 'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-[#121212] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-[#FF5500]/60 transition-all duration-300 group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center mb-5 text-[#FF5500] group-hover:bg-[#FF5500] group-hover:text-white transition-colors duration-200">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHAT ARTISTS ARE SAYING (Testimonials)                     */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                COMMUNITY VOICES
              </span>
              <h2 className="sc-display text-3xl sm:text-5xl font-black text-white">
                WHAT ARTISTS <span className="text-[#FF5500]">ARE SAYING</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl bg-[#121212] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover border border-[#FF5500]"
                    />
                    <div>
                      <h4 className="text-white font-bold text-sm">{t.name}</h4>
                      <p className="text-xs text-zinc-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MINIMALIST LINE-ACCORDION PRICING FAQ                      */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-[960px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14 sm:mb-18">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5500] block mb-2">
                HAVE QUESTIONS?
              </span>
              <h2 className="sc-display text-3xl sm:text-5xl font-black text-white">
                PRICING &amp; PLAN <span className="text-[#FF5500]">FAQ</span>
              </h2>
            </div>

            <div className="border-t border-white/10 divide-y divide-white/10">
              {PLAN_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group py-6 transition-all duration-200 cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-white group-hover:text-[#FF5500] transition-colors">
                    <span className="tracking-tight">{faq.question}</span>
                    <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-open:rotate-45 transition-transform duration-200 text-zinc-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM FINALE BANNER                                       */}
        {/* ========================================================= */}
        <section
          aria-label="Get Started"
          className="py-24 sm:py-32 bg-[#0A0A0A] px-4 sm:px-6 relative text-center overflow-hidden"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5500] block mb-4">
              READY TO SCALE?
            </span>

            <h2 className="sc-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-6">
              START YOUR MUSIC <span className="text-[#FF5500]">JOURNEY.</span>
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of musicians already building their audience organically on RepostChain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/api/auth/soundcloud/redirect"
                className="sc-pill-white px-9 py-4 text-base font-bold shadow-2xl shadow-white/10"
              >
                <SoundCloudMark className="w-5 h-3.5" />
                <span>Connect with SoundCloud</span>
              </a>
              <Link href="/features" className="sc-pill-dark px-8 py-4 text-base font-semibold">
                <span>Explore Features</span>
              </Link>
            </div>

            <p className="text-xs text-zinc-500 font-medium mt-8">
              No credit card required for Free tier • Cancel Pro anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
