import React from 'react';
import { getDaySyllabus, getCategoryColor } from '../data/syllabus';

export default function SyllabusTab({
  activeDay,
  setActiveDay,
  completedDays,
  handleToggleDayComplete,
  dayData,
  setCurrentTab,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 h-[calc(100vh-14rem)] overflow-y-auto flex flex-col gap-2.5 custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest px-2 mb-2">45-Day Study Log</h3>
        <div className="space-y-1.5 flex-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((dayNum) => {
            const item = getDaySyllabus(dayNum);
            const isCompleted = completedDays.includes(dayNum);
            return (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                className={`w-full text-left p-2 rounded-lg border transition-all text-xs flex items-center justify-between gap-2 hover:border-slate-300 dark:border-slate-700 ${
                  activeDay === dayNum
                    ? 'bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white font-semibold shadow-[0_0_8px_rgba(79,70,229,0.3)]'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-indigo-400 font-mono">DAY {dayNum}{item.isTemplate ? ' · template' : ''}</span>
                  <span className="truncate text-slate-800 dark:text-slate-200 mt-0.5">{item.title}</span>
                </div>
                {isCompleted ? (
                  <span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                ) : (
                  <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 flex-shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition hover:border-slate-300 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border ${getCategoryColor(dayData.category)}`}>
              {dayData.category.toUpperCase()}
            </span>
            <button
              onClick={() => handleToggleDayComplete(activeDay)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                completedDays.includes(activeDay)
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-700 hover:text-slate-900 dark:text-white'
              }`}
            >
              {completedDays.includes(activeDay) ? '✓ Completed' : 'Mark Day Completed'}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Day {activeDay}: {dayData.title}</h2>
          {dayData.isTemplate && (
            <p className="text-xs text-red-300 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2 mt-3">
              No real lesson has been written for this day. Go to the AI Mentor tab and ask it to teach you this topic properly.
            </p>
          )}

          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-5 mb-2.5">Learning objectives:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {dayData.topics.map((t, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3 flex items-start gap-2.5 transition hover:border-slate-300 dark:border-slate-700">
                <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono text-[10px] mt-0.5">{idx + 1}</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{t}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-6 mb-2">Theory:</h3>
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg p-4 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {dayData.theory}
            {activeDay === 1 && (
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 mt-3">
                <p className="text-indigo-400 mb-2">// Stack vs Heap</p>
                {"   +-----------------------+     +-----------------------+\n"}
                {"   |      STACK MEMORY     |     |      HEAP MEMORY      |\n"}
                {"   +-----------------------+     +-----------------------+\n"}
                {"   | int score = 45;       |     |                       |\n"}
                {"   | Solution ref ----------|---->| { SolObject }         |\n"}
                {"   +-----------------------+     +-----------------------+"}
              </div>
            )}
            {activeDay === 10 && (
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 mt-3">
                <p className="text-indigo-400 mb-2">// HashMap Bucket Hashing</p>
                {"   Key.hashCode() ---> Hash Code ---> Index (Bucket)\n"}
                {"   [0] -> null\n"}
                {"   [1] -> Node{5,A} -> Node{21,B}  (separate chaining)\n"}
                {"   [2] -> Red-Black Tree  (chain > 8 nodes, table >= 64)"}
              </div>
            )}
          </div>

          {/* YouTube Video Panel */}
          {dayData.youtubeId && (
            <>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-6 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video Reference:
              </h3>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2 overflow-hidden aspect-video relative group">
                <iframe 
                  className="w-full h-full absolute top-0 left-0"
                  src={`https://www.youtube.com/embed/${dayData.youtubeId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </>
          )}

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-4 items-center">
            <div className="text-xs text-slate-600 dark:text-slate-400">Need this explained properly? Ask the real AI Mentor.</div>
            <button
              onClick={() => setCurrentTab('mentor')}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-bold text-xs transition shadow-[0_0_10px_rgba(79,70,229,0.2)]"
            >
              Open Mentor Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
