const fs = require('fs');

// Заменяем iframe на ссылку в Booking.tsx
let bookingCode = fs.readFileSync('/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx', 'utf8');

// Находим iframe и заменяем на ссылку
const iframePattern = /<iframe[\s\S]*?style=\{\{ border: 0, filter: "grayscale\(0\.4\) brightness\(0\.95\)" \}\}[\s\S]*?\/>/;

const linkReplacement = `<a href={mapHref} target="_blank" rel="noopener noreferrer" className="block w-full h-full bg-gradient-to-br from-[#D4FF3F]/20 to-[#D4FF3F]/5 border border-[#D4FF3F]/30 rounded-lg flex items-center justify-center hover:border-[#D4FF3F] transition group">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#D4FF3F] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="gn-mono text-[11px] tracking-[0.18em] text-[#F5F1E8]/70 uppercase mb-2">Открыть на карте</div>
                    <div className="text-[#D4FF3F] text-sm font-medium">2ГИС / Яндекс.Карты</div>
                  </div>
                </a>`;

if (iframePattern.test(bookingCode)) {
  bookingCode = bookingCode.replace(iframePattern, linkReplacement);
  fs.writeFileSync('/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx', bookingCode);
  console.log('✅ Booking.tsx: iframe заменён на ссылку');
} else {
  console.log('❌ Booking.tsx: iframe не найден');
}

// Заменяем iframe на ссылку в Card.tsx
let cardCode = fs.readFileSync('/var/www/Griz/artifacts/grizli/src/pages/Card.tsx', 'utf8');

if (iframePattern.test(cardCode)) {
  cardCode = cardCode.replace(iframePattern, linkReplacement);
  fs.writeFileSync('/var/www/Griz/artifacts/grizli/src/pages/Card.tsx', cardCode);
  console.log('✅ Card.tsx: iframe заменён на ссылку');
} else {
  console.log('❌ Card.tsx: iframe не найден');
}
