import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, Send as TgIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useReviews, useSiteSettings } from "@/hooks/useSiteSettings";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const inputClass = "w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-light";

export default function Reviews() {
  const { reviews, submit } = useReviews();
  const { loyalty } = useSiteSettings();
  const botUrl = `https://t.me/${loyalty.botUsername.replace(/^@/, "")}?start=review`;
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    const ok = await submit(form);
    if (ok) {
      setState("success");
      setForm({ name: "", text: "", rating: 5 });
      setTimeout(() => { setShowForm(false); setState("idle"); }, 1500);
    } else setState("error");
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <div className="bg-noise" />
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-12">
          <h1 className="font-serif font-bold text-white uppercase break-words leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)" }}>
            Отзывы
          </h1>
          <div className="w-20 h-px bg-primary mt-6" />

          {/* Rating summary */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif text-primary">{avg}</span>
              <span className="text-muted-foreground text-sm">из 5</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${reviews.length && Number(avg) >= s - 0.5 ? "text-primary fill-primary" : "text-white/10"}`} />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                на основе {reviews.length} отзыв{reviews.length === 1 ? "а" : reviews.length < 5 ? "ов" : "ов"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          <button
            onClick={() => setShowForm(o => !o)}
            className="flex items-center justify-center gap-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs h-14 hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {showForm ? "Скрыть форму" : "Оставить отзыв"}
          </button>
          <a
            href={botUrl}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 border border-white/15 text-white uppercase tracking-widest text-xs h-14 hover:border-primary/50 hover:text-primary transition-colors"
          >
            <TgIcon className="w-4 h-4" />
            Отзыв через Telegram
          </a>
        </motion.div>

        {/* Inline form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-12 border border-white/10 p-6 space-y-4 overflow-hidden bg-card/50 backdrop-blur-sm"
            >
              {state === "success" ? (
                <p className="text-primary text-center py-6 font-light">✓ Спасибо! Ваш отзыв опубликован.</p>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4 items-center">
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Ваше имя" required maxLength={100} className={inputClass} />
                    <div className="flex items-center gap-2 justify-start md:justify-end">
                      <span className="text-muted-foreground text-sm">Оценка:</span>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))}
                          className="text-3xl transition-transform hover:scale-110">
                          <Star className={`w-7 h-7 ${s <= form.rating ? "text-primary fill-primary" : "text-white/10"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                    placeholder="Поделитесь впечатлениями..." required minLength={5} maxLength={1000} rows={4}
                    className={`${inputClass} resize-none`} />
                  {state === "error" && <p className="text-red-400 text-sm">Ошибка отправки. Попробуйте ещё раз.</p>}
                  <Button type="submit" disabled={state === "loading"}
                    className="w-full bg-primary text-primary-foreground uppercase tracking-widest text-xs h-12 rounded-none">
                    {state === "loading" ? "Отправка..." : "Опубликовать"}
                  </Button>
                </>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">Пока отзывов нет — будьте первым!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="border border-white/5 p-6 hover:border-primary/30 transition-colors bg-card/30 backdrop-blur-sm relative group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-white font-medium block">{r.name}</span>
                    {r.source === "telegram" && (
                      <span className="text-[10px] uppercase tracking-widest text-primary/60 inline-flex items-center gap-1 mt-1">
                        <TgIcon className="w-3 h-3" /> Telegram
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-primary fill-primary" : "text-white/10"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">«{r.text}»</p>
                <p className="text-white/30 text-xs mt-4">{new Date(r.createdAt).toLocaleDateString("ru-RU")}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
