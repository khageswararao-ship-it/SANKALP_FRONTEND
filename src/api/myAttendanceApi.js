import axios from "axios";

const API = axios.create({
  baseURL: "http://10.205.165.151:8080",
});

// Pass employeeId to backend
export const getMyAttendance = (employeeId) =>
  API.get(`/attendance/employee/${employeeId}`);

export const getAttendanceSummary = (employeeId) =>
  API.get(`/attendance/employee/${employeeId}/summary`);