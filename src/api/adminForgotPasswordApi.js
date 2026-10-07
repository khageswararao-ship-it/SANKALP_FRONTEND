import { API_BASE_URL } from "./apiConfig";
import axios from "axios";

const API_URL = API_BASE_URL;

export const adminForgotPassword = async (email) => {

    const response = await axios.post(
        `${BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`
    );

    return response.data;
};
