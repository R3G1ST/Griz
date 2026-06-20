const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Добавляем уведомление об успехе в save() для меню
code = code.replace(
  "setEdit(null); setAdding(null); load();",
  "setEdit(null); setAdding(null); load();\n      showNiceAlert(item.id ? 'Позиция обновлена' : 'Позиция добавлена');"
);

// 2. Добавляем отладку в саму функцию showNiceAlert
code = code.replace(
  "function showNiceAlert(msg: string, isError = false) {",
  "function showNiceAlert(msg: string, isError = false) {\n  console.log('🔔 showNiceAlert вызвана:', msg, isError);"
);

fs.writeFileSync(path, code);
console.log('✅ Добавлено уведомление об успехе');
