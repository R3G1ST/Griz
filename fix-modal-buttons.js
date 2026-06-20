const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

// === 1. Добавляем состояние для модального окна ===
if (!code.includes('fontModal')) {
  code = code.replace(
    'function SettingsTab() {\n  const [data, setData] = useState<any>({});\n  const [saved, setSaved] = useState<string | null>(null);\n  const [loading, setLoading] = useState(true);',
    'function SettingsTab() {\n  const [data, setData] = useState<any>({});\n  const [saved, setSaved] = useState<string | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [fontModal, setFontModal] = useState<{section: string; field: string; value: string} | null>(null);\n  const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: "sans-serif"});\n  const [showDesktopPreview, setShowDesktopPreview] = useState(false);'
  );
  console.log('✅ Добавлено состояние для модального окна');
}

// === 2. Добавляем функции ===
if (!code.includes('openFontModal')) {
  const updateLine = code.match(/const update = \(key: string, value: any\) => setData\(\(prev: any\) => \(\{ \.\.\.prev, \[key\]: value \}\)\);/);
  if (updateLine) {
    const functionsCode = `
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
    
    try {
      const response = await adminFetch(\`\${API_BASE}/settings/typography\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: typography }),
      });
      if (response.ok) {
        showNiceAlert('Настройки шрифта сохранены');
      }
    } catch (err) {
      showNiceAlert('Ошибка при сохранении', true);
    }
    
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
    
    code = code.replace(updateLine[0], updateLine[0] + functionsCode);
    console.log('✅ Добавлены функции модального окна');
  }
}

// === 3. Добавляем модальное окно ===
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
                  <option value="Inter">Inter (современный)</option>
                  <option value="Montserrat">Montserrat (геометричный)</option>
                  <option value="Playfair Display">Playfair Display (элегантный)</option>
                  <option value="Merriweather">Merriweather (классический)</option>
                  <option value="Oswald">Oswald (узкий)</option>
                  <option value="Bebas Neue">Bebas Neue (заголовки)</option>
                  <option value="Raleway">Raleway (минималистичный)</option>
                  <option value="Open Sans">Open Sans (читаемый)</option>
                  <option value="Roboto">Roboto (универсальный)</option>
                  <option value="Lora">Lora (с засечками)</option>
                  <option value="JetBrains Mono">JetBrains Mono (моно)</option>
                  <option value="Fira Code">Fira Code (программистский)</option>
                  <option value="Poppins">Poppins (дружелюбный)</option>
                  <option value="Nunito">Nunito (округлый)</option>
                  <option value="Ubuntu">Ubuntu (техно)</option>
                  <option value="Crimson Text">Crimson Text (газетный)</option>
                  <option value="Abril Fatface">Abril Fatface (жирный)</option>
                  <option value="Cinzel">Cinzel (античный)</option>
                  <option value="Righteous">Righteous (неоновый)</option>
                  <option value="sans-serif">Без засечек (системный)</option>
                  <option value="serif">С засечками (системный)</option>
                  <option value="monospace">Моноширинный (системный)</option>
                </select>
              </div>

              <div className="p-3 bg-neutral-900 border border-white/10 rounded">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span>📱</span> Превью (мобильный)
                </div>
                <div 
                  style={{ 
                    fontSize: \`\${fontSettings.mobileSize}px\`,
                    fontFamily: fontSettings.font
                  }}
                  className="text-white break-words leading-tight max-h-24 overflow-y-auto"
                >
                  {fontModal.value || 'Пример текста'}
                </div>
              </div>

              <div>
                <button 
                  onClick={() => setShowDesktopPreview(!showDesktopPreview)}
                  className="w-full text-[10px] text-gray-400 hover:text-lime uppercase tracking-widest py-2 border border-white/10 rounded mb-2 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>💻</span>
                  {showDesktopPreview ? 'Скрыть превью для ПК' : 'Показать превью для ПК'}
                  <span className="text-xs">{showDesktopPreview ? '▲' : '▼'}</span>
                </button>
                
                {showDesktopPreview && (
                  <div className="p-3 bg-neutral-900 border border-white/10 rounded animate-fadeIn">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Превью (ПК)</div>
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
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={applyFontSettings}
                className="flex-1 bg-lime text-black font-bold uppercase tracking-widest py-2.5 text-[10px] hover:bg-lime/80 rounded transition-colors"
              >
                Применить
              </button>
              <button 
                onClick={() => setFontModal(null)}
                className="px-4 py-2.5 border border-white/10 text-gray-400 text-[10px] uppercase tracking-widest hover:bg-white/5 rounded transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
`;

  const settingsTabEnd = code.match(/(\s+<\/div>\s+\);\s+}\s+\/\/ ── Menu CMS tab)/);
  if (settingsTabEnd) {
    code = code.replace(settingsTabEnd[0], modalCode + settingsTabEnd[0]);
    console.log('✅ Добавлено модальное окно');
  }
}

// === 4. Добавляем CSS анимацию ===
const indexCssPath = '/var/www/Griz/artifacts/grizli-admin/src/index.css';
if (fs.existsSync(indexCssPath)) {
  let cssCode = fs.readFileSync(indexCssPath, 'utf8');
  if (!cssCode.includes('@keyframes fadeIn')) {
    cssCode += `
/* Анимация для превью */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
`;
    fs.writeFileSync(indexCssPath, cssCode);
    console.log('✅ Добавлена CSS анимация');
  }
}

fs.writeFileSync(adminPath, code);
console.log('✅ Админка обновлена');
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build');
