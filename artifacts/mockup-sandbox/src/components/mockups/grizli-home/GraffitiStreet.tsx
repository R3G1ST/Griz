import './_group.css';
import {
  MapPin, Clock, Phone, Instagram, Send, ArrowUpRight, Flame, Wine, Sandwich,
  Star, ChevronRight, Sparkles
} from 'lucide-react';

const LIME = '#D4FF3F';
const CREAM = '#F5F1E8';

function ClawScratch({ className = '', rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg viewBox="0 0 220 120" className={className} style={{ transform: `rotate(${rotate}deg)` }}>
      <g stroke={LIME} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M10 30 C 80 10, 140 60, 210 20" opacity="0.9" />
        <path d="M14 60 C 84 40, 144 90, 214 50" opacity="0.75" />
        <path d="M18 92 C 88 72, 148 118, 218 80" opacity="0.55" />
      </g>
    </svg>
  );
}

function TornDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 1280 30" preserveAspectRatio="none" className="block w-full h-[30px]"
         style={{ transform: flip ? 'scaleY(-1)' : 'none' }}>
      <path d="M0 0 L0 18 L40 12 L80 22 L130 8 L180 24 L240 14 L300 26 L360 10 L420 22 L480 6 L540 20 L610 12 L680 28 L740 14 L810 22 L870 8 L930 24 L990 12 L1050 26 L1110 14 L1170 22 L1230 10 L1280 20 L1280 0 Z"
            fill="#0A0A0A" />
    </svg>
  );
}

function Sticker({
  children, rotate = -3, className = '', tone = 'lime',
}: { children: React.ReactNode; rotate?: number; className?: string; tone?: 'lime' | 'cream' | 'black' }) {
  const bg = tone === 'lime' ? '#D4FF3F' : tone === 'cream' ? '#F5F1E8' : '#0A0A0A';
  const fg = tone === 'black' ? '#D4FF3F' : '#0A0A0A';
  return (
    <div
      className={`inline-block px-3 py-1 text-xs uppercase ${className}`}
      style={{
        background: bg, color: fg, transform: `rotate(${rotate}deg)`,
        fontFamily: "'Archivo Black', sans-serif",
        boxShadow: '3px 3px 0 #000', letterSpacing: '0.08em',
        border: tone === 'black' ? `1.5px solid ${LIME}` : '1.5px solid #000',
      }}
    >{children}</div>
  );
}

function TapeLabel({ children, rotate = -2, className = '' }: { children: React.ReactNode; rotate?: number; className?: string }) {
  return (
    <div
      className={`gs-tape-cream inline-block px-4 py-1.5 text-[11px] uppercase text-black ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        fontFamily: "'Special Elite', monospace",
        letterSpacing: '0.15em',
      }}
    >{children}</div>
  );
}

function MarkerTag({ children, className = '', size = 'text-2xl' }: { children: React.ReactNode; className?: string; size?: string }) {
  return (
    <span
      className={`${size} ${className}`}
      style={{ fontFamily: "'Permanent Marker', cursive", color: LIME }}
    >{children}</span>
  );
}

export function GraffitiStreet() {
  return (
    <div
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{ fontFamily: "'Bebas Neue', sans-serif", color: CREAM }}
    >
      {/* Spray scatter background layer */}
      <div className="absolute inset-0 gs-spray pointer-events-none opacity-60" />
      <div className="absolute inset-0 gs-noise pointer-events-none opacity-30" />

      {/* ============ NAV ============ */}
      <nav className="relative z-30 flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <img src="/__mockup/images/logo.jpeg" alt="Гризли" className="h-12 w-12 object-cover rounded-sm" />
          <div className="leading-none">
            <div style={{ fontFamily: "'Permanent Marker', cursive", color: LIME }} className="text-3xl tracking-wider">ГРИЗЛИ</div>
            <div className="text-[10px] tracking-[0.35em] text-[#888]">ЛАУНЖ · БАР · ТЮМЕНЬ</div>
          </div>
        </div>
        <div className="flex items-center gap-7 text-sm tracking-[0.2em] uppercase">
          {['Меню', 'Кальяны', 'Бар', 'Бронь', 'Лояльность'].map((l, i) => (
            <a key={l} href="#" className="relative group" style={{ color: i === 0 ? LIME : CREAM }}>
              {l}
              <span className="absolute -bottom-1 left-0 right-0 h-[2px]" style={{ background: i === 0 ? LIME : 'transparent' }} />
            </a>
          ))}
        </div>
        <a
          href="#"
          className="group inline-flex items-center gap-2 px-5 py-3 text-sm uppercase tracking-[0.2em]"
          style={{
            background: LIME, color: '#000',
            fontFamily: "'Archivo Black', sans-serif",
            boxShadow: '4px 4px 0 #000',
          }}
        >
          Забронировать стол <ArrowUpRight className="w-4 h-4" />
        </a>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative px-8 pt-16 pb-24 overflow-hidden">
        {/* hero background image, heavily darkened */}
        <div className="absolute inset-0 z-0">
          <img src="/__mockup/images/hero-bg.png" alt="" className="w-full h-full object-cover opacity-40"
               style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.45)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)' }} />
        </div>

        {/* halftone bar */}
        <div className="absolute top-12 right-0 w-[420px] h-[420px] gs-halftone opacity-30 pointer-events-none" />

        {/* claw scratches */}
        <ClawScratch className="absolute top-24 left-8 w-[280px] opacity-70 pointer-events-none" rotate={-12} />
        <ClawScratch className="absolute bottom-32 right-12 w-[360px] opacity-60 pointer-events-none" rotate={18} />

        <div className="relative z-10 max-w-[1180px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sticker rotate={-4}>Underground · 2014</Sticker>
            <TapeLabel rotate={2}>Сезон V — лес, дым, дерзость</TapeLabel>
            <div className="flex items-center gap-1.5 text-[11px] tracking-[0.3em] uppercase" style={{ color: LIME }}>
              <span className="w-2 h-2 rounded-full gs-flicker" style={{ background: LIME, boxShadow: `0 0 10px ${LIME}` }} />
              Открыто сейчас
            </div>
          </div>

          <h1
            className="leading-[0.82] tracking-tight"
            style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(80px, 14vw, 200px)', color: CREAM }}
          >
            ГРИ<span style={{ color: LIME }}>ЗЛИ</span>
            <br />
            <span className="gs-text-stroke" style={{ fontSize: '0.55em' }}>ЛАУНЖ-БАР</span>
            <span style={{ fontFamily: "'Permanent Marker', cursive", color: LIME, fontSize: '0.45em' }} className="ml-4 inline-block -rotate-3">
              в Тюмени.
            </span>
          </h1>

          <div className="mt-10 grid grid-cols-12 gap-8 items-end">
            <div className="col-span-7">
              <p className="text-xl tracking-wide" style={{ fontFamily: "'Special Elite', monospace", color: CREAM }}>
                премиальные кальяны · авторские коктейли · до 02:00 — без музыкальных компромиссов и пустых слов.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-8 py-5 uppercase text-base tracking-[0.18em]"
                  style={{
                    background: LIME, color: '#000',
                    fontFamily: "'Archivo Black', sans-serif",
                    boxShadow: '6px 6px 0 #000, 6px 6px 0 1.5px ' + LIME,
                  }}
                >
                  Забронировать стол <ArrowUpRight className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-8 py-5 uppercase text-base tracking-[0.18em] border-2"
                  style={{ borderColor: CREAM, color: CREAM, fontFamily: "'Archivo Black', sans-serif" }}
                >
                  Меню <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="col-span-5 relative">
              {/* big bear-skull cutout */}
              <div className="relative">
                <div className="absolute -inset-4 gs-halftone opacity-50" />
                <img
                  src="/__mockup/images/bear-skull.png"
                  alt="bear"
                  className="relative w-full max-h-[300px] object-contain"
                  style={{ filter: `drop-shadow(0 0 30px ${LIME}55)`, transform: 'rotate(-4deg)' }}
                />
                <Sticker rotate={6} className="absolute -top-2 -right-2" tone="cream">№ 092 · Новосёлов</Sticker>
              </div>
            </div>
          </div>
        </div>

        {/* Address strip */}
        <div className="relative z-10 mt-16 max-w-[1180px] mx-auto">
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: '#0A0A0A', border: `1.5px solid ${LIME}`, boxShadow: `inset 0 0 0 4px #000` }}
          >
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em]" style={{ color: LIME }}>
              <MapPin className="w-4 h-4" /> ул. Новосёлов 92
            </div>
            <div className="text-[#444]">●</div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#F5F1E8]">
              <Clock className="w-4 h-4" /> ежедневно 16:00 — 02:00
            </div>
            <div className="text-[#444]">●</div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#F5F1E8]">
              <Phone className="w-4 h-4" /> +7 (3452) 55-92-92
            </div>
          </div>
        </div>
      </section>

      <TornDivider />

      {/* ============ КАЛЬЯН НЕДЕЛИ ============ */}
      <section className="relative px-8 py-24 bg-[#0A0A0A]">
        <div className="absolute top-12 left-12 -rotate-6">
          <MarkerTag size="text-5xl">кальян недели →</MarkerTag>
        </div>
        <div className="absolute -right-6 top-20 rotate-12 gs-tape px-8 py-2 text-xs uppercase tracking-[0.3em] text-black"
             style={{ fontFamily: "'Archivo Black', sans-serif" }}>
          hot · pick · hot · pick · hot · pick
        </div>

        <div className="max-w-[1180px] mx-auto mt-20 grid grid-cols-12 gap-6 items-stretch">
          {/* photo card */}
          <div className="col-span-7 relative" style={{ transform: 'rotate(-1.5deg)' }}>
            <div className="absolute -top-4 left-8 z-20">
              <TapeLabel rotate={-3}>экспонат № 17</TapeLabel>
            </div>
            <div
              className="relative h-[460px] overflow-hidden"
              style={{ border: '3px solid #F5F1E8', boxShadow: '10px 10px 0 #000, 10px 10px 0 4px ' + LIME }}
            >
              <img
                src="/__mockup/images/cocktail.png"
                alt="mix"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(40%) contrast(1.15) brightness(0.7)' }}
              />
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 70% 30%, ${LIME}22, transparent 60%)` }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between"
                   style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.9))' }}>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em]" style={{ color: LIME }}>микс шеф-мастера</div>
                  <div className="text-5xl mt-1" style={{ fontFamily: "'Archivo Black', sans-serif", color: CREAM }}>
                    ТАЁЖНЫЙ ХЛЫСТ
                  </div>
                </div>
                <Sticker rotate={4} tone="lime">x4 силы</Sticker>
              </div>
            </div>
          </div>

          {/* info side */}
          <div className="col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#888]">состав микса</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Кедровая шишка', 'Чёрная смородина', 'Хвоя · ментол', 'Дикий мёд'].map(c => (
                  <span key={c}
                    className="px-3 py-2 text-sm uppercase tracking-wider"
                    style={{
                      border: `1.5px solid ${LIME}`, color: CREAM,
                      fontFamily: "'Special Elite', monospace",
                      background: '#0A0A0A',
                    }}>
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-[#bdb9ad]"
                 style={{ fontFamily: "'Special Elite', monospace" }}>
                Дымный лес, который ударяет в грудь. Берёзовый уголь, индийский лист на 40 граммах. Для тех, кто не ищет лёгких путей.
              </p>
            </div>

            <div className="mt-8 relative">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-[#888]">цена</div>
                  <div className="leading-none mt-1" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                    <span className="text-base align-top text-[#888]">от</span>
                    <span className="text-7xl ml-2" style={{ color: LIME }}>1 800</span>
                    <span className="text-3xl ml-1" style={{ color: CREAM }}>₽</span>
                  </div>
                </div>
                <a href="#"
                   className="inline-flex items-center gap-2 px-6 py-4 uppercase text-base tracking-[0.18em]"
                   style={{
                     background: CREAM, color: '#000',
                     fontFamily: "'Archivo Black', sans-serif",
                     boxShadow: '5px 5px 0 ' + LIME + ', 5px 5px 0 1.5px #000',
                     transform: 'rotate(-2deg)',
                   }}>
                  Хочу этот <Flame className="w-5 h-5" />
                </a>
              </div>
              <ClawScratch className="absolute -bottom-10 -right-4 w-[180px] opacity-50" rotate={-20} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ МЕНЮ ГРИД ============ */}
      <section className="relative px-8 py-24" style={{ background: '#0A0A0A' }}>
        <div className="absolute inset-0 gs-spray opacity-40 pointer-events-none" />
        <div className="max-w-[1180px] mx-auto relative">
          <div className="flex items-end justify-between mb-12">
            <h2 className="leading-[0.85]" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '90px', color: CREAM }}>
              МЕНЮ — <span className="gs-text-stroke">3 ОТСЕКА</span>
            </h2>
            <TapeLabel rotate={3}>обновлено вчера</TapeLabel>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              {
                title: 'КАЛЬЯНЫ',
                icon: <Flame className="w-6 h-6" />,
                rotate: -1.5,
                items: [
                  ['Классика на молоке', '1 400 ₽'],
                  ['Виноградный сорт', '1 600 ₽'],
                  ['Таёжный хлыст', '1 800 ₽'],
                  ['VIP · фруктовая чаша', '2 400 ₽'],
                ],
              },
              {
                title: 'АВТ. КОКТЕЙЛИ',
                icon: <Wine className="w-6 h-6" />,
                rotate: 1.5,
                items: [
                  ['Когти Гризли · копч.виски', '720 ₽'],
                  ['Чёрный мёд', '640 ₽'],
                  ['Сосновая смола', '680 ₽'],
                  ['Анти-Эспрессо', '590 ₽'],
                ],
              },
              {
                title: 'ЗАКУСКИ',
                icon: <Sandwich className="w-6 h-6" />,
                rotate: -1,
                items: [
                  ['Тартар из говядины', '690 ₽'],
                  ['Сырная доска', '880 ₽'],
                  ['Крылья BBQ · 8 шт', '540 ₽'],
                  ['Орех в карамели', '320 ₽'],
                ],
              },
            ].map((col, idx) => (
              <div
                key={col.title}
                className="relative p-6 pb-8"
                style={{
                  background: idx === 1 ? CREAM : '#141414',
                  color: idx === 1 ? '#000' : CREAM,
                  border: '2px solid #000',
                  boxShadow: '6px 6px 0 ' + LIME,
                  transform: `rotate(${col.rotate}deg)`,
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span style={{ color: idx === 1 ? '#000' : LIME }}>{col.icon}</span>
                    <h3 className="text-3xl" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{col.title}</h3>
                  </div>
                  <span className="text-xs tracking-[0.25em]" style={{ fontFamily: "'Special Elite', monospace" }}>0{idx + 1}/03</span>
                </div>
                <ul className="space-y-3">
                  {col.items.map(([name, price]) => (
                    <li key={name} className="flex items-baseline gap-2 border-b border-dashed pb-2"
                        style={{ borderColor: idx === 1 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)' }}>
                      <span className="text-base" style={{ fontFamily: "'Special Elite', monospace" }}>{name}</span>
                      <span className="flex-1 border-b border-dotted self-end mb-1.5"
                            style={{ borderColor: idx === 1 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)' }} />
                      <span className="text-lg" style={{ fontFamily: "'Archivo Black', sans-serif", color: idx === 1 ? '#000' : LIME }}>{price}</span>
                    </li>
                  ))}
                </ul>
                <a href="#"
                   className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em]"
                   style={{ color: idx === 1 ? '#000' : LIME, fontFamily: "'Archivo Black', sans-serif" }}>
                  смотреть всё <ChevronRight className="w-4 h-4" />
                </a>
                {idx === 0 && (
                  <Sticker rotate={-8} className="absolute -top-3 -left-3" tone="lime">топ</Sticker>
                )}
                {idx === 2 && (
                  <Sticker rotate={6} className="absolute -bottom-3 -right-3" tone="black">+ горячее</Sticker>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ЛОЯЛЬНОСТЬ ============ */}
      <section className="relative px-8 py-24 overflow-hidden" style={{ background: '#0A0A0A' }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 gs-halftone opacity-20" />
        </div>

        <div className="max-w-[1180px] mx-auto relative">
          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <Sticker rotate={-3} tone="lime">программа лояльности · v.2</Sticker>
                <MarkerTag size="text-3xl" className="-rotate-3">бамбук →</MarkerTag>
              </div>
              <h2 className="leading-[0.85]" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '88px', color: CREAM }}>
                НАКОПИ <span style={{ color: LIME }}>БАМБУК</span><br />
                — ПОЛУЧИ <span className="gs-text-stroke">КАЛЬЯН</span> В ПОДАРОК
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#bdb9ad]"
                 style={{ fontFamily: "'Special Elite', monospace" }}>
                10 визитов = 1 фирменный кальян за наш счёт. Карта в Telegram, начисление по QR. Никаких пластиковых брелков и приложений с рекламой.
              </p>

              {/* Progress strip */}
              <div className="mt-10">
                <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-[0.25em]">
                  <span style={{ color: CREAM }}>прогресс · 7 / 10</span>
                  <span style={{ color: LIME }}>осталось 3</span>
                </div>
                <div className="relative h-10 border-2 border-[#F5F1E8] bg-[#141414]"
                     style={{ boxShadow: '5px 5px 0 #000' }}>
                  <div className="absolute inset-y-0 left-0 flex"
                       style={{ width: '70%', background: `repeating-linear-gradient(45deg, ${LIME} 0 12px, #B8E945 12px 24px)` }}>
                  </div>
                  <div className="absolute inset-0 flex justify-between px-2 items-center">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i}
                           className="w-6 h-6 flex items-center justify-center text-xs"
                           style={{
                             background: i < 7 ? '#0A0A0A' : '#141414',
                             border: `1.5px solid ${i < 7 ? '#000' : '#444'}`,
                             color: i < 7 ? LIME : '#555',
                             fontFamily: "'Archivo Black', sans-serif",
                           }}>
                        {i < 7 ? '✓' : i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <a href="#"
                   className="inline-flex items-center gap-2 px-7 py-4 uppercase text-base tracking-[0.18em]"
                   style={{
                     background: LIME, color: '#000',
                     fontFamily: "'Archivo Black', sans-serif",
                     boxShadow: '5px 5px 0 #000',
                   }}>
                  Активировать карту <Sparkles className="w-5 h-5" />
                </a>
                <span className="text-xs uppercase tracking-[0.25em] text-[#888]"
                      style={{ fontFamily: "'Special Elite', monospace" }}>
                  без смс, без push, без бредятины
                </span>
              </div>
            </div>

            {/* Bamboo card mock */}
            <div className="col-span-5 relative">
              <div className="relative" style={{ transform: 'rotate(4deg)' }}>
                <div
                  className="relative w-full aspect-[1.6/1] p-6 flex flex-col justify-between"
                  style={{
                    background: '#0A0A0A',
                    border: `2px solid ${LIME}`,
                    boxShadow: '12px 12px 0 ' + CREAM + ', 12px 12px 0 4px #000',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#888]">бамбук · карта</div>
                      <div className="text-5xl mt-1" style={{ fontFamily: "'Archivo Black', sans-serif", color: LIME }}>ГРИЗЛИ</div>
                    </div>
                    <img src="/__mockup/images/logo.jpeg" alt="" className="w-14 h-14 rounded-sm" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: "'Special Elite', monospace", color: CREAM }}>
                      <div>#0092 · alex k.</div>
                      <div className="text-[#666] text-[10px] mt-1">с 03.2024 · tg @grizli_bar</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#888]">бамбук</div>
                      <div className="text-4xl" style={{ fontFamily: "'Archivo Black', sans-serif", color: LIME }}>×7</div>
                    </div>
                  </div>
                </div>
                <Sticker rotate={-12} className="absolute -top-4 -left-4" tone="lime">vip · 2024</Sticker>
                <TapeLabel rotate={6} className="absolute -bottom-3 right-8">не делиться</TapeLabel>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TornDivider flip />

      {/* ============ АТМОСФЕРА ============ */}
      <section className="relative px-8 py-24" style={{ background: '#000' }}>
        <div className="max-w-[1180px] mx-auto relative">
          <div className="flex items-end justify-between mb-10">
            <h2 className="leading-[0.85]" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '110px', color: CREAM }}>
              АТМО<span style={{ color: LIME }}>СФЕРА</span>
            </h2>
            <MarkerTag size="text-4xl" className="-rotate-2 mb-4">наша территория</MarkerTag>
          </div>

          <div className="relative">
            <div className="relative h-[560px] overflow-hidden"
                 style={{ border: '3px solid ' + CREAM, boxShadow: '14px 14px 0 ' + LIME + ', 14px 14px 0 5px #000' }}>
              <img
                src="/__mockup/images/interior.png"
                alt="интерьер"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(35%) contrast(1.1) brightness(0.65)' }}
              />
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)' }} />

              {/* spray-dots overlay */}
              <div className="absolute inset-0 gs-spray opacity-50 pointer-events-none" />

              {/* Quote sticker */}
              <div className="absolute top-10 left-10 max-w-md p-6"
                   style={{
                     background: CREAM, color: '#000',
                     transform: 'rotate(-3deg)',
                     boxShadow: '6px 6px 0 #000',
                     fontFamily: "'Special Elite', monospace",
                   }}>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-black" />)}
                </div>
                <p className="text-[15px] leading-relaxed">
                  «Это не очередной "лаунж". Это берлога — тёплая, чёрная, своя. Дым стелется как туман над лесом. Лучшие пятницы в городе.»
                </p>
                <div className="mt-3 text-xs uppercase tracking-[0.25em]">— Алексей К. · ВК</div>
              </div>

              {/* CTA */}
              <div className="absolute bottom-10 right-10 flex items-center gap-4">
                <span className="text-xs uppercase tracking-[0.25em]"
                      style={{ color: CREAM, fontFamily: "'Special Elite', monospace" }}>
                  свободные столы на сегодня · 4
                </span>
                <a href="#"
                   className="inline-flex items-center gap-2 px-7 py-4 uppercase text-base tracking-[0.18em]"
                   style={{
                     background: LIME, color: '#000',
                     fontFamily: "'Archivo Black', sans-serif",
                     boxShadow: '5px 5px 0 #000',
                   }}>
                  Забронировать стол <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>

              <ClawScratch className="absolute top-1/3 right-12 w-[260px] opacity-70" rotate={32} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative px-8 pt-20 pb-10" style={{ background: '#0A0A0A', borderTop: `2px solid ${LIME}` }}>
        <div className="absolute inset-0 gs-spray opacity-30 pointer-events-none" />
        <div className="max-w-[1180px] mx-auto relative">

          {/* Giant wordmark watermark */}
          <div
            className="absolute -top-4 right-0 pointer-events-none select-none"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: '180px', lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: `1.5px ${LIME}33`,
            }}
          >
            GRIZLI
          </div>

          <div className="relative grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <img src="/__mockup/images/logo.jpeg" alt="" className="w-14 h-14 rounded-sm" />
                <div>
                  <div style={{ fontFamily: "'Permanent Marker', cursive", color: LIME }} className="text-4xl leading-none">ГРИЗЛИ</div>
                  <div className="text-[10px] tracking-[0.35em] text-[#888]">ЛАУНЖ · БАР · ТЮМЕНЬ</div>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-[#999] max-w-sm"
                 style={{ fontFamily: "'Special Elite', monospace" }}>
                Подпольный лаунж для своих. С 2014 года кормим дымом, поим коктейлями и не задаём вопросов.
              </p>
            </div>

            <div className="col-span-3">
              <div className="text-xs uppercase tracking-[0.3em]" style={{ color: LIME }}>координаты</div>
              <ul className="mt-4 space-y-2 text-sm" style={{ fontFamily: "'Special Elite', monospace", color: CREAM }}>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" />ул. Новосёлов 92, Тюмень</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4" />ежедневно 16:00 — 02:00</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" />+7 (3452) 55-92-92</li>
              </ul>
            </div>

            <div className="col-span-4">
              <div className="text-xs uppercase tracking-[0.3em]" style={{ color: LIME }}>соцсети</div>
              <div className="mt-4 flex gap-3">
                {[
                  { icon: <Instagram className="w-5 h-5" />, label: '@grizli.tmn' },
                  { icon: <Send className="w-5 h-5" />, label: 'tg @grizli_bar' },
                  { icon: <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="text-sm">VK</span>, label: 'vk.com/grizli' },
                ].map((s, i) => (
                  <a key={i} href="#"
                     className="inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                     style={{
                       background: '#141414', color: CREAM,
                       border: `1.5px solid ${LIME}`,
                       fontFamily: "'Special Elite', monospace",
                       transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)`,
                     }}>
                    <span style={{ color: LIME }}>{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </div>

              <a href="#"
                 className="mt-6 inline-flex items-center gap-2 px-6 py-3 uppercase text-sm tracking-[0.2em]"
                 style={{
                   background: LIME, color: '#000',
                   fontFamily: "'Archivo Black', sans-serif",
                   boxShadow: '4px 4px 0 #000',
                 }}>
                Забронировать стол <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="relative mt-16 pt-6 border-t border-[#1A1A1A] flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-[#666]"
               style={{ fontFamily: "'Special Elite', monospace" }}>
            <span>© 2014–2026 ГРИЗЛИ · все права в берлоге</span>
            <span>18+ · курение вредит · мы предупредили</span>
            <span>made on the streets of Тюмень</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
