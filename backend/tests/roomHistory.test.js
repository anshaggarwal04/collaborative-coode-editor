import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import supertest from "supertest";
import app from "../src/app.js";
import { initSocket } from "../src/sockets/index.js";

let io, server, request, baseURL;
let token, roomId;

beforeAll((done) => {
  server = createServer(app);
  io = new Server(server, { cors: { origin: "*" } });
  initSocket(io);

  server.listen(() => {
    const port = server.address().port;
    baseURL = `http://localhost:${port}`;
    request = supertest(baseURL);
    console.log(`🚀 Test server started at ${baseURL}`);
    done();
  });
});

afterAll((done) => {
  io.close();
  server.close(done);
});

test("should persist codeChange and replay on rejoin", async () => {
  // 1. Register + login
  const random = Date.now();
  const reg = await request.post("/api/auth/register").send({
    username: `historyuser_${random}`,
    email: `history_${random}@test.com`,
    password: "testpass",
  });
  expect(reg.statusCode).toBe(201);

  const login = await request.post("/api/auth/login").send({
    email: `history_${random}@test.com`,
    password: "testpass",
  });
  expect(login.statusCode).toBe(200);
  token = login.body.token;

  // 2. Create a room
  const roomRes = await request
    .post("/api/rooms/create")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "History Test Room" });

  expect(roomRes.statusCode).toBe(200);
  roomId = roomRes.body.room.id;

  // 3. First client connects and sends code
  const client1 = Client(baseURL, { auth: { token }, transports: ["websocket"] });

  await new Promise((resolve) => client1.on("connect", resolve));
  client1.emit("joinRoom", { roomId });

  const testCode = "console.log('persisted!');";
  client1.emit("codeChange", { roomId, code: testCode });

  // wait for DB persist
  await new Promise((res) => setTimeout(res, 500));
  client1.close();

  // 4. Second client joins and should receive replayed code
  const client2 = Client(baseURL, { auth: { token }, transports: ["websocket"] });

  await new Promise((resolve) => client2.on("connect", resolve));
  client2.emit("joinRoom", { roomId });

  const replayed = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("No replayed code received")), 3000);

    client2.on("codeUpdate", (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
  });

  expect(replayed).toBe(testCode);

  client2.close();
}, 15000);