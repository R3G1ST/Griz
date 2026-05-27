import { Link } from "wouter";
import { Phone, MapPin, Send } from "lucide-react";
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
