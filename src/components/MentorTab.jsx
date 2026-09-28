import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, Terminal, BookOpen, HelpCircle, Code2, ArrowRight } from 'lucide-react';

export default function MentorTab({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isGenerating,
  chatEndRef
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const quickActions = [
    { label: "Explain Concept", prompt: "Explain Spring Security filter chain and JWT authentication lifecycle in Spring Boot 3.4." },
    { label: "Quiz Me", prompt: "Give me 3 technical interview questions on Java Concurrency and volatile keyword." },
    { label: "Review Code", prompt: "Review my solution for Two Sum and suggest optimal O(N) time and O(1) space optimizations." },
    { label: "Mock Interview", prompt: "Act as a Senior Backend Interviewer and conduct a 5-minute viva on PostgreSQL indexing." },
    { label: "Analyze Progress", prompt: "Analyze my 45-day progress and recommend my next study priority." }
  ];

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleQuickAction = (promptText) => {
    setChatInput(promptText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      {/* Personalized Context Header Card (Prompt #13 requirement) */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-brand-600/20 border border-brand-500/40 text-brand-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">AI Backend Engineering Mentor</h2>
              <p className="text-[11px] text-slate-400 font-mono">Curriculum-Grounded • Gemini 2.5 Flash</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Context Active
          </span>
        </div>

        {/* Dynamic Context Recommendation */}
        <div className="p-3 rounded-xl bg-dark-card border border-dark-border text-xs text-slate-300 space-y-1.5">
          <p className="font-semibold text-slate-200">
            You're currently focusing on <span className="text-brand-400 font-mono font-bold">Day 27: Spring Security & JWT</span>.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 pt-0.5">
            <span className="px-2 py-0.5 rounded-md bg-dark-surface border border-dark-border">1. Spring Security Filters</span>
            <span className="px-2 py-0.5 rounded-md bg-dark-surface border border-dark-border">2. PostgreSQL Relations</span>
            <span className="px-2 py-0.5 rounded-md bg-dark-surface border border-dark-border">3. Medium DSA (Sliding Window)</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(qa.prompt)}
              className="px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 text-slate-300 hover:text-white rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <span>{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed relative group ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm shadow-md shadow-brand-600/20'
                  : 'bg-dark-card text-slate-200 rounded-tl-sm border border-dark-border'
              }`}>
                <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</div>
                {msg.sender === 'mentor' && (
                  <button
                    onClick={() => handleCopyText(msg.text, i)}
                    className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-white bg-dark-surface/80 border border-dark-border opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy message"
                  >
                    {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-dark-card text-slate-400 rounded-2xl rounded-tl-sm px-4 py-3 text-xs flex items-center gap-2 border border-dark-border">
                <span className="text-brand-400 font-mono text-[11px] font-semibold">Gemini is thinking</span>
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-dark-surface border-t border-dark-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a technical concept, request code review, or simulate an interview question..."
              className="flex-1 bg-dark-card border border-dark-border focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isGenerating || !chatInput.trim()}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-brand-600/30 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
