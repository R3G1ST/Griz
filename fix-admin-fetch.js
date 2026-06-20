const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Находим и заменяем adminFetch
const oldFetch = `const adminFetch = (url: string, init: RequestInit = {}) => {
  return fetch(url, { ...init, credentials: "include" });
};`;

const newFetch = `const ADMIN_PASSWORD = "grizli2024";
const adminFetch = (url: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set("x-admin-password", ADMIN_PASSWORD);
  return fetch(url, { ...init, headers });
};`;

if (code.includes(oldFetch)) {
  code = code.replace(oldFetch, newFetch);
  fs.writeFileSync(path, code);
  console.log('✅ adminFetch исправлен - добавлен заголовок авторизации');
} else {
  // Пробуем найти текущую версию
  const currentFetch = code.match(/const adminFetch = \(url: string, init: RequestInit = \{\}\) => \{[\s\S]*?\n\};/);
  if (currentFetch) {
    code = code.replace(currentFetch[0], newFetch);
    fs.writeFileSync(path, code);
    console.log('✅ adminFetch исправлен');
  } else {
    console.log('❌ Не удалось найти adminFetch');
  }
}
