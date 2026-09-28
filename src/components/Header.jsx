import React from 'react';
import { Menu, Search, Clock, Play, Pause, RotateCcw, User, LogIn, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  isTimerRunning,
  timerMode,
  timerSeconds,
  handleTimerControl,
  handleTimerReset,
  formatTime,
  currentUser,
  isDemoMode,
  onOpenAuth,
  onOpenProfile,
  onOpenCommandPalette,
  onOpenMobileMenu
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-dark-border bg-dark-surface/90 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Breadcrumb / Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover lg:hidden"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Palette Trigger Search Input */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-400 text-xs transition-colors w-64 md:w-80 justify-between group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
            <span className="truncate">Search topics, lessons, DSA...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-surface text-slate-400 border border-dark-border shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Timer, Demo indicator, Theme, Account */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-hover"
          title="Search (Ctrl + K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Pomodoro Timer Bar */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-xl px-2.5 py-1 text-xs">
          <span className={`h-2 w-2 rounded-full ${isTimerRunning ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="font-mono font-semibold text-slate-200 hidden md:inline">
            {timerMode.toUpperCase()}:
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {formatTime(timerSeconds)}
          </span>
          <button
            onClick={handleTimerControl}
            className={`p-1 rounded-lg transition-colors ${
              isTimerRunning
                ? 'text-amber-400 hover:bg-amber-500/10'
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
            title={isTimerRunning ? 'Pause' : 'Start'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <div className="hidden lg:flex items-center gap-1 border-l border-dark-border pl-1.5">
            <button
              onClick={() => handleTimerReset('pomodoro')}
              className={`text-[10px] px-1 rounded transition-colors ${timerMode === 'pomodoro' ? 'text-brand-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              25m
            </button>
            <button
              onClick={() => handleTimerReset('study')}
              className={`text-[10px] px-1 rounded transition-colors ${timerMode === 'study' ? 'text-brand-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              50m
            </button>
            <button
              onClick={() => handleTimerReset('break')}
              className={`text-[10px] px-1 rounded transition-colors ${timerMode === 'break' ? 'text-brand-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              10m
            </button>
          </div>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && !currentUser && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" /> Demo
          </span>
        )}

        {/* User Account Button */}
        {currentUser ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-xl text-xs font-semibold text-slate-200 transition-colors"
          >
            <div className="h-6 w-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-[11px]">
              {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline">{currentUser.username}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-brand-600/30"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
