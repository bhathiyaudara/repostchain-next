import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description:
    'Find answers to common questions about RepostChain, organic SoundCloud repost campaigns, credits, payments, refunds, and account security.',
  alternates: {
    canonical: '/faq',
  },
};

const FAQ_CATEGORIES = [
  {
    title: 'About RepostChain',
    items: [
      {
        q: 'What is RepostChain?',
        a: 'RepostChain is a platform created for music artists to grow their audience through organic reposts, networking, and collaboration. Artists can exchange reposts, build genuine engagement, and discover other musicians within their genre — all in one community-driven space.',
      },
      {
        q: 'Who can join RepostChain?',
        a: "RepostChain is for artists only — singers, producers, DJs, or music creators who share original content. If you're not an artist or share non-musical content, your account may be restricted.",
      },
      {
        q: 'Is RepostChain affiliated with SoundCloud or Spotify?',
        a: 'No. RepostChain is not affiliated with or endorsed by SoundCloud, Spotify, or any other streaming platform. We operate independently to help artists promote their music organically and responsibly.',
      },
    ],
  },
  {
    title: 'Using the Platform',
    items: [
      {
        q: 'How does RepostChain work?',
        a: 'You can create your artist profile, connect with other musicians, earn or use repost credits, and launch repost campaigns for your tracks. When others accept your campaign, they repost your music — and you can do the same to build visibility in return.',
      },
      {
        q: 'What are "credits"?',
        a: "Credits are the internal currency used on RepostChain to run campaigns. You earn credits by reposting other artists' tracks or purchase them to promote your own music faster.",
      },
      {
        q: 'Can I choose who reposts my track?',
        a: 'Yes! You have full control over your campaigns. You can target specific genres, artists, or follower levels to ensure your reposts come from the right audience.',
      },
      {
        q: 'Can I remove my repost after sharing?',
        a: 'Yes, but removing a repost after a campaign agreement may affect your reputation score or credit balance. We encourage all users to follow through on repost commitments.',
      },
    ],
  },
  {
    title: 'Payments and Refunds',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept major credit/debit cards and other secure online payment options through our third-party processors. All payments are encrypted and handled securely.',
      },
      {
        q: 'Can I get a refund if I change my mind?',
        a: 'Because RepostChain provides digital services, refunds are only available in limited situations — such as duplicate payments or system errors. Please read our full Refund & Cancellation Policy for details.',
      },
      {
        q: "What happens if my campaign doesn't perform well?",
        a: 'RepostChain guarantees organic exposure, not specific engagement numbers. Success depends on the audience, genre, and content quality — but our system ensures real artists and reposts, never bots.',
      },
    ],
  },
  {
    title: 'Account and Security',
    items: [
      {
        q: 'How do I reset my password?',
        a: 'RepostChain uses secure SoundCloud OAuth sign-in. If you cannot access your account, contact support@repostchain.com for assistance.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. You can request account deletion anytime by emailing support@repostchain.com. Once deleted, your data and credits will be permanently removed.',
      },
      {
        q: 'Why was my account suspended?',
        a: 'Accounts may be suspended for using bots or fake accounts, spamming or violating our Terms, or reposting copyrighted or explicit material. Please contact our support team if you believe your suspension was an error.',
      },
      {
        q: 'Do you store my payment information?',
        a: 'No. RepostChain does not store any credit card or payment details. All payments are securely processed by verified third-party payment gateways.',
      },
    ],
  },
  {
    title: 'General Information',
    items: [
      {
        q: 'Is RepostChain available worldwide?',
        a: 'Yes! Artists from all around the world can join and collaborate on RepostChain.',
      },
      {
        q: 'Can I promote multiple songs at once?',
        a: 'Yes. You can run multiple campaigns simultaneously — just make sure you have enough credits for each one.',
      },
      {
        q: 'How can I contact support?',
        a: 'For any inquiries, email us at support@repostchain.com. Our team typically responds within 24–48 hours on business days.',
      },
    ],
  },
];

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_STRUCTURED_DATA) }}
      />
      <PublicHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 max-w-5xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-400/10 border border-orange-500/20 mb-6">
            <span className="text-sm font-medium text-orange-500">Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-xl text-zinc-400 mb-2">
            Find answers to common questions about RepostChain
          </p>
          <p className="text-sm text-zinc-500">Last Updated: 10/09/2025</p>
        </div>

        {/* Help Box */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-800/50">
          <h2 className="text-lg font-semibold text-white mb-2">Need More Help?</h2>
          <p className="text-zinc-400 mb-3 text-sm sm:text-base">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="mailto:support@repostchain.com"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              support@repostchain.com
            </a>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Response time: 24-48 hours</span>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {FAQ_CATEGORIES.map((cat) => (
            <div key={cat.title} className="space-y-4">
              <h2 className="text-2xl font-bold text-white">{cat.title}</h2>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300"
                  >
                    <summary className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none">
                      <span className="text-base sm:text-lg font-semibold text-white pr-4 group-hover:text-orange-500 transition-colors">
                        {item.q}
                      </span>
                      <svg
                        className="w-5 h-5 text-zinc-400 shrink-0 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-zinc-300 leading-relaxed border-t border-zinc-800/50 pt-4 text-sm sm:text-base">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-400/5 border border-orange-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-zinc-400 mb-6">We&apos;re here to help you succeed on your musical journey</p>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
