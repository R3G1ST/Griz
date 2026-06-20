const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Применяю рабочий вариант...\n');

// 1. Состояния
if (!code.includes('const [fontModal')) {
  code = code.replace(
    'const [loading, setLoading] = useState(true);',
    'const [loading, setLoading] = useState(true);\n  const [fontModal, setFontModal] = useState<{section: string; field: string; value: string} | null>(null);\n  const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: "sans-serif"});\n  const [showDesktopPreview, setShowDesktopPreview] = useState(false);'
  );
  console.log('✅ Состояния добавлены');
}

// 2. Функции
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
  
  code = code.replace(
    'const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));',
    'const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));' + functions
  );
  console.log('✅ Функции добавлены');
}

// 3. Кнопка ⚙️ для hero.title1
if (!code.includes('fontSettingsBtn("hero", "title1"')) {
  code = code.replace(
    /<label className=\{labelClass\}>Заголовок \(большой\)<\/label>\s*<input value=\{hero\.title1 \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, title1: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<label className={labelClass}>Заголовок (большой)</label>\n            <div className="flex gap-2">\n              <input value={hero.title1 || ""} onChange={e => update("hero", { ...hero, title1: e.target.value })} className={`${fieldClass} flex-1`} />\n              {fontSettingsBtn("hero", "title1", hero.title1 || "")}\n            </div>'
  );
  console.log('✅ Кнопка ⚙️ для hero.title1');
}

// 4. Модальное окно через Python (надёжнее)
fs.writeFileSync(adminPath, code);

console.log('\n🔥 Теперь добавляю модальное окно через Python...');
