import express from "express";
import openAIClient from "../config/openai.js";
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    mesasge: "WELCOME TO OPEN AI ROUTES",
  });
});

router.get("/response", async (req, res) => {
  const response = await openAIClient.responses.create({
    model: "gpt-4.1",
    temperature: 0,
    max_output_tokens: 50,
    input: "Explain chatgpt",
  });

  console.log("RESPONSE", response);

  return res.status(200).json({
    message: response.output_text,
  });
});

router.get("/chat", async (req, res) => {
  const response = await openAIClient.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      {
        role: "developer",
        content: "Talk like senior developer and give short answers",
      },
      { role: "user", content: "Give me 10 builtin functions of node js" },
    ],
  });
  console.log("RESPONSE", response.choices);
  return res.status(200).json({
    message: response.choices[0].message.content,
  });
});

export default router;
