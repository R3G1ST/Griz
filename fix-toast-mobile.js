const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Удаляем старую функцию toast
code = code.replace(/\/\/ --- Красивые toast-уведомления ---[\s\S]*?setTimeout\(\(\) => toast\.remove\(\), 3000\);\n\}\n/, '');

// Добавляем мобильно-адаптивную версию
const toastFunc = `
// --- Красивые toast-уведомления (мобильно-адаптивные) ---
function showNiceAlert(msg: string, isError = false) {
  const container = document.getElementById('toast-container') || (() => {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100%-32px)] max-w-sm';
    document.body.appendChild(div);
    return div;
  })();
  
  const toast = document.createElement('div');
  toast.className = \`bg-neutral-900 border \${isError ? 'border-red-500/50' : 'border-lime/50'} rounded-xl px-4 py-3 shadow-2xl transition-all duration-300 opacity-0 -translate-y-4\`;
  toast.innerHTML = \`
    <div class="flex items-start gap-3">
      <div class="\${isError ? 'text-red-500' : 'text-lime'} text-lg flex-shrink-0">\${isError ? '✕' : '✓'}</div>
      <div class="flex-1 min-w-0">
        <div class="\${isError ? 'text-red-400' : 'text-lime'} text-xs font-bold uppercase tracking-wider mb-0.5">\${isError ? 'Ошибка' : 'Успешно'}</div>
        <div class="text-white text-sm break-words">\${msg}</div>
      </div>
    </div>
  \`;
  
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 2500);
  setTimeout(() => toast.remove(), 3000);
}
`;

code = toastFunc + code;

fs.writeFileSync(path, code);
console.log('✅ Toast адаптирован под мобильные');
