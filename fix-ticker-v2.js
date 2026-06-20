const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Исправляю Ticker (2 одинаковых блока)...\n');

const oldTicker = /function Ticker\(\{ items \}: \{ items: string\[\] \}\) \{[\s\S]*?\};\n\}/;

const newTicker = `function Ticker({ items }: { items: string[] }) {
  const row = items.length ? items : ["GRIZLI LOUNGE", "ТЮМЕНЬ", "16:00 — 02:00"];
  
  return (
    <div className="relative overflow-hidden border-y border-[#D4FF3F]/25 bg-black/60 gn-ticker-mask">
      <div className="flex whitespace-nowrap py-3 gn-mono text-[10px] sm:text-[11px] tracking-[0.3em] gn-marquee">
        {/* Блок 1 */}
        {row.map((t, i) => (
          <span key={\`a-\${i}\`} className="px-6 sm:px-8 flex items-center gap-3 shrink-0">
            <span className="text-[#D4FF3F]/90">◆</span>
            <span className={i % 2 === 0 ? "gn-neon" : "text-[#F5F1E8]/70"}>{t}</span>
          </span>
        ))}
        {/* Блок 2 (идентичный первому для бесшовной анимации) */}
        {row.map((t, i) => (
          <span key={\`b-\${i}\`} className="px-6 sm:px-8 flex items-center gap-3 shrink-0">
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
  console.log('✅ Ticker исправлен');
} else {
  console.log('❌ Не найден Ticker');
}

fs.writeFileSync(homePath, code);
console.log('\n🔥 Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
