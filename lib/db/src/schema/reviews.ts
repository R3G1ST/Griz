import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull().default(5),
  source: text("source").notNull().default("site"),
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = typeof reviewsTable.$inferInsert;
