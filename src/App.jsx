import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import CommandPalette from './components/CommandPalette';
import DemoGuardModal from './components/DemoGuardModal';
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
import { useTrackerData } from './hooks/useTrackerData';
import { API_BASE } from './api/client';
import { AlertCircle } from 'lucide-react';

const TAB_TO_PATH = {
  landing: '/',
  dashboard: '/app/dashboard',
  syllabus: '/app/learn',
  coding: '/app/practice',
  interview: '/app/interview',
  project: '/app/projects',
  analytics: '/app/analytics',
  leaderboard: '/app/leaderboard',
  career: '/app/career',
  mentor: '/app/ai'
};

const PATH_TO_TAB = {
  '/': 'landing',
  '/demo': 'dashboard',
  '/app': 'dashboard',
  '/app/dashboard': 'dashboard',
  '/app/learn': 'syllabus',
  '/app/practice': 'coding',
  '/app/interview': 'interview',
  '/app/projects': 'project',
  '/app/analytics': 'analytics',
  '/app/leaderboard': 'leaderboard',
  '/app/career': 'career',
  '/app/ai': 'mentor'
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDemoMode, setIsDemoMode] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('studyTrackerUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalIsLogin, setAuthModalIsLogin] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDemoGuardOpen, setIsDemoGuardOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTab = PATH_TO_TAB[location.pathname] || (currentUser ? 'dashboard' : 'landing');
  const [activeDay, setActiveDay] = useState(27);
  const [activeNote, setActiveNote] = useState('');

  // Handle session expiration
  const handleSessionExpired = () => {
    setCurrentUser(null);
    localStorage.removeItem('studyTrackerUser');
    navigate('/');
    setIsAuthModalOpen(true);
  };

  // Custom hook: all state, persistence, and optimistic updates with rollback
  const {
    storageReady,
    storageError,
    actionError,
    completedDays,
    completedDsa,
    studyHours,
    notes,
    vivaScore,
    projectMilestones,
    toggleDayComplete,
    toggleDsaDone,
    saveDayNote,
    toggleMilestone,
    recordViva,
    recordStudyHours,
    loadDemoData,
    resetData
  } = useTrackerData(currentUser, isDemoMode, handleSessionExpired);

  // Timer state
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Code review state
  const [sandboxCode, setSandboxCode] = useState('');
  const [reviewOutput, setReviewOutput] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // AI Mentor state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'mentor', text: "Welcome to CodeMentor! I'm your AI Backend Engineering Mentor & Placement Coach. Ask me to explain Java 17, Spring Boot 3.4, SQL, or System Design concepts, quiz you on your 45-day curriculum, or review your code." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  const dayData = getDaySyllabus(activeDay);

  // Sync activeNote with notes map
  useEffect(() => {
    setActiveNote(notes[activeDay] || '');
  }, [activeDay, notes]);

  useEffect(() => {
    if (dayData) setSandboxCode(dayData.dsa.starterCode);
    setReviewOutput('');
  }, [activeDay]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Route & Demo synchronizer
  useEffect(() => {
    if (location.pathname === '/demo') {
      handleExploreDemo();
    } else if (location.pathname === '/login') {
      setAuthModalIsLogin(true);
      setIsAuthModalOpen(true);
    } else if (location.pathname === '/register') {
      setAuthModalIsLogin(false);
      setIsAuthModalOpen(true);
    } else if (location.pathname.startsWith('/app') && !currentUser && !isDemoMode) {
      navigate('/');
      setAuthModalIsLogin(true);
      setIsAuthModalOpen(true);
    }
  }, [location.pathname, currentUser, isDemoMode]);

  // Keyboard shortcut for Command Palette (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
              recordStudyHours(sessionMins, timerMode);
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

  // Navigation helper
  const setCurrentTab = (tab, specificDay) => {
    if (specificDay) setActiveDay(specificDay);

    if (tab !== 'landing' && !currentUser && !isDemoMode) {
      setAuthModalIsLogin(true);
      setIsAuthModalOpen(true);
      return;
    }

    const targetPath = TAB_TO_PATH[tab] || '/app/dashboard';
    navigate(targetPath);
  };

  const handleExploreDemo = () => {
    setIsDemoMode(true);
    loadDemoData();
    setActiveDay(27);
    navigate('/app/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('studyTrackerUser');
    resetData();
    setIsProfileModalOpen(false);
    navigate('/');
  };

  // Mutator guards for Demo Mode
  const onToggleDay = (dayNum) => {
    if (isDemoMode && !currentUser) {
      setIsDemoGuardOpen(true);
      return;
    }
    toggleDayComplete(dayNum);
  };

  const onToggleDsa = () => {
    if (isDemoMode && !currentUser) {
      setIsDemoGuardOpen(true);
      return;
    }
    toggleDsaDone(activeDay);
  };

  const onSaveNote = () => {
    if (isDemoMode && !currentUser) {
      setIsDemoGuardOpen(true);
      return;
    }
    saveDayNote(activeDay, activeNote);
  };

  const onToggleMilestone = (id) => {
    if (isDemoMode && !currentUser) {
      setIsDemoGuardOpen(true);
      return;
    }
    toggleMilestone(id);
  };

  const onRecordVivaAttempt = (attempt) => {
    if (isDemoMode && !currentUser) {
      setIsDemoGuardOpen(true);
      return;
    }
    recordViva(attempt);
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
      setChatMessages([...nextMessages, { sender: 'mentor', text: `Error: ${err.message}. Make sure the backend server is running.` }]);
    } finally {
      setIsGenerating(false);
    }
  }

  if (!storageReady) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-slate-400 text-xs font-mono">
        Connecting to CodeMentor Java Backend...
      </div>
    );
  }

  const isPublicLanding = currentTab === 'landing';

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 font-sans antialiased selection:bg-brand-600 selection:text-white flex flex-col">
      {/* Action Rollback Error Toast */}
      {actionError && (
        <div className="fixed top-16 right-4 z-50 p-3.5 bg-rose-950/90 border border-rose-800 text-rose-200 text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {isPublicLanding ? (
        // Public SaaS Landing Experience
        <div className="flex flex-col min-h-screen">
          <Header
            isTimerRunning={isTimerRunning}
            timerMode={timerMode}
            timerSeconds={timerSeconds}
            handleTimerControl={handleTimerControl}
            handleTimerReset={handleTimerReset}
            formatTime={formatTime}
            currentUser={currentUser}
            isDemoMode={isDemoMode}
            onOpenAuth={() => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); }}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
            <LandingTab
              onExploreDemo={handleExploreDemo}
              onOpenAuth={(isLogin) => { setAuthModalIsLogin(isLogin); setIsAuthModalOpen(true); }}
              currentUser={currentUser}
            />
          </main>
        </div>
      ) : (
        // Authenticated & Interactive Demo Workspace Shell
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            completedDays={completedDays}
            currentUser={currentUser}
            isDemoMode={isDemoMode}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAuth={() => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); }}
            onLogout={handleLogout}
          />

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Header
              isTimerRunning={isTimerRunning}
              timerMode={timerMode}
              timerSeconds={timerSeconds}
              handleTimerControl={handleTimerControl}
              handleTimerReset={handleTimerReset}
              formatTime={formatTime}
              currentUser={currentUser}
              isDemoMode={isDemoMode}
              onOpenAuth={() => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); }}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            />

            <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar pb-20 lg:pb-8">
              {/* Interactive Demo Mode Banner */}
              {isDemoMode && !currentUser && (
                <div className="mb-6 p-4 bg-gradient-to-r from-brand-950 via-dark-card to-dark-surface border border-brand-500/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold tracking-wide uppercase font-mono">
                      Demo Preview Mode
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200">
                      You are exploring CodeMentor with sample telemetry. <strong>Sign in</strong> to save real learning progress to PostgreSQL.
                    </p>
                  </div>
                  <button
                    onClick={() => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              {/* View Router */}
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
                  handleToggleDayComplete={onToggleDay}
                  activeNote={activeNote}
                  setActiveNote={setActiveNote}
                  handleSaveNote={onSaveNote}
                  setCurrentTab={setCurrentTab}
                  currentUser={currentUser}
                  isDemoMode={isDemoMode}
                />
              )}

              {currentTab === 'syllabus' && (
                <SyllabusTab
                  activeDay={activeDay}
                  setActiveDay={setActiveDay}
                  completedDays={completedDays}
                  handleToggleDayComplete={onToggleDay}
                  dayData={dayData}
                  setCurrentTab={setCurrentTab}
                />
              )}

              {currentTab === 'coding' && (
                <CodingTab
                  activeDay={activeDay}
                  dayData={dayData}
                  completedDsa={completedDsa}
                  handleMarkDsaDone={onToggleDsa}
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
                  setVivaScore={() => {}}
                  onRecordViva={onRecordVivaAttempt}
                />
              )}

              {currentTab === 'project' && (
                <ProjectTab
                  projectMilestones={projectMilestones}
                  toggleMilestone={onToggleMilestone}
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
                  currentUser={currentUser}
                  onOpenAuth={() => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); }}
                />
              )}
            </main>

            <MobileNav
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenAuth={() => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); }}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentTab}
        onToggleTimer={handleTimerControl}
        isTimerRunning={isTimerRunning}
        apiBase={API_BASE}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialIsLogin={authModalIsLogin}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsDemoMode(false);
          localStorage.setItem('studyTrackerUser', JSON.stringify(user));
          setIsAuthModalOpen(false);
          navigate('/app/dashboard');
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        completedDays={completedDays}
        studyHours={studyHours}
        completedDsa={completedDsa}
        onLogout={handleLogout}
      />

      <DemoGuardModal
        isOpen={isDemoGuardOpen}
        onClose={() => setIsDemoGuardOpen(false)}
        onOpenAuth={(isLogin) => {
          setAuthModalIsLogin(isLogin);
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}
