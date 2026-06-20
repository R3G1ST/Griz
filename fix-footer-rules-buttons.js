const fs = require('fs');

const adminPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(adminPath, 'utf8');

console.log('🔧 Добавляю кнопки ⚙️ к Подвалу и Правилам...\n');

// === ПОДВАЛ: footer.tagline ===
if (!code.includes('fontSettingsBtn("footer", "tagline"')) {
  code = code.replace(
    /<input value=\{footer\.tagline \|\| ""\} onChange=\{e => update\("footer", \{ \.\.\.footer, tagline: e\.target\.value \}\)\} className=\{\`\$\{fieldClass\} mb-3\`\} \/>/,
    '<div className="flex gap-2"><input value={footer.tagline || ""} onChange={e => update("footer", { ...footer, tagline: e.target.value })} className={`${fieldClass} mb-3 flex-1`} />{fontSettingsBtn("footer", "tagline", footer.tagline || "")}</div>'
  );
  console.log('✅ footer.tagline');
}

// === ПОДВАЛ: footer.copyright ===
if (!code.includes('fontSettingsBtn("footer", "copyright"')) {
  code = code.replace(
    /<input value=\{footer\.copyright \|\| ""\} onChange=\{e => update\("footer", \{ \.\.\.footer, copyright: e\.target\.value \}\)\} placeholder="© ГРИЗЛИ Hookah Lounge" className=\{fieldClass\} \/>/,
    '<div className="flex gap-2"><input value={footer.copyright || ""} onChange={e => update("footer", { ...footer, copyright: e.target.value })} placeholder="© ГРИЗЛИ Hookah Lounge" className={`${fieldClass} flex-1`} />{fontSettingsBtn("footer", "copyright", footer.copyright || "")}</div>'
  );
  console.log('✅ footer.copyright');
}

// === ПРАВИЛА: добавляем кнопки к title и text ===
if (!code.includes('fontSettingsBtn("rules", i, "title"')) {
  // Добавляем кнопку к title
  code = code.replace(
    /<input value=\{row\.title\} onChange=\{e => \{\s*const next = \[\.\.\.rules\]; next\[i\] = \{ \.\.\.row, title: e\.target\.value \}; update\("rules", next\);\s*\}\} placeholder="Заголовок" className=\{fieldClass\} \/>/,
    '<div className="flex gap-2 flex-1"><input value={row.title} onChange={e => { const next = [...rules]; next[i] = { ...row, title: e.target.value }; update("rules", next); }} placeholder="Заголовок" className={`${fieldClass} flex-1`} />{fontSettingsBtn("rules", `${i}.title`, row.title)}</div>'
  );
  console.log('✅ rules.title');
}

if (!code.includes('fontSettingsBtn("rules", i, "text"')) {
  // Добавляем кнопку к text
  code = code.replace(
    /<textarea value=\{row\.text\} onChange=\{e => \{\s*const next = \[\.\.\.rules\]; next\[i\] = \{ \.\.\.row, text: e\.target\.value \}; update\("rules", next\);\s*\}\} rows=\{2\} placeholder="Текст правила" className=\{\`\$\{fieldClass\} resize-none\`\} \/>/,
    '<div className="flex gap-2"><textarea value={row.text} onChange={e => { const next = [...rules]; next[i] = { ...row, text: e.target.value }; update("rules", next); }} rows={2} placeholder="Текст правила" className={`${fieldClass} resize-none flex-1`} />{fontSettingsBtn("rules", `${i}.text`, row.text)}</div>'
  );
  console.log('✅ rules.text');
}

fs.writeFileSync(adminPath, code);
console.log('\n🎉 Все кнопки ⚙️ добавлены!');
console.log('\n🔥 Пересобери админку:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && ./scripts/restart-all.sh');
