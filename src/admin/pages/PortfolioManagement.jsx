// PortfolioManagement page
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiDollarSign,
  FiEdit,
  FiEye,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/forms/Input';
import { VITE_APP_API_URL } from '../../utils/constants';
import { toast } from 'react-toastify';

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCurrentValue, setEditingCurrentValue] = useState(false);
  const [currentValueInput, setCurrentValueInput] = useState('');
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

  const fetchPortfolios = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const res = await axios.get(`${VITE_APP_API_URL}/api/admin/portfolios?${params}`, {
        withCredentials: true
      });
      
      console.log("res", res.data);
      setPortfolios(res.data.portfolio || []);
      setPagination(res.data.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
      
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setPortfolios([]);
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

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchPortfolios(1, searchTerm);
      } else {
        fetchPortfolios(1, '');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter portfolios locally for status (since search is handled server-side)
  const filteredPortfolios = (portfolios || []).filter(portfolio => {
    const matchesStatus = statusFilter === 'all' || (portfolio.status || 'active') === statusFilter;
    return matchesStatus;
  });

  const handleViewPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setSelectedPlan(null);
    setEditingCurrentValue(false);
    setShowPortfolioModal(true);
  };

  const handleEditPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setSelectedPlan(null);
    setFormData({
      userId: portfolio.user._id,
      totalValue: '',
      cashBalance: '',
      investedAmount: '',
      profitLoss: '',
      profitLossPercentage: '',
      riskLevel: portfolio.riskLevel || 'medium',
      status: portfolio.status || 'active',
      notes: portfolio.notes || ''
    });
    setShowEditModal(true);
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
    
    if (showEditModal) {
      // For edit modal, only validate current value
      if (!formData.totalValue) {
        newErrors.totalValue = 'Current value is required';
      } else if (parseFloat(formData.totalValue) < 0) {
        newErrors.totalValue = 'Current value must be positive';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateCurrentValue = async () => {
    if (!selectedPortfolio || !selectedPlan || !currentValueInput) return;
    
    setLoading(true);
    try {
      const response = await axios.put(
        `${VITE_APP_API_URL}/api/admin/portfolio/${selectedPortfolio._id}`,
        { 
          currentValue: parseFloat(currentValueInput),
          planName: selectedPlan.name
        },
        { withCredentials: true }
      );
      
      // Update the portfolio in the list
      setPortfolios(prev => prev.map(p => 
        p._id === selectedPortfolio._id 
          ? {
              ...p,
              plans: p.plans.map(plan => 
                plan.name === selectedPlan.name
                  ? { ...plan, currentValue: parseFloat(currentValueInput) }
                  : plan
              ),
              currentValue: p.plans.reduce((sum, plan) => sum + (plan.name === selectedPlan.name ? parseFloat(currentValueInput) : plan.currentValue), 0)
            }
          : p
      ));
      
      // Update the selected portfolio
      setSelectedPortfolio(prev => ({
        ...prev,
        plans: prev.plans.map(plan => 
          plan.name === selectedPlan.name
            ? { ...plan, currentValue: parseFloat(currentValueInput) }
            : plan
        ),
        currentValue: prev.plans.reduce((sum, plan) => sum + (plan.name === selectedPlan.name ? parseFloat(currentValueInput) : plan.currentValue), 0)
      }));
      
      setEditingCurrentValue(false);
      
      // Show success toast
      toast.success(response.data.message || 'Portfolio updated successfully!');
      
      // Refetch portfolios to get updated data
      await fetchPortfolios(pagination.page, searchTerm);
      
      console.log('Portfolio updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast.error(error.response?.data?.message || 'Failed to update portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePortfolio = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (showEditModal && selectedPlan) {
        // Update existing portfolio current value for specific plan
        const response = await axios.put(
          `${VITE_APP_API_URL}/api/admin/portfolio/${selectedPortfolio._id}`,
          { 
            currentValue: parseFloat(formData.totalValue),
            planName: selectedPlan.name
          },
          { withCredentials: true }
        );
        
        // Update the portfolio in the list
        setPortfolios(prev => prev.map(p => 
          p._id === selectedPortfolio._id 
            ? {
                ...p,
                plans: p.plans.map(plan => 
                  plan.name === selectedPlan.name
                    ? { ...plan, currentValue: parseFloat(formData.totalValue) }
                    : plan
                ),
                currentValue: p.plans.reduce((sum, plan) => sum + (plan.name === selectedPlan.name ? parseFloat(formData.totalValue) : plan.currentValue), 0)
              }
            : p
        ));
        
        console.log('Portfolio updated successfully:', response.data);
        
        // Show success toast
        toast.success(response.data.message || 'Portfolio updated successfully!');
        
        // Refetch portfolios to get updated data
        await fetchPortfolios(pagination.page, searchTerm);
      }
      
      setShowEditModal(false);
      setSelectedPortfolio(null);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error(error.response?.data?.message || 'Failed to save portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalPortfolios = pagination.total;
  const totalValue = (portfolios || []).reduce((sum, p) => sum + (p.currentValue || 0), 0);
  const totalProfitLoss = (portfolios || []).reduce((sum, p) => sum + (p.totalReturns || 0), 0);
  const activePortfolios = (portfolios || []).filter(p => (p.status || 'active') === 'active').length;

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
                onClick={() => fetchPortfolios(pagination.page, searchTerm)}
                className="cursor-pointer"
              >
                Refresh
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
                    Silver Plan
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gold Plan
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platinum Plan
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total P&L
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
                  filteredPortfolios.map((portfolio) => {
                    // Get plan data
                    const silverPlan = portfolio.plans?.find(p => p.name === 'silver') || { invested: 0, currentValue: 0, returns: 0 };
                    const goldPlan = portfolio.plans?.find(p => p.name === 'gold') || { invested: 0, currentValue: 0, returns: 0 };
                    const platinumPlan = portfolio.plans?.find(p => p.name === 'platinum') || { invested: 0, currentValue: 0, returns: 0 };

                    return (
                      <tr key={portfolio._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {portfolio.user.profilePicture?.cloudinaryUrl ? (
                              <img 
                                src={portfolio.user.profilePicture.cloudinaryUrl} 
                                alt={portfolio.user.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs sm:text-sm font-medium">
                                  {portfolio.user.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="ml-2 sm:ml-4 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {portfolio.user.name}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate">
                                {portfolio.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Silver Plan */}
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${silverPlan.invested > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formatCurrency(silverPlan.currentValue)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Invested: {formatCurrency(silverPlan.invested)}
                          </div>
                          {silverPlan.returns !== 0 && (
                            <div className={`text-xs ${getProfitLossColor(silverPlan.returns)}`}>
                              {silverPlan.returns >= 0 ? '+' : ''}{formatCurrency(silverPlan.returns)}
                            </div>
                          )}
                        </td>

                        {/* Gold Plan */}
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${goldPlan.invested > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formatCurrency(goldPlan.currentValue)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Invested: {formatCurrency(goldPlan.invested)}
                          </div>
                          {goldPlan.returns !== 0 && (
                            <div className={`text-xs ${getProfitLossColor(goldPlan.returns)}`}>
                              {goldPlan.returns >= 0 ? '+' : ''}{formatCurrency(goldPlan.returns)}
                            </div>
                          )}
                        </td>

                        {/* Platinum Plan */}
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${platinumPlan.invested > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formatCurrency(platinumPlan.currentValue)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Invested: {formatCurrency(platinumPlan.invested)}
                          </div>
                          {platinumPlan.returns !== 0 && (
                            <div className={`text-xs ${getProfitLossColor(platinumPlan.returns)}`}>
                              {platinumPlan.returns >= 0 ? '+' : ''}{formatCurrency(platinumPlan.returns)}
                            </div>
                          )}
                        </td>

                        {/* Total Value */}
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(portfolio.currentValue)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Invested: {formatCurrency(portfolio.totalInvested)}
                          </div>
                        </td>

                        {/* Total P&L */}
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getProfitLossColor(portfolio.totalReturns)}`}>
                            {portfolio.totalReturns >= 0 ? '+' : ''}{formatCurrency(portfolio.totalReturns)}
                          </div>
                          <div className={`text-xs sm:text-sm ${getProfitLossColor(portfolio.totalReturns)}`}>
                            {portfolio.totalReturnsPercentage >= 0 ? '+' : ''}{portfolio.totalReturnsPercentage.toFixed(2)}%
                          </div>
                        </td>

                        {/* Actions */}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchPortfolios(pagination.page - 1, searchTerm)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchPortfolios(pagination.page + 1, searchTerm)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {((pagination.page - 1) * pagination.limit) + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.total}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => fetchPortfolios(pagination.page - 1, searchTerm)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                      if (pageNum > pagination.totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchPortfolios(pageNum, searchTerm)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => fetchPortfolios(pagination.page + 1, searchTerm)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Portfolio Details Modal */}
        <Modal
          isOpen={showPortfolioModal}
          onClose={() => setShowPortfolioModal(false)}
          title="Portfolio Details"
          size="2xl"
        >
          {selectedPortfolio && (
            <div className="space-y-6">
              {/* User Info Header */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  {selectedPortfolio.user.profilePicture?.cloudinaryUrl ? (
                    <img 
                      src={selectedPortfolio.user.profilePicture.cloudinaryUrl} 
                      alt={selectedPortfolio.user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <span className="text-white text-xl font-bold">
                        {selectedPortfolio.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {selectedPortfolio.user.name}
                    </h3>
                    <p className="text-gray-600">{selectedPortfolio.user.email}</p>
                    <p className="text-sm text-gray-500">Phone: {selectedPortfolio.user.phone}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatCurrency(selectedPortfolio.currentValue)}
                    </div>
                    <div className="text-sm text-gray-500">Current Value</div>
                  </div>
                </div>
              </div>

              {/* Portfolio Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Value Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600">Total Current Value</h4>
                    <FiDollarSign className="text-blue-500" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    {formatCurrency(selectedPortfolio.currentValue)}
                  </p>
                </div>

                {/* Total Invested Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600">Total Invested</h4>
                    <FiTrendingUp className="text-green-500" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedPortfolio.totalInvested)}
                  </p>
                </div>

                {/* Total Returns Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600">Total Returns</h4>
                    {selectedPortfolio.totalReturns >= 0 ? 
                      <FiTrendingUp className="text-green-500" size={20} /> : 
                      <FiTrendingDown className="text-red-500" size={20} />
                    }
                  </div>
                  <p className={`text-2xl font-bold mb-1 ${
                    selectedPortfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedPortfolio.totalReturns >= 0 ? '+' : ''}{formatCurrency(selectedPortfolio.totalReturns)}
                  </p>
                  <p className={`text-sm ${
                    selectedPortfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedPortfolio.totalReturnsPercentage >= 0 ? '+' : ''}{selectedPortfolio.totalReturnsPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Investment Plans Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPortfolio.plans && selectedPortfolio.plans.map((plan) => (
                    <div key={plan._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-900 capitalize">{plan.name} Plan</h5>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          plan.invested > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {plan.invested > 0 ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Invested:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(plan.invested)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Current Value:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(plan.currentValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Returns:</span>
                          <span className={`text-sm font-medium ${
                            plan.returns >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {plan.returns >= 0 ? '+' : ''}{formatCurrency(plan.returns)}
                          </span>
                        </div>
                        {plan.returnRate.min && plan.returnRate.max && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Return Rate:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {plan.returnRate.min}% - {plan.returnRate.max}%
                            </span>
                          </div>
                        )}
                      </div>

                      {plan.invested > 0 && (
                        <div className="space-y-2">
                          {!editingCurrentValue || selectedPlan?.name !== plan.name ? (
                            <button
                              onClick={() => {
                                setSelectedPlan(plan);
                                setCurrentValueInput(plan.currentValue.toString());
                                setEditingCurrentValue(true);
                              }}
                              className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Update Value
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <input
                                type="number"
                                value={currentValueInput}
                                onChange={(e) => setCurrentValueInput(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter new value"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleUpdateCurrentValue}
                                  disabled={loading}
                                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                  {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCurrentValue(false);
                                    setSelectedPlan(null);
                                    setCurrentValueInput('');
                                  }}
                                  className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price History Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Price History by Plan</h4>
                <div className="space-y-4">
                  {selectedPortfolio.plans && selectedPortfolio.plans.map((plan) => (
                    <div key={plan._id} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 capitalize">{plan.name} Plan History</h5>
                      {plan.priceHistory && plan.priceHistory.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {plan.priceHistory.map((history, index) => (
                            <div key={history._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold text-xs">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(history.value)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(history.updatedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No price history available</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Portfolio ID:</span>
                      <span className="text-gray-900 font-mono text-sm">{selectedPortfolio._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{new Date(selectedPortfolio.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">{new Date(selectedPortfolio.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(selectedPortfolio.riskLevel || 'medium')}`}>
                        {selectedPortfolio.riskLevel || 'medium'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPortfolio.status || 'active')}`}>
                        {selectedPortfolio.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Portfolio Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Portfolio"
          size="lg"
        >
          {selectedPortfolio && (
            <div className="space-y-6">
              {/* User Info Header */}
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                {selectedPortfolio.user.profilePicture?.cloudinaryUrl ? (
                  <img 
                    src={selectedPortfolio.user.profilePicture.cloudinaryUrl} 
                    alt={selectedPortfolio.user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-white text-xl font-bold">
                      {selectedPortfolio.user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedPortfolio.user.name}
                  </h3>
                  <p className="text-gray-600">{selectedPortfolio.user.email}</p>
                  <p className="text-sm text-gray-500">Portfolio ID: {selectedPortfolio._id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(selectedPortfolio.currentValue)}
                  </div>
                  <div className="text-sm text-gray-500">Current Value</div>
                </div>
              </div>

              {/* Plan Selection Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiActivity className="text-blue-600" size={24} />
                  <h4 className="text-lg font-semibold text-blue-800">Select Investment Plan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPortfolio.plans && selectedPortfolio.plans.map((plan) => (
                    <div 
                      key={plan._id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan?.name === plan.name 
                          ? 'border-blue-500 bg-blue-100' 
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setFormData(prev => ({
                          ...prev,
                          totalValue: plan.currentValue.toString()
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900 capitalize">{plan.name} Plan</h5>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          plan.invested > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {plan.invested > 0 ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Invested:</span>
                          <span className="font-medium">{formatCurrency(plan.invested)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current:</span>
                          <span className="font-medium">{formatCurrency(plan.currentValue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Returns:</span>
                          <span className={`font-medium ${plan.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {plan.returns >= 0 ? '+' : ''}{formatCurrency(plan.returns)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {!selectedPlan && (
                  <p className="text-sm text-blue-600 mt-2">Please select a plan to update its value</p>
                )}
              </div>

              {/* Current Value Section */}
              {selectedPlan && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FiDollarSign className="text-yellow-600" size={24} />
                    <h4 className="text-lg font-semibold text-yellow-800">
                      Update {selectedPlan.name.charAt(0).toUpperCase() + selectedPlan.name.slice(1)} Plan Value
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Current Value *
                      </label>
                      <input
                        type="number"
                        name="totalValue"
                        value={formData.totalValue}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-semibold"
                        placeholder="Enter new value"
                        required
                      />
                      {errors.totalValue && (
                        <p className="mt-1 text-sm text-red-600">{errors.totalValue}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <div className="w-full p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="text-sm text-gray-500 mb-1">Previous Value</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(selectedPlan.currentValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Read-only Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="text-green-600 mr-2" size={20} />
                    Investment Details
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Invested:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(selectedPortfolio.totalInvested)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Returns:</span>
                      <span className={`font-semibold ${selectedPortfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPortfolio.totalReturns >= 0 ? '+' : ''}{formatCurrency(selectedPortfolio.totalReturns)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Returns %:</span>
                      <span className={`font-semibold ${selectedPortfolio.totalReturnsPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPortfolio.totalReturnsPercentage >= 0 ? '+' : ''}{selectedPortfolio.totalReturnsPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FiActivity className="text-blue-600 mr-2" size={20} />
                    Portfolio Status
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(selectedPortfolio.riskLevel || 'medium')}`}>
                        {selectedPortfolio.riskLevel || 'medium'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPortfolio.status || 'active')}`}>
                        {selectedPortfolio.status || 'active'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedPortfolio.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 cursor-pointer py-3"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSavePortfolio}
                  loading={loading}
                  disabled={!selectedPlan}
                  className="flex-1 cursor-pointer py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : `Update ${selectedPlan?.name ? selectedPlan.name.charAt(0).toUpperCase() + selectedPlan.name.slice(1) : ''} Plan`}
                </Button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default PortfolioManagement;
