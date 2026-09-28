# 🚀 CodeMentor — 45-Day Java & Spring Boot Placement Platform

A full-stack learning and placement-preparation platform designed to help developers build Java, Spring Boot, DSA, backend, AI, and interview skills through a structured 45-day curriculum.

CodeMentor combines a React frontend, Spring Boot backend, PostgreSQL, AI-powered learning tools, DSA practice, mock interviews, career analysis, and learning analytics into one platform.

The project is being developed with a focus on real backend engineering, security, persistence, testing, and production-oriented architecture rather than simply adding UI features.

---

## 📌 Project Status

**Current status**: Hardened Production Prototype (Java 17 + Spring Boot 3.4 + React 18)

The platform is backed by a fully tested, database-persisted backend:
- ✅ **Single Source of Truth**: All user learning progress (curriculum, DSA, study sessions, notes, viva attempts, capstone milestones) persists in PostgreSQL (Neon Cloud).
- ✅ **Spring Security 6 & JWT**: Fail-fast environment secret enforcement, custom 401 Unauthorized / 403 Forbidden handlers, RBAC, and strict user-resource isolation.
- ✅ **36 Automated Tests**: Comprehensive unit, integration, and security test suite (`mvnw test` passing 36/36).
- ✅ **Interactive Demo Preview**: Dedicated read-only exploratory mode with banner and seamless sign-in transition (no fake user tokens or dual-truth localStorage).
- ✅ **API Rate Limiting**: In-memory sliding window filter enforcing 10 req/min on `/api/auth/**` and 120 req/min on `/api/**` with HTTP 429 and `Retry-After`.
- ✅ **Flyway Migrations**: Production-grade automated schema migrations (`V1__init_schema.sql`) with baseline on migrate.
- ✅ **OpenAPI / Swagger 3.0**: Live interactive API documentation at `/swagger-ui/index.html` with BearerAuth JWT support.
- ✅ **Curriculum Search**: Semantic keyword search with relevance scoring and verified curriculum citations (`/api/knowledge/search`).
- ✅ **Live Code Execution**: Secure multi-language sandbox via Piston API (Java 17).

---

## 🎯 Goals

CodeMentor is designed around five primary goals:
1. **Learn Java systematically**
2. **Practice DSA consistently**
3. **Build real backend engineering skills**
4. **Use AI as a learning assistant**
5. **Track measurable placement preparation progress**

Instead of creating separate applications for studying, coding practice, interview preparation, and career preparation, CodeMentor brings these workflows into one platform.

---

## 🏗️ Architecture

```
                         ┌─────────────────────┐
                         │      React UI       │
                         │     Vite + CSS      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   REST API Layer    │
                         │     Spring Boot     │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ PostgreSQL   │      │ Spring       │      │ AI Services  │
      │ / H2         │      │ Security     │      │ Gemini / APIs │
      └──────────────┘      └──────────────┘      └──────────────┘
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ User Data    │      │ Auth / RBAC  │      │ AI Mentor    │
      │ Progress     │      │ JWT          │      │ RAG          │
      │ Analytics    │      │              │      │ Career Tools │
      └──────────────┘      └──────────────┘      └──────────────┘
```

---

## 🧰 Technology Stack

### Frontend
- React 18
- Vite
- JavaScript
- Tailwind CSS
- Responsive UI
- REST API integration

### Backend
- Java 17
- Spring Boot 3.4
- Spring Web
- Spring Data JPA
- Spring Security 6
- Jakarta Validation
- REST APIs

### Database
- PostgreSQL (Neon Cloud)
- H2 for local development/testing
- Flyway 12.4 (automated schema migrations with baseline-on-migrate)

### AI & LLM
- Google Gemini 2.5 Flash
- AI mentor & placement coach
- AI code review
- Resume & ATS analysis
- Mock viva generation
- Curriculum Knowledge Search (`/api/knowledge/search`) with verified citations

### Developer Tools & DevOps
- Docker & Dockerfile
- GitHub Actions CI/CD (`.github/workflows/build.yml`)
- Git
- Maven
- SpringDoc OpenAPI 3.0 & Swagger UI (`/swagger-ui/index.html`)

### External Services
- GitHub API
- Piston code execution API (Java 17 runtime)
- Gemini API (`v1beta`)

---

## ✨ Core Features

### 📚 45-Day Learning Curriculum
A structured learning roadmap covering:

```
Java → OOP → Collections → Exception Handling → Multithreading → SQL → Spring → Spring Boot → REST APIs → JPA/Hibernate → Security → Backend Development → Projects → Interview Prep
```

Each day contains learning objectives, resources, tasks, and progress tracking.

### 📊 Learning Dashboard
The dashboard provides a central view of preparation progress tracking:
- Completed days
- Learning progress
- DSA activity
- Study sessions
- Interview preparation
- Project progress
- Learning streaks
- Performance metrics

The long-term goal is to make these metrics fully database-backed and available across devices.

### 💻 DSA Practice
CodeMentor includes a coding environment designed for Java practice:
- Java coding editor
- Live code execution via Piston JVM engine
- Output display & stderr diagnostics
- Compilation/runtime feedback
- AI-assisted $O(N)$ code review
- Problem tracking

The execution layer uses an external sandbox service rather than executing arbitrary Java code directly inside the Spring Boot server.

### 🤖 AI Mentor
The AI mentor acts as a learning assistant rather than replacing the learning process. It helps with:
- Java concepts
- Spring Boot architecture
- DSA explanations
- Debugging assistance
- Interview preparation
- Project questions
- Learning guidance

Interaction flow:
```
User Question → Context Detection → Relevant Knowledge → AI Model → Explanation
```

### 🧠 Knowledge & RAG
The project contains a knowledge-grounding foundation for providing AI responses based on the CodeMentor curriculum.

Target architecture:
```
Learning Documents → Document Chunking → Embeddings → Vector Database → Similarity Search → Relevant Context → Gemini → Grounded Response
```
The current implementation is still being evolved toward a complete vector-search architecture using PostgreSQL/pgvector.

### 🎤 AI Mock Interviews
The platform can generate technical interview questions based on the learner's preparation across Java, OOP, DSA, SQL, Spring Boot, REST APIs, and System Design.

Features:
- Technical questions
- User answers
- AI feedback & missing keywords
- Performance scores (1-10)
- Improvement suggestions

### 📄 Resume & ATS Analysis
The career module provides AI-assisted resume analysis evaluating:
- Resume structure
- Technical keywords
- Job-description alignment
- Skills & project descriptions
- Achievement statements
- ATS compatibility scoring

### 💼 Career Tools
The platform includes career-oriented utilities:
- Resume analysis
- ATS optimization
- LinkedIn optimization
- Job-description analysis
- GitHub profile analysis
- Skill-gap analysis

### 🐙 GitHub Analysis
The GitHub integration analyzes publicly available development activity:
- Repository count
- Primary programming languages
- Commit activity & consistency
- Repository distribution

### 📈 Analytics
The analytics layer tracks real learning activity:
- **Study Time**: Daily, Weekly, Monthly trends
- **DSA**: Problems Solved, Success Rate, Topic Performance
- **Interview**: Attempts, Scores, Improvement
- **Curriculum**: Completed Days, Completion Rate, Learning Streak

---

## 🔐 Security Architecture

Security is implemented at both network filter and application levels:

```
Request → RateLimitingFilter (Sliding Window HTTP 429)
           ↓
       JwtAuthenticationFilter (Bearer token validation)
           ↓
       SecurityFilterChain (CORS + CSRF disabled + Stateless)
           ↓ (Exception: AuthenticationEntryPoint → 401 JSON)
           ↓ (Exception: AccessDeniedHandler → 403 JSON)
       Controller (Authenticated Principal / Role-based access)
           ↓
       Service Layer (User-isolation verification: record.userId == principal.userId)
```

Key security mechanisms implemented:
- **Fail-Fast Secret Validation**: Backend will refuse to boot (`IllegalStateException`) if `JWT_SECRET` is unset or less than 256 bits (32 bytes). No insecure fallback keys in production.
- **Explicit 401 vs 403 JSON Responses**: Missing or invalid tokens return standard RFC-compliant HTTP 401 Unauthorized JSON; insufficient privileges return HTTP 403 Forbidden JSON.
- **Sliding-Window IP Rate Limiter**: `RateLimitingFilter` limits sensitive auth endpoints (`/api/auth/**`) to 10 req/min and general API endpoints to 120 req/min, emitting `Retry-After: 60` headers on HTTP 429.
- **User-Resource Isolation**: All data queries and mutations resolve the caller's identity via Spring Security's `Authentication.getName()` / `User.getId()`. Users cannot view or modify another user's progress, DSA submissions, notes, or viva attempts.
- **CORS Protection**: Restricted strictly to authorized origins (`FRONTEND_URL` environment variable, Vercel preview domains, and localhost).

---

## 🗄️ Database Design

The persistence layer is backed by PostgreSQL (Neon Cloud) in production and H2 during isolated testing, managed via Flyway automated migrations:

```
User (users)
 ├── DayProgress (day_progress)
 ├── DsaSubmission (dsa_submissions)
 ├── StudySession (study_sessions)
 ├── Note (notes)
 ├── VivaAttempt (viva_attempts)
 ├── ProjectMilestone (project_milestones)
 ├── ChatSession (chat_sessions)
 └── CareerAnalysis (career_analyses)
```

Schema migration script:
- `backend/src/main/resources/db/migration/V1__init_schema.sql` initializes all relational tables, foreign key constraints (`ON DELETE CASCADE`), and performance indexes on `user_id` and timestamps.

---

## 🧱 Backend Architecture

The backend follows a clean layered Spring Boot architecture:
```
Controller (REST Endpoints & Validation)
    ↓
Service Layer (Business Logic & User Ownership Checks)
    ↓
Repository Layer (Spring Data JPA / Custom JPQL Queries)
    ↓
Database (PostgreSQL / Neon Cloud)
```
Supporting modules:
- `security/`: `JwtUtil`, `JwtAuthenticationFilter`, `RateLimitingFilter`, `CustomUserDetailsService`
- `exception/`: Global `@RestControllerAdvice` mapping validation and domain exceptions to standardized JSON error envelopes.
- `dto/`: Request/Response contracts separating API contracts from JPA entity lifecycles.
- `config/`: `SecurityConfig`, `OpenApiConfig`, `WebConfig`.

---

## 🧪 Testing Strategy

The backend includes a comprehensive automated test suite consisting of **41 unit and integration tests**:

- **Security, Authorization & User-Isolation Tests** (`SecurityIntegrationTest` — 12 tests):
  - 401 Unauthorized on unauthenticated requests to protected endpoints.
  - 403 Forbidden vs 200 OK on role-restricted endpoints (`ROLE_ADMIN` vs `ROLE_USER`).
  - Strict multi-domain user isolation:
    - User B cannot see or mutate User A's `DayProgress`.
    - User B cannot see User A's solved `DsaSubmission` records.
    - User B cannot access or overwrite User A's private study `Note` records.
    - User B's `StudySession` hours remain 0.0 when User A logs study sessions.
- **GitHub Live API & Fallback Test** (`GitHubServiceTest` — 1 test):
  - Verified live API querying with in-memory TTL caching and strict zero-fabrication guarantees on rate limiting.
- **Rate Limiting Tests** (`RateLimitingFilterTest` — 5 tests):
  - Sliding-window throughput, burst limits, and HTTP 429 rejection on auth endpoints.
- **JWT Cryptography Tests** (`JwtUtilTest` — 3 tests):
  - Fail-fast validation on empty or weak (<32 bytes) keys, token generation, and signature verification.
- **Domain Service Tests** (19 tests):
  - `DayProgressServiceTest`, `DsaSubmissionServiceTest`, `StudySessionServiceTest`, `UserServiceTest`, `AnalyticsServiceTest`, `KnowledgeSearchServiceTest`.
- **Application Context Test** (`DemoApplicationTests` — 1 test):
  - Spring Boot context bootstrapping with full bean lifecycle verification.

Run all tests locally:
```bash
cd backend
./mvnw test
```

---

## 🚀 Production Hardening Status

### ✅ Completed
- [x] JWT + Spring Security 6 with fail-fast secret checks
- [x] Explicit HTTP 401 (Unauthorized) and HTTP 403 (Forbidden) handlers
- [x] Strict user-resource authorization and multi-domain ownership isolation (Progress, DSA, Notes, Sessions)
- [x] Full PostgreSQL persistence for curriculum, DSA, study sessions, notes, viva, and milestones
- [x] Elimination of authenticated-state dual source of truth in `localStorage`
- [x] Read-only interactive Demo Preview mode (`/demo`) with clear onboarding flow
- [x] IP sliding-window rate limiting (HTTP 429 with `Retry-After`)
- [x] SpringDoc OpenAPI 3.0 / Swagger UI documentation with BearerAuth
- [x] Flyway automated schema migrations (`V1__init_schema.sql`)
- [x] 41 automated unit, integration, and security tests passing
- [x] Live GitHub integration via dedicated `GitHubService` with in-memory TTL caching and zero fake data
- [x] Client-side optimistic updates with automatic rollback on network/server errors
- [x] Modular frontend architecture (`src/api/`, `src/hooks/useTrackerData.js`)
- [x] Tightened CORS configuration with explicit allowed and exposed headers
- [x] Production profile (`application-prod.yml`) with Hikari pool tuning and `ddl-auto: validate`

### 🟡 Next Enhancements
- [ ] Transition from local sliding-window to Redis distributed rate limiting
- [ ] Migrate in-memory curriculum semantic keyword search to PostgreSQL `pgvector`
- [ ] Add Spring Boot Actuator health & Prometheus metrics endpoints
- [ ] Add client-side bookmarkable routing via React Router

---

## 🛑 What Will Not Be Added Just for Feature Count

The project intentionally prioritizes depth over feature quantity. Planned development avoids adding:
- Unnecessary AI chatbots or social feeds
- UI-only notification systems or decorative animations
- Payment systems without a real use case
- Unnecessary microservices without architectural need

The goal is to make existing functionality secure, persistent, testable, scalable, and defensible in technical interviews.

---

## 🔍 Known Limitations

The current version should not be considered fully production-ready. Known areas being improved:
- Authentication/authorization hardening
- Complete PostgreSQL persistence
- Database migrations & testing coverage
- Vector retrieval refinement
- Real leaderboard data consolidation

---

## 🧹 Implementation Consistency Checklist

- README Spring Boot version matches `pom.xml` (3.4)
- README React version matches `package.json` (18)
- UI Java version matches actual execution runtime (Java 17)
- Database documentation matches active Spring profiles
- AI Code Review contains no mock fallback
- Production claims are backed by implementation

---

## 🛠️ Recommended Engineering Order

1. JWT + Spring Security
2. User-resource authorization
3. PostgreSQL persistence
4. DTO + validation + exception handling
5. Unit + integration + security tests
6. Remove mock/hardcoded implementations
7. Flyway migrations
8. Real pgvector RAG
9. Swagger + rate limiting
10. Production hardening

---

## 📁 Recommended GitHub Structure

```
java-study-tracker/
│
├── src/                      # React Frontend Source
├── api/                      # Serverless AI & Integration Handlers
├── backend/                  # Spring Boot 3.4 REST API
│   └── src/main/java/com/example/demo/
├── docs/                     # Screenshot Assets & Documentation
├── Dockerfile                # Backend Production Containerization
├── docker-compose.yml        # Docker Multi-Container Compose
└── README.md                 # System Architecture & Guide
```

---

## ⚙️ Local Development

### Prerequisites
- Java 17+
- Node.js 20+
- Maven
- PostgreSQL / H2
- Git

### Clone
```bash
git clone https://github.com/Satyamshiv0079/java-study-tracker.git
cd java-study-tracker
```

### Start Backend
```bash
cd backend
mvn spring-boot:run
# Backend runs at: http://localhost:8080
```

### Start Frontend
```bash
npm install
npm run dev
# Frontend runs at: http://localhost:5173
```

---

## 🔑 Environment Variables

```env
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=

GEMINI_API_KEY=
GITHUB_TOKEN=
JWT_SECRET=
```

---

## 🧠 Engineering Principles

1. **Build before adding features**: Hardening existing modules over introducing raw feature count.
2. **Backend is the source of truth**: Persisting data server-side rather than relying strictly on browser state.
3. **Security by design**: Authentication, authorization, and validation built into API design.
4. **AI assists learning**: Providing structured feedback rather than raw answer generation.
5. **Measurable progress**: Telemetry tracking growth over time.

---

## 👨‍💻 Author

**Satyam Shiv**  
*Computer Science & Engineering*  
- **GitHub**: [Satyamshiv0079](https://github.com/Satyamshiv0079)  
- **LinkedIn**: [Satyam Shiv](https://www.linkedin.com/in/satyamshiv0079/)

---

## ⭐ Project Philosophy

> *Don't build a project that only looks impressive. Build one that can survive an engineer's questions.*
