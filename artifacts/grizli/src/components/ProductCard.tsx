import { X } from 'lucide-react';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  ingredients?: string;
  allergens?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
};

type Props = {
  item: MenuItem;
  onClose: () => void;
};

export function ProductCard({ item, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <X className="w-6 h-6" />
        </button>

        {item.image && (
          <img src={item.image} alt={item.name} className="w-full h-96 object-cover rounded-lg mb-6" />
        )}

        <div className="space-y-6">
          <div>
            <h2 className="gn-display text-4xl text-white uppercase">{item.name}</h2>
            <p className="gn-mono text-2xl text-[#D4FF3F] mt-2">{item.price}</p>
          </div>

          <p className="gn-mono text-base text-white/80 leading-relaxed">{item.description}</p>

          {item.ingredients && (
            <div>
              <h3 className="gn-mono text-sm text-white/50 uppercase tracking-widest mb-2">Состав</h3>
              <p className="gn-mono text-sm text-white/80">{item.ingredients}</p>
            </div>
          )}

          {item.allergens && (
            <div>
              <h3 className="gn-mono text-sm text-white/50 uppercase tracking-widest mb-2">Аллергены</h3>
              <p className="gn-mono text-sm text-red-400">{item.allergens}</p>
            </div>
          )}

          {(item.calories || item.protein || item.fat || item.carbs) && (
            <div>
              <h3 className="gn-mono text-sm text-white/50 uppercase tracking-widest mb-3">Пищевая ценность на 100г</h3>
              <div className="grid grid-cols-4 gap-4">
                {item.calories && (
                  <div className="text-center">
                    <div className="gn-mono text-2xl text-[#D4FF3F]">{item.calories}</div>
                    <div className="gn-mono text-xs text-white/50">ККАЛ</div>
                  </div>
                )}
                {item.protein && (
                  <div className="text-center">
                    <div className="gn-mono text-2xl text-white">{item.protein}г</div>
                    <div className="gn-mono text-xs text-white/50">БЕЛКИ</div>
                  </div>
                )}
                {item.fat && (
                  <div className="text-center">
                    <div className="gn-mono text-2xl text-white">{item.fat}г</div>
                    <div className="gn-mono text-xs text-white/50">ЖИРЫ</div>
                  </div>
                )}
                {item.carbs && (
                  <div className="text-center">
                    <div className="gn-mono text-2xl text-white">{item.carbs}г</div>
                    <div className="gn-mono text-xs text-white/50">УГЛЕВОДЫ</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
