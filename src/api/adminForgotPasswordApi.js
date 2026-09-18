import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com";

export const adminForgotPassword = async (email) => {

    const response = await axios.post(
        `${BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`
    );

    return response.data;
};
