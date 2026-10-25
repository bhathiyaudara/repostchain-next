'use client';

import { useState } from 'react';
import { PublicHeader, PublicFooter } from '@/components/public-layout';

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <PublicHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-400/10 border border-orange-500/20 mb-6">
            <span className="text-sm font-medium text-orange-500">Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Have questions or need support? We&apos;re here to help you succeed on your musical
            journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-zinc-400 mb-6">We&apos;ll get back to you within 24–48 hours.</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="artist@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      placeholder="Tell us about your question or feedback..."
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-orange-600 hover:from-[#ff6a1a] hover:to-orange-700 text-white font-semibold transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
              <p className="text-zinc-400 text-sm mb-3">
                Reach our artist support team directly by email:
              </p>
              <a
                href="mailto:support@repostchain.com"
                className="text-[#ff5500] hover:underline font-medium text-sm"
              >
                support@repostchain.com
              </a>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-2">Response Time</h3>
              <p className="text-zinc-400 text-sm">
                We respond to all artist inquiries within 24–48 hours on business days.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-2">Company</h3>
              <p className="text-zinc-400 text-sm">Operated by Tunexa Limited</p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
