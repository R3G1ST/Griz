import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const TIME_SLOTS = [
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00",
];

type BookingForm = { name: string; phone: string; date: string; time: string; guests: number; comment: string };
type SubmitState = "idle" | "loading" | "success" | "error";

const inputClass = "w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-light";

export default function Booking() {
  const { contacts, schedule } = useSiteSettings();
  const [form, setForm] = useState<BookingForm>({ name: "", phone: "", date: "", time: "", guests: 2, comment: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!form.date) { setTakenSlots([]); return; }
    fetch(API(`/api/slots?date=${form.date}`)).then(r => r.json()).then(d => setTakenSlots(d.taken ?? [])).catch(() => {});
  }, [form.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "guests" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");
    try {
      const res = await fetch(API("/api/bookings"), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitState("success");
      setForm({ name: "", phone: "", date: "", time: "", guests: 2, comment: "" });
    } catch { setSubmitState("error"); }
  };

  const phoneHref = `tel:${contacts.phone.replace(/[^\d+]/g, "")}`;
  const mapHref = contacts.mapUrl || `https://2gis.ru/tyumen/search/${encodeURIComponent(contacts.address)}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-12">
          <h1 className="font-serif font-bold text-white uppercase break-words"
              style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)", lineHeight: 0.95 }}>
            Бронирование
          </h1>
          <div className="w-20 h-px bg-primary mt-6" />
          <p className="text-muted-foreground font-light mt-4 max-w-lg">
            Количество мест ограничено — рекомендуем бронировать заранее, особенно в выходные.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: info + map */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-white/80">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-light">{contacts.address}</span>
              </div>
              <div className="flex items-start gap-4 text-white/80">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href={phoneHref} className="font-light hover:text-primary transition-colors">{contacts.phone}</a>
              </div>
            </div>

            <div className="border border-white/10 p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-primary font-serif text-lg tracking-widest uppercase">График работы</p>
              </div>
              <div className="space-y-2 text-sm font-light">
                {schedule.map(s => (
                  <div key={s.days} className="flex justify-between text-white/70">
                    <span>{s.days}</span><span className="text-white">{s.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href={mapHref} target="_blank" rel="noopener noreferrer"
              className="block border border-white/10 hover:border-primary/40 transition-colors overflow-hidden group">
              <div className="aspect-[16/9] bg-card flex items-center justify-center relative">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=65.6015%2C57.1130&z=15&mode=search&text=%D1%83%D0%BB%20%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%B2%2092%20%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C"
                  title="ГРИЗЛИ на карте"
                  width="100%" height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center gap-2 py-3 bg-white/5 text-primary text-xs tracking-widest uppercase group-hover:bg-primary/10 transition-colors">
                Открыть в Яндекс.Картах →
              </div>
            </a>
          </motion.div>

          {/* Right: booking form */}
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: 0.15 } } }}
            className="bg-card p-6 sm:p-8 border border-white/5 flex flex-col justify-center backdrop-blur-sm">
            <h2 className="text-2xl font-serif text-white mb-6">Забронировать стол</h2>

            {submitState === "success" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <CheckCircle className="w-14 h-14 text-primary" />
                <p className="text-white text-xl font-serif">Заявка принята!</p>
                <p className="text-muted-foreground font-light">Мы свяжемся с вами для подтверждения.</p>
                <button onClick={() => setSubmitState("idle")} className="text-primary text-sm underline underline-offset-4 mt-4 font-light">
                  Ещё одна заявка
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Имя" required className={inputClass} />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="Телефон" required className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required className={`${inputClass} [color-scheme:dark]`} />
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled className="bg-background">Время</option>
                    {TIME_SLOTS.map(slot => {
                      const taken = takenSlots.includes(slot);
                      return (
                        <option key={slot} value={slot} disabled={taken} className="bg-background">
                          {slot}{taken ? " — занято" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {takenSlots.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    🕐 На эту дату {takenSlots.length} слот{takenSlots.length === 1 ? "" : "а"} занято
                  </p>
                )}
                <select name="guests" value={form.guests} onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n} className="bg-background">
                      {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
                    </option>
                  ))}
                </select>
                <textarea name="comment" value={form.comment} onChange={handleChange}
                  placeholder="Пожелания (необязательно)" rows={2}
                  className={`${inputClass} resize-none`} />
                {submitState === "error" && (
                  <p className="text-red-400 text-sm font-light">Ошибка при отправке. Попробуйте ещё раз или позвоните нам.</p>
                )}
                <Button type="submit" disabled={submitState === "loading"}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 rounded-none mt-4 shadow-glow">
                  {submitState === "loading" ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Отправляем...</span>
                  ) : "Отправить заявку"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
