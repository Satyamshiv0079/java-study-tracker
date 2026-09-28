import React from 'react';
import { User, Mail, ShieldCheck, Database, LogOut, X, CheckCircle2, Award, Clock, Code2 } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, currentUser, onLogout, completedDays, studyHours, completedDsa }) {
  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-6 sm:p-7 relative space-y-6 animate-command"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-brand-600 to-violet-500 text-white rounded-2xl shadow-lg shadow-brand-600/30">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {currentUser.username}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> ROLE_USER • Active Session
          </span>
        </div>

        {/* Account Information Card */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-dark-border/80 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-400" /> Email:
            </span>
            <span className="font-semibold text-slate-200">{currentUser.email || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between border-b border-dark-border/80 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Account ID:
            </span>
            <span className="font-semibold text-slate-200">#{currentUser.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Database:
            </span>
            <span className="font-semibold text-emerald-400">PostgreSQL (Neon Cloud)</span>
          </div>
        </div>

        {/* Progress Stats Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Curriculum</span>
            <span className="text-sm font-extrabold text-brand-400 font-mono">{completedDays.length}/45</span>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Study Time</span>
            <span className="text-sm font-extrabold text-cyan-400 font-mono">{studyHours} hrs</span>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">DSA Solved</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">{completedDsa.length}/120</span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/50 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Log Out of CodeMentor
        </button>
      </div>
    </div>
  );
}
