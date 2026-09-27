import React from 'react';
import { Rocket, Sparkles, BookOpen, Code, Mic, ShieldCheck, BarChart2, Briefcase, Cpu, ArrowRight, CheckCircle2, Lock, Terminal } from 'lucide-react';

export default function LandingTab({ onExploreDemo, onOpenAuth, currentUser }) {
  const features = [
    {
      icon: BookOpen,
      title: "Structured 45-Day Curriculum",
      desc: "Step-by-step roadmap covering Java Core, OOP, Collections, Concurrency, JVM Internals, SQL, Spring Boot, Spring Security, and System Design.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Code,
      title: "Live JVM Execution & AI Review",
      desc: "Execute Java code in real-time via Piston sandbox engine. Get instant AI analysis on O(N) time and space complexity.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Mic,
      title: "AI Technical Mock Vivas",
      desc: "Interactive verbal Q&A simulator evaluating your responses across Java, Spring, SQL, and System Design with 1-10 scores & follow-ups.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Sparkles,
      title: "Grounded AI Mentor",
      desc: "Context-aware study assistant combining active user telemetry and curriculum topic knowledge powered by Gemini 2.5 Flash.",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Briefcase,
      title: "ATS Resume Analyzer & Career Hub",
      desc: "PDF resume upload parsing with compatibility scoring (0-100%), bullet point rewrites, and recruiter LinkedIn optimization templates.",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: BarChart2,
      title: "Analytics & Peer Benchmarks",
      desc: "Track study hours, DSA completion velocity, and compare progress against transparent placement community benchmarks.",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Java 17 • Spring Boot 3.4 • PostgreSQL • Gemini AI
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CodeMentor <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-teal-300">— 45-Day Java & Spring Boot Placement Platform</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
            A production-oriented full-stack learning platform designed for software engineers. Master Java, Spring Boot, DSA, and system architecture through a structured 45-day curriculum, live JVM execution, AI code reviews, and mock viva interviews.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreDemo}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Rocket className="w-4 h-4" />
              Explore Interactive Demo
            </button>

            {!currentUser ? (
              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-sm flex items-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                Sign In / Register
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Logged in as <strong>{currentUser.username}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Built for Real Backend Engineering
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need for job placement in one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Production Tech Stack & Security
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Spring Boot 3.4 • Spring Security 6 • BCrypt • JWT • PostgreSQL • React 18 • Docker
          </p>
        </div>

        <button
          onClick={onExploreDemo}
          className="px-5 py-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1.5 shrink-0"
        >
          Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
