const fs = require('fs');
const path = '/etc/nginx/sites-available/qmbox';
let config = fs.readFileSync(path, 'utf8');

// Добавляем отключение кэша для HTML
if (!config.includes('no-cache')) {
  config = config.replace(
    'location / {',
    'location / {\n    add_header Cache-Control "no-cache, no-store, must-revalidate";\n    add_header Pragma "no-cache";\n    add_header Expires 0;'
  );
  fs.writeFileSync(path, config);
  console.log('✅ Nginx настроен на отключение кэша');
} else {
  console.log('✅ Кэш уже отключён');
}
