import React from 'react';

export default function ProjectTab({ projectMilestones, toggleMilestone }) {
  const projectPct = Math.round((projectMilestones.filter((m) => m.done).length / projectMilestones.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition hover:border-slate-300 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Capstone Project Tracker</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">A real-world project is crucial. Build a Spring Boot REST API for a task tracker, paired with a React frontend.</p>

        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-mono mb-2">
            <span>Project Completion</span>
            <span className="text-emerald-400">{projectPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500" style={{ width: `${projectPct}%` }}></div>
          </div>
        </div>

        <div className="space-y-3">
          {projectMilestones.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-4 hover:shadow-md ${
                m.done
                  ? 'bg-emerald-950/20 border-emerald-900/50 hover:bg-emerald-950/30'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:bg-slate-800/50 hover:border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className={`mt-0.5 h-5 w-5 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
                m.done ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
              }`}>
                {m.done && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div>
                <p className={`text-sm font-medium ${m.done ? 'text-emerald-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>{m.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
