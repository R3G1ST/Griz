const fs = require('fs');

const hookPath = '/var/www/Griz/artifacts/grizli/src/hooks/useSiteSettings.ts';
let code = fs.readFileSync(hookPath, 'utf8');

// 1. Добавляем тип TypographySettings
const imageSlotsType = `export type ImageSlots = {
  logo: string;
  heroBg: string;
  bearSkull: string;
  cocktail: string;
  interior: string;
};`;

const typographyType = `export type ImageSlots = {
  logo: string;
  heroBg: string;
  bearSkull: string;
  cocktail: string;
  interior: string;
};
export type TypographySettings = Record<string, {
  desktopSize: number;
  mobileSize: number;
  font: string;
}>;`;

if (!code.includes('TypographySettings')) {
  code = code.replace(imageSlotsType, typographyType);
  console.log('✅ Добавлен тип TypographySettings');
}

// 2. Добавляем typography в SiteSettings
const siteSettingsType = `export type SiteSettings = {
  contacts?: SiteContacts;
  schedule?: ScheduleRow[];
  hero?: HeroSettings;
  about?: AboutSettings;
  rules?: RuleItem[];
  brand?: BrandSettings;
  loyalty?: LoyaltySettings;
  footer?: FooterSettings;
  images?: Partial<ImageSlots>;
};`;

const siteSettingsNew = `export type SiteSettings = {
  contacts?: SiteContacts;
  schedule?: ScheduleRow[];
  hero?: HeroSettings;
  about?: AboutSettings;
  rules?: RuleItem[];
  brand?: BrandSettings;
  loyalty?: LoyaltySettings;
  footer?: FooterSettings;
  images?: Partial<ImageSlots>;
  typography?: TypographySettings;
};`;

if (!code.includes('typography?: TypographySettings')) {
  code = code.replace(siteSettingsType, siteSettingsNew);
  console.log('✅ Добавлен typography в SiteSettings');
}

// 3. Добавляем typography в возвращаемый объект
const returnObject = `  return {
    contacts: { ...DEFAULTS.contacts, ...(s.contacts ?? {}) },
    schedule: s.schedule?.length ? s.schedule : DEFAULTS.schedule,
    hero:     { ...DEFAULTS.hero, ...(s.hero ?? {}) },
    about:    { ...DEFAULTS.about, ...(s.about ?? {}) },
    rules:    s.rules?.length ? s.rules : DEFAULTS.rules,
    brand:    { ...DEFAULTS.brand, ...(s.brand ?? {}) },
    loyalty:  { ...DEFAULTS.loyalty, ...(s.loyalty ?? {}) },
    footer:   { ...DEFAULTS.footer, ...(s.footer ?? {}) },
    images:   { ...DEFAULTS.images, ...(s.images ?? {}) } as ImageSlots,
  };`;

const returnNew = `  return {
    contacts: { ...DEFAULTS.contacts, ...(s.contacts ?? {}) },
    schedule: s.schedule?.length ? s.schedule : DEFAULTS.schedule,
    hero:     { ...DEFAULTS.hero, ...(s.hero ?? {}) },
    about:    { ...DEFAULTS.about, ...(s.about ?? {}) },
    rules:    s.rules?.length ? s.rules : DEFAULTS.rules,
    brand:    { ...DEFAULTS.brand, ...(s.brand ?? {}) },
    loyalty:  { ...DEFAULTS.loyalty, ...(s.loyalty ?? {}) },
    footer:   { ...DEFAULTS.footer, ...(s.footer ?? {}) },
    images:   { ...DEFAULTS.images, ...(s.images ?? {}) } as ImageSlots,
    typography: s.typography ?? {},
  };`;

if (!code.includes('typography: s.typography')) {
  code = code.replace(returnObject, returnNew);
  console.log('✅ Добавлен typography в возвращаемый объект');
}

fs.writeFileSync(hookPath, code);
console.log('✅ Хук useSiteSettings обновлён');
console.log('\n Теперь пересобери сайт:');
console.log('cd /var/www/Griz && PORT=3000 BASE_PATH="/" pnpm --filter @workspace/grizli run build');
