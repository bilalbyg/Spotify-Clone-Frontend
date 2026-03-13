export const endpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
  },
  playlist: {
    list: '/playlists',
    details: (id: string) => `/playlists/${id}`,
  },
  album: {
    details: (id: string) => `/albums/${id}`,
  },
  artist: {
    details: (id: string) => `/artists/${id}`,
  },
  search: {
    query: '/search',
  },
} as const;
