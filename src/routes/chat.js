import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  return res.send("WELCOME TO CHAT APP");
});

export default router;
