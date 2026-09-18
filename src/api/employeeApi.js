import axios from "axios";

const API = axios.create({
  baseURL: "http://10.205.165.151:8080/api/admin"
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