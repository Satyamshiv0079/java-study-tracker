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
      prompt = `You are a brutally honest, senior Tech Recruiter & VP of Engineering at a top tech company evaluating candidates for Java / Spring Boot Software Engineering roles. Do NOT sugarcoat your evaluation. Give a realistic, uninflated ATS compatibility score (0-100%). Most junior/student resumes deserve 30%-65% because they lack metrics, architecture depth, or production tech stack details (e.g. Spring Security, Docker, PostgreSQL, JUnit, Kafka).

Evaluate the candidate's text against the target role: "${targetRole || 'Java Backend Engineer'}".

Return ONLY a single valid JSON object with the following schema:
{
  "atsScore": (uninflated integer between 0 and 100),
  "summary": "(2 sentence brutally honest technical assessment of why a recruiter would accept or reject this resume in a 6-second scan)",
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "bulletUpgrades": [
    {
      "original": "(weak, generic, or non-quantified bullet point from text)",
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

Candidate Resume Text:
${text}`;
    } else {
      prompt = `You are a brutally honest Tech Headhunter & LinkedIn Branding Director specializing in Java / Spring Boot Backend placements. Do NOT sugarcoat. Evaluate why a recruiter scrolling through 100 profiles would pass over or click on this profile for the target role: "${targetRole || 'Java Backend Engineer'}".

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
