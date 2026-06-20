const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Удаляем всю старую функцию showNiceAlert
code = code.replace(/\/\/ --- Красивые toast-уведомления \(мобильно-адаптивные\) ---[\s\S]*?setTimeout\(\(\) => toast\.remove\(\), 3500\);\n\}\n/, '');

// Добавляем правильную функцию
const newToast = `
// --- Красивые toast-уведомления ---
function showNiceAlert(msg: string, isError = false) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100%-32px)] max-w-sm';
    document.body.appendChild(container);
  }
  
  // Удаляем предыдущие уведомления того же типа
  const existing = container.querySelectorAll('[data-type="' + (isError ? 'error' : 'success') + '"]');
  existing.forEach(e => e.remove());
  
  const toast = document.createElement('div');
  toast.setAttribute('data-type', isError ? 'error' : 'success');
  toast.className = \`bg-neutral-900 border \${isError ? 'border-red-500' : 'border-lime'} rounded-lg px-3 py-2 shadow-xl transition-all duration-300 opacity-0 -translate-y-2\`;
  toast.innerHTML = \`
    <div class="flex items-start gap-3">
      <div class="\${isError ? 'text-red-500' : 'text-lime'} text-base flex-shrink-0">\${isError ? '✕' : '✓'}</div>
      <div class="flex-1 min-w-0">
        <div class="\${isError ? 'text-red-400' : 'text-lime'} text-[10px] font-bold uppercase tracking-wider mb-0.5">\${isError ? 'Ошибка' : 'Успешно'}</div>
        <div class="text-white text-xs break-words">\${msg}</div>
      </div>
    </div>
  \`;
  
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 3000);
  setTimeout(() => toast.remove(), 3500);
}
`;

code = newToast + code;

// Убираем дублирующееся уведомление
const lines = code.split('\n');
const newLines = [];
let skipNext = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("showNiceAlert(item.id ? 'Позиция обновлена' : 'Позиция добавлена');")) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    skipNext = true;
  }
  newLines.push(lines[i]);
}
code = newLines.join('\n');

fs.writeFileSync(path, code);
console.log('✅ Функция уведомлений исправлена');
