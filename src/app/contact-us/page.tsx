import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PublicHeader,
  PublicFooter,
  SoundCloudMark,
  RepostChainMark,
} from '@/components/public-layout';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us — RepostChain Support | Tunexa Limited',
  description:
    'Get in touch with the RepostChain support team. We help independent SoundCloud musicians with campaign support, billing inquiries, account questions, and partnerships.',
  alternates: {
    canonical: '/contact-us',
  },
};

const CONTACT_INFO = [
  {
    title: 'Email Support',
    subtitle: 'Direct response from our dedicated specialist team',
    detail: 'support@repostchain.com',
    href: 'mailto:support@repostchain.com',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    title: 'Response Time',
    subtitle: 'Fast turnaround on all artist requests',
    detail: '24–48 hours on business days',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Worldwide Network',
    subtitle: 'Supporting independent artists across continents',
    detail: '150+ countries supported globally',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Company & Operations',
    subtitle: 'Official corporate entity and operator',
    detail: 'Tunexa Limited',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
];

const CONTACT_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'RepostChain Contact & Support',
  url: 'https://growmusicians.com/contact-us',
  description:
    'Official contact page for RepostChain artist support, campaign assistance, and business inquiries.',
  mainEntity: {
    '@type': 'Organization',
    name: 'RepostChain',
    legalName: 'Tunexa Limited',
    email: 'support@repostchain.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@repostchain.com',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
  },
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5500] selection:text-white overflow-x-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_STRUCTURED_DATA) }}
      />

      {/* Global Navigation */}
      <PublicHeader />

      <main>
        {/* ========================================================= */}
        {/* UNIFIED HERO & CONTACT GRID SECTION (Seamless layout)     */}
        {/* ========================================================= */}
        <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0A0A0A]">
          {/* Ambient Glows covering the entire section smoothly */}
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#FF5500]/[0.08] rounded-full blur-[160px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-[#FF5500]/[0.05] rounded-full blur-[160px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10">
            {/* Centered Hero Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-5 sm:mb-6 backdrop-blur-sm shadow-sm">
                <RepostChainMark className="w-4 h-4 shrink-0 drop-shadow-[0_0_8px_rgba(255,85,0,0.35)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                  ARTIST SUPPORT &amp; INQUIRIES
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="sc-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.93] mb-4 sm:mb-5">
                GET IN <span className="text-[#FF5500]">TOUCH</span>
              </h1>

              {/* Subheadline */}
              <p className="text-zinc-400 text-sm sm:text-base lg:text-lg font-normal leading-relaxed">
                Have questions about your track campaigns, billing, account setup, or partnership
                opportunities? We&apos;re here to help you succeed on SoundCloud.
              </p>
            </div>

            {/* 12-Column Content Grid: Form (7 cols) + Info Cards (5 cols) */}
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 w-full">
                <ContactForm />
              </div>

              {/* Right Column: Information Cards */}
              <div className="lg:col-span-5 w-full space-y-4">
                {CONTACT_INFO.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-[#121212] border border-white/10 p-5 sm:p-6 hover:border-white/20 transition-all flex items-start gap-4 shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white mb-0.5">{item.title}</h3>
                      <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{item.subtitle}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[#FF5500] hover:underline font-semibold text-xs sm:text-sm transition-colors break-all sm:break-normal inline-block"
                        >
                          {item.detail}
                        </a>
                      ) : (
                        <p className="text-zinc-200 font-semibold text-xs sm:text-sm">{item.detail}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* FAQ Help Quick Card */}
                <div className="rounded-2xl bg-gradient-to-br from-[#161616] to-[#121212] border border-[#FF5500]/30 p-5 sm:p-6 shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5500] block mb-1">
                    NEED ANSWERS FASTER?
                  </span>
                  <h3 className="text-base font-bold text-white mb-1.5">Check the Artist Help Center</h3>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Most common questions about credits, campaigns, SoundCloud OAuth, and Pro perks
                    are already answered in our Help Center.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/faq"
                      className="sc-pill-white px-4 py-2 text-xs font-bold"
                    >
                      Browse FAQ
                    </Link>
                    <Link
                      href="/help"
                      className="sc-pill-dark px-4 py-2 text-xs font-semibold"
                    >
                      Help Center
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM FINALE BANNER                                       */}
        {/* ========================================================= */}
        <section
          aria-label="Get Started"
          className="py-20 sm:py-28 bg-[#0A0A0A] border-t border-white/10 px-4 sm:px-6 relative text-center overflow-hidden"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5500]/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5500] block mb-4">
              READY TO SCALE YOUR MUSIC?
            </span>

            <h2 className="sc-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-6">
              CONNECT WITH <span className="text-[#FF5500]">SOUNDCLOUD.</span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 5,000+ verified musicians promoting their tracks organically through RepostChain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <a
                href="/api/auth/soundcloud/redirect"
                className="sc-pill-white w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-bold shadow-2xl shadow-white/10 justify-center"
              >
                <SoundCloudMark className="w-5 h-3.5" />
                <span>Connect with SoundCloud</span>
              </a>
              <Link
                href="/plan"
                className="sc-pill-dark w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold justify-center"
              >
                <span>View Creator Plans</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <PublicFooter />
    </div>
  );
}
