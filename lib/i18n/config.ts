export const locales = ['en', 'zh', 'nb'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';
