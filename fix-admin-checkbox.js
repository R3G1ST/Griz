const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Находим блок с кнопками сохранения и добавляем чекбокс перед ним
const oldButtons = `            <div className="flex gap-2 pt-4">
              <button onClick={() => save(editing)} className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-2 text-xs hover:bg-lime/80">
                Сохранить
              </button>`;

const newButtons = `            <label className="flex items-center gap-3 p-3 border border-lime/30 rounded bg-lime/5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!editing.isFeatured} 
                onChange={e => setEdit({ ...editing, isFeatured: e.target.checked ? 1 : 0 })}
                className="w-5 h-5 accent-lime"
              />
              <span className="text-lime text-sm font-bold uppercase tracking-wider">
                Сделать "Кальяном недели" (показать на главной)
              </span>
            </label>
            <div className="flex gap-2 pt-4">
              <button onClick={() => save(editing)} className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-2 text-xs hover:bg-lime/80">
                Сохранить
              </button>`;

if (code.includes(oldButtons)) {
  code = code.replace(oldButtons, newButtons);
  fs.writeFileSync(path, code);
  console.log('✅ Чекбокс добавлен в форму');
} else {
  console.log('❌ Не удалось найти блок кнопок');
}
