'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate quick submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="rounded-3xl bg-[#121212] border border-white/10 p-8 sm:p-10 relative">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Send us a message
          </h2>
          <p className="text-xs text-zinc-400">Our artist support team answers every inquiry</p>
        </div>
      </div>

      {submitted ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF5500]/10 border-2 border-[#FF5500] flex items-center justify-center mx-auto mb-4 text-[#FF5500]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="sc-display text-2xl sm:text-3xl font-black text-white mb-2">
            MESSAGE SENT!
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
            Thank you for reaching out. A support specialist from Tunexa Limited will get back to
            you within 24–48 hours at <span className="text-white font-medium">{formData.email}</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
            className="sc-pill-dark px-7 py-3 text-sm font-semibold"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kai Rivers"
                className="w-full px-4 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] transition-colors text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="artist@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Topic / Subject
            </label>
            <select
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#FF5500] transition-colors text-sm"
            >
              <option value="" disabled>Select a topic...</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical & Campaign Support</option>
              <option value="billing">Billing & Subscriptions</option>
              <option value="account">SoundCloud OAuth / Account Issues</option>
              <option value="appeal">Appeal for Suspended Account</option>
              <option value="partnership">Partnership & Label Collaboration</option>
              <option value="feedback">Product Feedback & Suggestions</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your inquiry, track campaign, or question in detail..."
              className="w-full px-4 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sc-pill-orange w-full sm:w-auto px-9 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-[#FF5500]/15"
            >
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <span className="text-xs text-zinc-500">
              🔒 SSL Encrypted • Direct to Tunexa Limited Support
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
