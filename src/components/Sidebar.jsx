import React from 'react';
import {
  LayoutDashboard,
  Map,
  Code2,
  Mic2,
  FolderKanban,
  BarChart3,
  Trophy,
  Briefcase,
  Sparkles,
  LogOut,
  X,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({
  currentTab,
  onSelectTab,
  completedDays,
  currentUser,
  isDemoMode,
  isOpenMobile,
  onCloseMobile,
  onOpenProfile,
  onOpenAuth,
  onLogout
}) {
  const { theme, toggleTheme } = useTheme();

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
      ]
    },
    {
      title: 'LEARN',
      items: [
        { id: 'syllabus', label: 'Roadmap & Lessons', icon: Map, path: '/app/learn' },
      ]
    },
    {
      title: 'PRACTICE',
      items: [
        { id: 'coding', label: 'DSA & JVM Sandbox', icon: Code2, path: '/app/practice' },
      ]
    },
    {
      title: 'INTERVIEW',
      items: [
        { id: 'interview', label: 'Mock Interview & Viva', icon: Mic2, path: '/app/interview' },
      ]
    },
    {
      title: 'BUILD',
      items: [
        { id: 'project', label: 'Capstone Projects', icon: FolderKanban, path: '/app/projects' },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, path: '/app/analytics' },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/app/leaderboard' },
        { id: 'career', label: 'Career Hub & ATS', icon: Briefcase, path: '/app/career' },
      ]
    },
    {
      title: 'AI',
      items: [
        { id: 'mentor', label: 'AI Mentor', icon: Sparkles, path: '/app/ai', badge: 'Gemini' },
      ]
    }
  ];

  const daysCount = completedDays.length;
  const progressPct = Math.min(100, Math.round((daysCount / 45) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-dark-surface border-r border-dark-border flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:static'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div 
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  CodeMentor
                </span>
                {isDemoMode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">45-Day Backend Journey</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase ${
                          isActive 
                            ? 'bg-brand-800 text-brand-100' 
                            : 'bg-brand-950 text-brand-400 border border-brand-800/60'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: Progress + Account */}
        <div className="p-3 border-t border-dark-border space-y-3 bg-dark-bg/60">
          {/* 45-Day Progress Box */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">45-Day Journey</span>
              <span className="text-brand-400 font-mono font-bold text-xs">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden border border-dark-border">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{daysCount} / 45 days completed</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>

          {/* User Profile / Auth Action */}
          <div className="pt-1 flex items-center justify-between gap-2">
            {currentUser ? (
              <div 
                onClick={onOpenProfile}
                className="flex-1 flex items-center gap-2.5 p-2 rounded-xl hover:bg-dark-hover cursor-pointer transition-colors border border-transparent hover:border-dark-border truncate"
              >
                <div className="h-7 w-7 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
                </div>
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.username}</p>
                  <p className="text-[10px] text-slate-400 truncate">PostgreSQL Synced</p>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors text-center"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-dark-hover transition-colors shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser && (
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-dark-hover transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
