/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';
import { useAuthStore } from '@/store/useAuthStore';
import { NowPlayingEqualizer } from '@/shared/components/NowPlayingEqualizer';
import { resolveLocale } from '@/helpers/i18n';

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

type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

type User = {
  id: string;
  display_name: string;
  country: string;
  product: string;
  followers: {
    href: string | null;
    total: number;
  };
  images: SpotifyImage[];
};

type Artist = {
  id: string;
  name: string;
  popularity: number;
  images: SpotifyImage[];
};

type Playlist = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  public: boolean;
  images: SpotifyImage[];
  track_ids: string[];
};

type Track = {
  id: string;
  name: string;
  album_id: string;
  artist_ids: string[];
  popularity: number;
  preview_url?: string | null;
  duration_ms?: number;
};

type Album = {
  id: string;
  name: string;
  images: SpotifyImage[];
};

type Dataset = {
  users: User[];
  artists: Artist[];
  playlists: Playlist[];
  tracks: Track[];
  albums: Album[];
};

const data = spotifyData as Dataset;

const monthlyTopArtistIdsByUser: Record<string, string[]> = {
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d': ['b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e'],
  'f7e6d5c4-b3a2-4918-8071-6253f4d5e6a7': ['b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e'],
};

const followingByUser: Record<string, number> = {
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d': 33,
  'f7e6d5c4-b3a2-4918-8071-6253f4d5e6a7': 41,
};

const formatNumber = (value: number, locale: string) => new Intl.NumberFormat(locale).format(value);

const formatTrackDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

type ProfileDetailViewProps = {
  userId?: string;
};

function ProfileDetailView({ userId }: ProfileDetailViewProps) {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);

  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const likedSongs = useLibraryStore((state) => state.likedSongs);
  const toggleLikedSong = useLibraryStore((state) => state.toggleLikedSong);
  const addToast = useToastStore((state) => state.addToast);

  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playbackContext = usePlayerStore((state) => state.playbackContext);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setPlaybackSource = usePlayerStore((state) => state.setPlaybackSource);
  const setPlaybackContext = usePlayerStore((state) => state.setPlaybackContext);

  const authUser = useAuthStore((state) => state.user);

  // We are viewing the logged in user if userId is 'me', their id, or we fallback if userId is undefined
  const isMe = !userId || userId === 'me' || userId === authUser?.id;

  const selectedUser = isMe
    ? {
        id: authUser?.id || 'me',
        display_name: authUser?.name || authUser?.username || authUser?.email || 'User',
        country: 'TR',
        product: '',
        followers: { href: null, total: 0 },
        images: [],
      }
    : data.users.find((user) => user.id === userId);

  const user = selectedUser ?? data.users[0];
  const notFound = !selectedUser;

  // If "isMe", we don't use placeholder data for the logged-in user profile, per user request.
  const userPublicPlaylists = isMe
    ? []
    : data.playlists.filter((playlist) => playlist.owner_id === user.id && playlist.public);

  const preferredArtists = isMe
    ? []
    : (monthlyTopArtistIdsByUser[user.id] ?? [])
        .map((artistId) => data.artists.find((artist) => artist.id === artistId))
        .filter((artist): artist is Artist => Boolean(artist));

  const fallbackArtists = isMe
    ? []
    : data.artists.slice().sort((a, b) => b.popularity - a.popularity);
  const topArtists = isMe
    ? []
    : [...preferredArtists, ...fallbackArtists]
        .filter(
          (artist, index, list) => list.findIndex((entry) => entry.id === artist.id) === index,
        )
        .slice(0, 4);

  const topTracks = isMe
    ? []
    : data.tracks
        .filter((track) => topArtists.some((artist) => track.artist_ids.includes(artist.id)))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4);

  if (!isMe && topTracks.length === 0) {
    topTracks.push(...data.tracks.sort((a, b) => b.popularity - a.popularity).slice(0, 4));
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderStuck(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const followersText = t(
    user.followers.total === 1 ? 'profileDetail.followers_one' : 'profileDetail.followers_other',
    { count: formatNumber(user.followers.total, locale) as unknown as number },
  );
  const followingText = t('profileDetail.following', {
    count: formatNumber(isMe ? 0 : (followingByUser[user.id] ?? 0), locale) as unknown as number,
  });

  const handleArtistPlay = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentContext = playbackContext.type === 'artist' && playbackContext.id === artist.id;
    if (isCurrentContext) {
      togglePlay();
      return;
    }

    const artistTracks = data.tracks
      .filter((t) => t.artist_ids.includes(artist.id))
      .sort((a, b) => b.popularity - a.popularity);

    if (artistTracks.length === 0) return;

    const artistQueue = artistTracks.map((track) => {
      const album = data.albums.find((a) => a.id === track.album_id);
      return {
        id: track.id,
        title: track.name,
        artist: artist.name,
        cover: album?.images[0]?.url ?? artist.images[0]?.url ?? '',
        src: track.preview_url ?? undefined,
        albumId: track.album_id,
      };
    });

    const firstTrack = artistQueue[0];
    setTrack(firstTrack);
    setQueue(artistQueue);
    setPlaybackSource('external');
    setPlaybackContext({ type: 'artist', id: artist.id });
    setIsPlaying(true);
  };

  const storeTrack = usePlayerStore((state) => state.currentTrack);

  const handleTrackPlay = (track: Track) => {
    if (!track.preview_url) return;

    const isSameTrack =
      playbackContext.type === 'profile-top-tracks' && storeTrack?.id === track.id;
    if (isSameTrack) {
      togglePlay();
      return;
    }

    const queue = topTracks.map((t) => {
      const album = data.albums.find((a) => a.id === t.album_id);
      return {
        id: t.id,
        title: t.name,
        artist: t.artist_ids
          .map((id) => data.artists.find((a) => a.id === id)?.name)
          .filter(Boolean)
          .join(', '),
        cover: album?.images[0]?.url ?? '',
        src: t.preview_url ?? undefined,
        albumId: t.album_id,
      };
    });

    const album = data.albums.find((a) => a.id === track.album_id);

    setTrack({
      id: track.id,
      title: track.name,
      artist: track.artist_ids
        .map((id) => data.artists.find((a) => a.id === id)?.name)
        .filter(Boolean)
        .join(', '),
      cover: album?.images[0]?.url ?? '',
      src: track.preview_url,
      albumId: track.album_id,
    });
    setQueue(queue);
    setPlaybackSource('external');
    setPlaybackContext({ type: 'profile-top-tracks', id: user.id });
    setIsPlaying(true);
  };

  const handlePlaylistPlay = (e: React.MouseEvent, playlist: Playlist) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentContext =
      playbackContext.type === 'playlist' && playbackContext.id === playlist.id;
    if (isCurrentContext) {
      togglePlay();
      return;
    }

    const playlistTracks = playlist.track_ids
      .map((id) => data.tracks.find((t) => t.id === id))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);

    if (playlistTracks.length === 0) return;

    const playlistQueue = playlistTracks.map((track) => {
      const album = data.albums.find((a) => a.id === track.album_id);
      const artists = track.artist_ids
        .map((id) => data.artists.find((a) => a.id === id)?.name)
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

    const firstTrack = playlistQueue[0];
    setTrack(firstTrack);
    setQueue(playlistQueue);
    setPlaybackSource('external');
    setPlaybackContext({ type: 'playlist', id: playlist.id });
    setIsPlaying(true);
  };

  return (
    <section className="relative rounded-xl bg-zinc-950 pb-8">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-50 flex h-16 items-center bg-zinc-800 px-6 shadow-md transition-opacity duration-300 rounded-t-xl ${isHeaderStuck ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <h1 className="text-2xl font-bold text-white tracking-tight">{user.display_name}</h1>
      </div>

      <header
        ref={headerRef}
        className="relative -mt-16 pt-24 pb-6 px-6 sm:px-8 bg-gradient-to-b from-zinc-500/95 via-zinc-700/90 to-zinc-900 rounded-t-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35 rounded-t-xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="h-44 w-44 shrink-0 overflow-hidden rounded-full bg-zinc-800 shadow-2xl shadow-black/40">
            {user.images[0] ? (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-500 to-zinc-800" />
            )}
          </div>

          <div
            className="min-w-0 flex-1 flex flex-col justify-end"
            style={{ containerType: 'inline-size' }}
          >
            <span className="text-sm border-white font-medium text-zinc-200">
              {t('profileDetail.profile')}
            </span>
            <h1
              className="mt-2 font-black tracking-tight text-white"
              style={{
                fontSize: `clamp(1.5rem, ${140 / Math.max(user.display_name.length, 1)}cqi, 6rem)`,
                lineHeight: 1.1,
              }}
            >
              {user.display_name}
            </h1>
            {isMe && authUser?.username && (
              <p className="mt-1 text-xl font-medium text-zinc-300">@{authUser.username}</p>
            )}
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-zinc-300">
              <span className="text-zinc-100">
                {t('profileDetail.publicPlaylistsCount', {
                  count: formatNumber(userPublicPlaylists.length, locale) as unknown as number,
                })}
              </span>
              <span className="text-[10px]">•</span>
              <span className="text-zinc-100">{followersText}</span>
              <span className="text-[10px]">•</span>
              <span className="text-zinc-100">{followingText}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6">
        {notFound && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            {t('profileDetail.notFound')} <code>{user.id}</code>.
          </div>
        )}

        <div className="mb-8 mt-6 flex items-center gap-6 text-zinc-400">
          <Link
            to="/preferences"
            className="hover:text-white transition"
            aria-label={t('profileDetail.settings')}
          >
            <Settings className="w-8 h-8" />
          </Link>
          <button className="pb-3 text-3xl font-bold tracking-widest leading-none hover:text-white transition">
            ...
          </button>
        </div>

        {topArtists.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {t('profileDetail.topArtistsThisMonth')}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">{t('profileDetail.onlyVisibleToYou')}</p>
              </div>
              <button className="text-sm font-semibold text-zinc-400 hover:text-white transition">
                {t('common.actions.showAll')}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {topArtists.map((artist) => {
                const isActive =
                  playbackContext.type === 'artist' && playbackContext.id === artist.id;
                const isCardPlaying = isActive && isPlaying;

                return (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.id}`}
                    className="group rounded-lg p-4 transition hover:bg-zinc-800/40"
                  >
                    <div className="relative mb-3 aspect-square">
                      <div className="h-full w-full overflow-hidden rounded-full bg-zinc-800 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                        {artist.images[0] ? (
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-zinc-500 to-zinc-800" />
                        )}
                      </div>

                      <div
                        className={`group/playBtn absolute z-20 bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-300 ${isActive ? 'translate-y-0 opacity-100' : 'group-hover:translate-y-0 group-hover:opacity-100'}`}
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#282828] px-2.5 py-1 text-[13px] font-bold text-white opacity-0 shadow-lg shadow-black/50 transition-opacity duration-200 group-hover/playBtn:opacity-100">
                          {isCardPlaying ? `Pause ${artist.name}` : `Play ${artist.name}`}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleArtistPlay(e, artist)}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg shadow-black/40 transition hover:scale-105 hover:bg-emerald-400"
                        >
                          {isCardPlaying ? (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6 fill-current"
                              aria-hidden="true"
                            >
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6 fill-current"
                              aria-hidden="true"
                            >
                              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="truncate mt-2 text-base font-bold text-zinc-100">{artist.name}</p>
                    <p className="text-sm text-zinc-400">{t('profileDetail.artist')}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {topTracks.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Top tracks this month
                </h2>
                <p className="mt-1 text-sm text-zinc-400">{t('profileDetail.onlyVisibleToYou')}</p>
              </div>
              <button className="text-sm font-semibold text-zinc-400 hover:text-white transition">
                {t('common.actions.showAll')}
              </button>
            </div>

            <div className="space-y-1">
              {topTracks.map((track, index) => {
                const album = data.albums.find((a) => a.id === track.album_id);
                const artists = track.artist_ids
                  .map((id) => data.artists.find((a) => a.id === id)?.name)
                  .filter(Boolean)
                  .join(', ');
                const isTrackPlaying = isPlaying && storeTrack?.id === track.id;

                return (
                  <div
                    key={track.id}
                    className="group grid grid-cols-[32px_minmax(0,1.8fr)_minmax(0,1fr)_32px_52px] gap-3 rounded-md px-2 py-2 text-zinc-200 transition hover:bg-zinc-800/60 items-center md:grid-cols-[40px_minmax(0,2fr)_minmax(0,1.5fr)_40px_70px]"
                  >
                    <div className="flex items-center justify-center text-zinc-400">
                      {isTrackPlaying ? (
                        <NowPlayingEqualizer className="group-hover:hidden h-4 w-4" />
                      ) : (
                        <span
                          className={`text-center group-hover:hidden ${storeTrack?.id === track.id ? 'text-emerald-500' : ''}`}
                        >
                          {index + 1}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTrackPlay(track)}
                        className="hidden h-8 w-8 items-center justify-center rounded-full text-zinc-200 transition hover:text-white group-hover:inline-flex"
                        aria-label={`Play ${track.name}`}
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

                    <div className="flex items-center gap-3 min-w-0">
                      {album?.images[0] && (
                        <img
                          src={album.images[0].url}
                          alt={album.name}
                          className="h-10 w-10 shrink-0 rounded object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0 flex flex-col justify-center">
                        <Link
                          to={`/track/${track.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`truncate font-medium hover:underline ${storeTrack?.id === track.id ? 'text-emerald-500' : 'text-white'}`}
                        >
                          {track.name}
                        </Link>
                        <p className="truncate text-sm text-zinc-400">{artists}</p>
                      </div>
                    </div>

                    <p className="truncate text-sm text-zinc-400">{album?.name}</p>

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
                        likedSongs.includes(track.id)
                          ? 'Remove from Liked Songs'
                          : 'Save to Liked Songs'
                      }
                    >
                      {likedSongs.includes(track.id) ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-[18px] w-[18px] fill-current text-emerald-400"
                          aria-hidden="true"
                        >
                          <path d="M12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm-2.022 15.65-4.238-4.238 1.414-1.414 2.824 2.824 6.883-6.884 1.414 1.414-8.297 8.298z" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 16 16"
                          className="h-[18px] w-[18px] fill-current"
                          aria-hidden="true"
                        >
                          <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                          <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
                        </svg>
                      )}
                    </button>

                    <p className="text-right text-zinc-300">
                      {formatTrackDuration(track.duration_ms || 213000)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {userPublicPlaylists.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {t('profileDetail.publicPlaylists')}
              </h2>
              <button className="text-sm font-semibold text-zinc-400 hover:text-white transition">
                {t('common.actions.showAll')}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {userPublicPlaylists.map((playlist) => {
                const isActive =
                  playbackContext.type === 'playlist' && playbackContext.id === playlist.id;
                const isCardPlaying = isActive && isPlaying;

                return (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="group rounded-lg p-4 transition hover:bg-zinc-800/40"
                  >
                    <div className="relative mb-3 aspect-square">
                      <div className="h-full w-full overflow-hidden rounded-md bg-zinc-800 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                        {playlist.images.length >= 4 ? (
                          <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                            {playlist.images.slice(0, 4).map((img, i) => (
                              <img
                                key={i}
                                src={img.url}
                                className="h-full w-full object-cover"
                                alt=""
                              />
                            ))}
                          </div>
                        ) : playlist.images[0] ? (
                          <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-[60px] w-[60px] fill-current text-[#7f7f7f]"
                              aria-hidden="true"
                            >
                              <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                            </svg>
                          </div>
                        )}
                      </div>

                      <div
                        className={`group/playBtn absolute z-20 bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-300 ${isActive ? 'translate-y-0 opacity-100' : 'group-hover:translate-y-0 group-hover:opacity-100'}`}
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#282828] px-2.5 py-1 text-[13px] font-bold text-white opacity-0 shadow-lg shadow-black/50 transition-opacity duration-200 group-hover/playBtn:opacity-100">
                          {isCardPlaying ? `Pause ${playlist.name}` : `Play ${playlist.name}`}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handlePlaylistPlay(e, playlist)}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg shadow-black/40 transition hover:scale-105 hover:bg-emerald-400"
                        >
                          {isCardPlaying ? (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6 fill-current"
                              aria-hidden="true"
                            >
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6 fill-current"
                              aria-hidden="true"
                            >
                              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="truncate mt-2 text-base font-bold text-zinc-100">
                      {playlist.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      By {user.display_name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {!isMe && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {t('profileDetail.followers') || 'Followers'}
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.users
                .filter((u) => u.id !== user.id)
                .slice(0, 4)
                .map((follower) => (
                  <Link
                    key={follower.id}
                    to={`/user/${follower.id}`}
                    className="group rounded-lg p-4 transition hover:bg-zinc-800/40"
                  >
                    <div className="relative mb-3 aspect-square">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                        {follower.images?.[0] ? (
                          <img
                            src={follower.images[0].url}
                            alt={follower.display_name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-[80px] w-[80px] fill-current text-[#7f7f7f]"
                            aria-hidden="true"
                          >
                            <path d="M12.5 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 7.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z"></path>
                            <path d="M12.5 14h-3A5.5 5.5 0 0 0 4 19.5V20h17v-.5A5.5 5.5 0 0 0 15.5 14h-3zM6.02 18a3.5 3.5 0 0 1 3.48-3h6a3.5 3.5 0 0 1 3.48 3H6.02z"></path>
                          </svg>
                        )}
                      </div>
                    </div>

                    <p className="truncate mt-2 text-base font-bold text-zinc-100">
                      {follower.display_name}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {t('profileDetail.profile') || 'Profile'}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default ProfileDetailView;
