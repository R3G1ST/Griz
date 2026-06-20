const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Исправляем всплытие клика и добавляем условие показа только для кальянов
const oldCheckbox = `<label className="flex items-center gap-3 p-3 border border-lime/30 rounded bg-lime/5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!editing.isFeatured} 
                onChange={e => setEdit({ ...editing, isFeatured: e.target.checked ? 1 : 0 })}
                className="w-5 h-5 accent-lime"
              />
              <span className="text-lime text-sm font-bold uppercase tracking-wider">
                Сделать "Кальяном недели" (показать на главной)
              </span>
            </label>`;

const newCheckbox = `{(/кальян/i.test(editing.section) || /кальян/i.test(editing.category)) && (
              <label className="flex items-center gap-3 p-3 border border-lime/30 rounded bg-lime/5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!editing.isFeatured} 
                  onChange={e => { e.stopPropagation(); setEdit({ ...editing, isFeatured: e.target.checked ? 1 : 0 }); }}
                  onClick={e => e.stopPropagation()}
                  className="w-5 h-5 accent-lime"
                />
                <span className="text-lime text-sm font-bold uppercase tracking-wider">
                  Сделать "Кальяном недели" (показать на главной)
                </span>
              </label>
            )}`;

if (code.includes(oldCheckbox)) {
  code = code.replace(oldCheckbox, newCheckbox);
  fs.writeFileSync(path, code);
  console.log('✅ Чекбокс исправлен');
} else {
  console.log('❌ Не удалось найти чекбокс');
}
