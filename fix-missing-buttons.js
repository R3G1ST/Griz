const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Добавляю недостающие кнопки...\n');

// === БРЕНД ===
if (!code.includes('fontSettingsBtn("brand", key')) {
  code = code.replace(
    /<input value=\{brand\[key\] \|\| ""\} onChange=\{e => update\("brand", \{ \.\.\.brand, \[key\]: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={brand[key] || ""} onChange={e => update("brand", { ...brand, [key]: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("brand", key, brand[key] || "")}</div>'
  );
  console.log('✅ brand');
}

// === КОНТАКТЫ ===
if (!code.includes('fontSettingsBtn("contacts", key')) {
  code = code.replace(
    /<input value=\{contacts\[key\] \|\| ""\} onChange=\{e => update\("contacts", \{ \.\.\.contacts, \[key\]: e\.target\.value \}\)\}\s*className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={contacts[key] || ""} onChange={e => update("contacts", { ...contacts, [key]: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("contacts", key, contacts[key] || "")}</div>'
  );
  console.log('✅ contacts');
}

// === FOOTER ===
if (!code.includes('fontSettingsBtn("footer", "tagline"')) {
  code = code.replace(
    /<input value=\{footer\.tagline \|\| ""\} onChange=\{e => update\("footer", \{ \.\.\.footer, tagline: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={footer.tagline || ""} onChange={e => update("footer", { ...footer, tagline: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("footer", "tagline", footer.tagline || "")}</div>'
  );
  console.log('✅ footer.tagline');
}

if (!code.includes('fontSettingsBtn("footer", "copyright"')) {
  code = code.replace(
    /<input value=\{footer\.copyright \|\| ""\} onChange=\{e => update\("footer", \{ \.\.\.footer, copyright: e\.target\.value \}\)\} className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={footer.copyright || ""} onChange={e => update("footer", { ...footer, copyright: e.target.value })} className={`${fieldClass} flex-1`} />{fontSettingsBtn("footer", "copyright", footer.copyright || "")}</div>'
  );
  console.log('✅ footer.copyright');
}

fs.writeFileSync(adminPath, code);
console.log('\n✅ Все кнопки добавлены!');
