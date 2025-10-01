// src/sockets/code/codeHandlers.js
import axios from "axios";
import prisma from "../../config/db.js";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// ✅ Handle Run Code
export function handleRunCode(io, socket) {
  socket.on("runCode", async ({ roomId, language_id, source_code, stdin }) => {
    try {
      const response = await axios.post(
        `${JUDGE0_API}?base64_encoded=false&wait=true`,
        { language_id, source_code, stdin: stdin || "" },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      io.to(roomId).emit("codeResult", response.data);
    } catch (err) {
      console.error("❌ Code execution error:", err.message);
      socket.emit("error", { message: "Code execution failed" });
    }
  });
}

// ✅ Handle Code Changes (persistent + broadcast)
export function handleCodeChange(io, socket) {
  socket.on("codeChange", async ({ roomId, code }) => {
    try {
      // Save to DB
      await prisma.roomHistory.create({
        data: {
          roomId,
          userId: socket.user.id, // requires auth middleware
          event: "codeChange",
          payload: code,
        },
      });

      // Broadcast update
      socket.to(roomId).emit("codeUpdate", code);
    } catch (err) {
      console.error("❌ Failed to persist code:", err.message);
    }
  });
}