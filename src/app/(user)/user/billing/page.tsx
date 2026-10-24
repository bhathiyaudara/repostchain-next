'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Coins, ArrowUpRight, ArrowDownRight, Crown } from 'lucide-react';

export default function BillingPage() {
  const { data } = useQuery({
    queryKey: ['user-billing'],
    queryFn: async () => {
      const res = await fetch('/api/user/billing');
      if (!res.ok) throw new Error('Failed to load billing');
      return res.json();
    },
  });

  const transactions = data?.transactions || [];
  const credits = data?.balance ?? 250;

  return (
    <div className="p-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Credit History &amp; Billing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View your credit ledger, earned repost rewards, and subscription details.
          </p>
        </div>

        <Link
          href="/user/plans"
          className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium inline-flex items-center gap-2 w-fit"
        >
          <Crown className="w-4 h-4" />
          Upgrade Plan
        </Link>
      </div>

      {/* Balance Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Available Credit Balance</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">{credits} Credits</p>
        </div>
        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
          <Coins className="w-8 h-8" />
        </div>
      </div>

      {/* Credit Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Recent Credit Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {transactions.map(
                (tx: {
                  id: string;
                  description?: string;
                  calculation_type: number;
                  credits: number;
                  created_at?: string;
                }) => {
                  // Remember: calculation_type 0 = DEBIT (Add credits), 1 = CREDIT (Subtract credits)
                  const isAdd = tx.calculation_type === 0;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                        {tx.description || (isAdd ? 'Earned from Repost' : 'Spent on Campaign')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            isAdd
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-orange-500/10 text-orange-500'
                          }`}
                        >
                          {isAdd ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          {isAdd ? 'Earned' : 'Spent'}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 font-bold ${
                          isAdd ? 'text-green-500' : 'text-orange-500'
                        }`}
                      >
                        {isAdd ? '+' : '-'}
                        {Number(tx.credits).toFixed(0)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleDateString()
                          : 'Recent'}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
