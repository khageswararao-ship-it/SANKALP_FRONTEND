import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`
});

export const getEmployees = () => API.get("/employees");

export const addEmployee = (employee) =>
  API.post("/employees", employee);

// ADD THESE TWO FUNCTIONS HERE
export const updateEmployee = (id, employee) =>
  API.put(`/employees/${id}`, employee);

export const deleteEmployee = (id) =>
  API.delete(`/employees/${id}`);

export default API;