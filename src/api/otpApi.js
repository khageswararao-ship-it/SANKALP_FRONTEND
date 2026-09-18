import axios from "axios";

const API = "http://10.205.165.151:8080/api/otp";

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