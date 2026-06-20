const fs = require('fs');

// Исправляем Booking.tsx
let bookingCode = fs.readFileSync('/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx', 'utf8');

const oldBookingMap = /const mapEmbed =[\s\S]*?"&lang=ru_RU";/;

const newBookingMap = `  const mapEmbed =
    "https://widgets.2gis.com/widget?type=firmsonmap&options=tpos%253Dtop%252Cleft%253Bpos%253Dcenter%252Cbottom%253Bzoom%253D17%252Csize%253D300%252C300%253Brect%253D65.5243%252C57.1480%252C65.5443%252C57.1580%253Bcenter%253D65.5343%252C57.1530&opt=city%252Ctyumen";`;

if (oldBookingMap.test(bookingCode)) {
  bookingCode = bookingCode.replace(oldBookingMap, newBookingMap);
  fs.writeFileSync('/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx', bookingCode);
  console.log('✅ Booking.tsx: карта 2ГИС вставлена');
} else {
  console.log('❌ Booking.tsx: блок не найден');
}

// Исправляем Card.tsx
let cardCode = fs.readFileSync('/var/www/Griz/artifacts/grizli/src/pages/Card.tsx', 'utf8');

const oldCardMap = /const mapEmbed =[\s\S]*?"&lang=ru_RU";/;

const newCardMap = `  const mapEmbed =
    "https://widgets.2gis.com/widget?type=firmsonmap&options=tpos%253Dtop%252Cleft%253Bpos%253Dcenter%252Cbottom%253Bzoom%253D17%252Csize%253D300%252C300%253Brect%253D65.5243%252C57.1480%252C65.5443%252C57.1580%253Bcenter%253D65.5343%252C57.1530&opt=city%252Ctyumen";`;

if (oldCardMap.test(cardCode)) {
  cardCode = cardCode.replace(oldCardMap, newCardMap);
  fs.writeFileSync('/var/www/Griz/artifacts/grizli/src/pages/Card.tsx', cardCode);
  console.log('✅ Card.tsx: карта 2ГИС вставлена');
} else {
  console.log('❌ Card.tsx: блок не найден');
}
