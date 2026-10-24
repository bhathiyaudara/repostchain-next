'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Megaphone,
  ShoppingCart,
  Rocket,
  DollarSign,
  Settings,
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronRight,
  ChevronDown,
  LogOut,
  Shield,
} from 'lucide-react';

interface NavGroup {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: { name: string; tab: string }[];
  singleTab?: string;
}

const ADMIN_NAV: NavGroup[] = [
  { name: 'Dashboard', icon: LayoutDashboard, singleTab: 'dashboard' },
  {
    name: 'Admin Management',
    icon: Shield,
    items: [
      { name: 'Admin', tab: 'admins' },
      { name: 'Role', tab: 'roles' },
      { name: 'Permission', tab: 'permissions' },
    ],
  },
  {
    name: 'User Management',
    icon: Users,
    items: [
      { name: 'Users', tab: 'users' },
      { name: 'Banned Users', tab: 'banned_users' },
      { name: 'Referrals', tab: 'referrals' },
      { name: 'User Plan', tab: 'user_plan' },
    ],
  },
  {
    name: 'Package Management',
    icon: CreditCard,
    items: [
      { name: 'Features', tab: 'features' },
      { name: 'Plans', tab: 'plans' },
      { name: 'Credit', tab: 'credits' },
    ],
  },
  {
    name: 'Campaign Management',
    icon: Megaphone,
    items: [{ name: 'Campaigns', tab: 'active_campaigns' }],
  },
  {
    name: 'Order Management',
    icon: ShoppingCart,
    items: [{ name: 'Orders', tab: 'orders' }],
  },
  {
    name: 'Repost Request Tracking',
    icon: Rocket,
    items: [
      { name: 'Repost Request', tab: 'repost_request' },
      { name: 'Repost', tab: 'reposts' },
    ],
  },
  { name: 'Payments', icon: DollarSign, singleTab: 'payments' },
  { name: 'Credit Transactions', icon: CreditCard, singleTab: 'transactions_credit' },
  {
    name: 'Settings',
    icon: Settings,
    items: [
      { name: 'User Settings', tab: 'settings' },
      { name: 'General Settings', tab: 'settings' },
      { name: 'Payment Gateway Setup', tab: 'settings' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    'User Management': true,
    'Campaign Management': true,
  });
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session');
      return res.json();
    },
  });

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
    try {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    } catch {}
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const subText =
    hour < 12
      ? "Here's what's happening this morning"
      : hour < 17
      ? "Here's what's happening this afternoon"
      : "Here's what's happening tonight";

  const adminName = sessionData?.user?.name || 'Super Admin';

  return (
    <div className="animated-bg overflow-x-hidden min-h-screen text-slate-800 dark:text-white">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 glass-card lg:hidden"
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar - Exact match to resources/views/backend/admin/layouts/partials/side-bar.blade.php */}
        <aside
          className={`transition-all duration-300 ease-in-out z-50 max-h-screen py-2 pl-2 ${
            sidebarExpanded ? 'w-72' : 'w-20'
          } ${
            mobileMenuOpen
              ? 'fixed top-0 left-0 h-full w-72 translate-x-0'
              : 'hidden lg:block'
          }`}
        >
          <div className="sidebar-glass-card h-full custom-scrollbar rounded-xl overflow-y-auto flex flex-col">
            {/* Sidebar Header */}
            <Link
              href="/admin/dashboard"
              className="p-3 border-b border-gray-200/40 dark:border-white/10 inline-block"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 glass-card shadow bg-white dark:bg-black p-1.5 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src="/assets/favicons/fav icon 1.svg"
                    alt="RepostChain"
                    className="w-full h-full dark:hidden"
                  />
                  <img
                    src="/assets/favicons/fav icon 2 (1).svg"
                    alt="RepostChain"
                    className="w-full h-full hidden dark:block"
                  />
                </div>
                {sidebarExpanded && (
                  <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                      Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-white/60 text-sm">Dashboard Pro</p>
                  </div>
                )}
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="p-2 space-y-1.5 flex-1">
              {ADMIN_NAV.map((group) => {
                const Icon = group.icon;
                const isOpen = !!openDropdowns[group.name];

                if (group.singleTab) {
                  return (
                    <Link
                      key={group.name}
                      href="/admin/dashboard"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        group.singleTab === 'dashboard'
                          ? 'bg-[#1CA577]/15 text-[#1CA577] border-l-3 border-[#1CA577]'
                          : 'text-slate-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {sidebarExpanded && <span>{group.name}</span>}
                    </Link>
                  );
                }

                return (
                  <div key={group.name}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdowns((prev) => ({
                          ...prev,
                          [group.name]: !prev[group.name],
                        }))
                      }
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 shrink-0" />
                        {sidebarExpanded && <span>{group.name}</span>}
                      </div>
                      {sidebarExpanded && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {sidebarExpanded && isOpen && group.items && (
                      <div className="pl-9 pr-2 py-1 space-y-1">
                        {group.items.map((sub) => (
                          <Link
                            key={sub.name}
                            href={`/admin/dashboard?section=${sub.tab}`}
                            className="block px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-white/70 hover:text-[#1CA577] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col custom-scrollbar overflow-y-auto">
          {/* Header - Exact match to resources/views/backend/admin/layouts/partials/header.blade.php */}
          <header className="sticky top-0 z-30 pt-2 px-2">
            <div className="glass-card rounded-xl">
              <div className="flex items-center justify-between p-4 lg:p-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.innerWidth >= 1024) {
                        setSidebarExpanded(!sidebarExpanded);
                      } else {
                        setMobileMenuOpen(!mobileMenuOpen);
                      }
                    }}
                    className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 dark:text-white text-slate-800 transition-all duration-200 cursor-pointer"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  <div className="hidden sm:block">
                    <h1 className="text-xl lg:text-2xl font-bold dark:text-white text-slate-800">
                      {greeting}, {adminName}!
                    </h1>
                    <p className="text-slate-500 dark:text-white/60 text-sm">{subText}</p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3">
                  <Link
                    href="/user/dashboard"
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1CA577]/15 text-[#1CA577] hover:bg-[#1CA577]/25 transition-colors"
                  >
                    User Dashboard →
                  </Link>

                  {/* Theme Toggle */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Toggle theme"
                  >
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-slate-800 dark:text-white" />
                    ) : (
                      <Sun className="w-5 h-5 text-slate-800 dark:text-white" />
                    )}
                  </button>

                  {/* Notifications */}
                  <button
                    type="button"
                    className="relative p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-slate-800 dark:text-white" />
                  </button>

                  {/* Profile */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 cursor-pointer"
                    >
                      <img
                        src="/default_img/no_img.jpg"
                        alt="Admin"
                        className="object-cover w-full h-full"
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-48 glass-card bg-white dark:bg-[#26292F] rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-white/10">
                        <Link
                          href="/login"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          Switch Account
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="px-4 lg:px-6 pb-4">
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60">
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-slate-800 dark:text-white capitalize">Dashboard</span>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6">
            <div className="mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
