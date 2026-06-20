import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowUpRight, MapPin, Phone, Clock, Send, Star } from "lucide-react";
import logoDefault from "@/assets/images/logo.jpeg";
import { useSiteSettings, imgSrc } from "@/hooks/useSiteSettings";

/**
 * Visit card / contacts page. Designed for showing on a phone or printing —
 * intentionally NOT using NeonPage so it stays a single self-contained card.
 */
export default function Card() {
  const { brand, contacts, schedule, images } = useSiteSettings();
  const logo = imgSrc(images, "logo", logoDefault);
  const siteUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
  const phoneClean = contacts.phone.replace(/[^\d+]/g, "");
  const mapHref = contacts.mapUrl || `https://yandex.ru/maps/?text=${encodeURIComponent(contacts.address)}`;
  const mapEmbed =
    "https://yandex.ru/map-widget/v1/?ll=65.6015%2C57.1130&z=15&mode=search&" +
    `text=${encodeURIComponent(contacts.address)}`;

  return (
    <main className="min-h-screen bg-black text-white gn-root gn-sans relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 gn-smoke opacity-70" />
      <div className="absolute inset-0 gn-grid opacity-40" />
      <div className="absolute inset-0 gn-scan opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="gn-glass-lime gn-corner rounded-2xl p-7 sm:p-8 flex flex-col items-center gap-6">
          <span className="c1" /><span className="c2" />

          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden gn-neon-box border border-[#D4FF3F]/50">
              <img src={logo} alt={brand.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h1 className="gn-display text-4xl gn-neon tracking-tight">{brand.name}</h1>
              <p className="gn-mono text-[10px] uppercase tracking-[0.32em] text-[#F5F1E8]/55 mt-1.5">
                Кальянная · {brand.city}
              </p>
            </div>
          </div>

          <div className="gn-divider w-full opacity-60" />

          {/* Contacts */}
          <div className="w-full space-y-3 text-[14px]">
            <a href={`tel:${phoneClean}`} className="flex items-center gap-3 text-[#F5F1E8]/85 hover:text-[#D4FF3F] transition">
              <Phone className="w-4 h-4 text-[#D4FF3F] shrink-0" />
              <span>{contacts.phone}</span>
            </a>
            <div className="flex items-start gap-3 text-[#F5F1E8]/85">
              <MapPin className="w-4 h-4 text-[#D4FF3F] shrink-0 mt-0.5" />
              <span>{contacts.address}</span>
            </div>
            <div className="flex items-start gap-3 text-[#F5F1E8]/85">
              <Clock className="w-4 h-4 text-[#D4FF3F] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {schedule.map(s => (
                  <div key={s.days}>
                    <span className="text-[#F5F1E8]/55">{s.days}:</span> {s.hours}
                  </div>
                ))}
              </div>
            </div>
            {contacts.telegram && (
              <a
                href={contacts.telegram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#F5F1E8]/85 hover:text-[#D4FF3F] transition"
              >
                <Send className="w-4 h-4 text-[#D4FF3F] shrink-0" />
                <span>Telegram</span>
              </a>
            )}
          </div>

          {/* Map with neon frame */}
          <div className="w-full gn-neon-box rounded-xl overflow-hidden bg-black">
            <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
              <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#D4FF3F]/30 rounded-lg flex flex-col items-center justify-center gap-4 p-6">
                  <MapPin className="w-16 h-16 text-[#D4FF3F]" />
                  <div className="text-center">
                    <div className="gn-mono text-[11px] tracking-[0.2em] text-[#F5F1E8]/70 uppercase mb-2">Мы находимся здесь</div>
                    <div className="text-[#F5F1E8] text-sm mb-1">Тюмень, ул. Новосёлов, 92</div>
                    <div className="text-[#D4FF3F]/60 text-xs mb-4">Гризли · Лаунж-бар</div>
                    <a href={mapHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 gn-mono text-[11px] tracking-[0.18em] text-[#D4FF3F] border border-[#D4FF3F]/40 px-5 py-2.5 hover:bg-[#D4FF3F]/10 transition uppercase">
                      Открыть на карте
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute top-1.5 left-1.5  w-3 h-3 border-t-2 border-l-2 border-[#D4FF3F]" />
                <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4FF3F]" />
                <span className="absolute bottom-1.5 left-1.5  w-3 h-3 border-b-2 border-l-2 border-[#D4FF3F]" />
                <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4FF3F]" />
              </div>
            </div>
            <a
              href={mapHref} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#D4FF3F]/8 hover:bg-[#D4FF3F]/15 border-t border-[#D4FF3F]/30 transition"
            >
              <span className="gn-mono text-[10px] tracking-[0.24em] text-[#D4FF3F]">Маршрут</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4FF3F]" />
            </a>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3 rounded-md gn-neon-box">
              <QRCodeSVG
                value={siteUrl}
                size={140}
                bgColor="#ffffff"
                fgColor="#0A0A0A"
                level="M"
                imageSettings={{ src: logo, x: undefined, y: undefined, height: 28, width: 28, excavate: true }}
              />
            </div>
            <p className="gn-mono text-[10px] uppercase tracking-[0.28em] text-[#F5F1E8]/55">Наш сайт</p>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <a href={`${siteUrl}/booking`} className="gn-cta rounded-full text-center font-semibold uppercase tracking-[0.18em] py-3 text-[11px]">
              Бронь
            </a>
            <a href={`${siteUrl}/reviews`} className="gn-cta-ghost rounded-full text-center font-medium uppercase tracking-[0.18em] py-3 text-[11px] inline-flex items-center justify-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Отзыв
            </a>
          </div>
        </div>
        <p className="text-center gn-mono text-[#F5F1E8]/30 text-[10px] tracking-[0.28em] uppercase mt-4">
          © {new Date().getFullYear()} {brand.name} HOOKAH LOUNGE
        </p>
      </motion.div>
    </main>
  );
}
