import axios from "axios";

export default class EpisodeService {
  getEpisodes() {
    return axios.get("http://localhost:8080/api/episodes/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getEpisodeById(episodeId) {
    return axios.get("http://localhost:8080/api/episodes/getById?id=" + episodeId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getEpisodesById(episodeIds) {
    return axios.get("http://localhost:8080/api/episodes/getEpisodesById?ids=" + episodeIds, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }
}