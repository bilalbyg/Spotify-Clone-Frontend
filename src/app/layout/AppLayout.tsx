import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PlayerBar } from '@/features/player';
import { HeaderSearchField } from './components/HeaderSearchField';
import { HeaderSearchMenu } from './components/HeaderSearchMenu';
import { HomeButton } from './components/HomeButton';
import { ProfileMenu } from './components/ProfileMenu';
import { SpotifyLogoLink } from './components/SpotifyLogoLink';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import {
  clamp,
  getLibraryItemRoute,
  getRecentSearchItemRoute,
  readStoredWidth,
} from '@/helpers/helper';
import type { DragState, ResizeSide } from './types/app-layout.types';
import { LAYOUT, STORAGE_KEYS, libraryItems, recentSearchItems } from '@/utils/utils';
import { useLayoutUiStore } from '@/store/layoutUiStore';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlayerStore } from '@/store/playerStore';
// import spotifyData from '@/shared/data';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spotifyData = {
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  users: [{ id: '1', display_name: 'User' }],
  episodes: [],
  podcasts: [],
} as any;
import { GlobalToast } from '@/shared/components/GlobalToast';

function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const avatarMenuRef = useRef<HTMLDivElement | null>(null);
  const searchMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const leftSnapTimeoutRef = useRef<number | null>(null);

  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1920 : window.innerWidth,
  );
  const [leftWidth, setLeftWidth] = useState(() =>
    Math.max(readStoredWidth(STORAGE_KEYS.left, 300), LAYOUT.leftMin),
  );
  const [rightWidth, setRightWidth] = useState(() =>
    Math.max(readStoredWidth(STORAGE_KEYS.right, 320), LAYOUT.rightMin),
  );
  const [activeResizer, setActiveResizer] = useState<ResizeSide | null>(null);
  const [isLeftSnapAnimating, setIsLeftSnapAnimating] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isRightPanelCollapsed = useLayoutUiStore((state) => state.isRightPanelCollapsed);
  const setRightPanelCollapsed = useLayoutUiStore((state) => state.setRightPanelCollapsed);
  const isPlayingModeIdle = useLayoutUiStore((state) => state.isPlayingModeIdle);
  const customPlaylists = useLibraryStore((state) => state.customPlaylists);
  const likedSongs = useLibraryStore((state) => state.likedSongs);
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  const hasInitializedPanel = useRef(false);

  useEffect(() => {
    if (hasInitializedPanel.current) return;

    if (currentTrack) {
      setRightPanelCollapsed(false);
      hasInitializedPanel.current = true;
    } else {
      const timer = window.setTimeout(() => {
        if (!hasInitializedPanel.current) {
          if (usePlayerStore.getState().currentTrack) {
            setRightPanelCollapsed(false);
          } else {
            setRightPanelCollapsed(true);
          }
          hasInitializedPanel.current = true;
        }
      }, 50);
      return () => {
        window.clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const showLeftPanel = viewportWidth >= LAYOUT.leftBreakpoint;
  const showRightPanel = viewportWidth >= LAYOUT.rightBreakpoint;
  const effectiveRightWidth = showRightPanel && !isRightPanelCollapsed ? rightWidth : 0;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (leftSnapTimeoutRef.current !== null) {
        window.clearTimeout(leftSnapTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.left, String(leftWidth));
  }, [leftWidth]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.right, String(rightWidth));
  }, [rightWidth]);

  useEffect(() => {
    if (!showLeftPanel) {
      setActiveResizer(null);
      dragStateRef.current = null;
    }
  }, [showLeftPanel]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
    setIsSearchMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen && !isSearchMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;

      if (avatarMenuRef.current && !avatarMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }

      if (searchMenuRef.current && !searchMenuRef.current.contains(target)) {
        setIsSearchMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsSearchMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen, isSearchMenuOpen]);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isShortcut = isMac
        ? event.metaKey && event.key.toLowerCase() === 'k'
        : event.ctrlKey && event.key.toLowerCase() === 'k';

      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      setIsSearchMenuOpen(true);
      searchInputRef.current?.focus();
    };

    window.addEventListener('keydown', handleSearchShortcut);

    return () => {
      window.removeEventListener('keydown', handleSearchShortcut);
    };
  }, []);

  const getWorkspaceWidth = () => workspaceRef.current?.clientWidth ?? viewportWidth;

  const getLeftMaxAllowed = () => {
    const workspaceWidth = getWorkspaceWidth();
    const reservedRight = showRightPanel ? effectiveRightWidth + LAYOUT.gutter : 0;
    const maxByCenter = workspaceWidth - LAYOUT.centerMin - reservedRight - LAYOUT.gutter;

    return Math.max(LAYOUT.leftMin, Math.min(LAYOUT.leftMax, maxByCenter));
  };

  const resizeLeft = (nextWidth: number) => {
    const maxAllowed = getLeftMaxAllowed();
    setLeftWidth(clamp(nextWidth, LAYOUT.leftMin, maxAllowed));
  };

  const resizeRight = (nextWidth: number) => {
    const workspaceWidth = getWorkspaceWidth();
    const maxByCenter = workspaceWidth - LAYOUT.centerMin - leftWidth - LAYOUT.gutter * 2;
    const maxAllowed = Math.max(LAYOUT.rightMin, Math.min(LAYOUT.rightMax, maxByCenter));

    if (nextWidth < LAYOUT.rightMin) {
      setRightPanelCollapsed(true);
      setActiveResizer(null);
      dragStateRef.current = null;
      return;
    }

    setRightWidth(clamp(nextWidth, LAYOUT.rightMin, maxAllowed));
  };

  const triggerLeftSnapAnimation = () => {
    setIsLeftSnapAnimating(true);

    if (leftSnapTimeoutRef.current !== null) {
      window.clearTimeout(leftSnapTimeoutRef.current);
    }

    leftSnapTimeoutRef.current = window.setTimeout(() => {
      setIsLeftSnapAnimating(false);
    }, 200);
  };

  useEffect(() => {
    if (!activeResizer) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;

      if (dragState.side === 'left') {
        const nextWidth = dragState.startWidth + deltaX;

        if (dragState.startWidth <= 50 && nextWidth > 50) {
          const snapWidth = Math.min(280, getLeftMaxAllowed());
          setLeftWidth(snapWidth);
          triggerLeftSnapAnimation();
          dragStateRef.current = { ...dragState, startWidth: snapWidth, startX: event.clientX };
          return;
        }

        if (nextWidth < 280) {
          setLeftWidth(50);
          triggerLeftSnapAnimation();
          dragStateRef.current = { ...dragState, startWidth: 50, startX: event.clientX };
          return;
        }

        resizeLeft(nextWidth);
      } else {
        resizeRight(dragState.startWidth - deltaX);
      }
    };

    const handlePointerUp = () => {
      setActiveResizer(null);
      dragStateRef.current = null;
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResizer, leftWidth, rightWidth, showRightPanel, viewportWidth]);

  const handleResizeStart =
    (side: ResizeSide) => (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();

      dragStateRef.current = {
        side,
        startX: event.clientX,
        startWidth: side === 'left' ? leftWidth : rightWidth,
      };

      setActiveResizer(side);
    };

  const gridTemplateColumns = useMemo(() => {
    if (!showLeftPanel) {
      return undefined;
    }

    if (!showRightPanel || isRightPanelCollapsed) {
      return `${leftWidth}px ${LAYOUT.gutter}px minmax(${LAYOUT.centerMin}px, 1fr)`;
    }

    return `${leftWidth}px ${LAYOUT.gutter}px minmax(${LAYOUT.centerMin}px, 1fr) ${LAYOUT.gutter}px ${effectiveRightWidth}px`;
  }, [showLeftPanel, showRightPanel, isRightPanelCollapsed, leftWidth, effectiveRightWidth]);

  const layoutStyle = gridTemplateColumns ? { gridTemplateColumns } : undefined;

  const filteredRecentSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return recentSearchItems;
    }

    return recentSearchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const headerSearchMenuItems = useMemo(() => {
    const getEntityLabel = (entityType: 'track' | 'artist' | 'album' | 'podcast' | 'episode') =>
      entityType === 'track'
        ? t('common.words.song')
        : entityType === 'artist'
          ? t('common.words.artist')
          : entityType === 'album'
            ? t('common.words.album')
            : entityType === 'podcast'
              ? t('common.words.podcast')
              : t('common.words.episode');

    return filteredRecentSearchItems.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle.includes('•')
        ? `${getEntityLabel(item.entityType)} • ${item.subtitle.split('•').slice(1).join('•').trim()}`
        : item.subtitle,
      image: item.image,
      route: getRecentSearchItemRoute(item),
    }));
  }, [filteredRecentSearchItems, t]);

  const workspaceLibraryItems = useMemo(() => {
    const baseItems = libraryItems.map((item) => {
      const image = item.image;

      return {
        id: item.id,
        title: item.id === 'liked-songs' ? t('homePage.quickAccess.likedSongs') : item.title,
        meta: (() => {
          if (item.id === 'liked-songs') {
            return `Playlist . ${likedSongs.length} ${t('common.words.songs')}`;
          }

          const typeLabel =
            item.type === 'playlist'
              ? t('common.words.playlist')
              : item.type === 'artist'
                ? t('common.words.artist')
                : item.type === 'album'
                  ? t('common.words.album')
                  : t('common.words.podcast');

          if (!item.meta.includes(' . ')) {
            return typeLabel;
          }

          const suffix = item.meta
            .split(' . ')
            .slice(1)
            .join(' . ')
            .replace(/(\d+)\s+songs?/i, `$1 ${t('common.words.songs')}`);
          return `${typeLabel} . ${suffix}`;
        })(),
        type: item.type,
        palette: item.palette,
        image,
        route: getLibraryItemRoute(item),
      };
    });

    const customItems = customPlaylists.map((cp) => {
      const validCovers = cp.trackIds
        .map((id) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const t = spotifyData.tracks.find((x: any) => x.id === id);
          if (!t) return null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const a = spotifyData.albums.find((x: any) => x.id === t.album_id);
          return a?.images[0]?.url || null;
        })
        .filter((url): url is string => url !== null);

      const covers = Array.from(new Set(validCovers)).slice(0, 4);

      let itemImage: string | string[] | undefined = undefined;
      if (covers.length >= 4) itemImage = covers;
      else if (covers.length > 0) itemImage = covers[0];

      return {
        id: cp.id,
        title: cp.name,
        meta: `Playlist . ${cp.owner}`,
        type: 'playlist' as const,
        palette: 'from-zinc-500 to-zinc-300',
        image: itemImage,
        route: `/playlist/${cp.id}`,
      };
    });

    const publicPlaylists = spotifyData.playlists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any) => p.owner_id === spotifyData.users[0].id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => {
        let itemImage: string | string[] | undefined = undefined;
        if (p.images && p.images.length >= 4) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          itemImage = p.images.slice(0, 4).map((img: any) => img.url);
        } else if (p.images && p.images.length > 0) {
          itemImage = p.images[0].url;
        }

        return {
          id: p.id,
          title: p.name,
          meta: `Playlist . ${spotifyData.users[0].display_name}`,
          type: 'playlist' as const,
          palette: 'from-zinc-500 to-zinc-300',
          image: itemImage,
          route: `/playlist/${p.id}`,
        };
      });

    // We can insert the custom items right after the Liked Songs (index 0) or at the end
    // Here we'll just put them right after Liked Songs
    const result = [];
    if (baseItems.length > 0) result.push(baseItems[0]);
    result.push(...publicPlaylists, ...customItems);
    if (baseItems.length > 1) result.push(...baseItems.slice(1));
    return result;
  }, [t, customPlaylists, likedSongs.length]);

  const getResizerClass = (side: ResizeSide) =>
    `group relative hidden w-2 cursor-col-resize rounded-full lg:block ${
      activeResizer === side ? 'bg-zinc-700/80' : 'hover:bg-zinc-800/70'
    }`;

  return (
    <div
      className={`flex h-full flex-col bg-black text-zinc-100 ${isPlayingModeIdle ? 'p-0' : 'p-2 sm:p-3'}`}
    >
      {!isPlayingModeIdle && (
        <header className="mb-2 h-16 min-h-12 max-h-12 rounded-xl border-b border-zinc-800 bg-black/95">
          <div className="flex h-full min-w-0 items-center justify-between gap-3 ">
            <SpotifyLogoLink />

            <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
              <div
                ref={searchMenuRef}
                className="relative flex w-full max-w-2xl items-center gap-2"
              >
                <HomeButton />

                <HeaderSearchField
                  inputRef={searchInputRef}
                  isSearchMenuOpen={isSearchMenuOpen}
                  searchQuery={searchQuery}
                  onOpen={() => setIsSearchMenuOpen(true)}
                  onSearchQueryChange={setSearchQuery}
                />

                <HeaderSearchMenu
                  isOpen={isSearchMenuOpen}
                  searchQuery={searchQuery}
                  items={headerSearchMenuItems}
                  onItemSelect={(title) => {
                    setSearchQuery(title);
                    setIsSearchMenuOpen(false);
                  }}
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <ProfileMenu
                menuRef={avatarMenuRef}
                isOpen={isProfileMenuOpen}
                onToggle={() => setIsProfileMenuOpen((prev) => !prev)}
              />
            </div>
          </div>
        </header>
      )}

      <WorkspaceLayout
        workspaceRef={workspaceRef}
        layoutStyle={layoutStyle}
        showLeftPanel={showLeftPanel}
        showRightPanel={showRightPanel}
        rightPanelWidth={rightWidth}
        leftPanelWidth={leftWidth}
        enableGridTransition={!activeResizer || isLeftSnapAnimating}
        libraryItems={workspaceLibraryItems}
        getResizerClass={getResizerClass}
        handleResizeStart={handleResizeStart}
      />

      <div className={isPlayingModeIdle ? 'hidden' : 'block'}>
        <PlayerBar />
      </div>
      <GlobalToast />
    </div>
  );
}

export default AppLayout;
