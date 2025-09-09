// Notifications page
import { useState } from 'react';
import { 
  FiBell, 
  FiCheck, 
  FiX, 
  FiInfo, 
  FiAlertCircle, 
  FiCheckCircle,
  FiTrash2,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import { dummyNotifications } from '../utils/dummyData';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/forms/Input';

const Notifications = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      case 'info':
        return <FiInfo className="text-blue-500" size={20} />;
      default:
        return <FiBell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationBg = (type, read) => {
    const baseClasses = read ? 'bg-white' : 'bg-blue-50';
    const borderClasses = {
      success: 'border-l-green-500',
      warning: 'border-l-yellow-500',
      info: 'border-l-blue-500',
      default: 'border-l-gray-500'
    };
    return `${baseClasses} ${borderClasses[type] || borderClasses.default} border-l-4`;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notif.read) ||
      (filter === 'read' && notif.read) ||
      notif.type === filter;
    
    const matchesSearch = searchTerm === '' ||
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <option value="success">Success</option>
                  <option value="warning">Warnings</option>
                  <option value="info">Information</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => (
                <Card
                  key={notification.id}
                  className={`
                    ${getNotificationBg(notification.type, notification.read)}
                    hover:shadow-md transition-all duration-200 animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'} mb-2`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                          title="Mark as read"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                        title="Delete notification"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 animate-fade-in">
              <FiBell className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== 'all' ? 'No matching notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You\'re all caught up! New notifications will appear here.'
                }
              </p>
              {(searchTerm || filter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
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
