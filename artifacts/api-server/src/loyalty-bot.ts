import { db, loyaltyCardsTable, loyaltyVisitsTable } from "@workspace/db";
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

// ── Card URL helper ───────────────────────────────────────────────────────────
function cardUrl(token: string | null | undefined): string | null {
  const domain = process.env.REPLIT_DEV_DOMAIN;
  if (!domain || !token) return null;
  return `https://${domain}/loyalty/${token}`;
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
    `║ 👤 <b>${card.name || "Гость"}</b>\n` +
    `║ 📞 ${phone}\n` +
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
      // Row 1: show card to cashier (primary CTA)
      ...(url ? [[{ text: "📱 Показать кассиру", url }]] : []),
      // Row 2: stats
      [
        { text: "🎁 Баллы",    callback_data: "balance" },
        { text: "📊 История",  callback_data: "history" },
      ],
      // Row 3: utility
      [
        { text: "🔄 Обновить",      callback_data: "card" },
        { text: "🔗 Изм. номер",    callback_data: "changephone" },
      ],
    ],
  };

  return { text, markup };
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
const sessions: Map<number, { state: string; data?: object }> = new Map();

// ── Message handlers ──────────────────────────────────────────────────────────
async function handleStart(chatId: number, userId: number, firstName: string) {
  const card = await findCard(userId);
  if (card) {
    const { text, markup } = renderCard(card);
    await send(chatId, `👋 С возвращением, <b>${card.name || firstName}</b>!\n\nВаша карта лояльности:\n\n${text}`,
      { reply_markup: markup });
  } else {
    sessions.set(userId, { state: "awaiting_phone" });
    await send(chatId,
      `🐻 <b>Добро пожаловать в ГРИЗЛИ Hookah Lounge!</b>\n\n` +
      `Программа лояльности даёт вам:\n` +
      `🥉 Бронза — 3% баллами с каждого визита\n` +
      `🥈 Серебро — 5% баллами + скидка 3%\n` +
      `🥇 Золото — 7% баллами + скидка 7%\n` +
      `💎 VIP — 12% баллами + скидка 12%\n\n` +
      `Введите ваш номер телефона для регистрации:`,
      { reply_markup: {
        keyboard: [[{ text: "📱 Поделиться номером", request_contact: true }]],
        resize_keyboard: true, one_time_keyboard: true,
      } }
    );
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

  // Notify customer
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

// ── Help ──────────────────────────────────────────────────────────────────────
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
      if (cq.data === "card")        return handleCard(chatId, userId);
      if (cq.data === "balance")     return handleBalance(chatId, userId);
      if (cq.data === "history")     return handleHistory(chatId, userId);
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
      case "/start":         return handleStart(chatId, userId, firstName);
      case "/card":          return handleCard(chatId, userId);
      case "/balance":       return handleBalance(chatId, userId);
      case "/history":       return handleHistory(chatId, userId);
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
  // Set bot commands for users
  await tg("setMyCommands", { commands: [
    { command: "start",   description: "Моя карта лояльности" },
    { command: "card",    description: "Показать карту" },
    { command: "balance", description: "Баланс баллов" },
    { command: "history", description: "История визитов" },
    { command: "help",    description: "Помощь" },
  ]});
}
