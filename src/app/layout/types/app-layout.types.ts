export type LibraryItem = {
  id: string;
  title: string;
  meta: string;
  palette: string;
  image?: string | string[];
  type: 'playlist' | 'artist' | 'album' | 'podcast';
};

export type RecentSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  entityType: 'track' | 'artist' | 'album' | 'podcast' | 'episode';
  entityId: string;
};

export type ResizeSide = 'left' | 'right';

export type DragState = {
  side: ResizeSide;
  startX: number;
  startWidth: number;
};
