const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Исправляю заголовок...\n');

// Находим текущий заголовок (который мы только что добавили)
const currentTitle = /<h2 className="gn-display leading-none tracking-tighter"[^>]*>\s*\{\/hookah\/i\.test\(featured\.section\) \? \([\s\S]*?<\/h2>/;

const newTitle = `<h2 className="gn-display leading-none tracking-tighter" style={{ fontSize: "clamp(36px, 7vw, 64px)" }}>
                  {/hookah/i.test(featured.section) ? (
                    <>
                      <span className="gn-neon-white">HOOKAH </span>
                      <span className="gn-neon">НЕДЕЛИ</span>
                    </>
                  ) : (
                    <>
                      <span className="gn-neon-white">КАЛЬЯН </span>
                      <span className="gn-neon">НЕДЕЛИ</span>
                    </>
                  )}
                </h2>`;

if (currentTitle.test(code)) {
  code = code.replace(currentTitle, newTitle);
  console.log('✅ Заголовок исправлен');
} else {
  console.log('❌ Не найден текущий заголовок');
}

fs.writeFileSync(homePath, code);
console.log('\n🔥 Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
