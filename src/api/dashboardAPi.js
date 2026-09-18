import axios from "axios";

const BASE_URL = "http://10.205.165.151:8080";

export const getEmployees = () =>
  axios.get(`${BASE_URL}/api/admin/employees`);

export const getAttendance = () =>
  axios.get(`${BASE_URL}/attendance`);

export const getLeaves = () =>
  axios.get(`${BASE_URL}/leave`);

export const getPayroll = () =>
  axios.get(`${BASE_URL}/api/payroll`);