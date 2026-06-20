const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Добавляю редактор бегущей строки...\n');

// Находим место перед секцией "Подвал сайта"
const footerSection = /      {\/\* Footer \*\/}\s*<div className=\{sectionClass\}>/;

const tickerSection = `      {/* Ticker */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Бегущая строка</h3>
          {saveBtn("ticker")}
        </div>
        <p className="text-gray-500 text-xs mb-4">Тексты, которые бегут сверху сайта. Можно добавлять, удалять и редактировать.</p>
        {(ticker as string[]).map((text, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={text} onChange={e => {
              const next = [...ticker]; next[i] = e.target.value; update("ticker", next);
            }} placeholder="Текст строки" className={\`\${fieldClass} flex-1\`} />
            <button onClick={() => update("ticker", ticker.filter((_: any, j: number) => j !== i))}
              className="px-3 text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs">✕</button>
          </div>
        ))}
        <button onClick={() => update("ticker", [...ticker, "Новый текст"])}
          className="text-xs text-lime border border-lime/30 px-3 py-2 hover:bg-lime/10 uppercase tracking-widest">+ Добавить строку</button>
      </div>

      {/* Footer */}
      <div className={sectionClass}>`;

if (footerSection.test(code)) {
  code = code.replace(footerSection, tickerSection);
  console.log('✅ Секция бегущей строки добавлена');
} else {
  console.log('❌ Не найдена секция Footer');
}

// Добавляем ticker в деструктуризацию useSiteSettings
if (!code.includes('const { hero, brand, contacts, schedule, loyalty, images, footer, rules, ticker }')) {
  code = code.replace(
    /const \{ hero, brand, contacts, schedule, loyalty, images, footer, rules \} = useSiteSettings\(\);/,
    'const { hero, brand, contacts, schedule, loyalty, images, footer, rules, ticker } = useSiteSettings();'
  );
  console.log('✅ Добавлен ticker в деструктуризацию');
}

fs.writeFileSync(adminPath, code);
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
