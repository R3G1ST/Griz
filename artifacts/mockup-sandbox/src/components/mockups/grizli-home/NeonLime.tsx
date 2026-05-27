import "./_group.css";
import {
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Clock,
  Flame,
  GlassWater,
  Instagram,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Star,
  UtensilsCrossed,
  Wind,
  Zap,
} from "lucide-react";

const NAV = ["Меню", "Кальяны", "Бар", "Бронь", "Лояльность"];

const TICKER = [
  "ОТКРЫТО ДО 02:00",
  "ПРЕМИАЛЬНЫЙ ТАБАК",
  "АВТОРСКИЕ КОКТЕЙЛИ",
  "БРОНЬ +7 (3452) 55-12-92",
  "УЛ. НОВОСЁЛОВ 92",
  "КАЛЬЯН НЕДЕЛИ —30%",
];

const HOOKAHS = [
  { name: "GRIZLI SIGNATURE", desc: "Манго · Маракуйя · Лёд", price: "1 800" },
  { name: "BLACKBERRY SMOKE", desc: "Ежевика · Мята · Бергамот", price: "1 600" },
  { name: "TAIGA NIGHT", desc: "Хвоя · Чёрная смородина", price: "1 900" },
  { name: "HONEY OAK", desc: "Мёд · Дубовая щепа · Лимон", price: "2 100" },
];

const COCKTAILS = [
  { name: "Когти Гризли", desc: "Копчёный виски · кленовый сироп", price: "780" },
  { name: "Тёмная Тайга", desc: "Джин · хвоя · черника", price: "720" },
  { name: "Lime Reactor", desc: "Текила · лайм · халапеньо", price: "820" },
  { name: "Velvet Bear", desc: "Бурбон · какао · вишня", price: "860" },
];

const SNACKS = [
  { name: "Тартар из говядины", desc: "Каперсы · перепелиный желток", price: "690" },
  { name: "Камчатский краб", desc: "Авокадо · понзу · икра", price: "1 290" },
  { name: "Сырное плато", desc: "Бри · горгонзола · мёд", price: "980" },
  { name: "Боул с тунцом", desc: "Севиче · киноа · манго", price: "820" },
];

function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-[#D4FF3F]/25 bg-black/60 gn-ticker-mask">
      <div className="flex whitespace-nowrap py-3 gn-mono text-[11px] tracking-[0.3em]">
        {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
          <span key={i} className="px-8 flex items-center gap-3">
            <span className="text-[#D4FF3F]/90">◆</span>
            <span className={i % 2 === 0 ? "gn-neon" : "text-[#F5F1E8]/70"}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MenuCard({
  title,
  icon: Icon,
  items,
  tag,
  currency,
}: {
  title: string;
  icon: any;
  items: { name: string; desc: string; price: string }[];
  tag: string;
  currency: string;
}) {
  return (
    <div className="gn-glass rounded-md p-6 flex flex-col relative gn-corner">
      <span className="c1" />
      <span className="c2" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center bg-[#D4FF3F]/10 border border-[#D4FF3F]/40">
            <Icon className="w-4 h-4 text-[#D4FF3F]" />
          </div>
          <h3 className="gn-display text-[22px] uppercase tracking-tight">{title}</h3>
        </div>
        <span className="gn-chip-dim">{tag}</span>
      </div>
      <div className="gn-divider mb-5 opacity-50" />
      <ul className="flex-1 flex flex-col gap-4">
        {items.map((it) => (
          <li key={it.name} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[15px] text-[#F5F1E8] leading-tight">{it.name}</div>
              <div className="text-[12px] text-[#F5F1E8]/50 mt-1 gn-sans">{it.desc}</div>
            </div>
            <div className="gn-mono text-[13px] text-[#D4FF3F] whitespace-nowrap pt-0.5">
              {it.price}
              <span className="text-[#F5F1E8]/40 ml-1">{currency}</span>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-6 flex items-center justify-between gn-mono text-[11px] tracking-[0.2em] uppercase text-[#D4FF3F]/90 hover:text-[#D4FF3F] border-t border-[#D4FF3F]/15 pt-4">
        <span>Открыть раздел</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function NeonLime() {
  return (
    <div
      className="min-h-screen bg-black text-white gn-root gn-sans"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      {/* ============ NAV ============ */}
      <header className="relative z-40">
        <div className="max-w-[1280px] mx-auto px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#D4FF3F]/40 gn-neon-box">
              <img src="/__mockup/images/logo.jpeg" alt="ГРИЗЛИ" className="w-full h-full object-cover" />
            </div>
            <div className="leading-none">
              <div className="gn-display text-[22px] gn-neon tracking-tight">ГРИЗЛИ</div>
              <div className="gn-mono text-[9px] tracking-[0.32em] text-[#F5F1E8]/55 mt-1">LOUNGE · BAR · TMN</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 gn-glass rounded-full px-2 py-1.5">
            {NAV.map((n, i) => (
              <a
                key={n}
                href="#"
                className={`px-4 py-2 text-[12px] tracking-[0.16em] uppercase rounded-full transition ${
                  i === 0 ? "text-[#0A0A0A] bg-[#D4FF3F]" : "text-[#F5F1E8]/75 hover:text-[#D4FF3F]"
                }`}
              >
                {n}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/55">
              16:00 — 02:00
            </span>
            <button className="gn-cta rounded-full px-5 py-2.5 text-[12px] tracking-[0.16em] uppercase font-semibold flex items-center gap-2">
              Забронировать стол
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="gn-divider opacity-60" />
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gn-smoke" />
        <div className="absolute inset-0 gn-grid opacity-60" />
        <div className="absolute inset-0 gn-scan opacity-70 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-screen"
          style={{
            backgroundImage: "url(/__mockup/images/hero-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(1) contrast(1.2) brightness(0.7)",
          }}
        />
        <div
          className="absolute -right-[15%] top-[8%] w-[700px] h-[700px] opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: "url(/__mockup/images/bear-skull.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "drop-shadow(0 0 60px rgba(212,255,63,0.55)) brightness(1.4)",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-8 pt-20 pb-16">
          {/* status row */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <span className="gn-chip flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_10px_#D4FF3F]" />
                СЕЙЧАС ОТКРЫТО
              </span>
              <span className="gn-chip-dim">v.2026 / ТЮМЕНЬ</span>
            </div>
            <div className="flex items-center gap-6 gn-mono text-[11px] tracking-[0.2em] text-[#F5F1E8]/55">
              <span>N 57°09′</span>
              <span>E 65°32′</span>
              <span className="text-[#D4FF3F]">— 18°C / NIGHT</span>
            </div>
          </div>

          {/* Headline */}
          <div className="relative">
            <div className="absolute -top-6 left-0 gn-mono text-[10px] tracking-[0.4em] text-[#F5F1E8]/40">
              [ 001 / HOME ]
            </div>

            <h1 className="gn-display font-extrabold leading-[0.82] tracking-tighter">
              <span className="block gn-neon text-[200px]">ГРИЗЛИ</span>
              <span className="block text-[64px] -mt-2">
                <span className="gn-neon-white">ЛАУНЖ-БАР </span>
                <span className="gn-stroke">В&nbsp;ТЮМЕНИ</span>
              </span>
            </h1>

            <div className="flex items-end justify-between mt-10 gap-10">
              <p className="gn-sans text-[18px] text-[#F5F1E8]/75 max-w-[520px] leading-relaxed">
                Премиальные кальяны
                <span className="text-[#D4FF3F]"> • </span>
                авторские коктейли
                <span className="text-[#D4FF3F]"> • </span>
                камерный зал в центре города. Работаем до 02:00.
              </p>

              <div className="hidden md:flex flex-col gap-2 items-end gn-mono text-[11px] tracking-[0.18em] text-[#F5F1E8]/55">
                <div className="flex items-center gap-3">
                  <Star className="w-3.5 h-3.5 text-[#D4FF3F] fill-[#D4FF3F]" />
                  <Star className="w-3.5 h-3.5 text-[#D4FF3F] fill-[#D4FF3F]" />
                  <Star className="w-3.5 h-3.5 text-[#D4FF3F] fill-[#D4FF3F]" />
                  <Star className="w-3.5 h-3.5 text-[#D4FF3F] fill-[#D4FF3F]" />
                  <Star className="w-3.5 h-3.5 text-[#D4FF3F] fill-[#D4FF3F]" />
                  <span className="text-[#F5F1E8]">4.9</span>
                </div>
                <span>2GIS · 318 ОТЗЫВОВ</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button className="gn-cta rounded-full px-7 py-4 text-[13px] tracking-[0.18em] uppercase font-semibold flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                Забронировать стол
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="gn-cta-ghost rounded-full px-7 py-4 text-[13px] tracking-[0.18em] uppercase flex items-center gap-3 hover:border-[#D4FF3F]/60 transition">
                <UtensilsCrossed className="w-4 h-4 text-[#D4FF3F]" />
                Меню
              </button>
              <div className="ml-2 hidden md:flex items-center gap-2 text-[11px] gn-mono tracking-[0.18em] text-[#F5F1E8]/50">
                <span className="w-8 h-px bg-[#D4FF3F]/50" />
                ИЛИ ПОЗВОНИ +7 (3452) 55-12-92
              </div>
            </div>
          </div>

          {/* Address strip */}
          <div className="mt-16 gn-glass-lime rounded-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#D4FF3F]" />
              <span className="gn-mono text-[12px] tracking-[0.18em] text-[#F5F1E8]/85">
                УЛ. НОВОСЁЛОВ 92
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#D4FF3F]" />
              <span className="gn-mono text-[12px] tracking-[0.18em] text-[#F5F1E8]/85">
                ЕЖЕДНЕВНО · 16:00 — 02:00
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#D4FF3F]" />
              <span className="gn-mono text-[12px] tracking-[0.18em] text-[#F5F1E8]/85">
                +7 (3452) 55-12-92
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-4 h-4 text-[#D4FF3F]" />
              <span className="gn-mono text-[12px] tracking-[0.18em] text-[#F5F1E8]/85">
                ВЕНТИЛЯЦИЯ HEPA-13
              </span>
            </div>
          </div>
        </div>

        <Ticker />
      </section>

      {/* ============ КАЛЬЯН НЕДЕЛИ ============ */}
      <section className="relative">
        <div className="absolute inset-0 gn-grid-fine opacity-50" />
        <div className="relative max-w-[1280px] mx-auto px-8 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="gn-chip mb-4 inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> WEEKLY DROP
              </div>
              <h2 className="gn-display text-[64px] leading-none tracking-tighter">
                <span className="gn-neon-white">КАЛЬЯН</span>{" "}
                <span className="gn-neon">НЕДЕЛИ</span>
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3 gn-mono text-[11px] tracking-[0.2em] text-[#F5F1E8]/50">
              <span>WEEK 47</span>
              <span className="w-6 h-px bg-[#D4FF3F]/40" />
              <span>STOCK · 23/40</span>
            </div>
          </div>

          <div className="relative grid grid-cols-12 gap-6 items-stretch">
            {/* Photo bg card */}
            <div className="col-span-7 relative rounded-md overflow-hidden gn-neon-box min-h-[460px]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/__mockup/images/cocktail.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(0.4) contrast(1.1) brightness(0.7)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 gn-scan opacity-60" />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="gn-chip flex items-center gap-2">
                    <Flame className="w-3 h-3" /> HOT MIX
                  </span>
                  <span className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/70">
                    BLEND #047
                  </span>
                </div>
                <div>
                  <div className="gn-mono text-[11px] tracking-[0.3em] text-[#D4FF3F]/80 mb-3">
                    GRIZLI SIGNATURE BLEND
                  </div>
                  <h3 className="gn-display text-[68px] leading-[0.85] tracking-tighter gn-neon-white">
                    ЯДОВИТАЯ
                    <br />
                    <span className="gn-neon">ХУРМА</span>
                  </h3>
                  <p className="mt-4 text-[14px] text-[#F5F1E8]/65 max-w-md leading-relaxed">
                    Терпкая хурма, дымный чёрный чай и пряная корица. Лонг-сессия на 2 часа
                    под пуэр на углях.
                  </p>
                </div>
              </div>
            </div>

            {/* Details card */}
            <div className="col-span-5 gn-glass-lime rounded-md p-8 flex flex-col relative gn-corner">
              <span className="c1" />
              <span className="c2" />
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                СОСТАВ МИКСА
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["ХУРМА", "ЧЁРНЫЙ ЧАЙ", "КОРИЦА", "ЦЕДРА"].map((c) => (
                  <span key={c} className="gn-chip">
                    {c}
                  </span>
                ))}
              </div>

              <div className="gn-divider my-7 opacity-60" />

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                    КРЕПОСТЬ
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
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
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                    СЕССИЯ
                  </div>
                  <div className="mt-2 gn-mono text-[20px] text-[#F5F1E8]">
                    ~120<span className="text-[#F5F1E8]/40 text-[12px]"> МИН</span>
                  </div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                    ЧАША
                  </div>
                  <div className="mt-2 gn-mono text-[14px] text-[#F5F1E8]">
                    Phunnel · Glaze
                  </div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                    УГОЛЬ
                  </div>
                  <div className="mt-2 gn-mono text-[14px] text-[#F5F1E8]">
                    Coco · 25mm
                  </div>
                </div>
              </div>

              <div className="gn-divider my-7 opacity-60" />

              <div className="flex items-end justify-between">
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                    ЦЕНА
                  </div>
                  <div className="gn-display text-[44px] leading-none mt-1">
                    <span className="text-[#F5F1E8]/55 text-[16px] gn-mono">от </span>
                    <span className="gn-neon">1 800</span>
                    <span className="text-[#F5F1E8]/55 text-[18px] gn-mono"> ₽</span>
                  </div>
                </div>
                <button className="gn-cta rounded-full px-6 py-3.5 text-[12px] tracking-[0.18em] uppercase font-semibold flex items-center gap-2">
                  Хочу этот
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MENU GRID ============ */}
      <section className="relative">
        <div className="gn-divider opacity-70" />
        <div className="relative max-w-[1280px] mx-auto px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="gn-chip mb-4 inline-flex">/ MENU / 003</div>
              <h2 className="gn-display text-[64px] leading-none tracking-tighter">
                <span className="gn-neon-white">КАРТА </span>
                <span className="gn-stroke">ЗАВЕДЕНИЯ</span>
              </h2>
            </div>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 gn-mono text-[11px] tracking-[0.22em] uppercase text-[#D4FF3F] border-b border-[#D4FF3F]/40 pb-1"
            >
              Полное меню — 84 позиции <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <MenuCard
              title="Кальяны"
              icon={Flame}
              tag="34 МИКСА"
              currency="₽"
              items={HOOKAHS}
            />
            <MenuCard
              title="Авторские коктейли"
              icon={GlassWater}
              tag="22 ПОЗИЦИИ"
              currency="₽"
              items={COCKTAILS}
            />
            <MenuCard
              title="Закуски"
              icon={UtensilsCrossed}
              tag="28 БЛЮД"
              currency="₽"
              items={SNACKS}
            />
          </div>
        </div>
      </section>

      {/* ============ LOYALTY ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gn-smoke opacity-80" />
        <div className="absolute inset-0 gn-grid opacity-40" />
        <div className="absolute inset-0 gn-scan opacity-50" />
        <div className="relative max-w-[1280px] mx-auto px-8 py-24">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-7">
              <div className="gn-chip mb-5 inline-flex items-center gap-2">
                <Zap className="w-3 h-3" /> LOYALTY PROTOCOL
              </div>
              <h2 className="gn-display text-[80px] leading-[0.85] tracking-tighter">
                <span className="gn-neon-white">НАКОПИ </span>
                <span className="gn-neon">БАМБУК </span>
                <br />
                <span className="gn-stroke">— ПОЛУЧИ</span>{" "}
                <span className="gn-neon-white">КАЛЬЯН</span>
                <br />
                <span className="gn-neon-white">В </span>
                <span className="gn-neon">ПОДАРОК</span>
              </h2>
              <p className="mt-6 max-w-[480px] text-[15px] text-[#F5F1E8]/65 leading-relaxed">
                Каждый визит — это +1 стебель бамбука на твоей карте. Собери 10 — и
                следующий кальян за счёт заведения. Без подписок, без приложений.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <button className="gn-cta rounded-full px-7 py-4 text-[13px] tracking-[0.18em] uppercase font-semibold flex items-center gap-3">
                  Активировать карту
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="gn-mono text-[11px] tracking-[0.18em] text-[#F5F1E8]/55">
                  ДОСТУПНО В ZЛАУНЖЕ / TELEGRAM
                </span>
              </div>
            </div>

            <div className="col-span-5">
              <div className="gn-glass rounded-md p-7 relative gn-corner">
                <span className="c1" />
                <span className="c2" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">
                      GRIZLI CARD · №00472
                    </div>
                    <div className="gn-display text-[20px] mt-1 gn-neon-white">
                      Артур К.
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#D4FF3F]/50">
                    <img src="/__mockup/images/logo.jpeg" alt="" className="w-full h-full object-cover" />
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
                    <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/50">
                      ВИЗИТЫ
                    </div>
                    <div className="gn-mono text-[18px] text-[#F5F1E8] mt-1">17</div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/50">
                      ПОТРАЧЕНО
                    </div>
                    <div className="gn-mono text-[18px] text-[#F5F1E8] mt-1">
                      32 100<span className="text-[#F5F1E8]/40 text-[11px]"> ₽</span>
                    </div>
                  </div>
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/50">
                      СТАТУС
                    </div>
                    <div className="gn-mono text-[14px] gn-neon mt-1">GOLD BEAR</div>
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
        <div className="relative max-w-[1280px] mx-auto px-8 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="gn-chip mb-4 inline-flex">/ ATMOSPHERE / 005</div>
              <h2 className="gn-display text-[64px] leading-none tracking-tighter">
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

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 relative rounded-md overflow-hidden gn-neon-box h-[520px]">
              <img
                src="/__mockup/images/interior.png"
                alt="Интерьер Гризли"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(0.55) contrast(1.15) brightness(0.7)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 gn-scan opacity-40" />
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="gn-chip flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_10px_#D4FF3F]" />
                  LIVE · ВТ-СБ
                </span>
                <span className="gn-chip-dim">DJ SET · 22:00</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80">
                    ЗАЛ · MAIN FLOOR
                  </div>
                  <div className="gn-display text-[32px] gn-neon-white leading-tight mt-1">
                    Дым, бархат, неон
                  </div>
                </div>
                <button className="gn-cta rounded-full px-6 py-3 text-[12px] tracking-[0.18em] uppercase font-semibold flex items-center gap-2">
                  Забронировать стол
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-6">
              <div className="gn-glass rounded-md p-7 flex-1 relative gn-corner">
                <span className="c1" />
                <span className="c2" />
                <div className="text-[#D4FF3F] gn-display text-[64px] leading-none">"</div>
                <p className="text-[16px] text-[#F5F1E8]/85 leading-relaxed -mt-4">
                  Сюда заходишь на час, остаёшься на пять. Лучший кальян в городе и
                  бармен, который читает тебя с порога.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4FF3F]/15 border border-[#D4FF3F]/40 flex items-center justify-center gn-display text-[#D4FF3F]">
                    М
                  </div>
                  <div>
                    <div className="text-[14px] text-[#F5F1E8]">Максим Р.</div>
                    <div className="gn-mono text-[10px] tracking-[0.2em] text-[#F5F1E8]/50">
                      2GIS · 5.0 ★ · ОКТ 2025
                    </div>
                  </div>
                </div>
              </div>

              <div className="gn-glass-lime rounded-md p-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">
                    КУХНЯ
                  </div>
                  <div className="gn-mono text-[18px] text-[#F5F1E8] mt-1">До 01:30</div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">
                    КАЛЬЯН
                  </div>
                  <div className="gn-mono text-[18px] text-[#F5F1E8] mt-1">До 02:00</div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">
                    ПАРКОВКА
                  </div>
                  <div className="gn-mono text-[18px] gn-neon mt-1">FREE</div>
                </div>
                <div>
                  <div className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/55">
                    18+
                  </div>
                  <div className="gn-mono text-[18px] text-[#F5F1E8] mt-1">DRESS CASUAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative bg-[#050505] border-t border-[#D4FF3F]/20">
        <div className="absolute inset-0 gn-grid opacity-40" />
        <div className="relative max-w-[1280px] mx-auto px-8 py-16">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm overflow-hidden border border-[#D4FF3F]/40 gn-neon-box">
                  <img src="/__mockup/images/logo.jpeg" alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="gn-display text-[28px] gn-neon leading-none">ГРИЗЛИ</div>
                  <div className="gn-mono text-[10px] tracking-[0.32em] text-[#F5F1E8]/55 mt-1">
                    ЛАУНЖ · БАР · ТЮМЕНЬ
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[14px] text-[#F5F1E8]/55 max-w-[360px] leading-relaxed">
                Подпольный лаунж в самом центре Тюмени. Премиум-табак, авторские
                коктейли и звук, под который остаются до закрытия.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {[
                  { Icon: Instagram, label: "IG" },
                  { Icon: Send, label: "TG" },
                  { Icon: GlassWater, label: "VK" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 rounded-full gn-glass flex items-center justify-center hover:border-[#D4FF3F]/60 transition group"
                  >
                    <Icon className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" />
                  </a>
                ))}
                <span className="gn-mono text-[10px] tracking-[0.25em] text-[#F5F1E8]/40 ml-2">
                  @GRIZLI.TMN
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-5">
                / КОНТАКТЫ
              </div>
              <ul className="space-y-3 text-[14px] text-[#F5F1E8]/75">
                <li className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#D4FF3F] mt-1" />
                  ул. Новосёлов, 92
                  <br />
                  Тюмень, 625048
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-3.5 h-3.5 text-[#D4FF3F]" />
                  +7 (3452) 55-12-92
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-3.5 h-3.5 text-[#D4FF3F]" />
                  16:00 — 02:00 / ежедневно
                </li>
              </ul>
            </div>

            <div className="col-span-2">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-5">
                / НАВИГАЦИЯ
              </div>
              <ul className="space-y-2.5 text-[14px] text-[#F5F1E8]/75">
                {NAV.map((n) => (
                  <li key={n}>
                    <a href="#" className="hover:text-[#D4FF3F] transition">
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-5">
                / БРОНЬ
              </div>
              <button className="w-full gn-cta rounded-full px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-semibold">
                Стол на вечер
              </button>
              <button className="w-full mt-3 gn-cta-ghost rounded-full px-5 py-3 text-[11px] tracking-[0.18em] uppercase hover:border-[#D4FF3F]/60 transition">
                Telegram-бот
              </button>
            </div>
          </div>

          <div className="gn-divider mt-14 mb-6 opacity-50" />
          <div className="flex flex-wrap items-center justify-between gap-4 gn-mono text-[10px] tracking-[0.22em] text-[#F5F1E8]/45">
            <span>© 2026 GRIZLI LOUNGE BAR · ВСЕ ПРАВА СОХРАНЕНЫ</span>
            <span>КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ · 18+</span>
            <span>MADE IN TMN · v2026.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
