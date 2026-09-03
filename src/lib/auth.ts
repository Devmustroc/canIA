import { getAuth } from "@clerk/hono";
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { Context } from "hono";

export async function getAuthUserId(c: Context): Promise<string | null> {
  // 1. Try Hono Clerk middleware context
  const honoAuth = getAuth(c);
  if (honoAuth?.userId) {
    return honoAuth.userId;
  }

  // 2. Fallback to Next.js Clerk server auth()
  try {
    const nextAuth = await clerkAuth();
    if (nextAuth?.userId) {
      return nextAuth.userId;
    }
  } catch (e) {
    console.error("Clerk nextAuth error:", e);
  }

  return null;
}
