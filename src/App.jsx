import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import LandingTab from './components/LandingTab';
import DashboardTab from './components/DashboardTab';
import SyllabusTab from './components/SyllabusTab';
import CodingTab from './components/CodingTab';
import InterviewTab from './components/InterviewTab';
import ProjectTab from './components/ProjectTab';
import MentorTab from './components/MentorTab';
import AnalyticsTab from './components/AnalyticsTab';
import CareerHubTab from './components/CareerHubTab';
import LeaderboardTab from './components/LeaderboardTab';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import { getDaySyllabus } from './data/syllabus';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://java-study-tracker.onrender.com';

export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('studyTrackerUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Protected tabs require authentication unless in Demo Preview mode
  const protectedTabs = ['dashboard', 'syllabus', 'coding', 'interview', 'project', 'analytics', 'leaderboard', 'career', 'mentor'];

  const [currentTab, setCurrentTabRaw] = useState(() => {
    const saved = localStorage.getItem('studyTrackerUser');
    return saved ? 'dashboard' : 'landing';
  });

  // Guard: if user tries to navigate to a protected tab without auth or demo preview, prompt login modal
  const setCurrentTab = (tab) => {
    if (protectedTabs.includes(tab) && !currentUser && !isDemoMode) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentTabRaw(tab);
  };

  const handleExploreDemo = () => {
    setIsDemoMode(true);
    setCompletedDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    setCompletedDsa([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]);
    setStudyHours(94.5);
    setVivaScore({ correct: 21, total: 25 });
    setProjectMilestones(prev => prev.map((m, i) => ({ ...m, done: i < 6 })));
    setStorageError(null);
    setCurrentTabRaw('dashboard');
  };

  const [activeDay, setActiveDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [completedDsa, setCompletedDsa] = useState([]);
  const [studyHours, setStudyHours] = useState(0);
  const [notes, setNotes] = useState({});
  const [activeNote, setActiveNote] = useState('');
  const [vivaScore, setVivaScore] = useState({ correct: 0, total: 0 });
  const [projectMilestones, setProjectMilestones] = useState([
    { id: 1, name: "Initialize Spring Boot project & pom.xml setup", done: false },
    { id: 2, name: "Establish Postgres/H2 schema & application.yml configuration", done: false },
    { id: 3, name: "Write entity classes with real database relations", done: false },
    { id: 4, name: "Add Spring Security, JWT filter, and PasswordEncoder", done: false },
    { id: 5, name: "Implement REST controllers and global exception handling", done: false },
    { id: 6, name: "Build frontend and wire it to the real API", done: false },
    { id: 7, name: "Handle auth flow end-to-end (login, token storage, protected routes)", done: false },
    { id: 8, name: "Write tests, then actually deploy both frontend and backend", done: false }
  ]);

  // Timer
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Code review
  const [sandboxCode, setSandboxCode] = useState('');
  const [reviewOutput, setReviewOutput] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // AI Mentor
  const [chatMessages, setChatMessages] = useState([
    { sender: 'mentor', text: "Welcome to CodeMentor! I'm your AI Backend Engineering Mentor & Placement Coach. Ask me to explain any Java 17, Spring Boot 3.4, SQL, or System Design concept, quiz you on your 45-day curriculum, or review your code." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  const dayData = getDaySyllabus(activeDay);

  // --- Load persisted state from PostgreSQL API on mount ---
  useEffect(() => {
    async function loadData(retryCount = 0) {
      if (!currentUser || !currentUser.token) {
        setStorageReady(true);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      try {
        const headers = { 'Authorization': `Bearer ${currentUser.token}` };
        let hasSyncIssue = false;

        // 1. Day Progress from PostgreSQL
        const progressRes = await fetch(`${API_BASE}/api/progress/me`, {
          headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (progressRes.ok) {
          const progressList = await progressRes.json();
          setCompletedDays(progressList.filter(p => p.completed).map(p => p.dayNumber));
        } else if (progressRes.status === 401 || progressRes.status === 403) {
          // Token expired or invalid — force re-login
          setCurrentUser(null);
          localStorage.removeItem('studyTrackerUser');
          setCurrentTabRaw('landing');
          setIsAuthModalOpen(true);
          setStorageReady(true);
          return;
        } else {
          hasSyncIssue = true;
        }

        // 2. DSA Submissions from PostgreSQL
        try {
          const dsaRes = await fetch(`${API_BASE}/api/dsa/me`, { headers });
          if (dsaRes.ok) {
            const dsaList = await dsaRes.json();
            setCompletedDsa(dsaList.filter(d => d.completed).map(d => d.dayNumber));
          } else {
            hasSyncIssue = true;
          }
        } catch {
          hasSyncIssue = true;
        }

        // 3. Study Hours from PostgreSQL
        try {
          const hoursRes = await fetch(`${API_BASE}/api/study-sessions/me/total-hours`, { headers });
          if (hoursRes.ok) {
            const hoursData = await hoursRes.json();
            if (typeof hoursData.totalHours === 'number') {
              setStudyHours(hoursData.totalHours);
            }
          } else {
            hasSyncIssue = true;
          }
        } catch {
          hasSyncIssue = true;
        }

        // 4. Notes from PostgreSQL
        try {
          const notesRes = await fetch(`${API_BASE}/api/notes/me`, { headers });
          if (notesRes.ok) {
            const notesMap = await notesRes.json();
            if (notesMap && typeof notesMap === 'object') {
              setNotes(notesMap);
              setActiveNote(notesMap[activeDay] || '');
            }
          } else {
            hasSyncIssue = true;
          }
        } catch {
          hasSyncIssue = true;
        }

        // 5. Viva Scores from PostgreSQL
        try {
          const vivaRes = await fetch(`${API_BASE}/api/viva/me/summary`, { headers });
          if (vivaRes.ok) {
            const vivaData = await vivaRes.json();
            setVivaScore({
              correct: vivaData.passedAttempts || 0,
              total: vivaData.totalAttempts || 0
            });
          } else {
            hasSyncIssue = true;
          }
        } catch {
          hasSyncIssue = true;
        }

        // 6. Capstone Milestones from PostgreSQL
        try {
          const projRes = await fetch(`${API_BASE}/api/projects/me`, { headers });
          if (projRes.ok) {
            const projList = await projRes.json();
            if (Array.isArray(projList) && projList.length > 0) {
              setProjectMilestones(prev => prev.map(m => {
                const match = projList.find(p => p.milestoneId === m.id);
                return match ? { ...m, done: match.completed } : m;
              }));
            }
          } else {
            hasSyncIssue = true;
          }
        } catch {
          hasSyncIssue = true;
        }

        setStorageError(hasSyncIssue ? "Notice: Some progress could not be fetched from the database." : null);

      } catch (err) {
        console.error("Backend load error:", err);
        if (retryCount < 1) {
          setTimeout(() => loadData(retryCount + 1), 3000);
          return;
        }
        setStorageError("Unable to connect to the backend database service. Please retry.");
      } finally {
        setStorageReady(true);
      }
    }
    loadData();

    // Keep-alive ping uses the public /api/health endpoint
    const pingInterval = setInterval(() => {
      fetch(`${API_BASE}/api/health`).catch(() => {});
    }, 10 * 60 * 1000);

    return () => clearInterval(pingInterval);
  }, [currentUser]);

  useEffect(() => {
    if (dayData) setSandboxCode(dayData.dsa.starterCode);
    setActiveNote(notes[activeDay] || '');
    setReviewOutput('');
  }, [activeDay]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            clearInterval(timerIntervalRef.current);
            const sessionMins = timerMode === 'pomodoro' ? 25 : timerMode === 'study' ? 50 : 0;
            if (sessionMins > 0) {
              setStudyHours((h) => parseFloat((h + sessionMins / 60).toFixed(1)));
              if (currentUser && currentUser.token) {
                fetch(`${API_BASE}/api/study-sessions/me`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                  },
                  body: JSON.stringify({ durationMinutes: sessionMins, mode: timerMode })
                }).catch((err) => console.error("Study session sync error:", err));
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timerMode, currentUser]);

  const handleTimerControl = () => setIsTimerRunning(!isTimerRunning);
  const handleTimerReset = (mode) => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === 'pomodoro') setTimerSeconds(1500);
    else if (mode === 'study') setTimerSeconds(3000);
    else if (mode === 'break') setTimerSeconds(600);
  };
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function handleGetReview() {
    setIsReviewing(true);
    setReviewOutput('');
    try {
      const apiUrl = import.meta.env.PROD ? '/api/career' : 'http://localhost:3001/api/career';
      const prompt = `Review this Java code:\n\`\`\`java\n${sandboxCode}\n\`\`\``;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "code_review", text: prompt, targetRole: "Java Engineer" })
      });
      const data = await res.json();
      setReviewOutput(data.feedback ? `Time: ${data.timeComplexity} | Space: ${data.spaceComplexity}\n${data.feedback}` : JSON.stringify(data, null, 2));
    } catch (err) {
      setReviewOutput(`Review service unavailable: ${err.message}`);
    } finally {
      setIsReviewing(false);
    }
  }

  async function handleMarkDsaDone() {
    const isNowDone = !completedDsa.includes(activeDay);
    setCompletedDsa(
      isNowDone ? [...completedDsa, activeDay] : completedDsa.filter((d) => d !== activeDay)
    );

    if (currentUser && currentUser.token) {
      try {
        await fetch(`${API_BASE}/api/dsa/me/${activeDay}/toggle`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
      } catch (err) {
        console.error("Failed to sync DSA to backend:", err);
      }
    }
  }

  async function handleSaveNote() {
    setNotes({ ...notes, [activeDay]: activeNote });

    if (currentUser && currentUser.token) {
      try {
        await fetch(`${API_BASE}/api/notes/me/${activeDay}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ content: activeNote })
        });
      } catch (err) {
        console.error("Failed to sync note to backend:", err);
      }
    }
  }

  async function handleToggleDayComplete(dayNum) {
    const isNowComplete = !completedDays.includes(dayNum);
    setCompletedDays(
      isNowComplete ? [...completedDays, dayNum] : completedDays.filter((d) => d !== dayNum)
    );
    
    // Only sync to backend if authenticated
    if (currentUser && currentUser.token) {
      try {
        await fetch(`${API_BASE}/api/progress/me/${dayNum}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
      } catch (err) {
        console.error("Failed to sync day to Java backend", err);
      }
    }
  }

  async function toggleMilestone(id) {
    setProjectMilestones(projectMilestones.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));

    if (currentUser && currentUser.token) {
      try {
        await fetch(`${API_BASE}/api/projects/me/${id}/toggle`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
      } catch (err) {
        console.error("Failed to sync milestone to backend:", err);
      }
    }
  }

  async function handleRecordViva(attempt) {
    if (attempt.score >= 7) {
      setVivaScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setVivaScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    if (currentUser && currentUser.token) {
      try {
        await fetch(`${API_BASE}/api/viva/me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({
            category: attempt.category || 'Java Core',
            question: attempt.question,
            userAnswer: attempt.userAnswer || '',
            score: attempt.score,
            feedback: attempt.feedback || ''
          })
        });
      } catch (err) {
        console.error("Failed to sync viva attempt to backend:", err);
      }
    }
  }

  async function handleSendMessage() {
    if (!chatInput.trim() || isGenerating) return;
    const userMsg = chatInput;
    const nextMessages = [...chatMessages, { sender: 'user', text: userMsg }];
    setChatMessages(nextMessages);
    setChatInput('');
    setIsGenerating(true);

    try {
      const historyContent = nextMessages.filter((m, i) => i > 0).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const apiUrl = import.meta.env.PROD ? '/api/chat' : 'http://localhost:3001/api/chat';
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeDayTitle: `Day ${activeDay} - ${dayData?.title || 'Unknown'}`,
          userState: { completedDays, completedDsa, studyHours },
          historyContent
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const text = data.candidates[0].content.parts[0].text;
      setChatMessages([...nextMessages, { sender: 'mentor', text }]);
    } catch (err) {
      setChatMessages([...nextMessages, { sender: 'mentor', text: `Error: ${err.message}. Make sure the backend server is running on port 3001.` }]);
    } finally {
      setIsGenerating(false);
    }
  }

  if (!storageReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
        Connecting to Java Spring Boot Backend...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased transition-colors duration-200">
      <Header
        isTimerRunning={isTimerRunning}
        timerMode={timerMode}
        timerSeconds={timerSeconds}
        handleTimerControl={handleTimerControl}
        handleTimerReset={handleTimerReset}
        formatTime={formatTime}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 overflow-y-auto custom-scrollbar">
        {/* Interactive Demo Mode Notice Banner */}
        {isDemoMode && !currentUser && (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-700/60 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold tracking-wide uppercase">
                Demo Preview Mode
              </span>
              <p className="text-xs sm:text-sm text-indigo-100">
                You are exploring CodeMentor with sample telemetry. <strong>Sign in</strong> to save real learning progress to the PostgreSQL database.
              </p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Global Storage Error Banner */}
        {storageError && currentUser && (
          <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg">
            <span>⚠️ {storageError}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-rose-800/60 hover:bg-rose-700/80 text-white rounded-lg text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {currentTab === 'landing' && (
          <LandingTab
            onExploreDemo={handleExploreDemo}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardTab
            storageError={storageError}
            completedDays={completedDays}
            studyHours={studyHours}
            completedDsa={completedDsa}
            projectMilestones={projectMilestones}
            vivaScore={vivaScore}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            dayData={dayData}
            handleToggleDayComplete={handleToggleDayComplete}
            activeNote={activeNote}
            setActiveNote={setActiveNote}
            handleSaveNote={handleSaveNote}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'syllabus' && (
          <SyllabusTab
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            completedDays={completedDays}
            handleToggleDayComplete={handleToggleDayComplete}
            dayData={dayData}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'coding' && (
          <CodingTab
            activeDay={activeDay}
            dayData={dayData}
            completedDsa={completedDsa}
            handleMarkDsaDone={handleMarkDsaDone}
            sandboxCode={sandboxCode}
            setSandboxCode={setSandboxCode}
            handleGetReview={handleGetReview}
            isReviewing={isReviewing}
            reviewOutput={reviewOutput}
          />
        )}

        {currentTab === 'interview' && (
          <InterviewTab
            vivaScore={vivaScore}
            setVivaScore={setVivaScore}
            onRecordViva={handleRecordViva}
          />
        )}

        {currentTab === 'project' && (
          <ProjectTab
            projectMilestones={projectMilestones}
            toggleMilestone={toggleMilestone}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsTab
            completedDays={completedDays}
            studyHours={studyHours}
            completedDsa={completedDsa}
            projectMilestones={projectMilestones}
            vivaScore={vivaScore}
            currentUser={currentUser}
            apiBase={API_BASE}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardTab
            currentUser={currentUser}
            completedDays={completedDays}
            studyHours={studyHours}
            completedDsa={completedDsa}
            apiBase={API_BASE}
          />
        )}

        {currentTab === 'career' && (
          <CareerHubTab />
        )}

        {currentTab === 'mentor' && (
          <MentorTab
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            chatEndRef={chatEndRef}
          />
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsDemoMode(false);
          localStorage.setItem('studyTrackerUser', JSON.stringify(user));
          setIsAuthModalOpen(false);
          setCurrentTabRaw('dashboard');
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        completedDays={completedDays}
        studyHours={studyHours}
        completedDsa={completedDsa}
        onLogout={() => {
          setCurrentUser(null);
          setIsDemoMode(false);
          localStorage.removeItem('studyTrackerUser');
          setCompletedDays([]);
          setCompletedDsa([]);
          setStudyHours(0);
          setNotes({});
          setVivaScore({ correct: 0, total: 0 });
          setIsProfileModalOpen(false);
          setCurrentTabRaw('landing');
        }}
      />
    </div>
  );
}
