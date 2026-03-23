import api from '@/lib/axios';
import { endpoints } from '@/services/endpoints';
import type { AlbumResponse, CreateAlbumRequest } from '../types/album.types';

export const albumService = {
  createAlbum: async (data: CreateAlbumRequest): Promise<AlbumResponse> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('releaseYear', data.releaseYear.toString());
    formData.append('artistId', data.artistId);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post<AlbumResponse>(endpoints.album.list, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAlbumsByArtist: async (artistId: string): Promise<AlbumResponse[]> => {
    const response = await api.get<AlbumResponse[]>(endpoints.album.byArtist(artistId));
    return response.data;
  },

  getAlbums: async (): Promise<AlbumResponse[]> => {
    // Note: Assuming there is a general list endpoint as requested by "next to Artists"
    const response = await api.get<AlbumResponse[]>(endpoints.album.list);
    return response.data;
  },
};
