import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com";

export const getProfile = () => axios.get(API_URL);

export const updateProfile = (profile) =>
    axios.put(API_URL, profile);
