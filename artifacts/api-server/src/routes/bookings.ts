import { Router, type IRouter, type Request, type Response } from "express";
import { db, insertBookingSchema, bookingsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();
const WEBHOOK_PATH = "/api/telegram/webhook";

async function tgApi(method: string, body: object) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {}
}

async function sendTelegramNotification(booking: {
  id: number; name: string; phone: string; date: string;
  time: string; guests: number; comment?: string | null;
}) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return;

  const guestWord = booking.guests === 1 ? "гость" : booking.guests < 5 ? "гостя" : "гостей";

  // Check returning guest loyalty
  const [loyalty] = await db.execute(sql`
    SELECT COUNT(*)::int AS visits FROM ${bookingsTable}
    WHERE phone = ${booking.phone} AND status = 'confirmed'
  `);
  const visits = (loyalty?.rows?.[0] as { visits: number } | undefined)?.visits ?? 0;
  let loyaltyLine = "";
  if (visits === 2) loyaltyLine = "\n🌟 *3-й визит — постоянный гость!*";
  else if (visits === 4) loyaltyLine = "\n🥇 *5-й визит — золотой гость!*";
  else if (visits === 9) loyaltyLine = "\n👑 *10-й визит — VIP статус!*";
  else if (visits >= 1) loyaltyLine = `\n♻️ Возвращается (визит #${visits + 1})`;

  const text =
    `🐻 *Новая бронь — ГРИЗЛИ*\n\n` +
    `👤 ${booking.name}\n` +
    `📞 ${booking.phone}\n` +
    `📅 ${booking.date} в ${booking.time}\n` +
    `👥 Гостей: ${booking.guests} ${guestWord}\n` +
    (booking.comment ? `💬 ${booking.comment}\n` : "") +
    loyaltyLine +
    `\n\n🆔 Заявка #${booking.id}`;

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

export async function registerWebhook(baseUrl: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  const url = `${baseUrl}${WEBHOOK_PATH}`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json() as { ok: boolean; description?: string };
    console.log(`[Telegram] webhook → ${url}:`, data.ok ? "OK" : data.description);
  } catch (e) {
    console.error("[Telegram] failed to set webhook:", e);
  }
}

// Reminder scheduler — runs every minute, sends reminder 60 min before booking
export function startReminderScheduler() {
  setInterval(async () => {
    try {
      const now = new Date();
      // Target window: bookings starting in 55–65 minutes
      const lo = new Date(now.getTime() + 55 * 60 * 1000);
      const hi = new Date(now.getTime() + 65 * 60 * 1000);

      const loDate = lo.toISOString().slice(0, 10);
      const hiDate = hi.toISOString().slice(0, 10);
      const loTime = lo.toTimeString().slice(0, 5);
      const hiTime = hi.toTimeString().slice(0, 5);

      const upcoming = await db
        .select()
        .from(bookingsTable)
        .where(
          and(
            eq(bookingsTable.reminderSent, false),
            eq(bookingsTable.status, "confirmed"),
          )
        );

      for (const b of upcoming) {
        if (b.date < loDate || b.date > hiDate) continue;
        if (b.date === loDate && b.time < loTime) continue;
        if (b.date === hiDate && b.time > hiTime) continue;

        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (chatId && process.env.TELEGRAM_BOT_TOKEN) {
          const guestWord = b.guests === 1 ? "гость" : b.guests < 5 ? "гостя" : "гостей";
          await tgApi("sendMessage", {
            chat_id: chatId,
            text:
              `⏰ *Напоминание — через час бронь!*\n\n` +
              `👤 ${b.name}\n` +
              `📞 ${b.phone}\n` +
              `📅 ${b.date} в ${b.time}\n` +
              `👥 ${b.guests} ${guestWord}\n` +
              `🆔 Заявка #${b.id}`,
            parse_mode: "Markdown",
          });
        }

        await db.update(bookingsTable)
          .set({ reminderSent: true })
          .where(eq(bookingsTable.id, b.id));
      }
    } catch (e) {
      console.error("[Reminder] error:", e);
    }
  }, 60_000);
  console.log("[Reminder] scheduler started");
}

// Telegram webhook handler
router.post("/telegram/webhook", async (req: Request, res: Response) => {
  res.sendStatus(200);

  const update = req.body as {
    callback_query?: {
      id: string;
      from: { first_name: string };
      message?: { message_id: number; chat: { id: number }; text?: string };
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

    // Check loyalty on confirmation
    if (newStatus === "confirmed") {
      const [loyalty] = await db.execute(sql`
        SELECT COUNT(*)::int AS visits FROM ${bookingsTable}
        WHERE phone = ${updated.phone} AND status = 'confirmed'
      `);
      const visits = (loyalty?.rows?.[0] as { visits: number } | undefined)?.visits ?? 0;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (chatId && process.env.TELEGRAM_BOT_TOKEN) {
        if (visits === 3) {
          await tgApi("sendMessage", { chat_id: chatId, text: `🌟 *${updated.name}* — постоянный гость (3-й визит)! Предложите бонус 🎁`, parse_mode: "Markdown" });
        } else if (visits === 5) {
          await tgApi("sendMessage", { chat_id: chatId, text: `🥇 *${updated.name}* — золотой гость (5-й визит)! Скидка 10% 🏅`, parse_mode: "Markdown" });
        } else if (visits === 10) {
          await tgApi("sendMessage", { chat_id: chatId, text: `👑 *${updated.name}* — VIP гость (10-й визит)! Особые привилегии ✨`, parse_mode: "Markdown" });
        }
      }
    }

    const updatedText = (message.text ?? "") + `\n\n${statusLabel} — ${actor}`;
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

// POST /bookings
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

// GET /bookings
router.get("/bookings", async (_req: Request, res: Response) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// PATCH /bookings/:id
const patchSchema = z.object({ status: z.enum(["pending", "confirmed", "cancelled"]) });

router.patch("/bookings/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Неверный id" }); return; }
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Неверный статус" }); return; }
  try {
    const [updated] = await db.update(bookingsTable)
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
