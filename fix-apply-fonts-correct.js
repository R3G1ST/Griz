const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Применяю стили к реальным элементам...\n');

// brand.city (строка 310)
if (!code.includes('getFontFamily("brand", "city"')) {
  code = code.replace(
    /<span className="gn-chip-dim hidden sm:inline-flex">v\.2026 \/ \{brand\.city\.toUpperCase\(\)\}<\/span>/,
    '<span className="gn-chip-dim hidden sm:inline-flex" style={{ fontSize: `${getFontSize("brand", "city", 14, 12)}px`, fontFamily: getFontFamily("brand", "city") }}>v.2026 / {brand.city.toUpperCase()}</span>'
  );
  console.log('✅ brand.city (строка 310)');
}

// brand.city (строка 336)
if (!code.includes('getFontFamily("brand", "city"')) {
  code = code.replace(
    /<span className="gn-stroke">В&nbsp;\{brand\.city\.toUpperCase\(\)\}<\/span>/,
    '<span className="gn-stroke" style={{ fontSize: `${getFontSize("brand", "city", 28, 20)}px`, fontFamily: getFontFamily("brand", "city") }}>В&nbsp;{brand.city.toUpperCase()}</span>'
  );
  console.log('✅ brand.city (строка 336)');
}

// contacts.phone (строка 389)
if (!code.includes('getFontFamily("contacts", "phone"')) {
  code = code.replace(
    /\{ Icon: Phone, text: contacts\.phone \}/,
    '{ Icon: Phone, text: contacts.phone, style: { fontSize: `${getFontSize("contacts", "phone", 14, 12)}px`, fontFamily: getFontFamily("contacts", "phone") } }'
  );
  console.log('✅ contacts.phone');
}

// contacts.address (строка 387)
if (!code.includes('getFontFamily("contacts", "address"')) {
  code = code.replace(
    /\{ Icon: MapPin, text: contacts\.address\.replace\(\^г\\.\\s\*\/i, ""\)\.toUpperCase\(\) \}/,
    '{ Icon: MapPin, text: contacts.address.replace(/^г\\.\\s*/i, "").toUpperCase(), style: { fontSize: `${getFontSize("contacts", "address", 14, 12)}px`, fontFamily: getFontFamily("contacts", "address") } }'
  );
  console.log('✅ contacts.address');
}

// loyalty.tagline (строка 607)
if (!code.includes('getFontFamily("loyalty", "tagline"')) {
  code = code.replace(
    /<Zap className="w-3 h-3" \/> \{loyalty\.tagline\.toUpperCase\(\)\}/,
    '<Zap className="w-3 h-3" /> <span style={{ fontSize: `${getFontSize("loyalty", "tagline", 16, 14)}px`, fontFamily: getFontFamily("loyalty", "tagline") }}>{loyalty.tagline.toUpperCase()}</span>'
  );
  console.log('✅ loyalty.tagline');
}

// loyalty.description (строка 623)
if (!code.includes('getFontFamily("loyalty", "description"')) {
  code = code.replace(
    /\{loyalty\.description\}/,
    '<span style={{ fontSize: `${getFontSize("loyalty", "description", 16, 14)}px`, fontFamily: getFontFamily("loyalty", "description") }}>{loyalty.description}</span>'
  );
  console.log('✅ loyalty.description');
}

// footer.tagline (строка 822)
if (!code.includes('getFontFamily("footer", "tagline"')) {
  code = code.replace(
    /\{footer\.tagline\}/,
    '<span style={{ fontSize: `${getFontSize("footer", "tagline", 14, 12)}px`, fontFamily: getFontFamily("footer", "tagline") }}>{footer.tagline}</span>'
  );
  console.log('✅ footer.tagline');
}

fs.writeFileSync(homePath, code);
console.log('\n🎉 Стили применены!');
console.log('\n🔥 Пересобери сайт:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
