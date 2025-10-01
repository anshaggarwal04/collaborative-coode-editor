import request from "supertest";
import app from "../src/index.js";
import prisma from "../src/config/db.js";

describe("Auth API", () => {
  const uniqueUser = `testuser_${Date.now()}`;
  const uniqueEmail = `${uniqueUser}@example.com`;
  const dupeUser = `dupeuser_${Date.now()}`;
  const dupeEmail = `${dupeUser}@example.com`;

  afterAll(async () => {
    // Cleanup all test users
    await prisma.user.deleteMany({
      where: { username: { in: [uniqueUser, dupeUser] } },
    });
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: uniqueUser,
        email: uniqueEmail,
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.username).toBe(uniqueUser);
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it("should not register with duplicate username/email", async () => {
    // First registration
    await request(app)
      .post("/api/auth/register")
      .send({
        username: dupeUser,
        email: dupeEmail,
        password: "pass123",
      });

    // Try again with same username & email
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: dupeUser,
        email: dupeEmail,
        password: "pass123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/already taken/i);
  });

  it("should login an existing user by username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: uniqueUser,
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe(uniqueUser);
  });

  it("should login an existing user by email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: uniqueUser,
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});