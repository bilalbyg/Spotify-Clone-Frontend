import axios from "axios";

export default class UserEpisodeService {

    // Singleton Pattern
    static instance = null;
    static getInstance() {
      if (UserEpisodeService.instance === null) {
        UserEpisodeService.instance = new UserEpisodeService();
      }
      return this.instance;
    }

  getUserEpisodes() {
    return axios.get("http://localhost:8080/api/user-episodes/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getByUserIdAndEpisodeId(userId, episodeId) {
    return axios.get(
      `http://localhost:8080/api/user-episodes/getByUserIdAndEpisodeId?userId=${userId}&episodeId=${episodeId}`,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  getByUserId(userId) {
    return axios.get("http://localhost:8080/api/user-episodes/getByUserId?userId=" + userId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  addUserEpisode(userEpisode) {
    return axios.post(
      "http://localhost:8080/api/user-episodes/add",
      userEpisode,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }

  delete(userEpisodeId) {
    return axios.delete(
      "http://localhost:8080/api/user-episodes/delete?id=" + userEpisodeId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}