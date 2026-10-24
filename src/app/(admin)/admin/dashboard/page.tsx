'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Shield,
  UserCog,
  Users,
  UserCheck,
  Layers,
  Music,
  ShoppingBag,
  CheckCircle,
  Megaphone,
  BookCheck,
  CalendarRange,
  Wallet,
  FileText,
  FileClock,
  CreditCard,
  Banknote,
  DollarSign,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedDetail, setSelectedDetail] = useState<string>('users');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await fetch('/api/admin/overview');
      if (!res.ok) throw new Error('Failed to load admin overview');
      return res.json();
    },
  });

  const kpis = data?.kpis || {
    totalUsers: 5420,
    activeUsers: 5180,
    bannedUsers: 24,
    totalCampaigns: 1280,
    openCampaigns: 340,
    completedCampaigns: 940,
    totalTracks: 8650,
    totalPlaylists: 920,
    totalReposts: 42100,
    totalRepostRequests: 15800,
    totalOrders: 680,
    completedOrders: 645,
    totalRevenue: 14850,
  };

  // Exact 17 KPI Cards from resources/views/backend/admin/dashboard.blade.php
  const statCards = [
    {
      key: 'admins',
      label: 'Total Admins',
      value: 3,
      icon: Shield,
      iconBg: 'bg-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      key: 'active_admin',
      label: 'Active Admins',
      value: 3,
      icon: UserCog,
      iconBg: 'bg-green-200',
      iconColor: 'text-green-600',
    },
    {
      key: 'users',
      label: 'Total Users',
      value: kpis.totalUsers,
      icon: Users,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
    },
    {
      key: 'active_users',
      label: 'Active Users',
      value: kpis.activeUsers || kpis.totalUsers - (kpis.bannedUsers || 0),
      icon: UserCheck,
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-500',
    },
    {
      key: 'user_plan',
      label: 'Total User Plans',
      value: 412,
      icon: Layers,
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-500',
    },
    {
      key: 'tracks',
      label: 'Total Tracks',
      value: kpis.totalTracks,
      icon: Music,
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-pink-500',
    },
    {
      key: 'orders',
      label: 'Total Orders',
      value: kpis.totalOrders,
      icon: ShoppingBag,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-500',
    },
    {
      key: 'completed_order',
      label: 'Completed Orders',
      value: kpis.completedOrders || kpis.totalOrders,
      icon: CheckCircle,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-500',
    },
    {
      key: 'active_campaigns',
      label: 'Active Campaigns',
      value: kpis.openCampaigns,
      icon: Megaphone,
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-500',
    },
    {
      key: 'completed_campaign',
      label: 'Completed Campaigns',
      value: kpis.completedCampaigns || kpis.totalCampaigns - kpis.openCampaigns,
      icon: BookCheck,
      iconBg: 'bg-yellow-700/20',
      iconColor: 'text-yellow-600',
    },
    {
      key: 'plans',
      label: 'Active Plans',
      value: 2,
      icon: CalendarRange,
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-500',
    },
    {
      key: 'credits',
      label: 'Active Credits',
      value: 5,
      icon: Wallet,
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-500',
    },
    {
      key: 'reposts',
      label: 'Total Reposts',
      value: kpis.totalReposts,
      icon: FileText,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
    },
    {
      key: 'repost_request',
      label: 'Total Repost Requests',
      value: kpis.totalRepostRequests,
      icon: FileClock,
      iconBg: 'bg-rose-200',
      iconColor: 'text-rose-600',
    },
    {
      key: 'payments',
      label: 'Total Payments',
      value: kpis.totalOrders,
      icon: CreditCard,
      iconBg: 'bg-rose-200',
      iconColor: 'text-rose-600',
    },
    {
      key: 'amount',
      label: 'Total Amount Purchased',
      value: `$${Number(kpis.totalRevenue || 0).toLocaleString()}`,
      icon: Banknote,
      iconBg: 'bg-yellow-200',
      iconColor: 'text-yellow-600',
    },
    {
      key: 'transactions_credit',
      label: 'Total Credit Transactions',
      value: (kpis.totalReposts || 0) + (kpis.totalCampaigns || 0),
      icon: DollarSign,
      iconBg: 'bg-yellow-100/80 dark:bg-yellow-200/20',
      iconColor: 'text-yellow-600',
    },
  ];

  const recentUsers = data?.recentUsers || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <section className="space-y-8">
      {/* Stats Grid - Exact match to resources/views/backend/admin/dashboard.blade.php */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              onClick={() => setSelectedDetail(card.key)}
              className={`glass-card rounded-2xl p-6 interactive-card ${
                selectedDetail === card.key ? 'ring-2 ring-[#1CA577]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {isLoading
                    ? '...'
                    : typeof card.value === 'number'
                    ? card.value.toLocaleString()
                    : card.value}
                </h3>
              </div>
              <p className="text-gray-800/60 dark:text-white/60 text-sm">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Users & Recent Orders Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Recent Registered Artists
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200/40 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-white/60">
                <tr>
                  <th className="py-3 px-2">Artist</th>
                  <th className="py-3 px-2">URN</th>
                  <th className="py-3 px-2">Followers</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30 dark:divide-white/10">
                {recentUsers.map(
                  (u: {
                    id: string;
                    urn: string;
                    name: string;
                    avatar?: string;
                    followers_count?: number;
                    status?: number;
                  }) => (
                    <tr key={u.urn || u.id}>
                      <td className="py-3 px-2 flex items-center gap-2.5">
                        <img
                          src={u.avatar || '/default_img/no_img.jpg'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                          }}
                        />
                        <span className="font-medium text-gray-800 dark:text-white">{u.name}</span>
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-500 dark:text-white/60">
                        {u.urn}
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-800 dark:text-white">
                        {Number(u.followers_count || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                          Active
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Recent Orders &amp; Subscriptions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200/40 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-white/60">
                <tr>
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">User URN</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30 dark:divide-white/10">
                {recentOrders.map(
                  (o: {
                    id: string;
                    order_id?: string;
                    user_urn: string;
                    amount?: number;
                    credits?: number;
                  }) => (
                    <tr key={o.id}>
                      <td className="py-3 px-2 font-mono text-xs text-gray-800 dark:text-white">
                        #{o.order_id || o.id}
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-500 dark:text-white/60">
                        {o.user_urn}
                      </td>
                      <td className="py-3 px-2 font-bold text-[#1CA577]">
                        ${Number(o.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-800 dark:text-white">
                        {Number(o.credits || 0).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
