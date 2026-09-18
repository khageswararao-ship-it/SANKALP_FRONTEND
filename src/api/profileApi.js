import axios from "axios";

const API_URL = "http://10.205.165.151:8080/api/profile";

export const getProfile = () => axios.get(API_URL);

export const updateProfile = (profile) =>
    axios.put(API_URL, profile);