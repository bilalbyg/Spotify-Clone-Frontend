import axios from "axios";

export default class UserLikedPodcastService {

    // Singleton Pattern
    static instance = null;
    static getInstance() {
      if (UserLikedPodcastService.instance === null) {
        UserLikedPodcastService.instance = new UserLikedPodcastService();
      }
      return this.instance;
    }

  getUserLikedPodcasts() {
    return axios.get("http://localhost:8080/api/user-liked-podcasts/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  addUserLikedPodcast(userLikedPodcast) {
    return axios.post(
      "http://localhost:8080/api/user-liked-podcasts/add",
      userLikedPodcast,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
          "Content-Type": "application/json",
        },
      }
    );
  }

  getByUserIdAndPodcastId(userId, podcastId) {
    return axios.get(
      `http://localhost:8080/api/user-liked-podcasts/getByUserIdAndPodcastId?userId=${userId}&podcastId=${podcastId}`,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  delete(userLikedPodcastId) {
    return axios.delete(
      "http://localhost:8080/api/user-liked-podcasts/delete?id=" + userLikedPodcastId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
