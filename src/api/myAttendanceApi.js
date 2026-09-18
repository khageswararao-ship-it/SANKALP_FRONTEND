import axios from "axios";

const API = axios.create({
  baseURL: "https://sankalp-backend-r2sj.onrender.com",
});

// Pass employeeId to backend
export const getMyAttendance = (employeeId) =>
  API.get(`/attendance/employee/${employeeId}`);

export const getAttendanceSummary = (employeeId) =>
  API.get(`/attendance/employee/${employeeId}/summary`);
