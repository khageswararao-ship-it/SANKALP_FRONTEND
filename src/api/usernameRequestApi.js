import axios from "axios";

const API_URL = "http://10.205.165.151:8080/api/username-request";


export const approveUsernameRequest = (id) => {
  return axios.put(`${API_URL}/${id}/approve`);
};

export const rejectUsernameRequest = (id) => {
  return axios.put(`${API_URL}/${id}/reject`);
};

// Create Request
export const createUsernameRequest = async (request) => {
  const response = await axios.post(API_URL, request);
  return response.data;
};

// Get All Requests
export const getUsernameRequests = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update Request
export const updateUsernameRequest = async (id, request) => {
  const response = await axios.put(`${API_URL}/${id}`, request);
  return response.data;
};

export const deleteAllUsernameRequests = () =>
  axios.delete("http://localhost:8080/api/username-request/delete-all");