const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Добавляю кнопки ⚙️ ко всем полям...\n');

// === БРЕНД ===
// brand.name
if (!code.includes('fontSettingsBtn("brand", "name"')) {
  code = code.replace(
    /<input value=\{brand\.name \|\| ""\} onChange=\{e => update\("brand", \{ \.\.\.brand, name: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={brand.name || ""} onChange={e => update("brand", { ...brand, name: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", "name", brand.name || "")}</div>'
  );
  console.log('✅ brand.name');
}

// brand.city
if (!code.includes('fontSettingsBtn("brand", "city"')) {
  code = code.replace(
    /<input value=\{brand\.city \|\| ""\} onChange=\{e => update\("brand", \{ \.\.\.brand, city: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={brand.city || ""} onChange={e => update("brand", { ...brand, city: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", "city", brand.city || "")}</div>'
  );
  console.log('✅ brand.city');
}

// brand.estYear
if (!code.includes('fontSettingsBtn("brand", "estYear"')) {
  code = code.replace(
    /<input value=\{brand\.estYear \|\| ""\} onChange=\{e => update\("brand", \{ \.\.\.brand, estYear: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={brand.estYear || ""} onChange={e => update("brand", { ...brand, estYear: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", "estYear", brand.estYear || "")}</div>'
  );
  console.log('✅ brand.estYear');
}

// brand.badgeText
if (!code.includes('fontSettingsBtn("brand", "badgeText"')) {
  code = code.replace(
    /<input value=\{brand\.badgeText \|\| ""\} onChange=\{e => update\("brand", \{ \.\.\.brand, badgeText: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={brand.badgeText || ""} onChange={e => update("brand", { ...brand, badgeText: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", "badgeText", brand.badgeText || "")}</div>'
  );
  console.log('✅ brand.badgeText');
}

// === КОНТАКТЫ ===
// contacts.phone
if (!code.includes('fontSettingsBtn("contacts", "phone"')) {
  code = code.replace(
    /<input value=\{contacts\.phone \|\| ""\} onChange=\{e => update\("contacts", \{ \.\.\.contacts, phone: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={contacts.phone || ""} onChange={e => update("contacts", { ...contacts, phone: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("contacts", "phone", contacts.phone || "")}</div>'
  );
  console.log('✅ contacts.phone');
}

// contacts.address
if (!code.includes('fontSettingsBtn("contacts", "address"')) {
  code = code.replace(
    /<input value=\{contacts\.address \|\| ""\} onChange=\{e => update\("contacts", \{ \.\.\.contacts, address: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={contacts.address || ""} onChange={e => update("contacts", { ...contacts, address: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("contacts", "address", contacts.address || "")}</div>'
  );
  console.log('✅ contacts.address');
}

// === ГЛАВНЫЙ ЭКРАН ===
// hero.title2
if (!code.includes('fontSettingsBtn("hero", "title2"')) {
  code = code.replace(
    /<input value=\{hero\.title2 \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, title2: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={hero.title2 || ""} onChange={e => update("hero", { ...hero, title2: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("hero", "title2", hero.title2 || "")}</div>'
  );
  console.log('✅ hero.title2');
}

// hero.subtitle
if (!code.includes('fontSettingsBtn("hero", "subtitle"')) {
  code = code.replace(
    /<textarea value=\{hero\.subtitle \|\| ""\} onChange=\{e => update\("hero", \{ \.\.\.hero, subtitle: e\.target\.value \}\)\} rows=\{3\} className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={hero.subtitle || ""} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} rows={3} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("hero", "subtitle", hero.subtitle || "")}</div>'
  );
  console.log('✅ hero.subtitle');
}

// === О НАС ===
// about.title
if (!code.includes('fontSettingsBtn("about", "title"')) {
  code = code.replace(
    /<input value=\{about\.title \|\| ""\} onChange=\{e => update\("about", \{ \.\.\.about, title: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={about.title || ""} onChange={e => update("about", { ...about, title: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("about", "title", about.title || "")}</div>'
  );
  console.log('✅ about.title');
}

// about.p1
if (!code.includes('fontSettingsBtn("about", "p1"')) {
  code = code.replace(
    /<textarea value=\{about\.p1 \|\| ""\} onChange=\{e => update\("about", \{ \.\.\.about, p1: e\.target\.value \}\)\} rows=\{3\} className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={about.p1 || ""} onChange={e => update("about", { ...about, p1: e.target.value })} rows={3} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("about", "p1", about.p1 || "")}</div>'
  );
  console.log('✅ about.p1');
}

// about.p2
if (!code.includes('fontSettingsBtn("about", "p2"')) {
  code = code.replace(
    /<textarea value=\{about\.p2 \|\| ""\} onChange=\{e => update\("about", \{ \.\.\.about, p2: e\.target\.value \}\)\} rows=\{3\} className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={about.p2 || ""} onChange={e => update("about", { ...about, p2: e.target.value })} rows={3} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("about", "p2", about.p2 || "")}</div>'
  );
  console.log('✅ about.p2');
}

// === ЛОЯЛЬНОСТЬ ===
// loyalty.tagline
if (!code.includes('fontSettingsBtn("loyalty", "tagline"')) {
  code = code.replace(
    /<input value=\{loyalty\.tagline \|\| ""\} onChange=\{e => update\("loyalty", \{ \.\.\.loyalty, tagline: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={loyalty.tagline || ""} onChange={e => update("loyalty", { ...loyalty, tagline: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("loyalty", "tagline", loyalty.tagline || "")}</div>'
  );
  console.log('✅ loyalty.tagline');
}

// loyalty.description
if (!code.includes('fontSettingsBtn("loyalty", "description"')) {
  code = code.replace(
    /<textarea value=\{loyalty\.description \|\| ""\} onChange=\{e => update\("loyalty", \{ \.\.\.loyalty, description: e\.target\.value \}\)\} rows=\{3\} className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={loyalty.description || ""} onChange={e => update("loyalty", { ...loyalty, description: e.target.value })} rows={3} className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("loyalty", "description", loyalty.description || "")}</div>'
  );
  console.log('✅ loyalty.description');
}

// === ПОДВАЛ ===
// footer.tagline
if (!code.includes('fontSettingsBtn("footer", "tagline"')) {
  code = code.replace(
    /<input value=\{footer\.tagline \|\| ""\} onChange=\{e => update\("footer", \{ \.\.\.footer, tagline: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={footer.tagline || ""} onChange={e => update("footer", { ...footer, tagline: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("footer", "tagline", footer.tagline || "")}</div>'
  );
  console.log('✅ footer.tagline');
}

// footer.copyright
if (!code.includes('fontSettingsBtn("footer", "copyright"')) {
  code = code.replace(
    /<input value=\{footer\.copyright \|\| ""\} onChange=\{e => update\("footer", \{ \.\.\.footer, copyright: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={footer.copyright || ""} onChange={e => update("footer", { ...footer, copyright: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("footer", "copyright", footer.copyright || "")}</div>'
  );
  console.log('✅ footer.copyright');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Все кнопки ⚙️ добавлены!');
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
