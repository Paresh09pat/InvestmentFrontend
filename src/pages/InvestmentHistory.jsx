// InvestmentHistory page
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiDollarSign, 
  FiFilter, 
  FiSearch, 
  FiEye, 
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiUser,
  FiUserCheck,
  FiCreditCard
} from 'react-icons/fi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import { INVESTMENT_STATUS, VITE_APP_API_URL } from '../utils/constants';
import { formatDateForTable } from '../utils/dateUtils';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvestmentHistory = () => {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState('requests');
  
  // Investment history data from API
  const [investments, setInvestments] = useState([]);

  // Transaction requests data from API
  const [txnRequests, setTxnRequests] = useState([]);

  // Investment requests data from API
  const [investmentRequests, setInvestmentRequests] = useState([]);

  const [filteredInvestments, setFilteredInvestments] = useState(investments);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Filter and sort investments
  useEffect(() => {
    let filtered = investments.filter(investment => {
      const matchesStatus = statusFilter === 'all' || investment.status === statusFilter;
      return matchesStatus;
    });

    // Sort investments
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'plan':
          aValue = a.plan;
          bValue = b.plan;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInvestments(filtered);
  }, [investments, statusFilter, sortBy, sortOrder]);


  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };


  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setShowDetails(true);
  };

  const handleViewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedInvestment(null);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheckCircle className="text-green-600" />;
      case 'pending':
        return <FiAlertCircle className="text-yellow-600" />;
      case 'rejected':
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiClock className="text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };


  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingInvestments = investments.filter(inv => inv.status === 'pending').length;
  const completedInvestments = investments.filter(inv => inv.status === 'approved').length;


  const getInvestments = useCallback(async()=>{
    try{
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', pagination.itemsPerPage);
      
      const response = await axios.get(`${VITE_APP_API_URL}/api/transaction/history?${queryParams.toString()}`, { withCredentials: true });
      
      if(response.data.success) {
        setInvestments(response.data.data);
        setFilteredInvestments(response.data.data);
        if(response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    }
    catch(err){
      console.log(err);
      toast.error("Failed to fetch investments");
    }
    finally {
      setLoading(false);
    }
  }, [statusFilter, sortBy, sortOrder, pagination.currentPage, pagination.itemsPerPage])

  const getTxnRequests = useCallback(async()=>{
    try{
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', pagination.itemsPerPage);
      
      const res = await axios.get(`${VITE_APP_API_URL}/api/transaction/requests?${queryParams.toString()}`, { withCredentials: true });
      if(res.data.success){
        setTxnRequests(res.data.data);
        setFilteredInvestments(res.data.data);
        if(res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    }
    catch(err){
      console.log(err);
      toast.error("Failed to fetch transaction requests");
    }
    finally {
      setLoading(false);
    }
  }, [statusFilter, sortBy, sortOrder, pagination.currentPage, pagination.itemsPerPage])

  const getInvestmentRequests = useCallback(async()=>{
    try{
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', pagination.itemsPerPage);
      
      const res = await axios.get(`${VITE_APP_API_URL}/api/investment?${queryParams.toString()}`, { withCredentials: true });
      if(res.data.success){
        setInvestmentRequests(res.data.data);
        setFilteredInvestments(res.data.data);
        if(res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    }
    catch(err){
      console.log(err);
      toast.error("Failed to fetch investment requests");
    }
    finally {
      setLoading(false);
    }
  }, [statusFilter, sortBy, sortOrder, pagination.currentPage, pagination.itemsPerPage])


  useEffect(()=>{
    if (activeTab === 'history') {
      getInvestments();
    } else if (activeTab === 'investment-requests') {
      getInvestmentRequests();
    } else {
      getTxnRequests();
    }
  }, [activeTab, getInvestments, getInvestmentRequests, getTxnRequests])


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') {
      setFilteredInvestments(investments);
    } else if (tab === 'investment-requests') {
      setFilteredInvestments(investmentRequests);
    } else {
      setFilteredInvestments(txnRequests);
    }
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab === 'requests' ? 'Transaction Requests' : 
                   activeTab === 'investment-requests' ? 'Investment Requests' : 'Investment History'}
                </h1>
                <p className="text-gray-600">
                  {activeTab === 'requests' 
                    ? 'Monitor your transaction requests and their statuses'
                    : activeTab === 'investment-requests'
                    ? 'Track your investment requests and their approval status'
                    : 'Track all your investments and their performance'
                  }
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/invest')}
                  icon={<FiTrendingUp />}
                >
                  New Investment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  icon={<FiRefreshCw />}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => handleTabChange('requests')}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'text-blue-600 outline-none border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transaction Requests
            </button>
            <button
              onClick={() => handleTabChange('investment-requests')}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === 'investment-requests'
                  ? 'text-blue-600 outline-none border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Investment Requests
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 outline-none border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Investment History
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiTrendingUp className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === 'requests' 
                      ? formatCurrency(txnRequests.reduce((sum, req) => sum + req.amount, 0))
                      : activeTab === 'investment-requests'
                      ? formatCurrency(investmentRequests.reduce((sum, req) => sum + req.amount, 0))
                      : formatCurrency(totalInvested)}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {activeTab === 'requests' ? 'Approved' : 'Completed'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === 'requests' 
                      ? txnRequests.filter(req => req.status === 'approved').length
                      : activeTab === 'investment-requests'
                      ? investmentRequests.filter(req => req.status === 'approved').length
                      : completedInvestments}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiClock className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === 'requests' 
                      ? txnRequests.filter(req => req.status === 'pending').length
                      : activeTab === 'investment-requests'
                      ? investmentRequests.filter(req => req.status === 'pending').length
                      : pendingInvestments}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiCalendar className="text-orange-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === 'requests' ? txnRequests.length : 
                     activeTab === 'investment-requests' ? investmentRequests.length : investments.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex space-x-2">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 cursor-pointer py-1 text-sm rounded-full border transition-colors ${
                        statusFilter === status
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-1 text-sm border cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at">Date</option>
                  <option value="amount">Amount</option>
                  <option value="plan">Plan</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  {sortOrder === 'asc' ? <FiArrowUp size={16} /> : <FiArrowDown size={16} />}
                </button>
              </div>
            </div>
          </Card>

          {/* Investments Table */}
          <Card>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Loading transactions...</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInvestments.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">#{transaction._id.slice(-8)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <span className="font-medium text-gray-900">{transaction.userId?.name}</span>
                            <div className="text-xs text-gray-500">{transaction.userId?.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {activeTab === 'requests' 
                              ? transaction.plan?.charAt(0).toUpperCase() + transaction.plan?.slice(1)
                              : activeTab === 'investment-requests'
                              ? transaction.plan?.charAt(0).toUpperCase() + transaction.plan?.slice(1)
                              : transaction.txnReqId?.plan?.charAt(0).toUpperCase() + transaction.txnReqId?.plan?.slice(1)}
                          </span>
                        </td>
                  
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {activeTab === 'requests' 
                              ? transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1)
                              : activeTab === 'investment-requests'
                              ? 'Investment'
                              : transaction.txnReqId?.type?.charAt(0).toUpperCase() + transaction.txnReqId?.type?.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1">{transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600">
                            <div className="text-sm font-medium">{formatDateForTable(transaction.createdAt).date}</div>
                            <div className="text-xs text-gray-500">{formatDateForTable(transaction.createdAt).time}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center border-2 border-blue-500 cursor-pointer rounded-lg">
                            <button
                              onClick={() => {
                                if (activeTab === 'requests') {
                                  handleViewRequestDetails(transaction);
                                } else if (activeTab === 'investment-requests') {
                                  handleViewRequestDetails(transaction);
                                } else {
                                  handleViewDetails(transaction);
                                }
                              }}
                              className="p-1 text-blue-600 flex items-center justify-center gap-2 hover:text-blue-800 cursor-pointer rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye size={16} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {!loading && filteredInvestments.length === 0 && (
                <div className="text-center py-12">
                  <FiTrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">No transactions found</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters</p>
                </div>
              )}
            </div>
            
          </Card>
          
          {/* Pagination */}
          {!loading && pagination.totalItems > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Investment Details Modal */}
      {showDetails && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'investment-requests' ? 'Investment Request' : 'Transaction'} #{selectedInvestment._id?.slice(-8)}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {activeTab === 'requests' ? 'Transaction Request Details' : 
                       activeTab === 'investment-requests' ? 'Investment Request Details' : 'Investment History Details'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDetails}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200"
                >
                  <FiXCircle size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Transaction Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiTrendingUp className="text-blue-600" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Transaction Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Amount</span>
                        <span className="font-bold text-xl text-gray-900">{formatCurrency(selectedInvestment.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Plan</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {activeTab === 'requests' 
                            ? selectedInvestment.plan?.charAt(0).toUpperCase() + selectedInvestment.plan?.slice(1)
                            : activeTab === 'investment-requests'
                            ? selectedInvestment.plan?.charAt(0).toUpperCase() + selectedInvestment.plan?.slice(1)
                            : selectedInvestment.txnReqId?.plan?.charAt(0).toUpperCase() + selectedInvestment.txnReqId?.plan?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Type</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {activeTab === 'requests' 
                            ? selectedInvestment.type?.charAt(0).toUpperCase() + selectedInvestment.type?.slice(1)
                            : activeTab === 'investment-requests'
                            ? 'Investment'
                            : selectedInvestment.txnReqId?.type?.charAt(0).toUpperCase() + selectedInvestment.txnReqId?.type?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedInvestment.status)}`}>
                          {getStatusIcon(selectedInvestment.status)}
                          <span className="ml-2">{selectedInvestment.status?.charAt(0).toUpperCase() + selectedInvestment.status?.slice(1)}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Created Date</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatDateForTable(selectedInvestment.createdAt).date}</div>
                          <div className="text-sm text-gray-500">{formatDateForTable(selectedInvestment.createdAt).time}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FiUser className="text-purple-600" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Name</span>
                        <span className="font-semibold text-gray-900">{selectedInvestment.userId?.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="text-sm text-gray-700 break-all">{selectedInvestment.userId?.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Phone</span>
                        <span className="text-sm text-gray-700">{selectedInvestment.userId?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Trader Information Card */}
                  {(activeTab === 'requests' || activeTab === 'investment-requests') && (
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FiUserCheck className="text-orange-600" size={16} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Trader Information</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedInvestment.trader && selectedInvestment.trader.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                              <span className="text-gray-600 font-medium">Trader Name</span>
                              <span className="font-semibold text-gray-900">{selectedInvestment.trader[0]?.name}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                              <span className="text-gray-600 font-medium">Trader Type</span>
                              <span className="text-sm text-gray-700 capitalize">{selectedInvestment.trader[0]?.traderType}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                              <span className="text-gray-600 font-medium">Trader Email</span>
                              <span className="text-sm text-gray-700 break-all">{selectedInvestment.trader[0]?.email}</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <FiUserCheck className="text-gray-400" size={24} />
                            </div>
                            <p className="text-gray-500 font-medium">No trader assigned</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Details Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <FiCreditCard className="text-green-600" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium block mb-2">Wallet Transaction ID</span>
                        <span className="text-sm font-mono text-gray-800 break-all">
                          {activeTab === 'requests' 
                            ? selectedInvestment.walletTxId 
                            : activeTab === 'investment-requests'
                            ? selectedInvestment.walletTxId || 'N/A'
                            : selectedInvestment.txnReqId?.walletTxId}
                        </span>
                      </div>
                      {selectedInvestment.walletAddress && (
                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                          <span className="text-gray-600 font-medium block mb-2">Wallet Address</span>
                          <span className="text-sm font-mono text-gray-800 break-all">{selectedInvestment.walletAddress}</span>
                        </div>
                      )}
                      {(activeTab === 'requests' || activeTab === 'investment-requests') && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                          <span className="text-gray-600 font-medium">Transaction Image</span>
                          {selectedInvestment.transactionImage ? (
                            <a 
                              href={selectedInvestment.transactionImage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                            >
                              <FiEye className="mr-1" size={14} />
                              View Image
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">No image available</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {(activeTab === 'requests' || activeTab === 'investment-requests') && selectedInvestment.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <FiAlertCircle className="text-red-600" size={16} />
                        </div>
                        <h4 className="font-semibold text-red-800">Rejection Reason</h4>
                      </div>
                      <p className="text-red-700 text-sm leading-relaxed">{selectedInvestment.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={closeDetails}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Transaction Request #{selectedRequest._id?.slice(-8)}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Transaction Request Details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRequestDetails(false)}
                  className="p-3 text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200"
                >
                  <FiXCircle size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Transaction Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiTrendingUp className="text-blue-600" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Transaction Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Amount</span>
                        <span className="font-bold text-xl text-gray-900">{formatCurrency(selectedRequest.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Plan</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {selectedRequest.plan?.charAt(0).toUpperCase() + selectedRequest.plan?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Type</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {selectedRequest.type?.charAt(0).toUpperCase() + selectedRequest.type?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusIcon(selectedRequest.status)}
                          <span className="ml-2">{selectedRequest.status?.charAt(0).toUpperCase() + selectedRequest.status?.slice(1)}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Created Date</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatDateForTable(selectedRequest.createdAt).date}</div>
                          <div className="text-sm text-gray-500">{formatDateForTable(selectedRequest.createdAt).time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Trader Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FiUserCheck className="text-orange-600" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Trader Information</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedRequest.trader && selectedRequest.trader.length > 0 ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                          <span className="text-gray-600 font-medium">Trader Email</span>
                          <span className="text-sm text-gray-700 break-all">{selectedRequest.trader[0]?.email}</span>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiUserCheck className="text-gray-400" size={24} />
                          </div>
                          <p className="text-gray-500 font-medium">No trader assigned</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FiUser className="text-purple-600" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="text-sm text-gray-700 break-all">{selectedRequest.userId?.email}</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium block mb-2">Wallet Transaction ID</span>
                        <span className="text-sm font-mono text-gray-800 break-all">{selectedRequest.walletTxId}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span className="text-gray-600 font-medium">Transaction Image</span>
                        {selectedRequest.transactionImage ? (
                          <a 
                            href={selectedRequest.transactionImage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <FiEye className="mr-1" size={14} />
                            View Image
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">No image available</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {selectedRequest.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <FiAlertCircle className="text-red-600" size={16} />
                        </div>
                        <h4 className="font-semibold text-red-800">Rejection Reason</h4>
                      </div>
                      <p className="text-red-700 text-sm leading-relaxed">{selectedRequest.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRequestDetails(false)}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InvestmentHistory;



