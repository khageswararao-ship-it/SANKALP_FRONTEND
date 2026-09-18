import axios from "axios";

const BASE_URL = "https://sankalp-backend-r2sj.onrender.com";
export const adminResetPassword = async (token, password) => {

    const response = await axios.post(
        `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`
    );

    return response.data;
};
