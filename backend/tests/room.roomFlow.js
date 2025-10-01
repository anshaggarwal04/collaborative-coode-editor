import request from "supertest";
import app from "../src/index.js";
import prisma from "../src/config/db.js";

// 🔹 Helper: register + login user → return JWT
async function registerAndLogin(username, email, password = "pass123") {
  await request(app).post("/api/auth/register").send({ username, email, password });

  const res = await request(app).post("/api/auth/login").send({ username, password });

  if (res.statusCode !== 200) {
    throw new Error(`Login failed for ${username}: ${res.statusCode} ${JSON.stringify(res.body)}`);
  }

  return res.body.token;
}

describe("Room API + Room Leave Feature", () => {
  let token;
  let roomId;
  const testUser = `roomuser_${Date.now()}`;
  const testEmail = `${testUser}@test.com`;

  beforeAll(async () => {
    token = await registerAndLogin(testUser, testEmail);
  });

  afterAll(async () => {
    // Cleanup all data for this test user
    const user = await prisma.user.findUnique({ where: { username: testUser } });
    if (user) {
      await prisma.roomUser.deleteMany({ where: { userId: user.id } });
      await prisma.room.deleteMany({ where: { createdBy: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    await prisma.$disconnect();
  });

  // 🔹 ROOM CREATION
  it("should create a room", async () => {
    const res = await request(app)
      .post("/api/rooms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomName: "Test Room" });

    expect(res.statusCode).toBe(200);
    expect(res.body.room).toHaveProperty("id");
    expect(res.body.room.name).toBe("Test Room");

    roomId = res.body.room.id;
  });

  // 🔹 ROOM FETCH (my rooms)
  it("should fetch my rooms", async () => {
    const res = await request(app)
      .get("/api/rooms/my")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.rooms)).toBe(true);
    expect(res.body.rooms.some((r) => r.id === roomId)).toBe(true);
  });

  // 🔹 ROOM LEAVE
  it("should leave the room", async () => {
    const res = await request(app)
      .post("/api/rooms/leave")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomId });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Left room successfully");
  });

  // 🔹 ROOM HISTORY after leave
  it("room should still appear in /my (history)", async () => {
    const res = await request(app)
      .get("/api/rooms/my")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const roomIds = res.body.rooms.map((r) => r.id);
    expect(roomIds).toContain(roomId); // ✅ still in history
  });

  // 🔹 REJOIN
  it("should rejoin the room and reactivate", async () => {
    const res = await request(app)
      .post("/api/rooms/join")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomId });

    expect(res.statusCode).toBe(200);
    expect(res.body.roomUser.isActive).toBe(true);
  });

  // 🔹 INVALID LEAVE
  it("should fail leaving a room never joined", async () => {
    const res = await request(app)
      .post("/api/rooms/leave")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomId: "nonexistent-room-id" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});