import axios from "axios";

export default class AlbumService {

  // Singleton Pattern
  static instance = null;
  static getInstance() {
    if (AlbumService.instance === null) {
      AlbumService.instance = new AlbumService();
    }
    return this.instance;
  }

  getAlbums() {
    return axios.get("http://localhost:8080/api/albums/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getByAlbumId(albumId){
    return axios.get("http://localhost:8080/api/albums/getByAlbumId?albumId=" + albumId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getByArtistId(artistId){
    return axios.get("http://localhost:8080/api/albums/getByArtistId?artistId=" + artistId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getAlbumsById(albumIds) {
    return axios.get(
      "http://localhost:8080/api/albums/getAlbumsById?ids=" + albumIds,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
