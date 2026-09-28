import React, { useState } from 'react';
import { User, Lock, Mail, LogIn, UserPlus, X, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim() || (!isLogin && !email.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://java-study-tracker.onrender.com';
      const endpoint = isLogin ? `${API_BASE}/api/users/login` : `${API_BASE}/api/users/register`;
      const payload = isLogin ? { username, password } : { username, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(typeof data === 'string' ? data : data.message || 'Authentication failed. Please check credentials.');
      }

      // Success! Pass user object up
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || 'Server error. Make sure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  }

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

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-brand-600/20 border border-brand-500/40 text-brand-400 rounded-2xl mb-1 shadow-lg shadow-brand-500/10">
            {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isLogin ? 'Welcome Back to CodeMentor' : 'Create Your Free Account'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isLogin
              ? 'Log in with your credentials to sync learning progress with PostgreSQL'
              : 'Register to unlock persistent tracking, AI mentor, and mock vivas'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="satyam"
                className="w-full bg-dark-surface border border-dark-border text-slate-200 placeholder-slate-500 text-xs font-mono rounded-xl pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="satyam@example.com"
                  className="w-full bg-dark-surface border border-dark-border text-slate-200 placeholder-slate-500 text-xs font-mono rounded-xl pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-surface border border-dark-border text-slate-200 placeholder-slate-500 text-xs font-mono rounded-xl pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none focus:border-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center pt-2 border-t border-dark-border">
          <p className="text-xs text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-brand-400 font-bold hover:underline ml-1"
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
