import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import logoDefault from "@/assets/images/logo.jpeg";
import { useSiteSettings, imgSrc } from "@/hooks/useSiteSettings";

const NAV_LINKS = [
  { label: "Главная",       href: "/" },
  { label: "Меню",          href: "/menu" },
  { label: "Галерея",       href: "/gallery" },
  { label: "Отзывы",        href: "/reviews" },
  { label: "Лояльность",    href: "/loyalty" },
  { label: "Бронирование",  href: "/booking" },
  { label: "Контакты",      href: "/card" },
];

export default function Navbar() {
  const { images } = useSiteSettings();
  const logo = imgSrc(images, "logo", logoDefault);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-3 flex justify-between items-center bg-black/80 backdrop-blur border-b border-white/5">
        <Link href="/">
          <img src={logo} alt="ГРИЗЛИ" className="h-12 w-12 object-contain rounded-full cursor-pointer" />
        </Link>
        <div className="hidden lg:flex gap-7 text-[11px] xl:text-xs font-medium tracking-[0.2em] uppercase text-white items-center">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-primary transition-colors cursor-pointer ${location === link.href ? "text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="lg:hidden text-white p-2"
          aria-label="Меню"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-10"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-white"
            >
              <X className="w-8 h-8" />
            </button>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-4xl font-serif hover:text-primary transition-colors uppercase tracking-widest cursor-pointer ${location === link.href ? "text-primary" : "text-white"}`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
