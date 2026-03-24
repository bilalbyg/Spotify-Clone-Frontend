import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PlayerMode = 'off' | 'all' | 'one';
type PlaybackSource = 'player' | 'external';
type PlaybackContextType = 'artist' | 'album' | 'playlist' | 'profile-top-tracks' | 'none';

export type PlaybackContext = {
  type: PlaybackContextType;
  id: string;
};

export type PlayerTrack = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  animatedCover?: string;
  src?: string;
  albumId?: string;
};

type PlayerState = {
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  savedTime: number;          // exact playback position in seconds
  repeatMode: PlayerMode;
  shuffle: boolean;
  playbackSource: PlaybackSource;
  playbackContext: PlaybackContext;
  setTrack: (track: PlayerTrack) => void;
  setQueue: (queue: PlayerTrack[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackSource: (source: PlaybackSource) => void;
  setPlaybackContext: (context: PlaybackContext) => void;
  setPlaybackSnapshot: (snapshot: {
    currentTrack: PlayerTrack | null;
    queue: PlayerTrack[];
    isPlaying: boolean;
  }) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setSavedTime: (seconds: number) => void;
  playNextInQueue: () => boolean;
  playPreviousInQueue: () => boolean;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      isPlaying: false,
      volume: 0.8,
      progress: 0,
      savedTime: 0,
      repeatMode: 'off',
      shuffle: false,
      playbackSource: 'player',
      playbackContext: { type: 'none', id: '' },
      setTrack: (track) => set({ currentTrack: track, isPlaying: true, savedTime: 0 }),
      setQueue: (queue) => set({ queue }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setPlaybackSource: (source) => set({ playbackSource: source }),
      setPlaybackContext: (context) => set({ playbackContext: context }),
      setPlaybackSnapshot: ({ currentTrack, queue, isPlaying }) =>
        set({ currentTrack, queue, isPlaying }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      setVolume: (volume) => set({ volume }),
      setProgress: (progress) => set({ progress }),
      setSavedTime: (seconds) => set({ savedTime: seconds }),
      playNextInQueue: () => {
        const { currentTrack, queue, shuffle } = get();
        if (!currentTrack || queue.length === 0) {
          return false;
        }

        const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
        let nextIndex = 0;

        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else {
          nextIndex = currentIndex + 1 >= queue.length ? 0 : currentIndex + 1;
        }

        const nextTrack = queue[nextIndex];
        set({ currentTrack: nextTrack, isPlaying: true });
        return true;
      },
      playPreviousInQueue: () => {
        const { currentTrack, queue } = get();
        if (!currentTrack || queue.length === 0) {
          return false;
        }

        const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);

        if (currentIndex <= 0) {
          return false;
        }

        const previousTrack = queue[currentIndex - 1];
        set({ currentTrack: previousTrack, isPlaying: true });
        return true;
      },
    }),
    {
      name: 'spotify-clone:player',
      version: 2,
      migrate: (_persistedState, version) => {
        // v0: had Nova Echoes placeholder data — reset fully.
        // v1 -> v2: add savedTime field.
        const base = {
          currentTrack: null as PlayerTrack | null,
          queue: [] as PlayerTrack[],
          volume: 0.8,
          repeatMode: 'off' as PlayerMode,
          shuffle: false,
          savedTime: 0,
          playbackContext: { type: 'none' as const, id: '' },
        };
        if (version < 1) {
          return base;
        }
        // v1 -> v2: keep existing data, just add savedTime
        const prev = _persistedState as typeof base;
        return { ...prev, savedTime: prev.savedTime ?? 0 };
      },
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        queue: state.queue,
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
        savedTime: state.savedTime,
        playbackContext: state.playbackContext,
      }),
    },
  ),
);
