import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API_URL = `${API_BASE_URL}/api/login`;

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/authenticate`,
    loginData
  );
  return response.data;
};