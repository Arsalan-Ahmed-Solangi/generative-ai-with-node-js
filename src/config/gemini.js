import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_GEN_AI_KEY = process.env.GEMINI_API_KEY;

const googleGENAI = new GoogleGenAI({ apiKey: GOOGLE_GEN_AI_KEY });

export default googleGENAI;
