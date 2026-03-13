import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CustomPlaylist = {
  id: string;
  name: string;
  description: string;
  owner: string;
  trackIds: string[];
  createdAt: number;
};

type LibraryState = {
  customPlaylists: CustomPlaylist[];
  likedSongs: string[];
  createPlaylist: () => string;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<CustomPlaylist>) => void;
  toggleLikedSong: (trackId: string) => void;
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      customPlaylists: [
        {
          id: 'custom-alternatif-turk-rock',
          name: 'Alternatif turk rock',
          description: '',
          owner: 'Bilal',
          trackIds: [
            '6c7d8e9f-0a1b-2c3d-4e5f-6a7b8c9d0e1f',
            '7d8e9f0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a',
            '8e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b',
          ],
          createdAt: Date.now(),
        },
      ],
      likedSongs: ['d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091'],
      createPlaylist: () => {
        const id = `custom-playlist-${Date.now()}`;
        const count = get().customPlaylists.length + 1;
        const newPlaylist: CustomPlaylist = {
          id,
          name: `My Playlist #${count}`,
          description: '',
          owner: 'Bilal',
          trackIds: [],
          createdAt: Date.now(),
        };

        set((state) => ({
          customPlaylists: [newPlaylist, ...state.customPlaylists],
        }));

        return id;
      },
      addTrackToPlaylist: (playlistId, trackId) => {
        set((state) => ({
          customPlaylists: state.customPlaylists.map((p) => {
            if (p.id === playlistId && !p.trackIds.includes(trackId)) {
              return { ...p, trackIds: [...p.trackIds, trackId] };
            }
            return p;
          }),
        }));
      },
      removeTrackFromPlaylist: (playlistId, trackId) => {
        set((state) => ({
          customPlaylists: state.customPlaylists.map((p) => {
            if (p.id === playlistId) {
              return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
            }
            return p;
          }),
        }));
      },
      updatePlaylist: (playlistId, updates) => {
        set((state) => ({
          customPlaylists: state.customPlaylists.map((p) =>
            p.id === playlistId ? { ...p, ...updates } : p,
          ),
        }));
      },
      toggleLikedSong: (trackId) => {
        set((state) => {
          const isLiked = state.likedSongs.includes(trackId);
          return {
            likedSongs: isLiked
              ? state.likedSongs.filter((id) => id !== trackId)
              : [...state.likedSongs, trackId],
          };
        });
      },
    }),
    {
      name: 'spotify-clone:library',
    },
  ),
);
