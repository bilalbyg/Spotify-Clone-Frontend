import { Fragment } from 'react';

type ContextMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ContextMenuItem = {
  id: string;
  label: string;
  icon:
    | 'plus'
    | 'trash'
    | 'liked'
    | 'queue'
    | 'exclude'
    | 'radio'
    | 'artist'
    | 'album'
    | 'credits'
    | 'artwork'
    | 'share'
    | 'desktop';
  hasSubmenu?: boolean;
  dividerBefore?: boolean;
};

const contextMenuItems: ContextMenuItem[] = [
  { id: 'add-to-playlist', label: 'Add to playlist', icon: 'plus', hasSubmenu: true },
  { id: 'remove-from-playlist', label: 'Remove from this playlist', icon: 'trash' },
  { id: 'save-to-liked', label: 'Save to your Liked Songs', icon: 'liked' },
  { id: 'add-to-queue', label: 'Add to queue', icon: 'queue' },
  { id: 'exclude-taste', label: 'Exclude from your taste profile', icon: 'exclude' },
  { id: 'go-radio', label: 'Go to song radio', icon: 'radio', dividerBefore: true },
  { id: 'go-artist', label: 'Go to artist', icon: 'artist' },
  { id: 'go-album', label: 'Go to album', icon: 'album' },
  { id: 'view-credits', label: 'View credits', icon: 'credits' },
  { id: 'show-artwork', label: 'Show artwork', icon: 'artwork' },
  { id: 'share', label: 'Share', icon: 'share', hasSubmenu: true },
  { id: 'open-desktop-app', label: 'Open in Desktop app', icon: 'desktop', dividerBefore: true },
];

function ContextMenuIcon({ name }: { name: ContextMenuItem['icon'] }) {
  const iconClassName = 'h-5 w-5 stroke-current';

  if (name === 'plus') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path d="M12 5v14M5 12h14" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'trash') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path
          d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'liked') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path d="M12 5.5v13m-6.5-6.5h13M5 5l14 14" fill="none" strokeWidth="0" />
        <circle cx="12" cy="12" r="8" fill="none" strokeWidth="1.8" />
        <path d="M9.2 12h5.6M12 9.2v5.6" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'queue') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path
          d="M4 7h10M4 12h10M4 17h10M17 9v8m-3-3h6"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'exclude') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" strokeWidth="1.8" />
        <path d="M9 9l6 6M15 9l-6 6" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'radio') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path
          d="M12 11v2m-3-5a4.2 4.2 0 0 0 0 8m6-8a4.2 4.2 0 0 1 0 8M6 6a8.5 8.5 0 0 0 0 12m12-12a8.5 8.5 0 0 1 0 12"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'artist') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path
          d="M8.5 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7m7 4a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7M5 22v-2a3 3 0 0 1 3-3h3m3 5v-2a3 3 0 0 1 3-3h2"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'album') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.5" fill="none" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === 'credits') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path
          d="M4 7h4M4 12h8M4 17h12M16 8.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'artwork') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path d="M5 5h14v14H5z" fill="none" strokeWidth="1.8" />
        <path d="m9.5 9.5 4 2.5-4 2.5z" fill="none" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === 'share') {
    return (
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
        <path
          d="M12 14V4m0 0 4 4m-4-4L8 8M6 11v7h12v-7"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 16 0 8 8 0 0 1-16 0zm3.5 0a4.5 4.5 0 0 0 9 0"
        fill="none"
        strokeWidth="1.8"
      />
      <path d="M9 12.5h5.5" fill="none" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ContextMenu({ isOpen, onClose }: ContextMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="menu"
      aria-label="Track actions"
      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[312px] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/95 py-1 shadow-2xl shadow-black/60 backdrop-blur"
    >
      {contextMenuItems.map((item) => (
        <Fragment key={item.id}>
          {item.dividerBefore && <div className="my-1 border-t border-zinc-700" />}
          <button
            type="button"
            role="menuitem"
            onClick={onClose}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-zinc-100 transition hover:bg-zinc-700/70"
          >
            <span className="shrink-0 text-zinc-400">
              <ContextMenuIcon name={item.icon} />
            </span>
            <span className="flex-1 truncate text-base">{item.label}</span>
            {item.hasSubmenu && (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-current text-zinc-400"
                aria-hidden="true"
              >
                <path d="m9.4 4.6 6.4 6.4-6.4 6.4-1.4-1.4 5-5-5-5z" />
              </svg>
            )}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
