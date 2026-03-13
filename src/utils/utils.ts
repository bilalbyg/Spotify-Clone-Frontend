import type { LibraryItem, RecentSearchItem } from '@/app/layout/types/app-layout.types';

export const libraryItems: LibraryItem[] = [
  {
    id: 'liked-songs',
    title: 'Liked Songs',
    meta: 'Playlist . 2 songs',
    palette: 'from-violet-500 to-cyan-300',
    type: 'playlist',
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    title: 'Nova Echoes',
    meta: 'Artist',
    palette: 'from-violet-500 to-purple-300',
    image: 'https://picsum.photos/seed/artist-zeynep-640/120/120',
    type: 'artist',
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    title: 'Midnight Frequencies',
    meta: 'Album . 2025',
    palette: 'from-sky-500 to-blue-300',
    image: 'https://picsum.photos/seed/album-midnight-640/120/120',
    type: 'album',
  },
  {
    id: 'kalt-podcast',
    title: "KALT'ın Podcast'i",
    meta: 'Podcast . KALT',
    palette: 'from-amber-700 to-yellow-500',
    image: 'https://picsum.photos/seed/kalt-podcast-cover/120/120',
    type: 'podcast',
  },
];

export const recentSearchItems: RecentSearchItem[] = [
  {
    id: 'ghost-frequencies-track',
    title: 'Ghost Frequencies',
    subtitle: 'Song • Nova Echoes',
    image: 'https://picsum.photos/seed/album-midnight-300/80/80',
    entityType: 'track',
    entityId: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f80910213',
  },
  {
    id: 'nova-echoes-artist',
    title: 'Nova Echoes',
    subtitle: 'Artist',
    image: 'https://picsum.photos/seed/artist-zeynep-640/80/80',
    entityType: 'artist',
    entityId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  },
  {
    id: 'midnight-frequencies-album',
    title: 'Midnight Frequencies',
    subtitle: 'Album • 2025',
    image: 'https://picsum.photos/seed/album-midnight-640/80/80',
    entityType: 'album',
    entityId: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  },
  {
    id: 'neon-dusk-track',
    title: 'Neon Dusk',
    subtitle: 'Song • Nova Echoes',
    image: 'https://picsum.photos/seed/album-midnight-300/80/80',
    entityType: 'track',
    entityId: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091',
  },
];

export const LAYOUT = {
  leftMin: 50,
  leftMax: 420,
  rightMin: 280,
  rightMax: 420,
  centerMin: 100,
  gutter: 8,
  leftBreakpoint: 768,
  rightBreakpoint: 900,
} as const;

export const STORAGE_KEYS = {
  left: 'spotify-clone:layout:left-width',
  right: 'spotify-clone:layout:right-width',
  rightCollapsed: 'spotify-clone:layout:right-panel-collapsed',
} as const;
