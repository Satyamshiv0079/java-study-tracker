-- ====================================================================
-- CodeMentor Database Schema Migration: V1__init_schema.sql
-- Compatible with PostgreSQL 14+ and H2 in PostgreSQL compatibility mode
-- ====================================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);

-- 2. Day Progress (Curriculum syllabus days 1 - 45)
CREATE TABLE IF NOT EXISTS day_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_user_day UNIQUE (user_id, day_number)
);

-- 3. DSA Submissions (LeetCode style code submissions per day)
CREATE TABLE IF NOT EXISTS dsa_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    problem_title VARCHAR(255),
    code TEXT,
    language VARCHAR(32),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    time_complexity VARCHAR(64),
    space_complexity VARCHAR(64),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_dsa_day UNIQUE (user_id, day_number)
);

-- 4. Study Sessions (Pomodoro & study time tracking logs)
CREATE TABLE IF NOT EXISTS study_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL,
    mode VARCHAR(32) NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. User Notes (Daily Markdown study notes)
CREATE TABLE IF NOT EXISTS user_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    content TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_note_day UNIQUE (user_id, day_number)
);

-- 6. Viva Attempts (Technical mock interview evaluations)
CREATE TABLE IF NOT EXISTS viva_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(64),
    question TEXT NOT NULL,
    user_answer TEXT,
    score INT NOT NULL,
    passed BOOLEAN NOT NULL,
    feedback TEXT,
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Project Milestone Progress (8-milestone fullstack capstone)
CREATE TABLE IF NOT EXISTS project_milestone_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    milestone_id INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_milestone UNIQUE (user_id, milestone_id)
);

-- 8. Knowledge Documents (Curriculum grounding corpus)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    day_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_day_progress_user ON day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_dsa_submissions_user ON dsa_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_viva_attempts_user ON viva_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_milestone_user ON project_milestone_progress(user_id);
