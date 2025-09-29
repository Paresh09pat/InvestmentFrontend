// InvestmentHistory page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiDollarSign, 
  FiFilter, 
  FiSearch, 
  FiEye, 
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import { INVESTMENT_STATUS, VITE_APP_API_URL } from '../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvestmentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Investment history data from API
  const [investments, setInvestments] = useState([]);

  const [filteredInvestments, setFilteredInvestments] = useState(investments);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
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
      const matchesType = typeFilter === 'all' || investment.type === typeFilter;
      return matchesStatus && matchesType;
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
        case 'date':
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
  }, [investments, statusFilter, typeFilter, sortBy, sortOrder]);


  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (maturityDate) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingInvestments = investments.filter(inv => inv.status === 'pending').length;
  const completedInvestments = investments.filter(inv => inv.status === 'approved').length;


  const getInvestments = async()=>{
    try{
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', pagination.itemsPerPage);
      
      const response = await axios.get(`${VITE_APP_API_URL}/api/transaction?${queryParams.toString()}`, { withCredentials: true });
      
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
  }

  useEffect(()=>{
    getInvestments();
  }, [statusFilter, typeFilter, sortBy, sortOrder, pagination.currentPage, pagination.itemsPerPage])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Investment History
                </h1>
                <p className="text-gray-600">
                  Track all your investments and their performance
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiTrendingUp className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedInvestments}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{pendingInvestments}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiCalendar className="text-orange-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Investments</p>
                  <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
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
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
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

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <div className="flex space-x-2">
                  {['all', 'deposit', 'withdrawal'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeFilter(type)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        typeFilter === type
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
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
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Trader</th>
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
                            {transaction.plan?.charAt(0).toUpperCase() + transaction.plan?.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            {transaction.trader && transaction.trader.length > 0 ? (
                              <>
                                <span className="font-medium text-gray-900">{transaction.trader[0]?.name}</span>
                                <div className="text-xs text-gray-500">{transaction.trader[0]?.traderType}</div>
                              </>
                            ) : (
                              <span className="text-gray-500">No trader assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1">{transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">{formatDate(transaction.createdAt)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(transaction)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Download Statement"
                            >
                              <FiDownload size={16} />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Transaction Details #{selectedInvestment._id?.slice(-8)}
                </h2>
                <button
                  onClick={closeDetails}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiXCircle size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">{formatCurrency(selectedInvestment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedInvestment.plan?.charAt(0).toUpperCase() + selectedInvestment.plan?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {selectedInvestment.type?.charAt(0).toUpperCase() + selectedInvestment.type?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedInvestment.status)}`}>
                          {getStatusIcon(selectedInvestment.status)}
                          <span className="ml-1">{selectedInvestment.status?.charAt(0).toUpperCase() + selectedInvestment.status?.slice(1)}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created Date:</span>
                        <span>{formatDate(selectedInvestment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{selectedInvestment.userId?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-sm">{selectedInvestment.userId?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-sm">{selectedInvestment.userId?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Trader Information</h3>
                    <div className="space-y-3">
                      {selectedInvestment.trader && selectedInvestment.trader.length > 0 ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trader Name:</span>
                            <span className="font-semibold">{selectedInvestment.trader[0]?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trader Type:</span>
                            <span className="text-sm">{selectedInvestment.trader[0]?.traderType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trader Email:</span>
                            <span className="text-sm">{selectedInvestment.trader[0]?.email}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-center py-4">No trader assigned</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wallet TX ID:</span>
                        <span className="font-mono text-sm">{selectedInvestment.walletTxId}</span>
                      </div>
                      {selectedInvestment.walletAddress && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wallet Address:</span>
                          <span className="font-mono text-sm">{selectedInvestment.walletAddress}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Image:</span>
                        {selectedInvestment.transactionImage ? (
                          <a 
                            href={selectedInvestment.transactionImage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            View Image
                          </a>
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedInvestment.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Rejection Reason</h4>
                      <p className="text-red-700 text-sm">{selectedInvestment.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={closeDetails}>
                  Close
                </Button>
                <Button icon={<FiDownload />}>
                  Download Statement
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


