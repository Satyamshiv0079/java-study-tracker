import React from 'react';

export default function MentorTab({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isGenerating,
  chatEndRef
}) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-12rem)] shadow-lg transition hover:border-slate-300 dark:border-slate-700">
      <div className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          AI Mentor (Node.js Backend)
        </h2>
        <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-800/50">
          Secure Proxy
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-sm shadow-[0_4px_10px_rgba(79,70,229,0.2)]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-300 dark:border-slate-700'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex items-center gap-2 border border-slate-300 dark:border-slate-700">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a concept, request a code review, or get a syllabus for a blank day..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition shadow-inner"
          />
          <button
            type="submit"
            disabled={isGenerating || !chatInput.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg transition shadow-[0_0_8px_rgba(79,70,229,0.2)]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
