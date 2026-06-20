import { Link } from "wouter";
import { Clock, GlassWater, Instagram, MapPin, Phone, Send } from "lucide-react";
import logoDefault from "@/assets/images/logo.jpeg";
import { useSiteSettings, imgSrc } from "@/hooks/useSiteSettings";
import { NEON_NAV_LINKS } from "@/components/NeonNav";

export default function NeonFooter() {
  const { brand, contacts, schedule, footer, images } = useSiteSettings();
  const logo = imgSrc(images, "logo", logoDefault);
  const phoneClean = contacts.phone.replace(/[^\d+]/g, "");

  return (
    <footer className="relative bg-[#050505] border-t border-[#D4FF3F]/20 gn-root">
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
              {NEON_NAV_LINKS.map(n => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-[#D4FF3F] transition">{n.label}</Link>
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
  );
}
