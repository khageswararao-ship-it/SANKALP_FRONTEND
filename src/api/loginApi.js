import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API_URL = `${API_BASE_URL}/api/login`;

export const getAllLogins = async () => {
  return await axios.get(API_URL);
};

export const updateLogin = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/authenticate`,
    loginData
  );
  return response.data;
};