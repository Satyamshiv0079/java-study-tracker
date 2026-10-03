import React from 'react';
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Mic2, 
  FolderKanban, 
  BarChart3, 
  Briefcase, 
  ShieldCheck, 
  Terminal,
  Flame,
  Zap
} from 'lucide-react';

export default function LandingTab({ onExploreDemo, onOpenAuth }) {
  const capabilities = [
    {
      icon: BookOpen,
      title: "Java & Spring Boot Roadmap",
      desc: "Structured 45-day journey from Java Core and Concurrency to Spring Boot 3.4 REST APIs and JPA."
    },
    {
      icon: Code2,
      title: "DSA & Coding Workspace",
      desc: "Live Java 17 execution sandbox powered by Piston JVM engine with instant O(N) complexity review."
    },
    {
      icon: Mic2,
      title: "AI Mock Interviews & Viva",
      desc: "Simulated verbal technical interviews with real-time accuracy scores, follow-ups, and missing keywords."
    },
    {
      icon: FolderKanban,
      title: "Capstone Project Tracking",
      desc: "Engineering Kanban milestones tracking production backend architecture and deployment."
    },
    {
      icon: Sparkles,
      title: "Curriculum-Grounded AI Mentor",
      desc: "Context-aware AI mentor with curriculum search and verified lesson citations powered by Gemini."
    },
    {
      icon: BarChart3,
      title: "Database-Backed Analytics",
      desc: "Live study session tracking, placement readiness heuristics, and transparent peer benchmarks."
    },
    {
      icon: Briefcase,
      title: "Career & ATS Resume Review",
      desc: "PDF resume parser with keyword analysis, bullet point rewrites, and recruiter LinkedIn optimization."
    },
    {
      icon: ShieldCheck,
      title: "Hardened Security Architecture",
      desc: "Spring Security 6, JWT, fail-fast cryptography, sliding-window rate limiting, and PostgreSQL persistence."
    }
  ];

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/30 text-brand-300 text-xs font-mono font-semibold tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          45-Day Java & Backend Engineering Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Master Java. Build Projects.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-teal-300">
            Get Interview Ready.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          A structured 45-day engineering journey for Java 17, Spring Boot 3.4, PostgreSQL, DSA, and backend system design. Everything you need to crack placement interviews in one unified workspace.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => onOpenAuth(false)}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="px-6 py-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-200 font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 text-brand-400 fill-current" />
            Explore Interactive Demo
          </button>
        </div>
      </section>

      {/* Interactive Dashboard Preview Banner (Prompt #4 requirement) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live System Preview</span>
          </div>
          <span className="text-xs text-brand-400 font-mono">Interactive Sample Telemetry</span>
        </div>

        {/* Dashboard Preview Mockup Card */}
        <div 
          onClick={onExploreDemo}
          className="bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 cursor-pointer hover:border-brand-500/50 transition-all group"
        >
          {/* Top Preview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
            <div>
              <p className="text-xs font-mono text-brand-400 uppercase font-semibold">Current Mission • Day 27 of 45</p>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-brand-300 transition-colors">
                Spring Security & JWT Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-1">Token lifecycle, filter chains, BCrypt hashing, and role-based access control.</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                ✓ Day In Progress (78%)
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); onExploreDemo(); }}
                className="px-4 py-2 bg-brand-600 group-hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                Launch Demo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">Curriculum Progress</p>
              <p className="text-xl font-black text-white">68%</p>
              <p className="text-[10px] text-brand-400 font-mono">27 / 45 days</p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">DSA Solved</p>
              <p className="text-xl font-black text-white">82</p>
              <p className="text-[10px] text-emerald-400 font-mono">42 Easy • 31 Med • 9 Hard</p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">Study Logged</p>
              <p className="text-xl font-black text-white">94.5h</p>
              <p className="text-[10px] text-cyan-400 font-mono">PostgreSQL session log</p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">Viva Interview Score</p>
              <p className="text-xl font-black text-emerald-400">84%</p>
              <p className="text-[10px] text-slate-400 font-mono">21 / 25 passed attempts</p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">Current Streak</p>
              <p className="text-xl font-black text-amber-400 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-current" /> 7 Days
              </p>
              <p className="text-[10px] text-amber-400/80 font-mono">Steady momentum</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-dark-card/60 rounded-xl p-3 border border-dark-border/60">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Next recommended: Practice Spring Security JWT Filter in DSA Sandbox
            </span>
            <span className="text-brand-300 font-semibold group-hover:underline flex items-center gap-1">
              Click anywhere to try interactive demo →
            </span>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Placement Success
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Eliminate fragmented tools. Master concepts, solve code, simulate technical interviews, and build real projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div 
                key={i} 
                className="bg-dark-surface border border-dark-border hover:border-brand-500/40 rounded-2xl p-5 space-y-3 transition-all hover:bg-dark-hover group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="bg-gradient-to-br from-dark-surface via-dark-card to-dark-surface border border-dark-border rounded-3xl p-8 sm:p-10 text-center space-y-5">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ready to Start Your 45-Day Backend Journey?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Create your free account to sync your progress permanently to the PostgreSQL database, or test drive the platform in interactive demo mode.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth(false)}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            Create Free Account <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExploreDemo}
            className="px-6 py-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-200 font-bold text-xs transition-all"
          >
            Try Interactive Demo
          </button>
        </div>
      </section>
    </div>
  );
}
