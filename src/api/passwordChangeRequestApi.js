import axios from "axios";

const API_URL = "http://10.205.165.151:8080/api/password-change";

export const createPasswordChangeRequest = (request) => {
    return axios.post(API_URL, request);
};

export const getPasswordChangeRequests = () => {
    return axios.get(API_URL);
};

export const approvePasswordChangeRequest = (id) => {
    return axios.put(`${API_URL}/approve/${id}`);
};

export const rejectPasswordChangeRequest = (id) => {
    return axios.put(`${API_URL}/reject/${id}`);
};

export const deleteAllPasswordChangeRequests = () => {
    return axios.delete(`${API_URL}/delete-all`);
};