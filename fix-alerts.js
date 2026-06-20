const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Добавляем красивую функцию уведомлений
const toastFunc = `
// --- Красивые уведомления вместо alert ---
function showNiceAlert(msg: string, isError = false) {
  const div = document.createElement('div');
  div.className = \`fixed top-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-2xl text-sm font-bold transition-all duration-300 \${isError ? 'bg-red-600 text-white border border-red-500' : 'bg-lime text-black border border-lime-400'}\`;
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = '0'; div.style.transform = 'translate(-50%, -20px)'; }, 2500);
  setTimeout(() => div.remove(), 3000);
}
`;

code = toastFunc + code;

// 2. Заменяем все alert на showNiceAlert
code = code.replace(/alert\(/g, 'showNiceAlert(');

// 3. Убираем отладочное уведомление
code = code.replace(/showNiceAlert\('save\(\) вызвана!.*?'\);/g, 'console.log("save() вызвана");');

// 4. Делаем уведомления об ошибках красными (добавляем , true)
code = code.replace(/showNiceAlert\(`Ошибка сохранения: \$\{error\.error \|\| response\.statusText\}`\);/g, "showNiceAlert(`Ошибка сохранения: ${error.error || response.statusText}`, true);");
code = code.replace(/showNiceAlert\(`Ошибка: \$\{\(err as Error\)\.message\}`\);/g, "showNiceAlert(`Ошибка: ${(err as Error).message}`, true);");
code = code.replace(/showNiceAlert\(`\$\{label\}: \$\{affected\.length - failed\} из \$\{affected\.length\} обновлены, \$\{failed\} с ошибкой\.`\);/g, "showNiceAlert(`${label}: ${affected.length - failed} из ${affected.length} обновлены, ${failed} с ошибкой.`, true);");
code = code.replace(/showNiceAlert\('Ошибка при перезапуске'\)/g, "showNiceAlert('Ошибка при перезапуске', true);");

fs.writeFileSync(path, code);
console.log('✅ Алёрты заменены на красивые уведомления');
