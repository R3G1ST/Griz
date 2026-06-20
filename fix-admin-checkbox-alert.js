const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Находим чекбокс isFeatured и добавляем alert
const oldCheckbox = `                  <input 
                    type="checkbox" 
                    checked={!!editing.isFeatured} 
                    onChange={e => setEdit({ ...editing, isFeatured: e.target.checked ? 1 : 0 })}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 accent-lime"
                  />`;

const newCheckbox = `                  <input 
                    type="checkbox" 
                    checked={!!editing.isFeatured} 
                    onChange={e => { alert('Checkbox changed! New value: ' + e.target.checked); setEdit({ ...editing, isFeatured: e.target.checked ? 1 : 0 }); }}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 accent-lime"
                  />`;

if (code.includes(oldCheckbox)) {
  code = code.replace(oldCheckbox, newCheckbox);
  fs.writeFileSync(path, code);
  console.log('✅ Alert добавлен в чекбокс');
} else {
  console.log('❌ Не удалось найти чекбокс');
}
