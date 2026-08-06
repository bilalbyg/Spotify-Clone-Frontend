import type { LibraryItem, RecentSearchItem } from '@/app/layout/types/app-layout.types';

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const readStoredWidth = (key: string, fallback: number) => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;

  const parsed = Number(stored);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const readStoredBoolean = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);
  if (storedValue === null) {
    return fallback;
  }

  return storedValue === 'true';
};

export const normalizeApiAssetUrl = (url?: string | null) => {
  if (!url) return undefined;

  try {
    const parsedUrl = new URL(url);
    if (
      (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') &&
      parsedUrl.port === '9005'
    ) {
      return `${import.meta.env.VITE_API_ASSET_ORIGIN ?? 'http://192.168.1.190:9005'}${parsedUrl.pathname}`;
    }
  } catch {
    return url;
  }

  return url;
};

export const getLibraryItemRoute = (item: LibraryItem) =>
  item.type === 'playlist'
    ? `/playlist/${item.id}`
    : item.type === 'album'
      ? `/album/${item.id}`
      : item.type === 'podcast'
        ? `/show/${item.id}`
        : `/artist/${item.id}`;

export const getRecentSearchItemRoute = (item: RecentSearchItem) =>
  item.entityType === 'track'
    ? `/track/${item.entityId}`
    : item.entityType === 'artist'
      ? `/artist/${item.entityId}`
      : item.entityType === 'album'
        ? `/album/${item.entityId}`
        : item.entityType === 'podcast'
          ? `/show/${item.entityId}`
          : `/episode/${item.entityId}`;
