const fs = require('fs');

const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Заменяем блок с датой на select как у времени
const oldBlock = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="gn-mono text-[10px] tracking-[0.2em] text-[#D4FF3F]/70 uppercase mb-2 pl-1">Дата</div>
                    <input type="date" name="date" value={form.date} onChange={handleChange}
                      required className={\`\${inputClass} [color-scheme:dark]\`} />
                  </div>
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer\`}>
                    <option value="" disabled className="bg-black">Время</option>`;

const newBlock = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select name="date" value={form.date} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer\`}>
                    <option value="" disabled className="bg-black">Дата</option>
                    {(() => {
                      const dates = [];
                      const today = new Date();
                      for (let i = 0; i < 14; i++) {
                        const date = new Date(today);
                        date.setDate(today.getDate() + i);
                        const dateStr = date.toISOString().split('T')[0];
                        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
                        const dayNum = date.getDate();
                        const month = date.toLocaleDateString('ru-RU', { month: 'short' });
                        dates.push(
                          <option key={dateStr} value={dateStr} className="bg-black">
                            {dayName.charAt(0).toUpperCase() + dayName.slice(1) + ', ' + dayNum + ' ' + month}
                          </option>
                        );
                      }
                      return dates;
                    })()}
                  </select>
                  <select name="time" value={form.time} onChange={handleChange} required
                    className={\`\${inputClass} cursor-pointer\`}>
                    <option value="" disabled className="bg-black">Время</option>`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, code);
  console.log('✅ Поле даты заменено на select с опциями');
} else {
  console.log('❌ Блок не найден');
}
