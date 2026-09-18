import axios from "axios";

const API = axios.create({
  baseURL: "https://sankalp-backend-r2sj.onrender.com",
});

export const getRequests = () => API.get("");

export const submitRequest = (request) =>
  API.post("", request);

export const approveRequest = (id) =>
  API.put(`/approve/${id}`);

export const rejectRequest = (id) =>
  API.put(`/reject/${id}`);

export const completePasswordReset = (id, newPassword) =>
  API.put(`/complete/${id}?newPassword=${encodeURIComponent(newPassword)}`);

export const deleteRequest = (id) =>
  API.delete(`/${id}`);

export const deleteAllRequests = () =>
  API.delete("/delete-all");
