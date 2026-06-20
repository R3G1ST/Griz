const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Добавляем лог перед сохранением
const oldSave = `    if (Object.keys(updates).length === 0) { res.status(400).json({ error: "no fields" }); return; }
    const [item] = await db.update(menuItemsTable).set(updates).where(eq(menuItemsTable.id, id)).returning();`;

const newSave = `    if (Object.keys(updates).length === 0) { res.status(400).json({ error: "no fields" }); return; }
    console.log('Saving updates for id', id, ':', JSON.stringify(updates));
    const [item] = await db.update(menuItemsTable).set(updates).where(eq(menuItemsTable.id, id)).returning();
    console.log('Saved item:', JSON.stringify(item));`;

if (code.includes(oldSave)) {
  code = code.replace(oldSave, newSave);
  fs.writeFileSync(path, code);
  console.log('✅ Логирование добавлено');
} else {
  console.log('❌ Не удалось найти блок сохранения');
}
