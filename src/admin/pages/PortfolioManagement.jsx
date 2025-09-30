// PortfolioManagement page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
  FiBarChart,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiPlus,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiActivity,
  FiSettings,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiPercent,
  FiMinus,
  FiX,
  FiCheck
} from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Modal from '../../components/common/Modal';

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    totalValue: '',
    cashBalance: '',
    investedAmount: '',
    profitLoss: '',
    profitLossPercentage: '',
    riskLevel: 'medium',
    status: 'active',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPortfolios = [
        {
          id: 1,
          userId: 'user_001',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          totalValue: 125000,
          cashBalance: 25000,
          investedAmount: 100000,
          profitLoss: 15000,
          profitLossPercentage: 15.0,
          riskLevel: 'medium',
          status: 'active',
          lastUpdated: '2024-03-15',
          investments: [
            { id: 1, name: 'Tech Stocks', amount: 40000, percentage: 40, profitLoss: 8000 },
            { id: 2, name: 'Bonds', amount: 30000, percentage: 30, profitLoss: 2000 },
            { id: 3, name: 'Real Estate', amount: 30000, percentage: 30, profitLoss: 5000 }
          ],
          notes: 'Conservative investor with balanced portfolio'
        },
        {
          id: 2,
          userId: 'user_002',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          totalValue: 85000,
          cashBalance: 15000,
          investedAmount: 70000,
          profitLoss: -5000,
          profitLossPercentage: -7.1,
          riskLevel: 'high',
          status: 'active',
          lastUpdated: '2024-03-14',
          investments: [
            { id: 1, name: 'Crypto', amount: 50000, percentage: 71.4, profitLoss: -8000 },
            { id: 2, name: 'Stocks', amount: 20000, percentage: 28.6, profitLoss: 3000 }
          ],
          notes: 'High-risk investor focused on crypto'
        },
        {
          id: 3,
          userId: 'user_003',
          userName: 'Mike Johnson',
          userEmail: 'mike@example.com',
          totalValue: 200000,
          cashBalance: 50000,
          investedAmount: 150000,
          profitLoss: 25000,
          profitLossPercentage: 16.7,
          riskLevel: 'low',
          status: 'active',
          lastUpdated: '2024-03-15',
          investments: [
            { id: 1, name: 'Government Bonds', amount: 80000, percentage: 53.3, profitLoss: 12000 },
            { id: 2, name: 'Blue Chip Stocks', amount: 50000, percentage: 33.3, profitLoss: 10000 },
            { id: 3, name: 'REITs', amount: 20000, percentage: 13.3, profitLoss: 3000 }
          ],
          notes: 'Low-risk conservative portfolio'
        }
      ];
      
      setPortfolios(mockPortfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitLossColor = (amount) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = portfolio.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         portfolio.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         portfolio.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || portfolio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowPortfolioModal(true);
  };

  const handleEditPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setFormData({
      userId: portfolio.userId,
      totalValue: portfolio.totalValue.toString(),
      cashBalance: portfolio.cashBalance.toString(),
      investedAmount: portfolio.investedAmount.toString(),
      profitLoss: portfolio.profitLoss.toString(),
      profitLossPercentage: portfolio.profitLossPercentage.toString(),
      riskLevel: portfolio.riskLevel,
      status: portfolio.status,
      notes: portfolio.notes
    });
    setShowEditModal(true);
  };

  const handleAddPortfolio = () => {
    setFormData({
      userId: '',
      totalValue: '',
      cashBalance: '',
      investedAmount: '',
      profitLoss: '',
      profitLossPercentage: '',
      riskLevel: 'medium',
      status: 'active',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.totalValue) newErrors.totalValue = 'Total value is required';
    if (!formData.cashBalance) newErrors.cashBalance = 'Cash balance is required';
    if (!formData.investedAmount) newErrors.investedAmount = 'Invested amount is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePortfolio = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (showEditModal) {
        // Update existing portfolio
        setPortfolios(prev => prev.map(p => 
          p.id === selectedPortfolio.id 
            ? { ...p, ...formData, totalValue: parseFloat(formData.totalValue), cashBalance: parseFloat(formData.cashBalance), investedAmount: parseFloat(formData.investedAmount), profitLoss: parseFloat(formData.profitLoss), profitLossPercentage: parseFloat(formData.profitLossPercentage) }
            : p
        ));
      } else {
        // Add new portfolio
        const newPortfolio = {
          id: Date.now(),
          ...formData,
          totalValue: parseFloat(formData.totalValue),
          cashBalance: parseFloat(formData.cashBalance),
          investedAmount: parseFloat(formData.investedAmount),
          profitLoss: parseFloat(formData.profitLoss),
          profitLossPercentage: parseFloat(formData.profitLossPercentage),
          userName: 'New User',
          userEmail: 'newuser@example.com',
          lastUpdated: new Date().toISOString().split('T')[0],
          investments: []
        };
        setPortfolios(prev => [...prev, newPortfolio]);
      }
      
      setShowEditModal(false);
      setShowAddModal(false);
      setSelectedPortfolio(null);
    } catch (error) {
      console.error('Error saving portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalPortfolios = portfolios.length;
  const totalValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0);
  const totalProfitLoss = portfolios.reduce((sum, p) => sum + p.profitLoss, 0);
  const activePortfolios = portfolios.filter(p => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
          <p className="text-gray-600">Manage and monitor all user investment portfolios</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolios</p>
                <p className="text-2xl font-bold text-gray-900">{totalPortfolios}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUsers className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total P&L</p>
                <p className={`text-2xl font-bold ${getProfitLossColor(totalProfitLoss)}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                {totalProfitLoss >= 0 ? 
                  <FiTrendingUp className="text-green-600" size={24} /> : 
                  <FiTrendingDown className="text-red-600" size={24} />
                }
              </div>
            </div>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Portfolios</p>
                <p className="text-2xl font-bold text-gray-900">{activePortfolios}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FiActivity className="text-orange-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search portfolios by user name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FiSearch />}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <Button 
                variant="outline" 
                icon={<FiRefreshCw />} 
                onClick={fetchPortfolios}
                className="cursor-pointer"
              >
                Refresh
              </Button>
              <Button 
                variant="primary" 
                icon={<FiPlus />} 
                onClick={handleAddPortfolio}
                className="cursor-pointer"
              >
                Add Portfolio
              </Button>
            </div>
          </div>
        </Card>

        {/* Portfolios Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Portfolio Value
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-3 sm:px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        Loading portfolios...
                      </div>
                    </td>
                  </tr>
                ) : filteredPortfolios.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-3 sm:px-6 py-12 text-center text-gray-500">
                      No portfolios found
                    </td>
                  </tr>
                ) : (
                  filteredPortfolios.map((portfolio) => (
                    <tr key={portfolio.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs sm:text-sm font-medium">
                              {portfolio.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-2 sm:ml-4 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {portfolio.userName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              {portfolio.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(portfolio.totalValue)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Invested: {formatCurrency(portfolio.investedAmount)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getProfitLossColor(portfolio.profitLoss)}`}>
                          {portfolio.profitLoss >= 0 ? '+' : ''}{formatCurrency(portfolio.profitLoss)}
                        </div>
                        <div className={`text-xs sm:text-sm ${getProfitLossColor(portfolio.profitLoss)}`}>
                          {portfolio.profitLossPercentage >= 0 ? '+' : ''}{portfolio.profitLossPercentage}%
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(portfolio.riskLevel)}`}>
                          {portfolio.riskLevel}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(portfolio.status)}`}>
                          {portfolio.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {portfolio.lastUpdated}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleViewPortfolio(portfolio)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer p-1 rounded hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <FiEye size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPortfolio(portfolio)}
                            className="text-green-600 hover:text-green-900 cursor-pointer p-1 rounded hover:bg-green-50 transition-colors"
                            title="Edit Portfolio"
                          >
                            <FiEdit size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Portfolio Details Modal */}
        <Modal
          isOpen={showPortfolioModal}
          onClose={() => setShowPortfolioModal(false)}
          title="Portfolio Details"
          size="lg"
        >
          {selectedPortfolio && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedPortfolio.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedPortfolio.userName}
                  </h3>
                  <p className="text-gray-600">{selectedPortfolio.userEmail}</p>
                  <p className="text-sm text-gray-500">ID: {selectedPortfolio.userId}</p>
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiDollarSign className="text-blue-600" size={20} />
                    <span className="text-sm font-medium text-blue-800">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(selectedPortfolio.totalValue)}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiTrendingUp className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-800">Cash Balance</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(selectedPortfolio.cashBalance)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${selectedPortfolio.profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedPortfolio.profitLoss >= 0 ? 
                      <FiTrendingUp className="text-green-600" size={20} /> : 
                      <FiTrendingDown className="text-red-600" size={20} />
                    }
                    <span className={`text-sm font-medium ${selectedPortfolio.profitLoss >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      P&L
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${selectedPortfolio.profitLoss >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {selectedPortfolio.profitLoss >= 0 ? '+' : ''}{formatCurrency(selectedPortfolio.profitLoss)}
                  </p>
                </div>
              </div>

              {/* Investments */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Investments</h4>
                <div className="space-y-3">
                  {selectedPortfolio.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{investment.name}</p>
                        <p className="text-sm text-gray-500">{investment.percentage}% of portfolio</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(investment.amount)}</p>
                        <p className={`text-sm ${investment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.profitLoss >= 0 ? '+' : ''}{formatCurrency(investment.profitLoss)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPortfolio.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {selectedPortfolio.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Edit Portfolio Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Portfolio"
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="User ID"
                name="userId"
                value={formData.userId}
                onChange={handleFormChange}
                error={errors.userId}
                required
              />
              <Input
                label="Total Value"
                name="totalValue"
                type="number"
                value={formData.totalValue}
                onChange={handleFormChange}
                error={errors.totalValue}
                required
              />
              <Input
                label="Cash Balance"
                name="cashBalance"
                type="number"
                value={formData.cashBalance}
                onChange={handleFormChange}
                error={errors.cashBalance}
                required
              />
              <Input
                label="Invested Amount"
                name="investedAmount"
                type="number"
                value={formData.investedAmount}
                onChange={handleFormChange}
                error={errors.investedAmount}
                required
              />
              <Input
                label="Profit/Loss"
                name="profitLoss"
                type="number"
                value={formData.profitLoss}
                onChange={handleFormChange}
              />
              <Input
                label="P&L Percentage"
                name="profitLossPercentage"
                type="number"
                step="0.01"
                value={formData.profitLossPercentage}
                onChange={handleFormChange}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add notes about this portfolio..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSavePortfolio}
                loading={loading}
                className="flex-1 cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Portfolio Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Portfolio"
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="User ID"
                name="userId"
                value={formData.userId}
                onChange={handleFormChange}
                error={errors.userId}
                required
              />
              <Input
                label="Total Value"
                name="totalValue"
                type="number"
                value={formData.totalValue}
                onChange={handleFormChange}
                error={errors.totalValue}
                required
              />
              <Input
                label="Cash Balance"
                name="cashBalance"
                type="number"
                value={formData.cashBalance}
                onChange={handleFormChange}
                error={errors.cashBalance}
                required
              />
              <Input
                label="Invested Amount"
                name="investedAmount"
                type="number"
                value={formData.investedAmount}
                onChange={handleFormChange}
                error={errors.investedAmount}
                required
              />
              <Input
                label="Profit/Loss"
                name="profitLoss"
                type="number"
                value={formData.profitLoss}
                onChange={handleFormChange}
              />
              <Input
                label="P&L Percentage"
                name="profitLossPercentage"
                type="number"
                step="0.01"
                value={formData.profitLossPercentage}
                onChange={handleFormChange}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add notes about this portfolio..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSavePortfolio}
                loading={loading}
                className="flex-1 cursor-pointer"
              >
                Add Portfolio
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PortfolioManagement;
