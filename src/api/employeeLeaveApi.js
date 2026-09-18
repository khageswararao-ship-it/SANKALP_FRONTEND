import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com/leave";

export const getLeaves = () => {
  return axios.get(API_URL);
};

export const getLeaveById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const applyLeave = (leave) => {
  return axios.post(API_URL, leave);
};

export const updateLeave = (id, leave) => {
  return axios.put(`${API_URL}/${id}`, leave);
};

export const deleteLeave = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};