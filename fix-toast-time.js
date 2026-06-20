const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Увеличиваем время показа с 2500мс до 5000мс (5 секунд)
code = code.replace(/setTimeout\(\(\) => \{ toast\.style\.opacity = '0'; toast\.style\.transform = 'translateY\(-10px\)'; \}, 2500\);/g, "setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 5000);");

// Увеличиваем время удаления с 3000мс до 5500мс
code = code.replace(/setTimeout\(\(\) => toast\.remove\(\), 3000\);/g, "setTimeout(() => toast.remove(), 5500);");

fs.writeFileSync(path, code);
console.log('✅ Время показа уведомлений увеличено до 5 секунд');
