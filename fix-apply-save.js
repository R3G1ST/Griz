const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log(' Добавляю сохранение в базу...\n');

// Заменяем функцию applyFontSettings
const oldApply = `  const applyFontSettings = () => {
    if (!fontModal) return;
    const key = \`\${fontModal.section}.\${fontModal.field}\`;
    const typography = data.typography || {};
    typography[key] = fontSettings;
    update('typography', typography);
    setFontModal(null);
  };`;

const newApply = `  const applyFontSettings = async () => {
    if (!fontModal) return;
    const key = \`\${fontModal.section}.\${fontModal.field}\`;
    const typography = data.typography || {};
    typography[key] = fontSettings;
    update('typography', typography);
    
    // Сохраняем в базу данных
    try {
      const response = await adminFetch(\`\${API_BASE}/settings/typography\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: typography }),
      });
      if (response.ok) {
        showNiceAlert('Настройки шрифта сохранены');
      } else {
        showNiceAlert('Не удалось сохранить', true);
      }
    } catch (err) {
      showNiceAlert('Ошибка при сохранении', true);
    }
    
    setFontModal(null);
  };`;

if (code.includes(oldApply)) {
  code = code.replace(oldApply, newApply);
  console.log('✅ Функция applyFontSettings обновлена');
} else {
  console.log('❌ Не найдена старая функция');
}

fs.writeFileSync(adminPath, code);
console.log('\n🔥 Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
