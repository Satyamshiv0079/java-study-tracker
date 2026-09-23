export default async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, text, targetRole } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the server." } });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: { message: "Please provide content to analyze." } });
    }

    let prompt = "";
    if (type === 'resume') {
      prompt = `You are a ruthless, expert Silicon Valley Senior Engineering Manager & Technical Recruiter evaluating candidates for Java / Spring Boot Software Engineering roles. Evaluate the candidate's provided text against the target role: "${targetRole || 'Java Backend Engineer'}".

Return ONLY a single valid JSON object with the following schema:
{
  "atsScore": (integer between 0 and 100),
  "summary": "(2 sentence candid technical summary of the candidate's resume strength)",
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "bulletUpgrades": [
    {
      "original": "(weak or generic bullet point from text)",
      "improved": "(quantifiable, high-impact rewrite using strong engineering verbs & tech stack)",
      "reason": "(why this rewrite is stronger for recruiters)"
    }
  ],
  "syllabusGaps": [
    {
      "skill": "(missing technical skill)",
      "recommendedDay": "(e.g. Day 33: Spring Security & JWT Authentication)"
    }
  ]
}

Candidate Resume Text:
${text}`;
    } else {
      prompt = `You are a top Tech Recruiter & LinkedIn Branding Expert specializing in placing Java / Spring Boot Backend Developers. Evaluate the candidate's LinkedIn profile text for the target role: "${targetRole || 'Java Backend Engineer'}".

Return ONLY a single valid JSON object with the following schema:
{
  "profileScore": (integer between 0 and 100),
  "feedback": "(2 sentence candid advice on how to rank higher in recruiter search filters)",
  "headlines": [
    "(Punchy Headline Option 1)",
    "(Punchy Headline Option 2)",
    "(Punchy Headline Option 3)"
  ],
  "missingRecruiterKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "outreachTemplate": "(A personalized, non-spammy 2-sentence outreach note to send to Engineering Managers or Recruiters)"
}

Candidate LinkedIn Profile Text:
${text}`;
    }

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
            parts: [{ text: prompt }]
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
}
