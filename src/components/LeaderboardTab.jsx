import React, { useState, useEffect } from 'react';
import { Trophy, Award, Flame, Star, CheckCircle2, Clock, Code2, ShieldCheck, Users, Database } from 'lucide-react';

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

    if (displayUsers.length < 4) {
      displayUsers = [...displayUsers, ...benchmarkTargets];
    }
  } else {
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

  const sortedUsers = [...displayUsers].sort((a, b) => b.daysCompleted - a.daysCompleted);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4" /> PostgreSQL Domain Leaderboard
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Learner Benchmarks & Rankings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by verified database syllabus completion, LeetCode-style DSA submissions, and logged study hours.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-dark-card border border-dark-border p-3.5 rounded-xl shrink-0">
          <Flame className="w-7 h-7 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Your Active Badge</span>
            <span className="text-xs font-extrabold text-white">{userEarnedBadge} ({userDaysCount}/45 Days)</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-dark-border flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Placement Peer Rankings
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-dark-card border border-dark-border px-2.5 py-1 rounded-lg">
            Ordered by Days & DSA Solved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-dark-card text-slate-400 uppercase font-mono text-[10px] border-b border-dark-border">
              <tr>
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Developer</th>
                <th className="py-3 px-4 font-bold text-center">Days Done</th>
                <th className="py-3 px-4 font-bold text-center">Study Hours</th>
                <th className="py-3 px-4 font-bold text-center">DSA Solved</th>
                <th className="py-3 px-4 font-bold text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border font-medium">
              {sortedUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    user.isUser
                      ? 'bg-brand-600/10 font-bold text-white'
                      : 'hover:bg-dark-hover text-slate-300'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-xs">
                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <span className="text-base">{user.avatar}</span>
                    <div>
                      <span className="font-semibold text-slate-200">{user.name}</span>
                      {user.isBenchmark && (
                        <span className="text-[10px] text-slate-400 block font-normal font-mono">Benchmark Target</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 bg-dark-card border border-dark-border text-brand-400 rounded-md font-mono font-bold text-[11px]">
                      {user.daysCompleted} / 45
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {user.studyHours}h
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {user.dsaSolved} / 120
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      user.isUser
                        ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-mono'
                        : 'bg-dark-card border-dark-border text-slate-400'
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
