import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/Navbar";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const hookahs = [
  {
    category: "Классика",
    items: [
      { name: "Двойное яблоко",  desc: "Сбалансированный кисло-сладкий дым. Вечная классика.", price: "650 ₽" },
      { name: "Виноград с мятой", desc: "Свежесть, лёгкая сладость, долгое послевкусие.",      price: "650 ₽" },
      { name: "Дыня",             desc: "Нежный фруктовый аромат, мягкий дым.",                price: "650 ₽" },
    ],
  },
  {
    category: "Авторские",
    items: [
      { name: "Берлога",       desc: "Черника, смородина, лёгкий холодок. Фирменный микс.",    price: "850 ₽" },
      { name: "Когти Гризли",  desc: "Копчёный виски, дуб, ваниль. Тёмный и глубокий.",        price: "950 ₽" },
      { name: "Таёжный дым",   desc: "Кедр, брусника, смола. Аромат дикой природы.",           price: "950 ₽" },
      { name: "Полярная ночь", desc: "Чёрная смородина, ментол, анис. Холодный и пряный.",     price: "850 ₽" },
    ],
  },
  {
    category: "Премиум",
    items: [
      { name: "Чёрная метка",      desc: "Эксклюзивный табак ручного отбора. Уточняйте у мастера.", price: "от 1 400 ₽" },
      { name: "Слепая дегустация", desc: "Мастер подбирает под ваш вкус. Сюрприз каждый раз.",      price: "от 1 200 ₽" },
    ],
  },
];

const drinks = [
  {
    category: "Авторские коктейли",
    items: [
      { name: "Когти Гризли",   desc: "Копчёный виски, мёд, лимон, биттер",    price: "550 ₽" },
      { name: "Берлога",        desc: "Джин, черника, тоник, розмарин",         price: "490 ₽" },
      { name: "Медвежья кровь", desc: "Текила, гранат, чили, лайм",             price: "520 ₽" },
      { name: "Дикий лес",      desc: "Водка, брусника, имбирь, мята",          price: "470 ₽" },
    ],
  },
  {
    category: "Чай и кофе",
    items: [
      { name: "Пуэр выдержанный",   desc: "Коллекция от 3 до 15 лет выдержки",       price: "от 350 ₽" },
      { name: "Иван-чай с мёдом",   desc: "Сибирский иван-чай с таёжным мёдом",      price: "280 ₽" },
      { name: "Эспрессо",           desc: "Обжарка от местной кофейни",              price: "200 ₽" },
      { name: "Капучино",           desc: "Двойной эспрессо, молоко",               price: "260 ₽" },
    ],
  },
  {
    category: "Безалкогольное",
    items: [
      { name: "Лимонад Тайга", desc: "Лесные ягоды, имбирь, газировка",          price: "320 ₽" },
      { name: "Морс медвежий", desc: "Клюква, брусника, мёд",                    price: "280 ₽" },
      { name: "Вода",          desc: "Негазированная / газированная",             price: "150 ₽" },
    ],
  },
];

function getTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("table");
}

function MenuSection({ title, groups }: { title: string; groups: typeof hookahs }) {
  return (
    <section className="mb-24">
      <motion.h2
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="text-3xl md:text-5xl font-serif text-white uppercase mb-12 pb-4 border-b border-white/10"
      >{title}</motion.h2>
      {groups.map((group, gi) => (
        <div key={gi} className="mb-12">
          <motion.h3
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-primary font-serif text-xl tracking-widest uppercase mb-6"
          >{group.category}</motion.h3>
          <div className="space-y-0">
            {group.items.map((item, ii) => (
              <motion.div key={ii}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
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
  );
}

export default function Menu() {
  const tableNumber = getTableNumber();
  const menuUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto">

        {/* Table banner */}
        {tableNumber && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 mt-4 border border-primary/40 bg-primary/10 px-6 py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-primary text-xs uppercase tracking-widest mb-1">Вы сидите за</p>
              <p className="text-white text-2xl font-serif font-bold">Стол № {tableNumber}</p>
            </div>
            <span className="text-4xl">🐻</span>
          </motion.div>
        )}

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-serif text-white uppercase mb-4">Меню</h1>
          <div className="w-20 h-px bg-primary mx-auto" />
          <p className="text-muted-foreground font-light mt-6 max-w-md mx-auto">
            Всё для идеального вечера — от чаши до последнего глотка.
          </p>
        </motion.div>

        <MenuSection title="Кальяны" groups={hookahs} />
        <MenuSection title="Напитки" groups={drinks} />

        {/* QR section — for printing / sharing */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="mt-16 border border-white/10 p-8 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="bg-white p-4 rounded">
            <QRCodeSVG value={menuUrl || "https://grizli.ru/menu"} size={120} />
          </div>
          <div>
            <p className="text-white font-serif text-xl mb-2">QR-код меню</p>
            <p className="text-muted-foreground font-light text-sm">
              Отсканируйте, чтобы открыть меню на своём телефоне{tableNumber ? ` (Стол №${tableNumber})` : ""}.
            </p>
            {menuUrl && (
              <p className="text-primary/60 text-xs mt-2 break-all">{menuUrl}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="mt-10 text-center text-muted-foreground text-sm font-light"
        >
          Цены указаны в рублях. Меню может меняться — уточняйте у мастера.
        </motion.div>
      </div>
    </main>
  );
}
