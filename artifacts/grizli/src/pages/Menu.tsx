import { useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMenuItems, type MenuItem } from "@/hooks/useSiteSettings";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

function getTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("table");
}

type Group = { category: string; items: MenuItem[] };
type Section = { section: string; groups: Group[] };

function buildSections(items: MenuItem[]): Section[] {
  const sectionMap = new Map<string, Map<string, MenuItem[]>>();
  for (const it of items) {
    if (!it.isActive) continue;
    if (!sectionMap.has(it.section)) sectionMap.set(it.section, new Map());
    const g = sectionMap.get(it.section)!;
    if (!g.has(it.category)) g.set(it.category, []);
    g.get(it.category)!.push(it);
  }
  return Array.from(sectionMap.entries()).map(([section, gMap]) => ({
    section,
    groups: Array.from(gMap.entries()).map(([category, items]) => ({ category, items })),
  }));
}

function MenuSection({ section }: { section: Section }) {
  return (
    <section className="mb-20 md:mb-24">
      <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="font-serif text-white uppercase mb-10 pb-4 border-b border-white/10 break-words"
        style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)", lineHeight: 1 }}
      >{section.section}</motion.h2>
      {section.groups.map((group, gi) => (
        <div key={gi} className="mb-10">
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-primary font-serif text-lg md:text-xl tracking-widest uppercase mb-5"
          >{group.category}</motion.h3>
          <div className="space-y-0">
            {group.items.map((item, ii) => (
              <motion.div key={item.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: Math.min(ii * 0.05, 0.3) } } }}
                className="flex justify-between items-start gap-4 py-4 md:py-5 border-b border-white/5 group hover:border-primary/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-light text-base md:text-lg group-hover:text-primary transition-colors">{item.name}</p>
                  {item.description && <p className="text-muted-foreground text-xs md:text-sm font-light mt-1">{item.description}</p>}
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
  const items = useMenuItems();
  const tableNumber = getTableNumber();
  const sections = useMemo(() => buildSections(items), [items]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-noise" />
      <Navbar />
      <div className="pt-24 pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        {tableNumber && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 mt-4 border border-primary/40 bg-primary/10 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-primary text-xs uppercase tracking-widest mb-1">Вы сидите за</p>
              <p className="text-white text-2xl font-serif font-bold">Стол № {tableNumber}</p>
            </div>
            <span className="text-4xl">🐻</span>
          </motion.div>
        )}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
          <h1 className="font-serif text-white uppercase mb-4 break-words"
              style={{ fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 0.95 }}>Меню</h1>
          <div className="w-20 h-px bg-primary mx-auto" />
          <p className="text-muted-foreground font-light mt-6 max-w-md mx-auto">
            Всё для идеального вечера — от чаши до последнего глотка.
          </p>
        </motion.div>
        {sections.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">Меню обновляется...</p>
        ) : (
          sections.map((s, i) => <MenuSection key={i} section={s} />)
        )}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="mt-8 text-center text-muted-foreground text-sm font-light">
          Цены указаны в рублях. Меню может меняться — уточняйте у мастера.
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
