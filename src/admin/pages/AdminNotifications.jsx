import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiBell,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import Card from "../../components/common/Card";
import { VITE_APP_API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { checkAuthStatus } = useAuth();


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
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const fetchNotifications = async()=>{
    setLoading(true)
    try{
      const res = await axios.get(`${VITE_APP_API_URL}/api/admin/notifications/admin`, { withCredentials: true })
      setNotifications(res.data.notifications)

    }
    catch(err){
      console.log("err",err)
    }
    finally{
      setLoading(false)
    }
  }

    // Load notifications on component mount
    useEffect(() => {

      fetchNotifications()
    }, []);

    const handleReadNotification =async(id)=>{
      setLoading(true)
      try{
        const res = await axios.put(`${VITE_APP_API_URL}/api/admin/notifications/admin/${id}`, { withCredentials: true })

        if(res.status === 200){
          setNotifications(prev => prev.map(notif => notif._id === id ? { ...notif, read: true } : notif))
          fetchNotifications()
          checkAuthStatus()
        }

      }
      catch(err){
        console.log(err)
        toast.error("Failed to mark notification as read")
      }finally{
        setLoading(false)
      }
    }

  return (
    <div className="space-y-6">
    {loading && <LoadingSpinner/>}
      {/* Header */}
      <div className="mb-8">
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
              }`}
              onClick={() => !notification.read && handleReadNotification(notification._id)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
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

                  <p className={`text-sm ${
                    notification.read
                      ? "text-gray-600"
                      : "text-gray-800"
                  } mb-2`}>
                    {notification.message}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatDate(notification.createdAt)}</span>
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
