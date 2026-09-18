import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com";

export const getLeave = () => axios.get(API_URL);

export const addLeave = (leave) => axios.post(API_URL, leave);

export const updateLeave = (id, leave) =>
  axios.put(`${API_URL}/${id}`, leave);

export const deleteLeave = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const getLeaveById = (id) =>
  axios.get(`${API_URL}/${id}`);
