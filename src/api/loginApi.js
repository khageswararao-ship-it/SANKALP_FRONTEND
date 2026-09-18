import axios from "axios";

const API_URL = "http://10.205.165.151:8080/api/login";

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/authenticate`,
    loginData
  );
  return response.data;
};