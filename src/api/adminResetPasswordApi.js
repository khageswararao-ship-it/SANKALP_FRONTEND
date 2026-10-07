import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const BASE_URL = API_BASE_URL;
export const adminResetPassword = async (token, password) => {

    const response = await axios.post(
        `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`
    );

    return response.data;
};
