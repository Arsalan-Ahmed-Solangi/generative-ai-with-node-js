import express from "express";
import googleGENAI from "../config/gemini.js";
const router = express.Router();

router.get("", (req, res) => {
  res.status(200).json({
    message: "GOOGLE GEN AI ROUTES",
  });
});

router.get("/response", async (req, res) => {
  try {
    const response = await googleGENAI.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Hello, how are you? what's going on today",
    });

    console.log("RESPONSE", response);
    return res.status(200).json({
      message: response.text,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/user-response", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await googleGENAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: message,
    });

    console.log("RESPONSE", response);
    return res.status(200).json({
      message: response.text,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
