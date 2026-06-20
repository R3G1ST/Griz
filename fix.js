const fs = require('fs');
const filePath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Исправляем функцию save для настроек
const oldSettingsSave = /const save = async \(key: string\) => \{[\s\S]*?setSaved\(key\); setTimeout\(\(\) => setSaved\(null\), 1500\);[\s\S]*?\};/;
const newSettingsSave = `const save = async (key: string) => {
    try {
      const response = await adminFetch(\`\${API_BASE}/settings/\${key}\`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: data[key] }),
      });
      if (!response.ok) {
        const error = await response.json();
        alert(\`Ошибка сохранения: \${error.error || response.statusText}\`);
        return;
      }
      const updated = await fetch(\`\${API_BASE}/settings\`).then(r => r.json());
      setData(updated || {});
      setSaved(key);
      setTimeout(() => setSaved(null), 1500);
    } catch (err) {
      alert(\`Ошибка: \${(err as Error).message}\`);
    }
  };`;

// Исправляем функцию save для меню
const oldMenuSave = /const save = async \(item: Partial<MenuItem>\) => \{[\s\S]*?setEdit\(null\); setAdding\(null\); load\(\);[\s\S]*?\};/;
const newMenuSave = `const save = async (item: Partial<MenuItem>) => {
    try {
      let response;
      if (item.id) {
        response = await adminFetch(\`\${API_BASE}/menu/\${item.id}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      } else {
        response = await adminFetch(\`\${API_BASE}/menu\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      }
      if (!response.ok) {
        const error = await response.json();
        alert(\`Ошибка сохранения: \${error.error || response.statusText}\`);
        return;
      }
      setEdit(null); setAdding(null); load();
    } catch (err) {
      alert(\`Ошибка: \${(err as Error).message}\`);
    }
  };`;

code = code.replace(oldSettingsSave, newSettingsSave);
code = code.replace(oldMenuSave, newMenuSave);

fs.writeFileSync(filePath, code);
console.log('✅ Файл успешно исправлен!');
