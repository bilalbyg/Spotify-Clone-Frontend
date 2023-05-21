import axios from "axios";

export default class PlaylistService {

  static instance = null;
  static getInstance() {
    if (PlaylistService.instance === null) {
      PlaylistService.instance = new PlaylistService();
    }
    return this.instance;
  }

  getPlaylists() {
    return axios.get("http://localhost:8080/api/playlists/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getPlaylistById(playlistId) {
    return axios.get("http://localhost:8080/api/playlists/getById?id=" + playlistId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getByPlaylistUserId(playlistUserId) {
    return axios.get("http://localhost:8080/api/playlists/getByPlaylistUserId?playlistUserId=" + playlistUserId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getPlaylistByName(playlistName) {
    return axios.get("http://localhost:8080/api/playlists/getByPlaylistName?playlistName=" + playlistName, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  addPlaylist(playlist) {
    return axios.post(
      "http://localhost:8080/api/playlists/add",
      playlist,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }

  updatePlaylist(playlist) {
    return axios.put(
      "http://localhost:8080/api/playlists/update",
      playlist,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }

  delete(playlistId) {
    return axios.delete(
      "http://localhost:8080/api/playlists/delete?playlistId=" + playlistId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
