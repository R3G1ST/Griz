const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Заменяем loadData чтобы сайт проверялся отдельно
const oldLoad = /const loadData = async \(\) => \{[\s\S]*?setStatus\(statusRes\);[\s\S]*?\};/;

const newLoad = `const loadData = async () => {
    try {
      const [statusRes, statsRes] = await Promise.all([
        adminFetch(\`\${API_BASE}/system/status\`).then(r => r.json()),
        adminFetch(\`\${API_BASE}/system/stats\`).then(r => r.json())
      ]);
      setStatus(statusRes);
      setStats(statsRes);
    } catch (e) { console.error('Ошибка загрузки:', e); }
  };

  const loadWebsite = async () => {
    try {
      const res = await adminFetch(\`\${API_BASE}/system/website\`);
      const data = await res.json();
      setStatus(prev => ({ ...prev, website: data }));
    } catch (e) { console.error('Ошибка проверки сайта:', e); }
  };`;

code = code.replace(oldLoad, newLoad);
fs.writeFileSync(path, code);
console.log('✅ SystemTab обновлён');
