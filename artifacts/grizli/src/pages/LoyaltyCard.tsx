import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import logoDefault from "@/assets/images/logo.jpeg";
import { useSiteSettings, imgSrc } from "@/hooks/useSiteSettings";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;

type CardData = {
  id: number; token: string; name: string; phone: string | null;
  visits: number; bonusPoints: number; tier: string;
  lastVisitAt: string | null;
  tier_info: { name: string; emoji: string; discount: number; bonus_rate: number; nextAt: number | null };
};

type Visit = {
  id: number; cardId: number; amountSpent: number; bonusEarned: number;
  bonusUsed: number; note: string | null; createdAt: string;
};

// ── Telegram Mini App helpers ─────────────────────────────────────────────────
type TgWebApp = {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe?: { user?: { first_name?: string; id?: number } };
  colorScheme: "light" | "dark";
  setHeaderColor: (c: string) => void;
  setBackgroundColor: (c: string) => void;
  HapticFeedback?: { impactOccurred: (s: "light" | "medium" | "heavy") => void; notificationOccurred: (s: "success" | "warning" | "error") => void };
  MainButton?: { setText: (t: string) => void; show: () => void; hide: () => void; onClick: (cb: () => void) => void };
};
declare global { interface Window { Telegram?: { WebApp?: TgWebApp } } }

function useTelegramWebApp() {
  const [tg, setTg] = useState<TgWebApp | null>(null);
  useEffect(() => {
    // Inject Telegram WebApp SDK script (no-op outside Telegram, but exposes window.Telegram.WebApp inside)
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://telegram.org/js/telegram-web-app.js"]');
    const initTg = () => {
      const app = window.Telegram?.WebApp;
      if (!app) return;
      try {
        app.ready();
        app.expand();
        app.setHeaderColor("#000000");
        app.setBackgroundColor("#000000");
      } catch { /* SDK unavailable outside Telegram */ }
      // Only treat as "inside Telegram" if initData is present (real session)
      if (app.initData && app.initData.length > 0) setTg(app);
    };
    if (existing) { initTg(); return; }
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-web-app.js";
    s.async = true;
    s.onload = initTg;
    document.head.appendChild(s);
  }, []);
  return tg;
}

const TIERS = [
  { key: "bronze", label: "Бронзовый",  emoji: "🥉", minVisits: 0,  nextAt: 5,    color: "#CD7F32" },
  { key: "silver", label: "Серебряный", emoji: "🥈", minVisits: 5,  nextAt: 10,   color: "#C0C0C0" },
  { key: "gold",   label: "Золотой",    emoji: "🥇", minVisits: 10, nextAt: 20,   color: "#FFD700" },
  { key: "vip",    label: "VIP",        emoji: "💎", minVisits: 20, nextAt: null,  color: "#C5FF00" },
];

function getTierInfo(visits: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (visits >= TIERS[i].minVisits) return TIERS[i];
  }
  return TIERS[0];
}

function ProgressBar({ visits, tier }: { visits: number; tier: typeof TIERS[0] }) {
  if (!tier.nextAt) return (
    <div className="text-center text-xs text-[#C5FF00] font-medium tracking-widest uppercase mt-1">
      ★ Максимальный уровень
    </div>
  );
  const next = TIERS.find(t => t.minVisits === tier.nextAt)!;
  const progress = Math.min(((visits - tier.minVisits) / (tier.nextAt - tier.minVisits)) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/50">
        <span>{tier.emoji} {tier.label}</span>
        <span>{next.emoji} через {tier.nextAt - visits} визит{tier.nextAt - visits === 1 ? "" : tier.nextAt - visits < 5 ? "а" : "ов"}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${tier.color}, #C5FF00)` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function LoyaltyCard() {
  const { images } = useSiteSettings();
  const logo = imgSrc(images, "logo", logoDefault);
  const params = useParams<{ token: string }>();
  const token = params.token;
  const tg = useTelegramWebApp();
  const insideTelegram = tg !== null;
  const [card, setCard] = useState<CardData | null>(null);
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const load = async (signal?: AbortSignal) => {
    try {
      const r = await fetch(API(`/api/loyalty/card/${token}`), { signal });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setCard(data);
      setError(false);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [token]);

  const loadHistory = async () => {
    if (visits) return; // cache
    setHistoryLoading(true);
    try {
      const r = await fetch(API(`/api/loyalty/card/${token}/history?limit=20`));
      if (!r.ok) throw new Error();
      const data = await r.json();
      setVisits(data.visits ?? []);
    } catch { setVisits([]); }
    finally { setHistoryLoading(false); }
  };

  const toggleHistory = () => {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next) loadHistory();
    tg?.HapticFeedback?.impactOccurred("light");
  };

  const refresh = async () => {
    await load();
    setVisits(null); // invalidate history cache
    if (historyOpen) loadHistory();
    setRefreshed(true);
    tg?.HapticFeedback?.notificationOccurred("success");
    setTimeout(() => setRefreshed(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C5FF00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !card) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-4xl">🐻</div>
      <p className="text-white font-serif text-xl">Карта не найдена</p>
      <p className="text-white/40 text-sm">Ссылка недействительна или карта была удалена</p>
    </div>
  );

  const tier = getTierInfo(card.visits);
  const cardUrl = window.location.href;
  const lastVisit = card.lastVisitAt
    ? new Date(card.lastVisitAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
    : "ещё не было";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8"
         style={{ background: "radial-gradient(ellipse at top, #0d0d0d 0%, #000 70%)" }}>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm relative"
      >
        {/* Glow */}
        <div className="absolute -inset-px rounded-2xl opacity-30"
             style={{ background: `linear-gradient(135deg, ${tier.color}, #C5FF00, transparent)` }} />

        <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-white/5">
            <img src={logo} alt="ГРИЗЛИ" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-white font-serif font-bold tracking-[0.15em] uppercase text-sm">ГРИЗЛИ</div>
              <div className="text-white/40 text-xs tracking-widest uppercase">Карта лояльности</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs tracking-widest uppercase" style={{ color: tier.color }}>{tier.emoji} {tier.label}</div>
              {card.tier_info?.discount > 0 && (
                <div className="text-white/40 text-xs">скидка {card.tier_info.discount}%</div>
              )}
            </div>
          </div>

          {/* Name & phone */}
          <div className="px-6 pt-5 pb-2">
            <div className="text-white font-serif text-2xl font-medium mb-0.5">{card.name || "Гость"}</div>
            {card.phone && <div className="text-white/40 text-sm tracking-wide">{card.phone}</div>}
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-6">
            <div className="bg-white p-4 rounded-xl shadow-2xl">
              <QRCodeSVG
                value={cardUrl}
                size={180}
                level="H"
                marginSize={0}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-0 border-t border-white/5">
            {[
              { label: "Визитов",  value: card.visits },
              { label: "Баллов",   value: card.bonusPoints },
              { label: "Бонус",    value: `${card.tier_info?.bonus_rate ?? 3}%` },
            ].map(({ label, value }) => (
              <div key={label} className="py-4 text-center border-r border-white/5 last:border-0">
                <div className="text-xl font-bold" style={{ color: "#C5FF00" }}>{value}</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="px-6 pb-5 pt-3">
            <ProgressBar visits={card.visits} tier={tier} />
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center justify-between">
            <div className="text-white/30 text-xs">Последний визит: {lastVisit}</div>
            <button onClick={refresh}
              className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/40 hover:text-[#C5FF00] hover:border-[#C5FF00]/40 transition-all">
              {refreshed ? "✓ Обновлено" : "↻ Обновить"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Visit history (collapsible) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 w-full max-w-sm"
      >
        <button
          onClick={toggleHistory}
          aria-expanded={historyOpen}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#C5FF00]/30 transition-all"
        >
          <span className="text-white/70 text-sm font-medium tracking-wide">📊 История визитов</span>
          <span className="text-[#C5FF00] text-lg" style={{ transform: historyOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }}>⌄</span>
        </button>
        <AnimatePresence initial={false}>
          {historyOpen && (
            <motion.div
              key="history"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl bg-white/[0.02] border border-white/5 divide-y divide-white/5">
                {historyLoading && (
                  <div className="py-6 text-center text-white/30 text-sm">Загрузка…</div>
                )}
                {!historyLoading && visits && visits.length === 0 && (
                  <div className="py-6 text-center text-white/30 text-sm">Здесь появится история ваших визитов</div>
                )}
                {!historyLoading && visits && visits.map(v => {
                  const date = new Date(v.createdAt);
                  const dateStr = date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
                  const timeStr = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                  const isRedeem = v.bonusUsed > 0;
                  return (
                    <div key={v.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-white/80 text-sm">
                          {isRedeem ? "Списание баллов" : v.note || "Визит"}
                        </div>
                        <div className="text-white/30 text-xs mt-0.5">{dateStr} · {timeStr}{v.amountSpent > 0 && ` · ${v.amountSpent.toLocaleString("ru-RU")} ₽`}</div>
                      </div>
                      {isRedeem ? (
                        <div className="text-[#FF6B6B] text-sm font-semibold tabular-nums">−{v.bonusUsed}</div>
                      ) : v.bonusEarned > 0 ? (
                        <div className="text-[#C5FF00] text-sm font-semibold tabular-nums">+{v.bonusEarned}</div>
                      ) : (
                        <div className="text-white/30 text-sm">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center space-y-2"
      >
        <p className="text-white/30 text-sm">Покажите QR-код кассиру</p>
        <p className="text-white/20 text-xs">или назовите номер телефона</p>
      </motion.div>

      {/* Add to home screen hint — only outside Telegram */}
      {!insideTelegram && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 max-w-sm w-full border border-white/5 rounded-xl p-4 text-center"
        >
          <p className="text-white/50 text-xs leading-relaxed">
            📱 Добавьте на экран телефона:<br/>
            <span className="text-white/30">Safari → Поделиться → На экран «Домой»</span>
          </p>
        </motion.div>
      )}

      {/* Mini-app close button */}
      {insideTelegram && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => tg?.close()}
          className="mt-6 text-xs px-4 py-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
        >
          Закрыть
        </motion.button>
      )}
    </div>
  );
}
