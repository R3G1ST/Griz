import { Router, type IRouter, type Request, type Response } from "express";
import { db, insertBookingSchema, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const WEBHOOK_PATH = "/api/telegram/webhook";

async function tgApi(method: string, body: object) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {}
}

async function sendTelegramNotification(booking: {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment?: string | null;
}) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return;

  const guestWord =
    booking.guests === 1 ? "гость" : booking.guests < 5 ? "гостя" : "гостей";

  const text =
    `🐻 *Новая бронь — ГРИЗЛИ*\n\n` +
    `👤 ${booking.name}\n` +
    `📞 ${booking.phone}\n` +
    `📅 ${booking.date} в ${booking.time}\n` +
    `👥 Гостей: ${booking.guests} ${guestWord}\n` +
    (booking.comment ? `💬 ${booking.comment}\n` : "") +
    `\n🆔 Заявка #${booking.id}`;

  await tgApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "✅ Подтвердить", callback_data: `confirm:${booking.id}` },
        { text: "❌ Отменить",   callback_data: `cancel:${booking.id}` },
      ]],
    },
  });
}

// Register Telegram webhook on startup
export async function registerWebhook(baseUrl: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  const url = `${baseUrl}${WEBHOOK_PATH}`;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );
    const data = await res.json() as { ok: boolean; description?: string };
    console.log(`[Telegram] webhook set → ${url}:`, data.ok ? "OK" : data.description);
  } catch (e) {
    console.error("[Telegram] failed to set webhook:", e);
  }
}

// Telegram webhook handler
router.post("/telegram/webhook", async (req: Request, res: Response) => {
  res.sendStatus(200);

  const update = req.body as {
    callback_query?: {
      id: string;
      from: { first_name: string };
      message?: { message_id: number; chat: { id: number }; text?: string; reply_markup?: object };
      data?: string;
    };
  };

  if (!update.callback_query) return;

  const { id: callbackId, data, message, from } = update.callback_query;
  if (!data || !message) return;

  const [action, idStr] = data.split(":");
  const bookingId = Number(idStr);
  if (!action || isNaN(bookingId)) return;

  const newStatus = action === "confirm" ? "confirmed" : action === "cancel" ? "cancelled" : null;
  if (!newStatus) return;

  try {
    const [updated] = await db
      .update(bookingsTable)
      .set({ status: newStatus })
      .where(eq(bookingsTable.id, bookingId))
      .returning();

    if (!updated) {
      await tgApi("answerCallbackQuery", { callback_query_id: callbackId, text: "Заявка не найдена" });
      return;
    }

    const statusLabel = newStatus === "confirmed" ? "✅ Подтверждено" : "❌ Отменено";
    const actor = from.first_name ?? "Администратор";

    // Update the original message
    const updatedText =
      (message.text ?? "") + `\n\n${statusLabel} — ${actor}`;

    await Promise.all([
      tgApi("editMessageText", {
        chat_id: message.chat.id,
        message_id: message.message_id,
        text: updatedText,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [] },
      }),
      tgApi("answerCallbackQuery", {
        callback_query_id: callbackId,
        text: `${statusLabel} заявка #${bookingId}`,
        show_alert: false,
      }),
    ]);
  } catch (e) {
    console.error("[Telegram] webhook handler error:", e);
    await tgApi("answerCallbackQuery", { callback_query_id: callbackId, text: "Ошибка сервера" });
  }
});

// POST /bookings — create booking
router.post("/bookings", async (req: Request, res: Response) => {
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

// GET /bookings — list all
router.get("/bookings", async (_req: Request, res: Response) => {
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

// PATCH /bookings/:id — update status
router.patch("/bookings/:id", async (req: Request, res: Response) => {
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
