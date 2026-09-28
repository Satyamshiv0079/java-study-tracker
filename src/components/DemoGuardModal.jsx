import React from 'react';
import { Lock, X, ArrowRight, ShieldCheck, Database, Sparkles } from 'lucide-react';

export default function DemoGuardModal({ isOpen, onClose, onOpenAuth }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-6 relative space-y-5 animate-command"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-brand-600/20 border border-brand-500/40 text-brand-400 rounded-2xl mb-1 shadow-lg shadow-brand-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Create an Account to Continue
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            You are currently exploring CodeMentor in <strong>Interactive Demo Mode</strong> with sample telemetry. Create a free account or sign in to persist your progress to the PostgreSQL database.
          </p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400">
            <Database className="w-4 h-4 shrink-0" />
            <span>Full PostgreSQL synchronization for curriculum & DSA</span>
          </div>
          <div className="flex items-center gap-2 text-brand-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Unlimited AI mentor & mock interview evaluations</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Isolated user credentials & personal placement telemetry</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenAuth(true); // login
            }}
            className="w-full py-2.5 bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenAuth(false); // register
            }}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            Create Account <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
