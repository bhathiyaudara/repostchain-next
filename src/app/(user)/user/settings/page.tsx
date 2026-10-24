'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [repostAlerts, setRepostAlerts] = useState(true);
  const [acceptingRequests, setAcceptingRequests] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-2 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Settings &amp; Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your notification settings, genres, and repost request preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Accept Direct Repost Requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Allow other RepostChain members to send you direct repost requests.
              </p>
            </div>
            <input
              type="checkbox"
              checked={acceptingRequests}
              onChange={(e) => setAcceptingRequests(e.target.checked)}
              className="w-5 h-5 accent-orange-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Email Notifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive email updates when your campaigns receive reposts or complete.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 accent-orange-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Instant Repost Request Alerts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get notified immediately when an artist sends you a direct repost request.
              </p>
            </div>
            <input
              type="checkbox"
              checked={repostAlerts}
              onChange={(e) => setRepostAlerts(e.target.checked)}
              className="w-5 h-5 accent-orange-500 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm cursor-pointer"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
