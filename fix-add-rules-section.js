const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Добавляю секцию "Правила" на сайт...\n');

// Добавляем rules в деструктуризацию useSiteSettings
if (!code.includes('rules')) {
  code = code.replace(
    'const { hero, brand, contacts, schedule, loyalty, images, footer, typography } = useSiteSettings();',
    'const { hero, brand, contacts, schedule, loyalty, images, footer, rules, typography } = useSiteSettings();'
  );
  console.log('✅ Добавил rules в деструктуризацию');
}

// Добавляем секцию с правилами после секции лояльности
const loyaltySection = `          </div>
        </div>
      </section>`;

const rulesSection = `          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="gn-serif text-[32px] sm:text-[48px] font-bold text-[#F5F1E8] leading-tight mb-8" style={{ fontSize: \`\${getFontSize("rules", "title", 48, 32)}px\`, fontFamily: getFontFamily("rules", "title") }}>
            ПРАВИЛА
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(rules || []).map((rule: any, i: number) => (
              <div key={i} className="border border-white/10 p-6 rounded-lg bg-white/[0.02]">
                <h3 className="gn-serif text-[20px] sm:text-[24px] font-bold text-[#F5F1E8] mb-3" style={{ fontSize: \`\${getFontSize("rules", \`\${i}.title\`, 24, 20)}px\`, fontFamily: getFontFamily("rules", \`\${i}.title\`) }}>
                  {rule.title}
                </h3>
                <p className="text-[#F5F1E8]/80 text-sm sm:text-base leading-relaxed" style={{ fontSize: \`\${getFontSize("rules", \`\${i}.text\`, 16, 14)}px\`, fontFamily: getFontFamily("rules", \`\${i}.text\`) }}>
                  {rule.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>`;

if (!code.includes('ПРАВИЛА')) {
  code = code.replace(loyaltySection, rulesSection);
  console.log('✅ Добавил секцию с правилами');
}

fs.writeFileSync(homePath, code);
console.log('\n🎉 Секция "Правила" добавлена на сайт!');
console.log('\n🔥 Пересобери сайт:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
