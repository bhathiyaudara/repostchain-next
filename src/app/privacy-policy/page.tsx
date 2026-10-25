import type { Metadata } from 'next';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how RepostChain (operated by Tunexa Limited) collects, uses, and protects your personal information when using our SoundCloud music promotion platform.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-400 mb-2">Effective Date: 10/09/2025</p>
        <p className="text-zinc-400 mb-2">Company Name: Tunexa Limited</p>
        <p className="text-zinc-400 mb-10">
          Email:{' '}
          <a href="mailto:support@repostchain.com" className="text-[#ff5500] hover:text-[#ff7733]">
            support@repostchain.com
          </a>
        </p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to RepostChain, operated by Tunexa Limited. Your privacy is important to us.
              This Privacy Policy explains how we collect, use, and protect your personal
              information when you visit or use our website and related services.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Full name or display name and SoundCloud profile information</li>
              <li>Email address and communication preferences</li>
              <li>Track links, repost campaign activity, and genre preferences</li>
              <li>Payment details (processed securely by third-party payment providers)</li>
              <li>Cookies and session authentication tokens</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-3">
              <li>Operate, maintain, and improve our platform</li>
              <li>Process transactions and manage your artist account</li>
              <li>Facilitate repost and networking activities between artists</li>
              <li>Send important service notifications and updates</li>
              <li>Detect, prevent, and address fraud or abuse</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              4. Data Retention &amp; Your Rights
            </h2>
            <p>
              We retain your personal data only as long as necessary to provide our services and
              comply with legal obligations. You may request access, update, or deletion of your
              account or data anytime by contacting{' '}
              <a
                href="mailto:support@repostchain.com"
                className="text-[#ff5500] hover:text-[#ff7733]"
              >
                support@repostchain.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              5. Cookies &amp; Security
            </h2>
            <p>
              RepostChain uses secure HTTP-only cookies to keep you signed in and remember your
              preferences. We implement reasonable technical and organizational measures to protect
              your data from unauthorized access, loss, or misuse.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
