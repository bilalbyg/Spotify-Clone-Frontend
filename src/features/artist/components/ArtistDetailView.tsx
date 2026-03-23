/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import albumsJson from '@/features/album/data/albums.json';
const albumsJson = { albums: [] };
import { resolveLocale } from '@/helpers/i18n';
import { NowPlayingEqualizer } from '@/shared/components/NowPlayingEqualizer';
import { usePlayerStore } from '@/store/playerStore';

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

type Artist = {
  id: string;
  name: string;
  popularity: number;
  followers: {
    href: string | null;
    total: number;
  };
  monthly_listeners?: number;
  genres: string[];
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
};

type Track = {
  id: string;
  name: string;
  album_id: string;
  artist_ids: string[];
  duration_ms: number;
  popularity: number;
  preview_url?: string | null;
};

type Album = {
  id: string;
  name: string;
  album_type: 'album' | 'single' | 'compilation';
  release_date: string;
  total_tracks: number;
  artist_ids: string[];
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
};

type Playlist = {
  id: string;
  name: string;
  description: string;
  track_ids: string[];
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
};

type AlbumJsonTrack = {
  id: string;
  name: string;
  preview_url: string | null;
  artists: Array<{ id: string; name: string }>;
  popularity: number;
  duration_ms: number;
};

type AlbumJsonAlbum = {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: { items: AlbumJsonTrack[] };
};

type Dataset = {
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  playlists: Playlist[];
};

const data = spotifyData as Dataset;

/* Build a lookup of preview_url from albums.json tracks (which have audio) */
const albumsJsonData = (albumsJson as { albums: AlbumJsonAlbum[] }).albums;
const previewUrlMap = new Map<string, string>();
const albumCoverFromAlbumsJson = new Map<string, string>();
for (const album of albumsJsonData) {
  const cover = album.images[0]?.url ?? '';
  for (const track of album.tracks.items) {
    if (track.preview_url) {
      previewUrlMap.set(track.id, track.preview_url);
    }
    if (cover) {
      albumCoverFromAlbumsJson.set(track.id, cover);
    }
  }
}

const formatNumber = (value: number, locale: string) => new Intl.NumberFormat(locale).format(value);

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const formatDate = (date: string, locale: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

type ArtistDetailViewProps = {
  artistId?: string;
};

function ArtistDetailView({ artistId }: ArtistDetailViewProps) {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const [showAll, setShowAll] = useState(false);

  /* Player store */
  const setTrack = usePlayerStore((state) => state.setTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const setPlaybackSource = usePlayerStore((state) => state.setPlaybackSource);
  const setPlaybackContext = usePlayerStore((state) => state.setPlaybackContext);
  const storeTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playbackSource = usePlayerStore((state) => state.playbackSource);

  const [artist, setArtist] = useState<any>(null);
  const [artistAlbums, setArtistAlbums] = useState<any[]>([]);
  const [currentArtistTracks, setCurrentArtistTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!artistId) return;

    setIsLoading(true);
    // Fetch artist details
    api.get(`/artists/${artistId}`)
      .then(res => setArtist(res.data))
      .catch(err => console.error('Failed to fetch artist:', err))
      .finally(() => setIsLoading(false));

    // Fetch artist albums
    api.get(`/albums/artist/${artistId}`)
      .then(res => {
        const formattedAlbums = (res.data || []).map((album: any) => ({
          id: album.id,
          name: album.title,
          album_type: 'album',
          release_date: `${album.releaseYear}-01-01`,
          total_tracks: 0,
          images: album.coverImageUrl ? [{ url: album.coverImageUrl }] : [],
          artist_ids: [album.artistId]
        }));
        setArtistAlbums(formattedAlbums);
      })
      .catch(err => console.error('Failed to fetch artist albums:', err));

    // For now tracks are still empty
    setCurrentArtistTracks([]);
  }, [artistId]);

  const notFound = !artist && !isLoading;

  if (isLoading || !artist) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500" />
      </div>
    );
  }

  /* All artist tracks sorted by popularity descending */
  const artistTracks = currentArtistTracks.length > 0 ? currentArtistTracks : data.tracks
    .filter((track) => track.artist_ids.includes(artist.id))
    .sort((a, b) => b.popularity - a.popularity);

  const visibleTracks = showAll ? artistTracks : artistTracks.slice(0, 5);

  const discoveredOn = data.playlists
    .filter((playlist) =>
      playlist.track_ids.some((trackId) => artistTracks.some((track: any) => track.id === trackId)),
    )
    .slice(0, 4);

  const artistImage = artist.imageUrl || artist.picture || (artist.images && artist.images.length > 0 ? artist.images[0] : null);
  const genres = artist.genres ? artist.genres.slice(0, 3).join(' • ') : '';

  /* Helper: resolve album cover for a track */
  const getTrackCover = (track: Track) => {
    /* Try albums.json first (higher-quality covers) */
    const fromAlbumsJson = albumCoverFromAlbumsJson.get(track.id);
    if (fromAlbumsJson) return fromAlbumsJson;

    /* Fallback: spotify-data album images */
    const album = data.albums.find((a) => a.id === track.album_id);
    return album?.images[0]?.url ?? (artistImage?.url || '') ?? '';
  };

  /* Helper: resolve preview_url */
  const getPreviewUrl = (track: Track): string | undefined => {
    if (track.preview_url) return track.preview_url;
    return previewUrlMap.get(track.id) ?? undefined;
  };

  /* Build queue from all artist tracks (sorted by popularity) */
  const artistQueue = artistTracks.map((track: any) => ({
    id: track.id,
    title: track.name,
    artist: artist.name,
    cover: getTrackCover(track),
    src: getPreviewUrl(track),
    albumId: track.album_id,
  }));

  /* Handle track play */
  const handleTrackPlay = (track: Track) => {
    const previewUrl = getPreviewUrl(track);

    const isSameTrack = playbackSource === 'external' && storeTrack?.id === track.id;
    if (isSameTrack) {
      togglePlay();
      return;
    }

    setTrack({
      id: track.id,
      title: track.name,
      artist: artist.name,
      cover: getTrackCover(track),
      src: previewUrl,
      albumId: track.album_id,
    });
    setQueue(artistQueue);
    setPlaybackSource('external');
    setPlaybackContext({ type: 'artist', id: artist.id });
    setIsPlaying(true);
  };

  /* Is the artist currently playing globally */
  const isArtistPlaying =
    playbackSource === 'external' &&
    isPlaying &&
    artistTracks.some((track) => track.id === storeTrack?.id);

  const handleArtistPlay = () => {
    if (
      storeTrack &&
      artistTracks.some((track) => track.id === storeTrack.id) &&
      playbackSource === 'external'
    ) {
      togglePlay();
      return;
    }

    const firstTrack = artistTracks[0];
    if (firstTrack) {
      handleTrackPlay(firstTrack);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl bg-zinc-950">
      <header className="relative h-[340px] overflow-hidden bg-zinc-900">
        {artistImage ? (
          <img
            src={artistImage.url}
            alt={artist.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div
          className="relative flex h-full flex-col justify-end p-6 sm:p-8"
          style={{ containerType: 'inline-size' }}
        >
          <p className="text-sm font-semibold text-zinc-100/90">
            {t('artistDetail.verifiedArtist')}
          </p>
          <h1
            className="mt-1 font-black tracking-tight text-white"
            style={{
              fontSize: `clamp(1.5rem, ${140 / Math.max(artist.name.length, 1)}cqi, 6rem)`,
              lineHeight: 1.1,
            }}
          >
            {artist.name}
          </h1>
          <p className="mt-3 text-lg text-zinc-100/90">
            {t('artistDetail.monthlyListeners', {
              count: formatNumber(artist.monthly_listeners ?? 0, locale) as unknown as number,
            })}
          </p>
          <p className="mt-1 text-sm text-zinc-300">{genres || t('artistDetail.noGenres')}</p>
        </div>
      </header>

      <div className="bg-gradient-to-b from-rose-950/45 to-zinc-950 p-6">
        {notFound && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            {t('artistDetail.notFound')} <code>{artist.id}</code>.
          </div>
        )}

        {/* Action bar */}
        <div className="mb-7 flex items-center gap-4">
          <button
            type="button"
            onClick={handleArtistPlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-black transition hover:scale-105 hover:bg-emerald-400"
          >
            {isArtistPlaying ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
              </svg>
            )}
          </button>
          <button className="rounded-full border border-zinc-500 px-5 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-300">
            {t('artistDetail.following')}
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
            </svg>
          </button>
          <p className="ml-auto text-sm text-zinc-400">
            {t('artistDetail.followers', {
              count: formatNumber(artist.followers.total, locale) as unknown as number,
            })}
          </p>
        </div>

        {/* Popular tracks section */}
        <section>
          <h2 className="mb-3 text-4xl font-black">{t('artistDetail.popular')}</h2>

          {/* Track list header */}
          <div className="border-b border-white/5 pb-3 text-xs uppercase tracking-wide text-zinc-400">
            <div className="grid grid-cols-[32px_minmax(0,1.6fr)_96px_52px] gap-3 md:grid-cols-[40px_minmax(0,1.8fr)_160px_70px]">
              <span className="text-center">#</span>
              <span>{t('albumDetail.title')}</span>
              <span className="text-right">{t('albumDetail.plays')}</span>
              <span className="text-right">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-auto h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m1 5v5.4l3.2 1.9-1 1.7L11 13V7z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Track rows */}
          <div className="mt-2 space-y-1">
            {visibleTracks.length === 0 && (
              <p className="py-5 text-center text-sm text-zinc-400">{t('artistDetail.noTracks')}</p>
            )}
            {visibleTracks.map((track, index) => {
              const album = data.albums.find((a) => a.id === track.album_id);
              const isCurrentTrack = storeTrack?.id === track.id;
              const isTrackPlaying = isPlaying && isCurrentTrack;

              return (
                <div
                  key={track.id}
                  className="group grid grid-cols-[32px_minmax(0,1.6fr)_96px_52px] items-center gap-3 rounded-md px-2 py-2 text-zinc-200 transition hover:bg-zinc-800/60 md:grid-cols-[40px_minmax(0,1.8fr)_160px_70px]"
                >
                  {/* Track number / equalizer / play button */}
                  <div className="flex items-center justify-center text-zinc-400">
                    {isTrackPlaying ? (
                      <NowPlayingEqualizer className="group-hover:hidden h-4 w-4" />
                    ) : (
                      <span
                        className={`text-center group-hover:hidden ${isCurrentTrack ? 'text-emerald-500' : ''}`}
                      >
                        {index + 1}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleTrackPlay(track)}
                      className="hidden h-8 w-8 items-center justify-center rounded-full text-zinc-200 transition hover:text-white group-hover:inline-flex"
                      aria-label={isTrackPlaying ? `Pause ${track.name}` : `Play ${track.name}`}
                    >
                      {isTrackPlaying ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 fill-current"
                          aria-hidden="true"
                        >
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 fill-current"
                          aria-hidden="true"
                        >
                          <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Track info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Album cover thumbnail */}
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-800">
                      <img
                        src={getTrackCover(track)}
                        alt={track.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <Link
                        to={`/track/${track.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`truncate font-semibold hover:underline ${isCurrentTrack ? 'text-emerald-500' : 'text-zinc-100'}`}
                      >
                        {track.name}
                      </Link>
                      <p className="truncate text-sm text-zinc-400">
                        {formatDate(album?.release_date ?? '', locale)}
                      </p>
                    </div>
                  </div>

                  {/* Play count */}
                  <span className="truncate text-right text-sm text-zinc-400">
                    {formatNumber(900000 + track.popularity * 420000, locale)}
                  </span>

                  {/* Duration */}
                  <span className="text-right text-sm text-zinc-300">
                    {formatDuration(track.duration_ms)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Show more / Show less toggle */}
          {artistTracks.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-4 text-sm font-semibold text-zinc-300 transition hover:text-white"
            >
              {showAll ? t('common.actions.showLess') : t('common.actions.showAll')}
            </button>
          )}
        </section>

        {/* Discography */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-4xl font-black">{t('artistDetail.discography')}</h2>
            <button className="text-sm font-semibold text-zinc-300">
              {t('common.actions.showAll')}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artistAlbums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="rounded-xl bg-zinc-900/80 p-3 transition hover:bg-zinc-800/80"
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-md bg-zinc-800">
                  {album.images[0] ? (
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-zinc-600 to-zinc-900" />
                  )}
                </div>
                <h3 className="truncate text-xl font-semibold">{album.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {new Date(album.release_date).getFullYear()} • {album.album_type}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Discovered on */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-4xl font-black">{t('artistDetail.discoveredOn')}</h2>
            <button className="text-sm font-semibold text-zinc-300">
              {t('common.actions.showAll')}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {discoveredOn.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="rounded-xl bg-zinc-900/80 p-3 transition hover:bg-zinc-800/80"
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-md bg-zinc-800">
                  {playlist.images[0] ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-zinc-600 to-zinc-900" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">{playlist.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{playlist.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="text-3xl font-black">{t('artistDetail.about')}</h2>
          <p className="mt-3 text-zinc-300">
            {t('artistDetail.aboutText', { artistName: artist.name })}
            <code className="ml-1 rounded bg-zinc-800 px-1 py-0.5 text-xs">
              src/shared/data/spotify-data.json
            </code>
            .
          </p>
        </section>
      </div>
    </section>
  );
}

export default ArtistDetailView;
