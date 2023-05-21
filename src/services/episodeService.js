import axios from "axios";

export default class EpisodeService {
  // Singleton Pattern
  static instance = null;
  static getInstance() {
    if (EpisodeService.instance === null) {
      EpisodeService.instance = new EpisodeService();
    }
    return this.instance;
  }

  getEpisodes() {
    return axios.get("http://localhost:8080/api/episodes/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getEpisodeById(episodeId) {
    return axios.get(
      "http://localhost:8080/api/episodes/getById?id=" + episodeId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  getByPodcastId(podcastId) {
    return axios.get(
      "http://localhost:8080/api/episodes/getByPodcastId?podcastId=" + podcastId,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }

  getEpisodesById(episodeIds) {
    return axios.get(
      "http://localhost:8080/api/episodes/getEpisodesById?ids=" + episodeIds,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
