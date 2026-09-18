import axios from "axios";

const API_URL = "http://10.205.165.151:8080/leave";

export const getLeave = () => axios.get(API_URL);

export const addLeave = (leave) => axios.post(API_URL, leave);

export const updateLeave = (id, leave) =>
  axios.put(`${API_URL}/${id}`, leave);

export const deleteLeave = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const getLeaveById = (id) =>
  axios.get(`${API_URL}/${id}`);