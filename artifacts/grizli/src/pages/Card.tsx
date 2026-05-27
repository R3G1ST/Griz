import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Phone, Clock, Send, Star } from "lucide-react";
import logo from "@/assets/images/logo.jpeg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Card() {
  const { contacts, schedule } = useSiteSettings();
  const siteUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative">
      <div className="bg-noise" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <div className="bg-neutral-950 border border-white/10 p-8 flex flex-col items-center gap-6 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="ГРИЗЛИ" className="w-20 h-20 object-contain rounded-full border border-primary/30 shadow-glow" />
            <div className="text-center">
              <h1 className="text-3xl font-serif text-white uppercase tracking-widest">ГРИЗЛИ</h1>
              <p className="text-primary text-xs uppercase tracking-[0.3em] mt-1">Кальянная — Тюмень</p>
            </div>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="w-full space-y-3 text-sm">
            <a href={`tel:${contacts.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{contacts.phone}</span>
            </a>
            <div className="flex items-start gap-3 text-gray-300">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{contacts.address}</span>
            </div>
            <div className="flex items-start gap-3 text-gray-300">
              <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {schedule.map(s => (
                  <div key={s.days}>{s.days}: {s.hours}</div>
                ))}
              </div>
            </div>
            {contacts.telegram && (
              <a href={contacts.telegram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                <Send className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Telegram</span>
              </a>
            )}
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3">
              <QRCodeSVG value={siteUrl} size={140} bgColor="#ffffff" fgColor="#000000" level="M"
                imageSettings={{ src: logo, x: undefined, y: undefined, height: 28, width: 28, excavate: true }} />
            </div>
            <p className="text-xs text-gray-600 uppercase tracking-widest text-center">Наш сайт</p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <a href={`${siteUrl}/booking`}
              className="bg-primary text-black text-center font-bold uppercase tracking-widest py-3 text-xs hover:bg-primary/80 transition-colors shadow-glow">
              Бронь
            </a>
            <a href={`${siteUrl}/reviews`}
              className="border border-primary/40 text-primary text-center font-bold uppercase tracking-widest py-3 text-xs hover:bg-primary/10 transition-colors inline-flex items-center justify-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Отзыв
            </a>
          </div>
        </div>
        <p className="text-center text-gray-700 text-xs mt-4 tracking-widest uppercase">© {new Date().getFullYear()} ГРИЗЛИ Hookah Lounge</p>
      </motion.div>
    </main>
  );
}
