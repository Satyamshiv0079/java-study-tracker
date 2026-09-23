import React from 'react';
import { User, Mail, ShieldCheck, Database, LogOut, X, CheckCircle, Calendar, Award } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, currentUser, onLogout, completedDays, studyHours, completedDsa }) {
  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {currentUser.username}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Account Active
          </span>
        </div>

        {/* Account Information Card */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.email || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <span className="text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Account ID:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">#{currentUser.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" /> Database:
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Neon PostgreSQL Cloud</span>
          </div>
        </div>

        {/* Progress Stats Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Course</span>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{completedDays.length}/45</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Study</span>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{studyHours} hrs</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">DSA</span>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{completedDsa.length}/120</span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Log Out Account
        </button>
      </div>
    </div>
  );
}
