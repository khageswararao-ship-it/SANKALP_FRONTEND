import axios from "axios";

const API = axios.create({
  baseURL: "http://10.205.165.151:8080/api/payroll",
});

export const getPayroll = (employeeId) =>
  API.get(`/employee/${employeeId}`);

export const getPayrollById = (id) =>
  API.get(`/${id}`);