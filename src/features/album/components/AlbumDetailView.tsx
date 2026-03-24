import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { Link } from 'react-router-dom';
import { NowPlayingEqualizer } from '@/shared/components/NowPlayingEqualizer';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';

type SpotifyExternalUrls = {
  spotify: string;
};

type SpotifyArtist = {
  id: string;
  type: 'artist';
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
};

type SpotifyTrack = {
  id: string;
  type: 'track';
  uri: string;
  name: string;
  track_number: number;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  is_playable: boolean;
  popularity: number;
  preview_url: string | null;
  external_urls: SpotifyExternalUrls;
  artists: SpotifyArtist[];
};



const albumThemes: Record<string, { header: string; body: string; fallbackCover: string }> = {
  'neon-nights-2024': {
    header: 'from-violet-400 via-purple-700 to-zinc-900',
    body: 'from-purple-950/60 to-zinc-950',
    fallbackCover: 'from-violet-400 via-purple-500 to-indigo-500',
  },
  'voltage-ep-2025': {
    header: 'from-cyan-400 via-teal-700 to-zinc-900',
    body: 'from-teal-950/50 to-zinc-950',
    fallbackCover: 'from-cyan-400 via-teal-500 to-emerald-500',
  },
  'deniz-mavisi-2024': {
    header: 'from-sky-400 via-blue-700 to-zinc-900',
    body: 'from-blue-950/55 to-zinc-950',
    fallbackCover: 'from-sky-400 via-blue-500 to-indigo-500',
  },
  'karanlik-sokaklar-2025': {
    header: 'from-red-500 via-rose-800 to-zinc-900',
    body: 'from-rose-950/60 to-zinc-950',
    fallbackCover: 'from-red-500 via-rose-600 to-zinc-700',
  },
  'sessiz-cagri-2024': {
    header: 'from-amber-400 via-orange-700 to-zinc-900',
    body: 'from-orange-950/55 to-zinc-950',
    fallbackCover: 'from-amber-400 via-orange-500 to-red-500',
  },
  'akustik-anlar-2025': {
    header: 'from-emerald-400 via-green-700 to-zinc-900',
    body: 'from-green-950/50 to-zinc-950',
    fallbackCover: 'from-emerald-400 via-green-500 to-teal-500',
  },
};

type AlbumDetailViewProps = {
  albumId?: string;
};

const formatTrackDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const formatAlbumDuration = (tracks: SpotifyTrack[], minLabel: string, hrLabel: string) => {
  const totalMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
  const totalMinutes = Math.floor(totalMs / 60000);

  if (totalMinutes < 60) {
    return `${totalMinutes} ${minLabel}`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} ${hrLabel} ${minutes} ${minLabel}`;
};

function AlbumDetailView({ albumId }: AlbumDetailViewProps) {
  const { t } = useTranslation();
  const [albumData, setAlbumData] = useState<any>(null);
  const [albumSongs, setAlbumSongs] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!albumId) return;
    setIsLoading(true);

    // Fetch album details
    const albumPromise = api.get(`/albums/${albumId}`)
      .then(res => {
        setAlbumData(res.data);
        return res.data;
      })
      .catch(err => {
        console.error('Failed to fetch album:', err);
        // Fallback: try fetching from /albums list
        return api.get('/albums').then(resList => {
          const raw = resList.data;
          const albums = Array.isArray(raw) ? raw : raw?.content || raw?.albums || raw?.data || [];
          const found = albums.find((a: any) => a.id === albumId);
          if (found) setAlbumData(found);
          return found;
        }).catch(() => null);
      });

    // Fetch songs that belong to this album
    const songsPromise = api.get('/songs')
      .then(res => {
        const raw = res.data;
        const songs = Array.isArray(raw) ? raw : raw?.content || raw?.songs || raw?.data || [];
        const albumTracks = songs
          .filter((s: any) => s.albumId === albumId)
          .map((s: any, idx: number) => ({
            id: s.id,
            type: 'track' as const,
            uri: '',
            name: s.title,
            track_number: idx + 1,
            disc_number: 1,
            duration_ms: (s.duration || 0) * 1000,
            explicit: false,
            is_playable: true,
            popularity: 80,
            preview_url: s.audioUrl || null,
            external_urls: { spotify: '' },
            artists: [{ id: s.artistId || '', type: 'artist' as const, name: s.artistName || '', uri: '', external_urls: { spotify: '' } }],
          }));
        setAlbumSongs(albumTracks);
      })
      .catch(err => console.error('Failed to fetch songs for album:', err));

    Promise.all([albumPromise, songsPromise]).finally(() => setIsLoading(false));
  }, [albumId]);

  const likedSongs = useLibraryStore((state) => state.likedSongs);
  const toggleLikedSong = useLibraryStore((state) => state.toggleLikedSong);
  const addToast = useToastStore((state) => state.addToast);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const setPlaybackSource = usePlayerStore((state) => state.setPlaybackSource);
  const setPlaybackContext = usePlayerStore((state) => state.setPlaybackContext);
  const storeTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playbackSource = usePlayerStore((state) => state.playbackSource);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500" />
      </div>
    );
  }

  if (!albumData) {
    return (
      <section className="overflow-hidden rounded-xl bg-zinc-950 p-6">
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          {t('albumDetail.notFound')} <code>{albumId}</code>.
        </div>
      </section>
    );
  }

  const album = {
    ...albumData,
    name: albumData.title || albumData.name,
    images: albumData.coverImageUrl ? [{ url: albumData.coverImageUrl }] : (albumData.images || []),
    artists: albumData.artistName
      ? [{ name: albumData.artistName, id: albumData.artistId }]
      : (albumData.artists || [{ name: 'Unknown', id: '' }]),
    tracks: { items: albumSongs },
    release_date: albumData.releaseYear ? `${albumData.releaseYear}-01-01` : (albumData.release_date || ''),
  };

  const theme = albumThemes[albumId || ''] ?? {
    header: 'from-zinc-500 via-zinc-800 to-zinc-950',
    body: 'from-zinc-900/50 to-zinc-950',
    fallbackCover: 'from-zinc-300 via-zinc-500 to-zinc-700',
  };

  const primaryImage = album.images[0];
  const albumArtists = album.artists.map((artist: any) => artist.name).join(', ');
  const releaseYear = album.release_date.slice(0, 4);
  const trackItems = [...album.tracks.items].sort((a: any, b: any) => a.track_number - b.track_number);
  const albumQueue = trackItems.map((track) => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    cover: primaryImage?.url ?? '',
    src: track.preview_url ?? undefined,
    albumId: album.id,
  }));
  const albumMeta = t('albumDetail.songsMeta', {
    releaseDate: releaseYear,
    trackCount: trackItems.length,
    duration: formatAlbumDuration(trackItems, t('albumDetail.min'), t('albumDetail.hr')),
  });

  const handleTrackPlay = async (track: SpotifyTrack) => {
    if (!track.preview_url) {
      return;
    }

    const isSameTrack = playbackSource === 'external' && storeTrack?.id === track.id;
    if (isSameTrack) {
      togglePlay();
      return;
    }

    setTrack({
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      cover: primaryImage?.url ?? '',
      src: track.preview_url,
      albumId: album.id,
    });
    setQueue(albumQueue);
    setPlaybackSource('external');
    setPlaybackContext({ type: 'album', id: album.id });
    setIsPlaying(true);
  };

  const isAlbumPlaying =
    playbackSource === 'external' && isPlaying && storeTrack?.albumId === album.id;

  const handleAlbumPlay = () => {
    if (storeTrack?.albumId === album.id && playbackSource === 'external') {
      togglePlay();
      return;
    }

    const firstTrack = trackItems[0];
    if (firstTrack) {
      handleTrackPlay(firstTrack);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl bg-zinc-950">
      <header className={`bg-gradient-to-b ${theme.header} px-6 pb-6 pt-8 sm:px-8`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="h-44 w-44 shrink-0 overflow-hidden rounded-md bg-zinc-800 shadow-2xl shadow-black/50 sm:h-52 sm:w-52">
            {primaryImage ? (
              <img
                className="h-full w-full object-cover"
                src={primaryImage.url}
                alt={`${album.name} cover`}
                loading="lazy"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${theme.fallbackCover}`}
              >
                <span className="text-center text-sm font-bold uppercase tracking-wide text-black/80">
                  {album.name}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1" style={{ containerType: 'inline-size' }}>
            <p className="text-xs font-semibold capitalize tracking-[0.18em] text-zinc-100/80">
              {album.album_type === 'single' ? t('albumDetail.single') : t('albumDetail.album')}
            </p>
            <h1
              className="mt-2 font-black tracking-tight"
              style={{
                fontSize: `clamp(1.5rem, ${140 / Math.max(album.name.length, 1)}cqi, 6rem)`,
                lineHeight: 1.1,
              }}
            >
              {album.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-100/90 sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 overflow-hidden rounded-full bg-zinc-700">
                  {primaryImage ? (
                    <img
                      src={primaryImage.url}
                      alt={albumArtists}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-600" />
                  )}
                </div>
                <span className="font-semibold text-white">{albumArtists}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-200">{albumMeta.replace(/\s\.\s/g, ' • ')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={`bg-gradient-to-b ${theme.body} px-6 pb-8 pt-5`}>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-zinc-200">
          <button
            type="button"
            onClick={handleAlbumPlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-black transition hover:scale-105 hover:bg-emerald-400"
          >
            {isAlbumPlaying ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
              </svg>
            )}
          </button>
          <div className="hidden h-10 w-10 overflow-hidden rounded-md bg-zinc-800 shadow-lg shadow-black/30 sm:flex">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={`${album.name} cover`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${theme.fallbackCover}`} />
            )}
          </div>
          <button
            type="button"
            aria-disabled={false}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
            aria-label={`Enable Shuffle for ${album.name}`}
            data-encore-id="buttonTertiary"
          >
            <span aria-hidden="true" className="inline-flex items-center justify-center">
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M18.788 3.702a1 1 0 0 1 1.414-1.414L23.914 6l-3.712 3.712a1 1 0 1 1-1.414-1.414L20.086 7h-1.518a5 5 0 0 0-3.826 1.78l-7.346 8.73a7 7 0 0 1-5.356 2.494H1v-2h1.04a5 5 0 0 0 3.826-1.781l7.345-8.73A7 7 0 0 1 18.569 5h1.518l-1.298-1.298z"></path>
                <path d="M18.788 14.289a1 1 0 0 0 0 1.414L20.086 17h-1.518a5 5 0 0 1-3.826-1.78l-1.403-1.668-1.306 1.554 1.178 1.4A7 7 0 0 0 18.568 19h1.518l-1.298 1.298a1 1 0 1 0 1.414 1.414L23.914 18l-3.712-3.713a1 1 0 0 0-1.414 0zM7.396 6.49l2.023 2.404-1.307 1.553-2.246-2.67a5 5 0 0 0-3.826-1.78H1v-2h1.04A7 7 0 0 1 7.396 6.49"></path>
              </svg>
            </span>
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m-1.1 13.6-3.5-3.5 1.4-1.4 2.1 2.1 4.7-4.7 1.4 1.4-6.1 6.1z" />
            </svg>
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3 1.4 1.4-4 4a1 1 0 0 1-1.4 0l-4-4 1.4-1.4 2.3 2.3V4a1 1 0 0 1 1-1m-7 16h14v2H5v-2z" />
            </svg>
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
            </svg>
          </button>
          <div className="ml-auto flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-300">
            <span>List</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M4 6h12v2H4V6zm0 5h12v2H4v-2zm0 5h12v2H4v-2zm15-10h2v2h-2V6zm0 5h2v2h-2v-2zm0 5h2v2h-2v-2z" />
            </svg>
          </div>
        </div>

        <div className="border-b border-white/5 pb-3 text-xs uppercase tracking-wide text-zinc-400">
          <div className="grid grid-cols-[32px_minmax(0,1.6fr)_28px_52px] gap-3 md:grid-cols-[40px_minmax(0,1.8fr)_32px_70px]">
            <span className="text-center">#</span>
            <span>{t('albumDetail.title')}</span>
            <span className="text-center">
              <svg viewBox="0 0 24 24" className="mx-auto h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m1 5v5.4l3.2 1.9-1 1.7L11 13V7z" />
              </svg>
            </span>
            <span className="text-right">{t('albumDetail.time')}</span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          {trackItems.map((track) => (
            <div
              key={track.id}
              className="group grid grid-cols-[32px_minmax(0,1.6fr)_28px_52px] gap-3 rounded-md px-2 py-2 text-zinc-200 transition hover:bg-zinc-800/60 md:grid-cols-[40px_minmax(0,1.8fr)_32px_70px]"
            >
              <div className="flex items-center justify-center text-zinc-400">
                {isPlaying && storeTrack?.id === track.id ? (
                  <NowPlayingEqualizer className="group-hover:hidden h-4 w-4" />
                ) : (
                  <span
                    className={`text-center group-hover:hidden ${storeTrack?.id === track.id ? 'text-emerald-500' : ''}`}
                  >
                    {track.track_number}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleTrackPlay(track)}
                  className="hidden h-8 w-8 items-center justify-center rounded-full text-zinc-200 transition hover:text-white group-hover:inline-flex"
                  aria-label={
                    isPlaying && storeTrack?.id === track.id
                      ? `Pause ${track.name}`
                      : `Play ${track.name}`
                  }
                >
                  {isPlaying && storeTrack?.id === track.id ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                    </svg>
                  )}
                </button>
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <Link
                  to={`/track/${track.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`truncate font-medium hover:underline ${storeTrack?.id === track.id ? 'text-emerald-500' : 'text-white'}`}
                >
                  {track.name}
                </Link>
                <p className="truncate text-sm text-zinc-400">
                  {track.artists.map((artist: any) => artist.name).join(', ')}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const isLiked = likedSongs.includes(track.id);
                  toggleLikedSong(track.id);

                  if (!isLiked) {
                    addToast({
                      message: 'Added to Liked Songs.',
                      icon: 'liked-songs',
                      action: {
                        label: 'Change',
                        onClick: () => toggleLikedSong(track.id),
                      },
                    });
                  } else {
                    addToast({
                      message: 'Removed from Liked Songs.',
                    });
                  }
                }}
                className={`flex items-center justify-center transition-opacity ${likedSongs.includes(track.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 hover:text-white text-zinc-400'}`}
                aria-label={
                  likedSongs.includes(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'
                }
              >
                {likedSongs.includes(track.id) ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current text-emerald-400"
                    aria-hidden="true"
                  >
                    <path d="M12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm-2.022 15.65-4.238-4.238 1.414-1.414 2.824 2.824 6.883-6.884 1.414 1.414-8.297 8.298z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                    <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
                  </svg>
                )}
              </button>
              <p className="text-right text-zinc-300">{formatTrackDuration(track.duration_ms)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AlbumDetailView;
