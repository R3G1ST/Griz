const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Находим всю структуру модалки и переделываем её
const oldModal = `      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setEdit(null); setAdding(null); }}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3" onClick={e => { e.stopPropagation(); e.preventDefault(); }}>`;

const newModal = `      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3">`;

if (code.includes(oldModal)) {
  code = code.replace(oldModal, newModal);
  fs.writeFileSync(path, code);
  console.log('✅ Модалка переделана — убраны onClick');
} else {
  console.log('❌ Не удалось найти модалку');
}
