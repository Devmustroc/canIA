import { describe, it, expect } from "vitest";
import { validateEnv, envSchema } from "./env";

describe("Environment Variables Validation (Zod Schema)", () => {
  it("should pass validation when required environment variables are present", () => {
    const mockEnv = {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_mock_key",
      CLERK_SECRET_KEY: "sk_test_mock_secret",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    };

    const result = validateEnv(mockEnv);
    expect(result.success).toBe(true);
  });

  it("should fail validation when required Clerk keys are missing", () => {
    const invalidEnv = {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    };

    const result = validateEnv(invalidEnv);
    expect(result.success).toBe(false);
  });

  it("should default NEXT_PUBLIC_APP_URL if missing", () => {
    const parsed = envSchema.parse({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
      CLERK_SECRET_KEY: "sk_test_123",
    });

    expect(parsed.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });
});
