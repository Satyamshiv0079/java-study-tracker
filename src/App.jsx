import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardTab from './components/DashboardTab';
import SyllabusTab from './components/SyllabusTab';
import CodingTab from './components/CodingTab';
import InterviewTab from './components/InterviewTab';
import ProjectTab from './components/ProjectTab';
import MentorTab from './components/MentorTab';
import AnalyticsTab from './components/AnalyticsTab';
import { getDaySyllabus } from './data/syllabus';

const USER_ID = 1; // Hardcoded user ID mapped to the Java backend seeder
const API_BASE = 'https://java-study-tracker.onrender.com';

export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(null);

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeDay, setActiveDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([1]);
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
    { sender: 'mentor', text: "Hi, I'm your Java/Spring/DSA study mentor. Ask me to explain a concept, quiz you, review your code, or fill in a day that doesn't have real content yet. (Powered securely by Node.js Backend)." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  const dayData = getDaySyllabus(activeDay);

  // --- Load persisted state from Java API and LocalStorage on mount ---
  useEffect(() => {
    async function loadData() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        // 1. Load Day Progress from real Java Backend
        const response = await fetch(`${API_BASE}/api/progress/${USER_ID}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const progressList = await response.json();
          const completedDaysList = progressList
            .filter(p => p.completed)
            .map(p => p.dayNumber);
          setCompletedDays(completedDaysList);
        }

        // 2. Load other stats from LocalStorage (since Java backend only tracks days right now)
        const localData = localStorage.getItem('studyTrackerData');
        if (localData) {
          const p = JSON.parse(localData);
          if (p.completedDsa) setCompletedDsa(p.completedDsa);
          if (typeof p.studyHours === 'number') setStudyHours(p.studyHours);
          if (p.notes) {
            setNotes(p.notes);
            setActiveNote(p.notes[1] || '');
          }
          if (p.vivaScore) setVivaScore(p.vivaScore);
          if (p.projectMilestones) setProjectMilestones(p.projectMilestones);
          if (p.chatMessages && Array.isArray(p.chatMessages) && p.chatMessages.length > 0) {
            setChatMessages(p.chatMessages);
          }
        }
      } catch (err) {
        console.error("Load error:", err);
        // Fallback to local storage if Java backend times out or fails
        const localData = localStorage.getItem('studyTrackerData');
        if (localData) {
          const p = JSON.parse(localData);
          if (p.completedDays) setCompletedDays(p.completedDays);
        }
        if (err.name !== 'AbortError') {
          setStorageError(`Backend sync delay: ${err.message}`);
        }
      } finally {
        setStorageReady(true);
      }
    }
    loadData();

    // Keep-alive ping to Render every 10 minutes to prevent cold starts
    const pingInterval = setInterval(() => {
      fetch(`${API_BASE}/api/progress/${USER_ID}`).catch(() => {});
    }, 10 * 60 * 1000);

    return () => clearInterval(pingInterval);
  }, []);

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
  }, [isTimerRunning, timerMode]);

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
      setTimeout(() => {
        setReviewOutput("Mocked Review: Your logic looks mostly correct. \nTime Complexity: O(N) \nSpace Complexity: O(1).\nConsider adding edge case checks for empty arrays.");
        setIsReviewing(false);
      }, 1500);
    } catch (err) {
      setReviewOutput(`Could not reach the review service: ${err.message}`);
      setIsReviewing(false);
    }
  }

  function handleMarkDsaDone() {
    if (!completedDsa.includes(activeDay)) {
      setCompletedDsa([...completedDsa, activeDay]);
    } else {
      setCompletedDsa(completedDsa.filter((d) => d !== activeDay));
    }
  }

  function handleSaveNote() {
    setNotes({ ...notes, [activeDay]: activeNote });
  }

  async function handleToggleDayComplete(dayNum) {
    const isNowComplete = !completedDays.includes(dayNum);
    setCompletedDays(
      isNowComplete ? [...completedDays, dayNum] : completedDays.filter((d) => d !== dayNum)
    );
    
    // Call the real Java Spring Boot API!
    try {
      await fetch(`${API_BASE}/api/progress/${USER_ID}/${dayNum}`, {
        method: 'POST'
      });
    } catch (err) {
      console.error("Failed to sync day to Java backend", err);
    }
  }

  function toggleMilestone(id) {
    setProjectMilestones(projectMilestones.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
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
      />

      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 overflow-y-auto custom-scrollbar">
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
          />
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
    </div>
  );
}
