import axios from "axios";

const API_URL = "https://sankalp-backend-r2sj.onrender.com/api/notifications";

// ========================
// Admin APIs
// ========================

// Get all notifications
export const getNotifications = () =>
  axios.get(API_URL);

// Get notification by ID
export const getNotificationById = (id) =>
  axios.get(`${API_URL}/${id}`);

// Create/Send notification
export const addNotification = (notification) =>
  axios.post(API_URL, notification);

// Update notification
export const updateNotification = (id, notification) =>
  axios.put(`${API_URL}/${id}`, notification);

// Delete one notification
export const deleteNotification = (id) =>
  axios.delete(`${API_URL}/${id}`);

// Delete all notifications
export const deleteAllNotifications = () =>
  axios.delete(`${API_URL}/delete-all`);

// Alias used by Employee Notifications page
export const clearNotifications = () =>
  axios.delete(`${API_URL}/delete-all`);


// ========================
// Employee APIs
// ========================

// Get notifications of a specific employee (EMP1, EMP2...)
export const getEmployeeNotifications = (employeeId) =>
  axios.get(`${API_URL}/employee/${employeeId}`);

// Mark notification as read
export const markNotificationAsRead = (id) =>
  axios.put(`${API_URL}/read/${id}`);

// Employee replies to admin
export const replyToNotification = (id, reply) =>
  axios.put(`${API_URL}/reply/${id}`, {
    reply,
  });