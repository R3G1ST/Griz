import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight, ArrowRight, Calendar, Clock, Flame, GlassWater,
  Instagram, MapPin, Menu as MenuIcon, Phone, Send, Sparkles,
  Star, UtensilsCrossed, Wind, Zap, X,
} from "lucide-react";

import {
  useSiteSettings, useReviews, useMenuItems, imgSrc, type MenuItem,
} from "@/hooks/useSiteSettings";

import logoDefault      from "@/assets/images/logo.jpeg";
import heroBgDefault    from "@/assets/images/hero-bg.png";
import bearSkullDefault from "@/assets/images/bear-skull.png";
import cocktailDefault  from "@/assets/images/cocktail.png";
import interiorDefault  from "@/assets/images/interior.png";

const NAV: { label: string; href: string }[] = [
  { label: "Меню",        href: "/menu" },
  { label: "Кальяны",     href: "/menu#hookahs" },
  { label: "Галерея",     href: "/gallery" },
  { label: "Бронь",       href: "/booking" },
  { label: "Лояльность",  href: "/loyalty" },
];

type CategoryCard = {
  title: string;
  icon: typeof Flame;
  tag: string;
  items: MenuItem[];
};

function buildCards(items: MenuItem[]): CategoryCard[] {
  // Group all active items by category, preserving sortOrder.
  const byCategory = new Map<string, MenuItem[]>();
  for (const it of items) {
    if (!it.isActive) continue;
    if (!byCategory.has(it.category)) byCategory.set(it.category, []);
    byCategory.get(it.category)!.push(it);
  }
  // Build ordered list of category names by first appearance.
  const order: string[] = [];
  for (const it of items) {
    if (!it.isActive) continue;
    if (!order.includes(it.category)) order.push(it.category);
  }

  // Prefer three signature categories if present; otherwise take first 3.
  const PREFERRED = ["Авторские", "Авторские коктейли", "Чай и кофе", "Премиум", "Классика", "Безалкогольное"];
  const ordered = [
    ...PREFERRED.filter(c => byCategory.has(c)),
    ...order.filter(c => !PREFERRED.includes(c)),
  ];
  const top3 = ordered.slice(0, 3);

  const iconFor = (cat: string) => {
    if (/кальян|премиум|классика|авторские$/i.test(cat)) return Flame;
    if (/коктейл|бар/i.test(cat))                       return GlassWater;
    if (/чай|кофе|напит|безалког/i.test(cat))           return GlassWater;
    return UtensilsCrossed;
  };

  return top3.map(cat => {
    const its = (byCategory.get(cat) ?? []).slice(0, 4);
    return {
      title: cat,
      icon: iconFor(cat),
      tag: `${byCategory.get(cat)!.length} ${byCategory.get(cat)!.length === 1 ? "позиция" : "позиций"}`,
      items: its,
    };
  });
}

function formatPrice(p: string) {
  // Try to split numeric and currency suffix so we can colour the ₽ dim.
  const m = p.match(/^([\d\s\u00A0.,]+)(.*)$/);
  if (!m) return { num: p, suffix: "" };
  return { num: m[1].trim(), suffix: m[2].trim() };
}

function Ticker({ items }: { items: string[] }) {
  const row = items.length ? items : ["GRIZLI LOUNGE", "ТЮМЕНЬ", "16:00 — 02:00"];
  return (
    <div className="relative overflow-hidden border-y border-[#D4FF3F]/25 bg-black/60 gn-ticker-mask">
      <div className="flex whitespace-nowrap py-3 gn-mono text-[10px] sm:text-[11px] tracking-[0.3em] gn-marquee">
        {[...row, ...row, ...row, ...row].map((t, i) => (
          <span key={i} className="px-6 sm:px-8 flex items-center gap-3 shrink-0">
            <span className="text-[#D4FF3F]/90">◆</span>
            <span className={i % 2 === 0 ? "gn-neon" : "text-[#F5F1E8]/70"}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MenuCard({ card }: { card: CategoryCard }) {
  const Icon = card.icon;
  return (
    <div className="gn-glass rounded-md p-6 flex flex-col relative gn-corner">
      <span className="c1" /><span className="c2" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center bg-[#D4FF3F]/10 border border-[#D4FF3F]/40">
            <Icon className="w-4 h-4 text-[#D4FF3F]" />
          </div>
          <h3 className="gn-display text-[20px] sm:text-[22px] uppercase tracking-tight">{card.title}</h3>
        </div>
        <span className="gn-chip-dim">{card.tag}</span>
      </div>
      <div className="gn-divider mb-5 opacity-50" />
      <ul className="flex-1 flex flex-col gap-4">
        {card.items.length === 0 && (
          <li className="text-[12px] gn-mono text-[#F5F1E8]/45">Скоро добавим позиции.</li>
        )}
        {card.items.map(it => {
          const { num, suffix } = formatPrice(it.price);
          return (
            <li key={it.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[15px] text-[#F5F1E8] leading-tight">{it.name}</div>
                {it.description && (
                  <div className="text-[12px] text-[#F5F1E8]/50 mt-1 gn-sans">{it.description}</div>
                )}
              </div>
              <div className="gn-mono text-[13px] text-[#D4FF3F] whitespace-nowrap pt-0.5">
                {num}{suffix && <span className="text-[#F5F1E8]/40 ml-1">{suffix}</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <Link href="/menu" className="mt-6 flex items-center justify-between gn-mono text-[11px] tracking-[0.2em] uppercase text-[#D4FF3F]/90 hover:text-[#D4FF3F] border-t border-[#D4FF3F]/15 pt-4">
          <span>Открыть раздел</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        
      </Link>
    </div>
  );
}

export default function Home() {
  const { hero, brand, contacts, schedule, loyalty, images, footer } = useSiteSettings();
  const { reviews } = useReviews();
  const menuItems = useMenuItems();
  const cards = useMemo(() => buildCards(menuItems), [menuItems]);

  const heroBg    = imgSrc(images, "heroBg",    heroBgDefault);
  const bearSkull = imgSrc(images, "bearSkull", bearSkullDefault);
  const cocktail  = imgSrc(images, "cocktail",  cocktailDefault);
  const interior  = imgSrc(images, "interior",  interiorDefault);
  const logo      = imgSrc(images, "logo",      logoDefault);

  const topReview = reviews[0];
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const hoursToday = schedule[0]?.hours ?? "16:00 — 02:00";
  const phoneClean = contacts.phone.replace(/[^\d+]/g, "");

  const featured = useMemo(() => {
    // Featured "кальян недели": match either section OR category by /кальян/i, then fall back to any active item.
    const hookahs = menuItems.filter(
      i => i.isActive && (/кальян/i.test(i.section) || /кальян/i.test(i.category)),
    );
    return (hookahs[0] ?? menuItems.find(i => i.isActive) ?? null);
  }, [menuItems]);

  const tickerItems = [
    "СЕЙЧАС ОТКРЫТО",
    "ПРЕМИАЛЬНЫЙ ТАБАК",
    "АВТОРСКИЕ КОКТЕЙЛИ",
    `БРОНЬ ${contacts.phone}`,
    contacts.address.toUpperCase(),
    featured ? `КАЛЬЯН НЕДЕЛИ — ${featured.name.toUpperCase()}` : "КАЛЬЯН НЕДЕЛИ",
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);

  // Mobile menu a11y: Escape closes, body scroll locks while open, focus returns to toggle on close.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      menuToggleRef.current?.focus();
    };
  }, [mobileOpen]);

  return (
    <main className="min-h-screen bg-black text-white gn-root gn-sans">
      {/* ============ NAV ============ */}
      <header className="relative z-40">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-5 pb-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#D4FF3F]/40 gn-neon-box">
                <img src={logo} alt={brand.name} className="w-full h-full object-cover" />
              </div>
              <div className="leading-none">
                <div className="gn-display text-[20px] sm:text-[22px] gn-neon tracking-tight">{brand.name}</div>
                <div className="gn-mono text-[9px] tracking-[0.32em] text-[#F5F1E8]/55 mt-1">LOUNGE · BAR · TMN</div>
              </div>
            
          </Link>

          <nav className="hidden md:flex items-center gap-1 gn-glass rounded-full px-2 py-1.5">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="px-4 py-2 text-[12px] tracking-[0.16em] uppercase rounded-full transition text-[#F5F1E8]/75 hover:text-[#D4FF3F] hover:bg-[#D4FF3F]/5">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/55">
              {hoursToday}
            </span>
            <Link href="/booking" className="hidden sm:inline-flex gn-cta rounded-full px-4 sm:px-5 py-2.5 text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-semibold items-center gap-2">
                Забронировать
                <ArrowRight className="w-3.5 h-3.5" />
              
            </Link>
            <button
              ref={menuToggleRef}
              className="md:hidden text-[#F5F1E8] p-2 -mr-2"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileOpen}
              aria-controls="gn-mobile-nav"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <div className="gn-divider opacity-60" />

        {mobileOpen && (
          <nav
            id="gn-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Главная навигация"
            className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 overflow-y-auto py-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)] px-6"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-6 text-white" aria-label="Закрыть меню">
              <X className="w-8 h-8" />
            </button>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="gn-display text-3xl tracking-tight gn-neon-white hover:text-[#D4FF3F] transition">
                {n.label}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setMobileOpen(false)} className="mt-4 gn-cta rounded-full px-7 py-4 text-[12px] tracking-[0.18em] uppercase font-semibold">
              Забронировать стол
            </Link>
          </nav>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gn-smoke" />
        <div className="absolute inset-0 gn-grid opacity-60" />
        <div className="absolute inset-0 gn-scan opacity-70 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-screen"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(1) contrast(1.2) brightness(0.7)",
          }}
        />
        <div
          className="absolute -right-[15%] top-[8%] w-[700px] h-[700px] opacity-[0.18] pointer-events-none hidden md:block"
          style={{
            backgroundImage: `url(${bearSkull})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "drop-shadow(0 0 60px rgba(212,255,63,0.55)) brightness(1.4)",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-12">
            <div className="flex items-center gap-3">
              <span className="gn-chip flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_10px_#D4FF3F]" />
                СЕЙЧАС ОТКРЫТО
              </span>
              <span className="gn-chip-dim hidden sm:inline-flex">v.2026 / {brand.city.toUpperCase()}</span>
            </div>
            <div className="hidden lg:flex items-center gap-6 gn-mono text-[11px] tracking-[0.2em] text-[#F5F1E8]/55">
              <span>N 57°09′</span>
              <span>E 65°36′</span>
              <span className="text-[#D4FF3F]">— NIGHT MODE</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 left-0 gn-mono text-[10px] tracking-[0.4em] text-[#F5F1E8]/40">
              [ 001 / HOME ]
            </div>

            <h1 className="gn-display font-extrabold leading-[0.82] tracking-tighter">
              <span
                className="block gn-neon"
                style={{ fontSize: "clamp(72px, 18vw, 200px)" }}
              >
                {(hero.title1 || brand.name).toUpperCase()}
              </span>
              <span
                className="block -mt-2"
                style={{ fontSize: "clamp(28px, 6vw, 64px)" }}
              >
                <span className="gn-neon-white">ЛАУНЖ-БАР </span>
                <span className="gn-stroke">В&nbsp;{brand.city.toUpperCase()}</span>
              </span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-8 md:mt-10 gap-6 md:gap-10">
              <p className="gn-sans text-[15px] sm:text-[18px] text-[#F5F1E8]/75 max-w-[520px] leading-relaxed">
                {hero.subtitle}
              </p>

              {avgRating && (
                <Link href="/reviews" className="md:flex flex-col gap-2 items-start md:items-end gn-mono text-[11px] tracking-[0.18em] text-[#F5F1E8]/55 hidden">
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            Number(avgRating) >= s - 0.5
                              ? "text-[#D4FF3F] fill-[#D4FF3F]"
                              : "text-[#F5F1E8]/20"
                          }`}
                        />
                      ))}
                      <span className="text-[#F5F1E8]">{avgRating}</span>
                    </div>
                    <span>{reviews.length} ОТЗЫВ{reviews.length === 1 ? "" : reviews.length < 5 ? "А" : "ОВ"}</span>
                  
                </Link>
              )}
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/booking" className="gn-cta rounded-full px-6 sm:px-7 py-3.5 sm:py-4 text-[12px] sm:text-[13px] tracking-[0.18em] uppercase font-semibold inline-flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  Забронировать стол
                  <ArrowRight className="w-4 h-4" />
                
              </Link>
              <Link href="/menu" className="gn-cta-ghost rounded-full px-6 sm:px-7 py-3.5 sm:py-4 text-[12px] sm:text-[13px] tracking-[0.18em] uppercase inline-flex items-center gap-3">
                  <UtensilsCrossed className="w-4 h-4 text-[#D4FF3F]" />
                  Меню
                
              </Link>
              <a href={`tel:${phoneClean}`} className="ml-2 hidden md:flex items-center gap-2 text-[11px] gn-mono tracking-[0.18em] text-[#F5F1E8]/50 hover:text-[#D4FF3F] transition">
                <span className="w-8 h-px bg-[#D4FF3F]/50" />
                ИЛИ ПОЗВОНИ {contacts.phone}
              </a>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 gn-glass-lime rounded-md px-5 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: MapPin, text: contacts.address.replace(/^г\.\s*/i, "").toUpperCase() },
              { Icon: Clock, text: `ЕЖЕДНЕВНО · ${hoursToday}` },
              { Icon: Phone, text: contacts.phone },
              { Icon: Wind,  text: "ПРОФ. ВЕНТИЛЯЦИЯ" },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-[#D4FF3F] shrink-0" />
                <span className="gn-mono text-[11px] sm:text-[12px] tracking-[0.18em] text-[#F5F1E8]/85 truncate">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Ticker items={tickerItems} />
      </section>

      {/* ============ КАЛЬЯН НЕДЕЛИ ============ */}
      {featured && (
        <section className="relative">
          <div className="absolute inset-0 gn-grid-fine opacity-50" />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
            <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4 flex-wrap">
              <div>
                <div className="gn-chip mb-4 inline-flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> WEEKLY DROP
                </div>
                <h2 className="gn-display leading-none tracking-tighter" style={{ fontSize: "clamp(36px, 7vw, 64px)" }}>
                  <span className="gn-neon-white">КАЛЬЯН </span>
                  <span className="gn-neon">НЕДЕЛИ</span>
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-3 gn-mono text-[11px] tracking-[0.2em] text-[#F5F1E8]/50">
                <span>{featured.category.toUpperCase()}</span>
                <span className="w-6 h-px bg-[#D4FF3F]/40" />
                <span>BLEND #{String(featured.id).padStart(3, "0")}</span>
              </div>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Photo card */}
              <div className="lg:col-span-7 relative rounded-md overflow-hidden gn-neon-box min-h-[360px] sm:min-h-[460px]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${cocktail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(0.4) contrast(1.1) brightness(0.7)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 gn-scan opacity-60" />
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="gn-chip flex items-center gap-2">
                      <Flame className="w-3 h-3" /> HOT MIX
                    </span>
                    <span className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/70">
                      {featured.section.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="gn-mono text-[11px] tracking-[0.3em] text-[#D4FF3F]/80 mb-3">
                      GRIZLI SIGNATURE BLEND
                    </div>
                    <h3
                      className="gn-display leading-[0.85] tracking-tighter gn-neon-white"
                      style={{ fontSize: "clamp(36px, 8vw, 68px)" }}
                    >
                      <span className="gn-neon">{featured.name.toUpperCase()}</span>
                    </h3>
                    {featured.description && (
                      <p className="mt-4 text-[13px] sm:text-[14px] text-[#F5F1E8]/65 max-w-md leading-relaxed">
                        {featured.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Details card */}
              <div className="lg:col-span-5 gn-glass-lime rounded-md p-6 sm:p-8 flex flex-col relative gn-corner">
                <span className="c1" /><span className="c2" />
                <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">КАТЕГОРИЯ</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="gn-chip">{featured.category.toUpperCase()}</span>
                  <span className="gn-chip">{featured.section.toUpperCase()}</span>
                  <span className="gn-chip">PHUNNEL</span>
                  <span className="gn-chip">COCO 25mm</span>
                </div>

                <div className="gn-divider my-6 sm:my-7 opacity-60" />

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">КРЕПОСТЬ</div>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span
                          key={i}
                          className={`h-5 w-2 rounded-[1px] ${
                            i <= 4 ? "bg-[#D4FF3F] shadow-[0_0_8px_#D4FF3F]" : "bg-[#F5F1E8]/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">СЕССИЯ</div>
                    <div className="mt-2 gn-mono text-[18px] sm:text-[20px] text-[#F5F1E8]">
                      ~120<span className="text-[#F5F1E8]/40 text-[12px]"> МИН</span>
                    </div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">ЧАША</div>
                    <div className="mt-2 gn-mono text-[14px] text-[#F5F1E8]">Phunnel · Glaze</div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">УГОЛЬ</div>
                    <div className="mt-2 gn-mono text-[14px] text-[#F5F1E8]">Coco · 25mm</div>
                  </div>
                </div>

                <div className="gn-divider my-6 sm:my-7 opacity-60" />

                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">ЦЕНА</div>
                    <div className="gn-display leading-none mt-1" style={{ fontSize: "clamp(32px, 5vw, 44px)" }}>
                      <span className="text-[#F5F1E8]/55 text-[16px] gn-mono">от </span>
                      <span className="gn-neon">{formatPrice(featured.price).num}</span>
                      <span className="text-[#F5F1E8]/55 text-[18px] gn-mono"> {formatPrice(featured.price).suffix || "₽"}</span>
                    </div>
                  </div>
                  <Link href="/booking" className="gn-cta rounded-full px-5 sm:px-6 py-3 sm:py-3.5 text-[11px] sm:text-[12px] tracking-[0.18em] uppercase font-semibold inline-flex items-center gap-2">
                      Хочу этот
                      <ArrowRight className="w-3.5 h-3.5" />
                    
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ MENU GRID ============ */}
      {cards.length > 0 && (
        <section className="relative">
          <div className="gn-divider opacity-70" />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
            <div className="flex items-end justify-between mb-10 sm:mb-12 gap-4 flex-wrap">
              <div>
                <div className="gn-chip mb-4 inline-flex">/ MENU / 003</div>
                <h2 className="gn-display leading-none tracking-tighter" style={{ fontSize: "clamp(36px, 7vw, 64px)" }}>
                  <span className="gn-neon-white">КАРТА </span>
                  <span className="gn-stroke">ЗАВЕДЕНИЯ</span>
                </h2>
              </div>
              <Link href="/menu" className="hidden md:inline-flex items-center gap-2 gn-mono text-[11px] tracking-[0.22em] uppercase text-[#D4FF3F] border-b border-[#D4FF3F]/40 pb-1">
                  Полное меню — {menuItems.filter(i => i.isActive).length} позиций
                  <ArrowUpRight className="w-3.5 h-3.5" />
                
              </Link>
            </div>

            <div className={`grid gap-6 ${
              cards.length === 1 ? "grid-cols-1" :
              cards.length === 2 ? "grid-cols-1 md:grid-cols-2" :
                                  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {cards.map(c => <MenuCard key={c.title} card={c} />)}
            </div>

            <div className="mt-10 md:hidden">
              <Link href="/menu" className="block w-full text-center gn-cta-ghost rounded-full px-6 py-4 text-[12px] tracking-[0.18em] uppercase">
                  Полное меню →
                
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ LOYALTY ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gn-smoke opacity-80" />
        <div className="absolute inset-0 gn-grid opacity-40" />
        <div className="absolute inset-0 gn-scan opacity-50" />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="gn-chip mb-5 inline-flex items-center gap-2">
                <Zap className="w-3 h-3" /> {loyalty.tagline.toUpperCase()}
              </div>
              <h2
                className="gn-display leading-[0.85] tracking-tighter"
                style={{ fontSize: "clamp(40px, 8vw, 80px)" }}
              >
                <span className="gn-neon-white">НАКОПИ </span>
                <span className="gn-neon">БАМБУК </span>
                <br />
                <span className="gn-stroke">— ПОЛУЧИ</span>{" "}
                <span className="gn-neon-white">КАЛЬЯН</span>
                <br />
                <span className="gn-neon-white">В </span>
                <span className="gn-neon">ПОДАРОК</span>
              </h2>
              <p className="mt-6 max-w-[520px] text-[14px] sm:text-[15px] text-[#F5F1E8]/65 leading-relaxed">
                {loyalty.description}
              </p>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                <Link href="/loyalty" className="gn-cta rounded-full px-6 sm:px-7 py-3.5 sm:py-4 text-[12px] sm:text-[13px] tracking-[0.18em] uppercase font-semibold inline-flex items-center gap-3">
                    Активировать карту
                    <ArrowRight className="w-4 h-4" />
                  
                </Link>
                <span className="gn-mono text-[11px] tracking-[0.18em] text-[#F5F1E8]/55">
                  ДОСТУПНО В TELEGRAM · @{loyalty.botUsername}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="gn-glass rounded-md p-6 sm:p-7 relative gn-corner">
                <span className="c1" /><span className="c2" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                      GRIZLI CARD · ДЕМО
                    </div>
                    <div className="gn-display text-[18px] sm:text-[20px] mt-1 gn-neon-white">
                      Твоё имя
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#D4FF3F]/50">
                    <img src={logo} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between mb-2 gn-mono text-[10px] tracking-[0.25em]">
                    <span className="text-[#F5F1E8]/55">ПРОГРЕСС</span>
                    <span className="text-[#D4FF3F]">7 / 10 БАМБУКА</span>
                  </div>
                  <div className="gn-progress-track">
                    <div className="gn-progress-fill" style={{ width: "70%" }} />
                  </div>
                  <div className="mt-3 flex justify-between gn-mono text-[10px] text-[#F5F1E8]/45 tracking-[0.2em]">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} className={i < 7 ? "text-[#D4FF3F]" : ""}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="gn-divider my-6 opacity-50" />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/50">ВИЗИТЫ</div>
                    <div className="gn-mono text-[16px] sm:text-[18px] text-[#F5F1E8] mt-1">17</div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/50">ПОТРАЧЕНО</div>
                    <div className="gn-mono text-[16px] sm:text-[18px] text-[#F5F1E8] mt-1">
                      32 100<span className="text-[#F5F1E8]/40 text-[10px]"> ₽</span>
                    </div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/50">СТАТУС</div>
                    <div className="gn-mono text-[13px] sm:text-[14px] gn-neon mt-1">GOLD BEAR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ INTERIOR ============ */}
      <section className="relative">
        <div className="gn-divider opacity-70" />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4 flex-wrap">
            <div>
              <div className="gn-chip mb-4 inline-flex">/ ATMOSPHERE / 005</div>
              <h2 className="gn-display leading-none tracking-tighter" style={{ fontSize: "clamp(36px, 7vw, 64px)" }}>
                <span className="gn-neon-white">ТВОЯ </span>
                <span className="gn-neon">ТЕРРИТОРИЯ</span>
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3 gn-mono text-[11px] tracking-[0.22em] text-[#F5F1E8]/50">
              <span>3 ЗАЛА</span>
              <span className="w-6 h-px bg-[#D4FF3F]/40" />
              <span>60 ПОСАДОЧНЫХ</span>
              <span className="w-6 h-px bg-[#D4FF3F]/40" />
              <span>VIP · 12 ЧЕЛ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 relative rounded-md overflow-hidden gn-neon-box h-[360px] sm:h-[520px]">
              <img
                src={interior}
                alt="Интерьер Гризли"
                loading="lazy"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(0.55) contrast(1.15) brightness(0.7)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 gn-scan opacity-40" />
              <div className="absolute top-5 sm:top-6 left-5 sm:left-6 flex items-center gap-2 flex-wrap">
                <span className="gn-chip flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_10px_#D4FF3F]" />
                  LIVE · ВТ-СБ
                </span>
                <span className="gn-chip-dim">DJ SET · 22:00</span>
              </div>
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80">ЗАЛ · MAIN FLOOR</div>
                  <div className="gn-display text-[22px] sm:text-[32px] gn-neon-white leading-tight mt-1">
                    Дым, бархат, неон
                  </div>
                </div>
                <Link href="/booking" className="gn-cta rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-[12px] tracking-[0.18em] uppercase font-semibold inline-flex items-center gap-2">
                    Стол
                    <ArrowRight className="w-3.5 h-3.5" />
                  
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="gn-glass rounded-md p-6 sm:p-7 flex-1 relative gn-corner">
                <span className="c1" /><span className="c2" />
                <div className="text-[#D4FF3F] gn-display text-[48px] sm:text-[64px] leading-none">"</div>
                <p className="text-[14px] sm:text-[16px] text-[#F5F1E8]/85 leading-relaxed -mt-4">
                  {topReview
                    ? topReview.text
                    : "Сюда заходишь на час, остаёшься на пять. Лучший кальян в городе и бармен, который читает тебя с порога."}
                </p>
                <div className="mt-5 sm:mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4FF3F]/15 border border-[#D4FF3F]/40 flex items-center justify-center gn-display text-[#D4FF3F]">
                    {(topReview?.name ?? "М").trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[13px] sm:text-[14px] text-[#F5F1E8]">
                      {topReview?.name ?? "Максим Р."}
                    </div>
                    <div className="gn-mono text-[10px] tracking-[0.2em] text-[#F5F1E8]/50">
                      {topReview?.source?.toUpperCase() ?? "2GIS"} · {topReview?.rating ?? 5}.0 ★
                    </div>
                  </div>
                </div>
                {reviews.length > 1 && (
                  <Link href="/reviews" className="mt-5 inline-flex items-center gap-2 gn-mono text-[11px] tracking-[0.2em] uppercase text-[#D4FF3F] border-b border-[#D4FF3F]/40 pb-0.5">
                      Все отзывы — {reviews.length}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    
                  </Link>
                )}
              </div>

              <div className="gn-glass-lime rounded-md p-5 sm:p-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">КУХНЯ</div>
                  <div className="gn-mono text-[16px] sm:text-[18px] text-[#F5F1E8] mt-1">До 01:30</div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">КАЛЬЯН</div>
                  <div className="gn-mono text-[16px] sm:text-[18px] text-[#F5F1E8] mt-1">До 02:00</div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">ПАРКОВКА</div>
                  <div className="gn-mono text-[16px] sm:text-[18px] gn-neon mt-1">FREE</div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">18+</div>
                  <div className="gn-mono text-[16px] sm:text-[18px] text-[#F5F1E8] mt-1">DRESS CASUAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative bg-[#050505] border-t border-[#D4FF3F]/20">
        <div className="absolute inset-0 gn-grid opacity-40" />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm overflow-hidden border border-[#D4FF3F]/40 gn-neon-box">
                  <img src={logo} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="gn-display text-[24px] sm:text-[28px] gn-neon leading-none">{brand.name}</div>
                  <div className="gn-mono text-[10px] tracking-[0.32em] text-[#F5F1E8]/55 mt-1">
                    ЛАУНЖ · БАР · {brand.city.toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[13px] sm:text-[14px] text-[#F5F1E8]/55 max-w-[380px] leading-relaxed">
                {footer.tagline}
              </p>
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                {contacts.instagram && (
                  <a href={contacts.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full gn-glass flex items-center justify-center hover:border-[#D4FF3F]/60 transition group" aria-label="Instagram">
                    <Instagram className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" />
                  </a>
                )}
                {contacts.telegram && (
                  <a href={contacts.telegram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full gn-glass flex items-center justify-center hover:border-[#D4FF3F]/60 transition group" aria-label="Telegram">
                    <Send className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" />
                  </a>
                )}
                {contacts.vk && (
                  <a href={contacts.vk} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full gn-glass flex items-center justify-center hover:border-[#D4FF3F]/60 transition group" aria-label="VK">
                    <GlassWater className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" />
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-5">/ КОНТАКТЫ</div>
              <ul className="space-y-3 text-[13px] sm:text-[14px] text-[#F5F1E8]/75">
                <li className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#D4FF3F] mt-1 shrink-0" />
                  <span>{contacts.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-3.5 h-3.5 text-[#D4FF3F] shrink-0" />
                  <a href={`tel:${phoneClean}`} className="hover:text-[#D4FF3F] transition">{contacts.phone}</a>
                </li>
                {schedule.map((row, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-[#D4FF3F] shrink-0" />
                    <span><span className="text-[#F5F1E8]/55">{row.days}</span> {row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-5">/ НАВИГАЦИЯ</div>
              <ul className="space-y-2.5 text-[13px] sm:text-[14px] text-[#F5F1E8]/75">
                {NAV.map(n => (
                  <li key={n.href}>
                    <Link href={n.href} className="hover:text-[#D4FF3F] transition">{n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-5">/ БРОНЬ</div>
              <Link href="/booking" className="block w-full text-center gn-cta rounded-full px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-semibold">
                  Стол на вечер
                
              </Link>
              <Link href="/loyalty" className="block w-full text-center mt-3 gn-cta-ghost rounded-full px-5 py-3 text-[11px] tracking-[0.18em] uppercase">
                  Telegram-бот
                
              </Link>
            </div>
          </div>

          <div className="gn-divider mt-12 sm:mt-14 mb-6 opacity-50" />
          <div className="flex flex-wrap items-center justify-between gap-4 gn-mono text-[10px] tracking-[0.22em] text-[#F5F1E8]/45">
            <span>{footer.copyright} · {brand.estYear}</span>
            <span>КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ · 18+</span>
            <span>MADE IN {brand.city.toUpperCase()}</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
