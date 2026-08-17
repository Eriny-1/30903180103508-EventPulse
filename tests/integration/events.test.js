const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const connectDB = require("../../config/db");

describe("Events API", () => {
  let token;

  beforeAll(async () => {
    await connectDB();

    token = jwt.sign(
      {
        userId: "6a821829a271a966425bc95c",
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
  });

  // 1. GET /api/events
  test("GET /api/events should return 200 and an array of events", async () => {
    const response = await request(app).get("/api/events");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // 2. POST /api/events without JWT
  test("POST /api/events without authentication should return 401", async () => {
    const response = await request(app).post("/api/events").send({
      title: "Test Event",
      category: "64f0a1b2c3d4e5f678901234",
      date: "2026-09-01",
      capacity: 50,
    });

    expect(response.statusCode).toBe(401);
  });

  // 3. POST /api/events with invalid data
  test("POST /api/events with invalid data should return 422", async () => {
    const response = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        category: "invalid-id",
        date: "invalid-date",
        capacity: 0,
      });

    expect(response.statusCode).toBe(422);
  });
});
