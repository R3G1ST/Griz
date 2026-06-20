const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Добавляю модальное окно...\n');

// Проверяем, есть ли уже модальное окно
if (code.includes('Модальное окно настроек шрифта')) {
  console.log('ℹ️ Модальное окно уже есть');
} else {
  // Находим место перед закрывающим </div> функции SettingsTab
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
                  <div className="p-3 bg-neutral-900 border border-white/10 rounded">
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

  // Ищем конец функции SettingsTab и добавляем модальное окно перед ним
  const endPattern = /(\s+<\/div>\s+\);\s+}\s+\/\/ ── Menu CMS tab)/;
  if (endPattern.test(code)) {
    code = code.replace(endPattern, modalCode + '$1');
    console.log('✅ Модальное окно добавлено');
  } else {
    console.log('❌ Не найдено место для вставки модального окна');
  }
}

fs.writeFileSync(adminPath, code);
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
