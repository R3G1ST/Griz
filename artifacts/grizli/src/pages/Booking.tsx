import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

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
type Review = { id: number; name: string; text: string; rating: number; createdAt: string };
type ReviewForm = { name: string; text: string; rating: number };

const inputClass = "w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-light";

export default function Booking() {
  const [form, setForm] = useState<BookingForm>({ name: "", phone: "", date: "", time: "", guests: 2, comment: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({ name: "", text: "", rating: 5 });
  const [reviewState, setReviewState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(API("/api/reviews")).then(r => r.json()).then(setReviews).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.date) { setTakenSlots([]); return; }
    fetch(API(`/api/slots?date=${form.date}`))
      .then(r => r.json()).then(d => setTakenSlots(d.taken ?? [])).catch(() => {});
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewState("loading");
    try {
      const res = await fetch(API("/api/reviews"), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reviewForm),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setReviews(prev => [created, ...prev]);
      setReviewState("success");
      setReviewForm({ name: "", text: "", rating: 5 });
      setShowReviewForm(false);
    } catch { setReviewState("error"); }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-16">
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white uppercase">Бронирование</h1>
          <div className="w-20 h-px bg-primary mt-6" />
          <p className="text-muted-foreground font-light mt-4 max-w-lg">
            Количество мест ограничено — рекомендуем бронировать заранее, особенно в выходные.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Left: info + map */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-white/80">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-light">г. Тюмень, ул. Новосёлов, 92</span>
              </div>
              <div className="flex items-start gap-4 text-white/80">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+79163283891" className="font-light hover:text-primary transition-colors">
                  +7 (916) 328-38-91
                </a>
              </div>
            </div>

            <div className="border border-white/10 p-5 mb-6">
              <p className="text-primary font-serif text-lg tracking-widest mb-4 uppercase">График работы</p>
              <div className="space-y-2 text-sm font-light">
                {[
                  { days: "Пн — Чт", hours: "15:00 — 02:00" },
                  { days: "Пт — Сб",  hours: "15:00 — 04:00" },
                  { days: "Вс",       hours: "15:00 — 02:00" },
                ].map(({ days, hours }) => (
                  <div key={days} className="flex justify-between text-white/70">
                    <span>{days}</span><span className="text-white">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 overflow-hidden">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=65.5865%2C57.1080%2C65.6165%2C57.1180&layer=mapnik&marker=57.1130%2C65.6015"
                title="ГРИЗЛИ на карте"
                width="100%" height="220"
                style={{ border: 0, display: "block" }}
                loading="lazy"
              />
              <a
                href="https://2gis.ru/tyumen/search/%D1%83%D0%BB%20%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%B2%2092"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 bg-white/5 text-primary text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                Открыть в 2ГИС
              </a>
            </div>
          </motion.div>

          {/* Right: booking form */}
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: 0.15 } } }}
            className="bg-card p-8 border border-white/5 flex flex-col justify-center">
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
                <div className="grid grid-cols-2 gap-4">
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 rounded-none mt-4">
                  {submitState === "loading" ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Отправляем...</span>
                  ) : "Отправить заявку"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Reviews */}
        <section className="mt-32 border-t border-white/5 pt-20">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-4xl md:text-6xl font-serif text-white uppercase">Отзывы</h2>
            <button onClick={() => setShowReviewForm(o => !o)}
              className="text-xs uppercase tracking-widest border border-primary/40 text-primary px-4 py-2 hover:bg-primary/10 transition-colors">
              {showReviewForm ? "Отмена" : "+ Оставить отзыв"}
            </button>
          </div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} onSubmit={handleReviewSubmit}
                className="mb-10 border border-white/10 p-6 space-y-4 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ваше имя" required maxLength={100} className={inputClass} />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Оценка:</span>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: s }))}
                        className={`text-2xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? "text-primary" : "text-gray-700"}`}>★</button>
                    ))}
                  </div>
                </div>
                <textarea value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))}
                  placeholder="Ваш отзыв..." required minLength={5} maxLength={1000} rows={3}
                  className={`${inputClass} resize-none`} />
                {reviewState === "error" && <p className="text-red-400 text-sm">Ошибка. Попробуйте ещё раз.</p>}
                <Button type="submit" disabled={reviewState === "loading"}
                  className="bg-primary text-black uppercase tracking-widest text-xs h-11 rounded-none px-8">
                  {reviewState === "loading" ? "Отправляем..." : "Опубликовать"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-12">Пока отзывов нет — будьте первым!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="border border-white/5 p-6 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-medium">{r.name}</span>
                    <span className="text-primary text-sm tracking-wide">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">{r.text}</p>
                  <p className="text-gray-700 text-xs mt-3">{new Date(r.createdAt).toLocaleDateString("ru-RU")}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-serif font-bold tracking-[0.2em] text-white/50">ГРИЗЛИ</div>
          <div className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} ГРИЗЛИ Hookah Lounge. Тюмень, ул. Новосёлов, 92
          </div>
        </div>
      </div>
    </main>
  );
}
