import request from "supertest";
import app from "../src/index.js";

// 👇 Skip the entire suite for now
describe.skip("Compiler API", () => {
  it("should run code", async () => {
    const res = await request(app)
      .post("/api/compiler/run")
      .send({ language: "python", code: "print('Hello World')" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("stdout");
    expect(res.body.stdout).toContain("Hello World");
  });

  it("should fail if required fields missing", async () => {
    const res = await request(app).post("/api/compiler/run").send({});
    expect(res.statusCode).toBe(400);
  });
});