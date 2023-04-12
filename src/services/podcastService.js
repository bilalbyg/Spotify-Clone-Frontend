import axios from "axios";

export default class PodcastService {
  getPodcasts() {
    return axios.get("http://localhost:8080/api/podcasts/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

//   getPodcastById(podcastId) {
//     return axios.get("http://localhost:8080/api/songs/getById?id=" + songId, {
//       headers: {
//         Authorization: localStorage.getItem("tokenKey"),
//       },
//     });
//   }

//   getSongsById(podcastIds) {
//     return axios.get("http://localhost:8080/api/songs/getSongsById?ids=" + songIds, {
//       headers: {
//         Authorization: localStorage.getItem("tokenKey"),
//       },
//     });
//   }
}