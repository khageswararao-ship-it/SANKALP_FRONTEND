import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API_URL = `${API_BASE_URL}/api/profile`;

export const getProfile = () => axios.get(API_URL);

export const updateProfile = (profile) =>
    axios.put(API_URL, profile);

export const getAllAdmins = () => axios.get(`${API_URL}/admins`);

export const addAdmin = (adminData) =>
    axios.post(`${API_URL}/admins`, adminData);