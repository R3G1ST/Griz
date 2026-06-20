const fs = require('fs');

console.log(' Применяю изменения для шрифтов...\n');

// === 1. Google Fonts ===
const adminIndexPath = '/var/www/Griz/artifacts/grizli-admin/index.html';
if (fs.existsSync(adminIndexPath)) {
  let adminIndex = fs.readFileSync(adminIndexPath, 'utf8');
  const googleFontsLink = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Oswald:wght@400;500;600;700&family=Bebas+Neue&family=Raleway:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Fira+Code:wght@400;500&family=Poppins:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Ubuntu:wght@400;500;700&family=Crimson+Text:wght@400;600;700&family=Abril+Fatface&family=Cinzel:wght@400;500;600&family=Righteous&display=swap" rel="stylesheet">`;
  
  if (!adminIndex.includes('fonts.googleapis.com')) {
    adminIndex = adminIndex.replace('</head>', googleFontsLink + '\n</head>');
    fs.writeFileSync(adminIndexPath, adminIndex);
    console.log('✅ Google Fonts подключены к админке');
  }
}

const siteIndexPath = '/var/www/Griz/artifacts/grizli/index.html';
if (fs.existsSync(siteIndexPath)) {
  let siteIndex = fs.readFileSync(siteIndexPath, 'utf8');
  const googleFontsLink = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Oswald:wght@400;500;600;700&family=Bebas+Neue&family=Raleway:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Fira+Code:wght@400;500&family=Poppins:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Ubuntu:wght@400;500;700&family=Crimson+Text:wght@400;600;700&family=Abril+Fatface&family=Cinzel:wght@400;500;600&family=Righteous&display=swap" rel="stylesheet">`;
  
  if (!siteIndex.includes('fonts.googleapis.com')) {
    siteIndex = siteIndex.replace('</head>', googleFontsLink + '\n</head>');
    fs.writeFileSync(siteIndexPath, siteIndex);
    console.log('✅ Google Fonts подключены к сайту');
  }
}

// === 2. Хук useSiteSettings ===
const hookPath = '/var/www/Griz/artifacts/grizli/src/hooks/useSiteSettings.ts';
if (fs.existsSync(hookPath)) {
  let hookCode = fs.readFileSync(hookPath, 'utf8');
  
  if (!hookCode.includes('TypographySettings')) {
    hookCode = hookCode.replace(
      'export type ImageSlots = {',
      'export type TypographySettings = Record<string, { desktopSize: number; mobileSize: number; font: string; }>;\nexport type ImageSlots = {'
    );
    hookCode = hookCode.replace(
      'images?: Partial<ImageSlots>;',
      'images?: Partial<ImageSlots>;\n  typography?: TypographySettings;'
    );
    hookCode = hookCode.replace(
      'images:   { ...DEFAULTS.images, ...(s.images ?? {}) } as ImageSlots,',
      'images:   { ...DEFAULTS.images, ...(s.images ?? {}) } as ImageSlots,\n    typography: s.typography ?? {},'
    );
    fs.writeFileSync(hookPath, hookCode);
    console.log('✅ Хук useSiteSettings обновлён');
  }
}

// === 3. Сайт Home.tsx ===
const homePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let homeCode = fs.readFileSync(homePath, 'utf8');

if (!homeCode.includes('typography } = useSiteSettings()')) {
  homeCode = homeCode.replace(
    'const { hero, brand, contacts, schedule, loyalty, images, footer } = useSiteSettings();',
    'const { hero, brand, contacts, schedule, loyalty, images, footer, typography } = useSiteSettings();'
  );
}

if (!homeCode.includes('const getFontSize')) {
  homeCode = homeCode.replace(
    'const { hero, brand, contacts, schedule, loyalty, images, footer, typography } = useSiteSettings();',
    `const { hero, brand, contacts, schedule, loyalty, images, footer, typography } = useSiteSettings();

  const getFontSize = (section: string, field: string, defaultDesktop: number, defaultMobile: number) => {
    const settings = typography?.[\`\${section}.\${field}\`];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (settings) {
      return isMobile ? (settings.mobileSize || defaultMobile) : (settings.desktopSize || defaultDesktop);
    }
    return isMobile ? defaultMobile : defaultDesktop;
  };

  const getFontFamily = (section: string, field: string) => {
    const settings = typography?.[\`\${section}.\${field}\`];
    return settings?.font || 'sans-serif';
  };`
  );
}

homeCode = homeCode.replace(
  /style=\{\{ fontSize: `clamp\(72px, 18vw, \$\{hero\.title1Size \|\| 200\}px\)`, fontFamily: hero\.title1Font \|\| "sans-serif" \}\}/,
  'style={{ fontSize: `${getFontSize("hero", "title1", 200, 24)}px`, fontFamily: getFontFamily("hero", "title1") }}'
);

homeCode = homeCode.replace(
  /style=\{\{ fontSize: `\$\{hero\.subtitleSize \|\| 18\}px`, fontFamily: hero\.subtitleFont \|\| "sans-serif" \}\}/,
  'style={{ fontSize: `${getFontSize("hero", "subtitle", 18, 14)}px`, fontFamily: getFontFamily("hero", "subtitle") }}'
);

fs.writeFileSync(homePath, homeCode);
console.log('✅ Сайт обновлён');

console.log('\n🎉 Все изменения применены!');
console.log('\n🔥 Теперь пересобери:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli-admin run build && pnpm --filter @workspace/grizli run build && ./scripts/restart-all.sh');
