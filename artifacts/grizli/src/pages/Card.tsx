import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import logo from "@/assets/images/logo.jpeg";

const SITE_URL = "https://f9167b22-4aec-40df-8a7f-aa875614cc10-00-201fcuirmb9o9.worf.replit.dev";

export default function Card() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-neutral-950 border border-white/10 p-8 flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="ГРИЗЛИ" className="w-20 h-20 object-contain rounded-full border border-primary/30" />
            <div className="text-center">
              <h1 className="text-3xl font-serif text-white uppercase tracking-widest">ГРИЗЛИ</h1>
              <p className="text-primary text-xs uppercase tracking-[0.3em] mt-1">Кальянная — Тюмень</p>
            </div>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Info */}
          <div className="w-full space-y-3 text-sm">
            <a href="tel:+79163283891" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors group">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span>+7 (916) 328-38-91</span>
            </a>
            <div className="flex items-start gap-3 text-gray-300">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Тюмень, ул. Новосёлов, 92</span>
            </div>
            <div className="flex items-start gap-3 text-gray-300">
              <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <div>Пн–Чт, Вс: 15:00 – 02:00</div>
                <div>Пт–Сб: 15:00 – 04:00</div>
              </div>
            </div>
            <a href="https://t.me/grizzly_lounge" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
              <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.51 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.834.954l-.528-.985z"/>
              </svg>
              <span>@grizzly_lounge</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
              <Instagram className="w-4 h-4 text-primary flex-shrink-0" />
              <span>@grizli_tyumen</span>
            </a>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* QR */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3">
              <QRCodeSVG
                value={SITE_URL}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                imageSettings={{ src: logo, x: undefined, y: undefined, height: 28, width: 28, excavate: true }}
              />
            </div>
            <p className="text-xs text-gray-600 uppercase tracking-widest text-center">Наш сайт</p>
          </div>

          {/* Book CTA */}
          <a href={`${SITE_URL}/booking`}
            className="w-full bg-primary text-black text-center font-bold uppercase tracking-widest py-3 text-sm hover:bg-primary/80 transition-colors">
            Забронировать стол
          </a>
        </div>

        <p className="text-center text-gray-700 text-xs mt-4 tracking-widest uppercase">© 2026 ГРИЗЛИ Hookah Lounge</p>
      </motion.div>
    </main>
  );
}
