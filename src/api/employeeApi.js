import axios from "axios";

const API = axios.create({
  baseURL: "https://sankalp-backend-r2sj.onrender.com",
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
