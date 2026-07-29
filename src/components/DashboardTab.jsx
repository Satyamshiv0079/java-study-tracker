import React from 'react';
import { getCategoryColor, CURATED_DAYS } from '../data/syllabus';

const StatCard = ({ label, value, pct, color, sub, highlight }) => (
  <div className={`bg-white dark:bg-slate-900 border rounded-xl p-5 relative overflow-hidden ${highlight ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-200 dark:border-slate-800'}`}>
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500/20`}>
      <div className={`h-full bg-${color}-500`} style={{ width: `${pct}%` }}></div>
    </div>
    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1 mt-1">{label}</p>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-black text-slate-900 dark:text-white">{value}</span>
    </div>
    <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-2">{sub}</p>
  </div>
);

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
}) {
  const daysPct = Math.round((completedDays.length / 45) * 100);
  const dsaTargetCount = 120;
  const dsaPct = Math.round((completedDsa.length / dsaTargetCount) * 100);
  const projectPct = Math.round((projectMilestones.filter((m) => m.done).length / projectMilestones.length) * 100);
  const mockScoreFactor = vivaScore.total > 0 ? (vivaScore.correct / vivaScore.total) * 40 : 0;
  const calculatedReadiness = Math.min(
    100,
    Math.round((completedDays.length / 45) * 30 + (completedDsa.length / 15) * 20 + (projectPct / 100) * 30 + mockScoreFactor)
  );

  return (
    <div className="space-y-6">
      {storageError && (
        <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-900 rounded-lg px-3 py-2">{storageError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Days Completed" value={`${completedDays.length} / 45`} pct={daysPct} color="indigo" sub="Course progress" />
        <StatCard label="Total Study Logged" value={`${studyHours} hrs`} pct={Math.min(100, (studyHours / 150) * 100)} color="teal" sub="Target: 150 hrs" />
        <StatCard label="DSA Problems Marked Done" value={`${completedDsa.length} / ${dsaTargetCount}`} pct={Math.max(2, dsaPct)} color="purple" sub="Self-reported, not verified" />
        <StatCard label="Placement Readiness (rough estimate)" value={`${calculatedReadiness}%`} pct={calculatedReadiness} color="emerald" sub="A heuristic, not a real score" highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative transition-all hover:border-slate-300 dark:border-slate-700 hover:shadow-lg hover:shadow-indigo-900/10">
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => handleToggleDayComplete(activeDay)} className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${completedDays.includes(activeDay) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-700'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${completedDays.includes(activeDay) ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' : 'bg-slate-500'}`}></span>
                {completedDays.includes(activeDay) ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border ${getCategoryColor(dayData.category)}`}>
                {dayData.category.toUpperCase()} • WEEK {dayData.week}
              </span>
              {dayData.isTemplate && (
                <span className="px-2 py-1 text-xs font-mono font-medium rounded-md border bg-red-900/30 text-red-300 border-red-700/50">
                  NO CONTENT YET
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-3 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">Day {activeDay}:</span> {dayData.title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">{dayData.theory}</p>

            <div className="mt-5 flex flex-wrap gap-2.5 mb-4">
              <button onClick={() => setCurrentTab('syllabus')} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 text-slate-900 dark:text-white text-xs font-bold transition-all">
                Browse Day Notes
              </button>
              <button onClick={() => setCurrentTab('coding')} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 hover:border-slate-400 dark:border-slate-600 border border-transparent text-slate-800 dark:text-slate-200 text-xs font-bold transition-all">
                Open DSA Practice
              </button>
            </div>
            
            {dayData.youtubeId && (
              <div className="mt-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden aspect-video relative group">
                <iframe 
                  className="w-full h-full absolute top-0 left-0"
                  src={`https://www.youtube.com/embed/${dayData.youtubeId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Pick a day</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`relative text-xs font-mono rounded-lg py-2 border transition-all ${
                    activeDay === d ? 'bg-indigo-600 border-indigo-500 text-slate-900 dark:text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' :
                    completedDays.includes(d) ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:border-emerald-600' :
                    'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {d}
                  {!CURATED_DAYS.has(d) && <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500" title="No curated content"></span>}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-3">Red dot = no hand-written lesson for that day yet (ask the AI Mentor to fill the gap, or add your own notes).</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition hover:border-slate-300 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Day {activeDay} Notebook</h3>
            <textarea
              value={activeNote}
              onChange={(e) => setActiveNote(e.target.value)}
              placeholder="Write self-notes, algorithms or cheat-sheet notes here..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:shadow-[0_0_8px_rgba(79,70,229,0.2)] rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono resize-none h-24 transition"
            />
            <button onClick={handleSaveNote} className="w-full mt-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold py-1.5 rounded transition border border-indigo-700/50 hover:shadow-[0_0_8px_rgba(79,70,229,0.2)]">
              Save Notes
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">What's real here vs. self-reported</p>
            <p>Days/DSA/hours are things <span className="text-slate-700 dark:text-slate-300">you</span> mark done - nothing verifies you actually did the work. The readiness % is a rough weighted heuristic, not a real assessment. The AI Mentor and code review genuinely call Claude. Treat this as a tracker + study aid, not a certification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
