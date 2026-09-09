import React from 'react';
import { Sparkles, Sun, Moon, FileText, Zap, RefreshCw, History, LogIn, LogOut } from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { useAuth } from '../context/useAuth';

export const Navbar = ({
  darkMode,
  setDarkMode,
  onSelectSample,
  onOpenBulletModal,
  onOpenHistory,
  onReset,
  apiConnected = true,
  historyCount = 0
}) => {
  const { user, logout, openLogin, openRegister } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                RESUMEUP
              </span>
              <span className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                apiConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                {apiConnected ? 'API Live' : 'Local Mode'}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Smart Resume & Job Fit Intelligence
            </p>
          </div>
        </div>

        {/* Quick Actions & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sample Resumes Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="hidden md:inline">Samples</span>
              <span className="md:hidden">Sample</span>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Select Sample Resume
              </div>
              {SAMPLE_RESUMES.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between transition"
                >
                  <span>{sample.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                    {sample.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition relative"
            title="View saved scans from MongoDB"
          >
            <History className="w-4 h-4 text-purple-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-indigo-600 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* AI Bullet Optimizer Button */}
          <button
            onClick={onOpenBulletModal}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-3 py-2 rounded-lg shadow-md hover:shadow-indigo-500/25 transition"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Bullet Optimizer</span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center space-x-2 pl-1 border-l border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 text-white flex items-center justify-center text-[11px] font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 max-w-[90px] truncate hidden md:inline">
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 pl-1 border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={openLogin}
                className="text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sign In</span>
              </button>
              <button
                onClick={openRegister}
                className="hidden sm:flex text-xs font-semibold text-white bg-gray-900 dark:bg-gray-750 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Clear and reset form"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
