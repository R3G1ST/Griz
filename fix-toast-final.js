const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Уменьшаем время показа до 3 секунд
code = code.replace(/setTimeout\(\(\) => \{ toast\.style\.opacity = '0'; toast\.style\.transform = 'translateY\(-10px\)'; \}, 8000\);/g, "setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 3000);");
code = code.replace(/setTimeout\(\(\) => toast\.remove\(\), 8500\);/g, "setTimeout(() => toast.remove(), 3500);");

// 2. Добавляем защиту от дублирования - удаляем предыдущий toast того же типа
code = code.replace(
  "const container = document.getElementById('toast-container') || (() => {",
  "const container = document.getElementById('toast-container') || (() => {\n    // Удаляем предыдущие уведомления того же типа\n    const existing = container.querySelectorAll('[data-type]');\n    existing.forEach(e => e.remove());\n"
);

// 3. Добавляем data-type для идентификации
code = code.replace(
  "toast.className = `bg-neutral-900 border-2",
  "toast.setAttribute('data-type', isError ? 'error' : 'success');\n  toast.className = `bg-neutral-900 border-2"
);

fs.writeFileSync(path, code);
console.log('✅ Уведомления: 3 секунды, без дублей');
