import { describe, it, expect } from "vitest";
import { projects, subscriptions, projectsInsertSchema } from "./schema";
import { getTableColumns } from "drizzle-orm";

describe("Drizzle Database Schemas", () => {
  describe("projects table schema", () => {
    it("should define correct table columns", () => {
      const columns = getTableColumns(projects);
      expect(columns).toHaveProperty("id");
      expect(columns).toHaveProperty("name");
      expect(columns).toHaveProperty("userId");
      expect(columns).toHaveProperty("json");
      expect(columns).toHaveProperty("height");
      expect(columns).toHaveProperty("width");
      expect(columns).toHaveProperty("thumbnail");
      expect(columns).toHaveProperty("isTemplate");
      expect(columns).toHaveProperty("isPro");
    });

    it("should validate project insert schema with valid fields", () => {
      const validProject = {
        name: "My Graphic Poster",
        userId: "user_clerk_123",
        json: '{"version":"5.3.0","objects":[]}',
        height: 1080,
        width: 1920,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectsInsertSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it("should reject project insert schema when required fields are missing", () => {
      const invalidProject = {
        name: "Incomplete Project",
        // missing userId, json, height, width
      };

      const result = projectsInsertSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });
  });

  describe("subscriptions table schema", () => {
    it("should define correct table columns", () => {
      const columns = getTableColumns(subscriptions);
      expect(columns).toHaveProperty("id");
      expect(columns).toHaveProperty("userId");
      expect(columns).toHaveProperty("subscriptionId");
      expect(columns).toHaveProperty("customerId");
      expect(columns).toHaveProperty("priceId");
      expect(columns).toHaveProperty("status");
      expect(columns).toHaveProperty("currentPeriodEnd");
    });
  });
});
