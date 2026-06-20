const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Применяю все изменения...\n');

// ШАГ 1: Добавляем состояния
if (!code.includes('const [fontModal')) {
  code = code.replace(
    'const [loading, setLoading] = useState(true);',
    'const [loading, setLoading] = useState(true);\n  const [fontModal, setFontModal] = useState<{section: string; field: string; value: string} | null>(null);\n  const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: "sans-serif"});\n  const [showDesktopPreview, setShowDesktopPreview] = useState(false);'
  );
  console.log('✅ Шаг 1: Состояния добавлены');
}

// ШАГ 2: Добавляем функции
if (!code.includes('const openFontModal')) {
  const functions = `

  const openFontModal = (section: string, field: string, value: string) => {
    const settings = data.typography?.[\`\${section}.\${field}\`] || {};
    setFontSettings({
      desktopSize: settings.desktopSize || 200,
      mobileSize: settings.mobileSize || 24,
      font: settings.font || 'sans-serif'
    });
    setFontModal({section, field, value});
  };

  const applyFontSettings = async () => {
    if (!fontModal) return;
    const key = \`\${fontModal.section}.\${fontModal.field}\`;
    const typography = data.typography || {};
    typography[key] = fontSettings;
    update('typography', typography);
    setFontModal(null);
  };

  const fontSettingsBtn = (section: string, field: string, value: string) => (
    <button 
      onClick={() => openFontModal(section, field, value)}
      className="ml-2 text-gray-500 hover:text-lime transition-colors flex-shrink-0"
      title="Настройки шрифта"
    >
      ⚙️
    </button>
  );`;
  
  code = code.replace(
    'const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));',
    'const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));' + functions
  );
  console.log('✅ Шаг 2: Функции добавлены');
}

// ШАГ 3: Добавляем модальное окно ПЕРЕД закрывающим return
if (!code.includes('Модальное окно настроек шрифта')) {
  const modalCode = `
      {/* Модальное окно настроек шрифта */}
      {fontModal && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setFontModal(null)}>
          <div className="bg-neutral-950 border border-white/10 p-4 sm:p-6 max-w-md w-full rounded-lg my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Настройки шрифта</h3>
              <button onClick={() => setFontModal(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="mb-3">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Текущий текст</label>
              <div className="bg-neutral-900 border border-white/10 p-2 rounded text-white text-xs break-words max-h-20 overflow-y-auto">
                {fontModal.value || '(пусто)'}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Размер на ПК</label>
                  <span className="text-[10px] text-lime font-mono">{fontSettings.desktopSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="300" 
                  value={fontSettings.desktopSize}
                  onChange={e => setFontSettings({...fontSettings, desktopSize: Number(e.target.value)})}
                  className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Размер на телефоне</label>
                  <span className="text-[10px] text-lime font-mono">{fontSettings.mobileSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  value={fontSettings.mobileSize}
                  onChange={e => setFontSettings({...fontSettings, mobileSize: Number(e.target.value)})}
                  className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Шрифт</label>
                <select 
                  value={fontSettings.font}
                  onChange={e => setFontSettings({...fontSettings, font: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/10 px-2 py-1.5 text-white text-xs focus:outline-none focus:border-lime rounded"
                >
                  <option value="Inter">Inter</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Bebas Neue">Bebas Neue</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Roboto">Roboto</option>
                  <option value="sans-serif">Без засечек</option>
                  <option value="serif">С засечками</option>
                </select>
              </div>

              <div className="p-3 bg-neutral-900 border border-white/10 rounded">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">📱 Превью</div>
                <div style={{ fontSize: \`\${fontSettings.mobileSize}px\`, fontFamily: fontSettings.font }} className="text-white break-words leading-tight max-h-24 overflow-y-auto">
                  {fontModal.value || 'Пример'}
                </div>
              </div>

              <div>
                <button onClick={() => setShowDesktopPreview(!showDesktopPreview)} className="w-full text-[10px] text-gray-400 hover:text-lime uppercase tracking-widest py-2 border border-white/10 rounded mb-2">
                  💻 {showDesktopPreview ? 'Скрыть ПК' : 'Показать ПК'}
                </button>
                {showDesktopPreview && (
                  <div className="p-3 bg-neutral-900 border border-white/10 rounded">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">💻 Превью ПК</div>
                    <div style={{ fontSize: \`\${fontSettings.desktopSize}px\`, fontFamily: fontSettings.font }} className="text-white break-words leading-tight max-h-32 overflow-y-auto">
                      {fontModal.value || 'Пример'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={applyFontSettings} className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-2.5 text-[10px] hover:bg-lime/80 rounded">Применить</button>
              <button onClick={() => setFontModal(null)} className="px-4 py-2.5 border border-white/10 text-gray-400 text-[10px] uppercase tracking-widest hover:bg-white/5 rounded">Отмена</button>
            </div>
          </div>
        </div>
      )}
`;

  // Вставляем перед закрывающим </div> функции SettingsTab
  code = code.replace(
    /(\s+<\/div>\s+\);\s+}\s+\/\/ ── Menu CMS tab)/,
    modalCode + '$1'
  );
  console.log('✅ Шаг 3: Модальное окно добавлено');
}

// ШАГ 4: Добавляем кнопки ⚙️ к hero.title1
if (!code.includes('fontSettingsBtn("hero", "title1"')) {
  code = code.replace(
    /<label className=\{labelClass\}>Заголовок \(большой\)<\/label>\s*<input value=\{hero\.title1 \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, title1: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<label className={labelClass}>Заголовок (большой)</label>\n            <div className="flex gap-2">\n              <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={`${fieldClass} flex-1`} />\n              {fontSettingsBtn("hero", "title1", hero.title1 || "")}\n            </div>'
  );
  console.log('✅ Шаг 4: Кнопка ⚙️ для hero.title1');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Все изменения применены!');
console.log('\n🔥 Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
