import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { projects, projectsInsertSchema } from "@/db/schema";
import { db } from "@/db/drizzle";
import { and, asc, desc, eq } from "drizzle-orm";
import { getAuthUserId } from "@/lib/auth";

const app = new Hono()
    .get('/templates',
        zValidator(
            "query",
            z.object({
                page: z.coerce.number(),
                limit: z.coerce.number(),
            })
        ),
        async (c) => {
            const { page, limit } = c.req.valid("query");

            const data = await db
                .select()
                .from(projects)
                .where(eq(projects.isTemplate, true))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(
                    asc(projects.isPro),
                    desc(projects.updatedAt)
                );

            return c.json({ data });
        }
    )
    .delete(
        '/:id',
        zValidator(
            'param',
            z.object({
                id: z.string(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            const { id } = c.req.valid('param');

            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db.delete(projects)
                .where(
                    and(
                        eq(projects.id, id),
                        eq(projects.userId, userId)
                    )
                ).returning();

            if (!data || data.length === 0) {
                return c.json({ error: "Failed to delete project" }, 400);
            }

            return c.json({ data: { id } });
        }
    )
    .post(
        '/:id/duplicate',
        zValidator(
            'param',
            z.object({
                id: z.string(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            const { id } = c.req.valid('param');

            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select()
                .from(projects)
                .where(
                    and(
                        eq(projects.id, id),
                        eq(projects.userId, userId)
                    )
                );

            if (!data || data.length === 0) {
                return c.json({ error: "Project not found" }, 404);
            }

            const project = data[0];

            const duplicateData = await db
                .insert(projects)
                .values({
                    name: `Copy of ${project.name}`,
                    json: project.json,
                    width: project.width,
                    height: project.height,
                    userId: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning();

            if (!duplicateData) {
                return c.json({ error: "Failed to duplicate project" }, 400);
            }

            return c.json({ data: duplicateData[0] });
        }
    )
    .get('/',
        zValidator(
            "query",
            z.object({
                page: z.coerce.number(),
                limit: z.coerce.number(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            const { page, limit } = c.req.valid("query");

            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select()
                .from(projects)
                .where(
                    eq(projects.userId, userId)
                )
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(
                    desc(projects.updatedAt)
                );

            return c.json({ data, nextPage: data.length === limit ? page + 1 : null });
        }
    )
    .patch(
        '/:id',
        zValidator(
            'param',
            z.object({
                id: z.string(),
            })
        ),
        zValidator(
            'json',
            projectsInsertSchema
                .omit({
                    id: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true,
                }).partial()
        ),
        async (c) => {
            const userId = await getAuthUserId(c);

            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { id } = c.req.valid('param');
            const values = c.req.valid('json');

            const data = await db
                .update(projects)
                .set({
                    ...values,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(projects.id, id),
                        eq(projects.userId, userId)
                    )
                ).returning();

            if (!data || data.length === 0) {
                return c.json({ error: "Failed to update project" }, 400);
            }

            return c.json({ data: data[0] });
        }
    )
    .get(
        '/:id',
        zValidator(
            'param',
            z.object({
                id: z.string(),
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            const { id } = c.req.valid('param');

            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select()
                .from(projects)
                .where(
                    and(
                        eq(projects.id, id),
                        eq(projects.userId, userId)
                    )
                );

            if (!data || data.length === 0) {
                return c.json({ error: "Project not found" }, 404);
            }

            return c.json({ data: data[0] });
        }
    )
    .post(
        '/',
        zValidator(
            'json',
            projectsInsertSchema.pick({
                name: true,
                json: true,
                width: true,
                height: true,
            })
        ),
        async (c) => {
            const userId = await getAuthUserId(c);
            const {
                name,
                json,
                width,
                height
            } = c.req.valid("json");

            if (!userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .insert(projects)
                .values({
                    name,
                    json,
                    width: width,
                    height: height,
                    userId: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning();

            if (!data) {
                return c.json({ error: "Failed to create project" }, 400);
            }

            return c.json({ data: data[0] });
        }
    );

export default app;