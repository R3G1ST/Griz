const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log(' Исправляю расположение кнопки и превью...\n');

// 1. Исправляем расположение кнопки ⚙️ для hero.title1
// Меняем: <input ... /> {fontSettingsBtn(...)}
// На: <div className="flex gap-2"><input ... className="flex-1" /> {fontSettingsBtn(...)} </div>
code = code.replace(
  /<input value=\{hero\.title1 \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, title1: e\.target\.value \}\)\} className=\{fieldClass\} \/> \{fontSettingsBtn\("hero", "title1", hero\.title1 \|\| ""\)\}/,
  '<div className="flex gap-2">\n              <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={`${fieldClass} flex-1`} />\n              {fontSettingsBtn("hero", "title1", hero.title1 || "")}\n            </div>'
);
console.log('✅ Кнопка ⚙️ теперь рядом с полем');

// 2. Добавляем состояние для сворачивания ПК превью
if (!code.includes('showDesktopPreview')) {
  code = code.replace(
    "const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: 'sans-serif'});",
    "const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: 'sans-serif'});\n  const [showDesktopPreview, setShowDesktopPreview] = useState(false);"
  );
  console.log('✅ Добавлено состояние для сворачивания');
}

// 3. Заменяем ПК превью на сворачиваемое
const oldDesktopPreview = `<div className="p-4 bg-neutral-900 border border-white/10 rounded">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Превью (ПК)</div>
                <div 
                  style={{ 
                    fontSize: \`\${fontSettings.desktopSize}px\`,
                    fontFamily: fontSettings.font
                  }}
                  className="text-white break-words leading-tight"
                >
                  {fontModal.value || 'Пример текста'}
                </div>
              </div>`;

const newDesktopPreview = `<div>
                <button 
                  onClick={() => setShowDesktopPreview(!showDesktopPreview)}
                  className="w-full text-xs text-gray-400 hover:text-lime uppercase tracking-widest py-2 border border-white/10 rounded mb-2 flex items-center justify-center gap-2"
                >
                  💻 {showDesktopPreview ? 'Скрыть превью для ПК' : 'Показать превью для ПК'}
                  <span>{showDesktopPreview ? '▲' : '▼'}</span>
                </button>
                {showDesktopPreview && (
                  <div className="p-3 bg-neutral-900 border border-white/10 rounded">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Превью (ПК)</div>
                    <div 
                      style={{ 
                        fontSize: \`\${fontSettings.desktopSize}px\`,
                        fontFamily: fontSettings.font
                      }}
                      className="text-white break-words leading-tight max-h-32 overflow-y-auto"
                    >
                      {fontModal.value || 'Пример текста'}
                    </div>
                  </div>
                )}
              </div>`;

if (code.includes(oldDesktopPreview)) {
  code = code.replace(oldDesktopPreview, newDesktopPreview);
  console.log('✅ ПК превью теперь сворачиваемое');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Готово!');
console.log('\n🔥 Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
