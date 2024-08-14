import axios from 'axios';

const API_BASE_URL = "http://192.168.0.119:9000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
