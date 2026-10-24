'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Flame,
  UserCheck,
  ShieldAlert,
  Lock,
  Mail,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function TemporaryLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('artist@repostchain.com');
  const [password, setPassword] = useState('artist123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchRole(nextRole: 'user' | 'admin') {
    setRole(nextRole);
    setError(null);
    if (nextRole === 'admin') {
      setEmail('admin@repostchain.com');
      setPassword('admin123');
    } else {
      setEmail('artist@repostchain.com');
      setPassword('artist123');
    }
  }

  async function handleLogin(e: React.FormEvent, instant = false, targetRole = role) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: targetRole,
          email,
          password,
          instant,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        router.push(data.redirectUrl);
      }
    } catch {
      setError('Network error during login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Repost<span className="text-orange-500">Chain</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400">
            Temporary Local Login Portal (No Live SoundCloud Callback Required)
          </p>
        </div>

        {/* 1-Click Quick Access Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
            <Zap className="w-4 h-4" />
            <span>1-Click Instant Bypass (Recommended for Local Testing)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={(e) => handleLogin(e, true, 'user')}
              disabled={loading}
              className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enter User Portal</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleLogin(e, true, 'admin')}
              disabled={loading}
              className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>Enter Admin Center</span>
            </button>
          </div>
        </div>

        {/* Credentials Login Form */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => switchRole('user')}
              className={`py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                role === 'user'
                  ? 'bg-orange-500/15 text-orange-400 border-b-2 border-orange-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Artist / User Login</span>
            </button>

            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-orange-500/15 text-orange-400 border-b-2 border-orange-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          <form onSubmit={(e) => handleLogin(e, false, role)} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                {role === 'admin' ? 'Admin Email' : 'Artist Email or SoundCloud URN'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Pre-filled Temporary Credentials Helper Box */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-300">Temporary Credentials (Pre-filled):</p>
              {role === 'user' ? (
                <p>
                  Email: <code className="text-orange-400">artist@repostchain.com</code> • Password:{' '}
                  <code className="text-orange-400">artist123</code> (or any existing user email from
                  your MySQL `users` table)
                </p>
              ) : (
                <p>
                  Email: <code className="text-orange-400">admin@repostchain.com</code> • Password:{' '}
                  <code className="text-orange-400">admin123</code> (or any existing admin from your
                  MySQL `admins` table)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              <span>
                {loading
                  ? 'Signing in...'
                  : role === 'admin'
                  ? 'Sign In to Admin Dashboard'
                  : 'Sign In to User Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
