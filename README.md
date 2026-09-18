# 🚀 45-Day Java Full-Stack Study Tracker

A highly interactive, full-stack study tracker designed to guide developers from zero to a backend placement in 45 days. 
Built with a **React** frontend and a true **Java Spring Boot** REST API backend.

## ✨ Features

- **📚 45-Day Curated Syllabus:** A complete roadmap covering Java Core, OOP, Data Structures & Algorithms, SQL Databases, Spring Boot, CI/CD, and System Design.
- **☕ Real Java Spring Boot API:** The application is no longer a mock frontend! It is powered by a robust Spring Boot REST API using Spring Data JPA and Hibernate.
- **🎥 Integrated Video Lessons:** High-quality, embeddable YouTube tutorials (from creators like TechWorld with Nana, ByteByteGo, and freeCodeCamp) curated for every single day.
- **💻 DSA Practice:** Direct links and starter code for 45 curated LeetCode problems (Array, LinkedList, Trees, DP, etc.).
- **📊 Analytics Dashboard:** Interactive visual charts (built with Recharts) tracking your study hours, DSA completion distribution, and placement readiness percentage.
- **🤖 AI Mentor:** An integrated AI chat assistant (powered securely by Google Gemini) to review your code, explain complex concepts, and quiz you.
- **🍅 Pomodoro Timer:** A built-in study timer (25m / 50m / 10m intervals) to keep you focused.
- **🌗 Dark/Light Mode Engine:** A beautiful, responsive UI that instantly toggles between glassmorphic dark mode and clean light mode.

## 📸 Screenshots

> **Note:** To see the live screenshots, visit the [live site](https://java-study-tracker-omega.vercel.app/) or drag-and-drop your images here in the GitHub editor!

<div align="center">
  <img src="./docs/Dashboard.png.png" alt="Dashboard View" width="800"/>
  <br/>
  <em>Dashboard View showing study analytics and progress.</em>
</div>
<br/>
<div align="center">
  <img src="./docs/Syllabus.png.png" alt="Syllabus View" width="800"/>
  <br/>
  <em>Syllabus & Notes tab featuring daily curated content.</em>
</div>

## 🛠️ Tech Stack

### Frontend (React)
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, Lucide Icons
- **Charts:** Recharts
- **AI Integration:** Node.js Express serverless functions (for Gemini API)

### Backend (Java)
- **Framework:** Java 17, Spring Boot 3.4.1
- **Architecture:** Controller-Service-Repository Pattern
- **Database:** H2 In-Memory (Dev) / PostgreSQL (Prod ready)
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security (CORS enabled)

## 🚀 Getting Started Locally

Because this is a full-stack application, you need to run both the Java Backend and the React Frontend simultaneously.

### 1. Clone the repository
```bash
git clone https://github.com/Satyamshiv0079/java-study-tracker.git
cd java-study-tracker
```

### 2. Start the Java Spring Boot Backend
Open a new terminal and navigate to the `backend` folder:
```bash
cd backend
# On Windows:
mvnw.cmd spring-boot:run
# On Mac/Linux:
./mvnw spring-boot:run
```
*The Java REST API will start on `http://localhost:8080`. It automatically seeds a default user to the database.*

### 3. Start the React Frontend
Open a **second** terminal in the root `java-study-tracker` folder:
```bash
npm install
npm run dev
```
*The React UI will start on `http://localhost:5173`. It will automatically fetch and save data to your Java backend!*

## 🌐 Deployment Status

- **Frontend:** Currently deployed on [Vercel](https://java-study-tracker-omega.vercel.app/).
- **Backend:** Currently running locally. 
*(Note: Because the backend is running locally, the Vercel live site will not be able to save progress until the Java API is deployed to a cloud provider like Render or Railway).*

## 📝 License
This project is open-source and available under the MIT License.
