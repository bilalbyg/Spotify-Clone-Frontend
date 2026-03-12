import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type HeaderSearchMenuItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
};

type HeaderSearchMenuProps = {
  isOpen: boolean;
  searchQuery: string;
  items: HeaderSearchMenuItem[];
  onItemSelect: (title: string) => void;
};

export function HeaderSearchMenu({
  isOpen,
  searchQuery,
  items,
  onItemSelect,
}: HeaderSearchMenuProps) {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute left-14 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/95 shadow-2xl shadow-black/50 backdrop-blur">
      <div className="border-b border-zinc-700 px-4 py-3">
        <p className="text-base font-semibold text-zinc-100">
          {searchQuery.trim()
            ? t('layout.headerSearch.searchResults')
            : t('layout.headerSearch.recentSearches')}
        </p>
      </div>
      <div className="max-h-80 overflow-auto p-2">
        {items.length === 0 && (
          <p className="rounded-md px-2 py-3 text-sm text-zinc-300">
            {t('layout.headerSearch.noMatches')}
          </p>
        )}

        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.route}
            onClick={() => onItemSelect(item.title)}
            className="flex items-center gap-3 rounded-md p-2 transition hover:bg-zinc-700/80"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-12 w-12 rounded-md object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="truncate text-xl font-medium text-zinc-100">{item.title}</p>
              <p className="truncate text-lg text-zinc-300">{item.subtitle}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
