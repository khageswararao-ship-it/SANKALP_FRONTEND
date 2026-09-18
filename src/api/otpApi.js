import axios from "axios";

const API = "https://sankalp-backend-r2sj.onrender.com";

export const sendOtp = (employeeId) => {
  return axios.post(`${API}/send`, {
    employeeId,
  });
};

export const verifyOtp = (employeeId, otp) => {
  return axios.post(`${API}/verify`, {
    employeeId,
    otp,
  });
};
