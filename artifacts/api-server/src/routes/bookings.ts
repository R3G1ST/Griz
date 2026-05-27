import { Router, type IRouter, type Request, type Response } from "express";
import { db, insertBookingSchema, bookingsTable, loyaltyCardsTable } from "@workspace/db";
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

function guestWord(n: number): string {
  return n === 1 ? "гость" : n < 5 ? "гостя" : "гостей";
}

// Find guest's loyalty Telegram chat by phone (digits-only match).
async function findGuestTelegramId(phone: string): Promise<number | null> {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const rows = await db.execute(sql`
    SELECT telegram_id FROM ${loyaltyCardsTable}
    WHERE REGEXP_REPLACE(phone, '[^0-9]', '', 'g') = ${digits}
      AND telegram_id IS NOT NULL
    LIMIT 1
  `);
  const tg = (rows?.rows?.[0] as { telegram_id: number | string } | undefined)?.telegram_id;
  return tg ? Number(tg) : null;
}

// Format the booking date as "27 мая (вт)" for the guest message.
function formatRu(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  const wdays  = ["вс","пн","вт","ср","чт","пт","сб"];
  return `${d.getDate()} ${months[d.getMonth()]} (${wdays[d.getDay()]})`;
}

async function sendGuestReminder(b: { id: number; name: string; date: string; time: string; guests: number; phone: string }, kind: "day" | "hour") {
  const tgId = await findGuestTelegramId(b.phone);
  if (!tgId) return; // Guest is not in the loyalty bot — skip silently.
  const header = kind === "day"
    ? `🐻 *ГРИЗЛИ — напоминание о брони*\n\nЖдём вас завтра!`
    : `🐻 *ГРИЗЛИ — через час ждём вас!*`;
  const text =
    `${header}\n\n` +
    `📅 ${formatRu(b.date)} в *${b.time}*\n` +
    `👥 ${b.guests} ${guestWord(b.guests)}\n` +
    `📍 Тюмень, ул. Новосёлов, 92\n\n` +
    (kind === "hour"
      ? `Если планы изменились — позвоните +7 (916) 328-38-91.`
      : `До встречи! Если нужно перенести — позвоните +7 (916) 328-38-91.`);
  await tgApi("sendMessage", { chat_id: tgId, text, parse_mode: "Markdown" });
}

async function sendAdminReminder(b: { id: number; name: string; phone: string; date: string; time: string; guests: number }, kind: "day" | "hour") {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) return;
  const header = kind === "day"
    ? `📅 *Напоминание — бронь завтра*`
    : `⏰ *Напоминание — через час бронь!*`;
  await tgApi("sendMessage", {
    chat_id: chatId,
    text:
      `${header}\n\n` +
      `👤 ${b.name}\n` +
      `📞 ${b.phone}\n` +
      `📅 ${b.date} в ${b.time}\n` +
      `👥 ${b.guests} ${guestWord(b.guests)}\n` +
      `🆔 Заявка #${b.id}`,
    parse_mode: "Markdown",
  });
}

// Booking times are stored as local Tyumen wall-clock (UTC+5, no DST).
// Build a UTC instant from the stored strings so window math is server-TZ-agnostic.
const TYUMEN_OFFSET_MIN = 5 * 60;
function bookingInstant(b: { date: string; time: string }): number {
  // `${date}T${time}:00Z` gives UTC instant for that wall-clock time; subtract Tyumen offset.
  const asUtc = Date.parse(`${b.date}T${b.time}:00Z`);
  if (isNaN(asUtc)) return NaN;
  return asUtc - TYUMEN_OFFSET_MIN * 60_000;
}

function inWindow(b: { date: string; time: string }, minMin: number, maxMin: number): boolean {
  const start = bookingInstant(b);
  if (isNaN(start)) return false;
  const diffMin = (start - Date.now()) / 60_000;
  return diffMin >= minMin && diffMin <= maxMin;
}

// Atomically claim a reminder slot. Returns true only if THIS call flipped the flag.
async function claimReminder(bookingId: number, kind: "day" | "hour"): Promise<boolean> {
  const column = kind === "day" ? sql`reminder_day_sent` : sql`reminder_sent`;
  const rows = await db.execute(sql`
    UPDATE bookings
    SET ${column} = true
    WHERE id = ${bookingId} AND ${column} = false
    RETURNING id
  `);
  return (rows?.rows?.length ?? 0) > 0;
}

// Roll back the claim if delivery failed entirely — try again next tick.
async function releaseReminder(bookingId: number, kind: "day" | "hour") {
  const column = kind === "day" ? sql`reminder_day_sent` : sql`reminder_sent`;
  await db.execute(sql`UPDATE bookings SET ${column} = false WHERE id = ${bookingId}`);
}

// Reminder scheduler — runs every minute. Sends:
//   • 24h-before reminder (window 23h55m–24h05m) — to admin + guest (if in loyalty bot)
//   • 1h-before  reminder (window 55–65 min)     — to admin + guest (if in loyalty bot)
let reminderRunning = false;
let warnedNoToken = false;

export function startReminderScheduler() {
  setInterval(async () => {
    if (reminderRunning) return; // Skip overlapping tick — prevents duplicate sends.
    reminderRunning = true;
    try {
      if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
        if (!warnedNoToken) {
          console.warn("[Reminder] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing — reminders disabled");
          warnedNoToken = true;
        }
        return;
      }
      warnedNoToken = false;

      const confirmed = await db
        .select()
        .from(bookingsTable)
        .where(eq(bookingsTable.status, "confirmed"));

      for (const b of confirmed) {
        for (const kind of ["day", "hour"] as const) {
          const alreadySent = kind === "day" ? b.reminderDaySent : b.reminderSent;
          if (alreadySent) continue;
          const windowOk = kind === "day"
            ? inWindow(b, 23 * 60 + 55, 24 * 60 + 5)
            : inWindow(b, 55, 65);
          if (!windowOk) continue;

          // Atomic claim — only one tick (and only one process) wins.
          const claimed = await claimReminder(b.id, kind);
          if (!claimed) continue;

          let adminOk = false;
          let guestOk = true; // Default true — absence of guest TG card is OK.
          try {
            await sendAdminReminder(b, kind);
            adminOk = true;
          } catch (e) {
            console.error(`[Reminder] admin send failed (booking #${b.id}, ${kind}):`, e);
          }
          try {
            await sendGuestReminder(b, kind);
          } catch (e) {
            guestOk = false;
            console.error(`[Reminder] guest send failed (booking #${b.id}, ${kind}):`, e);
          }

          // If the primary (admin) channel failed, release so we retry next tick.
          // Guest DM failure alone doesn't trigger retry (avoid spamming the admin).
          if (!adminOk && !guestOk) {
            await releaseReminder(b.id, kind);
          }
        }
      }
    } catch (e) {
      console.error("[Reminder] error:", e);
    } finally {
      reminderRunning = false;
    }
  }, 60_000);
  console.log("[Reminder] scheduler started (24h + 1h windows, Tyumen UTC+5, atomic claim)");
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
