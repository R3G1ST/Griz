import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MapPin, Phone, CheckCircle, Loader2, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

import heroBg from "@/assets/images/hero-bg.png";
import bearSkull from "@/assets/images/bear-skull.png";
import cocktail from "@/assets/images/cocktail.png";
import interior from "@/assets/images/interior.png";
import logo from "@/assets/images/logo.jpeg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

const BASE_URL = import.meta.env.BASE_URL ?? "/";

type BookingForm = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

type Review = { id: number; name: string; text: string; rating: number; createdAt: string };
type ReviewForm = { name: string; text: string; rating: number };

const TIME_SLOTS = [
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00",
];

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [form, setForm] = useState<BookingForm>({
    name: "", phone: "", date: "", time: "", guests: 2, comment: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({ name: "", text: "", rating: 5 });
  const [reviewState, setReviewState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE_URL.endsWith("/") ? BASE_URL.slice(0,-1) : BASE_URL}/api/reviews`)
      .then(r => r.json()).then(setReviews).catch(() => {});
  }, []);

  // Fetch taken slots when date changes
  useEffect(() => {
    if (!form.date) { setTakenSlots([]); return; }
    const apiBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    fetch(`${apiBase}/api/slots?date=${form.date}`)
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
      const apiBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
      const res = await fetch(`${apiBase}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitState("success");
      setForm({ name: "", phone: "", date: "", time: "", guests: 2, comment: "" });
    } catch {
      setSubmitState("error");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewState("loading");
    try {
      const apiBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setReviews(prev => [created, ...prev]);
      setReviewState("success");
      setReviewForm({ name: "", text: "", rating: 5 });
      setShowReviewForm(false);
    } catch {
      setReviewState("error");
    }
  };

  const inputClass = "w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-light";

  return (
    <main className="min-h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      <div className="bg-noise" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-3 flex justify-between items-center" style={{background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)"}}>
        <img src={logo} alt="ГРИЗЛИ" className="h-14 w-14 object-contain rounded-full" />
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-white items-center">
          <a href="#about" className="hover:text-primary transition-colors">О нас</a>
          <a href="#craft" className="hover:text-primary transition-colors">Мастерство</a>
          <Link href="/menu" className="hover:text-primary transition-colors cursor-pointer">Меню</Link>
          <Link href="/gallery" className="hover:text-primary transition-colors cursor-pointer">Галерея</Link>
          <a href="#booking" className="hover:text-primary transition-colors">Бронь</a>
          <Link href="/card" className="hover:text-primary transition-colors cursor-pointer">Контакты</Link>
        </div>
        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden text-white p-2"
          aria-label="Меню"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-10"
          >
            {[
              { label: "О нас", href: "#about" },
              { label: "Мастерство", href: "#craft" },
              { label: "Бронь", href: "#booking" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-4xl font-serif text-white hover:text-primary transition-colors uppercase tracking-widest"
              >
                {link.label}
              </a>
            ))}
            <Link href="/menu" onClick={() => setMobileOpen(false)}
              className="text-4xl font-serif text-white hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
              Меню
            </Link>
            <Link href="/gallery" onClick={() => setMobileOpen(false)}
              className="text-4xl font-serif text-white hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
              Галерея
            </Link>
            <Link href="/card" onClick={() => setMobileOpen(false)}
              className="text-4xl font-serif text-white hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
              Контакты
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
          <img 
            src={heroBg} 
            alt="Лунж бар Гризли" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-6 tracking-tight uppercase"
          >
            ИНСТИНКТ
            <br />
            <span className="text-primary italic font-light lowercase tracking-normal">отдыха</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-md mx-auto font-light"
          >
            Премиальный лаунж для тех, кто знает цену времени. Глубокие вкусы, полумрак и никакого ритма большого города.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12"
          >
            <a href="#booking">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 px-8 rounded-none border border-primary/50">
                Забронировать стол
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* The Vibe (About) */}
      <section id="about" className="py-32 px-6 relative z-30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/3] overflow-hidden relative border border-white/5 p-4">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
              <img src={bearSkull} alt="Бронзовый череп медведя" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-serif font-bold mb-8 uppercase text-white">
              Не клуб.<br />Не кафе.<br /><span className="text-primary italic font-light lowercase">Берлога.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg leading-relaxed mb-6 font-light">
              Мы создали место, где город остается за дверью. "ГРИЗЛИ" — это тяжелое дерево, потертая кожа, приглушенный янтарный свет и густой дым.
            </motion.p>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg leading-relaxed font-light">
              Здесь некуда спешить. Мы уважаем личное пространство и ценим тишину. Это территория взрослых, где каждый вдох имеет глубину.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The Craft */}
      <section id="craft" className="py-32 px-6 relative bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl md:text-6xl font-serif font-bold text-white uppercase"
          >
            Глубина вкуса
          </motion.h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-24 h-px bg-primary mx-auto mt-8"
          />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Табак",
              desc: "Слепая дегустация и ручной отбор. Только премиальный лист, способный отдать максимум аромата и крепости."
            },
            {
              title: "Мастера",
              desc: "Наши хука-сомелье не задают лишних вопросов. Пары слов достаточно, чтобы они собрали идеальную чашу под ваше настроение."
            },
            {
              title: "Процесс",
              desc: "Идеальный жар, правильный уголь и безупречная тяга. Мы контролируем каждую деталь, чтобы вы просто наслаждались."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.8 } }
              }}
              className="p-8 border border-white/5 bg-background/50 backdrop-blur-sm flex flex-col items-center text-center group hover:border-primary/30 transition-colors duration-500"
            >
              <h3 className="text-2xl font-serif font-semibold text-white mb-4">{item.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Bar */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col justify-center"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-serif font-bold mb-8 uppercase text-white">
              Темные<br /><span className="text-primary italic font-light lowercase">материи</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg leading-relaxed mb-6 font-light">
              Авторская коктейльная карта, вдохновленная лесом, дымом и крепким характером. Мы используем выдержанные спирты, домашние настойки и дикие травы.
            </motion.p>
            <motion.ul variants={fadeIn} className="space-y-4 mt-4 mb-8">
              {[
                "Фирменный 'Когти Гризли' на копченом виски",
                "Коллекция выдержанных пуэров",
                "Крафтовое пиво из локальных пивоварен"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden border border-white/5 p-4">
              <img src={cocktail} alt="Темный коктейль" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Interior */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full h-[60vh] md:h-[80vh] relative border border-white/5 p-4"
          >
            <img src={interior} alt="Интерьер лаунжа" className="w-full h-full object-cover filter brightness-75" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-white text-center tracking-widest uppercase mix-blend-overlay opacity-80">
                Твоя территория
              </h2>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex items-center justify-between mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-white uppercase">Атмосфера</h2>
            <div className="w-16 h-px bg-primary" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { src: heroBg, span: "md:col-span-2 md:row-span-2", label: "Зал" },
              { src: bearSkull, span: "", label: "Символ" },
              { src: cocktail, span: "", label: "Бар" },
              { src: interior, span: "md:col-span-2", label: "Интерьер" },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative overflow-hidden group cursor-pointer ${img.span}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-90"
                  />
                </div>
                <div className="absolute inset-0 border border-white/0 group-hover:border-primary/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-32 px-6 bg-card border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-5xl font-serif font-bold text-white mb-16 uppercase"
          >
            Наши правила
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-left">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h4 className="text-primary font-serif text-xl mb-3">1. Возраст</h4>
              <p className="text-muted-foreground font-light">Строго 18+. Мы оставляем за собой право попросить документ. Без исключений.</p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h4 className="text-primary font-serif text-xl mb-3">2. Уважение</h4>
              <p className="text-muted-foreground font-light">Не повышаем голос, не включаем видео без наушников. Уважаем отдых друг друга.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-4xl md:text-6xl font-serif text-white uppercase">Отзывы</h2>
            <button onClick={() => setShowReviewForm(o => !o)}
              className="text-xs uppercase tracking-widest border border-primary/40 text-primary px-4 py-2 hover:bg-primary/10 transition-colors">
              {showReviewForm ? "Отмена" : "+ Оставить отзыв"}
            </button>
          </motion.div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} onSubmit={handleReviewSubmit}
                className="mb-10 border border-white/10 p-6 space-y-4 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ваше имя" required maxLength={100}
                    className={inputClass} />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Оценка:</span>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: s }))}
                        className={`text-2xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? "text-primary" : "text-gray-700"}`}>
                        ★
                      </button>
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
        </div>
      </section>

      {/* Footer / Booking */}
      <section id="booking" className="py-32 px-6 relative bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl font-serif font-bold text-white mb-8 uppercase">Ждем.</h2>
            <p className="text-muted-foreground font-light mb-12 max-w-sm">
              Количество мест ограничено. Рекомендуем бронировать стол заранее, особенно в выходные дни.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-white/80">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-light">г. Тюмень, ул. Новосёлов, 92</span>
              </div>
              <div className="flex items-start gap-4 text-white/80">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-light">+7 (916) 328-38-91</span>
              </div>
            </div>

            {/* Schedule */}
            <div className="mt-6 border border-white/10 p-5">
              <p className="text-primary font-serif text-lg tracking-widest mb-4 uppercase">График работы</p>
              <div className="space-y-2 text-sm font-light">
                {[
                  { days: "Пн — Чт", hours: "15:00 — 02:00" },
                  { days: "Пт — Сб", hours: "15:00 — 04:00" },
                  { days: "Вс", hours: "15:00 — 02:00" },
                ].map(({ days, hours }) => (
                  <div key={days} className="flex justify-between text-white/70">
                    <span>{days}</span>
                    <span className="text-white">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenStreetMap */}
            <div className="mt-6 border border-white/10 overflow-hidden">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=65.5865%2C57.1080%2C65.6165%2C57.1180&layer=mapnik&marker=57.1130%2C65.6015"
                title="ГРИЗЛИ на карте"
                width="100%"
                height="220"
                style={{ border: 0, display: "block" }}
                loading="lazy"
              />
              <a
                href="https://2gis.ru/tyumen/search/%D1%83%D0%BB%20%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%B2%2092"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 bg-white/5 text-primary text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                Открыть в 2ГИС
              </a>
            </div>
          </div>
          
          <div className="bg-card p-8 border border-white/5 flex flex-col justify-center">
            <h3 className="text-2xl font-serif text-white mb-6">Забронировать</h3>

            {submitState === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-12 text-center"
              >
                <CheckCircle className="w-14 h-14 text-primary" />
                <p className="text-white text-xl font-serif">Заявка принята!</p>
                <p className="text-muted-foreground font-light">Мы свяжемся с вами для подтверждения.</p>
                <button
                  onClick={() => setSubmitState("idle")}
                  className="text-primary text-sm underline underline-offset-4 mt-4 font-light"
                >
                  Отправить ещё одну заявку
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Имя" 
                  required
                  className={inputClass}
                />
                <input 
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Телефон"
                  required
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className={`${inputClass} cursor-pointer`}
                  >
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
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n} className="bg-background">{n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}</option>
                  ))}
                </select>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Пожелания (необязательно)"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />

                {submitState === "error" && (
                  <p className="text-red-400 text-sm font-light">Ошибка при отправке. Попробуйте ещё раз или позвоните нам.</p>
                )}

                <Button 
                  type="submit"
                  disabled={submitState === "loading"}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 rounded-none mt-4"
                >
                  {submitState === "loading" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Отправляем...
                    </span>
                  ) : "Отправить заявку"}
                </Button>
              </form>
            )}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-serif font-bold tracking-[0.2em] text-white/50">ГРИЗЛИ</div>
          <div className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} ГРИЗЛИ Hookah Lounge. Все права защищены.
          </div>
        </div>
      </section>
    </main>
  );
}
