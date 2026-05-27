import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import NeonPage from "@/components/NeonPage";
import { useSiteSettings, imgSrc } from "@/hooks/useSiteSettings";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import heroBgDefault from "@/assets/images/hero-bg.png";
import bearSkullDefault from "@/assets/images/bear-skull.png";
import cocktailDefault from "@/assets/images/cocktail.png";
import interiorDefault from "@/assets/images/interior.png";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = (p: string) => `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${p}`;

type GalleryImage = { id: number; url: string; caption: string; sortOrder: number };

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const { images } = useSiteSettings();
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(!!lightbox, lightboxRef);

  const heroBg    = imgSrc(images, "heroBg",    heroBgDefault);
  const bearSkull = imgSrc(images, "bearSkull", bearSkullDefault);
  const cocktail  = imgSrc(images, "cocktail",  cocktailDefault);
  const interior  = imgSrc(images, "interior",  interiorDefault);

  useEffect(() => {
    const FALLBACK: GalleryImage[] = [
      { id: -1, url: heroBg,    caption: "Основной зал",   sortOrder: 1 },
      { id: -2, url: interior,  caption: "Интерьер",        sortOrder: 2 },
      { id: -3, url: cocktail,  caption: "Бар",             sortOrder: 3 },
      { id: -4, url: bearSkull, caption: "Арт-объект",      sortOrder: 4 },
      { id: -5, url: heroBg,    caption: "VIP-зона",        sortOrder: 5 },
      { id: -6, url: interior,  caption: "Кальянная зона",  sortOrder: 6 },
    ];
    fetch(API("/api/gallery"))
      .then(r => r.json())
      .then((d: GalleryImage[]) => setPhotos(d.length > 0 ? d : FALLBACK))
      .catch(() => setPhotos(FALLBACK));
  }, [heroBg, bearSkull, cocktail, interior]);

  // Esc closes lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [lightbox]);

  return (
    <NeonPage
      eyebrow="/ GALLERY · АТМОСФЕРА"
      title={<>ВНУТРИ <span className="gn-neon">БЕРЛОГИ</span></>}
      lead="Зал, бар, кальянная зона и арт-объекты. Свет приглушён, ритм — низкий."
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((photo, i) => (
            <motion.button
              type="button"
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.35), ease: "easeOut" }}
              onClick={() => setLightbox(photo)}
              className="group relative gn-corner overflow-hidden rounded-md text-left bg-black"
              aria-label={`Открыть фото: ${photo.caption}`}
            >
              <span className="c1" /><span className="c2" />
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-[0.7] group-hover:brightness-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4">
                <div className="gn-mono text-[9px] tracking-[0.28em] text-[#D4FF3F]/90 mb-1">
                  / 00{(i % 9) + 1}
                </div>
                <p className="gn-display text-[#F5F1E8] text-base sm:text-xl tracking-tight">{photo.caption}</p>
              </div>
              <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-[#D4FF3F]/40 transition" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.caption}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 text-[#D4FF3F] p-2"
              aria-label="Закрыть"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              src={lightbox.url}
              alt={lightbox.caption}
              className="max-w-full max-h-[88vh] object-contain gn-neon-box rounded-md"
              onClick={e => e.stopPropagation()}
            />
            {lightbox.caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 gn-glass rounded-full px-5 py-2">
                <span className="gn-mono text-[11px] tracking-[0.22em] text-[#D4FF3F]">{lightbox.caption.toUpperCase()}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </NeonPage>
  );
}
