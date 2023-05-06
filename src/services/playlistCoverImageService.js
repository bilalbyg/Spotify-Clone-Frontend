import axios from "axios";

export default class PlaylistCoverImageService {
  getPlaylistCoverImages() {
    return axios
      .get("http://localhost:8080/api/playlist-cover-images/getall", {
        headers : {
            'Authorization' : localStorage.getItem("tokenKey")
        }
      })
  }

  getPlaylistCoverImageByPlaylistId(playlistId) {
    return axios
      .get("http://localhost:8080/api/playlist-cover-images/getByPlaylistId?playlistId=" + playlistId, {
        headers : {
            'Authorization' : localStorage.getItem("tokenKey")
        }
      })
  }

  addPlaylistCoverImage(playlistCoverImage){
    return axios.post(
      "http://localhost:8080/api/playlist-cover-images/add",
      playlistCoverImage,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }
}
