import axios from "axios";

const BASE_URL = "https://sankalp-backend-r2sj.onrender.com";
export const getEmployees = () =>
  axios.get(`${BASE_URL}/api/admin/employees`);

export const getAttendance = () =>
  axios.get(`${BASE_URL}/attendance`);

export const getLeaves = () =>
  axios.get(`${BASE_URL}/leave`);

export const getPayroll = () =>
  axios.get(`${BASE_URL}/api/payroll`);
