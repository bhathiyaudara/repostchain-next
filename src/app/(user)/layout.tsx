'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Home,
  MessageSquare,
  Megaphone,
  Users,
  Repeat2,
  TrendingUp,
  Music,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Crown,
  Star,
  Sliders,
  Coins,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';

const SEARCH_SUGGESTIONS = [
  { name: 'Home / Dashboard', route: '/user/dashboard', description: 'Overview of your RepostChain activity' },
  { name: 'Collab Chat', route: '/user/chat', description: 'Chat with artists for collaboration' },
  { name: 'Campaigns', route: '/user/campaign-management/campaigns', description: 'Browse active repost campaigns and earn credits' },
  { name: 'Members', route: '/user/members', description: 'Browse and filter SoundCloud artists for direct requests' },
  { name: 'Requests', route: '/user/reposts-request', description: 'Manage incoming and outgoing direct repost requests' },
  { name: 'Charts', route: '/user/charts', description: 'Top trending tracks on RepostChain' },
  { name: 'My Campaigns', route: '/user/campaign-management/my-campaigns', description: 'Manage your submitted track and playlist campaigns' },
  { name: 'Analytics', route: '/user/analytics', description: 'Track your plays, likes, reposts, and followers' },
  { name: 'My Account', route: '/user/my-account', description: 'View your profile, tracks, playlists, and followers' },
  { name: 'Upgrade My Plan', route: '/user/plans', description: 'Compare Free and Pro membership plans' },
  { name: 'Add Credits / Billing', route: '/user/billing', description: 'Purchase credit packs or view transaction history' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session');
      return res.json();
    },
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['user-dashboard-summary'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return null;
      return res.json();
    },
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
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
    router.push('/');
    router.refresh();
  };

  const user = sessionData?.user || dashboardData?.user || {
    name: 'Demo SoundCloud Artist',
    urn: 'soundcloud:users:999001',
    avatar: '/default_img/no_img.jpg',
    planName: 'Free Plan',
  };

  const credits = dashboardData?.kpis?.availableCredits ?? user.credits ?? 250;
  const pendingRequestsCount = dashboardData?.pendingRequests?.length ?? 2;

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (href: string) => {
    if (href === '/user/dashboard') return pathname === '/user/dashboard';
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-800 dark:text-white flex flex-col">
      {/* Header - Exact match to resources/views/backend/user/layouts/partials/header.blade.php */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Left Side: Mobile Menu Button + Logo */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>

            <div className="w-72">
              <Link href="/" className="inline-block">
                <img
                  src="/assets/logo/rc-logo-black.png"
                  alt="RepostChain"
                  className="w-36 lg:w-48 object-contain dark:hidden"
                />
                <img
                  src="/assets/logo/rc-logo-white.png"
                  alt="RepostChain"
                  className="w-36 lg:w-48 object-contain hidden dark:block"
                />
              </Link>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-full max-w-md bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 text-left text-gray-500 dark:text-gray-300 hover:border-orange-500 dark:hover:border-orange-500 transition-colors duration-200 flex items-center space-x-3 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Search className="h-5 w-5 text-gray-400" />
                <span className="text-sm">Search...</span>
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              href="/user/plans"
              className="hidden sm:inline-block text-orange-500 hover:text-white hover:bg-orange-500 transition-colors duration-200 font-medium px-4 py-2 rounded-md text-sm"
            >
              Upgrade My Plan
            </Link>

            <a
              href="https://repostchain.com/blog"
              target="_blank"
              rel="noreferrer"
              className="hidden xl:inline-block text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium px-4 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              Blog
            </a>

            {/* Help Dropdown */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => {
                  setHelpOpen(!helpOpen);
                  setProfileOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer text-sm"
              >
                <span>Help</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    helpOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {helpOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-50">
                  <Link
                    href="/user/help"
                    onClick={() => setHelpOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-t-md"
                  >
                    Help Center
                  </Link>
                  <Link
                    href="/user/plans"
                    onClick={() => setHelpOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/user/faq"
                    onClick={() => setHelpOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-b-md"
                  >
                    FAQs
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                  setHelpOpen(false);
                }}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {pendingRequestsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800 dark:text-white">
                      Notifications
                    </span>
                    <Link
                      href="/user/reposts-request"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-orange-500 hover:underline"
                    >
                      View Requests
                    </Link>
                  </div>
                  <div className="p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    {pendingRequestsCount > 0 ? (
                      <Link
                        href="/user/reposts-request"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 text-xs"
                      >
                        You have <strong className="text-orange-500">{pendingRequestsCount}</strong>{' '}
                        incoming repost requests waiting for your response.
                      </Link>
                    ) : (
                      <p className="text-center text-xs text-gray-400 py-4">
                        No new notifications right now.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Light/Dark Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {darkMode ? (
                <Moon className="w-5 h-5 text-slate-700 dark:text-white" />
              ) : (
                <Sun className="w-5 h-5 text-slate-700 dark:text-white" />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setHelpOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.avatar || '/default_img/no_img.jpg'}
                    alt={user.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                    }}
                  />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-300 hidden sm:block" />
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-slate-700">
                  <div className="py-2">
                    <Link
                      href="/user/my-account"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        View Profile
                      </span>
                    </Link>

                    <Link
                      href="/user/plans"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <Crown className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                          Current Plan
                        </span>
                        <span className="text-sm font-semibold text-orange-500">
                          {user.planName || 'Free Plan'}
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/user/members"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <Star className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        Members you&apos;ve starred
                      </span>
                    </Link>

                    <Link
                      href="/user/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <Sliders className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        Settings &amp; Preferences
                      </span>
                    </Link>

                    <Link
                      href="/user/billing"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <Coins className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        Credit History
                      </span>
                    </Link>

                    <Link
                      href="/user/plans"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        My Subscription
                      </span>
                    </Link>

                    <div className="border-t border-gray-200 dark:border-slate-700 my-1" />

                    <Link
                      href="/login"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-orange-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Switch Account / Admin Portal
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-sm font-medium">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal - Exact match to header.blade.php */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-600 w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-slate-600">
              <div className="relative flex items-center">
                <Search className="h-6 w-6 text-gray-400 mr-3" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search pages and features..."
                  className="w-full py-2 text-lg bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
              {filteredSuggestions.map((item) => (
                <Link
                  key={item.route}
                  href={item.route}
                  onClick={() => setSearchOpen(false)}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
        />
      )}

      <div className="flex flex-1">
        {/* Sidebar - Exact match to resources/views/backend/user/layouts/partials/sidebar.blade.php */}
        <aside
          className={`fixed left-0 lg:top-18 top-15 z-20 w-64 lg:w-[15%] h-[calc(100vh-4.25rem)] bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 transform transition-transform duration-300 ease-in-out flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Profile - Exact match to livewire/user/sidebar-profile.blade.php */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-slate-700">
            <img
              className="w-12 h-12 rounded-full object-cover shrink-0"
              src={user.avatar || '/default_img/no_img.jpg'}
              alt={user.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
              }}
            />
            <div className="min-w-0">
              <Link
                href="/user/my-account"
                className="font-bold text-gray-700 dark:text-gray-200 text-sm truncate block hover:text-orange-500 transition-colors"
              >
                {user.name}
              </Link>
              <div className="flex items-center gap-1 mt-1">
                <img
                  className="w-5 h-5 object-contain"
                  src="/frontend/user/credit-icon.png"
                  alt="Credits"
                />
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {credits} Credits
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 md:p-4 space-y-1 flex-1 overflow-y-auto">
            <Link
              href="/user/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                isActive('/user/dashboard')
                  ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Home className="w-5 h-5 shrink-0" />
              <span>Home</span>
            </Link>

            <Link
              href="/user/chat"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                isActive('/user/chat')
                  ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              <span>Collab Chat</span>
            </Link>

            <Link
              href="/user/campaign-management/campaigns"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                isActive('/user/campaign-management/campaigns')
                  ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Megaphone className="w-5 h-5 shrink-0" />
              <span>Campaigns</span>
            </Link>

            <Link
              href="/user/members"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                isActive('/user/members')
                  ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>Members</span>
            </Link>

            <Link
              href="/user/reposts-request"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                isActive('/user/reposts-request')
                  ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Repeat2 className="w-5 h-5 shrink-0" />
              <span>Requests</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                {pendingRequestsCount}
              </span>
            </Link>

            <Link
              href="/user/charts"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                isActive('/user/charts')
                  ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-5 h-5 shrink-0" />
              <span>Charts</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-slate-700 my-4" />

            {/* My Account Section */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                My Account
              </p>

              <Link
                href="/user/campaign-management/my-campaigns"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                  isActive('/user/campaign-management/my-campaigns')
                    ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Music className="w-5 h-5 shrink-0" />
                <span>My Campaigns</span>
              </Link>

              <Link
                href="/user/analytics"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                  isActive('/user/analytics')
                    ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <BarChart3 className="w-5 h-5 shrink-0" />
                <span>Analytics</span>
              </Link>

              <Link
                href="/user/my-account"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                  isActive('/user/my-account')
                    ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <User className="w-5 h-5 shrink-0" />
                <span>My Account</span>
              </Link>

              <Link
                href="/user/settings"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                  isActive('/user/settings')
                    ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span>Settings</span>
              </Link>

              <Link
                href="/user/help"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl text-sm transition-colors ${
                  isActive('/user/help')
                    ? 'bg-slate-100 dark:bg-slate-700 text-orange-500 font-medium border-l-3 border-orange-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span>Help &amp; Support</span>
              </Link>
            </div>
          </nav>

          {/* Bottom Premium Plan Card - Pinned to bottom */}
          <div className="p-3 md:p-4 mt-auto">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 md:p-4 text-white shadow">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-xs md:text-sm">Premium Plan</span>
              </div>
              <p className="text-xs text-orange-100 mb-3 leading-relaxed">
                Get unlimited reposts and priority support.
              </p>
              <Link
                href="/user/plans"
                className="w-full block text-center bg-white text-orange-600 font-medium py-1.5 px-3 rounded text-xs hover:bg-gray-100 transition-colors"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 ml-auto lg:w-[calc(100%-15%)]">
          <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-64px)]">{children}</main>
        </div>
      </div>
    </div>
  );
}
