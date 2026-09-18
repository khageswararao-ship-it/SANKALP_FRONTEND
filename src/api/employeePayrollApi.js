import axios from "axios";

const API = axios.create({
  baseURL: "https://sankalp-backend-r2sj.onrender.com",
});

export const getPayroll = (employeeId) =>
  API.get(`/employee/${employeeId}`);

export const getPayrollById = (id) =>
  API.get(`/${id}`);
