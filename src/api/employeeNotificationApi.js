import axios from "axios";

const BASE_URL = "https://sankalp-backend-r2sj.onrender.com/api/employee/notifications";

// Get all notifications
export const getNotifications = () => {
    return axios.get(BASE_URL);
};

// Get notification by ID
export const getNotificationById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

// Add new notification
export const addNotification = (notification) => {
    return axios.post(BASE_URL, notification);
};

// Update notification
export const updateNotification = (id, notification) => {
    return axios.put(`${BASE_URL}/${id}`, notification);
};

// Mark notification as read
export const markAsRead = (id) => {
    return axios.put(`${BASE_URL}/${id}/read`);
};

// Delete one notification
export const deleteNotification = (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};

// Clear all notifications
export const clearNotifications = () => {
    return axios.delete(`${BASE_URL}/clear`);
};