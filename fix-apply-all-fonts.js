const fs = require('fs');

const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(homePath, 'utf8');

console.log('🔧 Добавляю применение шрифтов ко всем полям...\n');

// === БРЕНД ===
// brand.name
if (!code.includes('getFontFamily("brand", "name"')) {
  code = code.replace(
    /<h1 className="gn-serif text-\[40px\] sm:text-\[56px\] font-bold text-\[#F5F1E8\] leading-tight mb-2">\s*\{brand\.name \|\| "ГРИЗЛИ"\}\s*<\/h1>/,
    '<h1 className="gn-serif text-[40px] sm:text-[56px] font-bold text-[#F5F1E8] leading-tight mb-2" style={{ fontSize: `${getFontSize("brand", "name", 56, 40)}px`, fontFamily: getFontFamily("brand", "name") }}>\n                {brand.name || "ГРИЗЛИ"}\n              </h1>'
  );
  console.log('✅ brand.name');
}

// brand.city
if (!code.includes('getFontFamily("brand", "city"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/60 text-sm sm:text-base mb-1">\s*\{brand\.city \|\| "Москва"\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/60 text-sm sm:text-base mb-1" style={{ fontSize: `${getFontSize("brand", "city", 16, 14)}px`, fontFamily: getFontFamily("brand", "city") }}>\n                {brand.city || "Москва"}\n              </p>'
  );
  console.log('✅ brand.city');
}

// brand.estYear
if (!code.includes('getFontFamily("brand", "estYear"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/60 text-sm sm:text-base">\s*EST\. \{brand\.estYear \|\| "2020"\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/60 text-sm sm:text-base" style={{ fontSize: `${getFontSize("brand", "estYear", 16, 14)}px`, fontFamily: getFontFamily("brand", "estYear") }}>\n                EST. {brand.estYear || "2020"}\n              </p>'
  );
  console.log('✅ brand.estYear');
}

// === О НАС ===
// about.title
if (!code.includes('getFontFamily("about", "title"')) {
  code = code.replace(
    /<h2 className="gn-serif text-\[32px\] sm:text-\[48px\] font-bold text-\[#F5F1E8\] leading-tight">\s*\{about\.title \|\| "О нас"\}\s*<\/h2>/,
    '<h2 className="gn-serif text-[32px] sm:text-[48px] font-bold text-[#F5F1E8] leading-tight" style={{ fontSize: `${getFontSize("about", "title", 48, 32)}px`, fontFamily: getFontFamily("about", "title") }}>\n                {about.title || "О нас"}\n              </h2>'
  );
  console.log('✅ about.title');
}

// about.p1
if (!code.includes('getFontFamily("about", "p1"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/80 text-sm sm:text-base leading-relaxed">\s*\{about\.p1 \|\| ""\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/80 text-sm sm:text-base leading-relaxed" style={{ fontSize: `${getFontSize("about", "p1", 16, 14)}px`, fontFamily: getFontFamily("about", "p1") }}>\n                {about.p1 || ""}\n              </p>'
  );
  console.log('✅ about.p1');
}

// about.p2
if (!code.includes('getFontFamily("about", "p2"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/80 text-sm sm:text-base leading-relaxed">\s*\{about\.p2 \|\| ""\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/80 text-sm sm:text-base leading-relaxed" style={{ fontSize: `${getFontSize("about", "p2", 16, 14)}px`, fontFamily: getFontFamily("about", "p2") }}>\n                {about.p2 || ""}\n              </p>'
  );
  console.log('✅ about.p2');
}

// === ЛОЯЛЬНОСТЬ ===
// loyalty.tagline
if (!code.includes('getFontFamily("loyalty", "tagline"')) {
  code = code.replace(
    /<h2 className="gn-serif text-\[32px\] sm:text-\[48px\] font-bold text-\[#F5F1E8\] leading-tight mb-4">\s*\{loyalty\.tagline \|\| "Программа лояльности"\}\s*<\/h2>/,
    '<h2 className="gn-serif text-[32px] sm:text-[48px] font-bold text-[#F5F1E8] leading-tight mb-4" style={{ fontSize: `${getFontSize("loyalty", "tagline", 48, 32)}px`, fontFamily: getFontFamily("loyalty", "tagline") }}>\n                {loyalty.tagline || "Программа лояльности"}\n              </h2>'
  );
  console.log('✅ loyalty.tagline');
}

// loyalty.description
if (!code.includes('getFontFamily("loyalty", "description"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/80 text-sm sm:text-base leading-relaxed mb-8">\s*\{loyalty\.description \|\| ""\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/80 text-sm sm:text-base leading-relaxed mb-8" style={{ fontSize: `${getFontSize("loyalty", "description", 16, 14)}px`, fontFamily: getFontFamily("loyalty", "description") }}>\n                {loyalty.description || ""}\n              </p>'
  );
  console.log('✅ loyalty.description');
}

// === КОНТАКТЫ ===
// contacts.phone
if (!code.includes('getFontFamily("contacts", "phone"')) {
  code = code.replace(
    /<a href=\{`tel:\$\{contacts\.phone \|\| ""\}`\} className="gn-serif text-\[24px\] sm:text-\[32px\] font-bold text-\[#F5F1E8\] hover:text-lime transition-colors">\s*\{contacts\.phone \|\| ""\}\s*<\/a>/,
    '<a href={`tel:${contacts.phone || ""}`} className="gn-serif text-[24px] sm:text-[32px] font-bold text-[#F5F1E8] hover:text-lime transition-colors" style={{ fontSize: `${getFontSize("contacts", "phone", 32, 24)}px`, fontFamily: getFontFamily("contacts", "phone") }}>\n                  {contacts.phone || ""}\n                </a>'
  );
  console.log('✅ contacts.phone');
}

// contacts.address
if (!code.includes('getFontFamily("contacts", "address"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/80 text-sm sm:text-base">\s*\{contacts\.address \|\| ""\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/80 text-sm sm:text-base" style={{ fontSize: `${getFontSize("contacts", "address", 16, 14)}px`, fontFamily: getFontFamily("contacts", "address") }}>\n                  {contacts.address || ""}\n                </p>'
  );
  console.log('✅ contacts.address');
}

// === ПОДВАЛ ===
// footer.tagline
if (!code.includes('getFontFamily("footer", "tagline"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/60 text-sm sm:text-base mb-2">\s*\{footer\.tagline \|\| ""\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/60 text-sm sm:text-base mb-2" style={{ fontSize: `${getFontSize("footer", "tagline", 16, 14)}px`, fontFamily: getFontFamily("footer", "tagline") }}>\n                  {footer.tagline || ""}\n                </p>'
  );
  console.log('✅ footer.tagline');
}

// footer.copyright
if (!code.includes('getFontFamily("footer", "copyright"')) {
  code = code.replace(
    /<p className="text-\[#F5F1E8\]\/40 text-xs">\s*\{footer\.copyright \|\| "© 2024 ГРИЗЛИ\. Все права защищены\."\}\s*<\/p>/,
    '<p className="text-[#F5F1E8]/40 text-xs" style={{ fontSize: `${getFontSize("footer", "copyright", 12, 12)}px`, fontFamily: getFontFamily("footer", "copyright") }}>\n                  {footer.copyright || "© 2024 ГРИЗЛИ. Все права защищены."}\n                </p>'
  );
  console.log('✅ footer.copyright');
}

fs.writeFileSync(homePath, code);
console.log('\n🎉 Все поля теперь поддерживают настройку шрифтов!');
console.log('\n🔥 Пересобери сайт:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
