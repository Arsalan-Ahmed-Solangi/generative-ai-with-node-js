import express from "express";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import openAIRouter from "./routes/openai.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  return res.send("WELCOME TO GENERATIVE AI - NODE APP");
});

app.use("/api/chat", chatRouter);
app.use("/api/openai", openAIRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
