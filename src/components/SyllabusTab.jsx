import React from 'react';
import { getDaySyllabus, getCategoryColor } from '../data/syllabus';
import { CheckCircle2, Circle, Sparkles, Video, ArrowRight, Code2 } from 'lucide-react';


export default function SyllabusTab({
  activeDay,
  setActiveDay,
  completedDays,
  handleToggleDayComplete,
  dayData,
  setCurrentTab,
}) {
  const isCompleted = completedDays.includes(activeDay);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {/* 45-Day Study Log List */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-4 h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-2 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            45-Day Roadmap
          </h3>
          <span className="text-[10px] font-mono text-brand-400 font-bold">
            {completedDays.length}/45
          </span>
        </div>

        <div className="space-y-1 flex-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((dayNum) => {
            const item = getDaySyllabus(dayNum);
            const done = completedDays.includes(dayNum);
            const isSelected = activeDay === dayNum;
            return (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-brand-600/20 border-brand-500 text-white font-semibold shadow-sm'
                    : 'bg-dark-card/60 border-dark-border text-slate-300 hover:bg-dark-hover hover:text-white'
                }`}
              >
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-brand-400 font-mono font-bold">
                    DAY {dayNum}
                  </span>
                  <span className="truncate text-slate-200 mt-0.5 font-medium">
                    {item.title}
                  </span>
                </div>
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Lesson Detail Content */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark-border pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border ${getCategoryColor(dayData.category)}`}>
                {dayData.category.toUpperCase()} • WEEK {dayData.week}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DSA: {dayData.dsa?.title || 'Practice'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('coding')}
                className="px-3 py-1.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                Open In Editor
              </button>

              <button
                onClick={() => handleToggleDayComplete(activeDay)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Day {activeDay}: {dayData.title}
            </h2>
            {dayData.isTemplate && (
              <p className="text-xs text-amber-300 bg-amber-950/30 border border-amber-900/60 rounded-xl px-3.5 py-2.5 mt-3">
                No hand-written notes for this day. Ask the AI Mentor for in-depth guidance on this architecture.
              </p>
            )}
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Learning Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {dayData.topics.map((t, idx) => (
                <div key={idx} className="bg-dark-card border border-dark-border rounded-xl p-3.5 flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Theory / Concept Explanation */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Theory & Architectural Notes
            </h3>
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
              {dayData.theory}
              {activeDay === 1 && (
                <div className="bg-dark-surface p-3.5 rounded-xl border border-dark-border mt-3 text-brand-300">
                  <p className="text-brand-400 mb-2 font-bold">// Stack vs Heap Memory</p>
                  {"   +-----------------------+     +-----------------------+\n"}
                  {"   |      STACK MEMORY     |     |      HEAP MEMORY      |\n"}
                  {"   +-----------------------+     +-----------------------+\n"}
                  {"   | int score = 45;       |     |                       |\n"}
                  {"   | Solution ref ----------|---->| { SolObject }         |\n"}
                  {"   +-----------------------+     +-----------------------+"}
                </div>
              )}
              {activeDay === 10 && (
                <div className="bg-dark-surface p-3.5 rounded-xl border border-dark-border mt-3 text-brand-300">
                  <p className="text-brand-400 mb-2 font-bold">// HashMap Bucket Hashing</p>
                  {"   Key.hashCode() ---> Hash Code ---> Index (Bucket)\n"}
                  {"   [0] -> null\n"}
                  {"   [1] -> Node{5,A} -> Node{21,B}  (separate chaining)\n"}
                  {"   [2] -> Red-Black Tree  (chain > 8 nodes, table >= 64)"}
                </div>
              )}
            </div>
          </div>

          {/* Video Reference */}
          {dayData.youtubeId && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                Video Walkthrough
              </h3>
              <div className="bg-dark-card border border-dark-border rounded-xl p-2 overflow-hidden aspect-video relative group">
                <iframe 
                  className="w-full h-full absolute top-0 left-0 rounded-lg"
                  src={`https://www.youtube.com/embed/${dayData.youtubeId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* AI Mentor Callout */}
          <div className="pt-4 border-t border-dark-border flex flex-col sm:flex-row justify-between gap-3 items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Need an interactive explanation of Day {activeDay}?
            </span>
            <button
              onClick={() => setCurrentTab('mentor')}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-brand-600/30"
            >
              Ask AI Mentor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
