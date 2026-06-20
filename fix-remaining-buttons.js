const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log(' Добавляю оставшиеся кнопки ⚙️...\n');

// === БРЕНД: меняем input внутри .map() ===
if (!code.includes('fontSettingsBtn("brand", key')) {
  code = code.replace(
    /<input value=\{brand\[key\] \|\| ""\} onChange=\{e => update\("brand", \{ \.\.\.brand, \[key\]: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={brand[key] || ""} onChange={e => update("brand", { ...brand, [key]: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", key, brand[key] || "")}</div>'
  );
  console.log('✅ brand поля');
}

// === КОНТАКТЫ: меняем input внутри .map() ===
if (!code.includes('fontSettingsBtn("contacts", key')) {
  code = code.replace(
    /<input value=\{contacts\[key\] \|\| ""\} onChange=\{e => update\("contacts", \{ \.\.\.contacts, \[key\]: e\.target\.value \}\)\}\s*className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={contacts[key] || ""} onChange={e => update("contacts", { ...contacts, [key]: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("contacts", key, contacts[key] || "")}</div>'
  );
  console.log('✅ contacts поля');
}

// === О НАС: about.title ===
if (!code.includes('fontSettingsBtn("about", "title"')) {
  code = code.replace(
    /<input value=\{about\.title \|\| ""\} onChange=\{e => update\("about", \{ \.\.\.about, title: e\.target\.value \}\)\} className=\{\`\$\{fieldClass\} mb-3\`\} \/>/,
    '<div className="flex gap-2"><input value={about.title || ""} onChange={e => update("about", { ...about, title: e.target.value })} className={`${fieldClass} mb-3 flex-1`} />{fontSettingsBtn("about", "title", about.title || "")}</div>'
  );
  console.log('✅ about.title');
}

// === О НАС: about.p1 ===
if (!code.includes('fontSettingsBtn("about", "p1"')) {
  code = code.replace(
    /<textarea value=\{about\.p1 \|\| ""\} onChange=\{e => update\("about", \{ \.\.\.about, p1: e\.target\.value \}\)\} rows=\{3\} className=\{\`\$\{fieldClass\} resize-none mb-3\`\} \/>/,
    '<div className="flex gap-2"><textarea value={about.p1 || ""} onChange={e => update("about", { ...about, p1: e.target.value })} rows={3} className={`${fieldClass} resize-none mb-3 flex-1`} />{fontSettingsBtn("about", "p1", about.p1 || "")}</div>'
  );
  console.log('✅ about.p1');
}

// === ГЛАВНЫЙ ЭКРАН: hero.subtitle ===
if (!code.includes('fontSettingsBtn("hero", "subtitle"')) {
  code = code.replace(
    /<textarea value=\{hero\.subtitle \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, subtitle: e\.target\.value \}\)\} rows=\{2\} className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={2} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("hero", "subtitle", hero.subtitle || "")}</div>'
  );
  console.log('✅ hero.subtitle');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Все кнопки ⚙️ добавлены!');
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
