import { createContext, useContext, useState, useEffect } from "react";
import { generateDummyAdminNotifications } from "../utils/adminNotificationDummyData";

const AdminNotificationContext = createContext();

export const AdminNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize with dummy data only once
  useEffect(() => {
    if (notifications.length === 0) {
      const dummyNotifications = generateDummyAdminNotifications();
      setNotifications(dummyNotifications);
      const unreadCount = dummyNotifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    }
  }, [notifications.length]);

  const getNotifications = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allNotifications = generateDummyAdminNotifications();
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const newNotifications = allNotifications.slice(startIndex, endIndex);
      
      if (page === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
      
      const unreadCount = allNotifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
      
      return { 
        notifications: newNotifications, 
        total: allNotifications.length, 
        unreadCount 
      };
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setNotificationCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Decrease count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.read) {
        setNotificationCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      throw error;
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setNotifications([]);
      setNotificationCount(0);
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
      throw error;
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setNotificationCount(prev => prev + 1);
    }
  };

  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  const refreshNotifications = async () => {
    try {
      // Re-initialize with fresh dummy data
      const dummyNotifications = generateDummyAdminNotifications();
      setNotifications(dummyNotifications);
      const unreadCount = dummyNotifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  };

  const value = {
    notifications,
    notificationCount,
    loading,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    updateNotificationCount,
    refreshNotifications,
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error("useAdminNotifications must be used within an AdminNotificationProvider");
  }
  return context;
};
