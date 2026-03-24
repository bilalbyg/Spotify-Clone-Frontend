export const endpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
  },
  playlist: {
    list: '/playlists',
    details: (id: string) => `/playlists/${id}`,
  },
  song: {
    list: '/songs',
    details: (id: string) => `/songs/${id}`,
  },
  album: {
    list: '/albums',
    byArtist: (artistId: string) => `/albums/artist/${artistId}`,
    details: (id: string) => `/albums/${id}`,
  },
  artist: {
    list: '/artists',
    details: (id: string) => `/artists/${id}`,
  },
  search: {
    query: '/search',
  },
} as const;
