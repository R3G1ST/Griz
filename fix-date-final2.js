const fs = require('fs');

const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Заменяем пустое поле даты на блок с label
const oldDate = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required placeholder="Дата" className={\`\${inputClass} [color-scheme:dark]\`} />`;

const newDate = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.2em] text-[#D4FF3F]/70 uppercase mb-2 pl-1">Дата</div>
                    <input type="date" name="date" value={form.date} onChange={handleChange}
                      required className={\`\${inputClass} [color-scheme:dark]\`} />
                  </div>`;

if (code.includes(oldDate)) {
  code = code.replace(oldDate, newDate);
  console.log('✅ Поле даты с подписью добавлено');
} else {
  console.log('❌ Поле даты не найдено');
}

// 2. Исправляем вылезание формы - убираем overflow-hidden, добавляем pb-2
code = code.replace(
  'className="gn-glass-lime rounded-2xl p-5 sm:p-8 overflow-hidden"',
  'className="gn-glass-lime rounded-2xl p-5 sm:p-8"'
);

fs.writeFileSync(filePath, code);
console.log('✅ Готово!');
