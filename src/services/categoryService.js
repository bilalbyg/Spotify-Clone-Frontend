import axios from "axios";

export default class CategoryService {

  // Singleton Pattern
  static instance = null;
  static getInstance() {
    if (CategoryService.instance === null) {
      CategoryService.instance = new CategoryService();
    }
    return this.instance;
  }

  getCategories() {
    return axios.get("http://localhost:8080/api/categories/getall", {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }

  getByCategoryId(categoryId) {
    return axios.get("http://localhost:8080/api/categories/getByCategoryId?categoryId=" + categoryId, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      },
    });
  }
}
