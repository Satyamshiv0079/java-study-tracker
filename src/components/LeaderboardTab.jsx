import React from 'react';
import { Trophy, Award, Flame, Star, CheckCircle, Clock, Code, ShieldCheck } from 'lucide-react';

export default function LeaderboardTab({ completedDays, studyHours, completedDsa }) {
  // Demo Leaderboard entries featuring user + top community learners
  const communityUsers = [
    {
      rank: 1,
      name: "Satyam Shiv (You)",
      isUser: true,
      daysCompleted: completedDays.length,
      studyHours: studyHours,
      dsaSolved: completedDsa.length,
      badge: "Java Master",
      avatar: "🚀"
    },
    {
      rank: 2,
      name: "Aarav Sharma",
      isUser: false,
      daysCompleted: 38,
      studyHours: 112,
      dsaSolved: 95,
      badge: "Spring Architect",
      avatar: "☕"
    },
    {
      rank: 3,
      name: "Priya Patel",
      isUser: false,
      daysCompleted: 32,
      studyHours: 94,
      dsaSolved: 80,
      badge: "Backend Lead",
      avatar: "💻"
    },
    {
      rank: 4,
      name: "Rohan Verma",
      isUser: false,
      daysCompleted: 27,
      studyHours: 78,
      dsaSolved: 65,
      badge: "DSA Warrior",
      avatar: "🔥"
    },
    {
      rank: 5,
      name: "Ananya Gupta",
      isUser: false,
      daysCompleted: 21,
      studyHours: 62,
      dsaSolved: 50,
      badge: "SQL Expert",
      avatar: "🐘"
    }
  ];

  // Sort by Days Completed descending
  const sortedUsers = [...communityUsers].sort((a, b) => b.daysCompleted - a.daysCompleted);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs tracking-wider uppercase mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            Global Placement Community Leaderboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Top Student Developers
          </h1>
          <p className="text-amber-200 text-sm mt-1 max-w-2xl">
            Rankings based on verified Java course completion, logged study hours, and solved DSA LeetCode challenges.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-amber-500/30">
          <Flame className="w-8 h-8 text-amber-500 shrink-0" />
          <div>
            <span className="text-[11px] text-amber-300 uppercase font-bold block">Your Current Streak</span>
            <span className="text-lg font-extrabold text-white">{completedDays.length} Days Active</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Live Rankings
          </h3>
          <span className="text-xs font-mono text-slate-500">Updated in real-time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-mono text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Rank</th>
                <th className="py-3.5 px-4 font-bold">Developer</th>
                <th className="py-3.5 px-4 font-bold text-center">Days Done</th>
                <th className="py-3.5 px-4 font-bold text-center">Study Hours</th>
                <th className="py-3.5 px-4 font-bold text-center">DSA Solved</th>
                <th className="py-3.5 px-4 font-bold text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {sortedUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    user.isUser
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 font-bold text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <td className="py-4 px-4 font-mono font-bold text-sm">
                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                  </td>
                  <td className="py-4 px-4 flex items-center gap-2.5">
                    <span className="text-lg">{user.avatar}</span>
                    <span className="font-bold">{user.name}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg font-mono font-bold">
                      {user.daysCompleted} / 45
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                    {user.studyHours} hrs
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                    {user.dsaSolved} / 120
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-full">
                      {user.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
