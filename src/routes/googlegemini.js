import express from "express";
import googleGENAI from "../config/gemini.js";
const router = express.Router();

import * as fs from "node:fs";
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

router.post("/instruction", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await googleGENAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: message,
      config: {
        systemInstruction: "You are a girl, you name is alina",
      },
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

router.post("/stream", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await googleGENAI.models.generateContentStream({
      model: "gemini-flash-latest",
      contents: message,
      config: {
        systemInstruction: "You are a girl, you name is alina",
      },
    });

    console.log("RESPONSE", response);

    let responseText = "";

    for await (const chunk of response) {
      responseText += chunk.text;
    }

    return res.status(200).json({
      message: responseText,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/image", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await googleGENAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: message,
    });

    console.log("RESPONSE", response);

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }
    }

    return res.status(200).json({
      message: "Image generated successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
