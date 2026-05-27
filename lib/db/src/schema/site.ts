import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  key:   text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const menuItemsTable = pgTable("menu_items", {
  id:        serial("id").primaryKey(),
  section:   text("section").notNull(),
  category:  text("category").notNull(),
  name:      text("name").notNull(),
  description: text("description").notNull().default(""),
  price:     text("price").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive:  integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryImagesTable = pgTable("gallery_images", {
  id:        serial("id").primaryKey(),
  url:       text("url").notNull(),
  caption:   text("caption").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SiteSetting   = typeof siteSettingsTable.$inferSelect;
export type MenuItem      = typeof menuItemsTable.$inferSelect;
export type GalleryImage  = typeof galleryImagesTable.$inferSelect;
