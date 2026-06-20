const fs = require('fs');

// === 1. Правим админку - добавляем настройки к каждому полю ===
const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');

// Добавляем поля размера и шрифта к каждому текстовому полю в Hero секции
const heroSection = `        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Заголовок (большой)</label>
            <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Заголовок (курсив)</label>
            <input value={hero.title2 || ""} onChange={e => update("hero", { ...hero, title2: e.target.value })} className={fieldClass} />
          </div>
        </div>
        <label className={labelClass}>Подзаголовок</label>
        <textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={2} className={\`\${fieldClass} resize-none\`} />`;

const heroSectionNew = `        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Заголовок (большой)</label>
            <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={fieldClass} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[10px] text-gray-500">Размер (px)</label>
                <input type="number" value={hero.title1Size || 200} onChange={e => update("hero", { ...hero, title1Size: Number(e.target.value) })} className={\`\${fieldClass} text-xs\`} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Шрифт</label>
                <select value={hero.title1Font || "sans-serif"} onChange={e => update("hero", { ...hero, title1Font: e.target.value })} className={\`\${fieldClass} text-xs\`}>
                  <option value="sans-serif">Без засечек</option>
                  <option value="serif">С засечками</option>
                  <option value="monospace">Моноширинный</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Заголовок (курсив)</label>
            <input value={hero.title2 || ""} onChange={e => update("hero", { ...hero, title2: e.target.value })} className={fieldClass} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[10px] text-gray-500">Размер (px)</label>
                <input type="number" value={hero.title2Size || 64} onChange={e => update("hero", { ...hero, title2Size: Number(e.target.value) })} className={\`\${fieldClass} text-xs\`} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Шрифт</label>
                <select value={hero.title2Font || "sans-serif"} onChange={e => update("hero", { ...hero, title2Font: e.target.value })} className={\`\${fieldClass} text-xs\`}>
                  <option value="sans-serif">Без засечек</option>
                  <option value="serif">С засечками</option>
                  <option value="monospace">Моноширинный</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <label className={labelClass}>Подзаголовок</label>
        <textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={2} className={\`\${fieldClass} resize-none\`} />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-[10px] text-gray-500">Размер (px)</label>
            <input type="number" value={hero.subtitleSize || 18} onChange={e => update("hero", { ...hero, subtitleSize: Number(e.target.value) })} className={\`\${fieldClass} text-xs\`} />
          </div>
          <div>
            <label className="text-[10px] text-gray-500">Шрифт</label>
            <select value={hero.subtitleFont || "sans-serif"} onChange={e => update("hero", { ...hero, subtitleFont: e.target.value })} className={\`\${fieldClass} text-xs\`}>
              <option value="sans-serif">Без засечек</option>
              <option value="serif">С засечками</option>
              <option value="monospace">Моноширинный</option>
            </select>
          </div>
        </div>`;

if (adminCode.includes('title1Size')) {
  console.log('✅ Админка: настройки уже добавлены');
} else {
  adminCode = adminCode.replace(heroSection, heroSectionNew);
  fs.writeFileSync(adminPath, adminCode);
  console.log('✅ Админка: индивидуальные настройки добавлены к каждому полю');
}

// === 2. Правим сайт ===
const sitePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let siteCode = fs.readFileSync(sitePath, 'utf8');

// Заменяем размер и шрифт главного заголовка
siteCode = siteCode.replace(
  /style=\{\{ fontSize: "clamp\(72px, 18vw, 200px\)" \}\}/,
  'style={{ fontSize: `clamp(72px, 18vw, ${hero.title1Size || 200}px)`, fontFamily: hero.title1Font || "sans-serif" }}'
);

// Заменяем размер и шрифт подзаголовка
siteCode = siteCode.replace(
  /<p className="gn-sans text-\[15px\] sm:text-\[18px\] text-\[#F5F1E8\]\/75 max-w-\[520px\] leading-relaxed">/,
  '<p className="gn-sans text-[15px] sm:text-[18px] text-[#F5F1E8]/75 max-w-[520px] leading-relaxed" style={{ fontSize: `${hero.subtitleSize || 18}px`, fontFamily: hero.subtitleFont || "sans-serif" }}>'
);

fs.writeFileSync(sitePath, siteCode);
console.log('✅ Сайт: индивидуальные настройки применяются');

console.log('\n🔨 Теперь пересобери проект:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm -r --if-present run build');
