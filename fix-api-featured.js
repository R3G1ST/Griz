const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Исправляем логику isFeatured и добавляем логирование
const oldLogic = `    const b = req.body ?? {};
    const updates: Record<string, unknown> = {};
    
    // Просто сохраняем isFeatured если он есть
    if (b.isFeatured !== undefined) {
      updates.is_featured = b.isFeatured ? 1 : 0;
    }`;

const newLogic = `    const b = req.body ?? {};
    const updates: Record<string, unknown> = {};
    
    // Сохраняем isFeatured - может прийти как boolean или число
    if (b.isFeatured !== undefined) {
      updates.is_featured = (b.isFeatured === true || b.isFeatured === 1) ? 1 : 0;
      console.log('isFeatured received:', b.isFeatured, '-> setting to:', updates.is_featured);
    }`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync(path, code);
  console.log('✅ Логика isFeatured исправлена');
} else {
  console.log('❌ Не удалось найти блок');
}
