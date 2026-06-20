import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;

export type SiteContacts = {
  phone: string;
  address: string;
  telegram?: string;
  instagram?: string;
  vk?: string;
  mapUrl?: string;
};
export type ScheduleRow = { days: string; hours: string };
export type HeroSettings = { title1: string; title2: string; subtitle: string };
export type AboutSettings = { title: string; p1: string; p2: string };
export type RuleItem = { title: string; text: string };
export type BrandSettings = {
  name: string;
  city: string;
  estYear: string;
  badgeText: string;
};
export type LoyaltySettings = {
  botUsername: string;
  tagline: string;
  description: string;
};
export type FooterSettings = {
  tagline: string;
  copyright: string;
};
// Named image slots — each is the URL that overrides a built-in asset.
// Empty string means "use bundled default".
export type ImageSlots = {
  logo: string;
  heroBg: string;
  bearSkull: string;
  cocktail: string;
  interior: string;
};
export type TypographySettings = Record<string, {
  desktopSize: number;
  mobileSize: number;
  font: string;
}>;
export const IMAGE_SLOT_LABELS: Record<keyof ImageSlots, string> = {
  logo: "Логотип (шапка, карта, /loyalty-card)",
  heroBg: "Фон главного экрана",
  bearSkull: "Иллюстрация «О нас» (череп / символ)",
  cocktail: "Фото «Тёмные материи» (коктейль)",
  interior: "Большой баннер «Твоя территория»",
};

export type SiteSettings = {
  contacts?: SiteContacts;
  schedule?: ScheduleRow[];
  hero?: HeroSettings;
  about?: AboutSettings;
  rules?: RuleItem[];
  brand?: BrandSettings;
  loyalty?: LoyaltySettings;
  footer?: FooterSettings;
  images?: Partial<ImageSlots>;
  typography?: TypographySettings;
  ticker?: string[];
};

const DEFAULTS: Required<SiteSettings> = {
  contacts: { phone: "+7 (916) 328-38-91", address: "г. Тюмень, ул. Новосёлов, 92", telegram: "", instagram: "", vk: "", mapUrl: "" },
  schedule: [
    { days: "Пн — Чт", hours: "15:00 — 02:00" },
    { days: "Пт — Сб",  hours: "15:00 — 04:00" },
    { days: "Вс",       hours: "15:00 — 02:00" },
  ],
  hero: {
    title1: "ИНСТИНКТ",
    title2: "отдыха",
    subtitle: "Премиальный лаунж для тех, кто знает цену времени. Глубокие вкусы, полумрак и никакого ритма большого города.",
  },
  about: {
    title: "Не клуб. Не кафе. Берлога.",
    p1: "Мы создали место, где город остается за дверью. «ГРИЗЛИ» — это тяжёлое дерево, потёртая кожа, приглушённый янтарный свет и густой дым.",
    p2: "Здесь некуда спешить. Мы уважаем личное пространство и ценим тишину. Это территория взрослых, где каждый вдох имеет глубину.",
  },
  rules: [
    { title: "Возраст", text: "Строго 18+. Мы оставляем за собой право попросить документ. Без исключений." },
    { title: "Уважение", text: "Не повышаем голос, не включаем видео без наушников. Уважаем отдых друг друга." },
  ],
  brand: {
    name: "ГРИЗЛИ",
    city: "Тюмень",
    estYear: "2026",
    badgeText: "Тюмень · с 2026 года",
  },
  loyalty: {
    botUsername: "GrizzlyLoyalty_bot",
    tagline: "Программа лояльности",
    description: "Цифровая карта в Telegram. Никакого пластика — только баллы, статусы и приглашения на закрытые вечера.",
  },
  footer: {
    tagline: "Премиальный хука-лаунж в самом сердце Тюмени.",
    copyright: "© ГРИЗЛИ Hookah Lounge",
  },
  images: { logo: "", heroBg: "", bearSkull: "", cocktail: "", interior: "" },
  ticker: ["СЕЙЧАС ОТКРЫТО", "ПРЕМИАЛЬНЫЙ ТАБАК", "АВТОРСКИЕ КОКТЕЙЛИ", "БРОНЬ +7 (916) 328-38-91", "г. Тюмень, ул. Новосёлов, 92"],
};

let cache: SiteSettings | null = null;
const subscribers = new Set<(s: SiteSettings) => void>();

async function load() {
  try {
    const r = await fetch(API("/api/settings"));
    cache = await r.json();
  } catch { cache = {}; }
  subscribers.forEach(fn => fn(cache!));
}
if (typeof window !== "undefined" && !cache) load();

export function useSiteSettings(): Required<SiteSettings> {
  const [s, setS] = useState<SiteSettings>(cache ?? {});
  useEffect(() => {
    if (cache) setS(cache);
    const fn = (next: SiteSettings) => setS(next);
    subscribers.add(fn);
    if (!cache) load();
    return () => { subscribers.delete(fn); };
  }, []);
  return {
    contacts: { ...DEFAULTS.contacts, ...(s.contacts ?? {}) },
    schedule: s.schedule?.length ? s.schedule : DEFAULTS.schedule,
    hero:     { ...DEFAULTS.hero, ...(s.hero ?? {}) },
    about:    { ...DEFAULTS.about, ...(s.about ?? {}) },
    rules:    s.rules?.length ? s.rules : DEFAULTS.rules,
    brand:    { ...DEFAULTS.brand, ...(s.brand ?? {}) },
    loyalty:  { ...DEFAULTS.loyalty, ...(s.loyalty ?? {}) },
    footer:   { ...DEFAULTS.footer, ...(s.footer ?? {}) },
    images:   { ...DEFAULTS.images, ...(s.images ?? {}) } as ImageSlots,
    typography: s.typography ?? {},
    ticker: s.ticker?.length ? s.ticker : DEFAULTS.ticker,
  };
}

// Returns override URL if admin set one, otherwise the bundled default.
// Accepts Partial<ImageSlots> because the hook merges from the server which may omit keys.
export function imgSrc(slot: Partial<ImageSlots> | undefined, key: keyof ImageSlots, fallback: string): string {
  const v = slot?.[key];
  return v && v.trim() ? v : fallback;
}

export function refreshSettings() { return load(); }

// ── Menu items ────────────────────────────────────────────────────────────────
export type MenuItem = {
  id: number; section: string; category: string;
  name: string; description: string; price: string;
  sortOrder: number; isActive: number;
};

export function useMenuItems(): MenuItem[] {
  const [items, setItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    fetch(API("/api/menu")).then(r => r.json()).then(setItems).catch(() => {});
  }, []);
  return items;
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export type Review = { id: number; name: string; text: string; rating: number; source?: string; createdAt: string };

export function useReviews(): { reviews: Review[]; reload: () => void; submit: (data: { name: string; text: string; rating: number }) => Promise<boolean> } {
  const [reviews, setReviews] = useState<Review[]>([]);
  const reload = () => fetch(API("/api/reviews")).then(r => r.json()).then(setReviews).catch(() => {});
  useEffect(() => { reload(); }, []);
  const submit = async (data: { name: string; text: string; rating: number }) => {
    try {
      const r = await fetch(API("/api/reviews"), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (!r.ok) return false;
      const created = await r.json();
      setReviews(prev => [created, ...prev]);
      return true;
    } catch { return false; }
  };
  return { reviews, reload, submit };
}

// Категории меню из БД
export type MenuCategory = {
  id: number;
  key: string;
  label: string;
  emoji?: string | null;
  image?: string | null;
  display_order: number;
  is_active: boolean;
};

export function useMenuCategories(): MenuCategory[] {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  
  useEffect(() => {
    fetch(API("/api/menu-categories"))
      .then(r => r.json())
      .then(data => setCategories(data.filter((c: MenuCategory) => c.is_active).sort((a: MenuCategory, b: MenuCategory) => a.display_order - b.display_order)))
      .catch(() => {});
  }, []);
  
  return categories;
}
