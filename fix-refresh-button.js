const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Находим и заменяем кнопку обновления
const oldButton = /<button\s+onClick=\{loadData\}\s+className="text-gray-500 hover:text-lime text-xs uppercase tracking-widest border border-white\/10 px-3 py-1 transition-colors"\s*>\s*Обновить статистику\s*<\/button>/;

const newButton = `<button 
        onClick={loadData}
        disabled={loading}
        className="bg-lime/10 hover:bg-lime/20 disabled:opacity-50 text-lime border border-lime/30 px-4 py-2 rounded text-xs uppercase tracking-widest transition-all font-bold"
      >
        {loading ? 'Загрузка...' : 'Обновить статистику'}
      </button>`;

code = code.replace(oldButton, newButton);
fs.writeFileSync(path, code);
console.log('✅ Кнопка обновления улучшена');
