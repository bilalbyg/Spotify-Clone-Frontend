/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ListMusic,
  Maximize2,
  Mic2,
  Minimize2,
  MonitorSpeaker,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';
import './PlayerBar.css';

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

type PlayerTrack = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  animatedCover?: string;
  src: string;
  lyrics: string[];
};

type QueueTrack = PlayerTrack & {
  queuePosition: number;
};

const sampleQueue: PlayerTrack[] = [
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80',
    title: 'Fading Signals',
    artist: 'Nova Echoes',
    cover: 'https://picsum.photos/seed/album-midnight-640/1400/1400',
    animatedCover: '/track-visual-1.gif',
    src: '/audio/d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80.mp3',
    lyrics: [
      'Shadows on the wall, we keep the rhythm low.',
      'Every beat is a memory, every pause is glow.',
      'Fading signals in the midnight sky.',
    ],
  },
  {
    id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091',
    title: 'Neon Dusk',
    artist: 'Nova Echoes',
    cover: 'https://picsum.photos/seed/album-midnight-300/1400/1400',
    animatedCover: '/track-visual-2.gif',
    src: '/audio/e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091.mp3',
    lyrics: [
      'Hold the line and take a breath.',
      'Drop the noise and move with depth.',
      'Neon lights at dusk, we chase the glow.',
    ],
  },
  {
    id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f809102',
    title: 'Velvet Horizon',
    artist: 'Nova Echoes',
    cover: 'https://picsum.photos/seed/album-midnight-64/1400/1400',
    src: '/audio/f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f809102.mp3',
    lyrics: [
      'One more round, one more tone.',
      'Play it back until we are home.',
      'The velvet horizon waits for us all.',
    ],
  },
  {
    id: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f80910213',
    title: 'Ghost Frequencies',
    artist: 'Nova Echoes',
    cover: 'https://picsum.photos/seed/player-ghost-freq/1400/1400',
    src: '/audio/a7b8c9d0-e1f2-4a3b-4c5d-6e7f80910213.mp3',
    lyrics: [
      'Echoes ripple through the static air.',
      'Ghost frequencies, they are everywhere.',
      'Tune in closer, feel the sound.',
    ],
  },
  {
    id: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8091021324',
    title: 'Amber Waves',
    artist: 'Nova Echoes',
    cover: 'https://picsum.photos/seed/player-amber-waves/1400/1400',
    src: '/audio/b8c9d0e1-f2a3-4b4c-5d6e-7f8091021324.mp3',
    lyrics: [
      'Golden fields stretch to the edge.',
      'Amber waves against the sky.',
      'We drift along the endless line.',
    ],
  },
];

const deviceOptions = ['browser', 'livingRoom', 'bluetooth'] as const;
const MIN_QUEUE_BUFFER = Math.max(0, sampleQueue.length - 1);
const MAX_HISTORY_ITEMS = 30;

type RepeatMode = 'off' | 'all' | 'one';

const formatTime = (timeInSeconds: number) => {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(timeInSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const createRandomOrder = (length: number, firstIndex?: number) => {
  const order = Array.from({ length }, (_, index) => index);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[randomIndex]] = [order[randomIndex], order[index]];
  }

  if (typeof firstIndex === 'number') {
    const firstPosition = order.indexOf(firstIndex);
    if (firstPosition > 0) {
      [order[0], order[firstPosition]] = [order[firstPosition], order[0]];
    }
  }

  return order;
};

const pickRandomIndex = (indexes: number[]) => indexes[Math.floor(Math.random() * indexes.length)];

const getNextQueueTrackIndex = (currentIndex: number, upcomingIndexes: number[]) => {
  const allIndexes = sampleQueue.map((_, index) => index);
  const usedIndexes = new Set<number>([currentIndex, ...upcomingIndexes]);
  const uniqueCandidates = allIndexes.filter((index) => !usedIndexes.has(index));

  if (uniqueCandidates.length > 0) {
    return pickRandomIndex(uniqueCandidates);
  }

  const nonCurrentCandidates = allIndexes.filter((index) => index !== currentIndex);
  if (nonCurrentCandidates.length > 0) {
    return pickRandomIndex(nonCurrentCandidates);
  }

  return currentIndex;
};

function PlayerBar() {
  const { t } = useTranslation();
  const setPlaybackSnapshot = usePlayerStore((state) => state.setPlaybackSnapshot);
  const playbackSource = usePlayerStore((state) => state.playbackSource);
  const storeTrack = usePlayerStore((state) => state.currentTrack);
  const setPlaybackSource = usePlayerStore((state) => state.setPlaybackSource);
  const setStoreVolume = usePlayerStore((state) => state.setVolume);
  const setStoreProgress = usePlayerStore((state) => state.setProgress);
  const playNextInQueue = usePlayerStore((state) => state.playNextInQueue);
  const playPreviousInQueue = usePlayerStore((state) => state.playPreviousInQueue);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const previousVolumeRef = useRef(0.8);

  const [playOrder, setPlayOrder] = useState<number[]>(() => createRandomOrder(sampleQueue.length));
  const [orderPosition, setOrderPosition] = useState(0);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const isShuffle = usePlayerStore((state) => state.shuffle);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const storeVolume = usePlayerStore((state) => state.volume);
  const [volume, setVolume] = useState(storeVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [activeDevice, setActiveDevice] = useState<(typeof deviceOptions)[number]>(
    deviceOptions[0],
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const trackIndex = playOrder[orderPosition] ?? 0;
  const currentTrack = useMemo(() => sampleQueue[trackIndex] ?? sampleQueue[0], [trackIndex]);
  const displayTrack =
    playbackSource === 'external' && storeTrack ? { ...currentTrack, ...storeTrack } : currentTrack;

  const likedSongs = useLibraryStore((state) => state.likedSongs);
  const toggleLikedSong = useLibraryStore((state) => state.toggleLikedSong);
  const addToast = useToastStore((state) => state.addToast);

  const isCurrentTrackSaved = likedSongs.includes(displayTrack.id);
  const isRepeatEnabled = repeatMode !== 'off';
  const queueIndexes = useMemo(
    () => playOrder.slice(orderPosition + 1),
    [playOrder, orderPosition],
  );

  const queueItems = useMemo(
    () =>
      queueIndexes
        .map((index, queueOffset) => {
          const item = sampleQueue[index];
          if (!item) {
            return null;
          }

          return {
            ...item,
            queuePosition: orderPosition + queueOffset + 1,
          };
        })
        .filter((item): item is QueueTrack => item !== null),
    [queueIndexes, orderPosition],
  );

  useEffect(() => {
    if (sampleQueue.length === 0) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayOrder((previousOrder) => {
      const queueCount = previousOrder.length - (orderPosition + 1);
      if (queueCount >= MIN_QUEUE_BUFFER) {
        return previousOrder;
      }

      const itemsToAppend = MIN_QUEUE_BUFFER - queueCount;
      const nextOrder = [...previousOrder];
      const upcomingIndexes = [...previousOrder.slice(orderPosition + 1)];

      for (let index = 0; index < itemsToAppend; index += 1) {
        const nextIndex = getNextQueueTrackIndex(trackIndex, upcomingIndexes);
        nextOrder.push(nextIndex);
        upcomingIndexes.push(nextIndex);
      }

      return nextOrder;
    });
  }, [orderPosition, trackIndex]);

  useEffect(() => {
    if (orderPosition <= MAX_HISTORY_ITEMS) {
      return;
    }

    const trimCount = orderPosition - MAX_HISTORY_ITEMS;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayOrder((previousOrder) => previousOrder.slice(trimCount));
    setOrderPosition(MAX_HISTORY_ITEMS);
  }, [orderPosition]);

  const goToOrderPosition = (nextPosition: number, autoPlay = isPlaying) => {
    if (playOrder.length === 0) {
      return;
    }

    const boundedPosition = Math.max(0, Math.min(nextPosition, playOrder.length - 1));
    setOrderPosition(boundedPosition);
    setCurrentTime(0);
    setDuration(0);

    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  const appendRandomTrackAndMove = (autoPlay = true) => {
    if (sampleQueue.length === 0) {
      return;
    }

    setPlayOrder((previousOrder) => {
      const nextOrder = [...previousOrder];
      const upcomingIndexes = previousOrder.slice(orderPosition + 1);
      const nextIndex = getNextQueueTrackIndex(trackIndex, upcomingIndexes);
      nextOrder.push(nextIndex);
      return nextOrder;
    });

    setOrderPosition((previousPosition) => previousPosition + 1);
    setCurrentTime(0);
    setDuration(0);

    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  const handlePlayNext = () => {
    if (playbackSource === 'external') {
      playNextInQueue();
      return;
    }

    setPlaybackSource('player');
    const nextQueueTrack = queueItems[0];
    if (nextQueueTrack) {
      goToOrderPosition(nextQueueTrack.queuePosition, true);
      return;
    }

    appendRandomTrackAndMove(true);
  };

  const handlePlayPrevious = () => {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (playbackSource === 'external') {
      const moved = playPreviousInQueue();
      if (!moved && audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }

    setPlaybackSource('player');
    goToOrderPosition(orderPosition - 1, true);
  };

  const handlePlayPauseToggle = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const handleAudioEnded = () => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      audio.currentTime = 0;
      void audio.play();
      return;
    }

    if (playbackSource === 'external') {
      playNextInQueue();
      return;
    }

    const nextQueueTrack = queueItems[0];
    if (nextQueueTrack) {
      goToOrderPosition(nextQueueTrack.queuePosition, true);
      return;
    }

    appendRandomTrackAndMove(true);
  };

  const handleRepeatToggle = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') {
        return 'all';
      }

      if (prev === 'all') {
        return 'one';
      }

      return 'off';
    });
  };

  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    setVolume(value);
    audio.volume = value;

    const nextMuted = value <= 0;
    setIsMuted(nextMuted);
    audio.muted = nextMuted;

    if (!nextMuted) {
      previousVolumeRef.current = value;
    }
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.muted || volume <= 0) {
      const restoredVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.8;
      audio.muted = false;
      audio.volume = restoredVolume;
      setVolume(restoredVolume);
      setIsMuted(false);
      return;
    }

    previousVolumeRef.current = volume;
    audio.muted = true;
    setIsMuted(true);
  };

  const handleFullscreenToggle = async () => {
    if (typeof document === 'undefined') {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !displayTrack.src) {
      return;
    }

    if (audio.src.endsWith(displayTrack.src) || audio.src === displayTrack.src) {
      return;
    }

    audio.src = displayTrack.src;
    audio.load();
    audio.currentTime = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
    setDuration(0);
  }, [displayTrack.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [isPlaying, displayTrack.id, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.title = `${displayTrack.title} • ${displayTrack.artist} - Spotify`;
  }, [displayTrack.artist, displayTrack.title]);

  useEffect(() => {
    if (!isQueueOpen && !isLyricsOpen && !isDeviceMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;

      if (rootRef.current && !rootRef.current.contains(target)) {
        setIsQueueOpen(false);
        setIsLyricsOpen(false);
        setIsDeviceMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQueueOpen(false);
        setIsLyricsOpen(false);
        setIsDeviceMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isQueueOpen, isLyricsOpen, isDeviceMenuOpen]);

  useEffect(() => {
    if (playbackSource === 'external') {
      return;
    }

    setPlaybackSnapshot({
      currentTrack: {
        id: currentTrack.id,
        title: currentTrack.title,
        artist: currentTrack.artist,
        cover: currentTrack.cover,
        animatedCover: currentTrack.animatedCover,
      },
      queue: queueItems.map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        cover: item.cover,
        animatedCover: item.animatedCover,
      })),
      isPlaying,
    });
  }, [currentTrack, isPlaying, playbackSource, queueItems, setPlaybackSnapshot]);

  useEffect(() => {
    setStoreVolume(isMuted ? 0 : volume);
  }, [isMuted, setStoreVolume, volume]);

  useEffect(() => {
    const nextProgress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
    setStoreProgress(nextProgress);
  }, [currentTime, duration, setStoreProgress]);

  const volumeSliderStyle = {
    '--slider-progress': `${(isMuted ? 0 : volume) * 100}%`,
  } as CSSProperties;

  const progressSliderStyle = {
    '--slider-progress': `${duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
  } as CSSProperties;

  return (
    <footer ref={rootRef} className="relative mt-2 rounded-xl bg-black px-3 py-2">
      <audio
        ref={audioRef}
        preload="metadata"
        src={displayTrack.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={handleAudioEnded}
      />

      {isLyricsOpen && (
        <div className="player-popover left-1/2 top-[-14rem] w-[min(520px,90vw)] -translate-x-1/2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {t('player.lyricsPreview')}
          </div>
          <h4 className="mb-2 text-lg font-semibold text-zinc-100">{displayTrack.title}</h4>
          <div className="space-y-1 text-sm leading-6 text-zinc-300">
            {currentTrack.lyrics.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {isQueueOpen && (
        <div className="player-popover right-44 top-[-18rem] w-[min(380px,90vw)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {t('player.queue')}
          </div>
          <div className="space-y-1">
            {queueItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  goToOrderPosition(item.queuePosition, true);
                  setIsQueueOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-zinc-200 transition hover:bg-zinc-800"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-10 w-10 rounded object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-zinc-400">{item.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isDeviceMenuOpen && (
        <div className="player-popover right-20 top-[-11rem] w-[min(280px,90vw)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {t('player.connectToDevice')}
          </div>
          <div className="space-y-1">
            {deviceOptions.map((device) => (
              <button
                key={device}
                type="button"
                onClick={() => {
                  setActiveDevice(device);
                  setIsDeviceMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition ${
                  activeDevice === device
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span>{t(`player.device.${device}`)}</span>
                {activeDevice === device && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid items-center gap-3 md:grid-cols-[minmax(220px,320px)_minmax(0,1fr)_minmax(220px,320px)]">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={displayTrack.cover}
            alt={displayTrack.title}
            className="h-14 w-14 rounded object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-100">
              <Link to={`/track/${displayTrack.id}`} className="hover:underline">
                {displayTrack.title}
              </Link>
            </p>
            <p className="truncate text-sm text-zinc-400">
              {(() => {
                const dataTrack = spotifyData.tracks.find((t: any) => t.id === displayTrack.id);
                const artistId = dataTrack?.artist_ids[0];
                return artistId ? (
                  <Link
                    to={`/artist/${artistId}`}
                    className="hover:underline hover:text-white transition-colors"
                  >
                    {displayTrack.artist}
                  </Link>
                ) : (
                  <span>{displayTrack.artist}</span>
                );
              })()}
            </p>
          </div>
          <button
            type="button"
            aria-label={isCurrentTrackSaved ? t('player.removeFromLiked') : t('player.saveToLiked')}
            onClick={() => {
              const isLiked = isCurrentTrackSaved;
              toggleLikedSong(displayTrack.id);

              if (!isLiked) {
                addToast({
                  message: 'Added to Liked Songs.',
                  icon: 'liked-songs',
                  action: {
                    label: 'Change',
                    onClick: () => toggleLikedSong(displayTrack.id),
                  },
                });
              } else {
                addToast({
                  message: 'Removed from Liked Songs.',
                });
              }
            }}
            className={`flex items-center justify-center ml-auto rounded-full w-8 h-8 transition ${
              isCurrentTrackSaved
                ? 'text-[#1ed760] hover:text-[#1fdf64] hover:scale-105'
                : 'text-zinc-400 hover:text-white hover:scale-105'
            }`}
          >
            {isCurrentTrackSaved ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
              </svg>
            )}
          </button>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2">
          <div className="flex items-center gap-5 text-zinc-300">
            <button
              type="button"
              aria-label={t('player.toggleShuffle')}
              onClick={toggleShuffle}
              className={`rounded-full p-1 transition ${isShuffle ? 'text-emerald-400' : 'hover:text-white'}`}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={t('player.previousTrack')}
              onClick={handlePlayPrevious}
              className="rounded-full p-1 hover:text-white"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? t('player.pause') : t('player.play')}
              onClick={handlePlayPauseToggle}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label={t('player.nextTrack')}
              onClick={handlePlayNext}
              className="rounded-full p-1 hover:text-white"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
            <button
              type="button"
              aria-label={t('player.toggleRepeatMode')}
              onClick={handleRepeatToggle}
              className={`relative rounded-full p-1 transition ${isRepeatEnabled ? 'text-emerald-400' : 'hover:text-white'}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex w-full max-w-2xl items-center gap-2">
            <span className="w-10 text-right text-xs text-zinc-400">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => handleProgressChange(Number(event.target.value))}
              className="player-slider player-slider--progress h-1.5 w-full"
              style={progressSliderStyle}
              aria-label={t('player.seek')}
            />
            <span className="w-10 text-xs text-zinc-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 text-zinc-300">
          <button
            type="button"
            aria-label={t('player.toggleLyricsPanel')}
            onClick={() => {
              setIsLyricsOpen((prev) => !prev);
              setIsQueueOpen(false);
              setIsDeviceMenuOpen(false);
            }}
            className={`rounded-full p-1 transition ${isLyricsOpen ? 'text-emerald-400' : 'hover:text-white'}`}
          >
            <Mic2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label={t('player.toggleQueue')}
            onClick={() => {
              setIsQueueOpen((prev) => !prev);
              setIsLyricsOpen(false);
              setIsDeviceMenuOpen(false);
            }}
            className={`rounded-full p-1 transition ${isQueueOpen ? 'text-emerald-400' : 'hover:text-white'}`}
          >
            <ListMusic className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label={t('player.toggleDeviceMenu')}
            title={t('player.activeDevice', { device: t(`player.device.${activeDevice}`) })}
            onClick={() => {
              setIsDeviceMenuOpen((prev) => !prev);
              setIsQueueOpen(false);
              setIsLyricsOpen(false);
            }}
            className={`rounded-full p-1 transition ${isDeviceMenuOpen ? 'text-emerald-400' : 'hover:text-white'}`}
          >
            <MonitorSpeaker className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label={t('player.mute')}
            onClick={handleMuteToggle}
            className="rounded-full p-1 hover:text-white"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(event) => handleVolumeChange(Number(event.target.value))}
            className="player-slider player-slider--volume h-1.5 w-28"
            style={volumeSliderStyle}
            aria-label={t('player.volume')}
          />

          <button
            type="button"
            aria-label={t('player.toggleFullscreen')}
            onClick={handleFullscreenToggle}
            className="rounded-full p-1 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </footer>
  );
}

export default PlayerBar;
