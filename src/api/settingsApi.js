import axios from "axios";

const API_URL = "http://10.205.165.151:8080/api/settings";

export const getSettings = () => axios.get(API_URL);

export const updateSettings = (settings) =>
  axios.put(API_URL, settings);