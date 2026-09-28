import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Database, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';
import { getDaySyllabus } from '../data/syllabus';

export default function AnalyticsTab({
  completedDays,
  studyHours,
  completedDsa,
  projectMilestones,
  vivaScore,
  currentUser,
  apiBase
}) {
  const [backendAnalytics, setBackendAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!currentUser || !currentUser.token || !apiBase) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/analytics/me`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBackendAnalytics(data);
        }
      } catch (e) {
        console.warn("Could not load backend analytics:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, [currentUser, apiBase, completedDays, studyHours, completedDsa]);

  // 1. Line Chart: Study Hours Trend (Last 7 Sessions)
  // If backend analytics available, use real daily session logs! Otherwise fallback to computed average.
  const trendData = backendAnalytics?.last7DaysStudy && backendAnalytics.last7DaysStudy.length > 0
    ? backendAnalytics.last7DaysStudy.map(d => ({
        day: d.date,
        hours: d.hours
      }))
    : Array.from({ length: 7 }).map((_, i) => {
        const dailyAvg = studyHours / Math.max(1, completedDays.length);
        return {
          day: `Day ${i + 1}`,
          hours: Math.max(0, parseFloat(dailyAvg.toFixed(1)))
        };
      });

  // 2. Bar Chart: Overall Placement Readiness by Category
  const readinessScore = backendAnalytics?.placementReadinessScore ?? Math.min(100, Math.round(
    (completedDays.length / 45) * 30 +
    (completedDsa.length / 45) * 25 +
    ((projectMilestones.filter(m => m.done).length) / 8) * 25 +
    (vivaScore.total > 0 ? (vivaScore.correct / vivaScore.total) * 20 : 0)
  ));

  const readinessData = [
    {
      name: 'Theory Days',
      score: backendAnalytics ? Math.round(backendAnalytics.curriculumCompletionPercentage) : Math.round((completedDays.length / 45) * 100)
    },
    {
      name: 'DSA Problems',
      score: backendAnalytics ? Math.round(backendAnalytics.dsaCompletionPercentage) : Math.round((completedDsa.length / 45) * 100)
    },
    {
      name: 'Capstone Projects',
      score: backendAnalytics ? Math.round(backendAnalytics.projectCompletionPercentage) : Math.round((projectMilestones.filter(m => m.done).length / projectMilestones.length) * 100)
    },
    {
      name: 'Mock Viva',
      score: backendAnalytics && backendAnalytics.vivaTotalAttempts > 0
        ? Math.round((backendAnalytics.vivaPassedAttempts / backendAnalytics.vivaTotalAttempts) * 100)
        : (vivaScore.total > 0 ? Math.round((vivaScore.correct / vivaScore.total) * 100) : 0)
    }
  ];

  // 3. Pie Chart: DSA Distribution by Category
  let dsaData = [];
  if (backendAnalytics?.dsaCategoryBreakdown && Object.keys(backendAnalytics.dsaCategoryBreakdown).length > 0) {
    const bd = backendAnalytics.dsaCategoryBreakdown;
    dsaData = Object.keys(bd)
      .filter(k => bd[k] > 0)
      .map(k => ({ name: k, value: bd[k] }));
  }

  if (dsaData.length === 0) {
    const categoryCounts = {};
    completedDsa.forEach(dayNum => {
      const category = getDaySyllabus(dayNum).category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    dsaData = Object.keys(categoryCounts).length > 0
      ? Object.keys(categoryCounts).map(cat => ({
          name: cat,
          value: categoryCounts[cat]
        }))
      : [{ name: 'Core Java (Start Practice)', value: 1 }];
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            Domain Persistence Analytics
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Backend-Aggregated Learning Metrics</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Business metrics aggregated directly from PostgreSQL domain tables: DayProgress, DsaSubmission, StudySession, and VivaAttempt.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <Database className="w-4 h-4 text-emerald-500" />
          <div className="text-left">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Data Source</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {backendAnalytics ? "Spring Boot AnalyticsService" : "Local Telemetry Fallback"}
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase">Placement Readiness</div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{readinessScore}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Weighted domain composite</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase">Study Time Logged</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {backendAnalytics ? backendAnalytics.totalStudyHours : studyHours}h
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {backendAnalytics ? `${backendAnalytics.totalStudySessions} study sessions` : "Pomodoro tracked"}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase">DSA Solved</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {backendAnalytics ? backendAnalytics.dsaSolvedCount : completedDsa.length}/45
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Persisted submissions</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase">Viva Pass Rate</div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {backendAnalytics && backendAnalytics.vivaTotalAttempts > 0
              ? `${Math.round((backendAnalytics.vivaPassedAttempts / backendAnalytics.vivaTotalAttempts) * 100)}%`
              : (vivaScore.total > 0 ? `${Math.round((vivaScore.correct / vivaScore.total) * 100)}%` : '0%')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {backendAnalytics ? `${backendAnalytics.vivaPassedAttempts} passed / ${backendAnalytics.vivaTotalAttempts} tested` : `${vivaScore.correct} / ${vivaScore.total} attempts`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Study Hours Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Study Hours Trend (Last 7 Days)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {backendAnalytics ? "PostgreSQL Logged" : "Estimated"}
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Overall Readiness */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Placement Readiness by Category (%)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Target 100%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: DSA Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2 hover:border-slate-300 dark:border-slate-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              DSA Completion Distribution by Category
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Aggregated from solved submissions
            </span>
          </div>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dsaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {dsaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
