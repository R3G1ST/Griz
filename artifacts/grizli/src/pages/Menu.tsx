import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import NeonPage from "@/components/NeonPage";
import { useMenuItems, type MenuItem } from "@/hooks/useSiteSettings";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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

function SectionBlock({ section, index }: { section: Section; index: number }) {
  const isHookah = /кальян/i.test(section.section);
  return (
    <section className="mb-16 sm:mb-20">
      <div className="flex items-end justify-between gap-6 mb-8 sm:mb-10 pb-4 border-b border-[#D4FF3F]/20">
        <div>
          <div className="gn-mono text-[10px] tracking-[0.32em] text-[#D4FF3F]/80 mb-2">
            / 00{index + 1} {isHookah ? "— SMOKE LINE" : "— BAR LINE"}
          </div>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="gn-display gn-neon-white leading-[0.9] tracking-tighter"
            style={{ fontSize: "clamp(36px, 7vw, 72px)" }}
          >
            {section.section}
          </motion.h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[#D4FF3F]/70">
          {isHookah ? <Flame className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {section.groups.map((group, gi) => (
          <div key={gi}>
            <motion.h3
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="gn-mono text-[11px] tracking-[0.3em] text-[#D4FF3F] uppercase mb-5"
            >
              ── {group.category}
            </motion.h3>
            <ul className="space-y-1">
              {group.items.map((item, ii) => (
                <motion.li
                  key={item.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{
                    ...fadeIn,
                    visible: { ...fadeIn.visible, transition: { ...fadeIn.visible.transition, delay: Math.min(ii * 0.04, 0.25) } },
                  }}
                  className="group flex items-baseline gap-3 py-3 border-b border-white/5 hover:border-[#D4FF3F]/40 transition-colors"
                >
                  <span className="text-[#F5F1E8] text-[15px] sm:text-[16px] group-hover:text-[#D4FF3F] transition-colors">
                    {item.name}
                  </span>
                  <span className="flex-1 mx-2 border-b border-dotted border-white/10 translate-y-[-3px]" />
                  <span className="gn-mono text-[#D4FF3F] text-[13px] whitespace-nowrap">{item.price}</span>
                </motion.li>
              ))}
            </ul>
            {group.items.some(i => i.description) && (
              <div className="mt-3 space-y-1.5">
                {group.items.filter(i => i.description).map(i => (
                  <p key={`d-${i.id}`} className="text-[12px] text-[#F5F1E8]/45 leading-relaxed">
                    <span className="text-[#D4FF3F]/70 gn-mono text-[10px] mr-2">{i.name.toUpperCase()}</span>
                    {i.description}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Menu() {
  const items = useMenuItems();
  const tableNumber = getTableNumber();
  const sections = useMemo(() => buildSections(items), [items]);

  return (
    <NeonPage
      eyebrow="/ MENU · LIVE FROM CMS"
      title={<>МЕНЮ <span className="gn-neon">ГРИЗЛИ</span></>}
      lead="Всё для идеального вечера — от чаши до последнего глотка. Меню обновляется регулярно, цены актуальны."
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {tableNumber && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            className="mb-10 gn-glass-lime rounded-2xl px-6 py-5 flex items-center justify-between"
          >
            <div>
              <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F] mb-1">/ ВАШ СТОЛ</div>
              <div className="gn-display text-3xl gn-neon-white">Стол № {tableNumber}</div>
            </div>
            <Flame className="w-8 h-8 text-[#D4FF3F]" />
          </motion.div>
        )}

        {sections.length === 0 ? (
          <p className="text-[#F5F1E8]/55 text-center py-20 gn-mono text-sm tracking-[0.2em]">
            МЕНЮ ОБНОВЛЯЕТСЯ...
          </p>
        ) : (
          sections.map((s, i) => <SectionBlock key={i} section={s} index={i} />)
        )}

        <div className="mt-8 gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/40 text-center">
          ЦЕНЫ В РУБЛЯХ · МЕНЮ МОЖЕТ МЕНЯТЬСЯ — УТОЧНЯЙТЕ У МАСТЕРА
        </div>
      </div>
    </NeonPage>
  );
}
