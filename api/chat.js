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
    const { historyContent, activeDayTitle, userState } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the server." } });
    }

    // --- 1. MCP AGENT TOOL EXECUTION (Internal Context Extraction) ---
    const completedDays = userState?.completedDays || [];
    const completedDsa = userState?.completedDsa || [];
    const studyHours = userState?.studyHours || 0;

    const mcpProgressData = {
      completedDaysCount: completedDays.length,
      progressPercentage: Math.round((completedDays.length / 45) * 100),
      solvedDsaCount: completedDsa.length,
      studyHoursLogged: studyHours,
      nextRecommendedDay: Array.from({ length: 45 }, (_, i) => i + 1).find(d => !completedDays.includes(d)) || 1
    };

    // --- 2. RAG KNOWLEDGE BASE GROUNDING ---
    const RAG_KNOWLEDGE_BASE = [
      "JVM Memory: Stack stores primitive variables & method frames. Heap stores object instances managed by GC (G1GC/ZGC).",
      "HashMap: Hash collision handled via LinkedList chaining. Java 8+ treeifies chains > 8 into Red-Black Trees O(log N).",
      "Concurrency: synchronized enforces intrinsic locks. ReentrantLock supports tryLock(). volatile guarantees CPU memory visibility.",
      "Spring Boot: @Component/@Service/@Repository register beans in ApplicationContext. Constructor injection is preferred.",
      "Spring Security: SecurityFilterChain intercepts requests. BCrypt hashes passwords. JWT signed with HMAC-SHA256.",
      "SQL Indexing: B-Tree indexes speed up lookups to O(log N). Composite indexes follow leftmost prefix rule.",
      "Docker: Multi-stage builds compile with Maven in stage 1, copy JAR to Alpine JDK 17 runtime image in stage 2."
    ];

    const lastMessage = Array.isArray(historyContent) && historyContent.length > 0 
      ? historyContent[historyContent.length - 1].parts?.[0]?.text || ""
      : "";

    const relevantRag = RAG_KNOWLEDGE_BASE.filter(item => 
      lastMessage.toLowerCase().split(" ").some(word => word.length > 4 && item.toLowerCase().includes(word))
    );

    const ragContext = (relevantRag.length > 0 ? relevantRag : RAG_KNOWLEDGE_BASE.slice(0, 2)).join(" ");

    // --- 3. ORCHESTRATED SYSTEM INSTRUCTION ---
    const orchestratedInstruction = `You are CodeMentor Orchestrated AI Agent — a Senior Java Backend Architect.
You operate using RAG knowledge retrieval and Model Context Protocol (MCP) live user state.

[MCP User Application State]:
- Completed Curriculum: ${mcpProgressData.completedDaysCount}/45 Days (${mcpProgressData.progressPercentage}%)
- Solved DSA Problems: ${mcpProgressData.solvedDsaCount}/120
- Study Hours Logged: ${mcpProgressData.studyHoursLogged} hrs
- Next Milestone: Day ${mcpProgressData.nextRecommendedDay}

[RAG Knowledge Grounding]:
${ragContext}

Current Active Day Context: ${activeDayTitle || 'Day 1: Java Basics'}

Instructions:
- Provide direct, code-focused, technically rigorous answers.
- Tailor explanations to the student's current milestone and weak areas. Keep responses concise.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: { text: orchestratedInstruction }
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
    console.error("Orchestrated Agent Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
}
