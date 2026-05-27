import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings, useReviews } from "@/hooks/useSiteSettings";

import heroBg from "@/assets/images/hero-bg.png";
import bearSkull from "@/assets/images/bear-skull.png";
import cocktail from "@/assets/images/cocktail.png";
import interior from "@/assets/images/interior.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const { hero, about, rules, contacts, brand } = useSiteSettings();
  const { reviews } = useReviews();
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <main className="min-h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />

      {/* Hero */}
      <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-black/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-20" />
          <img src={heroBg} alt="Лаунж Гризли" className="w-full h-full object-cover object-center scale-105" />
        </motion.div>

        {/* Lime spot glow */}
        <div className="absolute inset-0 bg-radial-spot z-20 pointer-events-none" />

        <div className="relative z-30 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="text-primary text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-6 border border-primary/30 px-4 py-1.5"
          >{brand.badgeText || `${brand.city} · основано в ${brand.estYear}`}</motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="font-serif font-bold text-white tracking-tight uppercase text-glow break-words text-center"
            style={{ fontSize: "clamp(3rem, 14vw, 9rem)", lineHeight: 0.92 }}
          >
            {hero.title1}<br />
            <span className="text-primary italic font-light lowercase tracking-normal text-glow">{hero.title2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/85 max-w-md mx-auto font-light mt-6 px-2"
          >{hero.subtitle}</motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link href="/booking">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 px-8 rounded-none border border-primary/50 shadow-glow">
                Забронировать стол
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 uppercase tracking-widest text-xs h-14 px-8 rounded-none bg-transparent">
                Смотреть меню
              </Button>
            </Link>
          </motion.div>

          {/* Quick rating */}
          {avgRating && reviews.length >= 1 && (
            <Link href="/reviews">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.4 }}
                className="mt-10 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${Number(avgRating) >= s - 0.5 ? "text-primary fill-primary" : "text-white/15"}`} />
                  ))}
                </div>
                <span className="text-white/80 text-sm font-light">{avgRating} · {reviews.length} отзыв{reviews.length === 1 ? "" : reviews.length < 5 ? "а" : "ов"}</span>
              </motion.div>
            </Link>
          )}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-white/20 animate-pulse" />
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-24 md:py-32 px-6 relative z-30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="order-2 lg:order-1 relative">
            <div className="aspect-[4/3] overflow-hidden relative border border-white/5 p-4">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
              <img src={bearSkull} alt="Символ" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="order-1 lg:order-2 flex flex-col justify-center">
            <motion.h2 variants={fadeIn}
              className="font-serif font-bold mb-8 uppercase text-white break-words"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1 }}
            >
              {about.title.split(".").map((part, i, arr) => part.trim() && (
                <span key={i} className={i === arr.length - 2 ? "text-primary italic font-light lowercase" : ""}>
                  {part.trim()}{i < arr.length - 1 ? "." : ""}<br />
                </span>
              ))}
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 font-light">{about.p1}</motion.p>
            <motion.p variants={fadeIn} className="text-muted-foreground text-base md:text-lg leading-relaxed font-light">{about.p2}</motion.p>
          </motion.div>
        </div>
      </section>

      {/* Craft */}
      <section id="craft" className="py-24 md:py-32 px-6 relative bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="font-serif font-bold text-white uppercase"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1 }}
          >Глубина вкуса</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="w-24 h-px bg-primary mx-auto mt-8" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Табак", desc: "Слепая дегустация и ручной отбор. Только премиальный лист, способный отдать максимум аромата и крепости." },
            { title: "Мастера", desc: "Наши хука-сомелье не задают лишних вопросов. Пары слов достаточно, чтобы они собрали идеальную чашу под ваше настроение." },
            { title: "Процесс", desc: "Идеальный жар, правильный уголь и безупречная тяга. Мы контролируем каждую деталь, чтобы вы просто наслаждались." },
          ].map((item, i) => (
            <motion.div key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8 } } }}
              className="tilt-card p-8 border border-white/5 bg-background/50 backdrop-blur-sm flex flex-col items-center text-center hover:border-primary/40 hover:bg-background/70"
            >
              <h3 className="text-2xl font-serif font-semibold text-white mb-4">{item.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bar */}
      <section className="py-24 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col justify-center">
            <motion.h2 variants={fadeIn}
              className="font-serif font-bold mb-8 uppercase text-white break-words"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1 }}
            >Тёмные<br /><span className="text-primary italic font-light lowercase">материи</span></motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 font-light">
              Авторская коктейльная карта, вдохновлённая лесом, дымом и крепким характером. Выдержанные спирты, домашние настойки и дикие травы.
            </motion.p>
            <motion.ul variants={fadeIn} className="space-y-4 mt-4 mb-8">
              {["Фирменный «Когти Гризли» на копчёном виски","Коллекция выдержанных пуэров","Крафтовое пиво из локальных пивоварен"].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeIn}>
              <Link href="/menu">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs h-12 px-6 rounded-none bg-transparent">
                  Полное меню →
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative">
            <div className="aspect-[3/4] overflow-hidden border border-white/5 p-4">
              <img src={cocktail} alt="Коктейль" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interior banner */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            className="w-full h-[50vh] md:h-[80vh] relative border border-white/5 p-4">
            <img src={interior} alt="Интерьер" className="w-full h-full object-cover filter brightness-[0.55]" />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <h2 className="font-serif font-bold text-white text-center tracking-widest uppercase mix-blend-overlay opacity-90"
                  style={{ fontSize: "clamp(2rem, 8vw, 5rem)", lineHeight: 1 }}>
                Твоя территория
              </h2>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews preview */}
      <section className="py-20 md:py-28 px-6 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <h2 className="font-serif text-white uppercase break-words" style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", lineHeight: 1 }}>
                О нас говорят
              </h2>
              {avgRating && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-5 h-5 ${Number(avgRating) >= s - 0.5 ? "text-primary fill-primary" : "text-white/15"}`} />
                    ))}
                  </div>
                  <span className="text-white text-lg font-light">{avgRating}</span>
                  <span className="text-muted-foreground text-sm">/ {reviews.length} отзыв{reviews.length === 1 ? "" : reviews.length < 5 ? "а" : "ов"}</span>
                </div>
              )}
            </div>
            <Link href="/reviews">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:text-primary/70 transition-colors cursor-pointer border border-primary/30 px-5 py-3">
                Все отзывы <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </motion.div>

          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Скоро здесь появятся первые отзывы.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.slice(0, 3).map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="tilt-card border border-white/5 p-6 bg-background/40 backdrop-blur-sm hover:border-primary/30">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-primary fill-primary" : "text-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed line-clamp-4">«{r.text}»</p>
                  <p className="text-white/70 text-xs mt-4 font-medium">— {r.name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-serif text-white uppercase" style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", lineHeight: 1 }}>Атмосфера</h2>
            <Link href="/gallery">
              <span className="text-xs uppercase tracking-widest text-primary hover:text-primary/70 transition-colors cursor-pointer">
                Вся галерея →
              </span>
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { src: heroBg, span: "md:col-span-2 md:row-span-2", label: "Зал" },
              { src: bearSkull, span: "", label: "Символ" },
              { src: cocktail, span: "", label: "Бар" },
              { src: interior, span: "md:col-span-2", label: "Интерьер" },
            ].map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative overflow-hidden group cursor-pointer ${img.span}`}>
                <div className="aspect-square overflow-hidden">
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-90" />
                </div>
                <div className="absolute inset-0 border border-white/0 group-hover:border-primary/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-20 md:py-28 px-6 bg-card border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="font-serif font-bold text-white mb-16 uppercase" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1 }}>
            Наши правила
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-left">
            {rules.map((r, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h4 className="text-primary font-serif text-xl mb-3">{i + 1}. {r.title}</h4>
                <p className="text-muted-foreground font-light">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 px-6 bg-black border-t border-white/5 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-xl mx-auto">
          <h2 className="font-serif font-bold text-white uppercase mb-6 break-words" style={{ fontSize: "clamp(2rem, 7vw, 4rem)", lineHeight: 1 }}>Ждём вас</h2>
          <p className="text-muted-foreground font-light mb-10">
            {contacts.address} · <a href={`tel:${contacts.phone.replace(/[^\d+]/g, "")}`} className="text-primary hover:underline">{contacts.phone}</a>
          </p>
          <Link href="/booking">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 px-10 rounded-none shadow-glow">
              Забронировать стол
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
