const fs = require('fs');

const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Находим блок с датой и временем
const oldBlock = `                <div className="grid grid-cols-2 gap-3">
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required className={\`\${inputClass} [color-scheme:dark]\`} />
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer\`}>`;

const newBlock = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required className={\`\${inputClass} [color-scheme:dark] h-12\`} />
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer h-12\`}>`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, code);
  console.log('✅ Форма бронирования исправлена');
} else {
  console.log('❌ Блок не найден');
}
