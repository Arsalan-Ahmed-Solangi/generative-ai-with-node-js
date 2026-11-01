import express from "express";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import openAIRouter from "./routes/openai.js";
import genAIRouter from "./routes/googlegemini.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("WELCOME TO GENERATIVE AI - NODE APP TEST WORKOT");
});

app.use("/api/chat", chatRouter);
app.use("/api/openai", openAIRouter);
app.use("/api/gemini", genAIRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
