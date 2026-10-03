# Maintenance & Migration Scripts

This directory contains historical developer utility and migration scripts used during early project development.

> [!WARNING]
> These are **one-time migration scripts**. They are **NOT** runtime dependencies, are **NOT** part of the CI/CD pipeline, and **SHOULD NOT** be rerun on the active codebase as doing so would cause duplicate insertions or syntax errors.

---

### Script Inventory

#### 1. `inject-weeks.js`
- **Purpose**: Appended Week 3 (SQL Basics, Joins, Transactions) and Week 4 syllabus objects into `src/data/syllabus.js`.
- **Classification**: Historical One-Time Migration Script.
- **Safe to rerun?**: **NO**. Rerunning will insert duplicate day objects into `src/data/syllabus.js`.
- **Expected Input**: `src/data/syllabus.js` with days 1–14.
- **Expected Output**: Updated `src/data/syllabus.js` with days 15–28 and extended category color mappings.

#### 2. `inject-weeks-6-7.js`
- **Purpose**: Appended Week 6 (Cloud, Docker, CI/CD) and Week 7 curriculum milestones and interview questions into `src/data/syllabus.js`.
- **Classification**: Historical One-Time Migration Script.
- **Safe to rerun?**: **NO**. Rerunning will inject duplicate array entries into the syllabus dataset.
- **Expected Input**: `src/data/syllabus.js` with days 1–35.
- **Expected Output**: Updated `src/data/syllabus.js` with days 36–45.

#### 3. `refactor-theme.js`
- **Purpose**: Automated bulk replacement of hardcoded Tailwind CSS slate classes with dual light/dark mode utility classes (e.g., `bg-slate-900` -> `bg-white dark:bg-slate-900`) across core UI components.
- **Classification**: Historical One-Time Refactoring Script.
- **Safe to rerun?**: **NO**. Safe regular expressions prevent most nesting, but components have since received custom styling that would be overwritten.
- **Expected Input**: Legacy `src/components/*.jsx` with hardcoded dark classes.
- **Expected Output**: Responsive components supporting Tailwind CSS `dark:` class variant toggles.
