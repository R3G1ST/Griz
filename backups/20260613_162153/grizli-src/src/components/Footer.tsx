import { Link } from "wouter";
import { Phone, MapPin, Send, Instagram } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const { contacts, schedule, brand, footer } = useSiteSettings();
  return (
    <footer className="bg-black border-t border-white/5 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <h3 className="font-serif text-2xl text-primary tracking-widest uppercase mb-3">{brand.name}</h3>
          <p className="text-muted-foreground text-sm font-light">{footer.tagline}</p>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-4">Основано в {brand.estYear}</p>
        </div>
        <div>
          <h4 className="text-white text-xs tracking-widest uppercase mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm font-light">
            {[
              { label: "Главная", href: "/" },
              { label: "Меню", href: "/menu" },
              { label: "Галерея", href: "/gallery" },
              { label: "Отзывы", href: "/reviews" },
              { label: "Бронирование", href: "/booking" },
            ].map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-xs tracking-widest uppercase mb-4">Контакты</h4>
          <ul className="space-y-2 text-sm font-light text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <a href={`tel:${contacts.phone.replace(/[^\d+]/g, "")}`} className="hover:text-primary transition-colors">{contacts.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{contacts.address}</span>
            </li>
            {contacts.telegram && (
              <li className="flex items-start gap-2">
                <Send className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Telegram</a>
              </li>
            )}
            {contacts.instagram && (
              <li className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href={contacts.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
              </li>
            )}
            {contacts.vk && (
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm-1.93 14.26h-1.47c-.55 0-.72-.44-1.71-1.44-.86-.83-1.23-.94-1.45-.94-.31 0-.39.09-.39.51v1.31c0 .36-.11.57-1.06.57-1.57 0-3.31-.95-4.53-2.72C.89 11.23.5 9.24.5 8.81c0-.22.09-.42.51-.42h1.47c.38 0 .52.17.67.57.73 2.12 1.95 3.98 2.45 3.98.19 0 .27-.09.27-.57v-2.18c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.36-.34h2.31c.31 0 .42.17.42.54v2.93c0 .31.14.42.23.42.19 0 .34-.11.69-.46 1.07-1.2 1.83-3.05 1.83-3.05.1-.22.27-.42.65-.42h1.47c.44 0 .54.22.44.54-.19.89-2.03 3.54-2.03 3.54-.16.26-.22.38 0 .67.16.22.69.67 1.04 1.08.65.74 1.15 1.36 1.28 1.79.14.42-.08.64-.5.64z"/>
                </svg>
                <a href={contacts.vk} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">ВКонтакте</a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-xs tracking-widest uppercase mb-4">График</h4>
          <ul className="space-y-2 text-sm font-light text-muted-foreground">
            {schedule.map(s => (
              <li key={s.days} className="flex justify-between gap-2">
                <span>{s.days}</span><span className="text-white/80">{s.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 max-w-7xl mx-auto">
        <p className="text-white/30 text-xs tracking-widest uppercase">{footer.copyright} · {new Date().getFullYear()}</p>
        <p className="text-white/20 text-xs">18+</p>
      </div>
    </footer>
  );
}
