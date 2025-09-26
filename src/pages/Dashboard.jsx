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
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { dummyInvestments } from '../utils/dummyData';
import { INVESTMENT_STATUS, USER_VERIFICATION_STATUS } from '../utils/constants';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userInvestments, setUserInvestments] = useState([]);
  const [stats, setStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalReturns: 0,
    activeInvestments: 0
  });

  useEffect(() => {
    // Filter investments for current user
    const investments = dummyInvestments.filter(inv => inv.userId === user?.id);
    setUserInvestments(investments);

    // Calculate stats
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const activeInvestments = investments.filter(inv => inv.status === INVESTMENT_STATUS.ACTIVE).length;

    setStats({
      totalInvested,
      currentValue,
      totalReturns: currentValue - totalInvested,
      activeInvestments
    });
  }, [user]);

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
    return ((stats.totalReturns / stats.totalInvested) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalReturns)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{calculateReturnsPercentage()}%
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
            <div className="lg:col-span-2">
              <Card className="animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Investments
                  </h2>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => navigate('/invest')}
                    icon={<FiPlus />}
                  >
                    New Investment
                  </Button>
                </div>

                {userInvestments.length > 0 ? (
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
                          <p className="text-sm text-green-600">
                            +{formatCurrency(investment.currentValue - investment.amount)}
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
                    <Button onClick={() => navigate('/invest')}>
                      Make Your First Investment
                    </Button>
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
                {userInvestments.length > 0 ? (
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
                            <p className="text-sm text-green-600">
                              +{formatCurrency(plan.currentValue - plan.amount)}
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
