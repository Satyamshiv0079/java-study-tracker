import { apiClient, API_BASE } from './client';

// 1. Day Progress API
export async function fetchDayProgress(token, signal) {
  return apiClient('/api/progress/me', { token, signal });
}

export async function toggleDayProgress(token, dayNum) {
  return apiClient(`/api/progress/me/${dayNum}`, { method: 'POST', token });
}

// 2. DSA Submissions API
export async function fetchDsaSubmissions(token) {
  return apiClient('/api/dsa/me', { token });
}

export async function toggleDsaSubmission(token, dayNum) {
  return apiClient(`/api/dsa/me/${dayNum}/toggle`, { method: 'POST', token });
}

// 3. Study Sessions API
export async function fetchTotalStudyHours(token) {
  return apiClient('/api/study-sessions/me/total-hours', { token });
}

export async function recordStudySession(token, durationMinutes, mode) {
  return apiClient('/api/study-sessions/me', {
    method: 'POST',
    token,
    body: JSON.stringify({ durationMinutes, mode })
  });
}

// 4. Notes API
export async function fetchNotes(token) {
  return apiClient('/api/notes/me', { token });
}

export async function saveNote(token, dayNum, content) {
  return apiClient(`/api/notes/me/${dayNum}`, {
    method: 'POST',
    token,
    body: JSON.stringify({ content })
  });
}

// 5. Viva Attempts API
export async function fetchVivaSummary(token) {
  return apiClient('/api/viva/me/summary', { token });
}

export async function recordVivaAttempt(token, attempt) {
  return apiClient('/api/viva/me', {
    method: 'POST',
    token,
    body: JSON.stringify({
      category: attempt.category || 'Java Core',
      question: attempt.question,
      userAnswer: attempt.userAnswer || '',
      score: attempt.score,
      feedback: attempt.feedback || ''
    })
  });
}

// 6. Project Milestones API
export async function fetchProjectMilestones(token) {
  return apiClient('/api/projects/me', { token });
}

export async function toggleProjectMilestone(token, milestoneId) {
  return apiClient(`/api/projects/me/${milestoneId}/toggle`, { method: 'POST', token });
}

// 7. Analytics API
export async function fetchAnalytics(token) {
  return apiClient('/api/analytics/me', { token });
}

// 8. Health Check
export async function pingHealth() {
  return fetch(`${API_BASE}/api/health`).then(res => res.json()).catch(() => null);
}

// 9. Enterprise RAG & Knowledge Base API
export async function fetchRagHealth(token) {
  return apiClient('/api/rag/health', { token });
}

export async function fetchRagDocuments(token) {
  return apiClient('/api/rag/documents', { token });
}

export async function uploadRagDocument(token, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const url = `${API_BASE}/api/rag/documents/upload`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(err.message || 'Upload failed');
  }
  return response.json();
}

export async function deleteRagDocument(token, documentId) {
  return apiClient(`/api/rag/documents/${documentId}`, {
    method: 'DELETE',
    token
  });
}

export async function queryRag(token, question, topK = 4, debugMode = false) {
  return apiClient('/api/rag/query', {
    method: 'POST',
    token,
    body: JSON.stringify({ question, topK, debugMode })
  });
}

export async function evaluateRag(token, topK = 4) {
  return apiClient(`/api/rag/evaluate?topK=${topK}`, {
    method: 'POST',
    token
  });
}

