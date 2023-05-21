import axios from "axios";

export default class SongService {
  // Singleton Pattern
  static instance = null;
  static getInstance() {
    if (SongService.instance === null) {
      SongService.instance = new SongService();
    }
    return this.instance;
  }

  getSongs() {
    return axios.get("http://localhost:8080/api/songs/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getSongById(songId) {
    return axios.get("http://localhost:8080/api/songs/getById?id=" + songId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getSongsById(songIds) {
    return axios.get(
      "http://localhost:8080/api/songs/getSongsById?ids=" + songIds,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  getSongsByAlbumId(albumId) {
    return axios.get(
      "http://localhost:8080/api/songs/getSongsByAlbumId?albumId=" + albumId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  getSongsByCategoryId(categoryId) {
    return axios.get(
      "http://localhost:8080/api/songs/getSongsByCategoryId?categoryId=" + categoryId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
