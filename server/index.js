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

app.listen(PORT, () => {
  console.log(`Backend server running securely on http://localhost:${PORT}`);
});
