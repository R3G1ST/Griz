import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import NeonPage from "@/components/NeonPage";
import { CategoryMenu } from "@/components/CategoryMenu";
import { ProductCard } from "@/components/ProductCard";
import { type MenuItem, type MenuCategory } from "@/hooks/useSiteSettings";

function getTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("table");
}

function isMenuDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.includes("menu-grizzly");
}

let cachedItems: MenuItem[] | null = null;
let cachedCategories: MenuCategory[] | null = null;

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>(cachedItems || []);
  const [categories, setCategories] = useState<MenuCategory[]>(cachedCategories || []);
  const tableNumber = getTableNumber();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(!cachedItems || !cachedCategories);

  useEffect(() => {
    if (cachedItems && cachedCategories) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/menu').then(r => r.json()),
      fetch('/api/menu-categories').then(r => r.json())
    ]).then(([itemsData, categoriesData]) => {
      setItems(itemsData);
      setCategories(categoriesData.filter((c: MenuCategory) => c.is_active).sort((a: MenuCategory, b: MenuCategory) => a.display_order - b.display_order));
      cachedItems = itemsData;
      cachedCategories = categoriesData;
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#D4FF3F] text-xl">Загрузка меню...</div>
      </div>
    );
  }

  if (selectedItem) {
    return <ProductCard item={selectedItem} onClose={() => setSelectedItem(null)} />;
  }

  if (selectedCategory) {
    return (
      <CategoryMenu
        items={items}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSelectItem={setSelectedItem}
      />
    );
  }

  const menuContent = (
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

      <div className="mb-8">
        <div className="gn-mono text-[10px] tracking-[0.3em] text-[#D4FF3F]/80 mb-3">/ ВЫБЕРИТЕ КАТЕГОРИЮ</div>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
        {categories.map(cat => {
          const catItems = items.filter(i => i.isActive && i.menuCategory === cat.key);
          const subcategories = Array.from(new Set(catItems.map(i => i.category).filter(Boolean)));
          const titleSize = cat.title_size || 40;
          const titlePosition = cat.title_position || 50;
          
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className="flex-none w-[280px] sm:w-auto snap-start relative overflow-hidden rounded-lg text-left hover:scale-105 transition-transform duration-300 group"
              style={{
                backgroundImage: cat.image ? `url(${cat.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px',
                backgroundColor: !cat.image ? '#1a1a1a' : undefined
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Эмодзи сверху */}
              <div className="absolute top-6 left-6 z-10">
                {cat.emoji && <div className="text-5xl opacity-80">{cat.emoji}</div>}
              </div>
              
              {/* Название - позиция регулируется через title_position (%) */}
              <div 
                className="absolute left-6 right-6 z-10 pointer-events-none flex items-center justify-center"
                style={{ top: `${titlePosition}%`, transform: 'translateY(-50%)' }}
              >
                <h3 
                  className="gn-display text-white uppercase font-bold text-center tracking-wider drop-shadow-lg"
                  style={{ 
                    fontSize: `${titleSize}px`,
                    lineHeight: '1',
                    margin: 0
                  }}
                >
                  {cat.label}
                </h3>
              </div>
              
              {/* Подкатегории и кнопка снизу */}
              <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
                {subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.slice(0, 4).map(sub => (
                      <span key={sub} className="text-[11px] gn-mono tracking-wider text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                        {sub}
                      </span>
                    ))}
                    {subcategories.length > 4 && (
                      <span className="text-[11px] gn-mono tracking-wider text-white/80 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                        +{subcategories.length - 4}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="gn-mono text-[13px] text-[#D4FF3F] font-semibold">Открыть меню</span>
                  <span className="gn-mono text-[16px] text-[#D4FF3F] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/40 text-center">
        ЦЕНЫ В РУБЛЯХ · МЕНЮ МОЖЕТ МЕНЯТЬСЯ — УТОЧНЯЙТЕ У МАСТЕРА
      </div>
    </div>
  );

  if (isMenuDomain()) {
    return (
      <main className="min-h-screen bg-black text-white gn-root gn-sans">
        {menuContent}
      </main>
    );
  }

  return (
    <NeonPage
      eyebrow="/ MENU · LIVE FROM CMS"
      title={<>МЕНЮ <span className="gn-neon">ГРИЗЛИ</span></>}
      lead="Всё для идеального вечера — от чаши до последнего глотка."
    >
      {menuContent}
    </NeonPage>
  );
}
