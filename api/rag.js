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
    const { type, text, historyContent, activeDayTitle } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the server." } });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // --- RAG MODE 1: Generate Vector Embedding (768-dim) ---
    if (type === 'embed') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text: text || "Java Backend Engineering" }]
          }
        })
      });

      const data = await response.json();
      if (data.error) return res.status(500).json({ error: data.error });

      return res.json({
        embedding: data.embedding.values,
        dimension: data.embedding.values.length
      });
    }

    // --- RAG MODE 2: Knowledge Vector Search & Context Grounded Generation ---
    const knowledgeBase = [
      {
        topic: "JVM Memory Architecture",
        day: 1,
        content: "Primitives go onto the Stack (fast allocation, block scoped). Objects reside on the Heap. Stack Memory holds method frames, local variables, and object reference pointers. Heap Memory holds actual object instances managed by Garbage Collectors (G1GC, ZGC)."
      },
      {
        topic: "HashMap Hashing & Collision Resolution",
        day: 10,
        content: "HashMap uses key.hashCode() mapped to table buckets (index = hash & (n-1)). Collisions are handled via LinkedList chaining. In Java 8+, when a bucket exceeds 8 elements and array length >= 64, the LinkedList treeifies into a Red-Black Tree O(log N)."
      },
      {
        topic: "Multithreading & Concurrency",
        day: 15,
        content: "Java Threads share Heap memory but maintain isolated Stack frames. Synchronized keywords enforce intrinsic locking (monitor lock). ReentrantLock provides tryLock() with timeout. Volatile guarantees memory visibility by preventing CPU instruction reordering and bypassing CPU L1/L2 caches."
      },
      {
        topic: "Spring Boot IoC & Dependency Injection",
        day: 25,
        content: "Spring ApplicationContext manages bean lifecycles. @Component, @Service, @Repository register singleton beans. Constructor injection is preferred over field injection (@Autowired) for immutability, thread safety, and unit testing mockability."
      },
      {
        topic: "Spring Security & JWT Authentication",
        day: 33,
        content: "Spring Security Filter Chain intercepts requests. SecurityFilterChain bean configures HttpSecurity. BCryptPasswordEncoder hashes passwords with random salt. JWT tokens store claims (username, role) signed with HMAC-SHA256 secret key."
      },
      {
        topic: "SQL Database Indexing & B-Trees",
        day: 20,
        content: "B-Tree indexes reduce lookup time from O(N) sequential scan to O(log N) tree traversal. Composite indexes follow the Most Selective First and Leftmost Prefix rule. Excessive indexes slow down INSERT/UPDATE/DELETE operations due to index tree maintenance."
      },
      {
        topic: "Docker & Containerization",
        day: 40,
        content: "Docker Engine runs isolated containers using Linux namespaces and cgroups. Multi-stage Dockerfiles compile Java code with Maven in stage 1, then copy jar into a lightweight Eclipse Temurin Alpine JDK 17 runtime image in stage 2."
      }
    ];

    // Compute simple relevance matching or vector similarity for grounding
    const queryText = (text || "").toLowerCase();
    const relevantChunks = knowledgeBase.filter(item => 
      queryText.includes(item.topic.toLowerCase()) || 
      item.content.toLowerCase().split(" ").some(word => word.length > 4 && queryText.includes(word))
    );

    const contextText = (relevantChunks.length > 0 ? relevantChunks : knowledgeBase.slice(0, 3))
      .map(c => `[Source: Day ${c.day} - ${c.topic}]: ${c.content}`)
      .join("\n\n");

    const systemPrompt = `You are CodeMentor RAG Agent — a Senior Java Backend Architect.
Ground your response strictly using the retrieved knowledge chunks below whenever relevant. Provide technical, code-focused, concise answers.

Retrieved Grounded Context:
${contextText}

Current Curriculum Context: ${activeDayTitle || 'Day 1: Java Basics'}`;

    const contents = historyContent || [{ role: 'user', parts: [{ text: text }] }];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: { text: systemPrompt } },
        contents: contents
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error });

    res.json({
      response: data,
      groundedSources: relevantChunks.map(c => ({ topic: c.topic, day: c.day }))
    });

  } catch (error) {
    console.error("RAG API Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
}
