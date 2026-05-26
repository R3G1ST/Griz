import { Router, type IRouter } from "express";
import { db, insertBookingSchema, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const router: IRouter = Router();

async function sendTelegramNotification(booking: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text =
    `🐻 *Новая бронь — ГРИЗЛИ*\n\n` +
    `👤 ${booking.name}\n` +
    `📞 ${booking.phone}\n` +
    `📅 ${booking.date} в ${booking.time}\n` +
    `👥 Гостей: ${booking.guests}\n` +
    (booking.comment ? `💬 ${booking.comment}\n` : "");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch {
  }
}

router.post("/bookings", async (req, res) => {
  const parsed = insertBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Некорректные данные", details: parsed.error.issues });
    return;
  }

  try {
    const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
    sendTelegramNotification(booking).catch(() => {});
    res.status(201).json(booking);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/bookings", async (_req, res) => {
  try {
    const bookings = await db
      .select()
      .from(bookingsTable)
      .orderBy(bookingsTable.createdAt);
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

router.patch("/bookings/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Неверный id" }); return; }

  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Неверный статус" }); return; }

  try {
    const [updated] = await db
      .update(bookingsTable)
      .set({ status: parsed.data.status })
      .where(eq(bookingsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Не найдено" }); return; }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
