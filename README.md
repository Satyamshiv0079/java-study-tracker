# 🚀 45-Day Java Backend Study Tracker

A highly interactive, full-stack study tracker designed to guide developers from zero to a backend placement in 45 days. Built with React, Tailwind CSS, Vite, and Node.js.

## ✨ Features

- **📚 45-Day Curated Syllabus:** A complete roadmap covering Java Core, OOP, Data Structures & Algorithms, SQL Databases, Spring Boot, CI/CD, and System Design.
- **🎥 Integrated Video Lessons:** High-quality, embeddable YouTube tutorials (from creators like TechWorld with Nana, ByteByteGo, and freeCodeCamp) curated for every single day.
- **💻 DSA Practice:** Direct links and starter code for 45 curated LeetCode problems (Array, LinkedList, Trees, DP, etc.).
- **📊 Analytics Dashboard:** Interactive visual charts (built with Recharts) tracking your study hours, DSA completion distribution, and placement readiness percentage.
- **🤖 AI Mentor:** An integrated AI chat assistant (powered securely by Google Gemini via a Node.js backend) to review your code, explain complex concepts, and quiz you.
- **🍅 Pomodoro Timer:** A built-in study timer (25m / 50m / 10m intervals) to keep you focused.
- **🌗 Dark/Light Mode Engine:** A beautiful, responsive UI that instantly toggles between glassmorphic dark mode and clean light mode.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts
- **Backend (AI Mentor):** Node.js, Express, Vercel Serverless Functions
- **AI Engine:** Google Gemini 2.5 Flash API
- **State Management:** React Hooks & Local Storage

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Satyamshiv0079/java-study-tracker.git
cd java-study-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Development Server
This project uses `concurrently` to run both the Vite frontend and the Node.js backend simultaneously.
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment (Vercel)
This project is configured to be deployed easily on Vercel. The `api/chat.js` file acts as a Vercel Serverless Function to securely handle the Gemini API calls without exposing your keys to the frontend.

1. Import the repository into Vercel.
2. Add your `GEMINI_API_KEY` to the Vercel Environment Variables.
3. Deploy!

## 📝 License
This project is open-source and available under the MIT License.
