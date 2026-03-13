export const resolveLocale = (language: string) =>
  language.toLowerCase().startsWith('tr') ? 'tr-TR' : 'en-US';
