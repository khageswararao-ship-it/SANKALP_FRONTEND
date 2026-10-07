import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Pass employeeId to backend
export const getMyAttendance = (employeeId) =>
  API.get(`/attendance/employee/${employeeId}`);

export const getAttendanceSummary = (employeeId) =>
  API.get(`/attendance/employee/${employeeId}/summary`);
