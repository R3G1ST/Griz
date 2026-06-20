const fs = require('fs');

const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Находим поле даты и добавляем label
const oldDateField = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required className={\`\${inputClass} [color-scheme:dark] text-[#F5F1E8]/70\`}
                    style={{ fontSize: '14px', lineHeight: '1.5' }} />`;

const newDateField = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="absolute top-2 left-4 text-[10px] text-[#F5F1E8]/50 gn-mono tracking-wider uppercase pointer-events-none">Дата</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange}
                      required className={\`\${inputClass} [color-scheme:dark] pt-5\`}
                      style={{ fontSize: '14px' }} />
                  </div>`;

if (code.includes(oldDateField)) {
  code = code.replace(oldDateField, newDateField);
  fs.writeFileSync(filePath, code);
  console.log('✅ Поле даты с подписью добавлено');
} else {
  console.log('❌ Поле даты не найдено');
}
