const fs = require('fs');

// 1. Исправляем компонент Ticker в Home.tsx
const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let homeCode = fs.readFileSync(homePath, 'utf8');

const tickerRegex = /function Ticker\(\{ items \}: \{ items: string\[\] \}\) \{[\s\S]*?\n\}/;

const newTicker = `function Ticker({ items }: { items: string[] }) {
  const row = items.length ? items : ["GRIZLI LOUNGE", "ТЮМЕНЬ", "16:00 — 02:00"];

  const renderBlock = (suffix: string) => (
    <div className="flex shrink-0">
      {row.map((t, i) => (
        <span key={\`\${suffix}-\${i}\`} className="px-6 sm:px-8 flex items-center gap-3">
          <span className="text-[#D4FF3F]/90">◆</span>
          <span className={i % 2 === 0 ? "gn-neon" : "text-[#F5F1E8]/70"}>{t}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-[#D4FF3F]/25 bg-black/60 gn-ticker-mask">
      <div className="flex w-max whitespace-nowrap py-3 gn-mono text-[10px] sm:text-[11px] tracking-[0.3em] gn-marquee">
        {renderBlock('a')}
        {renderBlock('b')}
        {renderBlock('c')}
      </div>
    </div>
  );
}`;

if (tickerRegex.test(homeCode)) {
  homeCode = homeCode.replace(tickerRegex, newTicker);
  fs.writeFileSync(homePath, homeCode);
  console.log('✅ Home.tsx обновлён');
} else {
  console.log('❌ Функция Ticker не найдена');
}

// 2. Исправляем CSS анимацию
const cssPath = '/var/www/Griz/artifacts/grizli/src/index.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');

const keyframesRegex = /@keyframes gn-marquee \{[\s\S]*?\}/;
const newKeyframes = `@keyframes gn-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.3333%); }
}`;

if (keyframesRegex.test(cssCode)) {
  cssCode = cssCode.replace(keyframesRegex, newKeyframes);
  fs.writeFileSync(cssPath, cssCode);
  console.log('✅ index.css обновлён');
} else {
  console.log('❌ Keyframes не найдены');
}
