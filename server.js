// server.js - Local development server for API
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Import AFTER dotenv.config()
import express from "express";
import handler from "./api/analyze.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.post("/api/analyze", handler);
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  Missing OPENAI_API_KEY in .env");
  } else {
    console.log("✅ OPENAI_API_KEY loaded");
  }
});
