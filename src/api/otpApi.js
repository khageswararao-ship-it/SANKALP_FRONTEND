import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API = `${API_BASE_URL}/api/otp`;

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