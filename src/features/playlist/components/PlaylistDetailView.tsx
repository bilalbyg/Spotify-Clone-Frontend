import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, X, List, Plus } from 'lucide-react';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlayerStore } from '@/store/playerStore';
import { useToastStore } from '@/store/toastStore';
import { NowPlayingEqualizer } from '@/shared/components/NowPlayingEqualizer';
import spotifyData from '@/shared/data';

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  addedAt: string;
  duration: string;
  cover?: string;
  src?: string;
};

type PlaylistData = {
  id: string;
  title: string;
  owner: string;
  trackCount: number;
  durationLabel: string;
  year: string;
  description: string;
  palette: string;
  coverTiles: string[];
  tracks: Track[];
  trackIds?: string[];
  isCustom?: boolean;
};

const playlists: Record<string, PlaylistData> = {
  'liked-songs': {
    id: 'liked-songs',
    title: 'Liked Songs',
    owner: 'Emre Kaya',
    trackCount: 2,
    durationLabel: '6 min',
    year: '2025',
    description: 'All your favorite tracks in one place.',
    palette: 'from-violet-500/95 via-indigo-700/95 to-black',
    coverTiles: [
      'from-violet-400 to-indigo-700',
      'from-blue-300 to-cyan-700',
      'from-purple-400 to-fuchsia-700',
      'from-sky-300 to-blue-700',
    ],
    tracks: [],
    trackIds: ['d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091'],
  },
};

const fallbackPlaylist: PlaylistData = {
  id: 'default',
  title: 'Playlist',
  owner: 'User',
  trackCount: 0,
  durationLabel: '0 min',
  year: '2026',
  description: 'Playlist details will appear here.',
  palette: 'from-zinc-500/95 via-zinc-800/95 to-black',
  coverTiles: [
    'from-zinc-300 to-zinc-600',
    'from-zinc-400 to-zinc-700',
    'from-zinc-500 to-zinc-800',
    'from-zinc-300 to-zinc-900',
  ],
  tracks: [],
};

type PlaylistDetailViewProps = {
  playlistId?: string;
};

function resolveTrackInfo(id: string): Track {
  const originalTrack = spotifyData.tracks.find((t) => t.id === id);
  const album = spotifyData.albums.find((a) => a.id === originalTrack?.album_id);
  const artists =
    originalTrack?.artist_ids
      .map((aId) => spotifyData.artists.find((a) => a.id === aId)?.name)
      .join(', ') || '';

  if (!originalTrack) {
    return {
      id,
      title: 'Unknown Track',
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      addedAt: 'Just now',
      duration: '0:00',
    };
  }

  const durationDate = new Date(originalTrack.duration_ms);
  const durationStr = `${durationDate.getMinutes()}:${String(durationDate.getSeconds()).padStart(
    2,
    '0',
  )}`;

  return {
    id: originalTrack.id,
    title: originalTrack.name,
    artist: artists,
    album: album?.name || '',
    addedAt: 'Just now',
    duration: durationStr,
    cover: album?.images[0]?.url,
    src: originalTrack.preview_url || undefined,
  };
}

function PlaylistDetailView({ playlistId }: PlaylistDetailViewProps) {
  const { t } = useTranslation();
  const customPlaylists = useLibraryStore((state) => state.customPlaylists);
  const likedSongs = useLibraryStore((state) => state.likedSongs);
  const toggleLikedSong = useLibraryStore((state) => state.toggleLikedSong);
  const addTrackToPlaylist = useLibraryStore((state) => state.addTrackToPlaylist);
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
  const updatePlaylist = useLibraryStore((state) => state.updatePlaylist);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');

  const key = playlistId?.toLowerCase() ?? '';
  let selectedPlaylist = playlists[key];

  const spotifyDataPlaylist = spotifyData.playlists.find((p) => p.id === playlistId);

  if (!selectedPlaylist && spotifyDataPlaylist) {
    const owner = spotifyData.users.find((u) => u.id === spotifyDataPlaylist.owner_id);
    const resolvedTracks = spotifyDataPlaylist.track_ids.map(resolveTrackInfo);

    selectedPlaylist = {
      id: spotifyDataPlaylist.id,
      title: spotifyDataPlaylist.name,
      owner: owner?.display_name || 'Spotify',
      trackCount: resolvedTracks.length,
      durationLabel: `${Math.round(
        resolvedTracks.reduce((acc, t) => {
          const ms = spotifyData.tracks.find((x) => x.id === t.id)?.duration_ms || 213000;
          return acc + ms;
        }, 0) / 60000,
      )} min`,
      year: '2020',
      description: spotifyDataPlaylist.description || '',
      palette: 'from-[#8e291e] via-red-900 to-black', // Sample fallback style
      coverTiles: spotifyDataPlaylist.images.map((img) => img.url),
      tracks: resolvedTracks,
    };
  }

  if (
    selectedPlaylist &&
    (selectedPlaylist.trackIds || selectedPlaylist.id === 'liked-songs') &&
    selectedPlaylist.tracks.length === 0
  ) {
    // Populate the hardcoded playlist with actual resolved tracks dynamically
    const idsToResolve =
      selectedPlaylist.id === 'liked-songs' ? likedSongs : selectedPlaylist.trackIds || [];
    const resolved = idsToResolve.map(resolveTrackInfo);
    selectedPlaylist = {
      ...selectedPlaylist,
      tracks: resolved,
      trackCount: idsToResolve.length,
      durationLabel: `${idsToResolve.length * 3} min`,
    };
  }

  const customPlaylist = customPlaylists.find((p) => p.id === playlistId);

  if (customPlaylist) {
    const customTracks = customPlaylist.trackIds.map(resolveTrackInfo);
    selectedPlaylist = {
      id: customPlaylist.id,
      title: customPlaylist.name,
      owner: customPlaylist.owner,
      trackCount: customTracks.length,
      durationLabel: `${customTracks.length * 3} min`, // rough estimate
      year: new Date(customPlaylist.createdAt).getFullYear().toString(),
      description: customPlaylist.description || '',
      palette: 'from-zinc-700/80 via-zinc-900/90 to-black',
      coverTiles: [
        'from-zinc-600 to-zinc-800',
        'from-zinc-700 to-zinc-900',
        'from-zinc-800 to-black',
        'from-zinc-600 to-zinc-900',
      ],
      tracks: customTracks,
      isCustom: true,
    };
  }

  const playlist = selectedPlaylist ?? fallbackPlaylist;

  const playlistTitle = selectedPlaylist ? playlist.title : t('playlistDetail.fallbackTitle');
  const playlistOwner = selectedPlaylist ? playlist.owner : t('playlistDetail.fallbackOwner');
  const playlistDescription = selectedPlaylist
    ? playlist.description
    : t('playlistDetail.fallbackDescription');
  const playlistDuration = selectedPlaylist ? playlist.durationLabel : `0 ${t('albumDetail.min')}`;

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();

    return spotifyData.tracks
      .filter((t) => t.name.toLowerCase().includes(query))
      .filter((t) => !playlist.tracks.some((pt) => pt.id === t.id))
      .map((t) => resolveTrackInfo(t.id))
      .slice(0, 5);
  }, [searchTerm, playlist.tracks]);

  const playlistQueue = useMemo(() => {
    return playlist.tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover ?? playlist.coverTiles[0] ?? '',
      src: track.src,
      albumId: track.album, // Not completely accurate but acceptable
    }));
  }, [playlist.tracks, playlist.coverTiles]);

  const handleTrackPlay = (track: Track) => {
    const isSameTrack = playbackSource === 'external' && storeTrack?.id === track.id;
    if (isSameTrack) {
      togglePlay();
      return;
    }

    setTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover ?? playlist.coverTiles[0] ?? '',
      src: track.src,
      albumId: track.album,
    });
    setQueue(playlistQueue);
    setPlaybackSource('external');
    setPlaybackContext({ type: 'playlist', id: playlist.id });
    setIsPlaying(true);
  };

  const isPlaylistPlaying =
    playbackSource === 'external' &&
    isPlaying &&
    playlist.tracks.some((t) => t.id === storeTrack?.id);

  const handlePlaylistPlay = () => {
    if (
      storeTrack &&
      playlist.tracks.some((t) => t.id === storeTrack.id) &&
      playbackSource === 'external'
    ) {
      togglePlay();
      return;
    }

    const firstTrack = playlist.tracks[0];
    if (firstTrack) {
      handleTrackPlay(firstTrack);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl bg-zinc-950 min-h-full">
      <header className={`bg-gradient-to-b ${playlist.palette} p-6 sm:p-8`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          {(() => {
            const coverTracks = playlist.tracks.filter((t) => t.cover);
            const uniqueCovers = Array.from(new Set(coverTracks.map((t) => t.cover))).slice(0, 4);

            if (playlist.id === 'liked-songs') {
              return (
                <div className="flex h-52 w-52 shrink-0 items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-500 to-cyan-300 rounded-md shadow-2xl shadow-black/50 overflow-hidden">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 text-white fill-current">
                    <path d="M12 21c-.3 0-.6-.1-.9-.4C5.7 15.7 2 12.4 2 8.5 2 5.5 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.5 22 8.5c0 3.9-3.7 7.2-9.1 12.1-.3.3-.6.4-.9.4z" />
                  </svg>
                </div>
              );
            }

            /* Use track album covers for 2x2 grid (like real Spotify) */
            if (uniqueCovers.length >= 4) {
              return (
                <div className="grid h-52 w-52 shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-md shadow-2xl shadow-black/50 bg-zinc-800">
                  {uniqueCovers.map((cover, i) => (
                    <img key={i} src={cover} alt="Cover" className="h-full w-full object-cover" />
                  ))}
                </div>
              );
            }
            if (uniqueCovers.length > 0) {
              return (
                <div className="flex h-52 w-52 shrink-0 overflow-hidden rounded-md shadow-2xl shadow-black/50 bg-zinc-800">
                  <img src={uniqueCovers[0]} alt="Cover" className="h-full w-full object-cover" />
                </div>
              );
            }

            /* Fallback: playlist explicit images */
            if (playlist.coverTiles.length >= 4 && playlist.coverTiles[0]?.startsWith('http')) {
              return (
                <div className="grid h-52 w-52 shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-md shadow-2xl shadow-black/50 bg-zinc-800">
                  {playlist.coverTiles.slice(0, 4).map((cover, i) => (
                    <img key={i} src={cover} alt="Cover" className="h-full w-full object-cover" />
                  ))}
                </div>
              );
            }
            if (playlist.coverTiles.length > 0 && playlist.coverTiles[0]?.startsWith('http')) {
              return (
                <div className="flex h-52 w-52 shrink-0 overflow-hidden rounded-md shadow-2xl shadow-black/50 bg-zinc-800">
                  <img
                    src={playlist.coverTiles[0]}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            }

            /* Fallback: gradient tiles or music icon */
            if (playlist.coverTiles.length > 0 && !playlist.coverTiles[0]?.startsWith('http')) {
              return (
                <div className="grid h-52 w-52 shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-md shadow-2xl shadow-black/50">
                  {playlist.coverTiles.map((tile, index) => (
                    <div
                      key={`${playlist.id}-tile-${index}`}
                      className={`bg-gradient-to-br ${tile}`}
                    />
                  ))}
                </div>
              );
            }

            return (
              <div className="flex h-52 w-52 shrink-0 items-center justify-center bg-zinc-800 shadow-2xl shadow-black/50 overflow-hidden rounded-md">
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-zinc-500 fill-current">
                  <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                </svg>
              </div>
            );
          })()}

          <div className="min-w-0 flex-1" style={{ containerType: 'inline-size' }}>
            <p className="text-sm font-semibold capitalize tracking-wide text-zinc-100/90">
              {t('playlistDetail.publicPlaylist')}
            </p>
            {isEditingTitle && playlist.isCustom ? (
              <input
                autoFocus
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  if (
                    playlist.id &&
                    editableTitle.trim() &&
                    editableTitle.trim() !== playlistTitle
                  ) {
                    updatePlaylist(playlist.id, { name: editableTitle.trim() });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="mt-2 w-full bg-transparent font-black tracking-tight text-white outline-none"
                style={{ fontSize: 'clamp(1.5rem, 12cqi, 6rem)', lineHeight: 1.1 }}
              />
            ) : (
              <h1
                onClick={() => {
                  if (playlist.isCustom) {
                    setEditableTitle(playlistTitle);
                    setIsEditingTitle(true);
                  }
                }}
                className={`mt-2 font-black tracking-tight ${playlist.isCustom ? 'cursor-pointer hover:underline' : ''}`}
                style={{
                  fontSize: `clamp(1.5rem, ${140 / Math.max(playlistTitle.length, 1)}cqi, 6rem)`,
                  lineHeight: 1.1,
                }}
              >
                {playlistTitle}
              </h1>
            )}
            <p className="mt-4 text-sm font-medium text-zinc-100/90 sm:text-sm flex items-center gap-1.5">
              <span className="font-bold text-white hover:underline cursor-pointer">
                {playlistOwner}
              </span>
              {playlist.trackCount > 0 && <span className="text-[10px]">•</span>}
              {playlist.trackCount > 0 && (
                <span className="text-zinc-100">
                  {playlist.trackCount} {t('common.words.songs')},{' '}
                  <span className="text-zinc-400">over {playlistDuration}</span>
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-zinc-200/85">{playlistDescription}</p>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-black/20 to-zinc-950 p-6">
        <div className="mb-5 flex items-center justify-between text-zinc-300">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePlaylistPlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-black transition hover:scale-105 hover:bg-emerald-400"
            >
              {isPlaylistPlaying ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-7 w-7 ml-1 fill-current" aria-hidden="true">
                  <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                </svg>
              )}
            </button>
            {playlist.isCustom && (
              <button className="inline-flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-white rounded-full transition">
                <Plus className="h-8 w-8" />
              </button>
            )}
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:text-white">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm font-semibold text-zinc-400 hover:text-white flex items-center gap-2">
              List
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {playlist.tracks.length > 0 && (
          <div className="rounded-xl bg-transparent mt-8">
            <div className="mb-2 grid grid-cols-[40px_minmax(0,1.6fr)_minmax(0,1fr)_32px_52px] md:grid-cols-[40px_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_32px_52px] gap-4 border-b border-zinc-800 pb-3 text-sm text-zinc-400 px-2">
              <span className="text-center">#</span>
              <span>{t('playlistDetail.title')}</span>
              <span>{t('playlistDetail.album')}</span>
              <span className="hidden md:block">{t('playlistDetail.dateAdded')}</span>
              <span></span>
              <span className="text-right flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 17a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h-3v-1h4v6h-1v-5z"></path>
                </svg>
              </span>
            </div>

            <div className="space-y-1 mt-4">
              {playlist.tracks.map((track, index) => {
                const isCurrentTrack = storeTrack?.id === track.id;
                const isTrackPlaying = isPlaying && isCurrentTrack;

                return (
                  <div
                    key={track.id}
                    className="group grid grid-cols-[40px_minmax(0,1.6fr)_minmax(0,1fr)_32px_52px] md:grid-cols-[40px_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_32px_52px] gap-4 items-center rounded-md px-2 py-2 text-zinc-200 transition hover:bg-zinc-800/60"
                  >
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
                        aria-label={isTrackPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
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
                      {track.cover && (
                        <div className="w-10 h-10 flex-shrink-0 bg-zinc-800 rounded overflow-hidden">
                          <img
                            src={track.cover}
                            alt="cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex flex-col justify-center">
                        <Link
                          to={`/track/${track.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`truncate font-medium hover:underline cursor-pointer ${isCurrentTrack ? 'text-emerald-500' : 'text-white'}`}
                        >
                          {track.title}
                        </Link>
                        <p className="truncate text-sm text-zinc-400 hover:text-white hover:underline cursor-pointer">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <p className="truncate text-sm text-zinc-400 hover:text-white hover:underline cursor-pointer">
                      {track.album}
                    </p>
                    <p className="hidden md:block truncate text-sm text-zinc-400">
                      {track.addedAt}
                    </p>

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

                    <p className="text-right text-sm text-zinc-400">{track.duration}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {playlist.isCustom && showSearch && (
          <div className="mt-8 pt-8 border-t border-zinc-800/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Let's find something for your playlist
              </h2>
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative mb-6">
              <Search className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for songs or episodes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-800/60 text-white pl-10 pr-4 py-2.5 rounded-md w-full max-w-sm text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:bg-zinc-800 transition"
              />
            </div>

            {searchTerm && (
              <div className="space-y-1">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="group flex items-center justify-between p-2 hover:bg-zinc-800/60 rounded-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                        {track.cover && (
                          <img src={track.cover} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/track/${track.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-white text-sm font-medium hover:underline cursor-pointer"
                        >
                          {track.title}
                        </Link>
                        <p className="text-zinc-400 text-sm hover:text-white hover:underline cursor-pointer">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (playlist.id) addTrackToPlaylist(playlist.id, track.id);
                        setSearchTerm('');
                      }}
                      className="px-4 py-1.5 text-xs font-bold border border-zinc-500 rounded-full hover:border-white hover:scale-105 transition text-white"
                    >
                      Add
                    </button>
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div className="text-center text-zinc-400 py-8">
                    No results found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PlaylistDetailView;
