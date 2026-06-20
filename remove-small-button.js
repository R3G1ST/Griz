const fs = require('fs');

const files = [
  '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx',
  '/var/www/Griz/artifacts/grizli/src/pages/Card.tsx'
];

files.forEach(filePath => {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Находим и удаляем маленькую кнопку внизу
  const smallButton = /              <a\n                href=\{mapHref\} target="_blank" rel="noopener noreferrer"\n                className="flex items-center justify-between gap-3 px-5 py-3\.5 bg-\[\#D4FF3F\]\/8 hover:bg-\[\#D4FF3F\]\/15 border-t border-\[\#D4FF3F\]\/30 transition group"\n              >\n                <span className="gn-mono text-\[11px\] tracking-\[0\.24em\] text-\[\#D4FF3F\] uppercase">\n                  Открыть в Яндекс\.Картах\n                <\/span>\n                <ArrowUpRight className="w-4 h-4 text-\[\#D4FF3F\] group-hover:translate-x-0\.5 group-hover:-translate-y-0\.5 transition-transform" \/>\n              <\/a>\n/;
  
  if (smallButton.test(code)) {
    code = code.replace(smallButton, '');
    fs.writeFileSync(filePath, code);
    console.log(`✅ ${filePath.split('/').pop()}: маленькая кнопка удалена`);
  } else {
    console.log(`❌ ${filePath.split('/').pop()}: кнопка не найдена`);
  }
});
