import request from "supertest";
import app from "../src/index.js";
import prisma from "../src/config/db.js";

let token;
let roomId;
const testUser = `leaveuser_${Date.now()}`;

beforeAll(async () => {
  // Register user
  await request(app)
    .post("/api/auth/register")
    .send({ username: testUser, password: "leavepass" });

  // Login user
  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: testUser, password: "leavepass" });

  token = res.body.token;
});

afterAll(async () => {
  // Cleanup DB
  const user = await prisma.user.findUnique({ where: { username: testUser } });
  if (user) {
    await prisma.roomUser.deleteMany({ where: { userId: user.id } });
    await prisma.room.deleteMany({ where: { createdBy: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.$disconnect();
});

describe("Room Leave Feature", () => {
  it("should create a room", async () => {
    const res = await request(app)
      .post("/api/rooms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomName: "Leave Test Room" });

    expect(res.statusCode).toBe(200);
    expect(res.body.room).toHaveProperty("id");

    roomId = res.body.room.id;
  });

  it("should leave the room", async () => {
    const res = await request(app)
      .post("/api/rooms/leave")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomId });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Left room successfully");
  });

  it("room should still appear in /my", async () => {
    const res = await request(app)
      .get("/api/rooms/my")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    const roomIds = res.body.rooms.map(r => r.id);
    expect(roomIds).toContain(roomId); // ✅ history keeps it
  });

  it("should rejoin the room and reactivate", async () => {
    const res = await request(app)
      .post("/api/rooms/join")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomId });

    expect(res.statusCode).toBe(200);
    expect(res.body.roomUser.isActive).toBe(true);
  });

  it("should fail leaving a room never joined", async () => {
    const res = await request(app)
      .post("/api/rooms/leave")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomId: "nonexistent-room-id" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

async function registerAndLogin(username, email, password = "pass123") {
    await request(app).post("/api/auth/register").send({ username, email, password });
    const res = await request(app).post("/api/auth/login").send({ username, password });
    return res.body.token;
  }