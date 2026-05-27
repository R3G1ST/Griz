import "./_group.css";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Send,
  Star,
  Quote,
  Plus,
  Minus,
} from "lucide-react";

export function DarkEditorial() {
  const nav = ["Меню", "Кальяны", "Бар", "Бронь", "Лояльность"];

  const hookahs = [
    { name: "Сибирский Дым", desc: "Кедр · Облепиха · Тёмный мёд", price: "1 800" },
    { name: "Чёрный Бамбук", desc: "Матча · Лайм · Имбирь", price: "2 100" },
    { name: "Полночь", desc: "Эспрессо · Какао · Вишня", price: "2 400" },
    { name: "Гризли Классик", desc: "Двойное яблоко · Мята", price: "1 600" },
  ];
  const cocktails = [
    { name: "Когти Гризли", desc: "Копчёный виски · мёд · дым", price: "780" },
    { name: "Тёмный Лес", desc: "Джин · можжевельник · ель", price: "720" },
    { name: "Кедровый Олд Фэшн", desc: "Бурбон · кедр · биттер", price: "840" },
    { name: "Полярный Спритц", desc: "Просекко · бузина · мята", price: "690" },
  ];
  const snacks = [
    { name: "Тартар из говядины", desc: "Перепелиное яйцо · крутоны", price: "690" },
    { name: "Хумус с уткой", desc: "Конфи · гранат · питта", price: "540" },
    { name: "Сырная доска", desc: "Шесть сортов · мёд · орех", price: "1 290" },
    { name: "Брускетты сет", desc: "Лосось · ростбиф · бри", price: "620" },
  ];

  return (
    <div
      className="de-root min-h-screen w-full overflow-hidden relative"
      style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#0A0A0A", color: "#F5F1E8" }}
    >
      {/* global grain overlay */}
      <div className="de-grain absolute inset-0 z-[1] opacity-60" />

      {/* ───── TOP NAV ───── */}
      <header className="relative z-20 border-b de-hair">
        <div className="max-w-[1180px] mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border de-hair-s bg-black">
              <img src="/__mockup/images/logo.jpeg" alt="" className="w-full h-full object-cover scale-[1.4]" />
            </div>
            <div className="leading-none">
              <div className="de-serif text-[22px] tracking-[0.04em] font-semibold cream-text">Гризли</div>
              <div className="de-smallcaps text-[9px] mt-1" style={{ color: "#D4FF3F" }}>
                Лаунж · бар · Тюмень
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-9 de-smallcaps text-[11px]" style={{ color: "#F5F1E8" }}>
            {nav.map((n, i) => (
              <a key={n} href="#" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <span className="de-num opacity-40 text-[9px]">0{i + 1}</span>
                <span>{n}</span>
              </a>
            ))}
          </nav>

          <a
            href="#"
            className="group inline-flex items-center gap-3 px-5 py-3 border de-hair-s hover:border-[#D4FF3F] transition-colors"
          >
            <span className="de-smallcaps text-[10px]" style={{ color: "#F5F1E8" }}>
              Забронировать стол
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "#D4FF3F" }} />
          </a>
        </div>

        {/* meta strip under nav */}
        <div className="border-t de-hair">
          <div className="max-w-[1180px] mx-auto px-10 py-2.5 flex items-center justify-between de-smallcaps text-[10px] opacity-60">
            <span>№ 06 — Осень / Зима 2026</span>
            <span className="de-num">Tюмень · 57.15°N 65.53°E</span>
            <span>Сегодня · 16:00 — 02:00 · открыто</span>
          </div>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="relative z-10 border-b de-hair">
        {/* bear watermark */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none de-watermark"
          style={{
            backgroundImage: "url(/__mockup/images/logo.jpeg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 40%",
            backgroundSize: "780px auto",
            opacity: 0.12,
            mixBlendMode: "screen",
            filter: "grayscale(100%) contrast(1.4)",
          }}
        />
        {/* hero bg image — subtle */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url(/__mockup/images/hero-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            mixBlendMode: "luminosity",
            filter: "grayscale(100%) contrast(1.05)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.95) 90%)" }}
        />

        <div className="relative max-w-[1180px] mx-auto px-10 pt-20 pb-24">
          {/* section meta */}
          <div className="flex items-start justify-between mb-12">
            <div className="flex items-center gap-4">
              <span className="de-smallcaps text-[10px]" style={{ color: "#D4FF3F" }}>
                № 01 — Заведение
              </span>
              <span className="block w-16 h-px" style={{ background: "#D4FF3F" }} />
            </div>
            <div className="text-right de-smallcaps text-[10px] opacity-60 leading-relaxed">
              <div>Премиум-кальянная</div>
              <div>Авторский бар · Тюмень</div>
            </div>
          </div>

          {/* big serif headline */}
          <h1
            className="de-serif font-light tracking-[-0.02em] leading-[0.86]"
            style={{ fontSize: "clamp(96px, 12vw, 168px)", color: "#F5F1E8" }}
          >
            Гри<span style={{ color: "#D4FF3F" }}>з</span>ли
            <br />
            <span className="italic font-extralight" style={{ color: "#F5F1E8", opacity: 0.92 }}>
              лаунж&#8201;—&#8201;бар
            </span>
          </h1>

          {/* underline rule + tagline */}
          <div className="mt-12 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-7">
              <div className="h-px w-full de-rule-dot mb-6" />
              <p
                className="de-serif italic text-[26px] leading-[1.35]"
                style={{ color: "#F5F1E8", maxWidth: "640px" }}
              >
                Премиальные кальяны, авторские коктейли и тихая комната,
                где разговор длиннее ночи&nbsp;— до двух часов.
              </p>
            </div>
            <div className="col-span-5 flex flex-col items-end gap-4">
              <div className="flex gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-4 border de-hair-s transition-colors hover:border-[#D4FF3F]"
                  style={{ background: "rgba(245,241,232,0.04)" }}
                >
                  <span className="de-smallcaps text-[10px]" style={{ color: "#F5F1E8" }}>
                    Забронировать стол
                  </span>
                  <ArrowUpRight className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                </a>
                <a href="#" className="inline-flex items-center gap-3 px-6 py-4 border de-hair">
                  <span className="de-smallcaps text-[10px] opacity-80">Меню</span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </a>
              </div>
              <div className="de-smallcaps text-[10px] opacity-50 text-right de-num">
                Tеl. +7 (3452) 55-07-92
              </div>
            </div>
          </div>

          {/* address strip */}
          <div className="mt-20 border-t border-b de-hair py-5 grid grid-cols-4 gap-8 de-smallcaps text-[10px]">
            <div className="flex items-center gap-3">
              <MapPin className="w-3.5 h-3.5" style={{ color: "#D4FF3F" }} />
              <span>ул. Новосёлов&nbsp;92</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-3.5 h-3.5" style={{ color: "#D4FF3F" }} />
              <span className="de-num">Ежедневно 16:00 — 02:00</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-3.5 h-3.5" style={{ color: "#D4FF3F" }} fill="#D4FF3F" />
              <span className="de-num">4.9 / 218 отзывов</span>
            </div>
            <div className="flex items-center justify-end gap-3 opacity-60">
              <span>Бронь рекомендована · пт / сб</span>
            </div>
          </div>
        </div>

        {/* ticker strip */}
        <div
          className="relative overflow-hidden border-t de-hair py-3"
          style={{ background: "#0A0A0A" }}
        >
          <div className="de-ticker de-smallcaps text-[11px]" style={{ color: "#F5F1E8" }}>
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="inline-flex items-center">
                {[
                  "Premium hookah",
                  "Author cocktails",
                  "Til 02 a.m.",
                  "Est. 2021",
                  "Тюмень",
                  "Loyalty · бамбук",
                  "Private room",
                  "Friday — live vinyl",
                ].map((w, i) => (
                  <span key={i} className="inline-flex items-center">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mx-7"
                      style={{ background: "#D4FF3F" }}
                    />
                    <span>{w}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── KALYAN NEDELI ───── */}
      <section className="relative z-10 border-b de-hair">
        <div className="max-w-[1180px] mx-auto px-10 pt-24 pb-24">
          <div className="flex items-start justify-between mb-14">
            <div className="flex items-center gap-4">
              <span className="de-smallcaps text-[10px]" style={{ color: "#D4FF3F" }}>
                № 02 — Кальян недели
              </span>
              <span className="block w-16 h-px" style={{ background: "#D4FF3F" }} />
            </div>
            <span className="de-smallcaps text-[10px] opacity-60">Сезонный микс · ноябрь</span>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* image card */}
            <div className="col-span-7 relative border de-hair overflow-hidden" style={{ aspectRatio: "16/11" }}>
              <img
                src="/__mockup/images/cocktail.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "grayscale(85%) contrast(1.05) brightness(0.7)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.85) 100%)",
                }}
              />
              {/* overlay corner index */}
              <div className="absolute top-6 left-6 de-smallcaps text-[10px] opacity-80">
                <div style={{ color: "#D4FF3F" }}>The Mix</div>
                <div className="de-num opacity-50 mt-1">№ 02 / 24</div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="de-serif italic text-[22px]" style={{ color: "#F5F1E8" }}>
                  «Чаша должна рассказывать историю.»
                </div>
                <div className="de-smallcaps text-[10px] opacity-60">— Мастер-хука Артём</div>
              </div>
            </div>

            {/* details */}
            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <div className="de-smallcaps text-[10px] opacity-50 mb-4">Featured · Limited</div>
                <h3
                  className="de-serif font-light leading-[0.95] tracking-[-0.01em]"
                  style={{ fontSize: "72px", color: "#F5F1E8" }}
                >
                  Сибирский
                  <br />
                  <span className="italic" style={{ color: "#D4FF3F" }}>
                    дым
                  </span>
                </h3>
                <p className="mt-6 text-[15px] leading-[1.7] opacity-80" style={{ maxWidth: "380px" }}>
                  Тёплый кедр на основе тёмного листа, поддержанный облепихой
                  и каплей тёмного липового мёда. Долгий, тихий, протяжный.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Кедр", "Облепиха", "Тёмный мёд", "Чёрный лист"].map((c) => (
                    <span
                      key={c}
                      className="de-smallcaps text-[10px] px-3 py-1.5 border de-hair"
                      style={{ color: "#F5F1E8" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t de-hair flex items-end justify-between">
                <div>
                  <div className="de-smallcaps text-[10px] opacity-50">Цена</div>
                  <div className="de-serif italic mt-1" style={{ fontSize: "44px", color: "#F5F1E8" }}>
                    от <span className="de-num">1 800</span>{" "}
                    <span style={{ color: "#D4FF3F" }}>₽</span>
                  </div>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-5 py-4 border de-hair-s hover:border-[#D4FF3F] transition-colors"
                >
                  <span className="de-smallcaps text-[10px]">Хочу этот</span>
                  <ArrowUpRight className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── MENU GRID ───── */}
      <section className="relative z-10 border-b de-hair">
        <div className="max-w-[1180px] mx-auto px-10 pt-24 pb-24">
          <div className="flex items-start justify-between mb-14">
            <div className="flex items-center gap-4">
              <span className="de-smallcaps text-[10px]" style={{ color: "#D4FF3F" }}>
                № 03 — Меню
              </span>
              <span className="block w-16 h-px" style={{ background: "#D4FF3F" }} />
            </div>
            <a href="#" className="de-smallcaps text-[10px] flex items-center gap-2 opacity-80 hover:opacity-100">
              <span>Открыть полное меню</span>
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "#D4FF3F" }} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-px" style={{ background: "rgba(245,241,232,0.14)" }}>
            {[
              { title: "Кальяны", subtitle: "Hookah", items: hookahs, unit: "₽" },
              { title: "Авторские коктейли", subtitle: "Cocktails", items: cocktails, unit: "₽" },
              { title: "Закуски", subtitle: "Bites", items: snacks, unit: "₽" },
            ].map((col, ci) => (
              <div key={col.title} className="p-8" style={{ background: "#0A0A0A" }}>
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <div className="de-serif italic" style={{ fontSize: "30px", color: "#F5F1E8" }}>
                      {col.title}
                    </div>
                    <div className="de-smallcaps text-[10px] opacity-50 mt-1">{col.subtitle}</div>
                  </div>
                  <span className="de-smallcaps text-[10px] de-num" style={{ color: "#D4FF3F" }}>
                    0{ci + 1}
                  </span>
                </div>

                <ul className="space-y-5">
                  {col.items.map((it, i) => (
                    <li key={i} className="group">
                      <div className="flex items-baseline gap-3">
                        <span
                          className="de-serif text-[18px] leading-tight"
                          style={{ color: "#F5F1E8" }}
                        >
                          {it.name}
                        </span>
                        <span
                          className="flex-1 border-b border-dotted self-end mb-1.5"
                          style={{ borderColor: "rgba(245,241,232,0.18)" }}
                        />
                        <span
                          className="de-num text-[14px]"
                          style={{ color: "#D4FF3F" }}
                        >
                          {it.price} {col.unit}
                        </span>
                      </div>
                      <div className="text-[12px] opacity-55 mt-1">{it.desc}</div>
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className="mt-8 inline-flex items-center gap-2 de-smallcaps text-[10px] opacity-80 hover:opacity-100"
                >
                  <span>Смотреть всё</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── LOYALTY ───── */}
      <section className="relative z-10 border-b de-hair">
        <div className="max-w-[1180px] mx-auto px-10 pt-24 pb-24">
          <div className="flex items-start justify-between mb-14">
            <div className="flex items-center gap-4">
              <span className="de-smallcaps text-[10px]" style={{ color: "#D4FF3F" }}>
                № 04 — Лояльность
              </span>
              <span className="block w-16 h-px" style={{ background: "#D4FF3F" }} />
            </div>
            <span className="de-smallcaps text-[10px] opacity-60">Программа · бамбук</span>
          </div>

          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-7">
              <h3
                className="de-serif font-light leading-[0.95] tracking-[-0.01em]"
                style={{ fontSize: "84px", color: "#F5F1E8" }}
              >
                Накопи{" "}
                <span className="italic" style={{ color: "#D4FF3F" }}>
                  бамбук
                </span>
                <br />
                — получи кальян
                <br />в подарок.
              </h3>
              <p className="mt-8 text-[15px] leading-[1.75] opacity-75" style={{ maxWidth: "520px" }}>
                Каждое посещение начисляет «стебли бамбука». Десять стеблей —
                и любой кальян из карты на счёт заведения. Просто, как тишина
                после первой затяжки.
              </p>
            </div>

            <div className="col-span-5">
              <div className="border de-hair p-8">
                <div className="flex items-center justify-between de-smallcaps text-[10px] opacity-60 mb-4">
                  <span>Ваш прогресс</span>
                  <span className="de-num" style={{ color: "#D4FF3F" }}>
                    07 / 10
                  </span>
                </div>

                {/* progress segments */}
                <div className="flex gap-1.5 mb-8">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2"
                      style={{
                        background:
                          i < 7 ? "#D4FF3F" : "rgba(245,241,232,0.1)",
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="de-serif italic" style={{ fontSize: "28px", color: "#F5F1E8" }}>
                    Ещё 3 визита
                  </div>
                  <div className="de-smallcaps text-[10px] opacity-60">до подарка</div>
                </div>

                <a
                  href="#"
                  className="mt-8 w-full inline-flex items-center justify-between px-5 py-4 border de-hair-s hover:border-[#D4FF3F] transition-colors"
                >
                  <span className="de-smallcaps text-[10px]">Активировать карту</span>
                  <ArrowUpRight className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                </a>
              </div>

              <div className="mt-4 flex items-center gap-6 de-smallcaps text-[9px] opacity-50">
                <span className="flex items-center gap-1.5">
                  <Plus className="w-3 h-3" style={{ color: "#D4FF3F" }} /> 1 визит = 1 бамбук
                </span>
                <span className="flex items-center gap-1.5">
                  <Minus className="w-3 h-3" /> сгорает через 6 мес
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── INTERIOR ───── */}
      <section className="relative z-10 border-b de-hair">
        <div className="max-w-[1180px] mx-auto px-10 pt-24 pb-24">
          <div className="flex items-start justify-between mb-14">
            <div className="flex items-center gap-4">
              <span className="de-smallcaps text-[10px]" style={{ color: "#D4FF3F" }}>
                № 05 — Атмосфера
              </span>
              <span className="block w-16 h-px" style={{ background: "#D4FF3F" }} />
            </div>
            <span className="de-smallcaps text-[10px] opacity-60">Интерьер · 280 м²</span>
          </div>

          {/* big image with torn bottom */}
          <div className="relative">
            <div
              className="relative w-full overflow-hidden de-torn"
              style={{ aspectRatio: "16/8" }}
            >
              <img
                src="/__mockup/images/interior.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "grayscale(60%) contrast(1.1) brightness(0.78)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,10,0.05) 50%, rgba(10,10,10,0.8) 100%)",
                }}
              />

              {/* floating caption */}
              <div className="absolute top-8 right-8 max-w-[260px] text-right">
                <div className="de-smallcaps text-[10px] opacity-70">
                  Гостиная · западное крыло
                </div>
                <div
                  className="de-serif italic mt-1"
                  style={{ fontSize: "22px", color: "#F5F1E8" }}
                >
                  Тёплый бетон, дуб, мягкий свет.
                </div>
              </div>
            </div>

            {/* quote + cta below */}
            <div className="mt-12 grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <Quote className="w-8 h-8 mb-4" style={{ color: "#D4FF3F" }} />
                <blockquote
                  className="de-serif italic font-light leading-[1.2]"
                  style={{ fontSize: "38px", color: "#F5F1E8", maxWidth: "720px" }}
                >
                  «Здесь не громко. Здесь не пусто. Сюда возвращаются,
                  когда хочется обсудить что-то важное — и не торопиться.»
                </blockquote>
                <div className="mt-6 flex items-center gap-4 de-smallcaps text-[10px] opacity-60">
                  <span>— Анна К.</span>
                  <span className="w-8 h-px bg-current opacity-40" />
                  <span>гость с 2022</span>
                  <span className="flex gap-0.5 ml-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3" style={{ color: "#D4FF3F" }} fill="#D4FF3F" />
                    ))}
                  </span>
                </div>
              </div>

              <div className="col-span-4 flex flex-col justify-end items-end gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-4 border de-hair-s hover:border-[#D4FF3F] transition-colors"
                  style={{ background: "rgba(245,241,232,0.04)" }}
                >
                  <span className="de-smallcaps text-[10px]">Забронировать стол</span>
                  <ArrowUpRight className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                </a>
                <span className="de-smallcaps text-[9px] opacity-50">
                  Бронь подтверждается в течение 15 минут
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="relative z-10">
        <div className="max-w-[1180px] mx-auto px-10 pt-20 pb-10">
          {/* gigantic word as masthead */}
          <div
            className="de-serif font-light tracking-[-0.04em] leading-none mb-12"
            style={{ fontSize: "clamp(160px, 22vw, 280px)", color: "#F5F1E8" }}
          >
            Гри<span style={{ color: "#D4FF3F" }}>з</span>ли
            <span className="de-serif italic font-extralight opacity-60"> .</span>
          </div>

          <div className="grid grid-cols-12 gap-8 pt-12 border-t de-hair">
            <div className="col-span-4">
              <div className="de-smallcaps text-[10px] opacity-50 mb-3">Адрес</div>
              <div className="de-serif text-[20px] leading-snug">
                ул. Новосёлов&nbsp;92<br />
                Тюмень, 625000
              </div>
              <div className="mt-4 flex items-center gap-2 de-smallcaps text-[10px] opacity-70">
                <MapPin className="w-3 h-3" style={{ color: "#D4FF3F" }} />
                <a href="#" className="de-link-underline">Открыть на карте</a>
              </div>
            </div>

            <div className="col-span-3">
              <div className="de-smallcaps text-[10px] opacity-50 mb-3">Контакты</div>
              <a
                href="tel:+73452550792"
                className="de-serif text-[20px] flex items-center gap-2"
                style={{ color: "#F5F1E8" }}
              >
                <Phone className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                <span className="de-num">+7 (3452) 55-07-92</span>
              </a>
              <div className="mt-4 de-smallcaps text-[10px] opacity-70 de-num">
                Ежедневно · 16:00 — 02:00
              </div>
            </div>

            <div className="col-span-3">
              <div className="de-smallcaps text-[10px] opacity-50 mb-3">Соцсети</div>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="flex items-center gap-3 de-serif text-[16px] opacity-90 hover:opacity-100">
                  <Instagram className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                  <span>instagram</span>
                  <span className="de-smallcaps text-[9px] opacity-50">@grizli.tmn</span>
                </a>
                <a href="#" className="flex items-center gap-3 de-serif text-[16px] opacity-90 hover:opacity-100">
                  <Send className="w-4 h-4" style={{ color: "#D4FF3F" }} />
                  <span>telegram</span>
                  <span className="de-smallcaps text-[9px] opacity-50">@grizli_tmn</span>
                </a>
                <a href="#" className="flex items-center gap-3 de-serif text-[16px] opacity-90 hover:opacity-100">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-[3px] text-[9px] font-bold"
                    style={{ background: "#D4FF3F", color: "#0A0A0A" }}
                  >
                    Vk
                  </span>
                  <span>vk</span>
                  <span className="de-smallcaps text-[9px] opacity-50">/grizli.tmn</span>
                </a>
              </div>
            </div>

            <div className="col-span-2">
              <div className="de-smallcaps text-[10px] opacity-50 mb-3">Колофон</div>
              <p className="text-[11px] opacity-60 leading-relaxed">
                Дизайн и вёрстка — студия Гризли, Тюмень. Издание №&nbsp;06.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t de-hair flex items-center justify-between de-smallcaps text-[10px] opacity-50">
            <span>© 2021 — 2026 Гризли · Лаунж-бар</span>
            <span className="de-num">18+ · Курение вредит вашему здоровью</span>
            <span>Сделано в Тюмени</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
