// /src/sockets/code/codeHandlers.js
import axios from "axios";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Run Code
export async function handleRunCode(
  io,
  socket,
  { roomId, language_id, source_code, stdin }
) {
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

    // Broadcast result back to everyone in the room
    io.to(roomId).emit("codeResult", response.data);
  } catch (err) {
    console.error("Code execution error:", err.message);
    socket.emit("error", { message: "Code execution failed" });
  }
}

// Code Change (real-time updates)
export function handleCodeChange(io, socket, { roomId, code }) {
  // Send the code update to everyone *else* in the room
  socket.to(roomId).emit("codeUpdate", code);
}