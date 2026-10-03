import { useState, useEffect } from 'react';
import * as trackerApi from '../api/trackerApi';

const DEFAULT_MILESTONES = [
  { id: 1, name: "Initialize Spring Boot project & pom.xml setup", done: false },
  { id: 2, name: "Establish Postgres/H2 schema & application.yml configuration", done: false },
  { id: 3, name: "Write entity classes with real database relations", done: false },
  { id: 4, name: "Add Spring Security, JWT filter, and PasswordEncoder", done: false },
  { id: 5, name: "Implement REST controllers and global exception handling", done: false },
  { id: 6, name: "Build frontend and wire it to the real API", done: false },
  { id: 7, name: "Handle auth flow end-to-end (login, token storage, protected routes)", done: false },
  { id: 8, name: "Write tests, then actually deploy both frontend and backend", done: false }
];

export function useTrackerData(currentUser, isDemoMode, onSessionExpired) {
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [completedDays, setCompletedDays] = useState([]);
  const [completedDsa, setCompletedDsa] = useState([]);
  const [studyHours, setStudyHours] = useState(0);
  const [notes, setNotes] = useState({});
  const [vivaScore, setVivaScore] = useState({ correct: 0, total: 0 });
  const [projectMilestones, setProjectMilestones] = useState(DEFAULT_MILESTONES);

  // Clear action error after 4 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  // Load from PostgreSQL API on mount / user change
  useEffect(() => {
    async function loadAllData() {
      if (!currentUser || !currentUser.token) {
        setStorageReady(true);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      try {
        let hasSyncIssue = false;

        // 1. Day Progress
        try {
          const progressList = await trackerApi.fetchDayProgress(currentUser.token, controller.signal);
          clearTimeout(timeoutId);
          if (Array.isArray(progressList)) {
            setCompletedDays(progressList.filter(p => p.completed).map(p => p.dayNumber));
          }
        } catch (err) {
          clearTimeout(timeoutId);
          if (err.status === 401 || err.status === 403) {
            onSessionExpired?.();
            setStorageReady(true);
            return;
          }
          hasSyncIssue = true;
        }

        // 2. DSA Submissions
        try {
          const dsaList = await trackerApi.fetchDsaSubmissions(currentUser.token);
          if (Array.isArray(dsaList)) {
            setCompletedDsa(dsaList.filter(d => d.completed).map(d => d.dayNumber));
          }
        } catch {
          hasSyncIssue = true;
        }

        // 3. Study Hours
        try {
          const hoursData = await trackerApi.fetchTotalStudyHours(currentUser.token);
          if (hoursData && typeof hoursData.totalHours === 'number') {
            setStudyHours(hoursData.totalHours);
          }
        } catch {
          hasSyncIssue = true;
        }

        // 4. Notes
        try {
          const notesMap = await trackerApi.fetchNotes(currentUser.token);
          if (notesMap && typeof notesMap === 'object') {
            setNotes(notesMap);
          }
        } catch {
          hasSyncIssue = true;
        }

        // 5. Viva Scores
        try {
          const vivaData = await trackerApi.fetchVivaSummary(currentUser.token);
          if (vivaData) {
            setVivaScore({
              correct: vivaData.passedAttempts || 0,
              total: vivaData.totalAttempts || 0
            });
          }
        } catch {
          hasSyncIssue = true;
        }

        // 6. Project Milestones
        try {
          const projList = await trackerApi.fetchProjectMilestones(currentUser.token);
          if (Array.isArray(projList) && projList.length > 0) {
            setProjectMilestones(prev => prev.map(m => {
              const match = projList.find(p => p.milestoneId === m.id);
              return match ? { ...m, done: match.completed } : m;
            }));
          }
        } catch {
          hasSyncIssue = true;
        }

        setStorageError(hasSyncIssue ? "Notice: Some progress could not be fetched from the database." : null);

      } catch (err) {
        console.error("Backend load error:", err);
        setStorageError("Unable to connect to the backend database service. Please retry.");
      } finally {
        setStorageReady(true);
      }
    }

    loadAllData();

    // Background keep-alive
    const ping = setInterval(() => {
      trackerApi.pingHealth();
    }, 10 * 60 * 1000);

    return () => clearInterval(ping);
  }, [currentUser]);

  // --- Mutators with Optimistic Updates & Automatic Rollback ---

  // 1. Toggle Day Progress with Rollback
  const toggleDayComplete = async (dayNum) => {
    const previousDays = [...completedDays];
    const isNowComplete = !completedDays.includes(dayNum);

    // Optimistic update
    setCompletedDays(
      isNowComplete ? [...completedDays, dayNum] : completedDays.filter((d) => d !== dayNum)
    );

    if (currentUser && currentUser.token) {
      try {
        await trackerApi.toggleDayProgress(currentUser.token, dayNum);
      } catch (err) {
        console.error("Failed to sync day progress to backend, rolling back:", err);
        // Rollback to previous state
        setCompletedDays(previousDays);
        setActionError(`Failed to save Day ${dayNum} progress to database. Reverted.`);
      }
    }
  };

  // 2. Toggle DSA Submission with Rollback
  const toggleDsaDone = async (dayNum) => {
    const previousDsa = [...completedDsa];
    const isNowDone = !completedDsa.includes(dayNum);

    // Optimistic update
    setCompletedDsa(
      isNowDone ? [...completedDsa, dayNum] : completedDsa.filter((d) => d !== dayNum)
    );

    if (currentUser && currentUser.token) {
      try {
        await trackerApi.toggleDsaSubmission(currentUser.token, dayNum);
      } catch (err) {
        console.error("Failed to sync DSA submission to backend, rolling back:", err);
        // Rollback to previous state
        setCompletedDsa(previousDsa);
        setActionError(`Failed to save DSA status for Day ${dayNum} to database. Reverted.`);
      }
    }
  };

  // 3. Save Note with Rollback
  const saveDayNote = async (dayNum, content) => {
    const previousNote = notes[dayNum] || '';

    // Optimistic update
    setNotes(prev => ({ ...prev, [dayNum]: content }));

    if (currentUser && currentUser.token) {
      try {
        await trackerApi.saveNote(currentUser.token, dayNum, content);
      } catch (err) {
        console.error("Failed to sync note to backend, rolling back:", err);
        // Rollback
        setNotes(prev => ({ ...prev, [dayNum]: previousNote }));
        setActionError(`Failed to save note for Day ${dayNum} to database. Reverted.`);
      }
    }
  };

  // 4. Toggle Project Milestone with Rollback
  const toggleMilestone = async (id) => {
    const previousMilestones = [...projectMilestones];

    // Optimistic update
    setProjectMilestones(prev => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));

    if (currentUser && currentUser.token) {
      try {
        await trackerApi.toggleProjectMilestone(currentUser.token, id);
      } catch (err) {
        console.error("Failed to sync project milestone to backend, rolling back:", err);
        // Rollback
        setProjectMilestones(previousMilestones);
        setActionError(`Failed to save milestone #${id} to database. Reverted.`);
      }
    }
  };

  // 5. Record Viva Attempt
  const recordViva = async (attempt) => {
    const previousViva = { ...vivaScore };

    // Optimistic update
    if (attempt.score >= 7) {
      setVivaScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setVivaScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    if (currentUser && currentUser.token) {
      try {
        await trackerApi.recordVivaAttempt(currentUser.token, attempt);
      } catch (err) {
        console.error("Failed to record viva attempt to backend, rolling back:", err);
        setVivaScore(previousViva);
        setActionError("Failed to save viva evaluation to database. Reverted.");
      }
    }
  };

  // 6. Record Study Session
  const recordStudyHours = async (sessionMins, mode) => {
    if (sessionMins <= 0) return;
    const addedHours = parseFloat((sessionMins / 60).toFixed(1));
    const previousHours = studyHours;

    setStudyHours(prev => parseFloat((prev + addedHours).toFixed(1)));

    if (currentUser && currentUser.token) {
      try {
        await trackerApi.recordStudySession(currentUser.token, sessionMins, mode);
      } catch (err) {
        console.error("Failed to record study session to backend, rolling back:", err);
        setStudyHours(previousHours);
        setActionError("Failed to save study session to database. Reverted.");
      }
    }
  };

  // 7. Load Demo Sample Data
  const loadDemoData = () => {
    setCompletedDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    setCompletedDsa([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]);
    setStudyHours(94.5);
    setVivaScore({ correct: 21, total: 25 });
    setProjectMilestones(prev => prev.map((m, i) => ({ ...m, done: i < 6 })));
    setStorageError(null);
    setActionError(null);
  };

  // 8. Reset Data on Logout
  const resetData = () => {
    setCompletedDays([]);
    setCompletedDsa([]);
    setStudyHours(0);
    setNotes({});
    setVivaScore({ correct: 0, total: 0 });
    setProjectMilestones(DEFAULT_MILESTONES);
    setStorageError(null);
    setActionError(null);
  };

  return {
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
  };
}
