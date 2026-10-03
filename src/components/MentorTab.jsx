import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Copy, Check, FileText, Upload, Trash2, Database,
  Search, ShieldAlert, Cpu, BarChart2, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  fetchRagDocuments,
  uploadRagDocument,
  deleteRagDocument,
  queryRag,
  evaluateRag,
  fetchRagHealth
} from '../api/trackerApi';

export default function MentorTab({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isGenerating,
  chatEndRef,
  currentUser,
  onOpenAuth
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('mentor'); // 'mentor' | 'rag'

  // RAG State
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ragHealth, setRagHealth] = useState(null);

  // RAG Query State
  const [ragQuery, setRagQuery] = useState('');
  const [ragHistory, setRagHistory] = useState([]);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [ragError, setRagError] = useState(null);

  // Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResults, setEvalResults] = useState(null);

  const fileInputRef = useRef(null);

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

  const loadDocuments = async () => {
    if (!currentUser?.token) return;
    setIsLoadingDocs(true);
    setUploadError(null);
    try {
      const data = await fetchRagDocuments(currentUser.token);
      setDocuments(data.documents || []);
    } catch (err) {
      console.warn("Could not load RAG documents:", err.message);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'rag' && currentUser?.token) {
      loadDocuments();
      fetchRagHealth(currentUser.token).then(setRagHealth).catch(() => null);
    }
  }, [activeSubTab, currentUser?.token]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.token) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      await uploadRagDocument(currentUser.token, file);
      await loadDocuments();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadError(err.message || 'Failed to upload and index document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!currentUser?.token) return;
    try {
      await deleteRagDocument(currentUser.token, docId);
      await loadDocuments();
    } catch (err) {
      alert("Failed to delete document: " + err.message);
    }
  };

  const handleExecuteRagQuery = async (e) => {
    if (e) e.preventDefault();
    if (!ragQuery.trim() || isSearchingRag || !currentUser?.token) return;

    const question = ragQuery.trim();
    setRagQuery('');
    setRagError(null);
    setIsSearchingRag(true);

    const userEntry = { sender: 'user', text: question };
    setRagHistory(prev => [...prev, userEntry]);

    try {
      const resp = await queryRag(currentUser.token, question, 4, true);
      const mentorEntry = {
        sender: 'mentor',
        text: resp.answer,
        sources: resp.sources || [],
        grounded: resp.grounded,
        retrievedChunks: resp.retrieved_chunks
      };
      setRagHistory(prev => [...prev, mentorEntry]);
    } catch (err) {
      setRagError(err.message || 'Error communicating with RAG service.');
      setRagHistory(prev => [
        ...prev,
        { sender: 'mentor', text: 'Unable to complete RAG retrieval. Please ensure the Python RAG service is running.' }
      ]);
    } finally {
      setIsSearchingRag(false);
    }
  };

  const handleRunEvaluation = async () => {
    if (!currentUser?.token) return;
    setIsEvaluating(true);
    try {
      const results = await evaluateRag(currentUser.token, 4);
      setEvalResults(results);
    } catch (err) {
      alert("Evaluation failed: " + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      {/* Top Header Card */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-brand-600/20 border border-brand-500/40 text-brand-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white">CodeMentor AI & RAG Engine</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono font-bold">
                  HCLTech GenAI Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {activeSubTab === 'mentor'
                  ? 'Curriculum-Grounded • Gemini 2.5 Flash'
                  : 'Dense Vector Retrieval • FAISS IndexFlatIP (384-dim) • Tenant Isolated'}
              </p>
            </div>
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex items-center bg-dark-card border border-dark-border rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('mentor')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeSubTab === 'mentor'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Curriculum Mentor
            </button>
            <button
              onClick={() => setActiveSubTab('rag')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeSubTab === 'rag'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Document RAG</span>
            </button>
          </div>
        </div>

        {/* Mode Specific Info Banner */}
        {activeSubTab === 'mentor' ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => setChatInput(qa.prompt)}
                className="px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 text-slate-300 hover:text-white rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span>{qa.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-dark-card border border-dark-border text-xs text-slate-300">
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>Model: {ragHealth?.embedding_model || 'all-MiniLM-L6-v2'}</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Dim: 384</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Metric: Cosine Similarity</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunEvaluation}
                disabled={isEvaluating || !currentUser}
                className="px-2.5 py-1 bg-dark-surface hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 text-brand-400 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <BarChart2 className="w-3 h-3" />
                <span>{isEvaluating ? 'Evaluating...' : 'Run IR Evaluation (16 Qs)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {activeSubTab === 'mentor' ? (
        /* Standard Mentor View */
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
      ) : (
        /* RAG Knowledge Base View */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
          {/* Left Column: Documents Manager */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-4 flex flex-col space-y-3 min-h-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-400" />
                <span>My Knowledge Store</span>
              </h3>
              <button
                onClick={loadDocuments}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-dark-card transition-colors"
                title="Refresh Documents"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {!currentUser ? (
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border text-center space-y-2 my-auto">
                <ShieldAlert className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">User Authentication Required</p>
                <p className="text-[11px] text-slate-400">
                  RAG indexes are isolated per tenant to prevent cross-user data leakage.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Sign In to Access RAG
                </button>
              </div>
            ) : (
              <>
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    id="rag-file-input"
                  />
                  <label
                    htmlFor="rag-file-input"
                    className={`w-full py-2 px-3 border border-dashed rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      isUploading
                        ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                        : 'border-dark-border hover:border-brand-500/50 hover:bg-dark-card text-slate-300'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-brand-400" />
                    <span>{isUploading ? 'Chunking & Indexing...' : 'Upload PDF, DOCX, TXT, MD'}</span>
                  </label>
                  {uploadError && (
                    <p className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {uploadError}
                    </p>
                  )}
                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {isLoadingDocs ? (
                    <p className="text-xs text-slate-500 text-center py-4">Loading documents...</p>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-6 px-2 text-slate-500 space-y-1">
                      <Database className="w-6 h-6 mx-auto opacity-40 mb-1" />
                      <p className="text-xs">No documents uploaded yet.</p>
                      <p className="text-[10px]">Upload notes to query with dense vector search.</p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.document_id}
                        className="p-2.5 rounded-xl bg-dark-card border border-dark-border hover:border-slate-700 transition-colors flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-200 truncate">{doc.filename}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {doc.total_chunks} chunks • {doc.total_pages} pg
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.document_id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                          title="Delete from vector index"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-dark-card/60 border border-dark-border/60 text-[10px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Tenant Isolation Guarantee:</p>
                  <p>Index partition: <code className="text-brand-400">storage/users/{currentUser.id}/</code></p>
                </div>
              </>
            )}
          </div>

          {/* Right Two Columns: RAG Chat & Retrieval Citations */}
          <div className="md:col-span-2 bg-dark-surface border border-dark-border rounded-2xl flex flex-col overflow-hidden min-h-0">
            {/* Evaluation Results Banner (if evaluated) */}
            {evalResults && (
              <div className="p-3 bg-brand-950/40 border-b border-brand-500/30 flex items-center justify-between text-xs text-brand-200">
                <div className="flex items-center gap-4 font-mono">
                  <span>Precision@4: <strong className="text-white">{evalResults.mean_precision_at_k}</strong></span>
                  <span>Recall@4: <strong className="text-white">{evalResults.mean_recall_at_k}</strong></span>
                  <span>MRR: <strong className="text-emerald-400">{evalResults.mean_reciprocal_rank_mrr}</strong></span>
                </div>
                <button
                  onClick={() => setEvalResults(null)}
                  className="text-slate-400 hover:text-white text-[11px]"
                >
                  ✕ Close
                </button>
              </div>
            )}

            {/* RAG Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {ragHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                  <Search className="w-8 h-8 text-brand-500/50" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Grounded RAG Assistant</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Upload your technical notes, PDFs, or specs. Questions are grounded strictly
                      against your documents with precise page numbers and similarity scores.
                    </p>
                  </div>
                </div>
              ) : (
                ragHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-dark-card text-slate-200 rounded-tl-sm border border-dark-border'
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                      {/* Display Grounded Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-2 border-t border-dark-border/60 space-y-1.5">
                          <p className="text-[10px] font-bold text-brand-400 font-mono uppercase tracking-wider">
                            Verified Source Citations ({msg.sources.length}):
                          </p>
                          <div className="space-y-1">
                            {msg.sources.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2 rounded-lg bg-dark-surface border border-dark-border text-[11px] space-y-0.5"
                              >
                                <div className="flex items-center justify-between text-slate-300 font-semibold font-mono">
                                  <span>{src.document} (p. {src.page})</span>
                                  <span className="text-emerald-400">Score: {src.score}</span>
                                </div>
                                <p className="text-slate-400 text-[10px] line-clamp-2 italic">
                                  "{src.snippet}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isSearchingRag && (
                <div className="flex justify-start">
                  <div className="bg-dark-card text-slate-400 rounded-2xl rounded-tl-sm px-4 py-3 text-xs flex items-center gap-2 border border-dark-border">
                    <span className="text-brand-400 font-mono text-[11px] font-semibold">FAISS Vector Search & Grounding</span>
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              )}
            </div>

            {/* RAG Query Input */}
            <div className="p-3 bg-dark-surface border-t border-dark-border">
              <form onSubmit={handleExecuteRagQuery} className="flex gap-2">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  disabled={!currentUser || isSearchingRag}
                  placeholder={
                    currentUser
                      ? "Query your documents (e.g., 'What is the sliding window chunking algorithm?')..."
                      : "Please sign in to query your knowledge base..."
                  }
                  className="flex-1 bg-dark-card border border-dark-border focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!currentUser || isSearchingRag || !ragQuery.trim()}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Ask RAG</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
