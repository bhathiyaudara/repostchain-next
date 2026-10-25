import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Help Center — Guides & Artist Support',
  description:
    'Welcome to the RepostChain Help Center. Learn how to connect SoundCloud, launch repost campaigns, earn credits, and grow your fanbase organically.',
  alternates: {
    canonical: '/help',
  },
};

const HELP_SECTIONS = [
  {
    title: 'Introduction to RepostChain',
    articles: [
      {
        q: 'What is RepostChain?',
        a: 'RepostChain is a community-driven platform designed to help SoundCloud artists connect with a wider audience. Our mission is to provide you with the tools to organically grow your fanbase, increase engagement on your tracks, and network with other talented musicians.',
      },
      {
        q: 'How do I get started with RepostChain?',
        a: "Getting started is easy! Simply connect your SoundCloud account, and you'll be ready to start promoting your music in minutes. New members receive a welcome bonus of Credits to kickstart their promotional efforts.",
      },
      {
        q: 'What are the benefits of using RepostChain?',
        a: 'Organic Growth: Reach real listeners and build a genuine fanbase. • Increased Engagement: Get more plays, likes, comments, and reposts on your tracks. • Networking Opportunities: Connect and collaborate with other artists in our community. • Valuable Feedback: Receive constructive feedback on your music from fellow artists.',
      },
    ],
  },
  {
    title: 'Campaigns & Repost Exchanges',
    articles: [
      {
        q: 'How do I create a campaign?',
        a: 'Navigate to Campaigns in your artist dashboard, click Start a New Campaign, select one of your SoundCloud tracks, set your credit budget, and launch.',
      },
      {
        q: 'How do I earn more Repost Credits?',
        a: 'Browse active campaigns from other artists in your dashboard, listen to their tracks, and support the ones you enjoy by reposting or liking them on SoundCloud.',
      },
      {
        q: 'What are Direct Repost Requests?',
        a: 'Direct Repost Requests allow you to browse the Members directory, filter artists by genre, and pitch your track directly to a specific curator or artist.',
      },
    ],
  },
];

export default function PublicHelpPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="pt-20">
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border-b border-zinc-800/50">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-6xl">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
              RepostChain Help Center
            </h1>
            <p className="text-zinc-400">
              Guides, walkthroughs, and answers to help you grow your music career on RepostChain
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-8">
          {HELP_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6 space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white">{section.title}</h2>
              <div className="space-y-3">
                {section.articles.map((art) => (
                  <details
                    key={art.q}
                    className="group rounded-xl bg-zinc-800/30 border border-zinc-700/30 p-4"
                  >
                    <summary className="cursor-pointer font-medium text-white flex items-center justify-between list-none">
                      <span>{art.q}</span>
                      <span className="text-orange-500 text-sm group-open:rotate-90 transition-transform">
                        →
                      </span>
                    </summary>
                    <p className="text-zinc-300 text-sm leading-relaxed mt-3 pt-3 border-t border-zinc-700/30">
                      {art.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-gradient-to-r from-[#ff5500]/10 to-orange-600/10 border border-[#ff5500]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Need direct assistance?</h3>
              <p className="text-zinc-400 text-sm">
                Check our full FAQ or message our support team anytime.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/faq"
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium"
              >
                View FAQ
              </Link>
              <Link
                href="/contact-us"
                className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-orange-600 text-white text-sm font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
