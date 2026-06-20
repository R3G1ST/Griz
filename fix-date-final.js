const fs = require('fs');

const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Заменяем блок с датой и временем
const oldBlock = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="absolute top-2 left-4 text-[10px] text-[#F5F1E8]/50 gn-mono tracking-wider uppercase pointer-events-none">Дата</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange}
                      required className={\`\${inputClass} [color-scheme:dark] pt-5\`}
                      style={{ fontSize: '14px' }} />
                  </div>
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer h-12\`}>`;

const newBlock = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required placeholder="Дата" className={\`\${inputClass} [color-scheme:dark]\`} />
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer\`}>`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, code);
  console.log('✅ Поле даты исправлено');
} else {
  console.log('❌ Блок не найден');
}

// Исправляем вылезание формы - добавляем overflow-hidden и правильные отступы
code = code.replace(
  'className="gn-glass-lime rounded-2xl p-6 sm:p-8"',
  'className="gn-glass-lime rounded-2xl p-5 sm:p-8 overflow-hidden"'
);

fs.writeFileSync(filePath, code);
console.log('✅ Форма исправлена');
