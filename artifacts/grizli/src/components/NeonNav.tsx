import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Menu as MenuIcon, X } from "lucide-react";
import logoDefault from "@/assets/images/logo.jpeg";
import { useSiteSettings, imgSrc } from "@/hooks/useSiteSettings";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export const NEON_NAV_LINKS: { label: string; href: string }[] = [
  { label: "Меню",        href: "/menu" },
  { label: "Галерея",     href: "/gallery" },
  { label: "Бронь",       href: "/booking" },
  { label: "Отзывы",      href: "/reviews" },
  { label: "Лояльность",  href: "/loyalty" },
  { label: "Контакты",    href: "/card" },
];

export default function NeonNav() {
  const { brand, contacts, schedule, images } = useSiteSettings();
  const logo = imgSrc(images, "logo", logoDefault);
  const hoursToday = schedule[0]?.hours ?? "16:00 — 02:00";
  const phoneClean = contacts.phone.replace(/[^\d+]/g, "");

  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      toggleRef.current?.focus();
    };
  }, [mobileOpen]);

  useFocusTrap(mobileOpen, dialogRef);

  // Close mobile menu when route changes.
  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <header className="relative z-40 gn-root">
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

        <nav className="hidden md:flex items-center gap-1 gn-glass rounded-full px-2 py-1.5" aria-label="Основная навигация">
          {NEON_NAV_LINKS.map(n => {
            const active = location === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-4 py-2 text-[12px] tracking-[0.16em] uppercase rounded-full transition ${
                  active
                    ? "bg-[#D4FF3F]/15 text-[#D4FF3F]"
                    : "text-[#F5F1E8]/75 hover:text-[#D4FF3F] hover:bg-[#D4FF3F]/5"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/55">{hoursToday}</span>
          <Link
            href="/booking"
            className="hidden sm:inline-flex gn-cta rounded-full px-4 sm:px-5 py-2.5 text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-semibold items-center gap-2"
          >
            Забронировать
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a href={`tel:${phoneClean}`} className="sm:hidden text-[#D4FF3F]" aria-label={`Позвонить ${contacts.phone}`}>
            <ArrowRight className="w-5 h-5" />
          </a>
          <button
            ref={toggleRef}
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
          ref={dialogRef as React.RefObject<HTMLElement>}
          id="gn-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Главная навигация"
          className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 overflow-y-auto py-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)] px-6"
        >
          <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-6 text-white" aria-label="Закрыть меню">
            <X className="w-8 h-8" />
          </button>
          {NEON_NAV_LINKS.map(n => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              className={`gn-display text-3xl tracking-tight hover:text-[#D4FF3F] transition ${
                location === n.href ? "text-[#D4FF3F]" : "gn-neon-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className="mt-4 gn-cta rounded-full px-7 py-4 text-[12px] tracking-[0.18em] uppercase font-semibold"
          >
            Забронировать стол
          </Link>
        </nav>
      )}
    </header>
  );
}
