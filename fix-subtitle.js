const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /<p className="gn-sans text-\[15px\] sm:text-\[18px\] text-\[#F5F1E8\]\/75 max-w-\[520px\] leading-relaxed">/,
  '<p className="gn-sans text-[15px] sm:text-[18px] text-[#F5F1E8]/75 max-w-[520px] leading-relaxed" style={{ fontSize: `${hero.subtitleSize || 18}px`, fontFamily: hero.subtitleFont || "sans-serif" }}>'
);

fs.writeFileSync(path, code);
console.log('✅ Подзаголовок обновлён');
