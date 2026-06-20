const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Добавляем alert в startEdit
const oldStartEdit = `  const startEdit = (it: MenuItem) => { setAdding(null); setEdit({ ...it }); };`;
const newStartEdit = `  const startEdit = (it: MenuItem) => { alert('startEdit вызван! Item ID: ' + it.id); setAdding(null); setEdit({ ...it }); };`;

if (code.includes(oldStartEdit)) {
  code = code.replace(oldStartEdit, newStartEdit);
  fs.writeFileSync(path, code);
  console.log('✅ Alert добавлен в startEdit');
} else {
  console.log('❌ Не удалось найти startEdit');
}
