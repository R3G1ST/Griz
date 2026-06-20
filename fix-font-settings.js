const fs = require('fs');

// === 1. Правим админку ===
const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');

// Добавляем состояние для модального окна в начало SettingsTab
const settingsTabStart = `function SettingsTab() {
  const [data, setData] = useState<any>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);`;

const settingsTabNew = `function SettingsTab() {
  const [data, setData] = useState<any>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontModal, setFontModal] = useState<{section: string; field: string; value: string} | null>(null);
  const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: 'sans-serif'});`;

if (!adminCode.includes('fontModal')) {
  adminCode = adminCode.replace(settingsTabStart, settingsTabNew);
  console.log('✅ Добавлено состояние для модального окна');
}

// Добавляем функции работы с модальным окном после строки с update
const updateLine = `  const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));`;

const updateNew = `  const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));

  const openFontModal = (section: string, field: string, value: string) => {
    const settings = data.typography?.[\`\${section}.\${field}\`] || {};
    setFontSettings({
      desktopSize: settings.desktopSize || 200,
      mobileSize: settings.mobileSize || 24,
      font: settings.font || 'sans-serif'
    });
    setFontModal({section, field, value});
  };

  const applyFontSettings = () => {
    if (!fontModal) return;
    const key = \`\${fontModal.section}.\${fontModal.field}\`;
    const typography = data.typography || {};
    typography[key] = fontSettings;
    update('typography', typography);
    setFontModal(null);
  };`;

if (!adminCode.includes('openFontModal')) {
  adminCode = adminCode.replace(updateLine, updateNew);
  console.log('✅ Добавлены функции модального окна');
}

// Добавляем модальное окно в конец SettingsTab (перед закрывающим </div>)
const modalCode = `
      {/* Модальное окно настроек шрифта */}
      {fontModal && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={() => setFontModal(null)}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-md w-full rounded-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Настройки шрифта</h3>
              <button onClick={() => setFontModal(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="mb-4">
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Текущий текст</label>
              <div className="bg-neutral-900 border border-white/10 p-3 rounded text-white text-sm break-words">
                {fontModal.value || '(пусто)'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Размер на ПК</label>
                  <span className="text-xs text-lime font-mono">{fontSettings.desktopSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="300" 
                  value={fontSettings.desktopSize}
                  onChange={e => setFontSettings({...fontSettings, desktopSize: Number(e.target.value)})}
                  className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Размер на телефоне</label>
                  <span className="text-xs text-lime font-mono">{fontSettings.mobileSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  value={fontSettings.mobileSize}
                  onChange={e => setFontSettings({...fontSettings, mobileSize: Number(e.target.value)})}
                  className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Шрифт</label>
                <select 
                  value={fontSettings.font}
                  onChange={e => setFontSettings({...fontSettings, font: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-lime rounded"
                >
                  <option value="sans-serif">Без засечек (по умолчанию)</option>
                  <option value="serif">С засечками</option>
                  <option value="monospace">Моноширинный</option>
                  <option value="cursive">Курсивный</option>
                  <option value="fantasy">Декоративный</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>

              <div className="p-4 bg-neutral-900 border border-white/10 rounded">
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
              </div>

              <div className="p-4 bg-neutral-900 border border-white/10 rounded">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Превью (телефон)</div>
                <div 
                  style={{ 
                    fontSize: \`\${fontSettings.mobileSize}px\`,
                    fontFamily: fontSettings.font
                  }}
                  className="text-white break-words leading-tight"
                >
                  {fontModal.value || 'Пример текста'}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={applyFontSettings}
                className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-3 text-xs hover:bg-lime/80 rounded"
              >
                Применить
              </button>
              <button 
                onClick={() => setFontModal(null)}
                className="px-6 py-3 border border-white/10 text-gray-400 text-xs uppercase tracking-widest hover:bg-white/5 rounded"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
`;

// Находим конец SettingsTab и добавляем модальное окно
const settingsTabEnd = `    </div>
  );
}

// ── Menu CMS tab`;

if (!adminCode.includes('Модальное окно настроек шрифта')) {
  adminCode = adminCode.replace(settingsTabEnd, modalCode + '\n    </div>\n  );\n}\n\n// ── Menu CMS tab');
  console.log('✅ Добавлено модальное окно');
}

// Добавляем кнопку ⚙️ рядом с полями ввода
const settingsButtonCode = `
  const fontSettingsBtn = (section: string, field: string, value: string) => (
    <button 
      onClick={() => openFontModal(section, field, value)}
      className="ml-2 text-gray-500 hover:text-lime transition-colors"
      title="Настройки шрифта"
    >
      ⚙️
    </button>
  );
`;

if (!adminCode.includes('fontSettingsBtn')) {
  adminCode = adminCode.replace(updateNew, updateNew + '\n' + settingsButtonCode);
  console.log('✅ Добавлена функция кнопки настроек');
}

fs.writeFileSync(adminPath, adminCode);
console.log('✅ Админка обновлена');

console.log('\n Теперь пересобери проект:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm -r --if-present run build');
