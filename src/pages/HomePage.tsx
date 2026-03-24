/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type MutableRefObject,
} from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { getLibraryItemRoute } from '@/helpers/helper';
import { NowPlayingEqualizer } from '@/shared/components/NowPlayingEqualizer';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { libraryItems } from '@/utils/utils';
import type { LibraryItem } from '@/app/layout/types/app-layout.types';
import api from '@/lib/axios';

// TEMPORARY: Empty data object to prevent crashes until backend integration is complete.
const spotifyData: any = {
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  users: [],
  episodes: [],
  podcasts: [],
};

type HomeShelfCard = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  to: string;
  badge?: string;
  badgeClassName?: string;
  topTag?: string;
  shape?: 'square' | 'circle';
  artistHint?: string;
};

const jumpBackInCards: HomeShelfCard[] = [];

const recentlyPlayedCards: HomeShelfCard[] = [];

const topMixCards: HomeShelfCard[] = [];

const favoriteArtistCards: HomeShelfCard[] = [];

const moreLikeLvbelCards: HomeShelfCard[] = [];

const recommendedStationCards: HomeShelfCard[] = [];

const episodesYouMightLikeCards: HomeShelfCard[] = [];

const popularRadioCards: HomeShelfCard[] = [];

const yourPlaylistCards: HomeShelfCard[] = [];

type HomeVideoRadioCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  to: string;
  label: string;
  tileImage: string;
  tileTitle: string;
  artistHint?: string;
};

const videoRadioCards: HomeVideoRadioCard[] = [];

const homeFooterColumns = [
  {
    titleKey: 'homePage.footer.company.title',
    linkKeys: [
      'homePage.footer.company.about',
      'homePage.footer.company.jobs',
      'homePage.footer.company.forTheRecord',
    ],
  },
  {
    titleKey: 'homePage.footer.communities.title',
    linkKeys: [
      'homePage.footer.communities.forArtists',
      'homePage.footer.communities.developers',
      'homePage.footer.communities.advertising',
      'homePage.footer.communities.investors',
      'homePage.footer.communities.vendors',
    ],
  },
  {
    titleKey: 'homePage.footer.usefulLinks.title',
    linkKeys: [
      'homePage.footer.usefulLinks.support',
      'homePage.footer.usefulLinks.freeMobileApp',
      'homePage.footer.usefulLinks.popularByCountry',
      'homePage.footer.usefulLinks.importMusic',
    ],
  },
  {
    titleKey: 'homePage.footer.plans.title',
    linkKeys: [
      'homePage.footer.plans.premiumIndividual',
      'homePage.footer.plans.premiumDuo',
      'homePage.footer.plans.premiumFamily',
      'homePage.footer.plans.premiumStudent',
      'homePage.footer.plans.spotifyFree',
    ],
  },
] as const;

const homeFooterLegalLinkKeys = [
  'homePage.footer.legal.items.legal',
  'homePage.footer.legal.items.safetyPrivacyCenter',
  'homePage.footer.legal.items.privacyPolicy',
  'homePage.footer.legal.items.cookieSettings',
  'homePage.footer.legal.items.aboutAds',
  'homePage.footer.legal.items.accessibility',
] as const;

type CarouselControls = {
  scrollerRef: MutableRefObject<HTMLDivElement | null>;
  handlePrev: () => void;
  handleNext: () => void;
  handleMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  showLeftControl: boolean;
  showRightControl: boolean;
};

const useCarouselControls = (): CarouselControls => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [hoverEdge, setHoverEdge] = useState<'left' | 'right' | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const hasOverflow = scroller.scrollWidth > scroller.clientWidth + 1;
    const hasMoreOnLeft = scroller.scrollLeft > 1;
    const hasMoreOnRight = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;

    setCanScrollLeft(hasOverflow && hasMoreOnLeft);
    setCanScrollRight(hasOverflow && hasMoreOnRight);
  }, []);

  useEffect(() => {
    updateScrollState();

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const handleScroll = () => updateScrollState();

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const handleNext = () => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: Math.max(280, Math.round(scroller.clientWidth * 0.72)),
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: -Math.max(280, Math.round(scroller.clientWidth * 0.72)),
      behavior: 'smooth',
    });
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const edgeThreshold = Math.min(96, rect.width * 0.16);

    if (cursorX <= edgeThreshold) {
      setHoverEdge('left');
      return;
    }

    if (cursorX >= rect.width - edgeThreshold) {
      setHoverEdge('right');
      return;
    }

    setHoverEdge(null);
  };

  const handleMouseLeave = () => {
    setHoverEdge(null);
  };

  return {
    scrollerRef,
    handlePrev,
    handleNext,
    handleMouseMove,
    handleMouseLeave,
    showLeftControl: canScrollLeft && hoverEdge === 'left',
    showRightControl: canScrollRight && hoverEdge === 'right',
  };
};

const CarouselEdgeControls = ({
  controls,
  t,
}: {
  controls: CarouselControls;
  t: (key: string) => string;
}) => (
  <>
    {controls.showLeftControl && (
      <>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-transparent" />
        <button
          type="button"
          onClick={controls.handlePrev}
          aria-label={t('homePage.carousel.previous')}
          className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-zinc-100 shadow-lg shadow-black/60 transition hover:scale-105 hover:bg-zinc-700"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 rotate-180 fill-current" aria-hidden="true">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
          </svg>
        </button>
      </>
    )}

    {controls.showRightControl && (
      <>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950 via-zinc-950/75 to-transparent" />
        <button
          type="button"
          onClick={controls.handleNext}
          aria-label={t('homePage.carousel.next')}
          className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-zinc-100 shadow-lg shadow-black/60 transition hover:scale-105 hover:bg-zinc-700"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
          </svg>
        </button>
      </>
    )}
  </>
);

function HomePage() {
  const { t } = useTranslation();
  const authUser = useAuthStore((state) => state.user);
  const userName = authUser?.name || authUser?.username || 'User';
  const [activeFilter, setActiveFilter] = useState<'all' | 'music' | 'podcasts'>('all');
  const madeForCarousel = useCarouselControls();
  const albumsCarousel = useCarouselControls();
  const songsCarousel = useCarouselControls();
  const jumpBackInCarousel = useCarouselControls();
  const recentlyPlayedCarousel = useCarouselControls();
  const topMixesCarousel = useCarouselControls();
  const favoriteArtistsCarousel = useCarouselControls();
  const moreLikeCarousel = useCarouselControls();
  const recommendedStationsCarousel = useCarouselControls();
  const episodesCarousel = useCarouselControls();
  const popularRadioCarousel = useCarouselControls();
  const yourPlaylistsCarousel = useCarouselControls();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const setPlaybackSource = usePlayerStore((state) => state.setPlaybackSource);
  const setPlaybackContext = usePlayerStore((state) => state.setPlaybackContext);
  const [madeForCards, setMadeForCards] = useState<HomeShelfCard[]>([]);
  const [madeForAlbumCards, setMadeForAlbumCards] = useState<HomeShelfCard[]>([]);
  const [madeForSongCards, setMadeForSongCards] = useState<HomeShelfCard[]>([]);
  const [isArtistsLoading, setIsArtistsLoading] = useState(true);
  const [isAlbumsLoading, setIsAlbumsLoading] = useState(true);
  const [isSongsLoading, setIsSongsLoading] = useState(true);
  const [artistsError, setArtistsError] = useState<string | null>(null);
  const [albumsError, setAlbumsError] = useState<string | null>(null);
  const [songsError, setSongsError] = useState<string | null>(null);

  useEffect(() => {
    setIsArtistsLoading(true);
    setArtistsError(null);
    api.get('/artists')
      .then((res: any) => {
        const raw = res.data;
        const artists = Array.isArray(raw)
          ? raw
          : raw?.content || raw?.artists || raw?.data || [];
        const formatted = artists.map((artist: any) => ({
          id: `artist-${artist.id}`,
          title: artist.name,
          subtitle: artist.bio || (artist.genres?.length ? artist.genres[0] : 'Artist'),
          image: artist.imageUrl || artist.picture || artist.images?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random`,
          to: `/artist/${artist.id}`,
          shape: 'circle' as const,
        }));
        setMadeForCards(formatted);
      })
      .catch((err: any) => {
        console.error('Failed to fetch artists:', err);
        setArtistsError('Failed to load artists.');
      })
      .finally(() => {
        setIsArtistsLoading(false);
      });

    setIsAlbumsLoading(true);
    setAlbumsError(null);
    setIsSongsLoading(true);
    setSongsError(null);

    Promise.all([
      api.get('/albums').catch((err: any) => {
        console.error('Failed to fetch albums:', err?.response?.status, err?.response?.data, err?.message);
        setAlbumsError(`Albümler yüklenemedi: ${err?.message || 'Bilinmeyen hata'}`);
        return null;
      }),
      api.get('/songs').catch((err: any) => {
        console.error('Failed to fetch songs:', err?.response?.status, err?.response?.data, err?.message);
        setSongsError(`Şarkılar yüklenemedi: ${err?.message || 'Bilinmeyen hata'}`);
        return null;
      })
    ]).then(([albumsRes, songsRes]) => {
      let albumsList: any[] = [];
      if (albumsRes) {
        const raw = albumsRes.data;
        albumsList = Array.isArray(raw)
          ? raw
          : raw?.content || raw?.albums || raw?.data || [];
        const formattedAlbums = albumsList.map((album: any) => ({
          id: `album-${album.id}`,
          title: album.title,
          subtitle: `${album.artistName || 'Artist'} • ${album.releaseYear || 'Album'}`,
          image: album.coverImageUrl || `https://picsum.photos/seed/album-${album.id}/640/640`,
          to: `/album/${album.id}`,
          shape: 'square' as const,
        }));
        setMadeForAlbumCards(formattedAlbums);
      }
      setIsAlbumsLoading(false);

      if (songsRes) {
        const raw = songsRes.data;
        const songsList = Array.isArray(raw) ? raw : raw?.content || raw?.songs || raw?.data || [];
        const formattedSongs = songsList.map((song: any) => {
          const albumMatch = albumsList.find((a: any) => a.id === song.albumId);
          const artistName = song.artistName || song.artist || albumMatch?.artistName || '';
          const albumTitle = song.albumTitle || albumMatch?.title || '';
          const subtitle = artistName && albumTitle
            ? `${artistName} • ${albumTitle}`
            : artistName || albumTitle || 'Song';
          return {
            id: `track-${song.id}`,
            title: song.title,
            subtitle,
            image: albumMatch?.coverImageUrl || `https://picsum.photos/seed/album-${song.albumId || song.id}/640/640`,
            to: `/track/${song.id}`,
            shape: 'square' as const,
          };
        });
        setMadeForSongCards(formattedSongs);
      }
      setIsSongsLoading(false);
    });
  }, []);

  const filteredLibraryItems: LibraryItem[] = useMemo(
    () =>
      libraryItems.filter((item) => {
        if (activeFilter === 'all') {
          return true;
        }

        if (activeFilter === 'music') {
          return item.type === 'artist' || item.type === 'album' || item.type === 'playlist';
        }

        return false;
      }),
    [activeFilter],
  );

  const quickAccessItems = filteredLibraryItems.slice(0, 8);
  const allLibraryItems = filteredLibraryItems;

  const playbackContext = usePlayerStore((state) => state.playbackContext);

  const isLibraryItemNowPlaying = (item: LibraryItem) => {
    if (!isPlaying || !currentTrack) {
      return false;
    }

    if (item.type === 'artist') {
      return playbackContext.type === 'artist' && playbackContext.id === item.id;
    }

    if (item.type === 'album') {
      return playbackContext.type === 'album' && playbackContext.id === item.id;
    }

    if (item.type === 'playlist') {
      return playbackContext.type === 'playlist' && playbackContext.id === item.id;
    }

    return false;
  };

  const handleQuickPlay = (item: LibraryItem, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const storeTrack = currentTrack;
    const pbContext = usePlayerStore.getState().playbackContext;

    if (item.type === 'artist') {
      const artist = spotifyData.artists.find((a) => a.name === item.title || a.id === item.id);
      if (!artist) return;

      // If already playing from this artist, toggle
      if (pbContext.type === 'artist' && pbContext.id === artist.id && storeTrack) {
        togglePlay();
        return;
      }

      const artistTracks = spotifyData.tracks
        .filter((t) => t.artist_ids.includes(artist.id))
        .sort((a, b) => b.popularity - a.popularity);
      if (artistTracks.length === 0) return;

      const queue = artistTracks.map((track) => ({
        id: track.id,
        title: track.name,
        artist: artist.name,
        cover: artist.images[0]?.url ?? `https://picsum.photos/seed/artist-${artist.id}/640/640`,
        src: track.preview_url ?? undefined,
        albumId: track.album_id,
      }));

      setTrack(queue[0]);
      setQueue(queue);
      setPlaybackSource('external');
      setPlaybackContext({ type: 'artist', id: artist.id });
      setIsPlaying(true);
      return;
    }

    if (item.type === 'album') {
      const album = spotifyData.albums.find((a) => a.id === item.id);
      if (!album) return;

      // If already playing this album, toggle
      if (pbContext.type === 'album' && pbContext.id === album.id && storeTrack) {
        togglePlay();
        return;
      }

      const albumTracks = spotifyData.tracks
        .filter((t) => t.album_id === album.id)
        .sort((a, b) => a.track_number - b.track_number);
      if (albumTracks.length === 0) return;

      const artistName =
        spotifyData.artists.find((a) => album.artist_ids.includes(a.id))?.name ?? 'Unknown';
      const queue = albumTracks.map((track) => ({
        id: track.id,
        title: track.name,
        artist: artistName,
        cover: album.images[0]?.url ?? `https://picsum.photos/seed/album-${album.id}/640/640`,
        src: track.preview_url ?? undefined,
        albumId: album.id,
      }));

      setTrack(queue[0]);
      setQueue(queue);
      setPlaybackSource('external');
      setPlaybackContext({ type: 'album', id: album.id });
      setIsPlaying(true);
      return;
    }

    // Playlist (Liked Songs)
    if (item.id === 'liked-songs') {
      if (pbContext.type === 'playlist' && pbContext.id === 'liked-songs' && storeTrack) {
        togglePlay();
        return;
      }

      const allTracks = spotifyData.tracks
        .filter((t) => t.preview_url)
        .sort((a, b) => b.popularity - a.popularity);
      if (allTracks.length === 0) return;

      const queue = allTracks.map((track) => {
        const artist = spotifyData.artists.find((a) => track.artist_ids.includes(a.id));
        return {
          id: track.id,
          title: track.name,
          artist: artist?.name ?? 'Unknown',
          cover: artist?.images[0]?.url ?? `https://picsum.photos/seed/track-${track.id}/640/640`,
          src: track.preview_url ?? undefined,
          albumId: track.album_id,
        };
      });

      setTrack(queue[0]);
      setQueue(queue);
      setPlaybackSource('external');
      setPlaybackContext({ type: 'playlist', id: 'liked-songs' });
      setIsPlaying(true);
    }
  };

  const isShelfCardNowPlaying = (card: HomeShelfCard) => {
    if (!isPlaying || !currentTrack) {
      return false;
    }

    if (playbackContext.type === 'none') {
      return false;
    }

    const currentContextPath = `/${playbackContext.type}/${playbackContext.id}`;
    return card.to === currentContextPath;
  };

  const getLibraryMeta = (meta: string, type: LibraryItem['type']) => {
    const typeLabel =
      type === 'playlist'
        ? t('common.words.playlist')
        : type === 'artist'
          ? t('common.words.artist')
          : type === 'album'
            ? t('common.words.album')
            : t('common.words.podcast');

    if (!meta.includes(' . ')) {
      return typeLabel;
    }

    const suffix = meta
      .split(' . ')
      .slice(1)
      .join(' . ')
      .replace(/(\d+)\s+songs?/i, `$1 ${t('common.words.songs')}`);

    return `${typeLabel} . ${suffix}`;
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            activeFilter === 'all'
              ? 'bg-white font-semibold text-black'
              : 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600'
          }`}
        >
          {t('homePage.filters.all')}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('music')}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            activeFilter === 'music'
              ? 'bg-white font-semibold text-black'
              : 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600'
          }`}
        >
          {t('homePage.filters.music')}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('podcasts')}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            activeFilter === 'podcasts'
              ? 'bg-white font-semibold text-black'
              : 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600'
          }`}
        >
          {t('homePage.filters.podcasts')}
        </button>
      </div>

      <section className="grid gap-2 sm:grid-cols-2">
        {quickAccessItems.map((item) => (
          <NavLink
            key={item.id}
            to={getLibraryItemRoute(item)}
            className="group relative flex h-14 items-center rounded-md bg-zinc-800/80 text-left transition hover:bg-zinc-700/80"
          >
            <div
              className={`mr-3 h-full w-14 shrink-0 ${
                item.type === 'artist'
                  ? 'flex items-center justify-center'
                  : 'overflow-hidden rounded-l-md'
              }`}
            >
              {item.id === 'liked-songs' ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-500 to-cyan-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current text-white"
                    aria-hidden="true"
                  >
                    <path d="M12 21c-.3 0-.6-.1-.9-.4C5.7 15.7 2 12.4 2 8.5 2 5.5 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.5 22 8.5c0 3.9-3.7 7.2-9.1 12.1-.3.3-.6.4-.9.4z" />
                  </svg>
                </div>
              ) : item.image ? (
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.title}
                  className={`object-cover ${item.type === 'artist' ? 'h-12 w-12 rounded-full' : 'h-full w-full'}`}
                  loading="lazy"
                />
              ) : (
                <div
                  className={`bg-gradient-to-br ${item.palette} ${
                    item.type === 'artist' ? 'h-12 w-12 rounded-full' : 'h-full w-full'
                  }`}
                />
              )}
            </div>
            <span
              className={`min-w-0 truncate pr-16 font-semibold ${
                isLibraryItemNowPlaying(item) ? 'text-emerald-400' : ''
              }`}
            >
              {item.id === 'liked-songs' ? t('homePage.quickAccess.likedSongs') : item.title}
            </span>

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isLibraryItemNowPlaying(item) ? (
                <span className="inline-flex h-8 w-8 items-center justify-center">
                  <NowPlayingEqualizer />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleQuickPlay(item, e)}
                  className="inline-flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-lg shadow-black/40 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                  </svg>
                </button>
              )}
            </div>
          </NavLink>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold">{t('layout.workspace.yourLibrary')}</h3>
          <button className="text-sm font-semibold text-zinc-300">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {allLibraryItems.map((item) => (
            <NavLink
              key={`home-library-${item.id}`}
              to={getLibraryItemRoute(item)}
              className="group relative flex items-center gap-3 rounded-lg bg-zinc-900/75 p-3 transition hover:bg-zinc-800/75"
            >
              <div
                className={`h-12 w-12 shrink-0 overflow-hidden ${
                  item.type === 'artist' ? 'rounded-full' : 'rounded-md'
                }`}
              >
                {item.id === 'liked-songs' ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-500 to-cyan-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current text-white"
                      aria-hidden="true"
                    >
                      <path d="M12 21c-.3 0-.6-.1-.9-.4C5.7 15.7 2 12.4 2 8.5 2 5.5 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.5 22 8.5c0 3.9-3.7 7.2-9.1 12.1-.3.3-.6.4-.9.4z" />
                    </svg>
                  </div>
                ) : item.image ? (
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${item.palette}`} />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`truncate font-semibold ${isLibraryItemNowPlaying(item) ? 'text-emerald-400' : ''}`}
                >
                  {item.id === 'liked-songs' ? t('homePage.quickAccess.likedSongs') : item.title}
                </p>
                <p className="truncate text-sm text-zinc-400">
                  {getLibraryMeta(item.meta, item.type)}
                </p>
              </div>

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isLibraryItemNowPlaying(item) ? (
                  <span className="inline-flex h-8 w-8 items-center justify-center">
                    <NowPlayingEqualizer />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleQuickPlay(item, e)}
                    className="inline-flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-lg shadow-black/40 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                    </svg>
                  </button>
                )}
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-300">{t('homePage.sections.madeFor')}</p>
            <h3 className="text-2xl font-black leading-none tracking-tight">{userName}</h3>
          </div>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={madeForCarousel.handleMouseMove}
          onMouseLeave={madeForCarousel.handleMouseLeave}
        >
          <div
            ref={madeForCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {isArtistsLoading ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-emerald-500" />
              </div>
            ) : artistsError ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                {artistsError}
              </div>
            ) : madeForCards.length === 0 ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400" id="artist-check">
                No artists found.
              </div>
            ) : (
              madeForCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group/card relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    {card.badge && (
                      <span className="absolute bottom-2 left-2 rounded bg-cyan-300/95 px-2 py-0.5 text-xs font-black tracking-wide text-black">
                        {card.badge}
                      </span>
                    )}

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
              })
            )}
          </div>

          <CarouselEdgeControls controls={madeForCarousel} t={t} />
        </div>
      </section>

      {/* Popular Albums Shelf */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-black leading-none tracking-tight">{t('homePage.sections.popularAlbums')}</h3>
          </div>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={albumsCarousel.handleMouseMove}
          onMouseLeave={albumsCarousel.handleMouseLeave}
        >
          <div
            ref={albumsCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {isAlbumsLoading ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-emerald-500" />
              </div>
            ) : albumsError ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                {albumsError}
              </div>
            ) : madeForAlbumCards.length === 0 ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                No albums found.
              </div>
            ) : (
              madeForAlbumCards.map((card) => {
                const isNowPlayingCard = isShelfCardNowPlaying(card);

                return (
                  <NavLink
                    key={card.id}
                    to={card.to}
                    className="group/card relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                      <div className="absolute bottom-6 right-6">
                        {isNowPlayingCard ? (
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                            <NowPlayingEqualizer className="h-5 w-5" />
                          </span>
                        ) : (
                          <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6 fill-current"
                              aria-hidden="true"
                            >
                              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                    >
                      {card.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                  </NavLink>
                );
              })
            )}
          </div>
          <CarouselEdgeControls controls={albumsCarousel} t={t} />
        </div>
      </section>

      {/* Popular Songs Shelf */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-black leading-none tracking-tight">{t('homePage.sections.popularSongs')}</h3>
          </div>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={songsCarousel.handleMouseMove}
          onMouseLeave={songsCarousel.handleMouseLeave}
        >
          <div
            ref={songsCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {isSongsLoading ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-emerald-500" />
              </div>
            ) : songsError ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                {songsError}
              </div>
            ) : madeForSongCards.length === 0 ? (
              <div className="flex w-full items-center justify-center py-10 text-zinc-400">
                No songs found.
              </div>
            ) : (
              madeForSongCards.map((card) => {
                const isNowPlayingCard = isShelfCardNowPlaying(card);

                return (
                  <NavLink
                    key={card.id}
                    to={card.to}
                    className="group/card relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                      <div className="absolute bottom-6 right-6">
                        {isNowPlayingCard ? (
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                            <NowPlayingEqualizer className="h-5 w-5" />
                          </span>
                        ) : (
                          <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6 fill-current"
                              aria-hidden="true"
                            >
                              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                    >
                      {card.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                  </NavLink>
                );
              })
            )}
          </div>

          <CarouselEdgeControls controls={songsCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.jumpBackIn')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={jumpBackInCarousel.handleMouseMove}
          onMouseLeave={jumpBackInCarousel.handleMouseLeave}
        >
          <div
            ref={jumpBackInCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {jumpBackInCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div
                    className={`relative mb-3 aspect-square ${
                      card.shape === 'circle' ? '' : 'overflow-hidden rounded-lg'
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`h-full w-full object-cover ${card.shape === 'circle' ? 'rounded-full' : ''}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={jumpBackInCarousel} t={t} />
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.recentlyPlayed')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={recentlyPlayedCarousel.handleMouseMove}
          onMouseLeave={recentlyPlayedCarousel.handleMouseLeave}
        >
          <div
            ref={recentlyPlayedCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {recentlyPlayedCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div
                    className={`relative mb-3 aspect-square ${
                      card.shape === 'circle' ? '' : 'overflow-hidden rounded-lg'
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`h-full w-full object-cover ${card.shape === 'circle' ? 'rounded-full' : ''}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-2 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={recentlyPlayedCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">{t('homePage.sections.topMixes')}</h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={topMixesCarousel.handleMouseMove}
          onMouseLeave={topMixesCarousel.handleMouseLeave}
        >
          <div
            ref={topMixesCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {topMixCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    {card.badge && (
                      <span
                        className={`absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-black tracking-wide text-black ${
                          card.badgeClassName ?? 'bg-cyan-300/95'
                        }`}
                      >
                        {card.badge}
                      </span>
                    )}

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={topMixesCarousel} t={t} />
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.favoriteArtists')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={favoriteArtistsCarousel.handleMouseMove}
          onMouseLeave={favoriteArtistsCarousel.handleMouseLeave}
        >
          <div
            ref={favoriteArtistsCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {favoriteArtistCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={favoriteArtistsCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://picsum.photos/seed/more-like-lvbel-avatar/160/160"
              alt="Lvbel C5"
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-sm text-zinc-400">{t('homePage.sections.moreLike')}</p>
              <h3 className="text-4xl font-black tracking-tight">Lvbel C5</h3>
            </div>
          </div>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={moreLikeCarousel.handleMouseMove}
          onMouseLeave={moreLikeCarousel.handleMouseLeave}
        >
          <div
            ref={moreLikeCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {moreLikeLvbelCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    {card.topTag && (
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-black tracking-widest text-zinc-100">
                        {card.topTag}
                      </span>
                    )}

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={moreLikeCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <p className="mb-1 text-sm text-zinc-400">{t('homePage.sections.nonStopHint')}</p>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.recommendedStations')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={recommendedStationsCarousel.handleMouseMove}
          onMouseLeave={recommendedStationsCarousel.handleMouseLeave}
        >
          <div
            ref={recommendedStationsCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {recommendedStationCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    {card.topTag && (
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-black tracking-widest text-zinc-100">
                        {card.topTag}
                      </span>
                    )}

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={recommendedStationsCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.episodesYouMightLike')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={episodesCarousel.handleMouseMove}
          onMouseLeave={episodesCarousel.handleMouseLeave}
        >
          <div
            ref={episodesCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {episodesYouMightLikeCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-2 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={episodesCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.popularRadio')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={popularRadioCarousel.handleMouseMove}
          onMouseLeave={popularRadioCarousel.handleMouseLeave}
        >
          <div
            ref={popularRadioCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {popularRadioCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    {card.topTag && (
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-black tracking-widest text-zinc-100">
                        {card.topTag}
                      </span>
                    )}

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{card.subtitle}</p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={popularRadioCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-black tracking-tight">
            {t('homePage.sections.yourPlaylists')}
          </h3>
          <button className="text-sm font-semibold text-zinc-300 transition hover:text-zinc-100">
            {t('common.actions.showAll')}
          </button>
        </div>

        <div
          className="relative"
          onMouseMove={yourPlaylistsCarousel.handleMouseMove}
          onMouseLeave={yourPlaylistsCarousel.handleMouseLeave}
        >
          <div
            ref={yourPlaylistsCarousel.scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {yourPlaylistCards.map((card) => {
              const isNowPlayingCard = isShelfCardNowPlaying(card);

              return (
                <NavLink
                  key={card.id}
                  to={card.to}
                  className="group relative w-[220px] min-w-[220px] rounded-xl bg-zinc-900/75 p-3 transition hover:bg-zinc-800/85"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    <div className="absolute bottom-6 right-6">
                      {isNowPlayingCard ? (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                          <NowPlayingEqualizer className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current"
                            aria-hidden="true"
                          >
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`line-clamp-1 text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-400">
                    {card.subtitle.replace('Emre Kaya', userName)}
                  </p>
                </NavLink>
              );
            })}
          </div>

          <CarouselEdgeControls controls={yourPlaylistsCarousel} t={t} />
        </div>
      </section>

      <section className="mt-12 pb-10">
        <div className="grid gap-4 xl:grid-cols-2">
          {videoRadioCards.map((card) => {
            const isNowPlayingCard = isShelfCardNowPlaying({
              id: card.id,
              title: card.title,
              subtitle: card.subtitle,
              image: card.image,
              to: card.to,
              artistHint: card.artistHint,
            });

            return (
              <NavLink
                key={card.id}
                to={card.to}
                className="group relative overflow-hidden rounded-xl bg-zinc-900/90"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-[520px] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/25" />

                <div className="absolute left-4 top-4">
                  <p className="text-sm text-zinc-300">{card.label}</p>
                </div>

                <div className="absolute left-6 top-12 flex items-center gap-3">
                  <img
                    src={card.tileImage}
                    alt={card.tileTitle}
                    className="h-16 w-16 rounded object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p
                      className={`text-base font-semibold ${isNowPlayingCard ? 'text-emerald-400' : 'text-zinc-100'}`}
                    >
                      {card.title}
                    </p>
                    <p className="text-sm text-zinc-300">{card.subtitle}</p>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-24">
                  <p className="text-sm leading-6 text-zinc-200">{card.description}</p>
                </div>

                <div className="absolute bottom-6 right-6">
                  {isNowPlayingCard ? (
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/65 ring-1 ring-white/15">
                      <NowPlayingEqualizer className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="inline-flex h-14 w-14 translate-y-2 items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                        <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                      </svg>
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </section>

      <footer className="mt-10 border-t border-zinc-800/80 pb-12 pt-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-4 xl:gap-x-14">
            {homeFooterColumns.map((column) => (
              <div key={column.titleKey}>
                <h4 className="mb-2 text-base font-bold text-zinc-100">{t(column.titleKey)}</h4>
                <ul className="space-y-1">
                  {column.linkKeys.map((linkKey) => (
                    <li key={linkKey}>
                      <button
                        type="button"
                        className="text-left text-base text-zinc-400 transition hover:text-zinc-100 hover:underline"
                      >
                        {t(linkKey)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 xl:pt-0.5">
            <button
              type="button"
              aria-label={t('homePage.footer.social.instagram')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-zinc-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5m0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5m5.25-3a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t('homePage.footer.social.twitter')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-zinc-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.3-8.3L1 2h6.2l4.4 5.8zm-1.1 18h1.7L6.3 3.9H4.5z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t('homePage.footer.social.facebook')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-zinc-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.7-1.6h1.7V4.1c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.4-4 4.1v2.6H8v3.2h2.5V22z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-start justify-between gap-4 border-t border-zinc-800/80 pt-8">
          <div className="flex max-w-[80%] flex-wrap items-center gap-x-6 gap-y-2">
            {homeFooterLegalLinkKeys.map((linkKey) => (
              <button
                key={linkKey}
                type="button"
                className="text-sm text-zinc-400 transition hover:text-zinc-200 hover:underline"
              >
                {t(linkKey)}
              </button>
            ))}
          </div>
          <p className="shrink-0 text-sm text-zinc-400">{t('homePage.footer.legal.copyright')}</p>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
