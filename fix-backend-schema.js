const fs = require('fs');
const path = '/var/www/Griz/lib/db/src/schema/site.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('isFeatured')) {
  code = code.replace(
    'isActive:  integer("is_active").notNull().default(1),',
    'isActive:  integer("is_active").notNull().default(1),\n  isFeatured: integer("is_featured").notNull().default(0),'
  );
  fs.writeFileSync(path, code);
  console.log('✅ Схема БД обновлена');
} else {
  console.log('️ Схема уже содержит поле');
}
