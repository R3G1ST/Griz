const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Очищаю старые поля и добавляю кнопки...\n');

// === УДАЛЯЕМ СТАРЫЕ ПОЛЯ РАЗМЕРА/ШРИФТА для hero.title1 ===
const oldTitle1Block = `<div className="grid grid-cols-2 gap-2 mt-2">
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
            </div>`;

if (code.includes(oldTitle1Block)) {
  code = code.replace(oldTitle1Block, '');
  console.log('✅ Удалены старые поля hero.title1');
}

// === УДАЛЯЕМ СТАРЫЕ ПОЛЯ для hero.title2 ===
const oldTitle2Block = `<div className="grid grid-cols-2 gap-2 mt-2">
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
            </div>`;

if (code.includes(oldTitle2Block)) {
  code = code.replace(oldTitle2Block, '');
  console.log('✅ Удалены старые поля hero.title2');
}

// === УДАЛЯЕМ СТАРЫЕ ПОЛЯ для hero.subtitle ===
const oldSubtitleBlock = `<div className="grid grid-cols-2 gap-2 mt-2">
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

if (code.includes(oldSubtitleBlock)) {
  code = code.replace(oldSubtitleBlock, '');
  console.log('✅ Удалены старые поля hero.subtitle');
}

// === ДОБАВЛЯЕМ КНОПКУ для hero.subtitle ===
if (!code.includes('fontSettingsBtn("hero", "subtitle"')) {
  code = code.replace(
    /<textarea value=\{hero\.subtitle \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, subtitle: e\.target\.value \}\)\} rows=\{2\} className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={2} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("hero", "subtitle", hero.subtitle || "")}</div>'
  );
  console.log('✅ Добавлена кнопка hero.subtitle');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Готово!');
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
