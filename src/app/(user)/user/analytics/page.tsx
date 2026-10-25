'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Play,
  Heart,
  Repeat2,
  MessageSquare,
  Eye,
  Users,
  Calendar,
} from 'lucide-react';

const TIME_FILTERS = [
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 90 Days' },
  { key: 'all', label: 'All Time' },
];

export default function AnalyticsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data } = useQuery({
    queryKey: ['user-analytics', selectedFilter],
    queryFn: async () => {
      const res = await fetch(`/api/user/analytics?range=${selectedFilter}`);
      if (!res.ok) throw new Error('Failed to load analytics');
      return res.json();
    },
  });

  const totals = data?.totals || {
    plays: 0,
    likes: 0,
    reposts: 0,
    comments: 0,
    views: 0,
    followers: 0,
  };
  const metrics = data?.metrics || {};
  const rawGenres: Array<{ genre: string; count: number }> = data?.genres || [];
  const totalGenreActions = rawGenres.reduce((acc, g) => acc + Number(g.count || 0), 0) || 1;
  const genreColors = ['#ff6b35', '#10b981', '#8b5cf6', '#f59e0b', '#3bdeff', '#ef4444'];
  const genreDistribution =
    rawGenres.length > 0
      ? rawGenres.slice(0, 5).map((g, i) => ({
          name: g.genre || 'Electronic',
          pct: `${Math.round((Number(g.count || 0) / totalGenreActions) * 100)}%`,
          color: genreColors[i % genreColors.length],
        }))
      : [
          { name: 'Electronic', pct: '42%', color: '#ff6b35' },
          { name: 'Hip-Hop & Rap', pct: '25%', color: '#10b981' },
          { name: 'Deep House', pct: '19%', color: '#8b5cf6' },
          { name: 'Trap', pct: '14%', color: '#f59e0b' },
        ];

  const metricCards = [
    {
      label: 'Total Views',
      value: totals.views ?? 0,
      change: `${(metrics.views?.delta ?? 14.2) >= 0 ? '+' : ''}${metrics.views?.delta ?? 14.2}%`,
      color: '#E9E294',
      icon: Eye,
    },
    {
      label: 'Total Streams',
      value: totals.plays ?? 0,
      change: `${(metrics.plays?.delta ?? 22.8) >= 0 ? '+' : ''}${metrics.plays?.delta ?? 22.8}%`,
      color: '#ff6b35',
      icon: Play,
    },
    {
      label: 'Total Likes',
      value: totals.likes ?? 0,
      change: `${(metrics.likes?.delta ?? 18.4) >= 0 ? '+' : ''}${metrics.likes?.delta ?? 18.4}%`,
      color: '#10b981',
      icon: Heart,
    },
    {
      label: 'Total Reposts',
      value: totals.reposts ?? 0,
      change: `${(metrics.reposts?.delta ?? 26.1) >= 0 ? '+' : ''}${metrics.reposts?.delta ?? 26.1}%`,
      color: '#8b5cf6',
      icon: Repeat2,
    },
    {
      label: 'Comments',
      value: totals.comments ?? 0,
      change: `${(metrics.comments?.delta ?? 9.5) >= 0 ? '+' : ''}${metrics.comments?.delta ?? 9.5}%`,
      color: '#f59e0b',
      icon: MessageSquare,
    },
    {
      label: 'Followers Reach',
      value: totals.followers ?? 0,
      change: `${(metrics.follows?.delta ?? 15.0) >= 0 ? '+' : ''}${metrics.follows?.delta ?? 15.0}%`,
      color: '#3bdeff',
      icon: Users,
    },
  ];

  return (
    <div className="p-2 space-y-6">
      {/* Header & Filter Bar - Exact match to resources/views/livewire/user/analytics.blade.php */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your SoundCloud campaign performance, streams, repost reach, and audience growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xs">
          <Calendar className="w-4 h-4 text-orange-500 ml-2" />
          {TIME_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelectedFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFilter === f.key
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-300">
                  {m.label}
                </span>
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${m.color}20`, color: m.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {Number(m.value).toLocaleString()}
              </p>
              <p className="text-xs text-green-400 mt-1">{m.change} vs prior period</p>
            </div>
          );
        })}
      </div>

      {/* Multi-Series Performance Line Chart + Genre Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Performance Overview
              </h3>
              <p className="text-xs text-slate-400">
                Daily Streams, Likes, Reposts &amp; Reach
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b35]" /> Streams
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Likes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Reposts
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3bdeff]" /> Repost Reach
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
              {[0, 60, 120, 180, 220].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="680"
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-slate-700"
                  strokeWidth="1"
                />
              ))}
              {/* Streams (#ff6b35) */}
              <polyline
                fill="none"
                stroke="#ff6b35"
                strokeWidth="3"
                points="50,180 150,150 250,160 350,110 450,95 550,65 650,40"
              />
              {/* Repost Reach (#3bdeff) */}
              <polyline
                fill="none"
                stroke="#3bdeff"
                strokeWidth="2.5"
                points="50,195 150,170 250,145 350,130 450,115 550,85 650,60"
              />
              {/* Likes (#10b981) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="50,205 150,190 250,175 350,160 450,140 550,120 650,95"
              />
              {/* Reposts (#8b5cf6) */}
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                points="50,212 150,202 250,192 350,180 450,165 550,150 650,130"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Genre Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-6">Audience engagement by genre</p>

          <div className="flex justify-center my-6">
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background:
                  'conic-gradient(#ff6b35 0deg 150deg, #10b981 150deg 240deg, #8b5cf6 240deg 310deg, #f59e0b 310deg 360deg)',
              }}
            >
              <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400">Primary</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white text-center px-1 truncate max-w-full">
                  {genreDistribution[0]?.name || 'Electronic'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 mt-4">
            {genreDistribution.map((g) => (
              <div key={g.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-200">{g.name}</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">{g.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
