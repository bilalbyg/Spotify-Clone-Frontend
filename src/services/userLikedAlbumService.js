import axios from "axios";

export default class UserLikedAlbumService {

    // Singleton Pattern
    static instance = null;
    static getInstance() {
      if (UserLikedAlbumService.instance === null) {
        UserLikedAlbumService.instance = new UserLikedAlbumService();
      }
      return this.instance;
    }

  getUserLikedAlbums() {
    return axios.get("http://localhost:8080/api/user-liked-albums/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  addUserLikedAlbum(userLikedAlbum) {
    return axios.post(
      "http://localhost:8080/api/user-liked-albums/add",
      userLikedAlbum,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }

  getByUserIdAndAlbumId(userId, albumId) {
    return axios.get(
      `http://localhost:8080/api/user-liked-albums/getByUserIdAndAlbumId?userId=${userId}&albumId=${albumId}`,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  delete(userLikedAlbumId) {
    return axios.delete(
      "http://localhost:8080/api/user-liked-albums/delete?id=" + userLikedAlbumId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
