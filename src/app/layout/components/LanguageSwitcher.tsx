import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'tr';

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t('common.language.label')}</span>
      <select
        value={currentLanguage}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
        className="h-9 rounded-full border border-zinc-700 bg-zinc-900 px-3 pr-8 text-xs font-medium text-zinc-200 outline-none transition hover:border-zinc-500"
        aria-label={t('common.language.label')}
      >
        <option value="tr">{t('common.language.tr')}</option>
        <option value="en">{t('common.language.en')}</option>
      </select>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2 h-4 w-4 fill-current text-zinc-400"
        aria-hidden="true"
      >
        <path d="m7 10 5 5 5-5z" />
      </svg>
    </label>
  );
}
