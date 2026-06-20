const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldLogic = `  const featured = useMemo(() => {
    // Featured "кальян недели": match either section OR category by /кальян/i, then fall back to any active item.
    const hookahs = menuItems.filter(
      i => i.isActive && (/кальян/i.test(i.section) || /кальян/i.test(i.category)),
    );
    return (hookahs[0] ?? menuItems.find(i => i.isActive) ?? null);
  }, [menuItems]);`;

const newLogic = `  const featured = useMemo(() => {
    // Ищем позицию с флагом isFeatured === 1
    return menuItems.find(i => i.isActive && i.isFeatured === 1) ?? null;
  }, [menuItems]);`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync(path, code);
  console.log('✅ Главная страница обновлена');
} else {
  console.log('❌ Не удалось найти блок featured');
}
