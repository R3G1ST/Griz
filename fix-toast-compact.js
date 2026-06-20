const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Делаем уведомления компактнее
code = code.replace(
  /toast\.className = `bg-neutral-900 border-2 \${isError \? 'border-red-500' : 'border-lime'} rounded-xl px-6 py-4 shadow-2xl transition-all duration-300 opacity-0 -translate-y-4`;/g,
  "toast.className = `bg-neutral-900 border ${isError ? 'border-red-500' : 'border-lime'} rounded-lg px-3 py-2 shadow-xl transition-all duration-300 opacity-0 -translate-y-2`;"
);

code = code.replace(
  /<div class="\${isError \? 'text-red-500' : 'text-lime'} text-lg flex-shrink-0">/,
  "<div class=\"${isError ? 'text-red-500' : 'text-lime'} text-base flex-shrink-0\">"
);

code = code.replace(
  /<div class="\${isError \? 'text-red-400' : 'text-lime'} text-xs font-bold uppercase tracking-wider mb-0\.5">/,
  "<div class=\"${isError ? 'text-red-400' : 'text-lime'} text-[10px] font-bold uppercase tracking-wider mb-0.5\">"
);

code = code.replace(
  /<div class="text-white text-sm break-words">/,
  "<div class=\"text-white text-xs break-words\">"
);

// 2. Добавляем уведомление при удалении - ищем строку и добавляем после неё
code = code.replace(
  /await adminFetch\(`\$\{API_BASE\}\/menu\/\$\{id\}`, \{ method: "DELETE" \}\);/g,
  "await adminFetch(`${API_BASE}/menu/${id}`, { method: \"DELETE\" });\n    showNiceAlert('Позиция удалена');"
);

fs.writeFileSync(path, code);
console.log('✅ Уведомления компактнее + удаление');
