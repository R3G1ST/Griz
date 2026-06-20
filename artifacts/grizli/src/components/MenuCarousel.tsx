import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

type MenuItem = {
  id: number;
  section: string;
  category: string;
  name: string;
  menuCategory?: string | null;
  image?: string | null;
};

type Props = {
  items: MenuItem[];
  onSelectCategory: (category: string) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  hookah: '🪐 HOOKAH',
  bar: '🍹 BAR',
  food: '🍔 FOOD',
  tea: '🫖 TEA',
};

export function MenuCarousel({ items, onSelectCategory }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const categories = Array.from(
    new Set(
      items
        .filter(i => i.menuCategory || i.section)
        .map(i => i.menuCategory || i.section)
    )
  ).filter(Boolean) as string[];

  const scroll = (dir: 'left' | 'right') => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ 
      left: dir === 'left' ? -300 : 300, 
      behavior: 'smooth' 
    });
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      {/* Стрелки только на ПК */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black hover:bg-neutral-900 rounded-full hidden md:flex items-center justify-center text-[#D4FF3F]"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      {/* Контейнер с скрытым скроллбаром */}
      <div 
        ref={containerRef}
        className="flex gap-4 overflow-x-auto px-4 md:px-12 py-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        {categories.map(cat => {
          const firstItem = items.find(i => (i.menuCategory || i.section) === cat);
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="flex-shrink-0 w-64 h-80 relative rounded-lg overflow-hidden group cursor-pointer"
            >
              {firstItem?.image ? (
                <img 
                  src={firstItem.image} 
                  alt={cat} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="gn-display text-2xl text-white uppercase">
                  {CATEGORY_LABELS[cat] || cat}
                </h3>
                <p className="gn-mono text-xs text-[#D4FF3F] mt-2">СМОТРЕТЬ МЕНЮ →</p>
              </div>
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black hover:bg-neutral-900 rounded-full hidden md:flex items-center justify-center text-[#D4FF3F]"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
