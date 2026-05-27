import { Router, type IRouter, type Request, type Response } from "express";
import { db, siteSettingsTable, menuItemsTable, galleryImagesTable, reviewsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();

const SAFE_URL = /^https?:\/\/[^\s<>"']+$/i;
function isSafeUrl(u: unknown): u is string {
  return typeof u === "string" && u.length < 2048 && SAFE_URL.test(u);
}

// ── Site settings (key/value JSON) ────────────────────────────────────────────
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const obj: Record<string, unknown> = {};
    for (const r of rows) obj[r.key] = r.value;
    res.json(obj);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.put("/settings/:key", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    if (!/^[a-z0-9_-]{1,64}$/i.test(key)) {
      res.status(400).json({ error: "Invalid key" });
      return;
    }
    const value = req.body?.value ?? req.body;
    await db.insert(siteSettingsTable).values({ key, value })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ── Menu items ────────────────────────────────────────────────────────────────
router.get("/menu", async (_req: Request, res: Response) => {
  try {
    const items = await db.select().from(menuItemsTable)
      .orderBy(asc(menuItemsTable.section), asc(menuItemsTable.category), asc(menuItemsTable.sortOrder), asc(menuItemsTable.id));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/menu", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { section, category, name, description = "", price, sortOrder = 0, isActive = 1 } = req.body ?? {};
    if (!section || !category || !name || !price) {
      res.status(400).json({ error: "Заполните section, category, name, price" });
      return;
    }
    const [item] = await db.insert(menuItemsTable)
      .values({ section, category, name, description, price, sortOrder, isActive: isActive ? 1 : 0 }).returning();
    res.status(201).json(item);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.put("/menu/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    const b = req.body ?? {};
    const updates: Record<string, unknown> = {};
    for (const k of ["section", "category", "name", "description", "price", "sortOrder", "isActive"] as const) {
      if (k in b) updates[k] = b[k];
    }
    if (Object.keys(updates).length === 0) { res.status(400).json({ error: "no fields" }); return; }
    const [item] = await db.update(menuItemsTable).set(updates).where(eq(menuItemsTable.id, id)).returning();
    res.json(item);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.delete("/menu/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

// ── Gallery ──────────────────────────────────────────────────────────────────
router.get("/gallery", async (_req: Request, res: Response) => {
  try {
    const items = await db.select().from(galleryImagesTable)
      .orderBy(asc(galleryImagesTable.sortOrder), asc(galleryImagesTable.id));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/gallery", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { url, caption = "", sortOrder = 0 } = req.body ?? {};
    if (!isSafeUrl(url)) { res.status(400).json({ error: "URL должен быть http(s)://..." }); return; }
    const safeCaption = typeof caption === "string" ? caption.slice(0, 200) : "";
    const [item] = await db.insert(galleryImagesTable).values({ url, caption: safeCaption, sortOrder: Number(sortOrder) || 0 }).returning();
    res.status(201).json(item);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.delete("/gallery/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

// ── Reviews moderation (admin) ────────────────────────────────────────────────
router.delete("/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

router.patch("/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) { res.status(400).json({ error: "bad id" }); return; }
    const isPublished = req.body?.isPublished;
    if (typeof isPublished !== "number" && typeof isPublished !== "boolean") {
      res.status(400).json({ error: "isPublished required" }); return;
    }
    const [r] = await db.update(reviewsTable)
      .set({ isPublished: isPublished ? 1 : 0 })
      .where(eq(reviewsTable.id, id)).returning();
    res.json(r);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

export default router;
