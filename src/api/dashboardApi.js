import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const BASE_URL = API_BASE_URL;

export const getEmployees = () =>
  axios.get(`${BASE_URL}/api/admin/employees`);

export const getAttendance = () =>
  axios.get(`${BASE_URL}/attendance`);

export const getLeaves = () =>
  axios.get(`${BASE_URL}/leave`);

export const getPayroll = () =>
  axios.get(`${BASE_URL}/api/payroll`);