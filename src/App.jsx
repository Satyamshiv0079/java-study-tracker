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

const API_BASE = 'https://java-study-tracker.onrender.com';

export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('studyTrackerUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Protected tabs require authentication
  const protectedTabs = ['dashboard', 'syllabus', 'coding', 'interview', 'project', 'analytics', 'leaderboard', 'career', 'mentor'];

  const [currentTab, setCurrentTabRaw] = useState(() => {
    const saved = localStorage.getItem('studyTrackerUser');
    return saved ? 'dashboard' : 'landing';
  });

  // Guard: if user tries to navigate to a protected tab without auth, show login modal
  const setCurrentTab = (tab) => {
    if (protectedTabs.includes(tab) && !currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentTabRaw(tab);
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

  // --- Load persisted state from Java API and LocalStorage on mount ---
  useEffect(() => {
    async function loadData(retryCount = 0) {
      // Only fetch from backend if user is authenticated with a JWT token
      if (!currentUser || !currentUser.token) {
        // Load local-only data for demo mode
        const localData = localStorage.getItem('studyTrackerData');
        if (localData) {
          const p = JSON.parse(localData);
          if (p.completedDsa) setCompletedDsa(p.completedDsa);
          if (typeof p.studyHours === 'number') setStudyHours(p.studyHours);
          if (p.notes) { setNotes(p.notes); setActiveNote(p.notes[1] || ''); }
          if (p.vivaScore) setVivaScore(p.vivaScore);
          if (p.projectMilestones) setProjectMilestones(p.projectMilestones);
        }
        setStorageReady(true);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      try {
        const headers = { 'Authorization': `Bearer ${currentUser.token}` };

        // 1. Day Progress from PostgreSQL
        const progressRes = await fetch(`${API_BASE}/api/progress/me`, {
          headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (progressRes.ok) {
          const progressList = await progressRes.json();
          setCompletedDays(progressList.filter(p => p.completed).map(p => p.dayNumber));
          setStorageError('');
        } else if (progressRes.status === 401 || progressRes.status === 403) {
          // Token expired or invalid — force re-login
          setCurrentUser(null);
          localStorage.removeItem('studyTrackerUser');
          setCurrentTabRaw('landing');
          setIsAuthModalOpen(true);
          setStorageReady(true);
          return;
        }

        // 2. DSA Submissions from PostgreSQL
        try {
          const dsaRes = await fetch(`${API_BASE}/api/dsa/me`, { headers });
          if (dsaRes.ok) {
            const dsaList = await dsaRes.json();
            setCompletedDsa(dsaList.filter(d => d.completed).map(d => d.dayNumber));
          }
        } catch (e) {
          console.warn("DSA fetch fallback to local:", e);
        }

        // 3. Study Hours from PostgreSQL
        try {
          const hoursRes = await fetch(`${API_BASE}/api/study-sessions/me/total-hours`, { headers });
          if (hoursRes.ok) {
            const hoursData = await hoursRes.json();
            if (typeof hoursData.totalHours === 'number') {
              setStudyHours(hoursData.totalHours);
            }
          }
        } catch (e) {
          console.warn("Study hours fetch fallback:", e);
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
          }
        } catch (e) {
          console.warn("Notes fetch fallback:", e);
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
          }
        } catch (e) {
          console.warn("Viva fetch fallback:", e);
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
          }
        } catch (e) {
          console.warn("Projects fetch fallback:", e);
        }

      } catch (err) {
        console.warn("Load attempt error:", err);
        if (retryCount < 1) {
          setTimeout(() => loadData(retryCount + 1), 3000);
          return;
        }
      } finally {
        setStorageReady(true);
      }
    }
    loadData();

    // Keep-alive ping uses the public /api/health endpoint (no auth needed)
    const pingInterval = setInterval(() => {
      fetch(`${API_BASE}/api/health`).catch(() => {});
    }, 10 * 60 * 1000);

    return () => clearInterval(pingInterval);
  }, [currentUser]);

  // --- Persist non-day progress to LocalStorage whenever it changes ---
  useEffect(() => {
    if (!storageReady) return;
    const saveTimer = setTimeout(() => {
      try {
        const payload = { 
          completedDsa, 
          studyHours, 
          notes, 
          vivaScore, 
          projectMilestones,
          chatMessages
        };
        localStorage.setItem('studyTrackerData', JSON.stringify(payload));
      } catch (e) {
        console.error("Local save error:", e);
      }
    }, 1000); // Debounce saves by 1 second to minimize writes
    return () => clearTimeout(saveTimer);
  }, [storageReady, completedDsa, studyHours, notes, vivaScore, projectMilestones, chatMessages]);

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
        {currentTab === 'landing' && (
          <LandingTab
            onExploreDemo={() => setCurrentTab('dashboard')}
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
          localStorage.setItem('studyTrackerUser', JSON.stringify(user));
          setIsAuthModalOpen(false);
          setCurrentTab('dashboard'); // Redirect directly to authenticated Dashboard!
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
          localStorage.removeItem('studyTrackerUser');
          setCompletedDays([]);
          setCompletedDsa([]);
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}
