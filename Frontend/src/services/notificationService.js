import axiosClient from "./axiosClient";

const API_BASE_URL = "api/v1/notifications";

// Lấy danh sách notifications
export const fetchNotifications = async () => {
    try {
        const response = await axiosClient.get(`${API_BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Lấy chi tiết một notification
export const getNotificationById = async (notificationId) => {
    try {
        const response = await axiosClient.get(`${API_BASE_URL}/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notification:", error);
        throw error;
    }
};

// Đánh dấu đã đọc
export const markAsRead = async (notificationId) => {
    try {
        const response = await axiosClient.put(`${API_BASE_URL}/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

// Xóa notification
export const deleteNotification = async (notificationId) => {
    try {
        await axiosClient.delete(`${API_BASE_URL}/${notificationId}`);
        return true;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};


export const markAllAsRead = async () => {
    try {
        const response = await axiosClient.put(`${API_BASE_URL}/mark-all-read`);
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};

