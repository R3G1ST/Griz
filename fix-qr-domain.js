const fs = require('fs');
const filePath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Находим старую логику определения домена
const oldDomainLogic = `const SITE_DOMAIN = (() => {
  // In admin, API calls go to /api (same origin via proxy), but we need the public site domain for QR
  const host = window.location.host;
  // The admin is at /admin/, grizli is at /
  return \`\${window.location.protocol}//\${host}\`;
})();`;

// Заменяем на жёстко заданный домен основного сайта
const newDomainLogic = `const SITE_DOMAIN = "https://grizzly-lounge.qmbox.ru";`;

if (!code.includes(oldDomainLogic)) {
  console.log('❌ Не удалось найти старый код. Возможно, он уже изменён.');
  process.exit(1);
}

code = code.replace(oldDomainLogic, newDomainLogic);
fs.writeFileSync(filePath, code);
console.log('✅ Домен для QR-кодов исправлен на основной сайт!');
