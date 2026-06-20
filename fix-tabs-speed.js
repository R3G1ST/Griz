const fs = require('fs');
const path = '/var/www/Griz/artifacts/grizli-admin/src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const tabs = ['bookings', 'stats', 'heatmap', 'tables', 'settings', 'menu', 'gallery', 'reviews', 'system'];
const tabComponents = {
  bookings: 'BookingsTab', stats: 'StatsTab', heatmap: 'HeatmapTab',
  tables: 'TablesTab', settings: 'SettingsTab', menu: 'MenuCmsTab',
  gallery: 'GalleryTab', reviews: 'ReviewsTab', system: 'SystemTab'
};

let newBlock = '<div className="max-w-6xl mx-auto px-4 py-8">\n';
for (const t of tabs) {
  newBlock += `      <div style={{ display: tab === "${t}" ? "block" : "none" }}><${tabComponents[t]} /></div>\n`;
}
newBlock += '    </div>';

const regex = /<div className="max-w-6xl mx-auto px-4 py-8">\s*\{tab === "bookings"[\s\S]*?<\/div>/;
code = code.replace(regex, newBlock);

fs.writeFileSync(path, code);
console.log('✅ Вкладки теперь не перезагружаются');
