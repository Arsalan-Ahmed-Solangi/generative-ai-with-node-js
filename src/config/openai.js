import openAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openAIClient = new openAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export default openAIClient;
