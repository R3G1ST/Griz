import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";
import NeonPage from "@/components/NeonPage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const TIME_SLOTS = [
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00",
];

type BookingForm = { name: string; phone: string; date: string; time: string; guests: number; comment: string };
type SubmitState = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-[#F5F1E8]/35 " +
  "focus:outline-none focus:border-[#D4FF3F]/70 focus:ring-1 focus:ring-[#D4FF3F]/30 transition gn-sans";

export default function Booking() {
  const { contacts, schedule } = useSiteSettings();
  const [form, setForm] = useState<BookingForm>({ name: "", phone: "", date: "", time: "", guests: 2, comment: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!form.date) { setTakenSlots([]); return; }
    const ctrl = new AbortController();
    fetch(API(`/api/slots?date=${form.date}`), { signal: ctrl.signal })
      .then(r => r.json())
      .then(d => setTakenSlots(d.taken ?? []))
      .catch(err => { if (err?.name !== "AbortError") setTakenSlots([]); });
    return () => ctrl.abort();
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
  const mapHref = contacts.mapUrl || `https://yandex.ru/maps/?text=${encodeURIComponent(contacts.address)}`;
  const mapEmbed =
    "https://yandex.ru/map-widget/v1/?ll=65.6015%2C57.1130&z=15&mode=search&" +
    `text=${encodeURIComponent(contacts.address)}`;

  return (
    <NeonPage
      eyebrow="/ BOOKING · СТОЛ НА ВЕЧЕР"
      title={<>ЗАБРОНИРОВАТЬ <span className="gn-neon">СТОЛ</span></>}
      lead="Количество мест ограничено — рекомендуем бронировать заранее, особенно в пятницу и субботу."
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ====== LEFT: contacts + map ====== */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
            <div className="gn-glass rounded-2xl p-6">
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-4">/ КОНТАКТЫ</div>
              <div className="space-y-3.5 text-[14px] text-[#F5F1E8]/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4FF3F] mt-0.5 shrink-0" />
                  <span>{contacts.address}</span>
                </div>
                <a href={phoneHref} className="flex items-center gap-3 hover:text-[#D4FF3F] transition">
                  <Phone className="w-4 h-4 text-[#D4FF3F] shrink-0" />
                  <span>{contacts.phone}</span>
                </a>
              </div>
              <div className="gn-divider my-5 opacity-60" />
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-4 flex items-center gap-2">
                <Clock className="w-3 h-3" /> ГРАФИК
              </div>
              <ul className="space-y-2 text-[13px]">
                {schedule.map(s => (
                  <li key={s.days} className="flex justify-between text-[#F5F1E8]/75">
                    <span className="text-[#F5F1E8]/55">{s.days}</span>
                    <span className="text-[#F5F1E8]">{s.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ====== MAP with neon frame ====== */}
            <div className="gn-neon-box rounded-2xl overflow-hidden bg-black">
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
                {/* corner accents */}
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4FF3F]" />
                  <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4FF3F]" />
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4FF3F]" />
                  <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4FF3F]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ====== RIGHT: booking form ====== */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: 0.1 } } }}
            className="gn-glass-lime rounded-2xl p-5 sm:p-8"
          >
            <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F] mb-2">/ ФОРМА БРОНИ</div>
            <h2 className="gn-display text-3xl sm:text-4xl gn-neon-white mb-6 leading-none">Стол на ваше имя</h2>

            {submitState === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4FF3F]/15 border border-[#D4FF3F]/50 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#D4FF3F]" />
                </div>
                <p className="gn-display text-2xl gn-neon-white">Заявка принята</p>
                <p className="text-[#F5F1E8]/65 text-sm">Мы свяжемся с вами в Telegram или по телефону для подтверждения.</p>
                <button
                  onClick={() => setSubmitState("idle")}
                  className="gn-mono text-[11px] tracking-[0.24em] text-[#D4FF3F] hover:underline mt-2"
                >
                  ОФОРМИТЬ ЕЩЁ ОДНУ
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Имя" required className={inputClass} />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="Телефон (для подтверждения)" required className={inputClass} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select name="date" value={form.date} onChange={handleChange} required
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled className="bg-black">Дата</option>
                    {(() => {
                      const dates = [];
                      const today = new Date();
                      for (let i = 0; i < 14; i++) {
                        const date = new Date(today);
                        date.setDate(today.getDate() + i);
                        const dateStr = date.toISOString().split('T')[0];
                        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
                        const dayNum = date.getDate();
                        const month = date.toLocaleDateString('ru-RU', { month: 'short' });
                        dates.push(
                          <option key={dateStr} value={dateStr} className="bg-black">
                            {dayName.charAt(0).toUpperCase() + dayName.slice(1) + ', ' + dayNum + ' ' + month}
                          </option>
                        );
                      }
                      return dates;
                    })()}
                  </select>
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled className="bg-black">Время</option>
                    {TIME_SLOTS.map(slot => {
                      const taken = takenSlots.includes(slot);
                      return (
                        <option key={slot} value={slot} disabled={taken} className="bg-black">
                          {slot}{taken ? " — занято" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {takenSlots.length > 0 && (
                  <p className="text-xs text-[#F5F1E8]/55 gn-mono tracking-wider">
                    🕐 НА ЭТУ ДАТУ ЗАНЯТО СЛОТОВ: {takenSlots.length}
                  </p>
                )}
                <select name="guests" value={form.guests} onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n} className="bg-black">
                      {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
                    </option>
                  ))}
                </select>
                <textarea name="comment" value={form.comment} onChange={handleChange}
                  placeholder="Пожелания (необязательно)" rows={3}
                  className={`${inputClass} resize-none`} />
                {submitState === "error" && (
                  <p className="text-red-300 text-sm">Ошибка при отправке. Попробуйте ещё раз или позвоните нам.</p>
                )}
                <button
                  type="submit" disabled={submitState === "loading"}
                  className="w-full gn-cta rounded-full px-6 py-4 text-[12px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitState === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Отправляем...</>
                  ) : "Забронировать стол"}
                </button>
                <p className="text-[10px] text-[#F5F1E8]/40 gn-mono tracking-[0.2em] text-center pt-1">
                  НАЖИМАЯ КНОПКУ, ВЫ СОГЛАШАЕТЕСЬ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </NeonPage>
  );
}
