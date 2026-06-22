import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Grizzly Lounge API',
  tagline: 'Документация API v2.0.0',
  url: 'https://docs.grizzly-lounge.qmbox.ru',
  baseUrl: '/',
  organizationName: 'R3G1ST',
  projectName: 'Griz',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',
  i18n: { defaultLocale: 'ru', locales: ['ru'] },
  presets: [
    ['classic', {
      docs: {
        sidebarPath: './sidebars.ts',
        routeBasePath: '/',
      },
      blog: false,
      theme: { customCss: './src/css/custom.css' },
    } satisfies Preset.Options],
  ],
  themeConfig: {
    colorMode: { defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false },
    navbar: {
      title: 'Grizzly API',
      items: [
        { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Docs' },
        { href: 'https://api.grizzly-lounge.qmbox.ru/reference', label: 'API Reference', position: 'right' },
        { href: 'https://github.com/R3G1ST/Griz', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: '2026 Grizzly Lounge',
    },
  } satisfies Preset.ThemeConfig,
};
export default config;
