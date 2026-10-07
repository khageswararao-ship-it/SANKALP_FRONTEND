import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/payroll`,
});

export const getPayroll = (employeeId) =>
  API.get(`/employee/${employeeId}`);

export const getPayrollById = (id) =>
  API.get(`/${id}`);