// server.js - Local development server for API
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Import AFTER dotenv.config()
import express from "express";
import handler from "./api/analyze.js";
import translateHandler from "./api/translate.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Increase body size limit to handle large resumes (default is 100kb)
app.use(express.json({ limit: "5mb" }));
app.use(express.text({ limit: "5mb" }));

// Health check endpoint
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// Analyze endpoint with timeout
app.post("/api/analyze", (req, res) => {
  // Set response timeout to 60 seconds (OpenAI can be slow)
  req.setTimeout(60000);
  res.setTimeout(60000);

  console.log(
    `[${new Date().toISOString()}] POST /api/analyze - Payload size: ${JSON.stringify(req.body).length} bytes`,
  );
  handler(req, res);
});

// Translate endpoint with timeout
app.post("/api/translate", (req, res) => {
  // Set response timeout to 30 seconds
  req.setTimeout(30000);
  res.setTimeout(30000);

  console.log(
    `[${new Date().toISOString()}] POST /api/translate - Target language: ${req.body?.targetLang}`,
  );
  translateHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  Missing OPENAI_API_KEY in .env");
  } else {
    console.log("✅ OPENAI_API_KEY loaded");
  }
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error("❌ [SERVER ERROR]", err);
  res.status(500).json({ error: "Server error: " + err.message });
});
