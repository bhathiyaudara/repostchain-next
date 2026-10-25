import type { Metadata } from 'next';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Read the Terms and Conditions for RepostChain, operated by Tunexa Limited, governing organic SoundCloud music promotion and artist collaboration.',
  alternates: {
    canonical: '/terms-and-conditions',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
        <p className="text-zinc-400 mb-2">Effective Date: 10/09/2025</p>
        <p className="text-zinc-400 mb-2">Company Name: Tunexa Limited</p>
        <p className="text-zinc-400 mb-10">
          Email:{' '}
          <a href="mailto:support@repostchain.com" className="text-orange-500 hover:text-orange-400">
            support@repostchain.com
          </a>
        </p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to RepostChain, operated by Tunexa Limited (&ldquo;we,&rdquo; &ldquo;our,&rdquo;
              or &ldquo;us&rdquo;). By accessing or using our website and services, you agree to
              comply with and be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do
              not agree to these Terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">2. About RepostChain</h2>
            <p className="mb-3">
              RepostChain is a networking platform designed for music artists to connect,
              collaborate, and grow their audiences through organic repost campaigns, networking, and
              mutual sharing.
            </p>
            <p>
              Our platform is for artists only — if you are not a music artist or do not share
              original content, your account may be restricted or removed.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">3. Eligibility</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Be at least 18 years old or have parental/guardian consent.</li>
              <li>Be an artist, producer, or music creator with rights to the content you share.</li>
              <li>Agree to use the platform for legitimate promotional purposes only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">4. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-3">
              <li>Provide accurate and complete information.</li>
              <li>Keep your login credentials confidential.</li>
              <li>Take responsibility for all activity under your account.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate any account that violates these Terms or
              engages in suspicious, fraudulent, or abusive behavior.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">5. Use of the Platform</h2>
            <p className="mb-2">Users may:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
              <li>Exchange reposts and engage in mutual promotion.</li>
              <li>Communicate and collaborate with other artists.</li>
              <li>Use credits, coins, or similar systems to manage repost campaigns.</li>
            </ul>
            <p className="mb-2">Users may not:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use bots, fake accounts, or automation tools to manipulate engagement.</li>
              <li>Post copyrighted, stolen, or explicit content.</li>
              <li>Harass, spam, or mislead other users.</li>
              <li>Attempt to interfere with or exploit the platform&apos;s system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">6. Payments and Credits</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>All payments are processed securely through our payment partners.</li>
              <li>By purchasing, you agree to the pricing, billing, and refund terms listed at checkout.</li>
              <li>Refunds are handled in accordance with our Refund Policy.</li>
              <li>Credits or balances on your account are non-transferable and non-refundable unless required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">7. Intellectual Property</h2>
            <p>
              All content, branding, and functionality on RepostChain are the property of Tunexa
              Limited. Users retain ownership of their uploaded content but grant RepostChain a
              limited license to display and promote that content within the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              8. Third-Party Links and Integrations
            </h2>
            <p>
              RepostChain integrates with third-party platforms (such as SoundCloud) to provide
              promotional functionality. We are not affiliated with or endorsed by these platforms.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">9. Governing Law &amp; Contact</h2>
            <p className="mb-3">
              These Terms shall be governed by and interpreted under the laws of New Zealand.
            </p>
            <p>
              For any questions about these Terms, please contact us at{' '}
              <a
                href="mailto:support@repostchain.com"
                className="text-orange-500 hover:text-orange-400"
              >
                support@repostchain.com
              </a>{' '}
              (Tunexa Limited).
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
