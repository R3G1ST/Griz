const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Меняю стиль секции "Правила"...\n');

// Находим и удаляем текущую секцию правил
const currentRulesSection = /\/\* Rules \*\/\s*<section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white\/5">[\s\S]*?<\/section>/;

const newRulesSection = `      {/* Rules */}
      <section className="relative py-16 sm:py-24 px-5 sm:px-8 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 gn-smoke opacity-60" />
        <div className="absolute inset-0 gn-grid opacity-30" />
        <div className="relative max-w-[1280px] mx-auto">
          <div className="gn-chip mb-6 inline-flex items-center gap-2">
            <Shield className="w-3 h-3" /> <span className="gn-mono text-[10px] tracking-[0.3em] text-[#F5F1E8]/55">ПРАВИЛА ДОМА</span>
          </div>
          
          <h2 className="gn-display leading-[0.85] tracking-tighter mb-10" style={{ fontSize: "clamp(32px, 6vw, 64px)" }}>
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
                <h3 className="gn-display text-[20px] sm:text-[24px] gn-neon-white leading-tight mb-3" style={{ fontSize: \`\${getFontSize("rules", \`\${i}.title\`, 24, 20)}px\`, fontFamily: getFontFamily("rules", \`\${i}.title\`) }}>
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

if (currentRulesSection.test(code)) {
  code = code.replace(currentRulesSection, newRulesSection);
  console.log('✅ Секция правил обновлена');
} else {
  console.log('❌ Не найдена текущая секция правил');
}

// Добавляем Shield в импорты если нет
if (!code.includes('Shield')) {
  code = code.replace(
    /import \{([^}]+)\} from "lucide-react";/,
    (match, imports) => {
      if (!imports.includes('Shield')) {
        return `import {${imports}, Shield} from "lucide-react";`;
      }
      return match;
    }
  );
  console.log('✅ Добавлен Shield в импорты');
}

fs.writeFileSync(homePath, code);
console.log('\n Стиль правил обновлён!');
console.log('\n🔥 Пересобери сайт:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
