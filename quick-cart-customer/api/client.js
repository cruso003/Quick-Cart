import axios from 'axios';

const API_BASE_URL = "https://quick-cart.mooo.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
