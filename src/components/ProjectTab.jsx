import React, { useState } from 'react';
import { FolderKanban, CheckCircle2, Circle, Clock, Layers, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function ProjectTab({ projectMilestones, toggleMilestone }) {
  const [activeView, setActiveView] = useState('board'); // 'board' | 'checklist'
  const doneCount = projectMilestones.filter((m) => m.done).length;
  const projectPct = Math.round((doneCount / projectMilestones.length) * 100);

  const kanbanColumns = [
    {
      id: 'ideas',
      title: 'IDEAS & BACKLOG',
      color: 'border-slate-700/60',
      badge: 'bg-slate-800 text-slate-400',
      items: [
        { title: 'Distributed Rate Limiting (Redis)', desc: 'Transition from local sliding window to Redis cluster limiter', tag: 'Architecture' },
        { title: 'pgvector RAG Embeddings', desc: 'Semantic document vector storage in PostgreSQL Neon database', tag: 'AI/RAG' }
      ]
    },
    {
      id: 'building',
      title: 'BUILDING',
      color: 'border-brand-500/40',
      badge: 'bg-brand-950 text-brand-400 border border-brand-800/60',
      items: [
        { title: 'Spring Security 6 & JWT', desc: 'Custom 401/403 handlers and fail-fast startup cryptography', tag: 'Security', progress: '100%' },
        { title: 'React 18 & Vite UX Overhaul', desc: 'Command palette, keyboard shortcuts, and responsive sidebar', tag: 'Frontend', progress: '90%' }
      ]
    },
    {
      id: 'testing',
      title: 'TESTING & HARDENING',
      color: 'border-amber-500/40',
      badge: 'bg-amber-950 text-amber-400 border border-amber-800/60',
      items: [
        { title: 'User-Resource Isolation Tests', desc: 'Verifying User B cannot view User A study progress (8 tests)', tag: 'Tests', progress: '100%' },
        { title: 'Flyway Migration Baseline', desc: 'V1__init_schema.sql automated database migrations', tag: 'Database', progress: '100%' }
      ]
    },
    {
      id: 'completed',
      title: 'COMPLETED & LIVE',
      color: 'border-emerald-500/40',
      badge: 'bg-emerald-950 text-emerald-400 border border-emerald-800/60',
      items: [
        { title: 'PostgreSQL Domain Persistence', desc: 'All curriculum, DSA, notes, sessions saved to Neon Cloud', tag: 'Backend' },
        { title: 'Swagger / OpenAPI 3.0', desc: 'Interactive API docs with JWT Bearer scheme at /swagger-ui', tag: 'Docs' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider">
                ENGINEERING KANBAN & ARCHITECTURE
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              CodeMentor Capstone Project
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Production-grade Spring Boot 3.4 REST API + PostgreSQL backend paired with modern React frontend.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-1 rounded-xl">
            <button
              onClick={() => setActiveView('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'board' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveView('checklist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'checklist' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Milestone Checklist ({doneCount}/8)
            </button>
          </div>
        </div>

        {/* Overall Completion Progress */}
        <div className="space-y-2 pt-2 border-t border-dark-border">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Production Readiness Velocity</span>
            <span className="text-emerald-400 font-bold">{projectPct}% Completed</span>
          </div>
          <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden border border-dark-border">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${projectPct}%` }}
            />
          </div>
        </div>
      </div>

      {activeView === 'board' ? (
        /* Engineering Kanban Board (Prompt #15 requirement) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => (
            <div
              key={col.id}
              className={`bg-dark-surface border ${col.color} rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-sm`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <h3 className="text-xs font-bold text-slate-300 font-mono tracking-wider">
                    {col.title}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${col.badge}`}>
                    {col.items.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {col.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-dark-card border border-dark-border hover:border-brand-500/40 rounded-xl p-3.5 space-y-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-surface border border-dark-border text-slate-400 font-semibold">
                          {item.tag}
                        </span>
                        {item.progress && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {item.progress}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Interactive Milestone Checklist View */
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">
            Interactive Engineering Milestones (PostgreSQL Synced)
          </h3>
          <div className="space-y-2.5">
            {projectMilestones.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMilestone(m.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  m.done
                    ? 'bg-emerald-950/20 border-emerald-800/60 hover:bg-emerald-950/30'
                    : 'bg-dark-card border-dark-border hover:bg-dark-hover hover:border-brand-500/30'
                }`}
              >
                <div className={`mt-0.5 h-5 w-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                  m.done ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm' : 'bg-dark-surface border-dark-border'
                }`}>
                  {m.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${m.done ? 'text-emerald-300 line-through opacity-80' : 'text-slate-200'}`}>
                    {m.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    Milestone #{m.id} • {m.done ? 'Verified in database' : 'Pending verification'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
