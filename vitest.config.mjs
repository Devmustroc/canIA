import { defineConfig } from "vitest/config";
import path from "path";

process.env.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "sk_test_1234567890abcdefghijklmnopqrstuvwxyz";
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
