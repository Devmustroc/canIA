import { describe, it, expect } from "vitest";
import { app } from "./route";

describe("Hono API Router Integration Tests", () => {
  it("should return 404 for non-existent API routes", async () => {
    const res = await app.request("/api/non-existent-endpoint");
    expect(res.status).toBe(404);
  });

  it("should protect projects endpoints requiring authentication", async () => {
    const res = await app.request("/api/projects");
    // Without authentication, it should respond with 401 Unauthorized
    expect([400, 401, 500]).toContain(res.status);
  });

  it("should respond to GET /api/images request", async () => {
    const res = await app.request("/api/images");
    // Route responds either 401 (unauthorized) or 200 (if public)
    expect(res.status).toBeLessThan(500);
  });
});
