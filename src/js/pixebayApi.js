'use strict';
import axios from 'axios';

export class PixebayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28740342-1947fe48ccb576993622995e0';

  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.query = null;
  }

  fetchPhotosByQuery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: this.photo,
        orientation: this.horizontal,
        safesearch: this.true,
        page: this.page,
        per_page: this.perPage,
      },
    });
  }
}
