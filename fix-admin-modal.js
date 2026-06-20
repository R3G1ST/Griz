const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Находим внутренний div модалки и добавляем stopPropagation
const oldModal = `        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setEdit(null); setAdding(null); }}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3" onClick={e => e.stopPropagation()}>`;

const newModal = `        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setEdit(null); setAdding(null); }}>
          <div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3" onClick={e => e.stopPropagation()}>`;

// Ищем внутренний div и добавляем onClick
const oldInnerDiv = `<div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3" onClick={e => e.stopPropagation()}>`;
const newInnerDiv = `<div className="bg-neutral-950 border border-white/10 p-6 max-w-lg w-full space-y-3" onClick={e => { e.stopPropagation(); e.preventDefault(); }}>`;

if (code.includes(oldInnerDiv)) {
  code = code.replace(oldInnerDiv, newInnerDiv);
  fs.writeFileSync(path, code);
  console.log('✅ Модалка исправлена — клики внутри не закрывают окно');
} else {
  console.log('❌ Не удалось найти внутренний div модалки');
}
