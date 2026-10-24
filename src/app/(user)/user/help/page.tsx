'use client';

import { HelpCircle, Mail, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I earn credits on RepostChain?',
    a: 'Go to the Campaigns page, listen to any active track for at least 15 seconds, and click the orange Repost button. Credits are immediately credited to your balance.',
  },
  {
    q: 'How do I start a new campaign?',
    a: 'Click "+ Start a new campaign" on your Dashboard or Campaigns page, select a SoundCloud track or playlist, choose your credit budget, and launch.',
  },
  {
    q: 'What is the difference between Campaigns and Direct Repost Requests?',
    a: 'Campaigns appear in the public feed for any artist to repost, whereas Direct Requests let you invite a specific member from the Members directory to repost your track.',
  },
];

export default function HelpPage() {
  return (
    <div className="p-2 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          Help &amp; Support
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Frequently asked questions and artist support resources.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <Mail className="w-6 h-6 text-orange-500 mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white">Email Support</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
            Reach out to our artist support team anytime.
          </p>
          <a
            href="mailto:support@repostchain.com"
            className="text-sm font-medium text-orange-500 hover:underline"
          >
            support@repostchain.com
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <MessageCircle className="w-6 h-6 text-orange-500 mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white">Artist Community</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
            Connect with fellow producers in Collab Chat.
          </p>
          <a href="/user/chat" className="text-sm font-medium text-orange-500 hover:underline">
            Open Collab Chat →
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {FAQS.map((item) => (
            <div key={item.q} className="py-4">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-white">{item.q}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
