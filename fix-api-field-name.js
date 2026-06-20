const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Исправляем is_featured на isFeatured (имя поля в схеме Drizzle)
code = code.replace(/updates\.is_featured/g, 'updates.isFeatured');

fs.writeFileSync(path, code);
console.log('✅ Имя поля исправлено: is_featured -> isFeatured');
