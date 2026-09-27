# 🚀 CodeMentor — 45-Day Java & Spring Boot Placement Platform

A full-stack learning and placement-preparation platform designed to help developers build Java, Spring Boot, DSA, backend, AI, and interview skills through a structured 45-day curriculum.

CodeMentor combines a React frontend, Spring Boot backend, PostgreSQL, AI-powered learning tools, DSA practice, mock interviews, career analysis, and learning analytics into one platform.

The project is being developed with a focus on real backend engineering, security, persistence, testing, and production-oriented architecture rather than simply adding UI features.

---

## 📌 Project Status

**Current status**: Active development

The application currently has a functional full-stack foundation with the following areas implemented:
- 45-day Java/Spring Boot curriculum
- Learning dashboard
- Day-wise progress tracking
- DSA practice environment
- Java code execution integration
- AI mentor
- AI code review
- Mock technical/viva interviews
- Resume/ATS analysis
- LinkedIn optimization
- GitHub analysis
- Career analysis
- Knowledge/RAG foundation
- Analytics dashboard
- Capstone project tracking
- PostgreSQL/H2 persistence foundation
- Spring Boot REST APIs
- React + Vite frontend
- Docker configuration
- CI/CD foundation

Several production-hardening features are intentionally listed under Roadmap because they still require deeper implementation.

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
- Flyway (planned production migration layer)

### AI & LLM
- Google Gemini 2.5 Flash
- AI mentor & placement coach
- AI code review
- Resume & ATS analysis
- Mock viva generation
- Knowledge-grounded responses

### Developer Tools & DevOps
- Docker & Dockerfile
- GitHub Actions CI/CD (`.github/workflows/build.yml`)
- Git
- Maven
- Swagger / OpenAPI (planned)

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

Security is an active development area.

Target authentication architecture:
```
Login → Credential Validation → Spring Security → JWT / Secure Session → Authenticated Request → Authorization → Controller
```

Planned/ongoing security improvements:
- Spring Security 6
- Secure authentication & BCrypt password hashing
- JWT/session-based authentication
- Role-based access control (RBAC)
- Protected REST endpoints
- Request validation & rate limiting
- Secure CORS configuration

---

## 🗄️ Database Design

The database architecture is being expanded from basic user/progress persistence toward a complete learning data model.

Target model:
```
User
 ├── DayProgress
 ├── DsaSubmission
 ├── StudySession
 ├── Note
 ├── VivaAttempt
 ├── ProjectMilestone
 ├── ChatSession
 └── CareerAnalysis
```

Example schema:
```sql
users (id, username, email, password_hash, role, created_at)
day_progress (id, user_id, day_number, completed, completed_at)
dsa_submissions (id, user_id, problem_id, language, code, status, submitted_at)
```

---

## 🧱 Backend Architecture

The backend follows a layered Spring Boot architecture:
```
Controller → Service → Repository → Database
```
Supporting layers: DTO, Mapper, Validation, Security, Exception Handler, Configuration, and Integration Services.

---

## 🧪 Testing Strategy

Target testing structure:
- **Unit Tests**: Services, Business Rules, Utilities
- **Integration Tests**: REST APIs, Database, Authentication
- **Security Tests**: Unauthorized access, User isolation, Role permissions

---

## 🚀 Production Hardening Roadmap

### 🔴 High Priority
- Implement JWT/secure session authentication
- Protect all private REST endpoints
- Implement user-resource authorization
- Remove plaintext-password fallback
- Remove hardcoded/mock implementations
- Move important frontend state to PostgreSQL
- Add comprehensive backend tests
- Add global exception handling & DTO validation

### 🟠 Medium Priority
- Add Flyway database migrations
- Implement PostgreSQL/pgvector RAG
- Add Swagger/OpenAPI documentation
- Add API rate limiting & token controls
- Add health checks & Spring Boot Actuator
- Improve Docker production configuration

### 🟢 Feature Completion
- Persist DSA submissions & study sessions
- Persist interview attempts
- Build database-backed leaderboard
- Build real analytics aggregation

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
