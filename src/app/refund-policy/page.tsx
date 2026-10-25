import type { Metadata } from 'next';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description:
    'Review the Refund & Cancellation Policy for RepostChain credit packages, subscriptions, and promotional campaigns operated by Tunexa Limited.',
  alternates: {
    canonical: '/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
          Refund &amp; Cancellation Policy
        </h1>
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
              This Refund &amp; Cancellation Policy applies to all purchases, credit packages, and
              promotional services made on RepostChain, operated by Tunexa Limited.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              2. Refund Eligibility
            </h2>
            <p className="mb-3 font-medium text-white">Eligible for Refunds:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
              <li>You made a duplicate payment due to a technical error.</li>
              <li>
                Your purchase could not be delivered or activated due to a verified system issue on
                our end.
              </li>
              <li>You were incorrectly charged due to a billing or platform malfunction.</li>
            </ul>
            <p className="mb-3 font-medium text-white">Not Eligible for Refunds:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Repost credits or campaigns that have already been activated or used.</li>
              <li>Dissatisfaction with repost results or engagement levels.</li>
              <li>Violations of our Terms and Conditions or misuse of the platform.</li>
              <li>Change of mind after purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              3. Cancellation Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Users may cancel pending campaigns before they are approved or activated.</li>
              <li>Once a campaign begins or reposts are executed, it cannot be canceled or reversed.</li>
              <li>
                Subscription plans can be canceled anytime from your account settings and will apply
                from the next billing cycle.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">4. Refund Process</h2>
            <p>
              Contact us at{' '}
              <a
                href="mailto:support@repostchain.com"
                className="text-[#ff5500] hover:text-[#ff7733]"
              >
                support@repostchain.com
              </a>{' '}
              within 7 days of your transaction with your account email, transaction ID, and
              description of the issue. Approved refunds are processed within 7–10 business days.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
