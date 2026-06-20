const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Меняю заголовок секции...\n');

// Находим и заменяем захардкоженный заголовок
const oldTitle = `<h2 className="gn-display leading-none tracking-tighter" style={{ fontSize: "clamp(36px, 7vw, 64px)" }}>
                  <span className="gn-neon-white">КАЛЬЯН </span>
                  <span className="gn-neon">НЕДЕЛИ</span>
                </h2>`;

const newTitle = `<h2 className="gn-display leading-none tracking-tighter" style={{ fontSize: "clamp(36px, 7vw, 64px)" }}>
                  {/hookah/i.test(featured.section) ? (
                    <>
                      <span className="gn-neon-white">HOOKAH </span>
                      <span className="gn-neon">OF THE WEEK</span>
                    </>
                  ) : (
                    <>
                      <span className="gn-neon-white">КАЛЬЯН </span>
                      <span className="gn-neon">НЕДЕЛИ</span>
                    </>
                  )}
                </h2>`;

if (code.includes(oldTitle)) {
  code = code.replace(oldTitle, newTitle);
  console.log('✅ Заголовок секции обновлён');
} else {
  console.log('❌ Не найден старый заголовок');
}

fs.writeFileSync(homePath, code);
console.log('\n🔥 Пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
