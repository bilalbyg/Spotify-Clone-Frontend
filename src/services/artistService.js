import axios from "axios";

export default class ArtistService {

  // Singleton Pattern
  static instance = null;
  static getInstance() {
    if (ArtistService.instance === null) {
      ArtistService.instance = new ArtistService();
    }
    return this.instance;
  }

  getArtists() {
    return axios.get("http://localhost:8080/api/artists/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getById(artistId){
    return axios.get("http://localhost:8080/api/artists/getById?artistId=" + artistId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getArtistsById(artistIds) {
    return axios.get(
      "http://localhost:8080/api/artists/getArtistsById?ids=" + artistIds,
      {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        },
      }
    );
  }
}
