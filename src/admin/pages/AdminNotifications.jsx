import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  FiBell,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Card from "../../components/common/Card";
import { VITE_APP_API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { formatDateTime, formatDateForTable } from "../../utils/dateUtils";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { checkAuthStatus } = useAuth();
  const observerRef = useRef();
  const limit = 10;


  const getNotificationIcon = (type) => {
    switch (type) {
      case "document_verification":
        return <FiFileText className="text-blue-500" size={20} />;
      case "deposit":
        return <FiDollarSign className="text-green-500" size={20} />;
      case "withdrawal":
        return <FiDollarSign className="text-orange-500" size={20} />;
      case "user_registration":
        return <FiUser className="text-purple-500" size={20} />;
      case "investment":
        return <FiTrendingUp className="text-indigo-500" size={20} />;
      case "security":
        return <FiShield className="text-red-500" size={20} />;
      default:
        return <FiBell className="text-gray-500" size={20} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return formatDateForTable(dateString).date;
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const fetchNotifications = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const res = await axios.get(`${VITE_APP_API_URL}/api/admin/notifications/admin`, {
        params: { page, limit },
        withCredentials: true
      });
      
      const { notifications: newNotifications, pagination } = res.data;
      
      if (append) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }
      
      setTotalCount(pagination.totalItems);
      setHasMore(pagination.hasNextPage);
      setCurrentPage(pagination.currentPage);
      
    } catch (err) {
      console.log("err", err);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Infinite scroll observer
  const lastNotificationElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNotifications(currentPage + 1, true);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, currentPage]);

  const handleReadNotification = async (id) => {
    setLoading(true);
    try {
      const res = await axios.put(`${VITE_APP_API_URL}/api/admin/notifications/admin/${id}`, {}, { withCredentials: true });

      if (res.status === 200) {
        setNotifications(prev => prev.map(notif => notif._id === id ? { ...notif, read: true } : notif));
        checkAuthStatus();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark notification as read");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (ids) => {
    try {
      const res = await axios.delete(`${VITE_APP_API_URL}/api/admin/notifications/admin`, {
        data: { ids: Array.isArray(ids) ? ids : ids },
        withCredentials: true
      });

      if (res.status === 200) {
        if (Array.isArray(ids)) {
          setNotifications(prev => prev.filter(notif => !ids.includes(notif._id)));
          setSelectedNotifications([]);
          setIsSelectMode(false);
        } else {
          setNotifications(prev => prev.filter(notif => notif._id !== ids));
        }
        toast.success(Array.isArray(ids) ? "Notifications deleted successfully" : "Notification deleted successfully");
        checkAuthStatus();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete notification(s)");
    }
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(notif => notif._id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length > 0) {
      handleDeleteNotification(selectedNotifications);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <LoadingSpinner/>}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with system activities and user requests
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {!isSelectMode ? (
              <button
                onClick={() => setIsSelectMode(true)}
                className="flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Select
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsSelectMode(false);
                    setSelectedNotifications([]);
                  }}
                  className="flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiX className="w-4 h-4 mr-1" />
                  Cancel
                </button>
                {selectedNotifications.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Delete ({selectedNotifications.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Select All Checkbox */}
        {isSelectMode && notifications.length > 0 && (
          <div className="mt-4 flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedNotifications.length === notifications.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select all ({notifications.length} notifications)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <Card
              key={notification._id}
              className={`p-6 hover:shadow-md transition-all duration-200 ${
                !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-white"
              } ${selectedNotifications.includes(notification._id) ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => {
                if (isSelectMode) {
                  handleSelectNotification(notification._id);
                } else if (!notification.read) {
                  handleReadNotification(notification._id);
                }
              }}
              ref={index === notifications.length - 1 ? lastNotificationElementRef : null}
            >
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                {isSelectMode && (
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() => handleSelectNotification(notification._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className={`${
                        notification.read
                          ? "font-medium text-gray-700"
                          : "font-bold text-gray-900"
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    
                    {/* Delete Button */}
                    {!isSelectMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete notification"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className={`text-sm ${
                    notification.read
                      ? "text-gray-600"
                      : "text-gray-800"
                  } mb-2`}>
                    {notification.message}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div>
                      <div>{formatDateForTable(notification.createdAt).date}</div>
                      <div className="text-xs text-gray-400">{formatDateForTable(notification.createdAt).time}</div>
                    </div>
                    {notification.userName && (
                      <span>• User: {notification.userName}</span>
                    )}
                    {notification.amount && (
                      <span>• Amount: ${notification.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading more notifications...</span>
            </div>
          )}
          
          {/* End of List Indicator */}
          {!hasMore && notifications.length > 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              You've reached the end of the notifications list
            </div>
          )}
        </div>
      ) : (
        <Card className="text-center py-12">
          <FiBell className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-600">
            You're all caught up! New notifications will appear here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AdminNotifications;
