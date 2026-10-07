import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const PROFILE_URL = `${API_BASE_URL}/api/profile`;
const LOGIN_URL = `${API_BASE_URL}/api/login`;

export const getProfile = () => axios.get(PROFILE_URL);

export const updateProfile = (profile) =>
    axios.put(PROFILE_URL, profile);

// Fetch all admins using the existing live /api/login endpoint to prevent 404 errors
export const getAllAdmins = async () => {
    try {
        const res = await axios.get(LOGIN_URL);
        const adminUsers = (res.data || []).filter(
            (u) => u.role && u.role.toUpperCase() === "ADMIN"
        );
        return { data: adminUsers };
    } catch (err) {
        return axios.get(`${PROFILE_URL}/admins`);
    }
};

export const addAdmin = (adminData) =>
    axios.post(LOGIN_URL, {
        ...adminData,
        role: "ADMIN",
        accountStatus: "ACTIVE",
    });