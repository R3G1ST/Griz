import { useState, useEffect } from 'react';
import { Upload, Save, Trash2, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

type MenuCategory = {
  id?: number;
  key: string;
  label: string;
  emoji: string;
  image: string;
  display_order: number;
  is_active: boolean;
  title_size: number;
  title_position: number;
};

type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

export default function MenuCategoriesAdmin() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ key: '', label: '', emoji: '', display_order: 999, title_size: 40, title_position: 50 });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/menu-categories');
      const data = await res.json();
      setCategories(data.map((c: any) => ({ ...c, title_size: c.title_size || 40, title_position: c.title_position || 50 })));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally { setLoading(false); }
  };

  const handleImageUpload = async (categoryKey: string, file: File) => {
    setUploading(categoryKey);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`/api/upload-category-image/${categoryKey}`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) { await fetchCategories(); showToast('success', 'Фото загружено'); }
      else showToast('error', 'Ошибка загрузки фото');
    } catch { showToast('error', 'Ошибка загрузки фото'); }
    finally { setUploading(null); }
  };

  const updateCategory = async (id: number, updates: Partial<MenuCategory>) => {
    try {
      const res = await fetch(`/api/menu-categories/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates)
      });
      if (res.ok) { await fetchCategories(); showToast('success', 'Изменения сохранены'); }
      else showToast('error', 'Ошибка сохранения');
    } catch { showToast('error', 'Ошибка сохранения'); }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Удалить эту категорию?')) return;
    try {
      const res = await fetch(`/api/menu-categories/${id}`, { method: 'DELETE' });
      if (res.ok) { await fetchCategories(); showToast('success', 'Категория удалена'); }
      else showToast('error', 'Ошибка удаления');
    } catch { showToast('error', 'Ошибка удаления'); }
  };

  const clearEmoji = async (id: number) => {
    const cat = categories.find(c => c.id === id);
    if (cat) await updateCategory(id, { ...cat, emoji: '' });
  };

  const addCategory = async () => {
    if (!newCategory.key || !newCategory.label) { showToast('error', 'Заполните ключ и название'); return; }
    try {
      const res = await fetch('/api/menu-categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCategory)
      });
      if (res.ok) {
        setNewCategory({ key: '', label: '', emoji: '', display_order: 999, title_size: 40, title_position: 50 });
        setShowAddForm(false); await fetchCategories();
        showToast('success', `Категория "${newCategory.label}" создана`);
      } else showToast('error', 'Ошибка создания');
    } catch { showToast('error', 'Ошибка создания'); }
  };

  if (loading) return <div className="p-8 text-white">Загрузка...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Управление категориями меню</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#D4FF3F] text-black px-4 py-2 rounded-lg hover:bg-[#D4FF3F]/80 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить категорию
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white/5 rounded-lg p-6 border border-[#D4FF3F]/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Новая категория</h2>
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Ключ (латиница)</label>
                <input type="text" value={newCategory.key} onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value.toLowerCase() })} placeholder="desserts" className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Название</label>
                <input type="text" value={newCategory.label} onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })} placeholder="ДЕСЕРТЫ" className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Эмодзи</label>
                <input type="text" value={newCategory.emoji} onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })} placeholder="🍰" className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Порядок</label>
                <input type="number" value={newCategory.display_order} onChange={(e) => setNewCategory({ ...newCategory, display_order: parseInt(e.target.value) })} className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Размер текста (px)</label>
                <input type="number" value={newCategory.title_size} onChange={(e) => setNewCategory({ ...newCategory, title_size: parseInt(e.target.value) })} className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Высота текста (%)</label>
                <input type="number" value={newCategory.title_position} onChange={(e) => setNewCategory({ ...newCategory, title_position: parseInt(e.target.value) })} min="10" max="90" className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addCategory} className="bg-[#D4FF3F] text-black px-4 py-2 rounded-lg hover:bg-[#D4FF3F]/80 transition">Создать</button>
            <button onClick={() => setShowAddForm(false)} className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition">Отмена</button>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                {cat.image ? (
                  <img src={cat.image} alt={cat.label} className="w-full h-64 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center">
                    {cat.emoji ? <span className="text-8xl">{cat.emoji}</span> : <span className="text-4xl text-white/40">Нет изображения</span>}
                  </div>
                )}
                <label className={`absolute bottom-2 right-2 ${uploading === cat.key ? 'bg-gray-500' : 'bg-[#D4FF3F] hover:bg-[#D4FF3F]/80'} text-black px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-2`}>
                  <Upload className="w-4 h-4" />
                  {uploading === cat.key ? 'Загрузка...' : 'Загрузить фото'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(cat.key, e.target.files[0])} disabled={uploading === cat.key} />
                </label>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm text-white/60 mb-1">Название</label>
                    <input type="text" value={cat.label} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, label: e.target.value } : c))} className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
                  </div>
                  <button onClick={() => deleteCategory(cat.id!)} className="ml-4 bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition" title="Удалить">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Эмодзи</label>
                    <div className="flex gap-2">
                      <input type="text" value={cat.emoji || ''} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, emoji: e.target.value } : c))} className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
                      {cat.emoji && (
                        <button onClick={() => clearEmoji(cat.id!)} className="bg-white/10 text-white p-2 rounded hover:bg-white/20 transition" title="Удалить эмодзи">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Порядок</label>
                      <input type="number" value={cat.display_order} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, display_order: parseInt(e.target.value) } : c))} className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Размер (px)</label>
                      <input type="number" value={cat.title_size || 40} min="20" max="80" onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, title_size: parseInt(e.target.value) } : c))} className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Высота (%)</label>
                      <input type="number" value={cat.title_position || 50} min="10" max="90" onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, title_position: parseInt(e.target.value) } : c))} className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white" />
                    </div>
                  </div>

                  {/* Предпросмотр */}
                  <div className="relative bg-black/60 rounded-lg h-[200px] border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute top-4 left-4 z-10">
                      {cat.emoji && <div className="text-3xl opacity-80">{cat.emoji}</div>}
                    </div>
                    <div 
                      className="absolute left-4 right-4 z-10 flex items-center justify-center"
                      style={{ top: `${cat.title_position || 50}%`, transform: 'translateY(-50%)' }}
                    >
                      <span className="font-bold text-white uppercase tracking-wider drop-shadow-lg" style={{ fontSize: `${Math.min(cat.title_size || 40, 48)}px`, lineHeight: '1' }}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#D4FF3F] font-semibold">Открыть меню</span>
                        <span className="text-[14px] text-[#D4FF3F]">→</span>
                      </div>
                    </div>
                    {/* Линия-индикатор позиции */}
                    <div className="absolute left-0 right-0 border-t border-dashed border-[#D4FF3F]/30" style={{ top: `${cat.title_position || 50}%` }} />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={cat.is_active} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, is_active: e.target.checked } : c))} className="w-4 h-4" />
                      <span className="text-white">Активна</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60">
                    Ключ: <code className="bg-black/40 px-2 py-1 rounded text-[#D4FF3F]">{cat.key}</code>
                  </p>
                </div>

                <button onClick={() => updateCategory(cat.id!, cat)} className="bg-[#D4FF3F] text-black px-4 py-2 rounded-lg hover:bg-[#D4FF3F]/80 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Сохранить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
