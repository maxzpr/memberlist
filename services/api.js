import axios from 'axios';

const api_urls = {
  default: 'http://powerful-reef-47354.herokuapp.com',
  storage: 'http://murmuring-mountain-39162.herokuapp.com',
};

export default {
  members: {
    list() {
      return axios.get(`${api_urls.default}/members`);
    },
    byId(id) {
      return axios.get(`${api_urls.default}/members/${id}`);
    },
    image_url(id, img_name) {
      return `${api_urls.storage}/images/${id}/s/${img_name}`;
    },
  },
};
