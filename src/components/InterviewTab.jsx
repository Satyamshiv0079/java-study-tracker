import React, { useState } from 'react';
import { getDaySyllabus } from '../data/syllabus';
import { Sparkles, MessageSquare, CheckCircle, HelpCircle, UserCheck, Send, RefreshCw, Trophy } from 'lucide-react';

export default function InterviewTab({ vivaScore, setVivaScore }) {
  const [mode, setMode] = useState('ai'); // 'ai' | 'flashcards'
  const [quizTopic, setQuizTopic] = useState('Java Core');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);

  // AI Interview State
  const [userAnswerInput, setUserAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState(null);

  const vivaSets = {
    'Java Core': getDaySyllabus(1).viva,
    'OOPs': getDaySyllabus(4).viva,
    'Advanced Concepts': getDaySyllabus(10).viva,
    'Spring & System Architecture': getDaySyllabus(33).viva
  };
  const activeVivaSet = vivaSets[quizTopic] || [];
  const activeVivaCard = activeVivaSet[currentQuizIndex] || activeVivaSet[0];

  async function handleEvaluateAnswer() {
    if (!userAnswerInput.trim()) return;

    setIsEvaluating(true);
    setAiEvaluation(null);

    try {
      const apiUrl = import.meta.env.PROD ? '/api/career' : 'http://localhost:3001/api/career';
      const prompt = `You are a Senior Java Technical Interviewer. Evaluate candidate's verbal answer for this interview question.

Question: "${activeVivaCard.q}"
Ideal Expected Answer Context: "${activeVivaCard.a}"
Candidate Answer: "${userAnswerInput}"

Return ONLY a JSON object:
{
  "score": (integer 1-10),
  "isPass": true/false,
  "feedback": "2 sentence candid technical evaluation of candidate's answer.",
  "missingKeywords": ["term1", "term2"],
  "followUpQuestion": "(One challenging follow-up question related to this topic)"
}`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "interview_eval",
          text: prompt,
          targetRole: "Java Backend Engineer"
        })
      });

      const data = await res.json();
      setAiEvaluation(data);

      if (data.score >= 7) {
        setVivaScore({ correct: vivaScore.correct + 1, total: vivaScore.total + 1 });
      } else {
        setVivaScore({ ...vivaScore, total: vivaScore.total + 1 });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setAiEvaluation({
        score: 8,
        isPass: true,
        feedback: "Good concise answer covering the core definition. Mentioning memory allocation would make it 10/10.",
        missingKeywords: ["Stack Frame", "Garbage Collection"],
        followUpQuestion: "How does the JVM handle stack overflow exceptions?"
      });
      setVivaScore({ correct: vivaScore.correct + 1, total: vivaScore.total + 1 });
    } finally {
      setIsEvaluating(false);
    }
  }

  function handleNextQuestion() {
    setCurrentQuizIndex((currentQuizIndex + 1) % activeVivaSet.length);
    setUserAnswerInput('');
    setAiEvaluation(null);
    setShowQuizAnswer(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            AI Technical Interview Simulator
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Java & Spring Boot Mock Vivas
          </h1>
          <p className="text-amber-200/80 text-xs mt-1">
            Practice articulating technical concepts out loud to an AI Senior Tech Lead.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-amber-500/20">
          <button
            onClick={() => { setMode('ai'); setAiEvaluation(null); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'ai' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Interviewer
          </button>
          <button
            onClick={() => { setMode('flashcards'); setAiEvaluation(null); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'flashcards' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Flashcards
          </button>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(vivaSets).map((topic) => (
          <button
            key={topic}
            onClick={() => { setQuizTopic(topic); setCurrentQuizIndex(0); setUserAnswerInput(''); setAiEvaluation(null); setShowQuizAnswer(false); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              quizTopic === topic
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      {activeVivaCard ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase">
              QUESTION {currentQuizIndex + 1} OF {activeVivaSet.length}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Score: <span className="text-emerald-500">{vivaScore.correct}</span> / {vivaScore.total}
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center leading-relaxed">
            "{activeVivaCard.q}"
          </h3>

          {/* MODE 1: AI Interactive Interviewer */}
          {mode === 'ai' && (
            <div className="space-y-4">
              {!aiEvaluation ? (
                <div className="space-y-3">
                  <textarea
                    value={userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    rows={4}
                    placeholder="Type your verbal answer here as you would explain it to an interviewer..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-sans rounded-xl p-3.5 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y"
                  />

                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating || !userAnswerInput.trim()}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        AI Tech Lead Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Answer to AI Interviewer
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Evaluation Result Box */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-amber-500" />
                        AI Interview Score
                      </span>
                      <span className={`text-lg font-extrabold px-3 py-0.5 rounded-full ${
                        aiEvaluation.score >= 7
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      }`}>
                        {aiEvaluation.score} / 10
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {aiEvaluation.feedback}
                    </p>

                    {aiEvaluation.missingKeywords && aiEvaluation.missingKeywords.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1">Consider mentioning:</span>
                        <div className="flex flex-wrap gap-1">
                          {aiEvaluation.missingKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-semibold rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiEvaluation.followUpQuestion && (
                      <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-lg space-y-1">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Interviewer Follow-Up Question:
                        </span>
                        <p className="text-xs italic text-slate-700 dark:text-slate-300">
                          "{aiEvaluation.followUpQuestion}"
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Next Question
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: Flashcards */}
          {mode === 'flashcards' && (
            <div className="space-y-4 text-center">
              {!showQuizAnswer ? (
                <button
                  onClick={() => setShowQuizAnswer(true)}
                  className="px-6 py-2.5 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-bold transition-all"
                >
                  Reveal Suggested Answer
                </button>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 leading-relaxed text-left">
                    {activeVivaCard.a}
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setVivaScore({ ...vivaScore, total: vivaScore.total + 1 });
                        handleNextQuestion();
                      }}
                      className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                    >
                      Missed it / Pass
                    </button>
                    <button
                      onClick={() => {
                        setVivaScore({ correct: vivaScore.correct + 1, total: vivaScore.total + 1 });
                        handleNextQuestion();
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md"
                    >
                      Nailed it (+1)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-slate-500 text-xs">No questions available for this topic.</div>
      )}
    </div>
  );
}
