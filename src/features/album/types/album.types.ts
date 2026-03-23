export interface AlbumResponse {
  id: string;
  title: string;
  releaseYear: number;
  coverImageUrl: string | null;
  artistId: string;
  artistName: string;
}

export interface CreateAlbumRequest {
  title: string;
  releaseYear: number;
  artistId: string;
  image?: File;
}
