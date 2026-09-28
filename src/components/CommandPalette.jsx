import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Mic2, 
  FolderKanban, 
  BarChart3, 
  Trophy, 
  Briefcase, 
  Sparkles, 
  Play, 
  Clock, 
  X, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { CURATED_DAYS, getDaySyllabus } from '../data/syllabus';

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onToggleTimer,
  isTimerRunning,
  apiBase
}) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const defaultNavigationItems = [
    { id: 'dashboard', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, path: '/app/dashboard' },
    { id: 'roadmap', title: 'Open 45-Day Roadmap', category: 'Navigation', icon: BookOpen, path: '/app/learn' },
    { id: 'coding', title: 'Solve DSA Challenges & JVM Sandbox', category: 'Navigation', icon: Code2, path: '/app/practice' },
    { id: 'interview', title: 'Start AI Mock Technical Interview', category: 'Navigation', icon: Mic2, path: '/app/interview' },
    { id: 'projects', title: 'View Capstone Project Tracker', category: 'Navigation', icon: FolderKanban, path: '/app/projects' },
    { id: 'analytics', title: 'View Learning Analytics & Study Trends', category: 'Navigation', icon: BarChart3, path: '/app/analytics' },
    { id: 'leaderboard', title: 'Check Placement Leaderboard', category: 'Navigation', icon: Trophy, path: '/app/leaderboard' },
    { id: 'career', title: 'ATS Resume Review & Career Hub', category: 'Navigation', icon: Briefcase, path: '/app/career' },
    { id: 'mentor', title: 'Ask AI Backend Mentor', category: 'Navigation', icon: Sparkles, path: '/app/ai' },
  ];

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Live search query handling
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase().trim();

    // 1. Filter navigation items
    const matchedNav = defaultNavigationItems.filter(item => 
      item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );

    // 2. Filter curriculum days
    const matchedDays = [];
    for (let day = 1; day <= 45; day++) {
      const syllabus = getDaySyllabus(day);
      if (
        syllabus.title.toLowerCase().includes(q) ||
        syllabus.category.toLowerCase().includes(q) ||
        syllabus.dsa?.title.toLowerCase().includes(q) ||
        `day ${day}`.includes(q)
      ) {
        matchedDays.push({
          id: `day-${day}`,
          title: `Day ${day}: ${syllabus.title}`,
          subtitle: `${syllabus.category.toUpperCase()} • DSA: ${syllabus.dsa?.title || 'Practice'}`,
          category: 'Curriculum',
          icon: BookOpen,
          dayNumber: day,
          path: '/app/learn'
        });
      }
      if (matchedDays.length >= 6) break;
    }

    setSearchResults([...matchedNav, ...matchedDays]);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const total = (searchResults.length > 0 ? searchResults : defaultNavigationItems).length;
        setSelectedIndex(prev => (prev + 1) % total);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const total = (searchResults.length > 0 ? searchResults : defaultNavigationItems).length;
        setSelectedIndex(prev => (prev - 1 + total) % total);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentItems = searchResults.length > 0 ? searchResults : defaultNavigationItems;
        if (currentItems[selectedIndex]) {
          handleSelect(currentItems[selectedIndex]);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  const handleSelect = (item) => {
    if (item.dayNumber) {
      onNavigate(item.path, item.dayNumber);
    } else {
      onNavigate(item.path);
    }
    onClose();
  };

  if (!isOpen) return null;

  const displayedItems = searchResults.length > 0 ? searchResults : defaultNavigationItems;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden animate-command flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dark-border bg-dark-surface">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CodeMentor... (e.g. 'Day 27', 'Spring Security', 'DSA', 'Interview')"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/80 shrink-0">
            ESC
          </span>
        </div>

        {/* Quick Actions Header */}
        <div className="px-4 py-2 bg-dark-bg/60 border-b border-dark-border/60 flex items-center justify-between text-xs text-slate-400">
          <span>{query ? `Search results (${displayedItems.length})` : 'Quick Navigation & Actions'}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onToggleTimer(); onClose(); }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 transition-colors"
            >
              <Clock className="w-3 h-3 text-brand-400" />
              <span>{isTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {displayedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching pages or curriculum topics found for "{query}".
            </div>
          ) : (
            displayedItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-brand-600/15 border border-brand-500/40 text-white'
                      : 'text-slate-300 hover:bg-dark-hover border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-dark-surface text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-dark-bg text-slate-400 border border-dark-border">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-brand-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-dark-surface border-t border-dark-border text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-slate-400 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-slate-400 font-mono">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-slate-400 font-mono">↵</kbd> to select</span>
          </div>
          <span>CodeMentor Command Palette</span>
        </div>
      </div>
    </div>
  );
}
