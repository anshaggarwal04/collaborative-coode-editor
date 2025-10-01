// src/sockets/code/codeSocket.js
import { handleCodeChange, handleRunCode } from "./codeHandlers.js";

export function initCodeSocket(io, socket) {
  // register code-related events
  handleCodeChange(io, socket);
  handleRunCode(io, socket);
}