import { Hono } from "hono";
import { clerkMiddleware } from "@clerk/hono";
import images from "./images";
import ai from "./ai";
import agent from "./agent";
import projects from "./projects";
import subscriptions from "./subscriptions";

export const runtime = "nodejs";

export const app = new Hono().basePath("/api");

app.use(
  "*",
  clerkMiddleware({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

const routes = app
  .route("/ai", ai)
  .route("/agent", agent)
  .route("/images", images)
  .route("/projects", projects)
  .route("/subscriptions", subscriptions);

export type AppType = typeof routes;
