import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com";

export const getEmployeeDashboard = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateEmployeeDashboard = (id, employee) => {
  return axios.put(`${API_URL}/${id}`, employee);
};

export const addEmployeeDashboard = (employee) => {
  return axios.post(API_URL, employee);
};

export const deleteEmployeeDashboard = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
