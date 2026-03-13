import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import spotifyData from '@/shared/data';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';

// Types
type SpotifyImage = { url: string; height: number; width: number };
type Artist = { id: string; name: string; images: SpotifyImage[] };
type Album = {
  id: string;
  name: string;
  release_date: string;
  images: SpotifyImage[];
  artist_ids: string[];
};
type Track = {
  id: string;
  name: string;
  album_id: string;
  artist_ids: string[];
  track_number: number;
  duration_ms: number;
  popularity: number;
  preview_url?: string;
};
type Dataset = { artists: Artist[]; albums: Album[]; tracks: Track[] };

const data = spotifyData as Dataset;

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

type TrackDetailViewProps = {
  trackId?: string;
};

const mockLyrics = `Bak "bizden olmaz" demiştim ya sana
♪
Her şey üst üste gelince bıkar ya insan
Biraz beni anla
♪
Ne duygusuz, ne bencilim ben esasında
♪
Sen inanmayı seçmedin ki hiç
Bu kadına

Kapatıp ışıkları bir yere saklanıp
Hala kalbimdeki aman ateşi söndürüp
Bildiğim tüm doğruları bir gecede öldürüp gelmek isterdim, ah-ah-ah
Kaybetmeden kendini, öldürmeden hisleri
Bi' gün olacak gibi sakla, ilk gün ki seni`;

function TrackDetailView({ trackId }: TrackDetailViewProps) {
  const { t } = useTranslation();
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
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

  const selectedTrack = data.tracks.find((track) => track.id === trackId);
  const track = selectedTrack ?? data.tracks[0];
  const notFound = !selectedTrack;

  const album = data.albums.find((item) => item.id === track.album_id) ?? data.albums[0];
  const artist =
    data.artists.find((artist) => track.artist_ids.includes(artist.id)) ?? data.artists[0];

  const releaseYear = new Date(album.release_date).getFullYear();
  const popularityLabel = (track.popularity * 100000).toLocaleString();

  const handleTrackPlay = () => {
    if (!track.preview_url) return;

    const isSameTrack = playbackSource === 'external' && storeTrack?.id === track.id;
    if (isSameTrack) {
      togglePlay();
      return;
    }

    setTrack({
      id: track.id,
      title: track.name,
      artist: artist.name,
      cover: album.images[0]?.url ?? '',
      src: track.preview_url,
      albumId: album.id,
    });

    setQueue([
      {
        id: track.id,
        title: track.name,
        artist: artist.name,
        cover: album.images[0]?.url ?? '',
        src: track.preview_url,
        albumId: album.id,
      },
    ]);

    setPlaybackSource('external');
    setPlaybackContext({ type: 'none', id: '' });
    setIsPlaying(true);
  };

  const isTrackPlaying = playbackSource === 'external' && isPlaying && storeTrack?.id === track.id;

  return (
    <section className="overflow-hidden rounded-xl bg-zinc-950/80 min-h-full">
      <header className="bg-gradient-to-b from-[#3a3430] via-[#25201d] to-zinc-900/60 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="h-52 w-52 shrink-0 overflow-hidden shadow-2xl shadow-black/60 bg-zinc-800 rounded-md">
            {album.images[0] ? (
              <img
                src={album.images[0].url}
                alt={track.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-500 to-zinc-900" />
            )}
          </div>

          <div className="min-w-0 flex-1" style={{ containerType: 'inline-size' }}>
            <p className="text-sm font-semibold capitalize tracking-wide text-zinc-100/90">
              {t('trackDetail.song')}
            </p>
            <h1
              className="mt-2 font-black tracking-tight whitespace-nowrap"
              style={{
                fontSize: `clamp(1.5rem, ${140 / Math.max(track.name.length, 1)}cqi, 6rem)`,
                lineHeight: 1.1,
              }}
            >
              {track.name}
            </h1>
            <div
              className="mt-6 flex flex-wrap items-center text-zinc-100 mb-2"
              style={{
                fontSize: 'clamp(0.75rem, 4cqi, 0.875rem)',
                gap: 'clamp(0.25rem, 1.5cqi, 0.5rem)',
              }}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="h-6 w-6 overflow-hidden rounded-full bg-zinc-700 shrink-0">
                  {artist.images[0] ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-600" />
                  )}
                </div>
                <Link className="font-bold text-white hover:underline" to={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </div>
              <div
                className="flex items-center whitespace-nowrap"
                style={{ gap: 'clamp(0.25rem, 1.5cqi, 0.5rem)' }}
              >
                <span className="text-zinc-300">•</span>
                <Link
                  className="font-semibold text-white hover:underline"
                  to={`/album/${album.id}`}
                >
                  {album.name}
                </Link>
              </div>
              <div
                className="flex items-center whitespace-nowrap"
                style={{ gap: 'clamp(0.25rem, 1.5cqi, 0.5rem)' }}
              >
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-300 font-medium">{releaseYear}</span>
              </div>
              <div
                className="flex items-center whitespace-nowrap"
                style={{ gap: 'clamp(0.25rem, 1.5cqi, 0.5rem)' }}
              >
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-300 font-medium">
                  {formatDuration(track.duration_ms)}
                </span>
              </div>
              <div
                className="flex items-center whitespace-nowrap"
                style={{ gap: 'clamp(0.25rem, 1.5cqi, 0.5rem)' }}
              >
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-300 font-medium">{popularityLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 p-6 sm:p-8">
        {notFound && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            {t('trackDetail.notFound')} <code>{track.id}</code>.
          </div>
        )}

        <div className="mb-8 flex items-center gap-4 text-zinc-300">
          <button
            type="button"
            onClick={handleTrackPlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-black transition hover:scale-105 hover:bg-emerald-400"
          >
            {isTrackPlaying ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-7 w-7 ml-1 fill-current" aria-hidden="true">
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
              </svg>
            )}
          </button>

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
            className="inline-flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-white transition-opacity"
            aria-label={
              likedSongs.includes(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'
            }
          >
            {likedSongs.includes(track.id) ? (
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 fill-current text-emerald-400"
                aria-hidden="true"
              >
                <path d="M12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm-2.022 15.65-4.238-4.238 1.414-1.414 2.824 2.824 6.883-6.884 1.414 1.414-8.297 8.298z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-8 w-8 fill-current" aria-hidden="true">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
              </svg>
            )}
          </button>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:text-white ml-2">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
              <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
          </button>
        </div>

        <div className="max-w-2xl px-2">
          <h2 className="mb-6 text-2xl font-bold text-white">Lyrics</h2>
          <div
            className={`text-zinc-300 font-medium text-[1.1rem] leading-8 whitespace-pre-wrap transition-all duration-300 ${!isLyricsExpanded ? 'line-clamp-5' : ''}`}
          >
            {mockLyrics}
          </div>
          <div className="mt-6 mb-12">
            <button
              onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
              className="text-sm font-bold text-white hover:underline bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition"
            >
              {isLyricsExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>

          <Link
            to={`/artist/${artist.id}`}
            className="group flex items-center gap-4 rounded-xl hover:bg-zinc-800/40 p-4 transition-colors"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-800">
              {artist.images[0] ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-zinc-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white">Artist</p>
              <p className="mt-1 text-base font-bold text-white group-hover:underline">
                {artist.name}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TrackDetailView;
