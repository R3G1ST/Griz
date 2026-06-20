const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Убираем дублирующую логику
const oldLogic = `    const isFeaturedNew = b.isFeatured !== undefined ? (b.isFeatured ? 1 : 0) : undefined;
    const updates: Record<string, unknown> = {};
    // Если сделали featured, сбрасываем флаг у всех, потом ставим нужному
    if (isFeaturedNew === 1) {
      await db.update(menuItemsTable).set({ is_featured: 0 });
      updates.is_featured = 1;
    }

    if (isFeaturedNew !== undefined) updates.is_featured = isFeaturedNew;`;

const newLogic = `    const isFeaturedNew = b.isFeatured !== undefined ? (b.isFeatured ? 1 : 0) : undefined;
    const updates: Record<string, unknown> = {};
    
    // Если сделали featured, сбрасываем флаг у всех
    if (isFeaturedNew === 1) {
      await db.update(menuItemsTable).set({ is_featured: 0 });
    }
    
    // Устанавливаем новое значение
    if (isFeaturedNew !== undefined) updates.is_featured = isFeaturedNew;`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync(path, code);
  console.log('✅ Логика API исправлена');
} else {
  console.log('❌ Не удалось найти блок логики');
}
