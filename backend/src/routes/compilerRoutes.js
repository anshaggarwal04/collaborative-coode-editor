import express from "express";
import axios from "axios";

const JUDGE0_API =
  process.env.RAPIDAPI_KEY
    ? "https://judge0-ce.p.rapidapi.com/submissions"
    : "https://judge0api.com/submissions";

export async function runCode(req, res, next) {
  try {
    const { language_id, source_code, stdin } = req.body;

    const response = await axios.post(
      `${JUDGE0_API}?base64_encoded=false&wait=true`,
      {
        language_id,
        source_code,
        stdin: stdin || "",
      },
      {
        headers: process.env.RAPIDAPI_KEY
          ? {
              "Content-Type": "application/json",
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            }
          : { "Content-Type": "application/json" },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ Compiler error:", err.message);
    next(err); // ✅ send to errorHandler
  }
}

const router = express.Router();
router.post("/run", runCode);
export default router;