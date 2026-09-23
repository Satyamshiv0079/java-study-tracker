import React, { useState } from 'react';
import { Briefcase, FileText, Sparkles, CheckCircle, AlertTriangle, Copy, ArrowRight, BookOpen, UserCheck, Search, Upload, Link as LinkIcon, X, FileCheck } from 'lucide-react';

export default function CareerHubTab() {
  const [subTab, setSubTab] = useState('resume'); // 'resume' | 'linkedin'
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'text' | 'url'
  const [targetRole, setTargetRole] = useState('Java Backend Engineer');
  const [inputText, setInputText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileData, setFileData] = useState(null); // { name, base64, mimeType }
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const sampleResumeText = `SATYAM SHIVAM - Software Engineering Aspirant
Email: satyam@example.com | GitHub: github.com/Satyamshiv0079

SUMMARY:
Passionate Software Developer with experience building web applications using React, JavaScript, and Java. 

PROJECTS:
45-Day Java Study Tracker
- Built a web application using React and Tailwind CSS to track daily learning progress.
- Created a Java Spring Boot backend using Spring Data JPA and H2 database.
- Integrated AI mentor using Google Gemini API to answer technical questions.
- Configured CORS and deployed frontend on Vercel and backend on Render.

SKILLS:
Languages: Java, JavaScript, HTML, CSS, SQL
Frameworks: React, Spring Boot, Node.js, Express
Tools: Git, GitHub, Docker, Vite, Vercel, Render`;

  const sampleLinkedInText = `Headline: Computer Science Student | Aspiring Java Backend Developer | React & Spring Boot

About:
I am a passionate CS student building full-stack web applications. Recently built a 45-day Java Backend Tracker featuring Spring Boot REST APIs, React, and AI Integration. Interested in Java, Data Structures, and Database Design.

Experience:
Project Developer - Java Study Tracker (2026)
- Designed RESTful API controllers and services in Spring Boot.
- Built responsive UI in React with dark mode and analytics dashboard.`;

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf') && !file.type.includes('text')) {
      setErrorMessage("Please upload a valid PDF or text document.");
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData({
        name: file.name,
        base64: event.target.result,
        mimeType: file.type || 'application/pdf'
      });
    };
    reader.readAsDataURL(file);
  }

  function handleLoadSample() {
    setInputMode('text');
    if (subTab === 'resume') {
      setInputText(sampleResumeText);
    } else {
      setInputText(sampleLinkedInText);
    }
  }

  async function handleAnalyze() {
    if (!inputText.trim() && !fileData && !urlInput.trim()) {
      setErrorMessage("Please upload a PDF, paste text, or provide a URL before analyzing.");
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const apiUrl = import.meta.env.PROD ? '/api/career' : 'http://localhost:3001/api/career';
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: subTab,
          text: inputText,
          fileData: fileData?.base64 || null,
          mimeType: fileData?.mimeType || 'application/pdf',
          url: urlInput,
          targetRole: targetRole
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Failed to analyze content.");
      }

      setAnalysisResult(data);
    } catch (err) {
      console.error("Career Analysis Error:", err);
      setErrorMessage(err.message || "Failed to connect to AI Career Engine.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function copyToClipboard(text, indexKey) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(indexKey);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI Career & Placement Suite
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Resume PDF & LinkedIn URL Analyzer
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Upload your Resume PDF, paste profile text, or provide URLs for brutally honest ATS scoring, missing keywords, and bullet point upgrades tailored for Java Backend roles.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all border border-indigo-400/30"
          >
            <FileText className="w-4 h-4" /> Export ATS Resume PDF
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Target Role */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => { setSubTab('resume'); setAnalysisResult(null); setErrorMessage(''); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              subTab === 'resume'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resume ATS Scorer
          </button>
          <button
            onClick={() => { setSubTab('linkedin'); setAnalysisResult(null); setErrorMessage(''); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              subTab === 'linkedin'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            LinkedIn Optimizer
          </button>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Target Role:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Java Backend Engineer">Java Backend Engineer</option>
            <option value="Spring Boot & Microservices Developer">Spring Boot & Microservices Developer</option>
            <option value="Full-Stack Java Engineer">Full-Stack Java Engineer</option>
            <option value="Junior Java Software Engineer">Junior Java Software Engineer</option>
          </select>
        </div>
      </div>

      {/* Input Mode Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputMode('file')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                inputMode === 'file'
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload PDF Document
            </button>
            <button
              onClick={() => setInputMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                inputMode === 'url'
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Analyze Web Link / URL
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                inputMode === 'text'
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Paste Raw Text
            </button>
          </div>

          <button
            onClick={handleLoadSample}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Text
          </button>
        </div>

        {/* INPUT MODE: PDF File Upload */}
        {inputMode === 'file' && (
          <div className="space-y-3">
            {!fileData ? (
              <label className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click or drag your Resume PDF file here
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Supports PDF format (.pdf)
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{fileData.name}</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">PDF File Ready for AI Multimodal Analysis</span>
                  </div>
                </div>
                <button
                  onClick={() => setFileData(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  title="Remove File"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* INPUT MODE: URL Link Input */}
        {inputMode === 'url' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Enter Public LinkedIn Profile, GitHub, or Portfolio URL:
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile or https://github.com/yourusername"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono rounded-xl pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Note: The AI will fetch public page content to analyze keywords & structure.
            </p>
          </div>
        )}

        {/* INPUT MODE: Raw Text Area */}
        {inputMode === 'text' && (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            placeholder={
              subTab === 'resume'
                ? "Paste your full resume text here (Summary, Projects, Work Experience, Skills)..."
                : "Paste your LinkedIn Headline, About summary, and recent project descriptions here..."
            }
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Evaluating with AI Engineer Engine...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200" />
              {subTab === 'resume' ? 'Run Ruthless ATS Resume Scan' : 'Optimize LinkedIn Profile'}
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {subTab === 'resume' ? 'ATS Compatibility Score' : 'LinkedIn Recruiter Match'}
              </span>
              <div className="relative flex items-center justify-center">
                <div className={`text-4xl font-extrabold ${
                  (analysisResult.atsScore || analysisResult.profileScore) >= 75
                    ? 'text-emerald-500'
                    : (analysisResult.atsScore || analysisResult.profileScore) >= 50
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}>
                  {analysisResult.atsScore || analysisResult.profileScore || 0}%
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-2 ${
                (analysisResult.atsScore || analysisResult.profileScore) >= 75
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : (analysisResult.atsScore || analysisResult.profileScore) >= 50
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
              }`}>
                {(analysisResult.atsScore || analysisResult.profileScore) >= 75
                  ? 'High Recruiter Match'
                  : (analysisResult.atsScore || analysisResult.profileScore) >= 50
                  ? 'Needs Key Improvements'
                  : 'High Risk of ATS Rejection'}
              </span>
            </div>

            {/* Assessment Summary */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                  AI Engineering Manager Assessment
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {analysisResult.summary || analysisResult.feedback}
                </p>
              </div>

              {/* Missing Keywords Badges */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                  Key Missing Tech Stack Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisResult.missingKeywords || analysisResult.missingRecruiterKeywords || []).map((keyword, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RESUME MODE: Bullet Point Rewrites & Syllabus Gaps */}
          {subTab === 'resume' && (
            <>
              {/* Bullet Point Rewrites */}
              {analysisResult.bulletUpgrades && analysisResult.bulletUpgrades.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    High-Impact Bullet Point Upgrades
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.bulletUpgrades.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 w-full">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold rounded uppercase">Original</span>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-through font-mono">{item.original}</p>
                            </div>
                            <div className="flex items-start gap-2 pt-1">
                              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded uppercase shrink-0 mt-0.5">Pro Rewrite</span>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 font-mono leading-relaxed">{item.improved}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.improved, `bullet-${idx}`)}
                            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                            title="Copy improved bullet"
                          >
                            {copiedIndex === `bullet-${idx}` ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {item.reason && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            💡 <strong>Why this works:</strong> {item.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus Gap Bridge */}
              {analysisResult.syllabusGaps && analysisResult.syllabusGaps.length > 0 && (
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Syllabus Gap Bridge (Course Recommendations)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisResult.syllabusGaps.map((gap, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3.5 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{gap.skill}</span>
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{gap.recommendedDay}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* LINKEDIN MODE: Headlines & Outreach Templates */}
          {subTab === 'linkedin' && (
            <>
              {/* Headlines Generator */}
              {analysisResult.headlines && analysisResult.headlines.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Recommended Recruiter-Optimized Headlines
                  </h3>
                  <div className="space-y-2.5">
                    {analysisResult.headlines.map((headline, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">{headline}</span>
                        <button
                          onClick={() => copyToClipboard(headline, `headline-${idx}`)}
                          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          {copiedIndex === `headline-${idx}` ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outreach Template */}
              {analysisResult.outreachTemplate && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Search className="w-4 h-4 text-indigo-500" />
                      Personalized Recruiter Outreach Message Template
                    </h3>
                    <button
                      onClick={() => copyToClipboard(analysisResult.outreachTemplate, 'outreach')}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {copiedIndex === 'outreach' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === 'outreach' ? 'Copied' : 'Copy Message'}
                    </button>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                    {analysisResult.outreachTemplate}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
