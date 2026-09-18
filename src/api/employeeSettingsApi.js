import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com/api/employee/settings";

// Get Employee Settings
export const getEmployeeSettings = async (employeeId) => {
  const response = await axios.get(`${API_URL}/${employeeId}`);
  return response.data;
};

// Save Employee Settings
export const saveEmployeeSettings = async (settings) => {
  const response = await axios.post(API_URL, settings);
  return response.data;
};

// Update Employee Settings
export const updateEmployeeSettings = async (employeeId, settings) => {
  const response = await axios.put(`${API_URL}/${employeeId}`, settings);
  return response.data;
};