import { pgTable, serial, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: text("price").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  isFeatured: integer("is_featured").notNull().default(0),
  outOfStock: integer("out_of_stock").default(0),
  isVisible: integer("is_visible").default(1),
  image: text("image"),
  ingredients: text("ingredients"),
  allergens: text("allergens"),
  calories: integer("calories"),
  protein: integer("protein"),
  fat: integer("fat"),
  carbs: integer("carbs"),
  menuCategory: text("menu_category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  image: text("image"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiKeysTable = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  permissions: jsonb("permissions").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

export type MenuItem = typeof menuItemsTable.$inferSelect;
export type Post = typeof postsTable.$inferSelect;
export type ApiKey = typeof apiKeysTable.$inferSelect;

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  telegramId: text("telegram_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect;


export const loyaltyUsers = pgTable('loyalty_users', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  name: varchar('name', { length: 100 }),
  status: varchar('status', { length: 20 }).default('bronze').notNull(),
  points: integer('points').default(0).notNull(),
  visits: integer('visits').default(0).notNull(),
  qrCode: varchar('qr_code', { length: 64 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
