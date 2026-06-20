const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Увеличиваем время показа до 8 секунд
code = code.replace(/setTimeout\(\(\) => \{ toast\.style\.opacity = '0'; toast\.style\.transform = 'translateY\(-10px\)'; \}, 5000\);/g, "setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 8000);");
code = code.replace(/setTimeout\(\(\) => toast\.remove\(\), 5500\);/g, "setTimeout(() => toast.remove(), 8500);");

// Делаем уведомление более заметным
code = code.replace(/toast\.className = `bg-neutral-900 border \${isError \? 'border-red-500\/50' : 'border-lime\/50'} rounded-xl px-4 py-3 shadow-2xl transition-all duration-300 opacity-0 -translate-y-4`;/g, "toast.className = `bg-neutral-900 border-2 ${isError ? 'border-red-500' : 'border-lime'} rounded-xl px-6 py-4 shadow-2xl transition-all duration-300 opacity-0 -translate-y-4`;");

fs.writeFileSync(path, code);
console.log('✅ Уведомления теперь показываются 8 секунд и более заметны');
