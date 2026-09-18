import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com/api/reports";

// Get all reports
export const getReports = () => axios.get(API_URL);

// Generate Employee Report
export const generateEmployeeReport = () =>
  axios.post(`${API_URL}/generate/employee`);

// Get report by ID
export const getReportById = (id) =>
  axios.get(`${API_URL}/${id}`);

// Add report
export const addReport = (report) =>
  axios.post(API_URL, report);

// Update report
export const updateReport = (id, report) =>
  axios.put(`${API_URL}/${id}`, report);

// Delete report
export const deleteReport = (id) =>
  axios.delete(`${API_URL}/${id}`);