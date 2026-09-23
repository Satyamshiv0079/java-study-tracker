import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { historyContent, activeDayTitle } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the server." } });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: { text: `You are a direct, technically rigorous Software Engineering mentor helping a student prepare for Backend Java-Spring interviews. Do not use overly fluffy language. Keep explanations extremely concise and code-focused. Current context: ${activeDayTitle || 'Unknown'}.` }
        },
        contents: historyContent
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    res.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.post('/api/career', async (req, res) => {
  try {
    const { type, text, fileData, mimeType, url, targetRole } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the server." } });
    }

    let fetchedUrlContent = "";
    if (url && url.trim().startsWith("http")) {
      try {
        const urlRes = await fetch(url.trim(), {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
        });
        if (urlRes.ok) {
          const rawHtml = await urlRes.text();
          fetchedUrlContent = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                     .replace(/<[^>]+>/g, ' ')
                                     .replace(/\s+/g, ' ')
                                     .slice(0, 8000);
        }
      } catch (e) {
        console.warn("URL Fetch Warning:", e.message);
      }
    }

    const contentSourceText = [text, fetchedUrlContent].filter(Boolean).join("\n\nExtracted Web Content:\n");

    if (!contentSourceText && !fileData) {
      return res.status(400).json({ error: { message: "Please upload a PDF file, paste text, or provide a URL to analyze." } });
    }

    let systemPrompt = "";
    if (type === 'resume') {
      systemPrompt = `You are a brutally honest, senior Tech Recruiter & VP of Engineering at a top tech company evaluating candidates for Java / Spring Boot Software Engineering roles. Do NOT sugarcoat your evaluation. Give a realistic, uninflated ATS compatibility score (0-100%). Most junior/student resumes deserve 30%-65% because they lack metrics, architecture depth, or production tech stack details (e.g. Spring Security, Docker, PostgreSQL, JUnit, Kafka).

Evaluate the candidate's resume/CV against the target role: "${targetRole || 'Java Backend Engineer'}".

Return ONLY a single valid JSON object with the following schema:
{
  "atsScore": (uninflated integer between 0 and 100),
  "summary": "(2 sentence brutally honest technical assessment of why a recruiter would accept or reject this resume in a 6-second scan)",
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "bulletUpgrades": [
    {
      "original": "(weak, generic, or non-quantified bullet point from text or PDF)",
      "improved": "(quantifiable, high-impact rewrite using strong engineering verbs & tech stack)",
      "reason": "(brutally honest technical explanation of why this rewrite fixes a flaw)"
    }
  ],
  "syllabusGaps": [
    {
      "skill": "(missing technical skill needed for placement)",
      "recommendedDay": "(e.g. Day 33: Spring Security & JWT Authentication)"
    }
  ]
}

Candidate Text / URL Content:
${contentSourceText || "Evaluate the attached PDF document."}`;
    } else {
      systemPrompt = `You are a brutally honest Tech Headhunter & LinkedIn Branding Director specializing in Java / Spring Boot Backend placements. Do NOT sugarcoat. Evaluate why a recruiter scrolling through 100 profiles would pass over or click on this profile for the target role: "${targetRole || 'Java Backend Engineer'}".

Return ONLY a single valid JSON object with the following schema:
{
  "profileScore": (uninflated integer between 0 and 100),
  "feedback": "(2 sentence brutally candid critique explaining why recruiters would filter out or contact this candidate)",
  "headlines": [
    "(Punchy, Recruiter-Magnet Headline Option 1)",
    "(Punchy, Recruiter-Magnet Headline Option 2)",
    "(Punchy, Recruiter-Magnet Headline Option 3)"
  ],
  "missingRecruiterKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "outreachTemplate": "(A direct, non-cringe 2-sentence cold outreach note to send to Engineering Managers or Recruiters)"
}

Candidate LinkedIn / Profile Content:
${contentSourceText || "Evaluate the attached document / URL."}`;
    }

    const parts = [];

    if (fileData) {
      const cleanBase64 = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      parts.push({
        inline_data: {
          mime_type: mimeType || "application/pdf",
          data: cleanBase64
        }
      });
    }

    parts.push({ text: systemPrompt });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          response_mime_type: "application/json"
        },
        contents: [
          {
            role: "user",
            parts: parts
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const rawJsonText = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(rawJsonText);

    res.json(parsedData);
  } catch (error) {
    console.error("Career API Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running securely on http://localhost:${PORT}`);
});
