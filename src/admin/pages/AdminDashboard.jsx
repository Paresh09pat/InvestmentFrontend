// AdminDashboard page
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiArrowDown,
  FiArrowUp,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { VITE_APP_API_URL } from '../../utils/constants';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/api/analytics/dashboard`, { 
        withCredentials: true,
        params: { period: selectedPeriod }
      });
      console.log('Dashboard API Response:', response.data);
      setDashboardData(response.data.data);
      
      if (isRefresh) {
        toast.success('Dashboard data refreshed successfully', {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Use mock data if API fails
      setDashboardData(getMockDashboardData());
      
      toast.error('Using mock data - API connection failed', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data for testing charts
  const getMockDashboardData = () => {
    return {
      overview: {
        totalUsers: 10,
        newUsers: 10,
        verifiedUsers: 4,
        totalInvestment: 6400,
        totalTransactions: 11,
        totalTraders: 4,
        totalSubscriptions: 3,
        totalTransactionHistory: 1,
        userGrowthRate: 100,
        verificationRate: 40,
        platformHealthScore: 63.82
      },
      users: {
        stats: {
          totalUsers: 10,
          verifiedUsers: 4,
          pendingUsers: 0,
          rejectedUsers: 1,
          unverifiedUsers: 5
        },
        verificationDistribution: [
          { _id: "rejected", count: 1 },
          { _id: "verified", count: 4 },
          { _id: "unverified", count: 5 }
        ],
        registrationTrends: [
          { _id: { year: 2025, month: 9 }, count: 10 }
        ]
      },
      financial: {
        portfolioStats: {
          totalPortfolios: 2,
          totalInvested: 22800,
          totalCurrentValue: 28060,
          totalReturns: 5260,
          avgReturnPercentage: 20.9125,
          profitablePortfolios: 2,
          lossMakingPortfolios: 0
        },
        investmentTrends: [
          { _id: { year: 2025, month: 9 }, totalAmount: 5200, depositAmount: 5200, withdrawalAmount: 0 },
          { _id: { year: 2025, month: 10 }, totalAmount: 1200, depositAmount: 1200, withdrawalAmount: 0 }
        ],
        topInvestors: [
          {
            _id: "68be82e07c86b9d265d1b96b",
            name: "Paresh Patil",
            email: "09patilparesh@gmail.com",
            totalInvested: 6400,
            verificationStatus: "verified"
          }
        ]
      },
      transactions: {
        stats: {
          totalTransactions: 11,
          totalAmount: 15600,
          avgAmount: 1418.18,
          maxAmount: 5000,
          minAmount: 500,
          approvedTransactions: 6,
          pendingTransactions: 1,
          rejectedTransactions: 4,
          totalDeposits: 15600,
          totalWithdrawals: 0
        },
        trends: [
          { _id: { year: 2025, month: 9 }, count: 8, totalAmount: 13900, approvedCount: 4, pendingCount: 1, rejectedCount: 3 },
          { _id: { year: 2025, month: 10 }, count: 3, totalAmount: 1700, approvedCount: 2, pendingCount: 0, rejectedCount: 1 }
        ],
        successRate: 54.55
      },
      traders: {
        stats: {
          totalTraders: 4,
          avgExperience: 6,
          maxExperience: 15,
          minExperience: 2,
          avgMinRate: 6.25,
          avgMaxRate: 9.5
        },
        performance: [
          {
            _id: "68d7d5c2765fca593508beb4",
            traderName: "platinum",
            traderType: "platinum",
            totalTransactions: 2,
            totalAmount: 5100,
            successRate: 50
          },
          {
            _id: "68d7d56f765fca593508bea6",
            traderName: "silver",
            traderType: "silver",
            totalTransactions: 5,
            totalAmount: 3200,
            successRate: 60
          }
        ]
      },
      charts: {
        userRegistrationChart: [
          { date: "2025-09", users: 10 },
          { date: "2025-10", users: 5 },
          { date: "2025-11", users: 8 }
        ],
        investmentTrendsChart: [
          { date: "2025-09", deposits: 5200, withdrawals: 0, total: 5200 },
          { date: "2025-10", deposits: 1200, withdrawals: 0, total: 1200 },
          { date: "2025-11", deposits: 3000, withdrawals: 500, total: 2500 }
        ],
        transactionTrendsChart: [
          { date: "2025-09", approved: 4, pending: 1, rejected: 3, total: 8 },
          { date: "2025-10", approved: 2, pending: 0, rejected: 1, total: 3 },
          { date: "2025-11", approved: 6, pending: 2, rejected: 1, total: 9 }
        ],
        verificationDonutChart: [
          { status: "rejected", count: 1 },
          { status: "verified", count: 4 },
          { status: "unverified", count: 5 }
        ],
        transactionStatusDonutChart: [
          { status: "pending", count: 1, amount: 600 },
          { status: "rejected", count: 4, amount: 8600 },
          { status: "approved", count: 6, amount: 6400 }
        ],
        planDistributionDonutChart: [
          { plan: "silver", count: 7, amount: 4300 },
          { plan: "platinum", count: 2, amount: 5100 },
          { plan: "gold", count: 2, amount: 6200 }
        ]
      }
    };
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

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchDashboardData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`;
  };

  // Enhanced chart data processing functions
  const processChartData = (data, type) => {
    if (!data || !Array.isArray(data)) return [];
    
    switch (type) {
      case 'userRegistration':
        return data.map(item => ({
          date: item._id ? 
            `${item._id.year}-${String(item._id.month).padStart(2, '0')}` :
            item.date,
          users: item.count || item.users || 0
        }));
      case 'investmentTrends':
        return data.map(item => ({
          date: item._id ? 
            `${item._id.year}-${String(item._id.month).padStart(2, '0')}` :
            item.date,
          deposits: item.depositAmount || item.deposits || 0,
          withdrawals: item.withdrawalAmount || item.withdrawals || 0,
          total: item.totalAmount || item.total || 0
        }));
      case 'transactionTrends':
        return data.map(item => ({
          date: item._id ? 
            `${item._id.year}-${String(item._id.month).padStart(2, '0')}` :
            item.date,
          approved: item.approvedCount || item.approved || 0,
          pending: item.pendingCount || item.pending || 0,
          rejected: item.rejectedCount || item.rejected || 0,
          total: item.count || item.total || 0
        }));
      default:
        return data;
    }
  };

  // Get chart data with fallback to processed data
  const getChartData = (chartType) => {
    if (!dashboardData?.charts) return [];
    
    const chartData = dashboardData.charts[chartType] || [];
    
    // If chart data is empty, try to process from other data sources
    if (chartData.length === 0) {
      switch (chartType) {
        case 'userRegistrationChart':
          return processChartData(dashboardData.users?.registrationTrends || [], 'userRegistration');
        case 'investmentTrendsChart':
          return processChartData(dashboardData.financial?.investmentTrends || [], 'investmentTrends');
        case 'transactionTrendsChart':
          return processChartData(dashboardData.transactions?.trends || [], 'transactionTrends');
        default:
          return chartData;
      }
    }
    
    return chartData;
  };


  // Beautiful Distribution Card Component
  const DistributionCard = ({ data, title, colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'], icon }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            {icon}
            <p className="text-gray-500 text-sm mt-2">No data available</p>
          </div>
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + (item.count || item.amount || 0), 0);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => {
            const value = item.count || item.amount || 0;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const label = item.status || item.type || item.plan || 'Unknown';
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.count ? `${value} (${percentage.toFixed(1)}%)` : formatCurrency(value)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Beautiful Trend Card Component
  const TrendCard = ({ data, title, icon, color, formatValue, dataKey }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            {icon}
            <p className="text-gray-500 text-sm mt-2">No data available</p>
          </div>
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const change = previous ? ((latest[dataKey] - previous[dataKey]) / previous[dataKey]) * 100 : 0;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color.bg}`}>
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">{title}</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatValue ? formatValue(total) : total}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <FiArrowUp size={16} /> : <FiArrowDown size={16} />}
              <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
            </div>
            <p className="text-xs text-gray-500">vs last period</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {data.map((item, index) => {
            const value = item[dataKey] || 0;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.date}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${color.bar}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {formatValue ? formatValue(value) : value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Beautiful Multi-Series Trend Card
  const MultiTrendCard = ({ data, title, icon, series = [], formatValue }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            {icon}
            <p className="text-gray-500 text-sm mt-2">No data available</p>
          </div>
        </div>
      );
    }

    const totals = series.reduce((acc, s) => {
      acc[s.key] = data.reduce((sum, item) => sum + (item[s.key] || 0), 0);
      return acc;
    }, {});
    
    const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600">
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">{title}</h4>
              <p className="text-2xl font-bold text-gray-900">
                {formatValue ? formatValue(grandTotal) : grandTotal}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {series.map((s, index) => {
            const total = totals[s.key];
            const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: s.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatValue ? formatValue(total) : total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: s.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-500">{item.date}</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatValue ? formatValue(item.total || Object.values(item).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0)) : 
                   item.total || Object.values(item).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm lg:text-base text-gray-600">
              Overview of platform performance and recent activities
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <FiCalendar className="text-gray-500" size={16} />
              <select 
                value={selectedPeriod} 
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            
            {/* Refresh Button */}
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={16} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
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
      {!loading && !error && dashboardData && (
        <>
          {/* Primary Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            <Card hover className="animate-slide-up cursor-pointer group" onClick={handleViewAllStats}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.totalUsers)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiArrowUp className="text-green-500" size={12} />
                    <span className="text-xs lg:text-sm text-green-600">+{formatPercentage(dashboardData.overview.userGrowthRate)} growth</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-full group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <FiUsers className="text-blue-600" size={20} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.overview.totalInvestment)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiDollarSign className="text-green-500" size={14} />
                    <span className="text-sm text-green-600">{formatNumber(dashboardData.financial.portfolioStats.totalPortfolios)} portfolios</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiDollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.transactions.stats.totalTransactions)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiCreditCard className="text-indigo-500" size={14} />
                    <span className="text-sm text-indigo-600">{formatPercentage(dashboardData.transactions.successRate)} success rate</span>
                  </div>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FiCreditCard className="text-indigo-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.totalSubscriptions)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiPackage className="text-purple-500" size={14} />
                    <span className="text-sm text-purple-600">Active plans</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiPackage className="text-purple-600" size={24} />
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            <Card hover className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Users</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.verifiedUsers)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiActivity className="text-blue-500" size={14} />
                    <span className="text-sm text-blue-600">{formatPercentage(dashboardData.overview.verificationRate)} verification rate</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiTrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Traders</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.totalTraders)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiBarChart2 className="text-orange-500" size={14} />
                    <span className="text-sm text-orange-600">{formatNumber(dashboardData.traders.stats.avgExperience)} years avg experience</span>
                  </div>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FiBarChart2 className="text-orange-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Returns</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.financial.portfolioStats.totalReturns)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiTrendingUp className="text-green-500" size={14} />
                    <span className="text-sm text-green-600">{formatPercentage(dashboardData.financial.portfolioStats.avgReturnPercentage)} avg return</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiTrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform Health</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.platformHealthScore)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <FiActivity className="text-green-500" size={14} />
                    <span className="text-sm text-green-600">Good</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiActivity className="text-green-600" size={24} />
                </div>
              </div>
            </Card>
          </div>

          {/* Beautiful Trends Section */}
          <div className="space-y-6">
            {/* Main Trends Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Registration Trends */}
              <Card className="animate-slide-up bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" style={{ animationDelay: '0.8s' }}>
                <TrendCard 
                  data={getChartData('userRegistrationChart')}
                  title="User Registration Trends"
                  icon={<FiUsers className="text-white" size={20} />}
                  color={{
                    bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
                    bar: "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }}
                  dataKey="users"
                  formatValue={(value) => `${value} users`}
                />
              </Card>

              {/* Investment Trends */}
              <Card className="animate-slide-up bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" style={{ animationDelay: '0.9s' }}>
                <MultiTrendCard 
                  data={getChartData('investmentTrendsChart')}
                  title="Investment Trends"
                  icon={<FiTrendingUp className="text-white" size={20} />}
                  series={[
                    { key: 'deposits', label: 'Deposits', color: '#10B981' },
                    { key: 'withdrawals', label: 'Withdrawals', color: '#EF4444' }
                  ]}
                  formatValue={formatCurrency}
                />
              </Card>
            </div>

            {/* Transaction Trends - Full Width */}
            <Card className="animate-slide-up bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200" style={{ animationDelay: '1.0s' }}>
              <MultiTrendCard 
                data={getChartData('transactionTrendsChart')}
                title="Transaction Trends"
                icon={<FiCreditCard className="text-white" size={20} />}
                series={[
                  { key: 'approved', label: 'Approved', color: '#10B981' },
                  { key: 'pending', label: 'Pending', color: '#F59E0B' },
                  { key: 'rejected', label: 'Rejected', color: '#EF4444' }
                ]}
                formatValue={(value) => `${value} transactions`}
              />
            </Card>
          </div>

          {/* Beautiful Distribution Cards Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Data Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Verification Status */}
              <Card className="animate-slide-up bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" style={{ animationDelay: '1.2s' }}>
                <DistributionCard 
                  data={getChartData('verificationDonutChart')}
                  title="User Verification Status"
                  colors={['#10B981', '#F59E0B', '#EF4444']}
                  icon={<FiUsers className="text-white" size={20} />}
                />
              </Card>

              {/* Transaction Status */}
              <Card className="animate-slide-up bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" style={{ animationDelay: '1.3s' }}>
                <DistributionCard 
                  data={getChartData('transactionStatusDonutChart')}
                  title="Transaction Status"
                  colors={['#10B981', '#F59E0B', '#EF4444']}
                  icon={<FiCreditCard className="text-white" size={20} />}
                />
              </Card>

              {/* Plan Distribution */}
              <Card className="animate-slide-up bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" style={{ animationDelay: '1.4s' }}>
                <DistributionCard 
                  data={getChartData('planDistributionDonutChart')}
                  title="Plan Distribution"
                  colors={['#F59E0B', '#6B7280', '#8B5CF6']}
                  icon={<FiPackage className="text-white" size={20} />}
                />
              </Card>

              {/* Trader Type Distribution */}
              <Card className="animate-slide-up bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200" style={{ animationDelay: '1.5s' }}>
                <DistributionCard 
                  data={getChartData('traderTypeDonutChart')}
                  title="Trader Types"
                  colors={['#6B7280', '#8B5CF6', '#F59E0B']}
                  icon={<FiAward className="text-white" size={20} />}
                />
              </Card>


              {/* Transaction Type Distribution */}
              <Card className="animate-slide-up bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200" style={{ animationDelay: '1.7s' }}>
                <DistributionCard 
                  data={getChartData('transactionTypeDonutChart')}
                  title="Transaction Types"
                  colors={['#3B82F6', '#10B981', '#F59E0B']}
                  icon={<FiActivity className="text-white" size={20} />}
                />
              </Card>
            </div>
          </div>

          {/* Top Investors Section */}
          <Card className="animate-slide-up" style={{ animationDelay: '1.8s' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Investors</h3>
            {dashboardData.financial.topInvestors && dashboardData.financial.topInvestors.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.financial.topInvestors.map((investor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {investor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{investor.name}</p>
                        <p className="text-xs text-gray-500">{investor.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(investor.totalInvested)}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        investor.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        investor.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {investor.verificationStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No top investors data available</p>
              </div>
            )}
          </Card>

          {/* Trader Performance Section */}
          <Card className="animate-slide-up" style={{ animationDelay: '1.9s' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trader Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.traders.performance.map((trader, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trader.traderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          trader.traderType === 'platinum' ? 'bg-purple-100 text-purple-800' :
                          trader.traderType === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trader.traderType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(trader.totalTransactions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(trader.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            trader.successRate >= 80 ? 'text-green-600' :
                            trader.successRate >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {formatPercentage(trader.successRate)}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                trader.successRate >= 80 ? 'bg-green-500' :
                                trader.successRate >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${trader.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Enhanced Detailed Statistics Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Detailed Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Portfolio Statistics */}
              <Card className="animate-slide-up" style={{ animationDelay: '2.0s' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Portfolio Stats</h3>
                  <FiTarget className="text-blue-600" size={20} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Portfolios</span>
                    <span className="font-medium">{formatNumber(dashboardData.financial.portfolioStats.totalPortfolios)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Invested</span>
                    <span className="font-medium text-blue-600">{formatCurrency(dashboardData.financial.portfolioStats.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Current Value</span>
                    <span className="font-medium text-green-600">{formatCurrency(dashboardData.financial.portfolioStats.totalCurrentValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Returns</span>
                    <span className="font-medium text-green-600">{formatCurrency(dashboardData.financial.portfolioStats.totalReturns)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Avg Return</span>
                    <span className="font-medium text-green-600">{formatPercentage(dashboardData.financial.portfolioStats.avgReturnPercentage)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Profitable</span>
                    <span className="font-medium text-green-600">{formatNumber(dashboardData.financial.portfolioStats.profitablePortfolios)}</span>
                  </div>
                </div>
              </Card>

            {/* Transaction Statistics */}
            <Card className="animate-slide-up" style={{ animationDelay: '2.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Stats</h3>
                <FiCreditCard className="text-indigo-600" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Transactions</span>
                  <span className="font-medium">{formatNumber(dashboardData.transactions.stats.totalTransactions)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Amount</span>
                  <span className="font-medium text-blue-600">{formatCurrency(dashboardData.transactions.stats.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Average Amount</span>
                  <span className="font-medium text-green-600">{formatCurrency(dashboardData.transactions.stats.avgAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Max Amount</span>
                  <span className="font-medium text-purple-600">{formatCurrency(dashboardData.transactions.stats.maxAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Min Amount</span>
                  <span className="font-medium text-orange-600">{formatCurrency(dashboardData.transactions.stats.minAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Success Rate</span>
                  <span className="font-medium text-green-600">{formatPercentage(dashboardData.transactions.successRate)}</span>
                </div>
              </div>
            </Card>

            {/* User Statistics */}
            <Card className="animate-slide-up" style={{ animationDelay: '2.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Stats</h3>
                <FiUsers className="text-blue-600" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Users</span>
                  <span className="font-medium">{formatNumber(dashboardData.users.stats.totalUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Verified Users</span>
                  <span className="font-medium text-green-600">{formatNumber(dashboardData.users.stats.verifiedUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Unverified Users</span>
                  <span className="font-medium text-yellow-600">{formatNumber(dashboardData.users.stats.unverifiedUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Rejected Users</span>
                  <span className="font-medium text-red-600">{formatNumber(dashboardData.users.stats.rejectedUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Pending Users</span>
                  <span className="font-medium text-blue-600">{formatNumber(dashboardData.users.stats.pendingUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Verification Rate</span>
                  <span className="font-medium text-green-600">{formatPercentage(dashboardData.overview.verificationRate)}</span>
                </div>
              </div>
            </Card>

            {/* Trader Statistics */}
            <Card className="animate-slide-up" style={{ animationDelay: '2.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Trader Stats</h3>
                <FiAward className="text-orange-600" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Traders</span>
                  <span className="font-medium">{formatNumber(dashboardData.traders.stats.totalTraders)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Avg Experience</span>
                  <span className="font-medium text-blue-600">{formatNumber(dashboardData.traders.stats.avgExperience)} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Max Experience</span>
                  <span className="font-medium text-green-600">{formatNumber(dashboardData.traders.stats.maxExperience)} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Min Experience</span>
                  <span className="font-medium text-orange-600">{formatNumber(dashboardData.traders.stats.minExperience)} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Avg Min Rate</span>
                  <span className="font-medium text-purple-600">{formatPercentage(dashboardData.traders.stats.avgMinRate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Avg Max Rate</span>
                  <span className="font-medium text-green-600">{formatPercentage(dashboardData.traders.stats.avgMaxRate)}</span>
                </div>
              </div>
            </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
