import type { MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';

type HeaderSearchFieldProps = {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  isSearchMenuOpen: boolean;
  searchQuery: string;
  onOpen: () => void;
  onSearchQueryChange: (value: string) => void;
};

export function HeaderSearchField({
  inputRef,
  isSearchMenuOpen,
  searchQuery,
  onOpen,
  onSearchQueryChange,
}: HeaderSearchFieldProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => {
        onOpen();
        inputRef.current?.focus();
      }}
      className={`group flex h-10 min-w-0 flex-1 max-w-md items-center rounded-full border px-4 text-zinc-400 transition ${
        isSearchMenuOpen
          ? 'border-zinc-100 bg-zinc-700'
          : 'border-transparent bg-[#1f1f1f] hover:border-zinc-600 hover:bg-zinc-700'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 fill-current text-zinc-300"
        aria-hidden="true"
      >
        <path d="M10 2a8 8 0 1 0 5.292 14.004l4.352 4.352 1.414-1.414-4.352-4.352A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onFocus={onOpen}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder={t('layout.headerSearch.placeholder')}
        className="peer ml-3 min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-400 sm:text-base"
      />
      <span className="hidden items-center gap-1 rounded border border-zinc-600 px-1.5 py-0.5 text-xs text-zinc-300 opacity-0 transition-opacity duration-150 peer-hover:opacity-100 peer-focus:opacity-100 lg:flex">
        <span>Ctrl</span>
        <span>K</span>
      </span>
      <span className="mx-3 hidden h-6 w-px bg-zinc-600 sm:block" />
      <div className="S0nU7XTXYMOBcASz">
        <button
          type="button"
          data-testid="browse-button"
          className="Button-sc-1dqy6lx-0 iBjBCb e-91000-overflow-wrap-anywhere e-91000-button-tertiary--icon-only e-91000-button-tertiary--condensed inline-flex h-8 w-8 items-center justify-center text-zinc-300"
          aria-label={t('layout.headerSearch.browse')}
          data-encore-id="buttonTertiary"
        >
          <span
            aria-hidden="true"
            className="e-91000-button__icon-wrapper inline-flex items-center justify-center"
          >
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              className="e-91000-icon e-91000-baseline h-5 w-5 shrink-0 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2"></path>
              <path d="M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4z"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
