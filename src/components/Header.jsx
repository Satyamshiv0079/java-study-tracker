import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  isTimerRunning,
  timerMode,
  timerSeconds,
  handleTimerControl,
  handleTimerReset,
  formatTime,
  currentUser,
  onOpenAuth,
  onOpenProfile
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            45-Day Java Study Tracker
          </h1>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">Backend & Full-Stack Prep</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Account / Auth Button */}
        <button
          onClick={currentUser ? onOpenProfile : onOpenAuth}
          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          {currentUser ? currentUser.username : 'Log In / Sign Up'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-inner transition-colors duration-200">
          <span className={`h-2.5 w-2.5 rounded-full ${isTimerRunning ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-400 dark:bg-slate-600'}`}></span>
          <span className="font-mono text-sm tracking-wider font-semibold text-slate-700 dark:text-slate-200">
            {timerMode.toUpperCase()}: <span className="text-emerald-600 dark:text-emerald-400">{formatTime(timerSeconds)}</span>
          </span>
          <button onClick={handleTimerControl} className={`ml-2 px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${isTimerRunning ? 'bg-amber-100 dark:bg-amber-600/30 hover:bg-amber-200 dark:hover:bg-amber-600/50 text-amber-700 dark:text-amber-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`}>
            {isTimerRunning ? 'Pause' : 'Start'}
          </button>
          <div className="flex gap-1 border-l border-slate-300 dark:border-slate-800 pl-2">
            <button onClick={() => handleTimerReset('pomodoro')} className="text-[10px] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-800/40 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded transition">25m</button>
            <button onClick={() => handleTimerReset('study')} className="text-[10px] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-800/40 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded transition">50m</button>
            <button onClick={() => handleTimerReset('break')} className="text-[10px] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-800/40 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded transition">10m</button>
          </div>
        </div>
      </div>
    </header>
  );
}
