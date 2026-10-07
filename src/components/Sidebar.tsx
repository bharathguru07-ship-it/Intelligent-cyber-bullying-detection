import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Home,
  MessageSquare,
  Instagram,
  Bell,
  BookOpen,
  User as UserIcon,
  Settings,
  LogOut,
  Sun,
  Moon,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'feed'
  | 'notifications'
  | 'admin'
  | 'responsible-ai'
  | 'profile'
  | 'settings';

interface Props {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<Props> = ({ currentTab, setCurrentTab, unreadCount = 0 }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home / Detection', icon: <Home className="w-5 h-5" /> },
    { id: 'feed', label: 'Cyber Safety Feed', icon: <Instagram className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount },
    { id: 'admin', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'responsible-ai', label: 'About / Safety', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-[#E2E8F0] dark:border-slate-800 bg-[#F1F5F9] dark:bg-slate-900/90 backdrop-blur-md h-screen sticky top-0 p-4 justify-between z-30">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 px-2 py-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                CyberDefense AI
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
                Multilingual Moderation
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/30 dark:bg-indigo-500'
                      : 'text-[#475569] dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-[#64748B] dark:text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & User session */}
        <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] dark:text-slate-400">
              {theme === 'dark' ? '☀️ Active' : '🌙 Active'}
            </span>
          </button>

          {/* User mini card */}
          {user && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700/60 shadow-2xs">
              <div
                onClick={() => setCurrentTab('profile')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
              >
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {user.full_name}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">
                    @{user.username}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#F1F5F9]/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-slate-100">CyberDefense AI</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#475569] dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          {user && (
            <button onClick={() => setCurrentTab('profile')} className="p-1">
              <img src={user.avatar_url} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#F1F5F9]/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 p-1 ${currentTab === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-[#64748B] dark:text-slate-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('feed')}
          className={`flex flex-col items-center gap-1 p-1 ${currentTab === 'feed' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-[#64748B] dark:text-slate-400'}`}
        >
          <Instagram className="w-5 h-5" />
          <span className="text-[10px]">Feed</span>
        </button>

        <button
          onClick={() => setCurrentTab('admin')}
          className={`flex flex-col items-center gap-1 p-1 ${currentTab === 'admin' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-[#64748B] dark:text-slate-400'}`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('responsible-ai')}
          className={`flex flex-col items-center gap-1 p-1 ${currentTab === 'responsible-ai' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-[#64748B] dark:text-slate-400'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">About</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center gap-1 p-1 ${currentTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-[#64748B] dark:text-slate-400'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </>
  );
};
