import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { getDaySyllabus } from '../data/syllabus';

export default function AnalyticsTab({ completedDays, studyHours, completedDsa, projectMilestones, vivaScore }) {
  // Data for Study Consistency (Line Chart)
  // We'll generate a dummy trend for the last 7 days based on current studyHours
  const dailyAvg = studyHours / Math.max(1, completedDays.length);
  const trendData = Array.from({ length: 7 }).map((_, i) => ({
    day: `Day ${i + 1}`,
    hours: Math.max(0, parseFloat((dailyAvg + (Math.random() * 1.5 - 0.75)).toFixed(1)))
  }));

  // Data for DSA Categories (Pie Chart)
  // Calculate real distribution of completed DSA based on Day Category
  const categoryCounts = {};
  completedDsa.forEach(dayNum => {
    const category = getDaySyllabus(dayNum).category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const dsaData = Object.keys(categoryCounts).length > 0 
    ? Object.keys(categoryCounts).map(cat => ({
        name: cat,
        value: categoryCounts[cat]
      }))
    : [{ name: 'No Data Yet', value: 1 }]; // Fallback if no DSA completed

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  // Data for Overall Readiness (Bar Chart)
  const readinessData = [
    { name: 'Theory Days', score: Math.round((completedDays.length / 45) * 100) },
    { name: 'DSA Problems', score: Math.round((completedDsa.length / 45) * 100) },
    { name: 'Projects', score: Math.round((projectMilestones.filter(m => m.done).length / projectMilestones.length) * 100) },
    { name: 'Mock Viva', score: vivaScore.total > 0 ? Math.round((vivaScore.correct / vivaScore.total) * 100) : 0 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Study Analytics & Insights</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Track your progress and placement readiness across all categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Study Hours Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:border-slate-700 transition">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Study Hours Trend (Last 7 Sessions)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Overall Readiness */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:border-slate-700 transition">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Placement Readiness by Category (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: DSA Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2 hover:border-slate-300 dark:border-slate-700 transition">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Actual DSA Completion by Category</h3>
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
