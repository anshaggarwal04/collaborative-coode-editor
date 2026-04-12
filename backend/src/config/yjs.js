import { WebSocketServer } from "ws";
import * as Y from "yjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { setupWSConnection } = require("y-websocket/bin/utils");

export function initYjs(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    // If the path begins with /yjs, we handle it as a y-websocket connection
    if (request.url.startsWith("/yjs")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
    // Socket.io automatically handles /socket.io paths and upgrade events,
    // so we just ignore paths that are not /yjs
  });

  wss.on("connection", (ws, req) => {
    // `req.url` typically looks like /yjs/roomId
    const docName = req.url.slice(1).split("/")[1] || "default-room";
    
    // Use y-websocket helper to manage the synchronization
    setupWSConnection(ws, req, { docName });
  });

  console.log("✅ Yjs WebSocket Server configured on /yjs/:roomId");
}
