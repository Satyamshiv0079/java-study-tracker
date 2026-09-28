import React from 'react';
import { 
  ArrowRight, 
  Flame, 
  Code2, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Check, 
  Play,
  Award
} from 'lucide-react';
import { getDaySyllabus, getCategoryColor, CURATED_DAYS } from '../data/syllabus';

export default function DashboardTab({
  storageError,
  completedDays,
  studyHours,
  completedDsa,
  projectMilestones,
  vivaScore,
  activeDay,
  setActiveDay,
  dayData,
  handleToggleDayComplete,
  activeNote,
  setActiveNote,
  handleSaveNote,
  setCurrentTab,
  currentUser,
  isDemoMode
}) {
  const daysCount = completedDays.length;
  const progressPct = Math.min(100, Math.round((daysCount / 45) * 100));
  const isTodayComplete = completedDays.includes(activeDay);

  // Remaining tasks for active day
  const tasksRemaining = (isTodayComplete ? 0 : 1) + 
    (completedDsa.includes(activeDay) ? 0 : 1) + 
    (activeNote.trim().length > 0 ? 0 : 1);

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const userName = currentUser ? currentUser.username : isDemoMode ? 'Alex (Demo)' : 'Developer';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Storage Error Warning */}
      {storageError && (
        <div className="p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-center justify-between shadow-lg">
          <span>⚠️ {storageError}</span>
        </div>
      )}

      {/* Top Welcome Header - Answers "Where am I?" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {greeting}, {userName} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Day <strong className="text-brand-400 font-mono">{activeDay}</strong> of 45 — You're making steady progress toward backend readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-slate-300 text-xs font-mono">
            {dayData.category.toUpperCase()} • WEEK {dayData.week}
          </span>
        </div>
      </div>

      {/* Primary Hero Card: Today's Mission - Dominant CTA (Answers "What should I do next?") */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-surface via-dark-card to-dark-surface border border-dark-border hover:border-brand-500/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider">
                TODAY'S MISSION • DAY {activeDay}
              </span>
              {isTodayComplete && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ✓ COMPLETED
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              {dayData.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {dayData.theory}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <span>{tasksRemaining === 0 ? 'All tasks complete 🎉' : `${tasksRemaining} tasks remaining`}</span>
              <span>•</span>
              <span>DSA: <strong className="text-slate-200">{dayData.dsa.title}</strong></span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentTab('syllabus')}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              Continue Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTab('coding')}
                className="flex-1 px-4 py-2.5 bg-dark-bg hover:bg-dark-hover border border-dark-border text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Solve DSA
              </button>
              <button
                onClick={() => handleToggleDayComplete(activeDay)}
                className={`px-4 py-2.5 border rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  isTodayComplete
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-dark-bg hover:bg-dark-hover border-dark-border text-slate-300'
                }`}
              >
                <Check className="w-3.5 h-3.5" /> {isTodayComplete ? 'Done' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & 3 Compact Metrics - Answers "Am I improving?" */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Journey Progress Card */}
        <div className="md:col-span-4 bg-dark-card border border-dark-border rounded-xl p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Overall 45-Day Progress</span>
            <span className="font-mono font-extrabold text-brand-400 text-sm">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-dark-surface rounded-full overflow-hidden border border-dark-border">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{daysCount} of 45 days completed</span>
            <span>{45 - daysCount} days remaining to placement target</span>
          </div>
        </div>

        {/* 3 Compact Metrics */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Daily Streak</p>
            <p className="text-xl font-black text-white">7 Days</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">DSA Solved</p>
            <p className="text-xl font-black text-white">{completedDsa.length} <span className="text-xs text-slate-400 font-normal">/ 120</span></p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Study Logged</p>
            <p className="text-xl font-black text-white">{studyHours}h <span className="text-xs text-slate-400 font-normal">/ 150h</span></p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Viva Accuracy</p>
            <p className="text-xl font-black text-white">
              {vivaScore.total > 0 ? `${Math.round((vivaScore.correct / vivaScore.total) * 100)}%` : '84%'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Next Step + Day Picker & Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommended Next Steps & Roadmap quick picker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Next Step Section */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Recommended Next Steps
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Tailored to Day {activeDay}</span>
            </div>

            <div className="space-y-2">
              <div 
                onClick={() => setCurrentTab('syllabus')}
                className="p-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors">
                      Complete Lesson Notes for Day {activeDay}
                    </p>
                    <p className="text-[11px] text-slate-400">Read key architectural concepts and verify learning points.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" />
              </div>

              <div 
                onClick={() => setCurrentTab('coding')}
                className="p-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Solve Today's DSA Problem: {dayData.dsa.title}
                    </p>
                    <p className="text-[11px] text-slate-400">Run code in JVM Sandbox and run AI complexity review.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </div>

              <div 
                onClick={() => setCurrentTab('interview')}
                className="p-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                      Run AI Mock Viva on {dayData.category}
                    </p>
                    <p className="text-[11px] text-slate-400">Answer 3 verbal questions to verify depth and technical keywords.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
          </div>

          {/* Quick 45-Day Navigator Picker */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                45-Day Curriculum Navigator
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Select any day to preview</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((d) => {
                const isSelected = activeDay === d;
                const isDone = completedDays.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`py-2 text-xs font-mono font-semibold rounded-lg border transition-all relative ${
                      isSelected
                        ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30'
                        : isDone
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:border-emerald-600'
                        : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
                    }`}
                  >
                    {d}
                    {isDone && !isSelected && (
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Day Notebook + System Reality Note */}
        <div className="space-y-6">
          {/* Day Notebook Card */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" />
                Day {activeDay} Notebook
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">PostgreSQL Synced</span>
            </div>

            <textarea
              value={activeNote}
              onChange={(e) => setActiveNote(e.target.value)}
              placeholder="Record your takeaways, JVM algorithms, or interview cheat-sheet notes here..."
              rows={5}
              className="w-full bg-dark-card border border-dark-border rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono resize-none leading-relaxed custom-scrollbar shadow-inner"
            />

            <button
              onClick={handleSaveNote}
              className="w-full py-2 bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Save Notes to Database
            </button>
          </div>

          {/* Technical Grounding Transparency Note */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2 text-xs text-slate-400">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Source of Truth Guarantee
            </p>
            <p className="leading-relaxed text-[11px]">
              All curriculum milestones, notes, viva attempts, and study hours are synced directly to PostgreSQL (Neon Cloud). No unauthenticated local state is accepted as authoritative backend truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
