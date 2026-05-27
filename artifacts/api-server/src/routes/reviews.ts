import { Router, type IRouter, type Request, type Response } from "express";
import { db, reviewsTable } from "@workspace/db";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();

const insertReviewSchema = z.object({
  name: z.string().min(1).max(100),
  text: z.string().min(5).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
});

// Public: only published reviews
router.get("/reviews", async (_req: Request, res: Response) => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.isPublished, 1))
      .orderBy(desc(reviewsTable.createdAt))
      .limit(50);
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Admin: all reviews (for moderation)
router.get("/reviews/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .orderBy(desc(reviewsTable.createdAt))
      .limit(200);
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/reviews", async (req: Request, res: Response) => {
  const parsed = insertReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Некорректные данные" });
    return;
  }
  try {
    const [review] = await db.insert(reviewsTable).values(parsed.data).returning();
    res.status(201).json(review);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
