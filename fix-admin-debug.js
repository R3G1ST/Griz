const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Добавляем console.log перед отправкой
const oldSave = `  const save = async (item: Partial<MenuItem>) => {
    try {
      let response;
      if (item.id) {
        response = await adminFetch(\`\${API_BASE}/menu/\${item.id}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      } else {
        response = await adminFetch(\`\${API_BASE}/menu\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      }`;

const newSave = `  const save = async (item: Partial<MenuItem>) => {
    console.log('Saving item:', item);
    try {
      let response;
      if (item.id) {
        response = await adminFetch(\`\${API_BASE}/menu/\${item.id}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      } else {
        response = await adminFetch(\`\${API_BASE}/menu\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      }`;

if (code.includes(oldSave)) {
  code = code.replace(oldSave, newSave);
  fs.writeFileSync(path, code);
  console.log('✅ Отладка добавлена');
} else {
  console.log('❌ Не удалось найти save()');
}
