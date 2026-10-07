/**
 * Intelligent Cyber Bullying Detection
 * Main Application Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { FeedPage } from './pages/FeedPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { ResponsibleAIPage } from './pages/ResponsibleAIPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

type AuthView = 'landing' | 'login' | 'register';

const MainAppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch unread notifications count when user is logged in
  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('cyberdefense_token') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        const unread = data.notifications.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
          Initializing CyberDefense AI...
        </div>
      </div>
    );
  }

  // Not logged in -> Show Landing, Login, or Register
  if (!user) {
    if (authView === 'login') {
      return (
        <LoginPage
          onGoToRegister={() => setAuthView('register')}
          onGoToLanding={() => setAuthView('landing')}
          onSuccess={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'register') {
      return (
        <RegisterPage
          onGoToLogin={() => setAuthView('login')}
          onGoToLanding={() => setAuthView('landing')}
          onSuccess={() => setAuthView('landing')}
        />
      );
    }

    return (
      <LandingPage
        onGetStarted={() => setAuthView('register')}
        onGoToLogin={() => setAuthView('login')}
      />
    );
  }

  // Logged in -> Authenticated Application Layout
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Navigation Sidebar & Header */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        unreadCount={unreadCount}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
        {currentTab === 'home' && (
          <HomePage
            onNavigateToCheckText={() => setCurrentTab('home')}
            onNavigateToFeed={() => setCurrentTab('feed')}
            onNavigateToDashboard={() => setCurrentTab('admin')}
            onNavigateToAbout={() => setCurrentTab('responsible-ai')}
          />
        )}
        {currentTab === 'feed' && <FeedPage />}
        {currentTab === 'notifications' && (
          <NotificationsPage onRefreshUnread={fetchUnreadCount} />
        )}
        {currentTab === 'admin' && <AdminDashboardPage />}
        {currentTab === 'responsible-ai' && <ResponsibleAIPage />}
        {currentTab === 'profile' && <ProfilePage />}
        {currentTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
