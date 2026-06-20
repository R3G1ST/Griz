const fs = require('fs');

// Исправляем Booking.tsx
let bookingCode = fs.readFileSync('/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx', 'utf8');

const oldBookingMap = `  const mapEmbed =
    "https://yandex.ru/map-widget/v1/?ll=57.1352%2C65.5343&z=16&mode=search&" +
    \`text=\${encodeURIComponent(contacts.address)}\` +
    "&lang=ru_RU&scroll=true&scrollZoom=true&zoom=true";`;

const newBookingMap = `  const mapEmbed =
    "https://yandex.ru/map-widget/v1/?ll=65.5343%2C57.1530&z=17&mode=search&" +
    \`text=\${encodeURIComponent("Тюмень, улица Новосёлов, 92")}\` +
    "&lang=ru_RU";`;

if (bookingCode.includes(oldBookingMap)) {
  bookingCode = bookingCode.replace(oldBookingMap, newBookingMap);
  fs.writeFileSync('/var/www/Griz/artifacts/grizli/src/pages/Booking.tsx', bookingCode);
  console.log('✅ Booking.tsx: карта исправлена');
} else {
  console.log('❌ Booking.tsx: блок не найден');
}

// Исправляем Card.tsx
let cardCode = fs.readFileSync('/var/www/Griz/artifacts/grizli/src/pages/Card.tsx', 'utf8');

const oldCardMap = `  const mapEmbed =
    "https://yandex.ru/map-widget/v1/?ll=57.1352%2C65.5343&z=16&mode=search&" +
    \`text=\${encodeURIComponent(contacts.address)}\` +
    "&lang=ru_RU&scroll=true&scrollZoom=true&zoom=true";`;

const newCardMap = `  const mapEmbed =
    "https://yandex.ru/map-widget/v1/?ll=65.5343%2C57.1530&z=17&mode=search&" +
    \`text=\${encodeURIComponent("Тюмень, улица Новосёлов, 92")}\` +
    "&lang=ru_RU";`;

if (cardCode.includes(oldCardMap)) {
  cardCode = cardCode.replace(oldCardMap, newCardMap);
  fs.writeFileSync('/var/www/Griz/artifacts/grizli/src/pages/Card.tsx', cardCode);
  console.log('✅ Card.tsx: карта исправлена');
} else {
  console.log('❌ Card.tsx: блок не найден');
}
