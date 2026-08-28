import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Radio,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NotificationsDrawer } from './NotificationsDrawer';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const {
    currentUser,
    currentRole,
    loginAs,
    logout,
    isDarkMode,
    toggleDarkMode,
    setIsSearchOpen,
    alerts,
    isGpsSimulating,
    toggleGpsSimulation,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        {/* Left Side: Mobile Hamburger & Search */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-sidebar"
            onClick={toggleMobileSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search Bar */}
          <button
            id="btn-global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs sm:text-sm w-44 sm:w-64 md:w-80 transition-all text-left shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Search fleet, trips, tons...</span>
            <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Telemetry Status pill */}
          <button
            id="btn-gps-telemetry-toggle"
            onClick={toggleGpsSimulation}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.2 rounded-full text-xs font-medium border transition-all ${
              isGpsSimulating
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}
            title="Toggle simulated GPS live ping"
          >
            <span className={`w-2 h-2 rounded-full ${isGpsSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <Radio className="w-3.5 h-3.5" />
            <span>{isGpsSimulating ? 'Live Telemetry: Active' : 'Telemetry Paused'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <button
            id="btn-notifications-toggle"
            onClick={() => setIsAlertsOpen(true)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              id="btn-user-profile-menu"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {currentRole === 'admin' ? 'Fleet Director' : currentRole === 'manager' ? 'Ops Manager' : 'Driver'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentUser?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Shield className="w-3 h-3" /> Role: {currentRole.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Quick Role Switch
                  </div>
                  <button
                    onClick={() => {
                      loginAs('admin');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      currentRole === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Admin (Owner / Director)</span>
                    {currentRole === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      loginAs('manager');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      currentRole === 'manager'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Operations Manager</span>
                    {currentRole === 'manager' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      loginAs('driver');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      currentRole === 'driver'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Driver View (TN 38 AB 4521)</span>
                    {currentRole === 'driver' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 px-2 pt-1.5">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationsDrawer isOpen={isAlertsOpen} onClose={() => setIsAlertsOpen(false)} />
    </>
  );
};
