import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

import heroBg from "@/assets/images/hero-bg.png";
import bearSkull from "@/assets/images/bear-skull.png";
import cocktail from "@/assets/images/cocktail.png";
import interior from "@/assets/images/interior.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <main className="min-h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
          <img src={heroBg} alt="Лаунж Гризли" className="w-full h-full object-cover object-center" />
        </motion.div>

        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-6 tracking-tight uppercase"
          >
            ИНСТИНКТ<br />
            <span className="text-primary italic font-light lowercase tracking-normal">отдыха</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-md mx-auto font-light"
          >
            Премиальный лаунж для тех, кто знает цену времени. Глубокие вкусы, полумрак и никакого ритма большого города.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/booking">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 px-8 rounded-none border border-primary/50">
                Забронировать стол
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 uppercase tracking-widest text-xs h-14 px-8 rounded-none">
                Смотреть меню
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-white/20 animate-pulse" />
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-6 relative z-30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/3] overflow-hidden relative border border-white/5 p-4">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
              <img src={bearSkull} alt="Символ" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-serif font-bold mb-8 uppercase text-white">
              Не клуб.<br />Не кафе.<br /><span className="text-primary italic font-light lowercase">Берлога.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg leading-relaxed mb-6 font-light">
              Мы создали место, где город остается за дверью. «ГРИЗЛИ» — это тяжёлое дерево, потёртая кожа, приглушённый янтарный свет и густой дым.
            </motion.p>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg leading-relaxed font-light">
              Здесь некуда спешить. Мы уважаем личное пространство и ценим тишину. Это территория взрослых, где каждый вдох имеет глубину.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Craft */}
      <section id="craft" className="py-32 px-6 relative bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-4xl md:text-6xl font-serif font-bold text-white uppercase"
          >Глубина вкуса</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="w-24 h-px bg-primary mx-auto mt-8" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Табак", desc: "Слепая дегустация и ручной отбор. Только премиальный лист, способный отдать максимум аромата и крепости." },
            { title: "Мастера", desc: "Наши хука-сомелье не задают лишних вопросов. Пары слов достаточно, чтобы они собрали идеальную чашу под ваше настроение." },
            { title: "Процесс", desc: "Идеальный жар, правильный уголь и безупречная тяга. Мы контролируем каждую деталь, чтобы вы просто наслаждались." },
          ].map((item, i) => (
            <motion.div key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.8 } } }}
              className="p-8 border border-white/5 bg-background/50 backdrop-blur-sm flex flex-col items-center text-center group hover:border-primary/30 transition-colors duration-500"
            >
              <h3 className="text-2xl font-serif font-semibold text-white mb-4">{item.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bar */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex flex-col justify-center"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-serif font-bold mb-8 uppercase text-white">
              Тёмные<br /><span className="text-primary italic font-light lowercase">материи</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg leading-relaxed mb-6 font-light">
              Авторская коктейльная карта, вдохновлённая лесом, дымом и крепким характером. Выдержанные спирты, домашние настойки и дикие травы.
            </motion.p>
            <motion.ul variants={fadeIn} className="space-y-4 mt-4 mb-8">
              {[
                "Фирменный «Когти Гризли» на копчёном виски",
                "Коллекция выдержанных пуэров",
                "Крафтовое пиво из локальных пивоварен",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeIn}>
              <Link href="/menu">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-widest text-xs h-12 px-6 rounded-none">
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

      {/* Interior */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            className="w-full h-[60vh] md:h-[80vh] relative border border-white/5 p-4"
          >
            <img src={interior} alt="Интерьер" className="w-full h-full object-cover filter brightness-75" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-white text-center tracking-widest uppercase mix-blend-overlay opacity-80">
                Твоя территория
              </h2>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex items-center justify-between mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-white uppercase">Атмосфера</h2>
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
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative overflow-hidden group cursor-pointer ${img.span}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={img.src} alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-90" />
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
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-3xl md:text-5xl font-serif font-bold text-white mb-16 uppercase">
            Наши правила
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h4 className="text-primary font-serif text-xl mb-3">1. Возраст</h4>
              <p className="text-muted-foreground font-light">Строго 18+. Мы оставляем за собой право попросить документ. Без исключений.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h4 className="text-primary font-serif text-xl mb-3">2. Уважение</h4>
              <p className="text-muted-foreground font-light">Не повышаем голос, не включаем видео без наушников. Уважаем отдых друг друга.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-black border-t border-white/5 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase mb-6">Ждём вас</h2>
          <p className="text-muted-foreground font-light mb-10">
            г. Тюмень, ул. Новосёлов, 92 · <a href="tel:+79163283891" className="text-primary hover:underline">+7 (916) 328-38-91</a>
          </p>
          <Link href="/booking">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest text-xs h-14 px-10 rounded-none">
              Забронировать стол
            </Button>
          </Link>
        </motion.div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="text-2xl font-serif font-bold tracking-[0.2em] text-white/50">ГРИЗЛИ</div>
          <div className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} ГРИЗЛИ Hookah Lounge. Все права защищены.
          </div>
        </div>
      </section>
    </main>
  );
}
