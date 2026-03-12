/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface LibraryState {
  customPlaylists: any[];
  likedSongs: any[];
  createPlaylist: () => void;
}

export const useLibraryStore = create<LibraryState>(() => ({
  customPlaylists: [],
  likedSongs: [],
  createPlaylist: () => {},
}));
