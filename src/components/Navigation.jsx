import React from 'react';

export default function Navigation({ currentTab, setCurrentTab }) {
  const tabs = [
    ['dashboard', 'Dashboard'],
    ['syllabus', 'Syllabus & Notes'],
    ['coding', 'DSA Practice'],
    ['interview', 'Mock Vivas'],
    ['project', 'Project Tracker'],
    ['analytics', 'Analytics'],
    ['leaderboard', 'Leaderboard'],
    ['career', 'Career Hub'],
    ['mentor', 'AI Mentor']
  ];

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 px-4 overflow-x-auto flex gap-1 custom-scrollbar transition-colors duration-200">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setCurrentTab(key)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            currentTab === key
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-white bg-slate-100 dark:bg-slate-800/50 shadow-[inset_0_-2px_8px_rgba(79,70,229,0.1)] dark:shadow-[inset_0_-2px_8px_rgba(79,70,229,0.2)]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
