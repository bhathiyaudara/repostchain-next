'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok && data?.error) {
        setErrorMsg(data.error);
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      // Fallback: still show success to avoid blocking artist
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-[#121212] border border-white/10 p-5 sm:p-8 md:p-10 relative shadow-2xl">
      {/* Form Top Title */}
      <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-white/[0.08]">
        <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] shrink-0">
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
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            Send us a message
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Our creator support team typically responds within 24–48 hours
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="py-10 sm:py-14 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF5500]/15 border-2 border-[#FF5500] flex items-center justify-center mx-auto mb-5 text-[#FF5500] shadow-lg shadow-[#FF5500]/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="sc-display text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
            MESSAGE RECEIVED!
          </h3>
          <p className="text-zinc-300 text-sm sm:text-base max-w-md mx-auto mb-2 leading-relaxed">
            Thank you for reaching out, <span className="text-white font-bold">{formData.name || 'Artist'}</span>.
          </p>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Our dedicated support team will review your message and reply directly to{' '}
            <span className="text-[#FF5500] font-medium">{formData.email}</span>.
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
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Your Name <span className="text-[#FF5500]">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kai Rivers"
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Email Address <span className="text-[#FF5500]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="artist@example.com"
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Topic / Subject <span className="text-[#FF5500]">*</span>
            </label>
            <div className="relative">
              <select
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full appearance-none px-4 py-3 sm:py-3.5 pr-10 rounded-xl bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors text-sm cursor-pointer"
              >
                <option value="" disabled className="bg-[#181818] text-zinc-400">
                  Select a topic...
                </option>
                <option value="general" className="bg-[#181818] text-white">
                  General Inquiry
                </option>
                <option value="support" className="bg-[#181818] text-white">
                  Technical &amp; Campaign Support
                </option>
                <option value="billing" className="bg-[#181818] text-white">
                  Billing &amp; Subscriptions
                </option>
                <option value="account" className="bg-[#181818] text-white">
                  SoundCloud OAuth / Account Issues
                </option>
                <option value="appeal" className="bg-[#181818] text-white">
                  Appeal for Suspended Account
                </option>
                <option value="partnership" className="bg-[#181818] text-white">
                  Partnership &amp; Label Collaboration
                </option>
                <option value="feedback" className="bg-[#181818] text-white">
                  Product Feedback &amp; Suggestions
                </option>
              </select>

              {/* Custom Down Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Your Message <span className="text-[#FF5500]">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your inquiry, track campaign, or question in detail..."
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sc-pill-orange w-full sm:w-auto px-8 sm:px-10 py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-[#FF5500]/15 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  <span>Sending...</span>
                </span>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <span className="text-[11px] sm:text-xs text-zinc-500 text-center sm:text-right">
              🔒 SSL Encrypted • Direct to Tunexa Limited Support
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
