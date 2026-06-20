const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Финальный стиль правил...\n');

// Находим текущую секцию правил
const rulesPattern = /\/\* Rules \*\/[\s\S]*?<\/section>/;

const newRules = `      {/* Rules */}
      <section className="relative py-16 sm:py-24 px-5 sm:px-8 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 gn-smoke opacity-60" />
        <div className="absolute inset-0 gn-grid opacity-30" />
        <div className="relative max-w-[1280px] mx-auto">
          <div className="gn-chip mb-5 inline-flex items-center gap-2">
            <Shield className="w-3 h-3" /> <span className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">ПРАВИЛА ДОМА</span>
          </div>
          
          <h2 className="gn-display leading-[0.85] tracking-tighter mb-10" style={{ fontSize: "clamp(40px, 8vw, 80px)" }}>
            <span className="gn-neon-white">ЗДЕСЬ </span>
            <span className="gn-neon">ПРИНЯТО</span>
            <br />
            <span className="gn-stroke">УВАЖАТЬ</span>{" "}
            <span className="gn-neon-white">ДРУГ</span>
            <span className="gn-neon">ДРУГА</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(rules || []).map((rule: any, i: number) => (
              <div key={i} className="gn-glass rounded-md p-6 sm:p-7 relative gn-corner">
                <span className="c1" /><span className="c2" />
                <div className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55 mb-3">
                  ПРАВИЛО №{String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="gn-display text-[18px] sm:text-[22px] gn-neon-white leading-tight mb-3" style={{ fontSize: \`\${getFontSize("rules", \`\${i}.title\`, 22, 18)}px\`, fontFamily: getFontFamily("rules", \`\${i}.title\`) }}>
                  {rule.title.toUpperCase()}
                </h3>
                <p className="text-[#F5F1E8]/70 text-[13px] sm:text-[14px] leading-relaxed" style={{ fontSize: \`\${getFontSize("rules", \`\${i}.text\`, 14, 13)}px\`, fontFamily: getFontFamily("rules", \`\${i}.text\`) }}>
                  {rule.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>`;

if (rulesPattern.test(code)) {
  code = code.replace(rulesPattern, newRules);
  console.log('✅ Секция правил обновлена');
} else {
  console.log('❌ Не найдена секция правил');
}

fs.writeFileSync(homePath, code);
console.log('\n Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
