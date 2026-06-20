const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

// Проверяем, есть ли уже модальное окно
if (code.includes('fontModal')) {
  console.log('ℹ️ Модальное окно уже добавлено');
} else {
  console.log('❌ Модальное окно НЕ добавлено');
}

// Проверяем состояние
const hasFontModal = code.includes('const [fontModal');
const hasOpenFontModal = code.includes('openFontModal');
const hasModalWindow = code.includes('Модальное окно');

console.log('fontModal:', hasFontModal);
console.log('openFontModal:', hasOpenFontModal);
console.log('Модальное окно:', hasModalWindow);

if (!hasFontModal || !hasOpenFontModal || !hasModalWindow) {
  console.log('\n⚠️ Код повреждён! Нужно восстановить и применить заново.');
} else {
  console.log('\n✅ Код в порядке');
}
