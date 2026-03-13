import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLayoutUiStore } from '@/store/layoutUiStore';
import { usePlayerStore } from '@/store/playerStore';
import { NowPlayingEqualizer } from '@/shared/components/NowPlayingEqualizer';
import { ContextMenu } from './ContextMenu';
import spotifyData from '@/shared/data';
import { useLibraryStore } from '@/store/libraryStore';

type WorkspaceLibraryItem = {
  id: string;
  title: string;
  meta: string;
  type: 'playlist' | 'artist' | 'album' | 'podcast';
  palette: string;
  image?: string | string[];
  route: string;
};

type WorkspaceLayoutProps = {
  workspaceRef: MutableRefObject<HTMLDivElement | null>;
  layoutStyle: CSSProperties | undefined;
  showLeftPanel: boolean;
  showRightPanel: boolean;
  rightPanelWidth: number;
  leftPanelWidth: number;
  enableGridTransition: boolean;
  libraryItems: WorkspaceLibraryItem[];
  getResizerClass: (side: 'left' | 'right') => string;
  handleResizeStart: (
    side: 'left' | 'right',
  ) => (event: ReactPointerEvent<HTMLButtonElement>) => void;
};

export function WorkspaceLayout({
  workspaceRef,
  layoutStyle,
  showLeftPanel,
  showRightPanel,
  rightPanelWidth,
  leftPanelWidth,
  enableGridTransition,
  libraryItems,
  getResizerClass,
  handleResizeStart,
}: WorkspaceLayoutProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const createPlaylist = useLibraryStore((state) => state.createPlaylist);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlayerPlaying = usePlayerStore((state) => state.isPlaying);
  const playerQueue = usePlayerStore((state) => state.queue);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const setPlaybackSource = usePlayerStore((state) => state.setPlaybackSource);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const isRightPanelCollapsed = useLayoutUiStore((state) => state.isRightPanelCollapsed);
  const toggleRightPanelCollapsed = useLayoutUiStore((state) => state.toggleRightPanelCollapsed);
  const setPlayingModeIdle = useLayoutUiStore((state) => state.setPlayingModeIdle);
  const [libraryFilter, setLibraryFilter] = useState<WorkspaceLibraryItem['type'] | 'all'>('all');
  const [isLibrarySearchOpen, setIsLibrarySearchOpen] = useState(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isRightPanelPlayingMode, setIsRightPanelPlayingMode] = useState(false);
  const [isPlayingModeIdle, setIsPlayingModeIdle] = useState(false);
  const [isPlayingModeMediaHovered, setIsPlayingModeMediaHovered] = useState(false);
  const [isRightRailPreviewActive, setIsRightRailPreviewActive] = useState(false);
  const librarySearchContainerRef = useRef<HTMLDivElement | null>(null);
  const librarySearchInputRef = useRef<HTMLInputElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const playingModeHoverTimeoutRef = useRef<number | null>(null);
  const playingModeIdleTimeoutRef = useRef<number | null>(null);
  const isLeftRail = leftPanelWidth < 280;

  useEffect(() => {
    if (!isLibrarySearchOpen) {
      return;
    }

    librarySearchInputRef.current?.focus();
  }, [isLibrarySearchOpen]);

  useEffect(() => {
    if (!isContextMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!contextMenuRef.current?.contains(target)) {
        setIsContextMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsContextMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isContextMenuOpen]);

  useEffect(() => {
    if (isRightPanelCollapsed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsContextMenuOpen(false);
      setIsRightPanelPlayingMode(false);
    }
  }, [isRightPanelCollapsed]);

  useEffect(() => {
    if (!showRightPanel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRightPanelPlayingMode(false);
    }
  }, [showRightPanel]);

  useEffect(() => {
    if (!isRightPanelPlayingMode) {
      if (playingModeIdleTimeoutRef.current !== null) {
        window.clearTimeout(playingModeIdleTimeoutRef.current);
        playingModeIdleTimeoutRef.current = null;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlayingModeIdle(false);
      return;
    }

    const resetPlayingModeIdleTimer = () => {
      if (playingModeIdleTimeoutRef.current !== null) {
        window.clearTimeout(playingModeIdleTimeoutRef.current);
      }

      setIsPlayingModeIdle(false);
      playingModeIdleTimeoutRef.current = window.setTimeout(() => {
        setIsPlayingModeIdle(true);
      }, 5000);
    };

    resetPlayingModeIdleTimer();
    window.addEventListener('pointermove', resetPlayingModeIdleTimer);
    window.addEventListener('pointerdown', resetPlayingModeIdleTimer);
    window.addEventListener('keydown', resetPlayingModeIdleTimer);

    return () => {
      window.removeEventListener('pointermove', resetPlayingModeIdleTimer);
      window.removeEventListener('pointerdown', resetPlayingModeIdleTimer);
      window.removeEventListener('keydown', resetPlayingModeIdleTimer);

      if (playingModeIdleTimeoutRef.current !== null) {
        window.clearTimeout(playingModeIdleTimeoutRef.current);
        playingModeIdleTimeoutRef.current = null;
      }
    };
  }, [isRightPanelPlayingMode]);

  useEffect(() => {
    if (!isRightPanelPlayingMode) {
      if (playingModeHoverTimeoutRef.current !== null) {
        window.clearTimeout(playingModeHoverTimeoutRef.current);
        playingModeHoverTimeoutRef.current = null;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlayingModeMediaHovered(false);
    }
  }, [isRightPanelPlayingMode]);

  useEffect(() => {
    if (isPlayingModeIdle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsContextMenuOpen(false);
    }
  }, [isPlayingModeIdle]);

  useEffect(() => {
    setPlayingModeIdle(isRightPanelPlayingMode && isPlayingModeIdle);
  }, [setPlayingModeIdle, isRightPanelPlayingMode, isPlayingModeIdle]);

  useEffect(() => {
    return () => {
      setPlayingModeIdle(false);

      if (playingModeHoverTimeoutRef.current !== null) {
        window.clearTimeout(playingModeHoverTimeoutRef.current);
        playingModeHoverTimeoutRef.current = null;
      }

      if (playingModeIdleTimeoutRef.current !== null) {
        window.clearTimeout(playingModeIdleTimeoutRef.current);
        playingModeIdleTimeoutRef.current = null;
      }
    };
  }, [setPlayingModeIdle]);

  useEffect(() => {
    if (!isLibrarySearchOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!librarySearchContainerRef.current?.contains(target)) {
        setIsLibrarySearchOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isLibrarySearchOpen]);

  const filteredLibraryItems = useMemo(() => {
    const query = librarySearchQuery.trim().toLowerCase();
    const byType =
      libraryFilter === 'all'
        ? libraryItems
        : libraryItems.filter((item) => item.type === libraryFilter);

    if (!query) {
      return byType;
    }

    return byType.filter(
      (item) => item.title.toLowerCase().includes(query) || item.meta.toLowerCase().includes(query),
    );
  }, [libraryItems, libraryFilter, librarySearchQuery]);

  const getFilterClass = (filterType: WorkspaceLibraryItem['type']) =>
    `rounded-full px-3 py-1.5 transition ${
      libraryFilter === filterType
        ? 'bg-zinc-100 text-black'
        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
    }`;

  const handleFilterClick = (filterType: WorkspaceLibraryItem['type']) => {
    setLibraryFilter((prev) => (prev === filterType ? 'all' : filterType));
  };

  const playbackContext = usePlayerStore((state) => state.playbackContext);

  const rightPanelQueue = useMemo(() => playerQueue.slice(0, 6), [playerQueue]);
  const isLibraryItemNowPlaying = (item: WorkspaceLibraryItem) => {
    if (!isPlayerPlaying || !currentTrack) {
      return false;
    }

    if (playbackContext.type === 'none') {
      return false;
    }

    return playbackContext.type === item.type && playbackContext.id === item.id;
  };

  const handleSidebarEntityPlay = (item: WorkspaceLibraryItem, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    let entityQueue: {
      id: string;
      title: string;
      artist: string;
      cover: string;
      src?: string;
      albumId: string;
    }[] = [];
    const playbackContextId = item.id;
    const playbackContextType = item.type;

    if (item.type === 'album') {
      const albumData = spotifyData.albums.find((a) => a.id === item.id);
      const albumTracks = spotifyData.tracks.filter((t) => t.album_id === item.id);
      if (!albumData || albumTracks.length === 0) {
        navigate(item.route);
        return;
      }

      const primaryImage = albumData.images[0];
      entityQueue = albumTracks.map((track) => {
        const artists = track.artist_ids
          .map((id) => spotifyData.artists.find((a) => a.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        return {
          id: track.id,
          title: track.name,
          artist: artists,
          cover: primaryImage?.url ?? '',
          src: track.preview_url ?? undefined,
          albumId: track.album_id,
        };
      });
    } else if (item.type === 'artist') {
      const artist = spotifyData.artists.find((a) => a.id === item.id);
      const artistTracks = spotifyData.tracks
        .filter((t) => t.artist_ids.includes(item.id))
        .sort((a, b) => b.popularity - a.popularity);
      if (!artist || artistTracks.length === 0) {
        navigate(item.route);
        return;
      }

      entityQueue = artistTracks.map((track) => {
        const album = spotifyData.albums.find((a) => a.id === track.album_id);
        return {
          id: track.id,
          title: track.name,
          artist: artist.name,
          cover: album?.images[0]?.url ?? artist.images[0]?.url ?? '',
          src: track.preview_url ?? undefined,
          albumId: track.album_id,
        };
      });
    } else if (item.type === 'playlist') {
      let tracks: typeof spotifyData.tracks = [];
      if (item.id === 'liked-songs') {
        const likedSongs = useLibraryStore.getState().likedSongs;
        tracks = likedSongs
          .map((id) => spotifyData.tracks.find((t) => t.id === id))
          .filter((t): t is (typeof spotifyData.tracks)[0] => t !== undefined);
      } else {
        const customPlaylist = useLibraryStore
          .getState()
          .customPlaylists.find((p) => p.id === item.id);
        if (customPlaylist) {
          tracks = customPlaylist.trackIds
            .map((id) => spotifyData.tracks.find((t) => t.id === id))
            .filter((t): t is (typeof spotifyData.tracks)[0] => t !== undefined);
        }
      }

      if (tracks.length === 0 && item.id !== 'liked-songs') {
        tracks = spotifyData.tracks.slice(0, 10);
      }

      if (tracks.length === 0) {
        navigate(item.route);
        return;
      }

      entityQueue = tracks.map((track) => {
        const album = spotifyData.albums.find((a) => a.id === track.album_id);
        const artists = track.artist_ids
          .map((id) => spotifyData.artists.find((a) => a.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        return {
          id: track.id,
          title: track.name,
          artist: artists,
          cover: album?.images[0]?.url ?? '',
          src: track.preview_url ?? undefined,
          albumId: track.album_id,
        };
      });
    } else {
      navigate(item.route);
      return;
    }

    const firstTrack = entityQueue[0];
    if (!firstTrack || !firstTrack.src) {
      navigate(item.route);
      return;
    }

    setTrack({
      id: firstTrack.id,
      title: firstTrack.title,
      artist: firstTrack.artist,
      cover: firstTrack.cover,
      src: firstTrack.src,
      albumId: firstTrack.albumId,
    });
    setQueue(entityQueue);
    setPlaybackSource('external');
    usePlayerStore.getState().setPlaybackContext({
      type: playbackContextType as 'artist' | 'album' | 'playlist',
      id: playbackContextId,
    });
    setIsPlaying(true);
    navigate(item.route);
  };

  const showAnimatedNowPlaying = Boolean(currentTrack?.animatedCover && isPlayerPlaying);
  const nowPlayingMediaSrc = currentTrack
    ? showAnimatedNowPlaying
      ? (currentTrack.animatedCover ?? currentTrack.cover)
      : currentTrack.cover
    : null;
  const nowPlayingTextStyle = showAnimatedNowPlaying
    ? undefined
    : { textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)' };
  const rightPanelTitle = currentTrack?.artist ?? t('layout.workspace.rightPanel.nowPlaying');
  const monthlyListeners = useMemo(() => {
    const seed = rightPanelTitle.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
    return 180000 + (seed % 850000);
  }, [rightPanelTitle]);
  const formattedMonthlyListeners = useMemo(
    () =>
      new Intl.NumberFormat(i18n.resolvedLanguage === 'tr' ? 'tr-TR' : 'en-US').format(
        monthlyListeners,
      ),
    [i18n.resolvedLanguage, monthlyListeners],
  );
  const rightPanelContent = (
    <>
      <div className="group mx-auto mb-3 flex w-[388px] max-w-full items-center justify-between px-1">
        <div className="inline-flex max-w-[85%] items-center text-zinc-200">
          <button
            type="button"
            onClick={toggleRightPanelCollapsed}
            aria-label={t('layout.workspace.rightPanel.collapsePanel')}
            className="inline-flex w-0 shrink-0 overflow-hidden opacity-0 transition-all duration-150 group-hover:mr-2 group-hover:w-4 group-hover:opacity-100 group-focus-within:mr-2 group-focus-within:w-4 group-focus-within:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current text-zinc-400"
              aria-hidden="true"
            >
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm6 2h2v10h-2V7z" />
            </svg>
          </button>
          <span className="min-w-0 truncate text-2xl font-semibold">{rightPanelTitle}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          <div ref={contextMenuRef} className="relative">
            <button
              type="button"
              className={`rounded-full p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 ${
                isContextMenuOpen ? 'bg-zinc-800 text-zinc-200' : ''
              }`}
              aria-label={t('layout.workspace.rightPanel.moreActions')}
              aria-haspopup="menu"
              aria-expanded={isContextMenuOpen}
              onClick={() => setIsContextMenuOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
              </svg>
            </button>
            <ContextMenu isOpen={isContextMenuOpen} onClose={() => setIsContextMenuOpen(false)} />
          </div>
          <button
            type="button"
            className="Button-sc-1dqy6lx-0 fprjoI e-91000-overflow-wrap-anywhere e-91000-button-tertiary--icon-only xfsjC59pFlEJ3yNI rounded-full p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            aria-label={t('layout.workspace.rightPanel.enterPlayingMode')}
            data-encore-id="buttonTertiary"
            onClick={() => {
              setIsContextMenuOpen(false);
              setIsRightPanelPlayingMode(true);
            }}
          >
            <span aria-hidden="true" className="e-91000-button__icon-wrapper">
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className="e-91000-icon e-91000-baseline h-4 w-4 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M6.53 9.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 0 1 0 1.5H1.25v-3.579a.75.75 0 0 1 1.5 0v1.018l2.72-2.72a.75.75 0 0 1 1.06 0zm2.94-2.94a.75.75 0 0 1 0-1.06l2.72-2.72h-1.018a.75.75 0 1 1 0-1.5h3.578v3.579a.75.75 0 0 1-1.5 0V3.81l-2.72 2.72a.75.75 0 0 1-1.06 0" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto pr-1">
        <section className="mx-auto w-[388px] max-w-full overflow-hidden rounded-xl bg-zinc-950">
          {currentTrack && nowPlayingMediaSrc ? (
            <div className="relative h-[460px] w-full">
              <img
                src={nowPlayingMediaSrc}
                alt={currentTrack.title}
                className="h-[460px] w-full object-cover"
                loading="lazy"
              />

              <div
                className={`absolute inset-x-0 bottom-0 px-4 pb-4 pt-16 ${
                  showAnimatedNowPlaying
                    ? 'bg-gradient-to-t from-black/90 via-black/60 to-transparent'
                    : 'bg-transparent'
                }`}
              >
                <p
                  style={nowPlayingTextStyle}
                  className="truncate py-1 text-2xl font-semibold text-zinc-100"
                >
                  {currentTrack.title}
                </p>
                <p style={nowPlayingTextStyle} className="truncate text-sm text-zinc-300">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-[460px] items-center justify-center px-4 text-center text-sm text-zinc-400">
              {t('layout.workspace.rightPanel.noTrack')}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-zinc-800/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-base font-semibold text-zinc-100">
              {t('layout.workspace.rightPanel.creditsTitle')}
            </h4>
            <button
              type="button"
              className="text-sm font-semibold text-zinc-400 transition hover:text-zinc-200"
            >
              {t('common.actions.showAll')}
            </button>
          </div>
          {currentTrack ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium text-zinc-100">
                    {currentTrack.artist}
                  </p>
                  <p className="truncate text-sm text-zinc-400">
                    {t('layout.workspace.rightPanel.mainArtistRole')}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-zinc-500 px-4 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-300 hover:text-zinc-100"
                >
                  {t('layout.workspace.rightPanel.follow')}
                </button>
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-medium text-zinc-100">Mert Medeni</p>
                <p className="truncate text-sm text-zinc-400">
                  {t('layout.workspace.rightPanel.producerRole')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">{t('layout.workspace.rightPanel.noTrack')}</p>
          )}
        </section>

        <section className="rounded-xl bg-zinc-800/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-base font-semibold text-zinc-100">
              {t('layout.workspace.rightPanel.nextInQueue')}
            </h4>
            <button
              type="button"
              className="text-sm font-semibold text-zinc-400 transition hover:text-zinc-200"
            >
              {t('layout.workspace.rightPanel.openQueue')}
            </button>
          </div>

          {rightPanelQueue.length > 0 ? (
            <div className="space-y-2">
              {rightPanelQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-zinc-700/50"
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="h-12 w-12 rounded object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-zinc-100">{item.title}</p>
                    <p className="truncate text-sm text-zinc-400">{item.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">{t('layout.workspace.rightPanel.noQueue')}</p>
          )}
        </section>
      </div>
    </>
  );

  if (showRightPanel && isRightPanelPlayingMode) {
    return (
      <div
        ref={workspaceRef}
        style={layoutStyle}
        className="relative grid min-h-0 flex-1 grid-cols-1"
      >
        <section
          className={`col-[1/-1] min-h-0 bg-gradient-to-b from-emerald-900/35 via-zinc-900 to-black ${
            isPlayingModeIdle
              ? 'h-full overflow-hidden rounded-none p-0'
              : 'overflow-auto rounded-xl p-4 sm:p-6'
          }`}
        >
          {isPlayingModeIdle ? (
            <div className="relative h-full w-full bg-zinc-700/40">
              {currentTrack ? (
                <>
                  <div className="flex h-full w-full items-center justify-center p-8">
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.title}
                      className="h-[min(56vh,520px)] w-[min(56vh,520px)] max-h-full max-w-full rounded-md object-cover shadow-2xl shadow-black/60"
                      loading="lazy"
                    />
                  </div>
                  <div className="pointer-events-none absolute bottom-10 left-10">
                    <p className="text-3xl font-semibold text-zinc-100">{currentTrack.title}</p>
                    <p className="mt-1 text-xl text-zinc-300">{currentTrack.artist}</p>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                  {t('layout.workspace.rightPanel.noTrack')}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="truncate text-xl font-semibold text-zinc-100 sm:text-2xl">
                  {currentTrack?.title ?? rightPanelTitle}
                </p>

                <div className="flex items-center gap-2">
                  <div ref={contextMenuRef} className="relative">
                    <button
                      type="button"
                      className={`rounded-full p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 ${
                        isContextMenuOpen ? 'bg-zinc-800 text-zinc-100' : ''
                      }`}
                      aria-label={t('layout.workspace.rightPanel.moreActions')}
                      aria-haspopup="menu"
                      aria-expanded={isContextMenuOpen}
                      onClick={() => setIsContextMenuOpen((prev) => !prev)}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                        <path d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
                      </svg>
                    </button>
                    <ContextMenu
                      isOpen={isContextMenuOpen}
                      onClose={() => setIsContextMenuOpen(false)}
                    />
                  </div>

                  <button
                    type="button"
                    className="Button-sc-1dqy6lx-0 fprjoI e-91000-overflow-wrap-anywhere e-91000-button-tertiary--icon-only n5KI8mwa5o8qbn4b rounded-full p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
                    aria-label="Minimize Now Playing view"
                    data-encore-id="buttonTertiary"
                    onClick={() => {
                      setIsContextMenuOpen(false);
                      setIsRightPanelPlayingMode(false);
                    }}
                  >
                    <span aria-hidden="true" className="e-91000-button__icon-wrapper">
                      <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="e-91000-icon e-91000-baseline h-4 w-4 fill-current"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14.53 1.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 1 1 0 1.5H9.25V3.171a.75.75 0 1 1 1.5 0V4.19l2.72-2.72a.75.75 0 0 1 1.06 0M1.47 14.53a.75.75 0 0 1 0-1.06l2.72-2.72H3.171a.75.75 0 0 1 0-1.5H6.75v3.579a.75.75 0 1 1-1.5 0V11.81l-2.72 2.72a.75.75 0 0 1-1.06 0" />
                      </svg>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="rounded-full p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
                    aria-label={t('layout.workspace.rightPanel.exitPlayingMode')}
                    onClick={() => {
                      setIsContextMenuOpen(false);
                      setIsPlayingModeIdle(true);
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M3 9V3h6v2H5v4H3zm12-6h6v6h-2V5h-4V3zM3 21v-6h2v4h4v2H3zm16-6h2v6h-6v-2h4v-4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                className="mx-auto mb-5 w-full max-w-[960px]"
                onPointerEnter={() => {
                  if (playingModeHoverTimeoutRef.current !== null) {
                    window.clearTimeout(playingModeHoverTimeoutRef.current);
                    playingModeHoverTimeoutRef.current = null;
                  }
                  setIsPlayingModeMediaHovered(true);
                }}
                onPointerLeave={() => {
                  if (playingModeHoverTimeoutRef.current !== null) {
                    window.clearTimeout(playingModeHoverTimeoutRef.current);
                  }
                  playingModeHoverTimeoutRef.current = window.setTimeout(() => {
                    setIsPlayingModeMediaHovered(false);
                    playingModeHoverTimeoutRef.current = null;
                  }, 2000);
                }}
              >
                {currentTrack && nowPlayingMediaSrc ? (
                  <div className="overflow-hidden rounded-xl bg-zinc-900/80 p-3 sm:p-4">
                    <img
                      src={nowPlayingMediaSrc}
                      alt={currentTrack.title}
                      className="mx-auto h-[min(60vh,560px)] w-[min(60vh,560px)] max-h-full max-w-full rounded-md object-cover shadow-2xl shadow-black/60"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex h-80 w-full items-center justify-center rounded-xl bg-zinc-900/80 text-sm text-zinc-400">
                    {t('layout.workspace.rightPanel.noTrack')}
                  </div>
                )}
              </div>

              <div
                className={`mx-auto grid w-full max-w-[1120px] gap-4 transition-transform duration-300 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${
                  isPlayingModeMediaHovered ? '-translate-y-12' : 'translate-y-0'
                }`}
              >
                <section className="relative min-h-[460px] overflow-hidden rounded-xl bg-zinc-900">
                  {currentTrack && nowPlayingMediaSrc ? (
                    <img
                      src={nowPlayingMediaSrc}
                      alt={rightPanelTitle}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/35" />

                  <div className="relative flex h-full flex-col justify-between p-5">
                    <h3 className="text-3xl font-semibold text-zinc-100 sm:text-4xl">
                      {t('layout.workspace.rightPanel.aboutArtist')}
                    </h3>

                    <div className="space-y-3">
                      <p className="text-2xl font-semibold text-zinc-100 sm:text-3xl">
                        {rightPanelTitle}
                      </p>
                      <p className="text-lg text-zinc-200">
                        {t('layout.workspace.rightPanel.monthlyListeners', {
                          count: formattedMonthlyListeners as unknown as number,
                        })}
                      </p>
                      <div className="flex items-start justify-between gap-4">
                        <p className="max-w-[75%] text-sm leading-6 text-zinc-300">
                          {t('layout.workspace.rightPanel.artistBio', { artist: rightPanelTitle })}
                        </p>
                        <button
                          type="button"
                          className="rounded-full border border-zinc-400 px-4 py-1.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-200 hover:text-white"
                        >
                          {t('layout.workspace.rightPanel.follow')}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="space-y-4">
                  <section className="rounded-xl bg-zinc-800/85 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-2xl font-semibold text-zinc-100">
                        {t('layout.workspace.rightPanel.creditsTitle')}
                      </h4>
                      <button
                        type="button"
                        className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100"
                      >
                        {t('common.actions.showAll')}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-xl font-medium text-zinc-100">
                          {rightPanelTitle}
                        </p>
                        <p className="truncate text-base text-zinc-300">
                          {t('layout.workspace.rightPanel.mainArtistRole')}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-zinc-500 px-4 py-1.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-300"
                      >
                        {t('layout.workspace.rightPanel.follow')}
                      </button>
                    </div>
                  </section>

                  <section className="rounded-xl bg-zinc-800/85 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-2xl font-semibold text-zinc-100">
                        {t('layout.workspace.rightPanel.nextInQueue')}
                      </h4>
                      <button
                        type="button"
                        className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100"
                      >
                        {t('layout.workspace.rightPanel.openQueue')}
                      </button>
                    </div>

                    {rightPanelQueue.length > 0 ? (
                      <div className="space-y-2">
                        {rightPanelQueue.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg bg-zinc-700/40 p-2.5 transition hover:bg-zinc-700/60"
                          >
                            <img
                              src={item.cover}
                              alt={item.title}
                              className="h-12 w-12 rounded object-cover"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-lg font-medium text-zinc-100">
                                {item.title}
                              </p>
                              <p className="truncate text-sm text-zinc-300">{item.artist}</p>
                            </div>
                            <button
                              type="button"
                              className="ml-auto rounded-full p-1 text-zinc-300 transition hover:bg-zinc-600/70 hover:text-zinc-100"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4 fill-current"
                                aria-hidden="true"
                              >
                                <path d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-300">
                        {t('layout.workspace.rightPanel.noQueue')}
                      </p>
                    )}
                  </section>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <div
      ref={workspaceRef}
      style={layoutStyle}
      className={`relative grid min-h-0 flex-1 grid-cols-1 ${
        enableGridTransition ? 'transition-[grid-template-columns] duration-200 ease-out' : ''
      }`}
    >
      {showLeftPanel && (
        <aside
          className={`flex min-h-0 min-w-0 flex-col rounded-xl bg-zinc-900 ${isLeftRail ? 'p-2' : 'p-4'}`}
        >
          {isLeftRail ? (
            <div className="flex min-h-0 flex-1 flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label={t('layout.workspace.yourLibrary')}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M4 4h3v16H4V4zm6 0h3v16h-3V4zm6 0h3v16h-3V4z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newId = createPlaylist();
                    navigate(`/playlist/${newId}`);
                  }}
                  aria-label={t('layout.workspace.create')}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1z" />
                  </svg>
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filteredLibraryItems.map((item) => {
                  const isLikedSongs = item.id === 'liked-songs';
                  const isArtist = item.type === 'artist';
                  const isNowPlayingItem = isLibraryItemNowPlaying(item);

                  return (
                    <NavLink
                      key={item.id}
                      to={item.route}
                      className={({ isActive }) =>
                        `relative flex h-12 w-12 items-center justify-center rounded-md transition ${
                          isActive ? 'bg-zinc-700/70' : 'hover:bg-zinc-800/70'
                        }`
                      }
                    >
                      <div
                        className={`h-10 w-10 overflow-hidden ${isArtist ? 'rounded-full' : 'rounded-md'}`}
                      >
                        {isLikedSongs ? (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-500 to-cyan-300">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4 fill-current text-white"
                              aria-hidden="true"
                            >
                              <path d="M12 21c-.3 0-.6-.1-.9-.4C5.7 15.7 2 12.4 2 8.5 2 5.5 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.5 22 8.5c0 3.9-3.7 7.2-9.1 12.1-.3.3-.6.4-.9.4z" />
                            </svg>
                          </div>
                        ) : item.image ? (
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${item.palette}`} />
                        )}
                      </div>

                      {isNowPlayingItem && (
                        <button
                          type="button"
                          className="absolute inset-x-1 inset-y-1 flex items-center justify-center rounded-md bg-black/35 transition-colors group-hover:bg-black/50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsPlaying(false);
                          }}
                        >
                          <span className="block group-hover:hidden">
                            <NowPlayingEqualizer />
                          </span>
                          <span className="hidden text-white group-hover:block">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 fill-current"
                              aria-hidden="true"
                            >
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          </span>
                        </button>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('layout.workspace.yourLibrary')}</h2>
                <button
                  type="button"
                  onClick={() => {
                    const newId = createPlaylist();
                    navigate(`/playlist/${newId}`);
                  }}
                  className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold"
                >
                  {t('layout.workspace.create')}
                </button>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                <button
                  type="button"
                  className={getFilterClass('playlist')}
                  onClick={() => handleFilterClick('playlist')}
                >
                  {t('layout.workspace.playlists')}
                </button>
                <button
                  type="button"
                  className={getFilterClass('artist')}
                  onClick={() => handleFilterClick('artist')}
                >
                  {t('layout.workspace.artists')}
                </button>
                <button
                  type="button"
                  className={getFilterClass('album')}
                  onClick={() => handleFilterClick('album')}
                >
                  {t('layout.workspace.albums')}
                </button>
                <button
                  type="button"
                  className={getFilterClass('podcast')}
                  onClick={() => handleFilterClick('podcast')}
                >
                  {t('layout.workspace.podcasts')}
                </button>
                <button
                  type="button"
                  aria-label={t('layout.workspace.nextFilter')}
                  className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-100"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="m9.4 4.6 6.4 6.4-6.4 6.4-1.4-1.4 5-5-5-5z" />
                  </svg>
                </button>
              </div>
              <div className="mb-4 flex items-center justify-between gap-2">
                {isLibrarySearchOpen ? (
                  <div
                    ref={librarySearchContainerRef}
                    className="flex h-10 w-full max-w-[230px] min-w-0 items-center gap-2 rounded-md bg-zinc-800 px-2.5 text-zinc-300"
                  >
                    <button
                      type="button"
                      aria-label={t('layout.workspace.closeLibrarySearch')}
                      onClick={() => setIsLibrarySearchOpen(false)}
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-zinc-300 transition hover:text-zinc-100"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                        <path d="M10 2a8 8 0 1 0 5.292 14.004l4.352 4.352 1.414-1.414-4.352-4.352A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
                      </svg>
                    </button>
                    <input
                      ref={librarySearchInputRef}
                      type="text"
                      value={librarySearchQuery}
                      onChange={(event) => setLibrarySearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          setIsLibrarySearchOpen(false);
                        }
                      }}
                      aria-label={t('layout.workspace.searchInLibrary')}
                      placeholder={t('layout.workspace.searchInLibraryPlaceholder')}
                      className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label={t('layout.workspace.openLibrarySearch')}
                    onClick={() => setIsLibrarySearchOpen(true)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M10 2a8 8 0 1 0 5.292 14.004l4.352 4.352 1.414-1.414-4.352-4.352A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  aria-label={t('layout.workspace.recentsViewOptions')}
                  className={`inline-flex h-10 items-center text-zinc-300 transition hover:text-zinc-100 ${
                    isLibrarySearchOpen
                      ? 'w-10 justify-center rounded-md hover:bg-zinc-800'
                      : 'gap-2 rounded-full px-2 hover:bg-zinc-800'
                  }`}
                >
                  {!isLibrarySearchOpen && (
                    <span className="text-sm">{t('layout.workspace.recents')}</span>
                  )}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M3 5h10v2H3V5zm0 6h10v2H3v-2zm0 6h10v2H3v-2zm14-12h4v2h-4V5zm0 6h4v2h-4v-2zm0 6h4v2h-4v-2z" />
                  </svg>
                </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1">
                {filteredLibraryItems.map((item) => {
                  const isLikedSongs = item.id === 'liked-songs';
                  const isPlaylist = item.type === 'playlist';
                  const isArtist = item.type === 'artist';
                  const isAlbum = item.type === 'album';
                  const isPodcast = item.type === 'podcast';
                  const isNowPlayingItem = isLibraryItemNowPlaying(item);
                  const showPlayOverlay =
                    (isPlaylist || isArtist || isAlbum || isPodcast) && !isNowPlayingItem;

                  return (
                    <NavLink
                      key={item.id}
                      to={item.route}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg px-2 py-2 text-left transition ${
                          isActive ? 'bg-zinc-700/70' : 'hover:bg-zinc-800/70'
                        }`
                      }
                    >
                      <div
                        className={`relative h-12 w-12 shrink-0 overflow-hidden shadow-lg shadow-black/30 ${
                          isArtist ? 'rounded-full' : 'rounded-md'
                        }`}
                      >
                        {isLikedSongs && !item.image ? (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-500 to-cyan-300">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 fill-current text-white transition-opacity duration-150 group-hover:opacity-0"
                              aria-hidden="true"
                            >
                              <path d="M12 21c-.3 0-.6-.9-.4-.9-.4C5.7 15.7 2 12.4 2 8.5 2 5.5 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.5 22 8.5c0 3.9-3.7 7.2-9.1 12.1-.3.3-.6.4-.9.4z" />
                            </svg>
                          </div>
                        ) : Array.isArray(item.image) ? (
                          <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                            {item.image.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                className="h-full w-full object-cover"
                                alt=""
                              />
                            ))}
                          </div>
                        ) : item.image ? (
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${item.palette}`} />
                        )}

                        {showPlayOverlay && (
                          <button
                            type="button"
                            onClick={(e) => {
                              const isActiveContext =
                                playbackContext.type !== 'none' &&
                                playbackContext.type === item.type &&
                                playbackContext.id === item.id;
                              if (isActiveContext) {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsPlaying(true);
                              } else if (isPlaylist || isArtist || isAlbum || isPodcast) {
                                handleSidebarEntityPlay(item, e);
                              }
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4 fill-current text-white"
                              aria-hidden="true"
                            >
                              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                            </svg>
                          </button>
                        )}

                        {isNowPlayingItem && (
                          <button
                            type="button"
                            className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/50"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsPlaying(false);
                            }}
                          >
                            <span className="block group-hover:hidden">
                              <NowPlayingEqualizer />
                            </span>
                            <span className="hidden text-white group-hover:block">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5 fill-current"
                                aria-hidden="true"
                              >
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </svg>
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate font-medium ${isNowPlayingItem ? 'text-emerald-400' : ''}`}
                        >
                          {item.title}
                        </p>
                        <p className="truncate text-sm text-zinc-400">{item.meta}</p>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </>
          )}
        </aside>
      )}

      {showLeftPanel && (
        <button
          type="button"
          aria-label={t('layout.workspace.resizeLeft')}
          className={getResizerClass('left')}
          onPointerDown={handleResizeStart('left')}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 rounded-full bg-zinc-700/0 transition group-hover:bg-zinc-700/90" />
        </button>
      )}

      <main
        className={`min-h-0 min-w-0 rounded-xl bg-gradient-to-b from-zinc-700/80 via-zinc-900 to-black p-4 transition-[margin] ${
          showRightPanel && isRightPanelCollapsed
            ? isRightRailPreviewActive
              ? 'mr-14'
              : 'mr-11'
            : ''
        }`}
      >
        <div className="h-full overflow-auto pr-1">
          <Outlet />
        </div>
      </main>

      {showRightPanel && !isRightPanelCollapsed && (
        <>
          <button
            type="button"
            aria-label={t('layout.workspace.resizeRight')}
            className={getResizerClass('right')}
            onPointerDown={handleResizeStart('right')}
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 rounded-full bg-zinc-700/0 transition group-hover:bg-zinc-700/90" />
          </button>

          <aside className="flex min-h-0 min-w-0 flex-col rounded-xl bg-zinc-900 p-3">
            {rightPanelContent}
          </aside>
        </>
      )}

      {showRightPanel && isRightPanelCollapsed && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-40 flex">
          <div
            className="group pointer-events-auto relative flex h-full w-11 overflow-visible"
            onPointerEnter={() => setIsRightRailPreviewActive(true)}
            onPointerLeave={() => setIsRightRailPreviewActive(false)}
            onFocusCapture={() => setIsRightRailPreviewActive(true)}
            onBlurCapture={() => setIsRightRailPreviewActive(false)}
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-full opacity-0 transition-all duration-200 group-hover:-translate-x-[52px] group-hover:opacity-35 group-focus-within:-translate-x-[52px] group-focus-within:opacity-35"
              style={{ width: `${rightPanelWidth}px` }}
            >
              <aside className="flex h-full min-h-0 min-w-0 flex-col rounded-l-xl rounded-r-none bg-zinc-900 p-3">
                {rightPanelContent}
              </aside>
            </div>

            <div className="relative z-10 flex h-full w-11 overflow-hidden rounded-l-xl rounded-r-none bg-black transition-colors duration-200 group-hover:bg-transparent group-focus-within:bg-transparent">
              <button
                type="button"
                aria-label={t('layout.workspace.rightPanel.openPanel')}
                onClick={toggleRightPanelCollapsed}
                className="flex h-full w-full items-center justify-center text-zinc-300 transition hover:text-zinc-100"
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                  <path d="m15.4 4.6 1.4 1.4-6 6 6 6-1.4 1.4L8 12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
