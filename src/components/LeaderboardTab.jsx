import React, { useState, useEffect } from 'react';
import { Trophy, Award, Flame, Star, CheckCircle, Clock, Code, ShieldCheck, Users, Database } from 'lucide-react';

export default function LeaderboardTab({ currentUser, completedDays, studyHours, completedDsa, apiBase }) {
  const [dbLeaderboard, setDbLeaderboard] = useState([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  function getEarnedBadge(daysCount, dsaCount = 0) {
    if (daysCount >= 40 && dsaCount >= 35) return "Java Master";
    if (daysCount >= 30) return "System Architect";
    if (daysCount >= 20) return "Spring Developer";
    if (daysCount >= 10) return "Java Specialist";
    return "Backend Aspirant";
  }

  const userDaysCount = completedDays.length;
  const userEarnedBadge = getEarnedBadge(userDaysCount, completedDsa.length);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!apiBase) return;
      try {
        const headers = {};
        if (currentUser && currentUser.token) {
          headers['Authorization'] = `Bearer ${currentUser.token}`;
        }
        const res = await fetch(`${apiBase}/api/leaderboard`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDbLeaderboard(data);
            setIsDbLoaded(true);
          }
        }
      } catch (err) {
        console.warn("Could not fetch database leaderboard:", err);
      }
    }
    fetchLeaderboard();
  }, [currentUser, apiBase, completedDays, completedDsa, studyHours]);

  // If backend returns real registered users from PostgreSQL, use them!
  // If fewer than 4 users in database, merge with benchmark targets for placement comparison
  const benchmarkTargets = [
    {
      name: "Aarav Sharma",
      isUser: false,
      daysCompleted: 38,
      studyHours: 112,
      dsaSolved: 95,
      badge: "System Architect",
      avatar: "☕",
      isBenchmark: true
    },
    {
      name: "Priya Patel",
      isUser: false,
      daysCompleted: 32,
      studyHours: 94,
      dsaSolved: 80,
      badge: "System Architect",
      avatar: "💻",
      isBenchmark: true
    },
    {
      name: "Rohan Verma",
      isUser: false,
      daysCompleted: 27,
      studyHours: 78,
      dsaSolved: 65,
      badge: "Spring Developer",
      avatar: "🔥",
      isBenchmark: true
    }
  ];

  let displayUsers = [];

  if (isDbLoaded && dbLeaderboard.length > 0) {
    displayUsers = dbLeaderboard.map((u) => ({
      name: u.isCurrentUser ? `${u.username} (You)` : u.username,
      isUser: u.isCurrentUser,
      daysCompleted: u.daysCompleted,
      studyHours: u.studyHours,
      dsaSolved: u.dsaSolved,
      badge: u.badge,
      avatar: u.isCurrentUser ? "🚀" : "👤",
      isBenchmark: false
    }));

    // If local dev or only 1-2 real accounts, append benchmarks to show placement comparison
    if (displayUsers.length < 4) {
      displayUsers = [...displayUsers, ...benchmarkTargets];
    }
  } else {
    // Client-side fallback
    displayUsers = [
      {
        name: currentUser ? `${currentUser.username} (You)` : "Satyam Shiv (You)",
        isUser: true,
        daysCompleted: userDaysCount,
        studyHours: studyHours,
        dsaSolved: completedDsa.length,
        badge: userEarnedBadge,
        avatar: "🚀",
        isBenchmark: false
      },
      ...benchmarkTargets
    ];
  }

  // Sort by Days Completed descending
  const sortedUsers = [...displayUsers].sort((a, b) => b.daysCompleted - a.daysCompleted);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs tracking-wider uppercase mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            PostgreSQL Domain Leaderboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            Learner Benchmarks & Rankings
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-normal flex items-center gap-1">
              <Database className="w-3 h-3" />
              {isDbLoaded ? "PostgreSQL Live Data" : "Session Verified"}
            </span>
          </h1>
          <p className="text-amber-200 text-sm mt-1 max-w-2xl">
            Ranked by verified database syllabus completion, LeetCode-style DSA submissions, and logged study hours.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-amber-500/30">
          <Flame className="w-8 h-8 text-amber-500 shrink-0" />
          <div>
            <span className="text-[11px] text-amber-300 uppercase font-bold block">Your Earned Badge</span>
            <span className="text-sm font-extrabold text-white">{userEarnedBadge} ({userDaysCount}/45 Days)</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Placement Peer Rankings
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            Ordered by Days & DSA Solved
          </span>
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
                    <div>
                      <span className="font-bold">{user.name}</span>
                      {user.isBenchmark && (
                        <span className="text-[10px] text-slate-400 block font-normal">Placement Target Benchmark</span>
                      )}
                    </div>
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
                    {user.dsaSolved} / 45
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      user.isUser
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-mono'
                        : 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    }`}>
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
