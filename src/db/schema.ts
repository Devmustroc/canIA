import {
    boolean,
    timestamp,
    pgTable,
    text,
    integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const projects = pgTable("project", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("userId").notNull(),
    json: text("json").notNull(),
    height: integer("height").notNull(),
    width: integer("width").notNull(),
    thumbnail: text("thumbnailUrl"),
    isTemplate: boolean("isTemplate"),
    isPro: boolean("isPro"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const projectsInsertSchema = createInsertSchema(projects);

export const subscriptions = pgTable("subscription", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull(),
    subscriptionId: text("subscriptionId").notNull(),
    customerId: text("customerId").notNull(),
    priceId: text("priceId").notNull(),
    status: text("status").notNull(),
    currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});