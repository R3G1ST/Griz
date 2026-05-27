import { db, loyaltyCardsTable, loyaltyVisitsTable, reviewsTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import type { LoyaltyCard } from "@workspace/db";

const LOYALTY_TOKEN = () => process.env.LOYALTY_BOT_TOKEN;
const LOYALTY_PATH  = "/api/loyalty/tg";

// ── Tier config ────────────────────────────────────────────────────────────────
type Tier = { name: string; emoji: string; minVisits: number; nextAt: number | null; bonusRate: number; discount: number };
const TIERS: Tier[] = [
  { name: "Бронзовый",   emoji: "🥉", minVisits: 0,  nextAt: 5,    bonusRate: 3,  discount: 0  },
  { name: "Серебряный",  emoji: "🥈", minVisits: 5,  nextAt: 10,   bonusRate: 5,  discount: 3  },
  { name: "Золотой",     emoji: "🥇", minVisits: 10, nextAt: 20,   bonusRate: 7,  discount: 7  },
  { name: "VIP",         emoji: "💎", minVisits: 20, nextAt: null,  bonusRate: 12, discount: 12 },
];

export function getTier(visits: number): Tier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (visits >= TIERS[i].minVisits) return TIERS[i];
  }
  return TIERS[0];
}

export function calcBonus(amountSpent: number, tier: Tier): number {
  return Math.floor((amountSpent * tier.bonusRate) / 100);
}

function progressBar(current: number, max: number, len = 10): string {
  const filled = Math.round((current / max) * len);
  return "█".repeat(filled) + "░".repeat(len - filled);
}

// Escape user-provided text before inserting into Telegram HTML messages
function esc(s: string | null | undefined): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Telegram API helper ───────────────────────────────────────────────────────
async function tg(method: string, body: object) {
  const token = LOYALTY_TOKEN();
  if (!token) return null;
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    return await r.json();
  } catch { return null; }
}

async function send(chatId: number | string, text: string, extra: object = {}) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...extra });
}

async function sendPhotoFile(chatId: number | string, filePath: string, caption: string, extra: Record<string, unknown> = {}) {
  const token = LOYALTY_TOKEN();
  if (!token) return null;
  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const abs = path.resolve(process.cwd(), filePath);
    const buf = await readFile(abs);
    const form = new FormData();
    form.append("chat_id", String(chatId));
    form.append("caption", caption);
    form.append("parse_mode", "HTML");
    for (const [k, v] of Object.entries(extra)) {
      form.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    form.append("photo", new Blob([buf], { type: "image/jpeg" }), path.basename(abs));
    const r = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: form });
    return await r.json();
  } catch (e) {
    console.warn("[loyalty-bot] sendPhotoFile failed, falling back to text:", e);
    return send(chatId, caption, extra);
  }
}

async function editMessage(chatId: number | string, messageId: number, text: string, extra: object = {}) {
  return tg("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", ...extra });
}

// ── Card URL helper ───────────────────────────────────────────────────────────
function cardUrl(token: string | null | undefined): string | null {
  const domain = process.env.REPLIT_DEV_DOMAIN;
  if (!domain || !token) return null;
  return `https://${domain}/loyalty/${token}`;
}

// ── Staff notification ────────────────────────────────────────────────────────
async function notifyStaff(guestName: string, tableNum: string, staffType: string, request: string) {
  const adminChatId = process.env.TELEGRAM_CHAT_ID;
  if (!adminChatId) return;

  const staffEmoji = staffType === "hookah" ? "💨" : "🍽️";
  const staffName  = staffType === "hookah" ? "Кальянный мастер" : "Официант";

  // Use booking bot token to notify admin chat (same group)
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const text =
    `🔔 <b>ВЫЗОВ ПЕРСОНАЛА</b>\n\n` +
    `${staffEmoji} <b>${staffName}</b>\n` +
    `🪑 Стол: <b>№${esc(tableNum)}</b>\n` +
    `📋 Запрос: <b>${esc(request)}</b>\n` +
    `👤 Гость: ${esc(guestName)}`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: adminChatId, text, parse_mode: "HTML" }),
  });
}

// ── Card renderer ─────────────────────────────────────────────────────────────
function renderCard(card: LoyaltyCard): { text: string; markup: object } {
  const tier = getTier(card.visits);
  const nextTier = TIERS.find(t => t.minVisits > card.visits);
  const visitsToNext = nextTier ? nextTier.minVisits - card.visits : 0;
  const progressLine = nextTier
    ? `${progressBar(card.visits - tier.minVisits, nextTier.minVisits - tier.minVisits)} до ${nextTier.emoji}\n` +
      `<i>Ещё ${visitsToNext} визит${visitsToNext === 1 ? "" : visitsToNext < 5 ? "а" : "ов"} до ${nextTier.name}</i>`
    : "🏆 Максимальный уровень достигнут!";

  const phone = card.phone ? card.phone : "не указан";
  const lastVisit = card.lastVisitAt
    ? new Date(card.lastVisitAt).toLocaleDateString("ru-RU")
    : "ещё не было";

  const text =
    `╔═══════════════════════════╗\n` +
    `║   🐻 <b>ГРИЗЛИ Hookah Lounge</b>   ║\n` +
    `║     КАРТА ЛОЯЛЬНОСТИ      ║\n` +
    `╠═══════════════════════════╣\n` +
    `║ 👤 <b>${esc(card.name || "Гость")}</b>\n` +
    `║ 📞 ${esc(phone)}\n` +
    `╠═══════════════════════════╣\n` +
    `║ ${tier.emoji} <b>${tier.name} гость</b>\n` +
    `║\n` +
    `║ 🔢 Визитов:    <b>${card.visits}</b>\n` +
    `║ 🎁 Баллов:     <b>${card.bonusPoints}</b> руб.\n` +
    (tier.discount > 0 ? `║ 💸 Скидка:     <b>${tier.discount}%</b>\n` : "") +
    `║ 📈 Бонус:      <b>${tier.bonusRate}%</b> с покупки\n` +
    `║\n` +
    `║ ${progressLine}\n` +
    `║\n` +
    `║ 📅 Последний визит: ${lastVisit}\n` +
    `╚═══════════════════════════╝`;

  const url = cardUrl(card.token);
  const markup = {
    inline_keyboard: [
      ...(url ? [[{ text: "📱 Показать кассиру", url }]] : []),
      [
        { text: "🎁 Баллы",    callback_data: "balance" },
        { text: "📊 История",  callback_data: "history" },
      ],
      [
        { text: "🔔 Позвать персонал", callback_data: "call_staff" },
      ],
      [
        { text: "⭐ Оставить отзыв",   callback_data: "review_start" },
      ],
      [
        { text: "🔄 Обновить",   callback_data: "card" },
        { text: "🔗 Изм. номер", callback_data: "changephone" },
      ],
    ],
  };

  return { text, markup };
}

// ── Staff call menus ──────────────────────────────────────────────────────────
function staffMainMenu() {
  return {
    inline_keyboard: [
      [{ text: "💨 Кальянный мастер", callback_data: "call_hookah" }],
      [{ text: "🍽️ Официант",          callback_data: "call_waiter" }],
      [{ text: "← Назад",             callback_data: "card"       }],
    ],
  };
}

function hookahMenu() {
  return {
    inline_keyboard: [
      [{ text: "🔥 Сменить уголь",    callback_data: "req:hookah:Сменить уголь"   }],
      [{ text: "💨 Перебить кальян",  callback_data: "req:hookah:Перебить кальян" }],
      [{ text: "🚫 Убрать кальян",    callback_data: "req:hookah:Убрать кальян"   }],
      [{ text: "❓ Другое",            callback_data: "req:hookah:Другое"          }],
      [{ text: "← Назад",             callback_data: "call_staff"                 }],
    ],
  };
}

function waiterMenu() {
  return {
    inline_keyboard: [
      [{ text: "💳 Принести счёт",      callback_data: "req:waiter:Принести счёт"    }],
      [{ text: "💧 Принести воду",       callback_data: "req:waiter:Принести воду"    }],
      [{ text: "📋 Хочу сделать заказ",  callback_data: "req:waiter:Сделать заказ"    }],
      [{ text: "🧹 Убрать со стола",     callback_data: "req:waiter:Убрать со стола"  }],
      [{ text: "❓ Другое",               callback_data: "req:waiter:Другое"           }],
      [{ text: "← Назад",                callback_data: "call_staff"                  }],
    ],
  };
}

// ── DB helpers ────────────────────────────────────────────────────────────────
async function findCard(telegramId: number): Promise<LoyaltyCard | null> {
  const [card] = await db.select().from(loyaltyCardsTable).where(eq(loyaltyCardsTable.telegramId, telegramId));
  return card ?? null;
}

async function findCardByPhone(phone: string): Promise<LoyaltyCard | null> {
  const normalized = phone.replace(/\D/g, "");
  const [card] = await db.select().from(loyaltyCardsTable)
    .where(sql`REGEXP_REPLACE(${loyaltyCardsTable.phone}, '[^0-9]', '', 'g') = ${normalized}`);
  return card ?? null;
}

async function createCard(telegramId: number, name: string, phone?: string): Promise<LoyaltyCard> {
  const [card] = await db.insert(loyaltyCardsTable).values({
    telegramId, name, phone: phone ?? null, visits: 0, bonusPoints: 0, tier: "bronze",
  }).returning();
  return card;
}

async function updateTier(card: LoyaltyCard): Promise<LoyaltyCard> {
  const tier = getTier(card.visits);
  const [updated] = await db.update(loyaltyCardsTable)
    .set({ tier: tier.name.toLowerCase() === "vip" ? "vip" : tier.name.toLowerCase() === "золотой" ? "gold" : tier.name.toLowerCase() === "серебряный" ? "silver" : "bronze" })
    .where(eq(loyaltyCardsTable.id, card.id)).returning();
  return updated;
}

// ── Session state (in-memory) ─────────────────────────────────────────────────
type SessionState =
  | { state: "awaiting_phone" }
  | { state: "awaiting_phone_change" }
  | { state: "awaiting_table"; staffType: string; request: string }
  | { state: "awaiting_review_rating" }
  | { state: "awaiting_review_text"; rating: number };

const sessions: Map<number, SessionState> = new Map();

// ── Message handlers ──────────────────────────────────────────────────────────
async function handleStart(chatId: number, userId: number, firstName: string, args?: string) {
  // Handle deep link: /start table5
  if (args && args.startsWith("table")) {
    const tableNum = args.replace("table", "");
    sessions.set(userId, { state: "awaiting_table", staffType: "hookah", request: "_table_set" });
    // Just store table hint in session data — but since we don't have complex session, just show card
  }

  const card = await findCard(userId);
  if (card) {
    const { text, markup } = renderCard(card);
    await send(chatId, `👋 С возвращением, <b>${esc(card.name || firstName)}</b>!\n\nВаша карта лояльности:\n\n${text}`,
      { reply_markup: markup });
  } else {
    sessions.set(userId, { state: "awaiting_phone" });
    const caption =
      `🐻 <b>Добро пожаловать в ГРИЗЛИ Hookah Lounge!</b>\n\n` +
      `Программа лояльности даёт вам:\n` +
      `🥉 Бронза — 3% баллами с каждого визита\n` +
      `🥈 Серебро — 5% баллами + скидка 3%\n` +
      `🥇 Золото — 7% баллами + скидка 7%\n` +
      `💎 VIP — 12% баллами + скидка 12%\n\n` +
      `Введите ваш номер телефона для регистрации:`;
    await sendPhotoFile(chatId, "assets/loyalty-welcome.jpg", caption, {
      reply_markup: {
        keyboard: [[{ text: "📱 Поделиться номером", request_contact: true }]],
        resize_keyboard: true, one_time_keyboard: true,
      },
    });
  }
}

async function handlePhone(chatId: number, userId: number, firstName: string, phone: string) {
  sessions.delete(userId);
  const existing = await findCardByPhone(phone);
  if (existing) {
    if (!existing.telegramId) {
      const [updated] = await db.update(loyaltyCardsTable)
        .set({ telegramId: userId, name: firstName }).where(eq(loyaltyCardsTable.id, existing.id)).returning();
      const { text, markup } = renderCard(updated);
      await send(chatId, `✅ Карта найдена и привязана!\n\n${text}`, { reply_markup: markup });
    } else {
      await send(chatId, "⚠️ Этот номер уже зарегистрирован в программе лояльности.");
    }
    return;
  }
  const card = await createCard(userId, firstName, phone);
  const { text, markup } = renderCard(card);
  await send(chatId,
    `🎉 <b>Регистрация успешна!</b>\n\nВы вступили в программу лояльности ГРИЗЛИ.\nПоказывайте карту при каждом визите.\n\n${text}`,
    { reply_markup: markup });
}

async function handleCard(chatId: number, userId: number) {
  const card = await findCard(userId);
  if (!card) { await send(chatId, "Сначала зарегистрируйтесь: /start"); return; }
  const { text, markup } = renderCard(card);
  await send(chatId, text, { reply_markup: markup });
}

async function handleBalance(chatId: number, userId: number) {
  const card = await findCard(userId);
  if (!card) { await send(chatId, "Сначала зарегистрируйтесь: /start"); return; }
  const tier = getTier(card.visits);
  await send(chatId,
    `💰 <b>Ваш баланс</b>\n\n` +
    `🎁 Бонусных баллов: <b>${card.bonusPoints} руб.</b>\n` +
    `${tier.emoji} Уровень: <b>${tier.name}</b>\n` +
    `📈 Бонус с покупки: <b>${tier.bonusRate}%</b>\n` +
    (tier.discount > 0 ? `💸 Постоянная скидка: <b>${tier.discount}%</b>\n` : "") +
    `\n<i>Баллы можно использовать как рубли при оплате.</i>`
  );
}

async function handleHistory(chatId: number, userId: number) {
  const card = await findCard(userId);
  if (!card) { await send(chatId, "Сначала зарегистрируйтесь: /start"); return; }
  const visits = await db.select().from(loyaltyVisitsTable)
    .where(eq(loyaltyVisitsTable.cardId, card.id)).orderBy(desc(loyaltyVisitsTable.createdAt)).limit(10);
  if (visits.length === 0) {
    await send(chatId, `📊 История визитов пуста.\n\nВсего визитов: <b>${card.visits}</b>`); return;
  }
  const lines = visits.map((v, i) => {
    const date = new Date(v.createdAt).toLocaleDateString("ru-RU");
    const parts = [`${i + 1}. ${date}`];
    if (v.amountSpent > 0) parts.push(`• Сумма: ${v.amountSpent}₽`);
    if (v.bonusEarned > 0) parts.push(`• Начислено: +${v.bonusEarned} бонусов`);
    if (v.bonusUsed > 0)   parts.push(`• Списано: -${v.bonusUsed} бонусов`);
    if (v.note)            parts.push(`• ${v.note}`);
    return parts.join("\n   ");
  });
  await send(chatId, `📊 <b>История визитов</b> (последние ${visits.length})\nВсего: <b>${card.visits}</b>\n\n${lines.join("\n\n")}`);
}

// ── Staff call handlers ───────────────────────────────────────────────────────
async function handleCallStaff(chatId: number, userId: number, messageId?: number) {
  const card = await findCard(userId);
  if (!card) { await send(chatId, "Сначала зарегистрируйтесь: /start"); return; }

  const text = `🔔 <b>Позвать персонал</b>\n\nКого вы хотите позвать?`;
  if (messageId) {
    await editMessage(chatId, messageId, text, { reply_markup: staffMainMenu() });
  } else {
    await send(chatId, text, { reply_markup: staffMainMenu() });
  }
}

async function handleCallHookah(chatId: number, messageId?: number) {
  const text = `💨 <b>Кальянный мастер</b>\n\nЧто вам нужно?`;
  if (messageId) {
    await editMessage(chatId, messageId, text, { reply_markup: hookahMenu() });
  } else {
    await send(chatId, text, { reply_markup: hookahMenu() });
  }
}

async function handleCallWaiter(chatId: number, messageId?: number) {
  const text = `🍽️ <b>Официант</b>\n\nЧто вам нужно?`;
  if (messageId) {
    await editMessage(chatId, messageId, text, { reply_markup: waiterMenu() });
  } else {
    await send(chatId, text, { reply_markup: waiterMenu() });
  }
}

async function handleStaffRequest(chatId: number, userId: number, staffType: string, request: string, messageId?: number) {
  sessions.set(userId, { state: "awaiting_table", staffType, request });
  const staffEmoji = staffType === "hookah" ? "💨" : "🍽️";
  const staffName  = staffType === "hookah" ? "Кальянный мастер" : "Официант";
  const text = `${staffEmoji} <b>${staffName}</b> — ${request}\n\n🪑 На каком столе вы сидите?\nВведите номер стола:`;
  if (messageId) {
    await editMessage(chatId, messageId, text, { reply_markup: { inline_keyboard: [[{ text: "← Отмена", callback_data: staffType === "hookah" ? "call_hookah" : "call_waiter" }]] } });
  } else {
    await send(chatId, text, { reply_markup: { inline_keyboard: [[{ text: "← Отмена", callback_data: staffType === "hookah" ? "call_hookah" : "call_waiter" }]] } });
  }
}

async function handleTableNumber(chatId: number, userId: number, tableNum: string, session: { staffType: string; request: string }) {
  sessions.delete(userId);
  const card = await findCard(userId);
  const guestName = card?.name ?? "Гость";

  const staffEmoji = session.staffType === "hookah" ? "💨" : "🍽️";
  const staffName  = session.staffType === "hookah" ? "Кальянный мастер" : "Официант";

  await notifyStaff(guestName, tableNum, session.staffType, session.request);

  await send(chatId,
    `✅ <b>Запрос отправлен!</b>\n\n` +
    `${staffEmoji} ${staffName} скоро подойдёт к столу №<b>${tableNum}</b>.\n` +
    `📋 Запрос: ${session.request}\n\n` +
    `<i>Ожидайте, пожалуйста.</i>`,
    { reply_markup: { inline_keyboard: [[{ text: "🔔 Ещё вызов", callback_data: "call_staff" }, { text: "🎴 Моя карта", callback_data: "card" }]] } }
  );
}

// ── Review flow ───────────────────────────────────────────────────────────────
async function handleReviewStart(chatId: number, userId: number, messageId?: number) {
  sessions.set(userId, { state: "awaiting_review_rating" });
  const text =
    `⭐ <b>Оставить отзыв</b>\n\n` +
    `Спасибо, что хотите поделиться впечатлениями! Ваш отзыв появится на сайте.\n\n` +
    `Поставьте оценку:`;
  const markup = {
    inline_keyboard: [
      [
        { text: "⭐",        callback_data: "rate:1" },
        { text: "⭐⭐",       callback_data: "rate:2" },
        { text: "⭐⭐⭐",      callback_data: "rate:3" },
      ],
      [
        { text: "⭐⭐⭐⭐",      callback_data: "rate:4" },
        { text: "⭐⭐⭐⭐⭐",     callback_data: "rate:5" },
      ],
      [{ text: "← Отмена", callback_data: "card" }],
    ],
  };
  if (messageId) await editMessage(chatId, messageId, text, { reply_markup: markup });
  else await send(chatId, text, { reply_markup: markup });
}

async function handleReviewRating(chatId: number, userId: number, rating: number, messageId?: number) {
  sessions.set(userId, { state: "awaiting_review_text", rating });
  const stars = "⭐".repeat(rating);
  const text =
    `${stars}\n\n` +
    `Отлично! Теперь напишите ваш отзыв одним сообщением (от 5 до 1000 символов):`;
  if (messageId) await editMessage(chatId, messageId, text, { reply_markup: { inline_keyboard: [[{ text: "← Отмена", callback_data: "card" }]] } });
  else await send(chatId, text);
}

async function handleReviewText(chatId: number, userId: number, text: string, rating: number) {
  sessions.delete(userId);
  if (text.length < 5 || text.length > 1000) {
    await send(chatId, "⚠️ Отзыв должен быть от 5 до 1000 символов. Попробуйте ещё раз — /start → ⭐ Оставить отзыв.");
    return;
  }
  const card = await findCard(userId);
  const name = card?.name ?? "Гость";

  try {
    await db.insert(reviewsTable).values({ name, text, rating, source: "telegram" });
  } catch {
    await send(chatId, "❌ Не удалось сохранить отзыв. Попробуйте позже.");
    return;
  }

  // Notify admin
  const adminChatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (adminChatId && botToken) {
    const stars = "⭐".repeat(rating);
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: `🆕 <b>Новый отзыв (Telegram)</b>\n\n${stars}\n👤 ${esc(name)}\n\n«${esc(text)}»`,
        parse_mode: "HTML",
      }),
    }).catch(() => {});
  }

  await send(chatId,
    `✅ <b>Спасибо за отзыв!</b>\n\n` +
    `${"⭐".repeat(rating)}\n` +
    `«${esc(text)}»\n\n` +
    `Ваш отзыв уже опубликован на сайте.`,
    { reply_markup: { inline_keyboard: [[{ text: "🎴 Моя карта", callback_data: "card" }]] } }
  );
}

// ── Admin commands ────────────────────────────────────────────────────────────
const ADMIN_IDS = (process.env.LOYALTY_ADMIN_IDS ?? "").split(",").map(s => Number(s.trim())).filter(Boolean);

function isAdmin(userId: number): boolean {
  return ADMIN_IDS.includes(userId) || ADMIN_IDS.length === 0;
}

async function handleAddVisit(chatId: number, userId: number, args: string[]) {
  if (!isAdmin(userId)) { await send(chatId, "⛔ Нет доступа"); return; }
  const [phone, amountStr] = args;
  if (!phone) { await send(chatId, "Использование: /addvisit +79001234567 [сумма]"); return; }
  const amount = amountStr ? parseInt(amountStr) : 0;

  let card = await findCardByPhone(phone);
  if (!card) {
    await send(chatId, `❌ Гость с номером ${phone} не найден.\n\nДля регистрации нового гостя:\n/newguest ${phone} Имя Фамилия`);
    return;
  }

  const tier = getTier(card.visits);
  const bonusEarned = amount > 0 ? calcBonus(amount, tier) : 0;
  const newVisits = card.visits + 1;
  const newBonus  = card.bonusPoints + bonusEarned;
  const newTierObj = getTier(newVisits);
  const tierChanged = newTierObj.name !== tier.name;

  const [updated] = await db.update(loyaltyCardsTable)
    .set({ visits: newVisits, bonusPoints: newBonus, tier: newTierObj.name, lastVisitAt: new Date() })
    .where(eq(loyaltyCardsTable.id, card.id)).returning();

  await db.insert(loyaltyVisitsTable).values({
    cardId: card.id, amountSpent: amount, bonusEarned, bonusUsed: 0,
    note: tierChanged ? `Повышение до уровня ${newTierObj.name}` : undefined,
  });

  let msg = `✅ Визит зарегистрирован!\n\n👤 ${card.name}\n📞 ${card.phone}\n🔢 Визит #${newVisits}\n${newTierObj.emoji} ${newTierObj.name}`;
  if (amount > 0) msg += `\n💳 Сумма: ${amount}₽\n🎁 Начислено: +${bonusEarned} баллов`;
  msg += `\n💰 Баланс баллов: ${newBonus}`;
  if (tierChanged) msg += `\n\n🎊 ПОВЫШЕНИЕ УРОВНЯ: ${tier.emoji} → ${newTierObj.emoji} ${newTierObj.name}!`;
  await send(chatId, msg);

  if (updated.telegramId) {
    let notif = `🐻 <b>Визит зарегистрирован!</b>\n\n🔢 Визит #${newVisits}\n🎁 +${bonusEarned} баллов\n💰 Итого баллов: ${newBonus}`;
    if (tierChanged) notif += `\n\n🎊 Поздравляем! Вы достигли уровня <b>${newTierObj.emoji} ${newTierObj.name}</b>!\nНовые привилегии:\n📈 Бонус: ${newTierObj.bonusRate}%\n💸 Скидка: ${newTierObj.discount}%`;
    await send(updated.telegramId, notif, {
      reply_markup: { inline_keyboard: [[{ text: "🎴 Моя карта", callback_data: "card" }]] }
    });
  }
}

async function handleNewGuest(chatId: number, userId: number, args: string[]) {
  if (!isAdmin(userId)) { await send(chatId, "⛔ Нет доступа"); return; }
  const [phone, ...nameParts] = args;
  if (!phone || nameParts.length === 0) { await send(chatId, "Использование: /newguest +79001234567 Имя Фамилия"); return; }
  const name = nameParts.join(" ");
  const existing = await findCardByPhone(phone);
  if (existing) { await send(chatId, `⚠️ Гость уже зарегистрирован: ${existing.name}`); return; }
  const [card] = await db.insert(loyaltyCardsTable).values({ name, phone, visits: 0, bonusPoints: 0, tier: "bronze" }).returning();
  await send(chatId, `✅ Гость зарегистрирован!\n\n👤 ${card.name}\n📞 ${card.phone}\n🥉 Бронзовый уровень`);
}

async function handleLookup(chatId: number, userId: number, args: string[]) {
  if (!isAdmin(userId)) { await send(chatId, "⛔ Нет доступа"); return; }
  const [phone] = args;
  if (!phone) { await send(chatId, "Использование: /lookup +79001234567"); return; }
  const card = await findCardByPhone(phone);
  if (!card) { await send(chatId, `❌ Гость с номером ${phone} не найден`); return; }
  const { text } = renderCard(card);
  await send(chatId, text);
}

async function handleAddBonus(chatId: number, userId: number, args: string[]) {
  if (!isAdmin(userId)) { await send(chatId, "⛔ Нет доступа"); return; }
  const [phone, amountStr] = args;
  const amount = parseInt(amountStr ?? "");
  if (!phone || isNaN(amount)) { await send(chatId, "Использование: /addbonus +79001234567 100"); return; }
  const card = await findCardByPhone(phone);
  if (!card) { await send(chatId, `❌ Не найден: ${phone}`); return; }
  const [updated] = await db.update(loyaltyCardsTable).set({ bonusPoints: card.bonusPoints + amount }).where(eq(loyaltyCardsTable.id, card.id)).returning();
  await db.insert(loyaltyVisitsTable).values({ cardId: card.id, amountSpent: 0, bonusEarned: amount, bonusUsed: 0, note: "Ручное начисление" });
  await send(chatId, `✅ Начислено <b>${amount}</b> баллов\n👤 ${card.name}\n💰 Баланс: ${updated.bonusPoints}`);
  if (updated.telegramId) await send(updated.telegramId, `🎁 Вам начислено <b>${amount}</b> бонусных баллов!\n💰 Баланс: ${updated.bonusPoints}`);
}

async function handleRedeem(chatId: number, userId: number, args: string[]) {
  if (!isAdmin(userId)) { await send(chatId, "⛔ Нет доступа"); return; }
  const [phone, amountStr] = args;
  const amount = parseInt(amountStr ?? "");
  if (!phone || isNaN(amount)) { await send(chatId, "Использование: /redeem +79001234567 100"); return; }
  const card = await findCardByPhone(phone);
  if (!card) { await send(chatId, `❌ Не найден: ${phone}`); return; }
  if (card.bonusPoints < amount) { await send(chatId, `❌ Недостаточно баллов. Баланс: ${card.bonusPoints}`); return; }
  const [updated] = await db.update(loyaltyCardsTable).set({ bonusPoints: card.bonusPoints - amount }).where(eq(loyaltyCardsTable.id, card.id)).returning();
  await db.insert(loyaltyVisitsTable).values({ cardId: card.id, amountSpent: 0, bonusEarned: 0, bonusUsed: amount, note: "Списание баллов" });
  await send(chatId, `✅ Списано <b>${amount}</b> баллов\n👤 ${card.name}\n💰 Остаток: ${updated.bonusPoints}`);
  if (updated.telegramId) await send(updated.telegramId, `💸 Списано <b>${amount}</b> бонусных баллов.\n💰 Остаток: ${updated.bonusPoints}`);
}

async function handleLoyaltyStats(chatId: number, userId: number) {
  if (!isAdmin(userId)) { await send(chatId, "⛔ Нет доступа"); return; }
  const [s] = await db.execute(sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE visits >= 20)::int AS vip,
      COUNT(*) FILTER (WHERE visits >= 10 AND visits < 20)::int AS gold,
      COUNT(*) FILTER (WHERE visits >= 5  AND visits < 10)::int AS silver,
      COUNT(*) FILTER (WHERE visits < 5)::int  AS bronze,
      SUM(bonus_points)::int                    AS total_bonus,
      AVG(visits)::numeric(4,1)                 AS avg_visits
    FROM loyalty_cards
  `);
  const r = (s as any).rows[0] ?? {};
  await send(chatId,
    `📊 <b>Статистика лояльности</b>\n\n` +
    `👥 Всего участников: <b>${r.total ?? 0}</b>\n\n` +
    `💎 VIP:         <b>${r.vip ?? 0}</b>\n` +
    `🥇 Золото:      <b>${r.gold ?? 0}</b>\n` +
    `🥈 Серебро:     <b>${r.silver ?? 0}</b>\n` +
    `🥉 Бронза:      <b>${r.bronze ?? 0}</b>\n\n` +
    `🎁 Баллов на руках: <b>${r.total_bonus ?? 0}</b>\n` +
    `📈 Средн. визитов: <b>${r.avg_visits ?? 0}</b>`
  );
}

async function handleHelp(chatId: number, userId: number) {
  const adminPart = isAdmin(userId)
    ? `\n\n<b>Команды персонала:</b>\n` +
      `/addvisit [телефон] [сумма] — регистрация визита\n` +
      `/newguest [телефон] Имя — новый гость\n` +
      `/lookup [телефон] — поиск гостя\n` +
      `/addbonus [телефон] [сумма] — начислить баллы\n` +
      `/redeem [телефон] [сумма] — списать баллы\n` +
      `/loyalty_stats — статистика программы`
    : "";

  await send(chatId,
    `🐻 <b>ГРИЗЛИ — Карта лояльности</b>\n\n` +
    `<b>Ваши команды:</b>\n` +
    `/start — моя карта / регистрация\n` +
    `/card — показать карту\n` +
    `/balance — баланс баллов\n` +
    `/history — история визитов\n` +
    `/call — позвать персонал\n` +
    `/review — оставить отзыв\n` +
    `/help — помощь` +
    adminPart
  );
}

// ── Main webhook handler ──────────────────────────────────────────────────────
export async function handleLoyaltyUpdate(update: any) {
  try {
    // Callback queries
    if (update.callback_query) {
      const cq = update.callback_query;
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
      const userId = cq.from.id;
      const chatId = cq.message?.chat?.id ?? userId;
      const msgId  = cq.message?.message_id;

      if (cq.data === "card")         return handleCard(chatId, userId);
      if (cq.data === "balance")      return handleBalance(chatId, userId);
      if (cq.data === "history")      return handleHistory(chatId, userId);
      if (cq.data === "call_staff")   return handleCallStaff(chatId, userId, msgId);
      if (cq.data === "call_hookah")  return handleCallHookah(chatId, msgId);
      if (cq.data === "call_waiter")  return handleCallWaiter(chatId, msgId);
      if (cq.data === "review_start") return handleReviewStart(chatId, userId, msgId);
      if (cq.data.startsWith("rate:")) {
        const r = parseInt(cq.data.slice(5));
        if (r >= 1 && r <= 5) return handleReviewRating(chatId, userId, r, msgId);
      }

      // Staff request: "req:hookah:Сменить уголь" or "req:waiter:Принести счёт"
      if (cq.data.startsWith("req:")) {
        const [, staffType, ...reqParts] = cq.data.split(":");
        const request = reqParts.join(":");
        return handleStaffRequest(chatId, userId, staffType, request, msgId);
      }

      if (cq.data === "changephone") {
        sessions.set(userId, { state: "awaiting_phone_change" });
        await send(chatId, "📱 Введите новый номер телефона:");
      }
      return;
    }

    const msg = update.message;
    if (!msg) return;

    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const firstName = msg.from?.first_name ?? "Гость";
    const text: string = msg.text ?? "";

    // Contact share
    if (msg.contact) {
      const phone = msg.contact.phone_number;
      await handlePhone(chatId, userId, firstName, phone);
      return;
    }

    // Check session state
    const session = sessions.get(userId);

    if (session?.state === "awaiting_review_text") {
      await handleReviewText(chatId, userId, text.trim(), session.rating);
      return;
    }

    if (session?.state === "awaiting_table") {
      const tableNum = text.trim();
      if (/^\d{1,3}$/.test(tableNum)) {
        await handleTableNumber(chatId, userId, tableNum, session);
        return;
      } else {
        await send(chatId, "⚠️ Введите номер стола цифрами, например: <b>5</b>");
        return;
      }
    }

    if (session?.state === "awaiting_phone" || session?.state === "awaiting_phone_change") {
      const phone = text.trim();
      if (phone.match(/^[\d\s\+\-\(\)]{7,15}$/)) {
        await handlePhone(chatId, userId, firstName, phone);
        return;
      }
    }

    // Commands
    const [cmd, ...args] = text.split(" ");
    switch (cmd) {
      case "/start":         return handleStart(chatId, userId, firstName, args[0]);
      case "/card":          return handleCard(chatId, userId);
      case "/balance":       return handleBalance(chatId, userId);
      case "/history":       return handleHistory(chatId, userId);
      case "/call":          return handleCallStaff(chatId, userId);
      case "/review":        return handleReviewStart(chatId, userId);
      case "/help":          return handleHelp(chatId, userId);
      case "/addvisit":      return handleAddVisit(chatId, userId, args);
      case "/newguest":      return handleNewGuest(chatId, userId, args);
      case "/lookup":        return handleLookup(chatId, userId, args);
      case "/addbonus":      return handleAddBonus(chatId, userId, args);
      case "/redeem":        return handleRedeem(chatId, userId, args);
      case "/loyalty_stats": return handleLoyaltyStats(chatId, userId);
    }
  } catch (e) {
    console.error("[loyalty-bot]", e);
  }
}

// ── Register webhook ──────────────────────────────────────────────────────────
export async function registerLoyaltyWebhook(baseUrl: string) {
  const token = LOYALTY_TOKEN();
  if (!token) { console.log("[loyalty-bot] No LOYALTY_BOT_TOKEN, skipping webhook registration"); return; }
  const webhookUrl = `${baseUrl}${LOYALTY_PATH}`;
  const res = await tg("setWebhook", { url: webhookUrl, drop_pending_updates: true });
  console.log("[loyalty-bot] Webhook:", JSON.stringify(res));
  await tg("setMyCommands", { commands: [
    { command: "start",   description: "Моя карта лояльности" },
    { command: "card",    description: "Показать карту" },
    { command: "balance", description: "Баланс баллов" },
    { command: "history", description: "История визитов" },
    { command: "call",    description: "Позвать персонал" },
    { command: "review",  description: "Оставить отзыв" },
    { command: "help",    description: "Помощь" },
  ]});
}
