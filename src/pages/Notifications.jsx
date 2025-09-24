// Notifications page
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiBell,
  FiCheck,
  FiX,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiTrash2,
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Navbar from "../components/common/Navbar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/forms/Input";
import axios from "axios";
import { VITE_APP_API_URL } from "../utils/constants";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const notificationsRef = useRef(null);
  const loaderRef = useRef(null);
  const { checkAuthStatus } = useAuth();
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      case "info":
        return <FiInfo className="text-blue-500" size={20} />;
      default:
        return <FiBell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationBg = (type, read) => {
    const baseClasses = read
      ? "bg-white border-gray-200"
      : "bg-blue-50 border-blue-200 shadow-sm";
    const borderClasses = {
      success: "border-l-green-500",
      warning: "border-l-yellow-500",
      info: "border-l-blue-500",
      default: "border-l-gray-500",
    };
    return `${baseClasses} ${
      borderClasses[type] || borderClasses.default
    } border-l-4 border`;
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${VITE_APP_API_URL}/api/auth/notifications/read/${id}`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      await checkAuthStatus();
      toast.success("Notification marked as read successfully");
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${VITE_APP_API_URL}/api/auth/notifications/mark-all-as-read`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      toast.success("All notifications marked as read successfully");
      await checkAuthStatus();
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${VITE_APP_API_URL}/api/auth/notifications/delete/${id}`,
        { withCredentials: true }
      );

      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      setTotal((prev) => prev - 1);
      await checkAuthStatus();
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(
        `${VITE_APP_API_URL}/api/auth/notifications/delete-all`,
        { withCredentials: true }
      );

      setNotifications([]);
      setTotal(0);
      await checkAuthStatus();
      toast.success("All notifications cleared successfully");
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
      toast.error("Failed to clear all notifications");
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.read) ||
      (filter === "read" && notif.read);

    const matchesSearch =
      searchTerm === "" ||
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getNotifications = useCallback(
    async (pageNumber = 1, append = false) => {
      try {
        if (pageNumber === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await axios.get(
          `${VITE_APP_API_URL}/api/auth/notifications?page=${pageNumber}&limit=10`,
          { withCredentials: true }
        );

        if (pageNumber === 1 || !append) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...response.data.notifications]);
        }

        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setTotal(response.data.total);
      } catch (error) {
        toast.error("Failed to fetch notifications");
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const loadMoreNotifications = useCallback(() => {
    if (currentPage < totalPages && !loadingMore) {
      getNotifications(currentPage + 1, true);
    }
  }, [currentPage, totalPages, loadingMore, getNotifications]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          currentPage < totalPages &&
          !loadingMore
        ) {
          loadMoreNotifications();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [currentPage, totalPages, loadingMore, loadMoreNotifications]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="pt-20 pb-8">
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          ref={notificationsRef}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  Stay updated with your investment activities
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                  {total > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      {total} total notifications
                    </span>
                  )}
                </p>
              </div>

              {notifications.length > 0 && (
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="small"
                      onClick={markAllAsRead}
                      icon={<FiCheck />}
                    >
                      Mark All Read
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="small"
                    onClick={clearAllNotifications}
                    icon={<FiTrash2 />}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<FiSearch />}
                />
              </div>

              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => (
                <Card
                  key={notification._id}
                  className={`
                    ${getNotificationBg("default", notification.read)}
                    hover:shadow-md transition-all duration-200 animate-slide-up cursor-pointer
                    ${!notification.read ? "ring-1 ring-blue-200" : ""}
                    hover:${
                      !notification.read ? "ring-blue-300" : "ring-gray-200"
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() =>
                    !notification.read && markAsRead(notification._id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("info")}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`${
                              notification.read
                                ? "font-medium text-gray-700"
                                : "font-bold text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            </div>
                          )}
                        </div>

                        <p
                          className={`text-sm ${
                            notification.read
                              ? "text-gray-600"
                              : "text-gray-800 font-medium"
                          } mb-2`}
                        >
                          {notification.message}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                          title="Mark as read"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                        title="Delete notification"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Load More Section */}
              {currentPage < totalPages && (
                <div ref={loaderRef} className="flex justify-center py-4">
                  {loadingMore ? (
                    <LoadingSpinner size="md" />
                  ) : (
                    <Button
                      variant="outline"
                      onClick={loadMoreNotifications}
                      disabled={loadingMore}
                    >
                      Load More Notifications
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination Info */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 py-4 text-sm text-gray-600">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <span>•</span>
                  <span>{total} total notifications</span>
                </div>
              )}
            </div>
          ) : (
            <Card className="text-center py-12 animate-fade-in">
              <FiBell className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== "all"
                  ? "No matching notifications"
                  : "No notifications"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You're all caught up! New notifications will appear here."}
              </p>
              {(searchTerm || filter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
