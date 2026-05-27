import { pgTable, serial, text, timestamp, integer, bigint, uuid } from "drizzle-orm/pg-core";

export const loyaltyCardsTable = pgTable("loyalty_cards", {
  id:           serial("id").primaryKey(),
  token:        uuid("token").unique().defaultRandom(),
  telegramId:   bigint("telegram_id", { mode: "number" }).unique(),
  phone:        text("phone").unique(),
  name:         text("name").notNull().default(""),
  visits:       integer("visits").notNull().default(0),
  bonusPoints:  integer("bonus_points").notNull().default(0),
  tier:         text("tier").notNull().default("bronze"),
  totalSpent:   integer("total_spent").notNull().default(0),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  lastVisitAt:  timestamp("last_visit_at"),
});

export const loyaltyVisitsTable = pgTable("loyalty_visits", {
  id:          serial("id").primaryKey(),
  cardId:      integer("card_id").notNull(),
  amountSpent: integer("amount_spent").notNull().default(0),
  bonusEarned: integer("bonus_earned").notNull().default(0),
  bonusUsed:   integer("bonus_used").notNull().default(0),
  note:        text("note"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

export type LoyaltyCard   = typeof loyaltyCardsTable.$inferSelect;
export type LoyaltyVisit  = typeof loyaltyVisitsTable.$inferSelect;
