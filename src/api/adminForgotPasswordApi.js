import axios from "axios";

const API_URL = "http://10.205.165.151:8080";

export const adminForgotPassword = async (email) => {

    const response = await axios.post(
        `${BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`
    );

    return response.data;
};