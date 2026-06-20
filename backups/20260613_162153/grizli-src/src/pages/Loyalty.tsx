import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Send, Gift, Star, TrendingUp } from "lucide-react";
import NeonPage from "@/components/NeonPage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TIERS = [
  { name: "Бронза",   threshold: "0 – 9 визитов",   bonus: "5%",  accent: "from-amber-700/25 to-amber-900/10" },
  { name: "Серебро",  threshold: "10 – 24 визита",  bonus: "8%",  accent: "from-zinc-400/20  to-zinc-700/10" },
  { name: "Золото",   threshold: "25 – 49 визитов", bonus: "12%", accent: "from-yellow-500/25 to-yellow-800/10" },
  { name: "Платина",  threshold: "50+ визитов",     bonus: "15%", accent: "from-[#D4FF3F]/30 to-[#D4FF3F]/5" },
];

const PERKS = [
  { icon: Gift,       title: "Кэшбэк баллами",  text: "За каждый визит начисляем баллы. 1 балл = 1 ₽ скидки на следующий заказ." },
  { icon: TrendingUp, title: "Растущий статус", text: "Чем чаще приходите — тем выше тир и тем больше процент кэшбэка." },
  { icon: Star,       title: "Закрытые акции",  text: "Доступ к секретным меню, дегустациям и приватным вечерам." },
];

export default function Loyalty() {
  const { loyalty } = useSiteSettings();
  const botUrl = `https://t.me/${loyalty.botUsername.replace(/^@/, "")}`;

  return (
    <NeonPage
      eyebrow={`/ LOYALTY · ${loyalty.tagline.toUpperCase()}`}
      title={<>КЛУБ <span className="gn-neon">ГРИЗЛИ</span></>}
      lead={loyalty.description}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 mb-16 items-start">
          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3 space-y-5"
          >
            <div className="gn-mono text-[10px] tracking-[0.32em] text-[#D4FF3F]/80 mb-2">/ ПРИВИЛЕГИИ</div>
            {PERKS.map((p, i) => (
              <div key={i} className="gn-glass rounded-2xl p-5 sm:p-6 flex gap-4 hover:border-[#D4FF3F]/40 transition">
                <div className="w-12 h-12 rounded-xl gn-neon-box flex items-center justify-center shrink-0 bg-black">
                  <p.icon className="w-5 h-5 text-[#D4FF3F]" />
                </div>
                <div>
                  <h3 className="gn-display text-xl sm:text-2xl gn-neon-white mb-1.5">{p.title}</h3>
                  <p className="text-[#F5F1E8]/65 text-[14px] leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* QR card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2 gn-glass-lime rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center"
          >
            <div className="gn-mono text-[10px] tracking-[0.32em] text-[#D4FF3F] mb-3">/ TELEGRAM-БОТ</div>
            <div className="bg-white p-4 rounded-xl gn-neon-box mb-4">
              <QRCodeSVG value={botUrl} size={180} bgColor="#ffffff" fgColor="#0A0A0A" level="M" />
            </div>
            <p className="gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/55 mb-4">
              ОТСКАНИРУЙТЕ — ОТКРОЕТСЯ БОТ
            </p>
            <a
              href={botUrl} target="_blank" rel="noopener noreferrer"
              className="w-full gn-cta rounded-full px-5 py-3.5 text-[12px] tracking-[0.2em] uppercase font-semibold inline-flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Открыть в Telegram
            </a>
          </motion.div>
        </div>

        {/* Tiers */}
        <div className="mb-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="gn-display gn-neon-white leading-none tracking-tighter"
                style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
              Статусы
            </h2>
            <span className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/70 hidden sm:inline">
              / TIERS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIERS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                className={`relative gn-corner bg-gradient-to-br ${t.accent} rounded-xl p-6 border border-white/10`}
              >
                <span className="c1" /><span className="c2" />
                <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/70 mb-3">/ 0{i + 1}</div>
                <p className="gn-display text-2xl gn-neon-white mb-1">{t.name}</p>
                <p className="text-[#F5F1E8]/55 text-[11px] uppercase tracking-widest mb-4">{t.threshold}</p>
                <div className="flex items-baseline gap-2">
                  <span className="gn-display text-4xl gn-neon">{t.bonus}</span>
                  <span className="gn-mono text-[10px] tracking-[0.22em] text-[#F5F1E8]/55">КЭШБЭК</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="gn-glass rounded-2xl p-6 sm:p-8">
          <div className="gn-mono text-[10px] tracking-[0.32em] text-[#D4FF3F]/80 mb-3">/ КАК ЭТО РАБОТАЕТ</div>
          <h3 className="gn-display text-2xl sm:text-3xl gn-neon-white mb-5">Четыре шага — и вы в клубе</h3>
          <ol className="space-y-3.5 text-[14px] text-[#F5F1E8]/75">
            {[
              "Запустите бота в Telegram и оставьте номер телефона.",
              "Показывайте QR-карту хостесу при каждом визите.",
              "Получайте баллы и растите статус — без пластиковых карт.",
              "Тратьте баллы на любые позиции меню в следующий визит.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="gn-mono text-[#D4FF3F] text-[13px] tracking-widest shrink-0 w-6">
                  0{i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </NeonPage>
  );
}
