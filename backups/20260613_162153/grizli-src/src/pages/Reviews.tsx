import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, Send as TgIcon } from "lucide-react";
import NeonPage from "@/components/NeonPage";
import { useReviews, useSiteSettings } from "@/hooks/useSiteSettings";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const inputClass =
  "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#F5F1E8]/35 " +
  "focus:outline-none focus:border-[#D4FF3F]/70 focus:ring-1 focus:ring-[#D4FF3F]/30 transition";

export default function Reviews() {
  const { reviews, submit } = useReviews();
  const { loyalty } = useSiteSettings();
  const botUrl = `https://t.me/${loyalty.botUsername.replace(/^@/, "")}?start=review`;
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const avgNum = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const avg = reviews.length ? avgNum.toFixed(1) : "—";

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
    <NeonPage
      eyebrow="/ REVIEWS · ЖИВОЕ МНЕНИЕ"
      title={<>ОТЗЫВЫ <span className="gn-neon">ГОСТЕЙ</span></>}
      lead="Каждый отзыв — это голос гостя. Мы публикуем все: с пятёрками и без."
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* Rating summary */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}
          className="gn-glass rounded-2xl px-6 sm:px-8 py-6 sm:py-7 mb-10 flex flex-wrap items-center gap-x-10 gap-y-5">
          <div className="flex items-baseline gap-3">
            <span className="gn-display text-6xl sm:text-7xl gn-neon leading-none">{avg}</span>
            <span className="gn-mono text-[11px] tracking-[0.24em] text-[#F5F1E8]/55">/ 5.0</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-5 h-5 ${reviews.length && avgNum >= s - 0.5 ? "text-[#D4FF3F] fill-[#D4FF3F]" : "text-white/15"}`} />
              ))}
            </div>
            <span className="gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/55">
              НА ОСНОВЕ {reviews.length} ОТЗЫВ{reviews.length === 1 ? "А" : "ОВ"}
            </span>
          </div>
          <div className="ml-auto hidden sm:block gn-mono text-[10px] tracking-[0.24em] text-[#D4FF3F]/70">
            ОБНОВЛЕНО · {new Date().toLocaleDateString("ru-RU")}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          <button
            onClick={() => setShowForm(o => !o)}
            className="gn-cta rounded-full h-14 px-6 text-[12px] tracking-[0.2em] uppercase font-semibold inline-flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-4 h-4" />
            {showForm ? "Скрыть форму" : "Оставить отзыв"}
          </button>
          <a
            href={botUrl} target="_blank" rel="noopener noreferrer"
            className="gn-cta-ghost rounded-full h-14 px-6 text-[12px] tracking-[0.2em] uppercase inline-flex items-center justify-center gap-3"
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
              className="mb-12 gn-glass-lime rounded-2xl p-6 sm:p-7 space-y-4 overflow-hidden"
            >
              {state === "success" ? (
                <p className="text-[#D4FF3F] text-center py-6 gn-display text-xl">✓ Спасибо! Ваш отзыв опубликован.</p>
              ) : (
                <>
                  <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F] mb-1">/ НОВЫЙ ОТЗЫВ</div>
                  <div className="grid md:grid-cols-2 gap-4 items-center">
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Ваше имя" required maxLength={100} className={inputClass} />
                    <div className="flex items-center gap-2 justify-start md:justify-end">
                      <span className="gn-mono text-[10px] tracking-[0.22em] text-[#F5F1E8]/55">ОЦЕНКА:</span>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))}
                          className="transition-transform hover:scale-110" aria-label={`${s} из 5`}>
                          <Star className={`w-7 h-7 ${s <= form.rating ? "text-[#D4FF3F] fill-[#D4FF3F]" : "text-white/15"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                    placeholder="Поделитесь впечатлениями..." required minLength={5} maxLength={1000} rows={4}
                    className={`${inputClass} resize-none`} />
                  {state === "error" && <p className="text-red-300 text-sm">Ошибка отправки. Попробуйте ещё раз.</p>}
                  <button type="submit" disabled={state === "loading"}
                    className="w-full gn-cta rounded-full h-12 text-[12px] tracking-[0.2em] uppercase font-semibold">
                    {state === "loading" ? "Отправка..." : "Опубликовать"}
                  </button>
                </>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="text-[#F5F1E8]/55 text-center py-20 gn-mono tracking-[0.2em]">
            ПОКА ОТЗЫВОВ НЕТ — БУДЬТЕ ПЕРВЫМ
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.5, ease: "easeOut" }}
                className="gn-glass rounded-2xl p-6 hover:border-[#D4FF3F]/40 transition relative"
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div>
                    <span className="text-[#F5F1E8] font-medium block">{r.name}</span>
                    {r.source === "telegram" && (
                      <span className="gn-mono text-[9px] tracking-[0.28em] text-[#D4FF3F]/70 inline-flex items-center gap-1 mt-1.5">
                        <TgIcon className="w-3 h-3" /> TELEGRAM
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-[#D4FF3F] fill-[#D4FF3F]" : "text-white/15"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[#F5F1E8]/75 text-[14px] leading-relaxed">«{r.text}»</p>
                <p className="text-[#F5F1E8]/30 gn-mono text-[10px] tracking-[0.2em] mt-4">
                  {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </NeonPage>
  );
}
