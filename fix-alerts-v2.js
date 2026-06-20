const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Удаляем старую функцию
code = code.replace(/\/\/ --- Красивые уведомления вместо alert ---[\s\S]*?setTimeout\(\(\) => div\.remove\(\), 3000\);\n\}\n/, '');

// Добавляем новую красивую функцию
const toastFunc = `
// --- Красивые toast-уведомления ---
function showNiceAlert(msg: string, isError = false) {
  const container = document.getElementById('toast-container') || (() => {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'fixed top-20 right-4 z-[9999] flex flex-col gap-2';
    document.body.appendChild(div);
    return div;
  })();
  
  const toast = document.createElement('div');
  toast.className = \`bg-neutral-900 border \${isError ? 'border-red-500/50' : 'border-lime/50'} rounded-lg px-4 py-3 shadow-2xl min-w-[250px] max-w-[350px] transition-all duration-300 opacity-0 translate-x-full\`;
  toast.innerHTML = \`
    <div class="flex items-start gap-3">
      <div class="\${isError ? 'text-red-500' : 'text-lime'} text-lg">\${isError ? '✕' : '✓'}</div>
      <div class="flex-1">
        <div class="\${isError ? 'text-red-400' : 'text-lime'} text-xs font-bold uppercase tracking-wider mb-1">\${isError ? 'Ошибка' : 'Успешно'}</div>
        <div class="text-white text-sm">\${msg}</div>
      </div>
    </div>
  \`;
  
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(0)'; }, 10);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; }, 2500);
  setTimeout(() => toast.remove(), 3000);
}
`;

code = toastFunc + code;

// Заменяем сообщения на более понятные
code = code.replace(/showNiceAlert\(`Ошибка сохранения: \$\{error\.error \|\| response\.statusText\}`, true\);/g, "showNiceAlert('Не удалось сохранить данные', true);");
code = code.replace(/showNiceAlert\(`Ошибка: \$\{\(err as Error\)\.message\}`, true\);/g, "showNiceAlert('Произошла ошибка при сохранении', true);");
code = code.replace(/showNiceAlert\(`\$\{label\}: \$\{affected\.length - failed\} из \$\{affected\.length\} обновлены, \$\{failed\} с ошибкой\.`, true\);/g, "showNiceAlert('Часть позиций не обновилась', true);");
code = code.replace(/showNiceAlert\('Ошибка при перезапуске', true\);/g, "showNiceAlert('Не удалось перезапустить сервис', true);");

// Успешные сообщения
code = code.replace(/showNiceAlert\('Сохранено'\);/g, "showNiceAlert('Изменения сохранены');");
code = code.replace(/showNiceAlert\('Позиция добавлена'\);/g, "showNiceAlert('Позиция добавлена в меню');");
code = code.replace(/showNiceAlert\('Позиция обновлена'\);/g, "showNiceAlert('Позиция обновлена');");
code = code.replace(/showNiceAlert\('Позиция удалена'\);/g, "showNiceAlert('Позиция удалена из меню');");
code = code.replace(/showNiceAlert\(data\.message \|\| 'Перезапуск инициирован'\);/g, "showNiceAlert(data.message || 'Перезапуск запущен');");

fs.writeFileSync(path, code);
console.log('✅ Toast-уведомления улучшены');
