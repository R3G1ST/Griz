const fs = require('fs');

// 1. Увеличиваем интервал автообновления с 10с до 30с
const appPath = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8');
appCode = appCode.replace(/setInterval\(loadData, 10000\)/, 'setInterval(loadData, 30000)');
fs.writeFileSync(appPath, appCode);
console.log('✅ Интервал увеличен до 30 сек');

// 2. Оптимизируем сборку Vite
const vitePath = '/var/www/Griz/artifacts/grizli-admin/vite.config.ts';
let viteCode = fs.readFileSync(vitePath, 'utf8');

if (!viteCode.includes('manualChunks')) {
  viteCode = viteCode.replace(
    'build: {',
    'build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: [\'react\', \'react-dom\'],\n        },\n      },\n    },'
  );
  fs.writeFileSync(vitePath, viteCode);
  console.log('✅ Vite оптимизирован (code splitting)');
}

// 3. Включаем gzip в Nginx
const nginxPath = '/etc/nginx/sites-available/qmbox';
let nginxConfig = fs.readFileSync(nginxPath, 'utf8');

if (!nginxConfig.includes('gzip on')) {
  nginxConfig = nginxConfig.replace(
    'server {',
    'server {\n    gzip on;\n    gzip_types text/plain text/css application/json application/javascript text/xml;\n    gzip_min_length 1000;'
  );
  fs.writeFileSync(nginxPath, nginxConfig);
  console.log('✅ Gzip включён в Nginx');
}
