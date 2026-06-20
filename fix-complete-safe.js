const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Применяю изменения безопасно...\n');

// === ШАГ 1: Добавляем состояния ===
if (!code.includes('const [fontModal')) {
  const loadingLine = 'const [loading, setLoading] = useState(true);';
  if (code.includes(loadingLine)) {
    code = code.replace(
      loadingLine,
      loadingLine + '\n  const [fontModal, setFontModal] = useState<{section: string; field: string; value: string} | null>(null);\n  const [fontSettings, setFontSettings] = useState({desktopSize: 200, mobileSize: 24, font: "sans-serif"});\n  const [showDesktopPreview, setShowDesktopPreview] = useState(false);'
    );
    console.log('✅ Шаг 1: Состояния добавлены');
  } else {
    console.log('❌ Шаг 1: Не найдена строка loading');
  }
} else {
  console.log('ℹ️ Шаг 1: Состояния уже есть');
}

// === ШАГ 2: Добавляем функции ===
if (!code.includes('const openFontModal')) {
  const updateLine = 'const update = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));';
  if (code.includes(updateLine)) {
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
    
    code = code.replace(updateLine, updateLine + functions);
    console.log('✅ Шаг 2: Функции добавлены');
  } else {
    console.log('❌ Шаг 2: Не найдена строка update');
  }
} else {
  console.log('ℹ️ Шаг 2: Функции уже есть');
}

// === ШАГ 3: Проверяем модальное окно ===
if (code.includes('Модальное окно настроек шрифта')) {
  console.log('✅ Шаг 3: Модальное окно уже есть');
} else {
  console.log('⚠️ Шаг 3: Модальное окно отсутствует (добавим позже)');
}

// === ШАГ 4: Добавляем кнопки ⚙️ к полям ===
// Для hero.title1
if (!code.includes('fontSettingsBtn("hero", "title1"')) {
  code = code.replace(
    /<label className=\{labelClass\}>Заголовок \(большой\)<\/label>\s*<input value=\{hero\.title1 \|\| ""\}/,
    '<label className={labelClass}>Заголовок (большой)</label>\n            <div className="flex gap-2">\n            <input value={hero.title1 || ""}'
  );
  code = code.replace(
    /onChange=\{e => update\("hero", \{ \.\.\.hero, title1: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    'onChange={e => update("hero", { ...hero, title1: e.target.value })} className={fieldClass} />\n            {fontSettingsBtn("hero", "title1", hero.title1 || "")}\n            </div>'
  );
  console.log('✅ Шаг 4: Кнопка ⚙️ для hero.title1');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Файл сохранён!');
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build');
