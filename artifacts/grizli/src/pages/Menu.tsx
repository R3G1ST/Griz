import { motion } from "framer-motion";
import { Link } from "wouter";
import logo from "@/assets/images/logo.jpeg";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const hookahs = [
  {
    category: "Классика",
    items: [
      { name: "Двойное яблоко", desc: "Сбалансированный кисло-сладкий дым. Вечная классика.", price: "650 ₽" },
      { name: "Виноград с мятой", desc: "Свежесть, лёгкая сладость, долгое послевкусие.", price: "650 ₽" },
      { name: "Дыня", desc: "Нежный фруктовый аромат, мягкий дым.", price: "650 ₽" },
    ],
  },
  {
    category: "Авторские",
    items: [
      { name: "Берлога", desc: "Черника, смородина, лёгкий холодок. Фирменный микс.", price: "850 ₽" },
      { name: "Когти Гризли", desc: "Копчёный виски, дуб, ваниль. Тёмный и глубокий.", price: "950 ₽" },
      { name: "Таёжный дым", desc: "Кедр, брусника, смола. Аромат дикой природы.", price: "950 ₽" },
      { name: "Полярная ночь", desc: "Чёрная смородина, ментол, анис. Холодный и пряный.", price: "850 ₽" },
    ],
  },
  {
    category: "Премиум",
    items: [
      { name: "Чёрная метка", desc: "Эксклюзивный табак ручного отбора. Уточняйте у мастера.", price: "от 1 400 ₽" },
      { name: "Слепая дегустация", desc: "Мастер подбирает под ваш вкус. Сюрприз каждый раз.", price: "от 1 200 ₽" },
    ],
  },
];

const drinks = [
  {
    category: "Авторские коктейли",
    items: [
      { name: "Когти Гризли", desc: "Копчёный виски, мёд, лимон, биттер", price: "550 ₽" },
      { name: "Берлога", desc: "Джин, черника, тоник, розмарин", price: "490 ₽" },
      { name: "Медвежья кровь", desc: "Текила, гранат, чили, лайм", price: "520 ₽" },
      { name: "Дикий лес", desc: "Водка, брусника, имбирь, мята", price: "470 ₽" },
    ],
  },
  {
    category: "Чай и кофе",
    items: [
      { name: "Пуэр выдержанный", desc: "Коллекция от 3 до 15 лет выдержки", price: "от 350 ₽" },
      { name: "Иван-чай с мёдом", desc: "Сибирский иван-чай с таёжным мёдом", price: "280 ₽" },
      { name: "Эспрессо", desc: "Обжарка от местной кофейни", price: "200 ₽" },
      { name: "Капучино", desc: "Двойной эспрессо, молоко", price: "260 ₽" },
    ],
  },
  {
    category: "Безалкогольное",
    items: [
      { name: "Лимонад Тайга", desc: "Лесные ягоды, имбирь, газировка", price: "320 ₽" },
      { name: "Морс медвежий", desc: "Клюква, брусника, мёд", price: "280 ₽" },
      { name: "Вода", desc: "Негазированная / газированная", price: "150 ₽" },
    ],
  },
];

export default function Menu() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-3 flex justify-between items-center bg-background/95 backdrop-blur border-b border-white/5">
        <Link href="/">
          <img src={logo} alt="ГРИЗЛИ" className="h-12 w-12 object-contain rounded-full cursor-pointer" />
        </Link>
        <Link href="/">
          <span className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            ← На главную
          </span>
        </Link>
      </nav>

      <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-white uppercase mb-4">Меню</h1>
          <div className="w-20 h-px bg-primary mx-auto" />
          <p className="text-muted-foreground font-light mt-6 max-w-md mx-auto">
            Всё для идеального вечера — от чаши до последнего глотка.
          </p>
        </motion.div>

        {/* Hookahs */}
        <section className="mb-24">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-5xl font-serif text-white uppercase mb-12 pb-4 border-b border-white/10"
          >
            Кальяны
          </motion.h2>
          {hookahs.map((group, gi) => (
            <div key={gi} className="mb-12">
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-primary font-serif text-xl tracking-widest uppercase mb-6"
              >
                {group.category}
              </motion.h3>
              <div className="space-y-0">
                {group.items.map((item, ii) => (
                  <motion.div
                    key={ii}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: ii * 0.08 } } }}
                    className="flex justify-between items-start py-5 border-b border-white/5 group hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 pr-8">
                      <p className="text-white font-light text-lg group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-muted-foreground text-sm font-light mt-1">{item.desc}</p>
                    </div>
                    <span className="text-primary font-light text-sm tracking-wide whitespace-nowrap">{item.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Drinks */}
        <section>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-5xl font-serif text-white uppercase mb-12 pb-4 border-b border-white/10"
          >
            Напитки
          </motion.h2>
          {drinks.map((group, gi) => (
            <div key={gi} className="mb-12">
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-primary font-serif text-xl tracking-widest uppercase mb-6"
              >
                {group.category}
              </motion.h3>
              <div className="space-y-0">
                {group.items.map((item, ii) => (
                  <motion.div
                    key={ii}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: ii * 0.08 } } }}
                    className="flex justify-between items-start py-5 border-b border-white/5 group hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 pr-8">
                      <p className="text-white font-light text-lg group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-muted-foreground text-sm font-light mt-1">{item.desc}</p>
                    </div>
                    <span className="text-primary font-light text-sm tracking-wide whitespace-nowrap">{item.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-16 text-center text-muted-foreground text-sm font-light"
        >
          Цены указаны в рублях. Меню может меняться — уточняйте у мастера.
        </motion.div>
      </div>
    </main>
  );
}
