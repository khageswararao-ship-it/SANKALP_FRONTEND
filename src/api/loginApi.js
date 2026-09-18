import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com/api/login";

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/authenticate`,
    loginData
  );
  return response.data;
};