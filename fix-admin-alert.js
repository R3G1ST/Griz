const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Добавляем alert в начало save()
const oldSave = `  const save = async (item: Partial<MenuItem>) => {
    console.log('Saving item:', item);
    try {`;

const newSave = `  const save = async (item: Partial<MenuItem>) => {
    alert('save() вызвана! Item: ' + JSON.stringify(item));
    console.log('Saving item:', item);
    try {`;

if (code.includes(oldSave)) {
  code = code.replace(oldSave, newSave);
  fs.writeFileSync(path, code);
  console.log('✅ Alert добавлен в save()');
} else {
  console.log('❌ Не удалось найти save()');
}
