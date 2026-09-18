import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com/api/settings";

export const getSettings = () => axios.get(API_URL);

export const updateSettings = (settings) =>
  axios.put(API_URL, settings);