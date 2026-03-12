/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface PlayerState {
  currentTrack: any;
  isPlaying: boolean;
  queue: any[];
  playbackContext: { type: string; id: string };
  setTrack: (track: any) => void;
  setQueue: (queue: any[]) => void;
  setPlaybackSource: (source: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackContext: (context: { type: string; id: string }) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  playbackContext: { type: 'none', id: '' },
  setTrack: (track) => set({ currentTrack: track }),
  setQueue: (queue) => set({ queue }),
  setPlaybackSource: () => {},
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackContext: (playbackContext) => set({ playbackContext }),
}));
