import express from "express";
import openAIClient from "../config/openai.js";
const router = express.Router();

import { fileURLToPath } from "url";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { createReadStream } from "fs";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const uploadDirectory = path.join(_dirname, "../../uploads");

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

router.post("/chatting", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      throw new Error(`Message is required!`);
    }

    const response = await openAIClient.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are an ai asistant so please use words natural and soft",
      input: message,
    });

    console.log("RESPONSE", response);

    return res.status(200).json({
      message: response.output_text,
    });
  } catch (err) {
    console.log("ERROR", err.message);
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/chatting-history", async (req, res) => {
  try {
    const { message, response_id } = req.body;

    if (!message) {
      throw new Error(`Message is required!`);
    }

    const response = await openAIClient.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are an ai asistant so please use words natural and soft",
      input: message,
      ...(response_id && { previous_response_id: response_id }),
    });

    console.log("RESPONSE", response);

    return res.status(200).json({
      message: response.output_text,
      response_id: response.id,
    });
  } catch (err) {
    console.log("ERROR", err.message);
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.get("/generate-image", async (req, res) => {
  const response = await openAIClient.images.generate({
    model: "gpt-image-2.5-sunburst",
    prompt: "Generate a beautiful girl with doing coding on laptop",
    size: "",
    output_format: "",
    quality: "",
  });

  const base64Image = response.data[0].b64_json;
  await mkdir(uploadDirectory, { recursive: true });

  const fileName = "girl_image.png";
  const filePath = path.join(uploadDirectory, fileName);

  await writeFile(filePath, Buffer.from(base64Image, "base64"));

  console.log("RESPONSE", response);

  return res.status(200).json({
    message: "Image generated successfully!",
    image: response.data[0].b64_json,
  });
});

router.get("/generate-image", async (req, res) => {
  const response = await openAIClient.images.generate({
    model: "gpt-image-2.5-sunburst",
    prompt: "A beautiful nature greenry with animals",
    size: "512x512",
    n: 3,
    output_format: "png",
    quality: "low",
  });

  const base64Image = response.data[0].b64_json;
  await mkdir(uploadDirectory, { recursive: true });

  const fileName = "girl_image.png";
  const filePath = path.join(uploadDirectory, fileName);

  await writeFile(filePath, Buffer.from(base64Image, "base64"));

  console.log("RESPONSE", response);

  return res.status(200).json({
    message: "Image generated successfully!",
    image: response.data[0].b64_json,
  });
});

router.get("/generate-image-bulk", async (req, res) => {
  const response = await openAIClient.images.generate({
    model: "gpt-image-2.5-sunburst",
    prompt: "A beautiful nature greenry with animals",
    size: "auto",
    n: 3,
    output_format: "png",
    quality: "low",
  });

  console.log("RESPONSE", response);

  await mkdir(uploadDirectory, { recursive: true });

  const images = await Promise.all(
    response.data.map(async (image, index) => {
      const fileName = `image_${index + 1}.png`;
      const filepath = path.join(uploadDirectory, fileName);
      await writeFile(filepath, Buffer.from(image.b64_json, "base64"));
    }),
  );

  return res.status(200).json({
    message: "Image generated successfully!",
    image: response.data[0].b64_json,
  });
});

router.get("/analyze-image", async (req, res) => {
  const response = await openAIClient.responses.create({
    model: "gpt-5.5",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "What is the color of laptop" },
          {
            type: "input_image",
            detail: "auto",
            image_url:
              "http://t3.ftcdn.net/jpg/05/20/18/84/360_F_520188442_Z9zmEktvI8DEg7k6Gus6hqWTEEHFdpWI.jpg",
          },
        ],
      },
    ],
  });

  console.log("RESPONSE", response);

  return res.status(200).json({
    message: response.output_text,
  });
});

router.get("/generate-audio", async (req, res) => {
  try {
    const response = await openAIClient.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "cedar",
      input:
        "Hello, how's your generative ai node js course is going, and what so far you have learned?",
      response_format: "mp3",
    });

    console.log("RESPONSE", response);

    const audioDirectory = path.join(process.cwd(), "uploads", "audio");
    mkdir(audioDirectory, { recursive: true });
    const fileName = `speech2.mp3`;
    const filepath = path.join(audioDirectory, fileName);

    writeFile(filepath, Buffer.from(await response.arrayBuffer()));

    return res.status(200).json({
      message: " Audio voice generated successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/audio-to-text", async (req, res) => {
  try {
    const response = await openAIClient.audio.transcriptions.create({
      file: createReadStream("uploads/audio/speech.mp3"),
      model: "gpt-transcribe",
    });

    console.log("RESPONSE", response);

    return res.status(200).json({
      text: response.text,
      message: "Audio to text generated successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
