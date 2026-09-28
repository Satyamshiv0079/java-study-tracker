import React from 'react';
import { LayoutDashboard, Map, Code2, Sparkles, User } from 'lucide-react';

export default function MobileNav({ currentTab, onSelectTab, onOpenProfile, onOpenAuth, currentUser }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Roadmap', icon: Map },
    { id: 'coding', label: 'DSA', icon: Code2 },
    { id: 'mentor', label: 'AI Mentor', icon: Sparkles },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-dark-surface/95 backdrop-blur-md border-t border-dark-border py-1.5 px-3 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={currentUser ? onOpenProfile : onOpenAuth}
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-[10px]">{currentUser ? 'Profile' : 'Sign In'}</span>
      </button>
    </div>
  );
}
