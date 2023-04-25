import axios from "axios";

export default class UserEpisodeService {
  getUserEpisodes() {
    return axios.get("http://localhost:8080/api/user-episodes/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

//   getSongById(songId) {
//     return axios.get("http://localhost:8080/api/songs/getById?id=" + songId, {
//       headers: {
//         Authorization: localStorage.getItem("tokenKey"),
//       },
//     });
//   }

//   getSongsById(songIds) {
//     return axios.get("http://localhost:8080/api/songs/getSongsById?ids=" + songIds, {
//       headers: {
//         Authorization: localStorage.getItem("tokenKey"),
//       },
//     });
//   }
}