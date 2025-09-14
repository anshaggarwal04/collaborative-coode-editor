import { handleRunCode, handleCodeChange } from "./codeHandlers.js";

export function initCodeSocket(io, socket) {
  socket.on("runCode", (data) => handleRunCode(io, socket, data));
  socket.on("codeChange", (data) => handleCodeChange(io, socket, data));
}