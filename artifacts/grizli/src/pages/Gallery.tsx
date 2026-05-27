import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBg from "@/assets/images/hero-bg.png";
import bearSkull from "@/assets/images/bear-skull.png";
import cocktail from "@/assets/images/cocktail.png";
import interior from "@/assets/images/interior.png";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;

type GalleryImage = { id: number; url: string; caption: string; sortOrder: number };

const FALLBACK: GalleryImage[] = [
  { id: -1, url: heroBg,    caption: "Основной зал",   sortOrder: 1 },
  { id: -2, url: interior,  caption: "Интерьер",        sortOrder: 2 },
  { id: -3, url: cocktail,  caption: "Бар",             sortOrder: 3 },
  { id: -4, url: bearSkull, caption: "Арт-объект",      sortOrder: 4 },
  { id: -5, url: heroBg,    caption: "VIP-зона",        sortOrder: 5 },
  { id: -6, url: interior,  caption: "Кальянная зона",  sortOrder: 6 },
];

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch(API("/api/gallery")).then(r => r.json()).then((d: GalleryImage[]) => {
      setPhotos(d.length > 0 ? d : FALLBACK);
    }).catch(() => setPhotos(FALLBACK));
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <h1 className="font-serif uppercase text-white break-words"
              style={{ fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 0.95 }}>Галерея</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="w-12 h-px bg-primary" />
            <p className="text-gray-400 tracking-widest uppercase text-xs sm:text-sm">Атмосфера ГРИЗЛИ</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {photos.map((photo, i) => (
            <motion.div key={photo.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
              onClick={() => setLightbox(photo)}
              className="group relative overflow-hidden cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={photo.url} alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100" />
              </div>
              {photo.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-serif text-base md:text-xl uppercase">{photo.caption}</p>
                </div>
              )}
              <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt={lightbox.caption} className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}

      <Footer />
    </main>
  );
}
