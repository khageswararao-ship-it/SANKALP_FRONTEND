import axios from "axios";

const API_URL = "http://10.205.165.151:8080/api/employee-dashboard";

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