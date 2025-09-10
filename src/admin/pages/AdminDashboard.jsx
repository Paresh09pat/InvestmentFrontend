// AdminDashboard page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiFileText,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiEye
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { INVESTMENT_STATUS, VITE_APP_API_URL } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingVerifications: 0,
    usersWithDocuments: 0,
    totalInvested: 0,
    totalBalance: 0,
    monthlyGrowth: 0,
    platformHealth: 'Good'
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch stats and recent users in parallel
      const [statsResponse, usersResponse] = await Promise.all([
        axios.get(`${VITE_APP_API_URL}/api/auth/admin/stats`, { withCredentials: true }),
        axios.get(`${VITE_APP_API_URL}/api/auth/admin/recent-users`, { withCredentials: true })
      ]);

      setStats(statsResponse.data.stats);
      setRecentUsers(usersResponse.data.users.slice(0, 5)); // Get only first 5 for display
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      
      toast.error('Failed to load dashboard data. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllUsers = () => {
      toast.info('Navigating to User Management...', {
      position: "top-right",
      autoClose: 2000,
    });
    navigate('/admin/users');
  };

  const handleViewPendingVerifications = () => {
    toast.info('Navigating to Document Verification...', {
      position: "top-right",
      autoClose: 2000,
    });
    navigate('/admin/documents');
  };

  const handleViewAllStats = () => {
    toast.info('Navigating to User Management...', {
      position: "top-right",
      autoClose: 2000,
    });
    navigate('/admin/users');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };


  const userColumns = [
    {
      key: 'name',
      title: 'Name',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">{value.charAt(0)}</span>
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { key: 'email', title: 'Email' },
    { 
      key: 'joinDate', 
      title: 'Join Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'verificationStatus', 
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'verified' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    }
  ];


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of platform performance and recent activities
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline">
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="animate-slide-up cursor-pointer group" onClick={handleViewAllStats}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <div className="flex items-center space-x-1 mt-1">
                <FiArrowUp className="text-green-500" size={14} />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
              <FiUsers className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Investments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalInvested)}</p>
              <div className="flex items-center space-x-1 mt-1">
                <FiArrowUp className="text-green-500" size={14} />
                <span className="text-sm text-green-600">+{stats.monthlyGrowth}% growth</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-green-600 text-2xl font-bold">₹</span>
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
              <div className="flex items-center space-x-1 mt-1">
                <FiActivity className="text-blue-500" size={14} />
                <span className="text-sm text-blue-600">{stats.usersWithDocuments} with documents</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiTrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up cursor-pointer group" style={{ animationDelay: '0.3s' }} onClick={handleViewPendingVerifications}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
              <div className="flex items-center space-x-1 mt-1">
                <FiFileText className="text-yellow-500" size={14} />
                <span className="text-sm text-yellow-600">Need review</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full group-hover:bg-yellow-200 transition-colors">
              <FiFileText className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Completed Investments</span>
              <span className="font-medium">{stats.completedInvestments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Returns Paid</span>
              <span className="font-medium text-green-600">{formatCurrency(stats.totalReturns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Growth</span>
              <span className="font-medium text-blue-600">+{stats.monthlyGrowth}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Health</span>
              <span className="font-medium text-green-600">Excellent</span>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Investment Distribution */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Basic Plan</span>
                </div>
                <span className="text-sm font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Premium Plan</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Elite Plan</span>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Button 
              variant="outline" 
              size="small" 
              icon={<FiEye />}
              onClick={handleViewAllUsers}
            >
              View All
            </Button>
          </div>
          {recentUsers.length > 0 ? (
            <Table columns={userColumns} data={recentUsers} />
          ) : (
            <div className="text-center py-8">
              <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </Card>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
