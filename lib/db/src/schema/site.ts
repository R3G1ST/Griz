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
  isFeatured: integer("is_featured").notNull().default(0),
  strength: integer("strength").default(4),
  sessionDuration: integer("session_duration").default(120),
  bowl: text("bowl"),
  coal: text("coal"),
  tobaccoBrand: text("tobacco_brand"),
  tobaccoFlavor: text("tobacco_flavor"),
  hookahModel: text("hookah_model"),
  priceFeatured: text("price_featured"),
  descriptionFeatured: text("description_featured"),
  menuCategory: text("menu_category"),
  status: text("status").default("active"),
  isVisible: integer("is_visible").default(1),
  outOfStock: integer("out_of_stock").default(0),
  image: text("image"),
  categoryImage: text("category_image"),
  ingredients: text("ingredients"),
  allergens: text("allergens"),
  calories: integer("calories"),
  protein: integer("protein"),
  fat: integer("fat"),
  carbs: integer("carbs"),
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
