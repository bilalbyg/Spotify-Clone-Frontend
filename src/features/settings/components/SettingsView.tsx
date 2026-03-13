import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ExternalLink } from 'lucide-react';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${checked ? 'bg-emerald-500' : 'bg-zinc-600'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-[22px] mt-0.5' : 'translate-x-0.5 mt-0.5'}`}
      />
    </button>
  );
}

function SettingsView() {
  const { t, i18n } = useTranslation();
  const [quality, setQuality] = useState<'automatic' | 'low' | 'normal' | 'high' | 'veryHigh'>(
    'automatic',
  );

  const [normalizeVolume, setNormalizeVolume] = useState(false);
  const [compactLibrary, setCompactLibrary] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const selectedLanguage = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'tr';

  return (
    <section className="rounded-xl bg-zinc-950 min-h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 sm:px-10 sm:py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('settings.title')}</h1>
          <button className="p-2 text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-800">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Account */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t('settings.account')}</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">{t('settings.editLoginMethods')}</p>
              <button className="flex items-center gap-2 rounded-full border border-zinc-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:border-white hover:scale-105">
                {t('settings.edit')}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* Language */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t('settings.language')}</h2>
            <div className="flex items-center justify-between gap-6">
              <p className="text-sm text-zinc-400 max-w-sm">{t('settings.chooseLanguage')}</p>
              <label className="relative shrink-0">
                <span className="sr-only">{t('settings.language')}</span>
                <select
                  value={selectedLanguage}
                  onChange={(event) => {
                    void i18n.changeLanguage(event.target.value);
                  }}
                  className="appearance-none rounded-md border border-zinc-700 bg-zinc-900 pl-4 pr-10 py-2 text-sm text-zinc-200 cursor-pointer hover:border-zinc-500 transition focus:outline-none focus:border-zinc-400 min-w-[200px]"
                >
                  <option value="en">{t('settings.languageOptionEnglish')}</option>
                  <option value="tr">{t('settings.languageOptionTurkish')}</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </label>
            </div>
          </section>

          {/* Audio quality */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t('settings.audioQuality')}</h2>

            <div className="flex items-center justify-between gap-6">
              <p className="text-sm text-zinc-400">{t('settings.streamingQuality')}</p>
              <label className="relative shrink-0">
                <span className="sr-only">{t('settings.streamingQuality')}</span>
                <select
                  value={quality}
                  onChange={(event) => setQuality(event.target.value as typeof quality)}
                  className="appearance-none rounded-md border border-zinc-700 bg-zinc-900 pl-4 pr-10 py-2 text-sm text-zinc-200 cursor-pointer hover:border-zinc-500 transition focus:outline-none focus:border-zinc-400 min-w-[160px]"
                >
                  <option value="automatic">{t('settings.qualityAutomatic')}</option>
                  <option value="low">{t('settings.qualityLow')}</option>
                  <option value="normal">{t('settings.qualityNormal')}</option>
                  <option value="high">{t('settings.qualityHigh')}</option>
                  <option value="veryHigh">{t('settings.qualityVeryHigh')}</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </label>
            </div>

            <div className="flex items-center justify-between gap-6 mt-4">
              <p className="text-sm text-zinc-400 max-w-md">{t('settings.normalizeVolume')}</p>
              <Toggle checked={normalizeVolume} onChange={setNormalizeVolume} />
            </div>
          </section>

          {/* Your Library */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t('settings.yourLibrary')}</h2>
            <div className="flex items-center justify-between gap-6">
              <p className="text-sm text-zinc-400">{t('settings.compactLibrary')}</p>
              <Toggle checked={compactLibrary} onChange={setCompactLibrary} />
            </div>
          </section>

          {/* Display */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t('settings.display')}</h2>
            <div className="flex items-center justify-between gap-6">
              <p className="text-sm text-zinc-400">{t('settings.showNowPlaying')}</p>
              <Toggle checked={showNowPlaying} onChange={setShowNowPlaying} />
            </div>
            <div className="flex items-center justify-between gap-6 mt-4">
              <p className="text-sm text-zinc-400">{t('settings.showCanvas')}</p>
              <Toggle checked={showCanvas} onChange={setShowCanvas} />
            </div>
          </section>

          {/* Playback */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t('settings.playback')}</h2>
            <div className="flex items-center justify-between gap-6">
              <p className="text-sm text-zinc-400">{t('settings.autoplay')}</p>
              <Toggle checked={autoplay} onChange={setAutoplay} />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default SettingsView;
