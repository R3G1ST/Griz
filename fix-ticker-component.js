const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Исправляю компонент Ticker...\n');

// Находим текущий компонент Ticker
const oldTicker = /function Ticker\(\{ items \}: \{ items: string\[\] \}\) \{[\s\S]*?\};\n\}/;

const newTicker = `function Ticker({ items }: { items: string[] }) {
  const row = items.length ? items : ["GRIZLI LOUNGE", "ТЮМЕНЬ", "16:00 — 02:00"];
  // Дублируем элементы для бесконечной прокрутки (минимум 20 элементов)
  const repeated = [];
  while (repeated.length < 20) {
    repeated.push(...row);
  }
  
  return (
    <div className="relative overflow-hidden border-y border-[#D4FF3F]/25 bg-black/60 gn-ticker-mask">
      <div className="flex whitespace-nowrap py-3 gn-mono text-[10px] sm:text-[11px] tracking-[0.3em] gn-marquee">
        {repeated.map((t, i) => (
          <span key={i} className="px-6 sm:px-8 flex items-center gap-3 shrink-0">
            <span className="text-[#D4FF3F]/90">◆</span>
            <span className={i % 2 === 0 ? "gn-neon" : "text-[#F5F1E8]/70"}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}`;

if (oldTicker.test(code)) {
  code = code.replace(oldTicker, newTicker);
  console.log('✅ Компонент Ticker исправлен');
} else {
  console.log(' Не найден компонент Ticker');
}

fs.writeFileSync(homePath, code);
console.log('\n Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
