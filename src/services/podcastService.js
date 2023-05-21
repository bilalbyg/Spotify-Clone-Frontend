import axios from "axios";

export default class PodcastService {

  static instance = null;
  static getInstance() {
    if (PodcastService.instance === null) {
      PodcastService.instance = new PodcastService();
    }
    return this.instance;
  }

  getPodcasts() {
    return axios.get("http://localhost:8080/api/podcasts/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getByPodcastId(podcastId) {
    return axios.get("http://localhost:8080/api/podcasts/getByPodcastId?podcastId=" + podcastId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getPodcastsById(podcastIds) {
    return axios.get("http://localhost:8080/api/podcasts/getPodcastsById?ids=" + podcastIds, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }
}