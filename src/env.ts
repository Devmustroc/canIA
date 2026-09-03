import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  REPLICATE_API_TOKEN: z.string().optional(),
  UNSPLASH_ACCESS_KEY: z.string().optional(),
});

export const validateEnv = (env: Record<string, string | undefined>) => {
  return envSchema.safeParse(env);
};
