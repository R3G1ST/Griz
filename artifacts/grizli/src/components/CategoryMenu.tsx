import { X } from 'lucide-react';
import { useMemo } from 'react';

type MenuItem = {
  id: number;
  section: string;
  category: string;
  name: string;
  description: string;
  price: string;
  menuCategory?: string | null;
  image?: string | null;
  status?: string | null;
  isVisible?: number | null;
  outOfStock?: number | null;
  isActive?: number | null;
};

type Props = {
  items: MenuItem[];
  category: string;
  onClose: () => void;
  onSelectItem: (item: MenuItem) => void;
};

export function CategoryMenu({ items, category, onClose, onSelectItem }: Props) {
  const categoryItems = items.filter(i => {
    const cat = i.menuCategory || i.section;
    return (cat === category || i.section === category) && i.isActive === 1;
  });

  // Группируем по подкатегориям и сортируем (Допы в конце)
  const groupedItems = useMemo(() => {
    const groups = new Map<string, MenuItem[]>();
    categoryItems.forEach(item => {
      const subcat = item.category || 'Другое';
      if (!groups.has(subcat)) groups.set(subcat, []);
      groups.get(subcat)!.push(item);
    });
    // Сортируем: "Допы" всегда в конце
    return Array.from(groups.entries()).sort(([a], [b]) => {
      const aIsDop = /доп/i.test(a);
      const bIsDop = /доп/i.test(b);
      if (aIsDop && !bIsDop) return 1;
      if (!aIsDop && bIsDop) return -1;
      return 0;
    });
  }, [categoryItems]);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="gn-display text-4xl text-white uppercase">{category}</h2>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {groupedItems.length === 0 ? (
          <p className="text-white/50 text-center py-12">В этой категории пока нет позиций</p>
        ) : (
          <div className="space-y-8">
            {groupedItems.map(([subcategory, items]) => (
              <div key={subcategory}>
                <h3 className="gn-mono text-sm tracking-[0.2em] uppercase text-[#D4FF3F] mb-4 pb-2 border-b border-[#D4FF3F]/20">
                  {subcategory}
                </h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="w-full flex gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition group text-left"
                    >
                      {item.image && item.image !== 'null' && item.image.trim() !== '' && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0" 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="gn-mono text-lg text-white font-bold">{item.name}</h4>
                          <span className="gn-mono text-lg text-[#D4FF3F] whitespace-nowrap">{item.outOfStock === 1 ? "Нет в наличии" : item.price}</span>
                        </div>
                        <p className="gn-mono text-sm text-white/60 mt-1 line-clamp-2">{item.description}</p>
                        {item.status === 'stop' && (
                          <span className="inline-block mt-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                            ВРЕМЕННО НЕДОСТУПНО
                          </span>
                        )}
                        {item.status === 'coming-soon' && (
                          <span className="inline-block mt-2 px-2 py-1 bg-[#D4FF3F]/20 text-[#D4FF3F] text-xs rounded">
                            СКОРО БУДЕТ
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
