import { motion } from "framer-motion";
import heroBg from "@/assets/images/hero-bg.png";
import bearSkull from "@/assets/images/bear-skull.png";
import cocktail from "@/assets/images/cocktail.png";
import interior from "@/assets/images/interior.png";
import Navbar from "@/components/Navbar";

const photos = [
  { src: heroBg,    label: "Основной зал",  desc: "Атмосфера вечернего Гризли" },
  { src: interior,  label: "Интерьер",       desc: "Грофитти-арт и живой декор" },
  { src: cocktail,  label: "Бар",            desc: "Авторские коктейли и напитки" },
  { src: bearSkull, label: "Арт-объект",     desc: "Символ заведения" },
  { src: heroBg,    label: "VIP-зона",       desc: "Приватные посадочные места" },
  { src: interior,  label: "Кальянная зона", desc: "Профессиональные кальяны" },
];

export default function Gallery() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <h1 className="text-6xl md:text-8xl font-serif uppercase text-white">Галерея</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="w-12 h-px bg-primary" />
            <p className="text-gray-400 tracking-widest uppercase text-sm">Атмосфера ГРИЗЛИ</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={photo.src} alt={photo.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <p className="text-primary text-xs uppercase tracking-widest mb-1">{photo.desc}</p>
                <p className="text-white font-serif text-xl uppercase">{photo.label}</p>
              </div>
              <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
