import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Send, Gift, Star, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TIERS = [
  { name: "Бронза",   threshold: "0 – 9 визитов",     bonus: "5%",  color: "from-amber-700/40 to-amber-900/40", text: "text-amber-400" },
  { name: "Серебро",  threshold: "10 – 24 визита",    bonus: "8%",  color: "from-zinc-400/30 to-zinc-600/30",   text: "text-zinc-300" },
  { name: "Золото",   threshold: "25 – 49 визитов",   bonus: "12%", color: "from-yellow-500/30 to-yellow-700/30", text: "text-yellow-400" },
  { name: "Платина",  threshold: "50+ визитов",       bonus: "15%", color: "from-primary/30 to-primary/10",     text: "text-primary" },
];

const PERKS = [
  { icon: Gift,       title: "Кэшбэк баллами", text: "За каждый визит начисляем баллы. 1 балл = 1 ₽ скидки на следующий заказ." },
  { icon: TrendingUp, title: "Растущий статус", text: "Чем чаще приходите — тем выше тир и тем больше процент кэшбэка." },
  { icon: Star,       title: "Закрытые акции",  text: "Доступ к секретным меню, дегустациям и приватным вечерам." },
];

export default function Loyalty() {
  const { loyalty } = useSiteSettings();
  const BOT_URL = `https://t.me/${loyalty.botUsername.replace(/^@/, "")}`;
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="text-primary text-xs uppercase tracking-[0.4em] mb-4">{loyalty.tagline}</p>
          <h1 className="font-serif font-bold text-white uppercase break-words"
              style={{ fontSize: "clamp(2.5rem, 10vw, 6.5rem)", lineHeight: 0.95 }}>
            Лояльность
          </h1>
          <div className="w-20 h-px bg-primary mt-6" />
          <p className="text-muted-foreground font-light mt-6 max-w-xl">
            {loyalty.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="space-y-6">
              {PERKS.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif text-xl mb-1">{p.title}</h3>
                    <p className="text-muted-foreground font-light text-sm">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="border border-white/10 bg-card/50 backdrop-blur-sm p-8 flex flex-col items-center text-center">
            <div className="bg-white p-4 mb-4">
              <QRCodeSVG value={BOT_URL} size={180} bgColor="#ffffff" fgColor="#000000" level="M" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Отсканируйте — откроется бот</p>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="w-full bg-primary text-primary-foreground uppercase tracking-widest text-xs h-12 inline-flex items-center justify-center gap-2 hover:bg-primary/90 shadow-glow">
              <Send className="w-4 h-4" /> Открыть в Telegram
            </a>
          </motion.div>
        </div>

        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-serif text-white uppercase mb-8 break-words"
          style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)", lineHeight: 1 }}>Статусы</motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {TIERS.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative border border-white/10 p-6 bg-gradient-to-br ${t.color} backdrop-blur-sm tilt-card`}>
              <p className={`font-serif text-2xl mb-1 ${t.text}`}>{t.name}</p>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-4">{t.threshold}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif text-white">{t.bonus}</span>
                <span className="text-muted-foreground text-xs">кэшбэк</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border border-white/10 p-6 sm:p-8 bg-card/50 backdrop-blur-sm">
          <h3 className="text-white font-serif text-2xl mb-4">Как это работает</h3>
          <ol className="space-y-3 text-muted-foreground font-light">
            <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Запустите бота в Telegram и оставьте номер телефона.</li>
            <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Показывайте QR-карту хостесу при каждом визите.</li>
            <li className="flex gap-3"><span className="text-primary font-bold">3.</span> Получайте баллы и растите статус — без пластиковых карт.</li>
            <li className="flex gap-3"><span className="text-primary font-bold">4.</span> Тратьте баллы на любые позиции меню в следующий визит.</li>
          </ol>
        </div>
      </div>

      <Footer />
    </main>
  );
}
