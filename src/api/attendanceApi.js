import axios from "axios";

const API_URL = "http://10.205.165.151:8080";

export const getAttendance = () => {
  return axios.get(`${API_URL}/attendance`);
};

export const addAttendance = (attendance) => {
  return axios.post(`${API_URL}/attendance`, attendance);
};

export const updateAttendance = (id, attendance) => {
  return axios.put(`${API_URL}/attendance/${id}`, attendance);
};

export const deleteAttendance = (id) => {
  return axios.delete(`${API_URL}/attendance/${id}`);
};