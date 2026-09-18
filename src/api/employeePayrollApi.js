import axios from "axios";

const API = axios.create({
  baseURL: "https://sankalp-backend-r2sj.onrender.com/api/payroll",
});

export const getPayroll = (employeeId) =>
  API.get(`/employee/${employeeId}`);

export const getPayrollById = (id) =>
  API.get(`/${id}`);