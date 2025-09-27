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
import { INVESTMENT_STATUS, VITE_APP_API_URL } from '../utils/constants';
import axios from 'axios';

const InvestmentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample investment history data (replace with actual API call)
  const [investments, setInvestments] = useState([
    {
      id: 1,
      amount: 100000,
      investmentDate: '2024-01-20',
      maturityDate: '2024-07-20',
      status: INVESTMENT_STATUS.ACTIVE,
      expectedReturns: 12000,
      currentValue: 108000,
      monthlyReturns: 2000,
      transactionId: 'TXN123456789',
      paymentScreenshot: 'payment_1.jpg'
    },
    {
      id: 2,
      amount: 50000,
      investmentDate: '2023-12-15',
      maturityDate: '2024-03-15',
      status: INVESTMENT_STATUS.COMPLETED,
      expectedReturns: 4000,
      currentValue: 54000,
      monthlyReturns: 1333,
      transactionId: 'TXN987654321',
      paymentScreenshot: 'payment_2.jpg'
    },
    {
      id: 3,
      amount: 75000,
      investmentDate: '2024-02-25',
      maturityDate: '2024-08-25',
      status: INVESTMENT_STATUS.ACTIVE,
      expectedReturns: 9000,
      currentValue: 78000,
      monthlyReturns: 1500,
      transactionId: 'TXN456789123',
      paymentScreenshot: 'payment_3.jpg'
    },
    {
      id: 4,
      amount: 25000,
      investmentDate: '2024-03-12',
      maturityDate: '2024-06-12',
      status: INVESTMENT_STATUS.PENDING,
      expectedReturns: 2000,
      currentValue: 25000,
      monthlyReturns: 667,
      transactionId: 'TXN789123456',
      paymentScreenshot: 'payment_4.jpg'
    }
  ]);

  const [filteredInvestments, setFilteredInvestments] = useState(investments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter and sort investments
  useEffect(() => {
    let filtered = investments.filter(investment => {
      const matchesSearch = investment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investment.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || investment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort investments
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'returns':
          aValue = a.expectedReturns;
          bValue = b.expectedReturns;
          break;
        case 'date':
        default:
          aValue = new Date(a.investmentDate);
          bValue = new Date(b.investmentDate);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInvestments(filtered);
  }, [investments, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
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
      case INVESTMENT_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case INVESTMENT_STATUS.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case INVESTMENT_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case INVESTMENT_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case INVESTMENT_STATUS.ACTIVE:
        return <FiClock className="text-green-600" />;
      case INVESTMENT_STATUS.COMPLETED:
        return <FiCheckCircle className="text-blue-600" />;
      case INVESTMENT_STATUS.PENDING:
        return <FiAlertCircle className="text-yellow-600" />;
      case INVESTMENT_STATUS.CANCELLED:
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
  const totalReturns = investments.reduce((sum, inv) => sum + inv.expectedReturns, 0);
  const activeInvestments = investments.filter(inv => inv.status === INVESTMENT_STATUS.ACTIVE).length;


  const getInvestments = async()=>{
    try{
      const response = await axios.get(`${VITE_APP_API_URL}/api/transaction`, { withCredentials: true });
      // setInvestments(response.data.investments);
    }
    catch(err){
      console.log(err);
      toast.error("Failed to fetch investments");
    }
  }

  useEffect(()=>{
    getInvestments();
  })

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
                  <FiDollarSign className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Returns</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReturns)}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiClock className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Investments</p>
                  <p className="text-2xl font-bold text-gray-900">{activeInvestments}</p>
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

          {/* Filters and Search */}
          <Card className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Transaction ID or Investment ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex space-x-2">
                  {['all', ...Object.values(INVESTMENT_STATUS)].map((status) => (
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
                  <option value="returns">Returns</option>
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Investment ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Investment Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Maturity Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Expected Returns</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvestments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">#{investment.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{formatDate(investment.investmentDate)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="text-gray-600">{formatDate(investment.maturityDate)}</span>
                          {investment.status === INVESTMENT_STATUS.ACTIVE && (
                            <div className="text-xs text-gray-500 mt-1">
                              {calculateDaysRemaining(investment.maturityDate)} days remaining
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(investment.status)}`}>
                          {getStatusIcon(investment.status)}
                          <span className="ml-1">{investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-green-600">{formatCurrency(investment.expectedReturns)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(investment)}
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
                  ))}
                </tbody>
              </table>

              {filteredInvestments.length === 0 && (
                <div className="text-center py-12">
                  <FiTrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">No investments found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Investment Details Modal */}
      {showDetails && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Investment Details #{selectedInvestment.id}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">{formatCurrency(selectedInvestment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment Date:</span>
                        <span>{formatDate(selectedInvestment.investmentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maturity Date:</span>
                        <span>{formatDate(selectedInvestment.maturityDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedInvestment.status)}`}>
                          {getStatusIcon(selectedInvestment.status)}
                          <span className="ml-1">{selectedInvestment.status.charAt(0).toUpperCase() + selectedInvestment.status.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Returns & Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Returns:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(selectedInvestment.expectedReturns)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Value:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(selectedInvestment.currentValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Returns:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(selectedInvestment.monthlyReturns)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">{selectedInvestment.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Screenshot:</span>
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          View
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedInvestment.status === INVESTMENT_STATUS.ACTIVE && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Investment Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Days Remaining:</span>
                          <span className="font-semibold">{calculateDaysRemaining(selectedInvestment.maturityDate)} days</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(0, Math.min(100, ((new Date(selectedInvestment.maturityDate) - new Date()) / (new Date(selectedInvestment.maturityDate) - new Date(selectedInvestment.investmentDate))) * 100))}%`
                            }}
                          ></div>
                        </div>
                      </div>
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


