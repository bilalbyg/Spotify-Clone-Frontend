import axios from "axios";

export default class UserLikedArtistService {
  // Singleton Pattern
  static instance = null;
  static getInstance() {
    if (UserLikedArtistService.instance === null) {
      UserLikedArtistService.instance = new UserLikedArtistService();
    }
    return this.instance;
  }

  getUserLikedArtists() {
    return axios.get("http://localhost:8080/api/user-liked-artists/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  addUserLikedArtist(userLikedArtist) {
    return axios.post(
      "http://localhost:8080/api/user-liked-artists/add",
      userLikedArtist,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }

  getByUserIdAndArtistId(userId, artistId) {
    return axios.get(
      `http://localhost:8080/api/user-liked-artists/getByUserIdAndArtistId?userId=${userId}&artistId=${artistId}`,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  delete(userLikedArtistId) {
    return axios.delete(
      "http://localhost:8080/api/user-liked-artists/delete?id=" +
        userLikedArtistId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
