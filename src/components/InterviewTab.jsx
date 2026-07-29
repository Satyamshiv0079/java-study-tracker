import React, { useState } from 'react';
import { getDaySyllabus } from '../data/syllabus';

export default function InterviewTab({ vivaScore, setVivaScore }) {
  const [quizTopic, setQuizTopic] = useState('Java Core');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);

  const vivaSets = {
    'Java Core': getDaySyllabus(1).viva,
    'OOPs': getDaySyllabus(4).viva,
    'Advanced Concepts': getDaySyllabus(10).viva,
    'Spring & System Architecture': getDaySyllabus(33).viva
  };
  const activeVivaSet = vivaSets[quizTopic] || [];
  const activeVivaCard = activeVivaSet[currentQuizIndex] || activeVivaSet[0];

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mock Interview Vivas</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Test your ability to articulate concepts verbally.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.keys(vivaSets).map((topic) => (
          <button
            key={topic}
            onClick={() => { setQuizTopic(topic); setCurrentQuizIndex(0); setShowQuizAnswer(false); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              quizTopic === topic
                ? 'bg-amber-600 text-slate-900 dark:text-white shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:border-slate-600'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {activeVivaCard ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 min-h-[300px] flex flex-col justify-center relative transition hover:border-slate-300 dark:border-slate-700 shadow-lg">
          <div className="absolute top-4 left-4 text-xs font-mono text-amber-500/50">Q{currentQuizIndex + 1}</div>
          
          <h3 className="text-xl font-medium text-center text-slate-800 dark:text-slate-200 mb-8 leading-relaxed">
            "{activeVivaCard.q}"
          </h3>

          <div className="flex-1 flex flex-col items-center justify-end">
            {!showQuizAnswer ? (
              <button
                onClick={() => setShowQuizAnswer(true)}
                className="px-6 py-2.5 rounded-lg border border-amber-600/50 text-amber-500 hover:bg-amber-600/10 text-sm font-bold transition-all hover:shadow-[0_0_10px_rgba(217,119,6,0.2)]"
              >
                Reveal Suggested Answer
              </button>
            ) : (
              <div className="w-full text-center animate-fade-in">
                <p className="text-sm text-emerald-400 bg-emerald-950/30 p-4 rounded-lg border border-emerald-900/50 mb-6 leading-relaxed">
                  {activeVivaCard.a}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setVivaScore({ ...vivaScore, total: vivaScore.total + 1 });
                      setCurrentQuizIndex((currentQuizIndex + 1) % activeVivaSet.length);
                      setShowQuizAnswer(false);
                    }}
                    className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition"
                  >
                    Got it wrong / Pass
                  </button>
                  <button
                    onClick={() => {
                      setVivaScore({ correct: vivaScore.correct + 1, total: vivaScore.total + 1 });
                      setCurrentQuizIndex((currentQuizIndex + 1) % activeVivaSet.length);
                      setShowQuizAnswer(false);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white text-xs font-bold rounded-lg transition shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  >
                    Nailed it
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-500">No cards available for this topic.</div>
      )}

      <div className="text-center text-xs text-slate-500 dark:text-slate-500 font-mono mt-4">
        Session Score: <span className="text-emerald-400">{vivaScore.correct}</span> / {vivaScore.total}
      </div>
    </div>
  );
}
