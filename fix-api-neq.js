const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Убираем neq из импорта
code = code.replace('import { eq, asc, neq } from "drizzle-orm";', 'import { eq, asc } from "drizzle-orm";');

// Заменяем логику с neq на простую: сбросить все, потом установить нужный
const oldLogic = `    // Если сделали featured, снимаем флаг с остальных
    if (isFeaturedNew === 1) {
      await db.update(menuItemsTable).set({ is_featured: 0 }).where(neq(menuItemsTable.id, id));
    }`;

const newLogic = `    // Если сделали featured, сбрасываем флаг у всех, потом ставим нужному
    if (isFeaturedNew === 1) {
      await db.update(menuItemsTable).set({ is_featured: 0 });
      updates.is_featured = 1;
    }`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync(path, code);
  console.log('✅ API исправлен — neq убран');
} else {
  console.log('❌ Не удалось найти блок с neq');
}
