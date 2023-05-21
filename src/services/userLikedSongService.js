import axios from "axios";

export default class UserLikedSongService {

    // Singleton Pattern
    static instance = null;
    static getInstance() {
      if (UserLikedSongService.instance === null) {
        UserLikedSongService.instance = new UserLikedSongService();
      }
      return this.instance;
    }

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
          "Content-Type": "application/json",
        },
      }
    );
  }

  getByUserIdAndSongId(userId, songId) {
    return axios.get(
      `http://localhost:8080/api/user-liked-songs/getByUserIdAndSongId?userId=${userId}&songId=${songId}`,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  getByUserId(userId) {
    return axios.get(
      `http://localhost:8080/api/user-liked-songs/getByUserId?userId=${userId}`,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  delete(userLikedSongId) {
    return axios.delete(
      "http://localhost:8080/api/user-liked-songs/delete?id=" + userLikedSongId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
