import axios from "axios";

const BASE_URL = "http://10.205.165.151:8080/api/employee/profile";

// Get Profile
export const getEmployeeProfile = (employeeId) => {
    return axios.get(`${BASE_URL}/${employeeId}`);
};

// Create Profile
export const createEmployeeProfile = (profile) => {
    return axios.post(BASE_URL, profile);
};

// Update Profile
export const updateEmployeeProfile = (employeeId, profile) => {
    return axios.put(`${BASE_URL}/${employeeId}`, profile);
};