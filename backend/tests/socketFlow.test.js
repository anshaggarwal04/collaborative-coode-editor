import { createServer } from "http";
import { Server } from "socket.io";
import request from "supertest";
import { io as Client } from "socket.io-client";
import app from "../src/app.js";
import { initSocket } from "../src/sockets/index.js";

let io, server, baseURL, clientSocket, token, roomId;

beforeAll((done) => {
  server = createServer(app);
  io = new Server(server, { cors: { origin: "*" } });
  initSocket(io); // ✅ attach socket handlers

  server.listen(() => {
    const port = server.address().port;
    baseURL = `http://localhost:${port}`;
    console.log("🚀 Test server started at", baseURL);
    done();
  });
});

afterAll(() => {
  if (clientSocket?.connected) clientSocket.disconnect();
  io.close();
  server.close();
});

test("should join room, emit codeChange, and replay from history", async (done) => {
  const random = Date.now();
  const testUser = {
    username: `historyuser_${random}`,
    email: `history_${random}@test.com`,
    password: "pass123",
  };

  // 1. Register
  await request(baseURL).post("/api/auth/register").send(testUser);

  // 2. Login
  const loginRes = await request(baseURL).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });
  expect(loginRes.statusCode).toBe(200);
  token = loginRes.body.token;

  // 3. Create room
  const roomRes = await request(baseURL)
    .post("/api/rooms/create")
    .set("Authorization", `Bearer ${token}`)
    .send({ roomName: "History Test Room" });
  expect(roomRes.statusCode).toBe(200);
  roomId = roomRes.body.room.id;

  // 4. Connect socket
  clientSocket = Client(baseURL, { auth: { token }, transports: ["websocket"] });

  clientSocket.on("connect", () => {
    // Join room
    clientSocket.emit("joinRoom", { roomId });

    // Emit codeChange
    const code = "console.log('Hello History');";
    clientSocket.emit("codeChange", { roomId, code });

    // Expect replay
    clientSocket.on("roomHistory", (history) => {
      expect(history.length).toBeGreaterThan(0);
      const last = history[history.length - 1];
      expect(last).toMatchObject({
        event: "codeChange",
        payload: code,
        roomId,
      });
      done();
    });
  });
}, 15000);