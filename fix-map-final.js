const fs = require('fs');

const files = [
  '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx',
  '/var/www/Griz/artifacts/grizli/src/pages/Card.tsx'
];

files.forEach(filePath => {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Заменяем весь блок с mapHref и mapEmbed
  code = code.replace(
    /const mapHref =[\s\S]*?const mapEmbed =[\s\S]*?encodeURIComponent\(contacts\.address\)`[\s\S]*?&scrollZoom=true&zoom=true";/,
    `const mapHref = "https://yandex.ru/maps/org/grizli/20543811009";`
  );
  
  // Заменяем iframe на кнопку
  const oldIframe = /<iframe[\s\S]*?style=\{\{ border: 0, filter: "grayscale\(0\.4\) brightness\(0\.95\)" \}\}[\s\S]*?\/>/;
  
  const newButton = `<div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#D4FF3F]/30 rounded-lg flex flex-col items-center justify-center gap-4 p-6">
                  <MapPin className="w-16 h-16 text-[#D4FF3F]" />
                  <div className="text-center">
                    <div className="gn-mono text-[11px] tracking-[0.2em] text-[#F5F1E8]/70 uppercase mb-2">Мы находимся здесь</div>
                    <div className="text-[#F5F1E8] text-sm mb-1">Тюмень, ул. Новосёлов, 92</div>
                    <div className="text-[#D4FF3F]/60 text-xs mb-4">Гризли · Лаунж-бар</div>
                    <a href={mapHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 gn-mono text-[11px] tracking-[0.18em] text-[#D4FF3F] border border-[#D4FF3F]/40 px-5 py-2.5 hover:bg-[#D4FF3F]/10 transition uppercase">
                      Открыть на карте
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>`;
  
  if (oldIframe.test(code)) {
    code = code.replace(oldIframe, newButton);
    fs.writeFileSync(filePath, code);
    console.log(`✅ ${filePath.split('/').pop()}: карта заменена на кнопку`);
  } else {
    console.log(`❌ ${filePath.split('/').pop()}: iframe не найден`);
  }
});
