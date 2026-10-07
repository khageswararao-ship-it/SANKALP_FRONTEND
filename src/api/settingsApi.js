import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API_URL = `${API_BASE_URL}/api/settings`;

export const getSettings = () => axios.get(API_URL);

export const updateSettings = (settings) =>
  axios.put(API_URL, settings);