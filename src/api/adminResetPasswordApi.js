import axios from "axios";

const BASE_URL = "http://10.205.165.151:8080/api/admin";

export const adminResetPassword = async (token, password) => {

    const response = await axios.post(
        `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`
    );

    return response.data;
};