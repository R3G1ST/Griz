const fs = require('fs');

// Простая замена URL карты на 2ГИС
const files = [
  '/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx',
  '/var/www/Griz/artifacts/grizli/src/pages/Card.tsx'
];

files.forEach(filePath => {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Заменяем только строку с mapEmbed
  code = code.replace(
    /const mapEmbed =[\s\S]*?encodeURIComponent\(contacts\.address\)`;[\s\S]*?"&lang=ru_RU&scroll=true&scrollZoom=true&zoom=true";/,
    `const mapEmbed = "https://yandex.ru/map-widget/v1/?ll=65.5343%2C57.1530&z=17&mode=search&text=%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C%2C+%D1%83%D0%BB%D0%B8%D1%86%D0%B0+%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%B2%2C+92";`
  );
  
  fs.writeFileSync(filePath, code);
  console.log(`✅ ${filePath.split('/').pop()}: карта исправлена`);
});
