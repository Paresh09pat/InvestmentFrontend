import { useState, useEffect } from 'react';
import { 
  FiCreditCard, 
  FiTrendingUp, 
  FiTrendingDown,
  FiPlus,
  FiMinus,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiArrowUpRight,
  FiArrowDownRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiDollarSign
} from 'react-icons/fi';
import Card from './common/Card';
import Button from './common/Button';

const Wallet = ({ userInvestments = [], totalInvested = 0, currentValue = 0 }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [walletBalance, setWalletBalance] = useState(25000); // Available balance for new investments
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Calculate wallet stats
  const totalReturns = currentValue - totalInvested;
  const returnsPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0;
  const availableBalance = walletBalance;
  const totalPortfolioValue = currentValue + availableBalance;

  // Mock recent transactions
  useEffect(() => {
    const mockTransactions = [
      {
        id: 1,
        type: 'credit',
        amount: 5000,
        description: 'Monthly Returns - Premium Plan',
        date: '2024-03-15',
        status: 'completed',
        icon: FiTrendingUp
      },
      {
        id: 2,
        type: 'debit',
        amount: 25000,
        description: 'New Investment - Basic Plan',
        date: '2024-03-10',
        status: 'completed',
        icon: FiMinus
      },
      {
        id: 3,
        type: 'credit',
        amount: 15000,
        description: 'Investment Maturity - Elite Plan',
        date: '2024-03-05',
        status: 'completed',
        icon: FiCheckCircle
      },
      {
        id: 4,
        type: 'pending',
        amount: 10000,
        description: 'Investment Processing - Premium Plan',
        date: '2024-03-20',
        status: 'pending',
        icon: FiClock
      }
    ];
    setRecentTransactions(mockTransactions);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (transaction) => {
    const IconComponent = transaction.icon;
    const iconClass = transaction.type === 'credit' 
      ? 'text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' 
      : transaction.type === 'debit' 
      ? 'text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-lg'
      : 'text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg';
    
    return (
      <div className={`p-3 rounded-full ${iconClass}`}>
        <IconComponent size={18} />
      </div>
    );
  };

  const getTransactionAmount = (transaction) => {
    const amount = formatCurrency(transaction.amount);
    const prefix = transaction.type === 'credit' ? '+' : transaction.type === 'debit' ? '-' : '';
    const colorClass = transaction.type === 'credit' 
      ? 'text-green-600' 
      : transaction.type === 'debit' 
      ? 'text-red-600'
      : 'text-yellow-600';
    
    return (
      <span className={`font-semibold ${colorClass}`}>
        {prefix}{amount}
      </span>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleAddFunds = async () => {
    setIsAddingFunds(true);
    // Simulate adding funds
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWalletBalance(prev => prev + 10000); // Add 10,000 to wallet
    setIsAddingFunds(false);
    
    // Add transaction to history
    const newTransaction = {
      id: Date.now(),
      type: 'credit',
      amount: 10000,
      description: 'Funds Added - Bank Transfer',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      icon: FiPlus
    };
    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 3)]);
  };

  const handleWithdraw = async () => {
    if (walletBalance < 5000) {
      alert('Minimum withdrawal amount is ₹5,000');
      return;
    }
    
    setIsWithdrawing(true);
    // Simulate withdrawal
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWalletBalance(prev => prev - 5000); // Withdraw 5,000 from wallet
    setIsWithdrawing(false);
    
    // Add transaction to history
    const newTransaction = {
      id: Date.now(),
      type: 'debit',
      amount: 5000,
      description: 'Withdrawal - Bank Transfer',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      icon: FiMinus
    };
    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 3)]);
  };

  const handleInvestNow = () => {
    // Navigate to investment page
    window.location.href = '/invest';
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview Card */}
      <Card className="bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white overflow-hidden wallet-card-hover">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-violet-500 bg-opacity-20 rounded-full wallet-icon-bounce">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Investment Wallet</h3>
                  <p className="text-white text-opacity-80 text-sm">Your financial hub</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-full bg-violet-500 bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 text-white cursor-pointer"
                >
                  {showBalance ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-full bg-violet-500 bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 text-white disabled:opacity-50"
                >
                  <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Available Balance */}
              <div className=" bg-opacity-20 rounded-xl p-5 backdrop-blur-sm wallet-card-hover wallet-stat-counter border border-white border-opacity-30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-medium text-sm">Available Balance</p>
                  <div className="p-2 bg-green-500 bg-opacity-20 rounded-full">
                    <FiCreditCard size={18} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1 wallet-balance-pulse">
                  {showBalance ? formatCurrency(availableBalance) : '••••••'}
                </p>
                <p className="text-white text-opacity-90 text-sm font-medium">Ready to invest</p>
              </div>

              {/* Portfolio Value */}
              <div className="   bg-opacity-20 rounded-xl p-5 backdrop-blur-sm wallet-card-hover wallet-stat-counter border border-white border-opacity-30" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-medium text-sm">Portfolio Value</p>
                  <div className="p-2 bg-green-500 bg-opacity-30 rounded-full">
                    <FiTrendingUp size={16} className="text-green-200" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {showBalance ? formatCurrency(totalPortfolioValue) : '••••••'}
                </p>
                <p className="text-green-200 text-sm font-medium">Total assets</p>
              </div>

              {/* Total Returns */}
              <div className=" bg-opacity-20 rounded-xl p-5 backdrop-blur-sm wallet-card-hover wallet-stat-counter border border-white border-opacity-30" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-medium text-sm">Total Returns</p>
                  <div className={`p-2 rounded-full ${totalReturns >= 0 ? 'bg-green-500 bg-opacity-30' : 'bg-red-500 bg-opacity-30'}`}>
                    {totalReturns >= 0 ? (
                      <FiTrendingUp size={16} className="text-green-200" />
                    ) : (
                      <FiTrendingDown size={16} className="text-red-200" />
                    )}
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {showBalance ? formatCurrency(totalReturns) : '••••••'}
                </p>
                <p className={`text-sm font-medium ${totalReturns >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {totalReturns >= 0 ? '+' : ''}{returnsPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleAddFunds}
            disabled={isAddingFunds}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isAddingFunds ? (
              <FiRefreshCw className="animate-spin" size={18} />
            ) : (
              <FiPlus size={18} />
            )}
            <span>{isAddingFunds ? 'Adding...' : 'Add Funds'}</span>
          </button>
          
          <button 
            onClick={handleWithdraw}
            disabled={isWithdrawing || walletBalance < 5000}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none"
          >
            {isWithdrawing ? (
              <FiRefreshCw className="animate-spin" size={18} />
            ) : (
              <FiMinus size={18} />
            )}
            <span>{isWithdrawing ? 'Withdrawing...' : 'Withdraw'}</span>
          </button>
          
          <button 
            onClick={handleInvestNow}
            className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 hover:text-green-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-1"
          >
            <FiTrendingUp size={18} />
            <span>Invest Now</span>
          </button>
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-2 border-gray-600 text-gray-600 hover:bg-gray-50 hover:border-gray-700 hover:text-gray-700 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none"
          >
            <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} size={18} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
        
        {/* Balance Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Available Balance: <span className="font-semibold text-gray-900">{formatCurrency(walletBalance)}</span>
            {walletBalance < 5000 && (
              <span className="block text-orange-600 text-xs mt-1">
                Minimum ₹5,000 required for withdrawal
              </span>
            )}
          </p>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200 hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 wallet-transaction-slide wallet-card-hover border border-gray-200 shadow-sm hover:shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                {getTransactionIcon(transaction)}
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {transaction.description}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {new Date(transaction.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                {getTransactionAmount(transaction)}
                <div className="flex items-center space-x-2 mt-2">
                  {transaction.status === 'completed' && (
                    <FiCheckCircle size={16} className="text-green-500" />
                  )}
                  {transaction.status === 'pending' && (
                    <FiClock size={16} className="text-yellow-500" />
                  )}
                  <span className={`text-sm font-semibold ${
                    transaction.status === 'completed' 
                      ? 'text-green-600' 
                      : transaction.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Investment Performance Summary */}
      <Card className="bg-white shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl wallet-card-hover wallet-stat-counter border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full wallet-icon-bounce shadow-lg">
                  <FiTrendingUp className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Total Invested</p>
                  <p className="text-sm text-gray-600">All time</p>
                </div>
              </div>
              <p className="font-bold text-gray-900 text-lg">
                {formatCurrency(totalInvested)}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl wallet-card-hover wallet-stat-counter border border-green-100" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full wallet-icon-bounce shadow-lg">
                  <FiCheckCircle className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Current Value</p>
                  <p className="text-sm text-gray-600">Market value</p>
                </div>
              </div>
              <p className="font-bold text-gray-900 text-lg">
                {formatCurrency(currentValue)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl wallet-card-hover wallet-stat-counter border border-purple-100" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full wallet-icon-bounce shadow-lg">
                  <FiArrowUpRight className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Total Returns</p>
                  <p className="text-sm text-gray-600">Profit/Loss</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalReturns)}
                </p>
                <p className={`text-sm font-medium ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturns >= 0 ? '+' : ''}{returnsPercentage}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl wallet-card-hover wallet-stat-counter border border-orange-100" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full wallet-icon-bounce shadow-lg">
                  <FiActivity className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Active Plans</p>
                  <p className="text-sm text-gray-600">Currently running</p>
                </div>
              </div>
              <p className="font-bold text-gray-900 text-lg">
                {userInvestments.filter(inv => inv.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Wallet;
