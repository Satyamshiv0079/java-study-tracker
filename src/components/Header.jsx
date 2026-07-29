import React from 'react';

export default function Header({
  isTimerRunning,
  timerMode,
  timerSeconds,
  handleTimerControl,
  handleTimerReset,
  formatTime
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            45-Day Java Study Tracker
          </h1>
          <p className="text-xs text-indigo-400 font-mono">Backend & Full-Stack Prep</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
        <span className={`h-2.5 w-2.5 rounded-full ${isTimerRunning ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`}></span>
        <span className="font-mono text-sm tracking-wider font-semibold text-slate-200">
          {timerMode.toUpperCase()}: <span className="text-emerald-400">{formatTime(timerSeconds)}</span>
        </span>
        <button onClick={handleTimerControl} className={`ml-2 px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${isTimerRunning ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`}>
          {isTimerRunning ? 'Pause' : 'Start'}
        </button>
        <div className="flex gap-1 border-l border-slate-800 pl-2">
          <button onClick={() => handleTimerReset('pomodoro')} className="text-[10px] hover:text-white text-slate-400 bg-slate-800/40 hover:bg-slate-700 px-1.5 py-0.5 rounded transition">25m</button>
          <button onClick={() => handleTimerReset('study')} className="text-[10px] hover:text-white text-slate-400 bg-slate-800/40 hover:bg-slate-700 px-1.5 py-0.5 rounded transition">50m</button>
          <button onClick={() => handleTimerReset('break')} className="text-[10px] hover:text-white text-slate-400 bg-slate-800/40 hover:bg-slate-700 px-1.5 py-0.5 rounded transition">10m</button>
        </div>
      </div>
    </header>
  );
}
