/**
 * Loyalty API routes
 * Совместима с iiko и Keeper POS — phone-based lookup
 */
import { Router, type IRouter, type Request, type Response } from "express";
import { db, loyaltyCardsTable, loyaltyVisitsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { handleLoyaltyUpdate } from "../loyalty-bot";
import { getTier, calcBonus } from "../loyalty-bot";

const router: IRouter = Router();

// Helper: normalize phone (strip non-digits)
function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

async function findCardByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  const [card] = await db.select().from(loyaltyCardsTable)
    .where(sql`REGEXP_REPLACE(${loyaltyCardsTable.phone}, '[^0-9]', '', 'g') = ${normalized}`);
  return card ?? null;
}

// ── Card by token (for PWA page) ──────────────────────────────────────────────
router.get("/loyalty/card/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  const [card] = await db.select().from(loyaltyCardsTable)
    .where(eq(loyaltyCardsTable.token, token)).catch(() => []);
  if (!card) { res.status(404).json({ error: "Card not found" }); return; }
  const tier = getTier(card.visits);
  res.json({ ...card, found: true, tier_info: { name: tier.name, emoji: tier.emoji, discount: tier.discount, bonus_rate: tier.bonusRate, nextAt: tier.nextAt } });
});

// ── Card visit history (for Mini App) ─────────────────────────────────────────
router.get("/loyalty/card/:token/history", async (req: Request, res: Response) => {
  const { token } = req.params;
  const limitRaw = Number(req.query.limit ?? 20);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100 ? Math.floor(limitRaw) : 20;
  const [card] = await db.select({ id: loyaltyCardsTable.id }).from(loyaltyCardsTable)
    .where(eq(loyaltyCardsTable.token, token)).catch(() => []);
  if (!card) { res.status(404).json({ error: "Card not found" }); return; }
  const visits = await db.select().from(loyaltyVisitsTable)
    .where(eq(loyaltyVisitsTable.cardId, card.id))
    .orderBy(sql`created_at DESC`).limit(limit);
  res.json({ visits });
});

// ── Webhook from Telegram ─────────────────────────────────────────────────────
router.post("/loyalty/tg", async (req: Request, res: Response) => {
  res.json({ ok: true }); // respond fast
  await handleLoyaltyUpdate(req.body);
});

// ── POS-compatible API ────────────────────────────────────────────────────────

/**
 * GET /api/loyalty/lookup?phone=79001234567
 * Returns customer info in iiko/Keeper-compatible format
 */
router.get("/loyalty/lookup", async (req: Request, res: Response) => {
  const phone = req.query.phone as string;
  if (!phone) { res.status(400).json({ error: "phone required" }); return; }
  const card = await findCardByPhone(phone).catch(() => null);
  if (!card) { res.status(404).json({ found: false, error: "Customer not found" }); return; }
  const tier = getTier(card.visits);
  res.json({
    found: true,
    id:           card.id,
    name:         card.name,
    phone:        card.phone,
    visits:       card.visits,
    bonus_points: card.bonusPoints,
    tier:         tier.name,
    tier_emoji:   tier.emoji,
    discount_pct: tier.discount,
    bonus_rate:   tier.bonusRate,
    last_visit:   card.lastVisitAt,
    // iiko-compatible fields
    balance:      card.bonusPoints,
    discount:     tier.discount / 100,
  });
});

/**
 * POST /api/loyalty/visit
 * Body: { phone, amount_spent, note? }
 * Registers a visit and awards bonus points
 */
router.post("/loyalty/visit", async (req: Request, res: Response) => {
  const { phone, amount_spent, note } = req.body as { phone: string; amount_spent?: number; note?: string };
  if (!phone) { res.status(400).json({ error: "phone required" }); return; }
  const card = await findCardByPhone(phone).catch(() => null);
  if (!card) { res.status(404).json({ error: "Customer not found" }); return; }

  const amount = Number(amount_spent ?? 0);
  const tier = getTier(card.visits);
  const bonusEarned = amount > 0 ? calcBonus(amount, tier) : 0;
  const newVisits = card.visits + 1;
  const newBonus  = card.bonusPoints + bonusEarned;
  const newTier   = getTier(newVisits);

  await db.update(loyaltyCardsTable)
    .set({ visits: newVisits, bonusPoints: newBonus, tier: newTier.name, lastVisitAt: new Date() })
    .where(eq(loyaltyCardsTable.id, card.id));

  await db.insert(loyaltyVisitsTable).values({
    cardId: card.id, amountSpent: amount, bonusEarned, bonusUsed: 0, note: note ?? undefined,
  });

  res.json({
    success: true,
    visits:       newVisits,
    bonus_earned: bonusEarned,
    bonus_balance: newBonus,
    tier:         newTier.name,
    tier_emoji:   newTier.emoji,
    tier_changed: newTier.name !== tier.name,
  });
});

/**
 * POST /api/loyalty/redeem
 * Body: { phone, points }
 * Redeems bonus points
 */
router.post("/loyalty/redeem", async (req: Request, res: Response) => {
  const { phone, points } = req.body as { phone: string; points: number };
  if (!phone || !points) { res.status(400).json({ error: "phone and points required" }); return; }
  const card = await findCardByPhone(phone).catch(() => null);
  if (!card) { res.status(404).json({ error: "Customer not found" }); return; }
  if (card.bonusPoints < points) { res.status(400).json({ error: "Insufficient bonus points", available: card.bonusPoints }); return; }

  const newBalance = card.bonusPoints - points;
  await db.update(loyaltyCardsTable).set({ bonusPoints: newBalance }).where(eq(loyaltyCardsTable.id, card.id));
  await db.insert(loyaltyVisitsTable).values({ cardId: card.id, amountSpent: 0, bonusEarned: 0, bonusUsed: points, note: "POS redemption" });

  res.json({ success: true, redeemed: points, bonus_balance: newBalance });
});

/**
 * GET /api/loyalty/customers
 * Admin endpoint — list all customers with stats
 */
router.get("/loyalty/customers", async (_req: Request, res: Response) => {
  const cards = await db.select().from(loyaltyCardsTable)
    .orderBy(sql`visits DESC`).limit(200);
  res.json(cards.map(c => {
    const tier = getTier(c.visits);
    return { ...c, tier_info: { name: tier.name, emoji: tier.emoji, discount: tier.discount, bonus_rate: tier.bonusRate } };
  }));
});

/**
 * GET /api/loyalty/stats
 * Aggregate stats for admin dashboard
 */
router.get("/loyalty/stats", async (_req: Request, res: Response) => {
  const result = await db.execute(sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE visits >= 20)::int AS vip,
      COUNT(*) FILTER (WHERE visits >= 10 AND visits < 20)::int AS gold,
      COUNT(*) FILTER (WHERE visits >= 5  AND visits < 10)::int AS silver,
      COUNT(*) FILTER (WHERE visits < 5)::int  AS bronze,
      COALESCE(SUM(bonus_points), 0)::int       AS total_bonus,
      COALESCE(AVG(visits), 0)::numeric(6,2)    AS avg_visits
    FROM loyalty_cards
  `);
  res.json((result as any).rows[0] ?? {});
});

export default router;
