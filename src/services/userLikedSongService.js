import axios from "axios";

export default class UserLikedSongService {
  getUserLikedSongs() {
    return axios.get("http://localhost:8080/api/user-liked-songs/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  addUserLikedSong(userLikedSong) {
    return axios.post(
      "http://localhost:8080/api/user-liked-songs/add",
      userLikedSong,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json"
        },
      }
    );
  }
}
