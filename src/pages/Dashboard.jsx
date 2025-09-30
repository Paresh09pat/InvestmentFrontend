// Dashboard page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiActivity,
  FiPlus,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiBarChart
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, ScatterChart, Scatter } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dummyInvestments } from '../utils/dummyData';
import { INVESTMENT_STATUS, USER_VERIFICATION_STATUS } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import axios from 'axios';
import { VITE_APP_API_URL } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userInvestments, setUserInvestments] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [stats, setStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalReturns: 0,
    totalReturnsPercentage: 0,
    activeInvestments: 0
  });

  useEffect(() => {
    // Only use dummy data if no portfolio data is available
    if (!portfolio) {
    const investments = dummyInvestments.filter(inv => inv.userId === user?.id);
    setUserInvestments(investments);
    }
  }, [user, portfolio]);

  const getStatusIcon = (status) => {
    switch (status) {
      case INVESTMENT_STATUS.ACTIVE:
        return <FiActivity className="text-green-500" />;
      case INVESTMENT_STATUS.COMPLETED:
        return <FiCheckCircle className="text-blue-500" />;
      case INVESTMENT_STATUS.PENDING:
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiAlertCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case INVESTMENT_STATUS.ACTIVE:
        return 'text-green-600 bg-green-100';
      case INVESTMENT_STATUS.COMPLETED:
        return 'text-blue-600 bg-blue-100';
      case INVESTMENT_STATUS.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateReturnsPercentage = () => {
    if (stats.totalInvested === 0) return 0;
    return stats.totalReturnsPercentage.toFixed(2);
  };

  // Interactive chart component for price history
  const PriceHistoryChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Get the current total invested from portfolio data
    const currentTotalInvested = portfolio?.totalInvested || stats.totalInvested;

    // Transform data for Recharts
    const chartData = data.map((point, index) => {
      const date = new Date(point.updatedAt);
      return {
        time: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timeShort: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }),
        timeFull: date.toLocaleString(),
        value: point.value, // This is the actual API value from priceHistory
        date: date.toLocaleDateString(),
        fullDate: date.toLocaleString(),
        profitLoss: point.value - currentTotalInvested,
        profitLossPercentage: ((point.value - currentTotalInvested) / currentTotalInvested) * 100,
        timestamp: date.getTime(),
        originalData: point, // Keep reference to original API data
        // Add unique identifier for tooltip matching
        id: point._id || index
      };
    }).sort((a, b) => a.timestamp - b.timestamp);

    // Debug logging to verify chart data
    console.log('Chart Data Debug:', chartData);
    console.log('Original API Data:', data);
    console.log('Chart Data Values:', chartData.map(item => ({ value: item.value, time: item.timeShort })));


    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
     const isPositive = stats.totalReturns >= 0;
    
    // Calculate proper Y-axis domain
    const yAxisMin = Math.min(minValue, currentTotalInvested) * 0.95;
    const yAxisMax = Math.max(maxValue, currentTotalInvested) * 1.05;

    // Custom tooltip component for ScatterChart
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        const value = payload[0].value;
        
        console.log('ScatterChart Tooltip - Data:', data);
        console.log('ScatterChart Tooltip - Value:', value);
        console.log('ScatterChart Tooltip - Original Data:', data.originalData);
        
        return (
          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <p className="text-sm font-semibold text-gray-900">{data.timeShort}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                {data.fullDate}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Portfolio Value:</span>
                <span className="text-sm font-bold text-gray-900">
                  ${data.originalData.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-200/50 backdrop-blur-sm">
        {/* Header with enhanced styling */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiBarChart className="text-blue-600" size={20} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Portfolio Performance</h4>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{data.length} updates</span>
              </span>
              <span>•</span>
              <span>Invested: <span className="font-semibold text-gray-900">${currentTotalInvested.toLocaleString()}</span></span>
              <span>•</span>
               <span>Current: <span className="font-semibold text-gray-900">${stats.currentValue.toLocaleString()}</span></span>
            </div>
            <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
              📅 {new Date(data[0]?.updatedAt).toLocaleDateString()} → {new Date(data[data.length - 1]?.updatedAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Range: ${minValue.toLocaleString()} - ${maxValue.toLocaleString()}
            </p>
          </div>
          
          {/* Performance indicator */}
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
            isPositive 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`p-2 rounded-lg ${
              isPositive ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPositive ? (
                <FiTrendingUp className="text-green-600" size={20} />
              ) : (
                <FiTrendingUp className="text-red-600" size={20} style={{ transform: 'rotate(180deg)' }} />
              )}
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                {isPositive ? 'Profit' : 'Loss'}
              </p>
               <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                 {Math.abs(stats.totalReturnsPercentage).toFixed(1)}%
               </p>
            </div>
          </div>
        </div>
        
        {/* Chart container with enhanced styling */}
        <div className="bg-white rounded-xl p-4 shadow-inner border border-gray-100">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 50,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="#e5e7eb" 
                  strokeOpacity={0.3}
                />
                
                <XAxis 
                  type="category"
                  dataKey="timeShort"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                
                <YAxis 
                  type="number"
                  dataKey="value"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `$${(value / 1000).toFixed(1)}k`;
                    }
                    return `$${value}`;
                  }}
                  domain={[yAxisMin, yAxisMax]}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ 
                    stroke: isPositive ? '#10b981' : '#ef4444', 
                    strokeWidth: 2, 
                    strokeDasharray: '5 5',
                    strokeOpacity: 0.6
                  }}
                />
                
                 {/* Portfolio value line */}
                 <Line
                   type="monotone"
                   dataKey="value"
                   stroke={isPositive ? "#10b981" : "#ef4444"}
                   strokeWidth={3}
                   dot={false}
                   activeDot={false}
                   connectNulls={false}
                 />
                 
                 {/* Portfolio value points */}
                 <Scatter
                   dataKey="value"
                   fill={isPositive ? "#10b981" : "#ef4444"}
                   r={6}
                   stroke="#fff"
                   strokeWidth={2}
                 />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Enhanced stats cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiDollarSign className="text-white" size={16} />
            </div>
            <p className="text-xs font-medium text-blue-700 mb-1">Total Invested</p>
            <p className="text-lg font-bold text-blue-900">
              ${currentTotalInvested.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center border border-gray-200">
            <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiTrendingUp className="text-white" size={16} />
            </div>
            <p className="text-xs font-medium text-gray-700 mb-1">Current Value</p>
             <p className="text-lg font-bold text-gray-900">
               ${stats.currentValue.toLocaleString()}
             </p>
          </div>
          
          <div className={`rounded-xl p-4 text-center border ${
            isPositive 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
              : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${
              isPositive ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isPositive ? (
                <FiTrendingUp className="text-white" size={16} />
              ) : (
                <FiTrendingUp className="text-white" size={16} style={{ transform: 'rotate(180deg)' }} />
              )}
            </div>
            <p className={`text-xs font-medium mb-1 ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              {isPositive ? 'Profit' : 'Loss'}
            </p>
             <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
               {isPositive ? '+' : ''}${stats.totalReturns.toLocaleString()}
             </p>
          </div>
        </div>
      </div>
    );
  };

  const getPortfolioSummary = async () => {
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/api/auth/portfolio`, {
        withCredentials: true
      });
      
      if (response.data && response.data.portfolio) {
        const portfolioData = response.data.portfolio;
        setPortfolio(portfolioData);
        
        // Set price history data
        if (portfolioData.priceHistory && portfolioData.priceHistory.length > 0) {
          setPriceHistory(portfolioData.priceHistory);
        }
        
        // Update stats with real portfolio data
        setStats({
          totalInvested: portfolioData.totalInvested || 0,
          currentValue: portfolioData.currentValue || 0,
          totalReturns: portfolioData.totalReturns || 0,
          totalReturnsPercentage: portfolioData.totalReturnsPercentage || 0,
          activeInvestments: 1 // Assuming at least one active investment if portfolio exists
        });
      }
    } catch (err) {
      console.log("Error fetching portfolio:", err);
      // Fallback to dummy data if API fails
      const investments = dummyInvestments.filter(inv => inv.userId === user?.id);
      setUserInvestments(investments);

      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
      const activeInvestments = investments.filter(inv => inv.status === INVESTMENT_STATUS.ACTIVE).length;

      setStats({
        totalInvested,
        currentValue,
        totalReturns: currentValue - totalInvested,
        totalReturnsPercentage: totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0,
        activeInvestments
      });
    }
  };

  useEffect(() => {
    getPortfolioSummary();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Here's an overview of your investment portfolio
            </p>
          </div>

          {/* Verification Alert */}
          {user?.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED && (
            <Card className="mb-8 border-l-4 border-l-yellow-500 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiAlertCircle className="text-yellow-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-yellow-800">
                      Account Verification Required
                    </h3>
                    <p className="text-yellow-700">
                      Please complete your profile verification to unlock all features.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="warning" 
                  onClick={() => navigate('/profile')}
                >
                  Verify Now
                </Button>
              </div>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card hover className="animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalInvested)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-blue-600 text-2xl font-bold">$</span>
                </div>
              </div>
            </Card>

            <Card hover className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.currentValue)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiTrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Returns</p>
                   <p className={`text-2xl font-bold ${stats.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {stats.totalReturns >= 0 ? '+' : ''}{formatCurrency(stats.totalReturns)}
                  </p>
                   <p className={`text-sm ${stats.totalReturnsPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {stats.totalReturnsPercentage >= 0 ? '+' : ''}{calculateReturnsPercentage()}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiPieChart className="text-purple-600" size={24} />
                </div>
              </div>
            </Card>

            <Card hover className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Investments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeInvestments}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FiActivity className="text-orange-600" size={24} />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Investments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price History Chart */}
              {priceHistory.length > 0 && (
                <Card className="animate-slide-up">
                  <PriceHistoryChart data={priceHistory} />
                </Card>
              )}

              {/* Admin Price History Updates */}
              {priceHistory.length > 0 && (
                <Card className="animate-slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Price History Updates</h3>
                      <p className="text-sm text-gray-600">
                        Recent portfolio value updates by admin
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiActivity className="text-blue-500" size={20} />
                      <span className="text-sm font-medium text-gray-700">
                        {priceHistory.length} updates
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {priceHistory
                      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                      .map((update, index) => {
                        const isLatest = index === 0;
                        const previousValue = index < priceHistory.length - 1 
                          ? priceHistory[index + 1]?.value 
                          : null;
                        const change = previousValue ? update.value - previousValue : 0;
                        const changePercentage = previousValue ? ((change / previousValue) * 100) : 0;

                        return (
                          <div 
                            key={update._id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                              isLatest 
                                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                isLatest ? 'bg-blue-500' : 'bg-gray-400'
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  ${update.value.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {new Date(update.updatedAt).toLocaleDateString()} at{' '}
                                  {new Date(update.updatedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {change !== 0 && (
                                <p className={`text-sm font-medium ${
                                  change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {change > 0 ? '+' : ''}${change.toLocaleString()}
                                </p>
                              )}
                              {changePercentage !== 0 && (
                                <p className={`text-xs ${
                                  changePercentage > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {changePercentage > 0 ? '+' : ''}{changePercentage.toFixed(2)}%
                                </p>
                              )}
                              {isLatest && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Latest
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {priceHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FiActivity className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-sm">No price history updates available</p>
                    </div>
                  )}
                </Card>
              )}

              <Card className="animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Investments
                  </h2>
                  <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => navigate('/invest')}
                    icon={<FiPlus />}
                  >
                    New Investment
                  </Button>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => navigate('/withdrawal')}
                      icon={<FiDollarSign />}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>

                {portfolio ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <FiActivity className="text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Investment Portfolio
                          </h3>
                          <p className="text-sm text-gray-600">
                            Invested: {formatCurrency(portfolio.totalInvested)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(portfolio.currentValue)}
                        </p>
                        <p className={`text-sm ${portfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.totalReturns >= 0 ? '+' : ''}{formatCurrency(portfolio.totalReturns)}
                        </p>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ) : userInvestments.length > 0 ? (
                  <div className="space-y-4">
                    {userInvestments.map((investment, index) => (
                      <div 
                        key={investment.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(investment.status)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {investment.planName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Invested: {formatCurrency(investment.amount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Started: {new Date(investment.investmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(investment.currentValue)}
                          </p>
                          <p className={`text-sm ${(investment.currentValue - investment.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(investment.currentValue - investment.amount) >= 0 ? '+' : ''}{formatCurrency(investment.currentValue - investment.amount)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investment.status)}`}>
                            {investment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiPieChart className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No investments yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start your investment journey today!
                    </p>
                    <div className="flex space-x-2 justify-center">
                    <Button onClick={() => navigate('/invest')}>
                      Make Your First Investment
                    </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/withdrawal')}
                      >
                        Withdraw Funds
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Quick Actions & Portfolio Summary */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    fullWidth 
                    variant="primary"
                    onClick={() => navigate('/invest')}
                    icon={<FiPlus />}
                  >
                    New Investment
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline"
                    onClick={() => navigate('/withdrawal')}
                    icon={<FiDollarSign />}
                  >
                    Withdraw Funds
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline"
                    onClick={() => navigate('/investment-history')}
                    icon={<FiClock />}
                  >
                    View History
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    icon={<FiEye />}
                    className="hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    View Portfolio
                  </Button>
                  <Button 
                    fullWidth 
                    variant="ghost"
                    onClick={() => navigate('/profile')}
                    icon={<FiActivity />}
                  >
                    Update Profile
                  </Button>
                </div>
              </Card>

              {/* Investment Breakdown */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Investment Breakdown
                </h3>
                {portfolio ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Investment Portfolio</p>
                        <p className="text-sm text-gray-600">100% of portfolio</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(portfolio.currentValue)}
                        </p>
                        <p className={`text-sm ${portfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.totalReturns >= 0 ? '+' : ''}{formatCurrency(portfolio.totalReturns)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : userInvestments.length > 0 ? (
                  <div className="space-y-3">
                    {userInvestments.reduce((acc, inv) => {
                      const existing = acc.find(item => item.planName === inv.planName);
                      if (existing) {
                        existing.amount += inv.amount;
                        existing.currentValue += inv.currentValue;
                      } else {
                        acc.push({
                          planName: inv.planName,
                          amount: inv.amount,
                          currentValue: inv.currentValue
                        });
                      }
                      return acc;
                    }, []).map((plan, index) => {
                      const percentage = stats.totalInvested > 0 ? ((plan.amount / stats.totalInvested) * 100).toFixed(1) : 0;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{plan.planName}</p>
                            <p className="text-sm text-gray-600">{percentage}% of portfolio</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(plan.currentValue)}
                            </p>
                            <p className={`text-sm ${(plan.currentValue - plan.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(plan.currentValue - plan.amount) >= 0 ? '+' : ''}{formatCurrency(plan.currentValue - plan.amount)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No investments to display
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
