import axios from 'axios';
import config from '../config/baseUrl';

export const fetchUserNotifications = async (unreadOnly?: string) => {
    try {
        const params = unreadOnly ? { unreadOnly } : {};
        const response = await axios.get(`${config}/user/notification`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            params
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch user notifications:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const response = await axios.put(`${config}/user/markAsRead/${notificationId}`, {}, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
    }
};

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.put(`${config}/user/markAllAsRead`, {}, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
    }
};