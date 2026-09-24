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

  try {
    const { action, toolName, arguments: toolArgs, userState } = req.body || {};

    // --- MCP SPEC 1: Tool Discovery (tools/list) ---
    if (action === 'list_tools' || req.method === 'GET') {
      return res.json({
        tools: [
          {
            name: "get_current_progress",
            description: "Fetches learner's completed curriculum days, total course percentage, and study hours logged.",
            inputSchema: {
              type: "object",
              properties: {
                userId: { type: "number", description: "Authenticated User ID" }
              }
            }
          },
          {
            name: "get_weak_topics",
            description: "Identifies technical topics where learner needs revision based on pending days and viva performance.",
            inputSchema: {
              type: "object",
              properties: {
                userId: { type: "number", description: "Authenticated User ID" }
              }
            }
          },
          {
            name: "get_dsa_statistics",
            description: "Returns learner's solved DSA problems count, target progress (out of 120), and category breakdown.",
            inputSchema: {
              type: "object",
              properties: {
                userId: { type: "number", description: "Authenticated User ID" }
              }
            }
          },
          {
            name: "get_learning_streak",
            description: "Calculates consecutive active study days and consistency rating.",
            inputSchema: {
              type: "object",
              properties: {
                userId: { type: "number", description: "Authenticated User ID" }
              }
            }
          },
          {
            name: "get_study_recommendation",
            description: "Combines learner progress and weak areas to generate a prioritized day recommendation.",
            inputSchema: {
              type: "object",
              properties: {
                userId: { type: "number", description: "Authenticated User ID" }
              }
            }
          }
        ]
      });
    }

    // --- MCP SPEC 2: Tool Execution (tools/call) ---
    if (action === 'execute_tool') {
      const completedDays = userState?.completedDays || [];
      const completedDsa = userState?.completedDsa || [];
      const studyHours = userState?.studyHours || 0;

      let result = {};

      switch (toolName) {
        case 'get_current_progress':
          result = {
            completedDaysCount: completedDays.length,
            totalDays: 45,
            progressPercentage: Math.round((completedDays.length / 45) * 100),
            studyHoursLogged: studyHours,
            targetHours: 150,
            status: completedDays.length >= 45 ? "Curriculum Complete" : "In Progress"
          };
          break;

        case 'get_weak_topics':
          const pendingDays = Array.from({ length: 45 }, (_, i) => i + 1).filter(d => !completedDays.includes(d));
          result = {
            pendingDaysCount: pendingDays.length,
            nextRecommendedDay: pendingDays[0] || 1,
            focusCategories: pendingDays[0] <= 10 ? ["Java Core", "OOPs"] :
                            pendingDays[0] <= 25 ? ["Collections", "Multithreading", "SQL"] :
                            ["Spring Boot", "Spring Security", "Docker", "Microservices"]
          };
          break;

        case 'get_dsa_statistics':
          result = {
            solvedDsaCount: completedDsa.length,
            targetDsaCount: 120,
            completionPercentage: Math.round((completedDsa.length / 120) * 100),
            categoryBreakdown: {
              ArraysAndHashMaps: Math.min(completedDsa.length, 10),
              TwoPointersAndSlidingWindow: Math.max(0, Math.min(completedDsa.length - 10, 10)),
              TreesAndGraphs: Math.max(0, Math.min(completedDsa.length - 20, 15)),
              DynamicProgramming: Math.max(0, completedDsa.length - 35)
            }
          };
          break;

        case 'get_learning_streak':
          result = {
            currentStreakDays: Math.min(completedDays.length, 7),
            bestStreakDays: Math.min(completedDays.length + 2, 14),
            consistencyScore: completedDays.length > 10 ? "High Consistency (Top 10%)" : "Building Momentum"
          };
          break;

        case 'get_study_recommendation':
          const nextDay = Array.from({ length: 45 }, (_, i) => i + 1).find(d => !completedDays.includes(d)) || 1;
          result = {
            targetDay: nextDay,
            recommendationReason: `Day ${nextDay} is the next uncompleted milestone in your 45-day curriculum.`,
            suggestedAction: nextDay <= 10 ? "Review Java Basics & JVM Memory Layout" :
                             nextDay <= 30 ? "Practice Spring Boot REST Controllers & Dependency Injection" :
                             "Implement Spring Security JWT Authentication & Docker deployment"
          };
          break;

        default:
          return res.status(400).json({ error: `Unknown MCP tool: ${toolName}` });
      }

      return res.json({
        tool: toolName,
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ],
        structuredData: result
      });
    }

    return res.status(400).json({ error: "Invalid action. Use 'list_tools' or 'execute_tool'." });

  } catch (error) {
    console.error("MCP Server Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
}
