// utils/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true, // use only if you're using session authentication
});

export default api;