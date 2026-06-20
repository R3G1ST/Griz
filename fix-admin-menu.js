const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Обновляем тип MenuItem
code = code.replace(
  'sortOrder: number; isActive: number };',
  'sortOrder: number; isActive: number; isFeatured: number };'
);

// 2. Обновляем начальное состояние при добавлении
code = code.replace(
  'name: "", description: "", price: "", sortOrder: 0, isActive: 1,',
  'name: "", description: "", price: "", sortOrder: 0, isActive: 1, isFeatured: 0,'
);

// 3. Добавляем чекбокс в форму редактирования
const checkboxHtml = `
          <div className="flex items-center gap-3 mt-4 p-3 border border-lime/30 rounded bg-lime/5">
            <input 
              type="checkbox" 
              id="isFeatured" 
              checked={editing.isFeatured === 1} 
              onChange={e => setEdit(prev => prev ? {...prev, isFeatured: e.target.checked ? 1 : 0} : null)}
              className="w-5 h-5 accent-lime"
            />
            <label htmlFor="isFeatured" className="text-lime text-sm font-bold uppercase tracking-wider cursor-pointer">
              Сделать "Кальяном недели" (показать на главной)
            </label>
          </div>
`;

// Вставляем чекбокс перед кнопками сохранения
code = code.replace(
  '<div className="flex gap-2 mt-4">',
  checkboxHtml + '\n          <div className="flex gap-2 mt-4">'
);

fs.writeFileSync(path, code);
console.log('✅ Админка обновлена');
