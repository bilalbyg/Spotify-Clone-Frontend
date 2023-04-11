import axios from "axios";

export default class PlaylistService {
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
}
