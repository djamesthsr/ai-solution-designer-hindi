import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crash on startup if key is not configured
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Endpoint: Review AI Project Canvas
app.post("/api/review-project", async (req, res) => {
  try {
    const { problem, data, model, output, reflection, lang } = req.body;

    if (!problem || !data || !model || !output) {
      return res.status(400).json({
        error: "Missing required project canvas fields: problem, data, model, and output are required."
      });
    }

    const ai = getGeminiClient();
    const isHindi = lang === "hi";

    const systemPrompt = `You are an encouraging, expert AI mentor in the "AI Innovation Studio".
Your role is to review a high school student's conceptual AI project design based on the AI Project Cycle (Problem, Data, Model, Output).
Analyze their input and return a detailed, constructive review in a clean JSON format. Be friendly, encouraging, and clear (no dense tech jargon, focus on educational growth).
You MUST respond entirely in ${isHindi ? "Hindi (हिंदी - in Devanagari script)" : "English"} language.`;

    const prompt = `Review this student-designed AI project:
- **Problem**: "${problem}"
- **Data to Collect**: "${data}"
- **AI Model Approach**: "${model}"
- **Expected Output**: "${output}"
- **Student Reflection**: "${reflection || "None provided"}"

Provide constructive feedback aligned with the AI Project Cycle.
Your response MUST be a JSON object matching this schema:
{
  "strengths": ["Identify 2-3 design strengths of their project in clear, supportive terms"],
  "missingData": ["Identify 1-2 possible missing data variables, edge cases, or details they might need to collect"],
  "improvements": ["Suggest 1-2 actionable ways they could iterate or improve their project"],
  "risks": ["Describe 1-2 potential risks or ethical challenges to consider (e.g., privacy, bias, safety, accuracy)"]
}

Remember to write the content of the strings inside the JSON in ${isHindi ? "Hindi (हिंदी)" : "English"}!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Positive design aspects of the project"
            },
            missingData: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Gaps in data collection or variables"
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Ways to iterate or scale the model"
            },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Risk, bias, or safety considerations"
            }
          },
          required: ["strengths", "missingData", "improvements", "risks"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    const parsedResponse = JSON.parse(resultText.trim());
    return res.json(parsedResponse);

  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Provide structured mock fallback if GEMINI_API_KEY is not defined, or if the request fails
    // This ensures a smooth student experience even in unconfigured/offline environments!
    if (req.body.lang === "hi") {
      return res.json({
        strengths: [
          `समस्या को परिभाषित करने का शानदार काम! यह एक वास्तविक दुनिया की सामुदायिक चुनौती से निपटता है।`,
          `चुना गया डेटा (${req.body.data || 'इनपुट डेटा'}) आपके एआई को प्रशिक्षित करने के लिए प्रासंगिक है।`,
          `आपका आउटपुट डिज़ाइन व्यावहारिक तरीके से सीधे मुख्य समस्या का समाधान करता है।`
        ],
        missingData: [
          `अपने डेटा में मौसमी कारकों या समय के साथ होने वाले बदलावों पर विचार करें (जैसे, मौसम, स्कूल की छुट्टियां)।`,
          `बेहतर सटीकता के लिए आप जनसांख्यिकीय विश्लेषण या स्थानिक लेआउट डेटा एकत्र करना चाह सकते हैं।`
        ],
        improvements: [
          `एक फीडबैक लूप जोड़ें जहां उपयोगकर्ता मॉडल को फिर से प्रशिक्षित करने के लिए एआई की सिफारिशों को रेट कर सकें।`,
          `और भी अधिक सटीकता के लिए वास्तविक समय के सेंसर मापन के साथ अपनी एआई भविष्यवाणियों को मिलाएं।`
        ],
        risks: [
          `गोपनीयता: सुनिश्चित करें कि बिना स्पष्ट सहमति के कोई भी व्यक्तिगत पहचान योग्य डेटा संग्रहीत नहीं किया गया है।`,
          `पूर्वाग्रह: सुनिश्चित करें कि ऐतिहासिक डेटा सभी प्रकार के उपयोगकर्ताओं का निष्पक्ष रूप से प्रतिनिधित्व करता है।`
        ],
        isFallback: true,
        errorMessage: error.message
      });
    }

    return res.json({
      strengths: [
        `Great job defining the problem! This tackles a real-world community challenge.`,
        `The data selected (${req.body.data || 'input data'}) is relevant to training your AI.`,
        `Your output design directly addresses the core issue in a practical way.`
      ],
      missingData: [
        `Consider seasonal factors or changes over time in your data (e.g., weather, school breaks).`,
        `You might want to collect demographic breakdowns or spatial layout data for better precision.`
      ],
      improvements: [
        `Integrate a feedback loop where users can rate AI recommendations to retrain the model.`,
        `Combine your AI predictions with real-time sensor measurements for even higher accuracy.`
      ],
      risks: [
        `Privacy: Ensure no personal identifying data is stored without explicit consent.`,
        `Bias: Make sure the historical data represents all types of users fairly.`
      ],
      isFallback: true,
      errorMessage: error.message
    });
  }
});

// Setup Vite Dev server middleware or Production asset serving
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Project Cycle app server running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
