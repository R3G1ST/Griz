import { Router, type IRouter } from "express";
import { db, insertBookingSchema, bookingsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/bookings", async (req, res) => {
  const parsed = insertBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Некорректные данные", details: parsed.error.issues });
    return;
  }

  try {
    const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/bookings", async (_req, res) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
