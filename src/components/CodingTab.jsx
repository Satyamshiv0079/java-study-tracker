import React from 'react';

export default function CodingTab({
  activeDay,
  dayData,
  completedDsa,
  handleMarkDsaDone,
  sandboxCode,
  setSandboxCode,
  handleGetReview,
  isReviewing,
  reviewOutput,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition hover:border-slate-700">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-xs text-indigo-400 font-mono">DAY {activeDay}</span>
              <h2 className="text-xl font-bold text-white mt-1">{dayData.dsa.title}</h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${
              dayData.dsa.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              dayData.dsa.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {dayData.dsa.difficulty.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{dayData.dsa.description}</p>
          <p className="text-xs text-slate-500 mt-4">Source: {dayData.dsa.platform}</p>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800">
          <button
            onClick={handleMarkDsaDone}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
              completedDsa.includes(activeDay)
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.2)]'
            }`}
          >
            {completedDsa.includes(activeDay) ? '✓ Marked as Completed' : 'Mark DSA Problem as Done'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col transition hover:border-slate-700">
        <h3 className="text-sm font-bold text-white mb-3 flex justify-between items-center">
          <span>Sandbox Editor (Java)</span>
          <button
            onClick={handleGetReview}
            disabled={isReviewing}
            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded shadow-[0_0_8px_rgba(13,148,136,0.3)] transition"
          >
            {isReviewing ? 'Analyzing...' : 'Ask AI to Review Logic'}
          </button>
        </h3>
        <textarea
          value={sandboxCode}
          onChange={(e) => setSandboxCode(e.target.value)}
          spellCheck="false"
          className="flex-1 w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:shadow-[0_0_8px_rgba(13,148,136,0.2)] rounded-lg p-4 text-xs text-emerald-400 font-mono focus:outline-none transition resize-none custom-scrollbar"
        />
        {reviewOutput && (
          <div className="mt-4 p-4 bg-slate-950 border border-teal-900/50 rounded-lg text-xs font-mono text-slate-300 overflow-y-auto max-h-48 custom-scrollbar">
            <p className="text-teal-400 font-bold mb-2">AI Review Output:</p>
            <div className="whitespace-pre-wrap">{reviewOutput}</div>
          </div>
        )}
      </div>
    </div>
  );
}
