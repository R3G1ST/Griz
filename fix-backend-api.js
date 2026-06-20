const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Обновляем POST /menu
code = code.replace(
  'const { section, category, name, description = "", price, sortOrder = 0, isActive = 1 } = req.body ?? {};',
  'const { section, category, name, description = "", price, sortOrder = 0, isActive = 1, isFeatured = 0 } = req.body ?? {};'
);
code = code.replace(
  '.values({ section, category, name, description, price, sortOrder, isActive: isActive ? 1 : 0 }).returning();',
  '.values({ section, category, name, description, price, sortOrder, isActive: isActive ? 1 : 0, isFeatured: isFeatured ? 1 : 0 }).returning();'
);

// 2. Обновляем PUT /menu/:id
code = code.replace(
  'const b = req.body ?? {};',
  'const b = req.body ?? {};\n    const isFeaturedNew = b.isFeatured !== undefined ? (b.isFeatured ? 1 : 0) : undefined;'
);
code = code.replace(
  'const updates: Record<string, unknown> = {};',
  'const updates: Record<string, unknown> = {};\n    if (isFeaturedNew !== undefined) updates.is_featured = isFeaturedNew;'
);

// 3. Добавляем логику: если включили isFeatured, выключаем у остальных
const logic = `
    // Если сделали featured, снимаем флаг с остальных
    if (isFeaturedNew === 1) {
      await db.update(menuItemsTable).set({ is_featured: 0 }).where(neq(menuItemsTable.id, id));
    }
`;
code = code.replace('const updates: Record<string, unknown> = {};', 'const updates: Record<string, unknown> = {};' + logic);

fs.writeFileSync(path, code);
console.log('✅ API обновлён');
