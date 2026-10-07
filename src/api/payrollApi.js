import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API_URL = `${API_BASE_URL}/api/payroll`;

export const getPayroll = () => axios.get(API_URL);

export const getPayrollById = (id) =>
  axios.get(`${API_URL}/${id}`);

export const addPayroll = (payroll) =>
  axios.post(API_URL, payroll);

export const updatePayroll = (id, payroll) =>
  axios.put(`${API_URL}/${id}`, payroll);

export const deletePayroll = (id) =>
  axios.delete(`${API_URL}/${id}`);