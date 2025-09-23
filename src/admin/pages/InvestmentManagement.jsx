// InvestmentManagement page
import { useState } from 'react';
import { 
  FiTrendingUp, 
  FiSearch, 
  FiFilter, 
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiCalendar,
  FiActivity
} from 'react-icons/fi';
import { dummyInvestments, dummyUsers } from '../../utils/dummyData';
import { INVESTMENT_STATUS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/forms/Input';
import Modal from '../../components/common/Modal';

const InvestmentManagement = () => {
  const [investments, setInvestments] = useState(dummyInvestments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get user name by userId
  const getUserName = (userId) => {
    const user = dummyUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const filteredInvestments = investments.filter(investment => {
    const userName = getUserName(investment.userId);
    const matchesSearch = searchTerm === '' || 
      investment.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      investment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateInvestmentStatus = async (investmentId, status) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvestments(prev => prev.map(investment => 
        investment.id === investmentId 
          ? { ...investment, status }
          : investment
      ));
    } catch (error) {
      console.error('Failed to update investment status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = async (investmentId) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInvestments(prev => prev.filter(investment => investment.id !== investmentId));
      } catch (error) {
        console.error('Failed to delete investment');
      } finally {
        setLoading(false);
      }
    }
  };

  const viewInvestmentDetails = (investment) => {
    setSelectedInvestment(investment);
    setShowInvestmentModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const colors = {
      [INVESTMENT_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
      [INVESTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [INVESTMENT_STATUS.COMPLETED]: 'bg-blue-100 text-blue-800',
      [INVESTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const columns = [
    {
      key: 'userId',
      title: 'Investor',
      render: (value) => {
        const user = dummyUsers.find(u => u.id === value);
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user ? user.name.charAt(0) : 'U'}
              </span>
            </div>
            <span className="font-medium">{user ? user.name : 'Unknown'}</span>
          </div>
        );
      }
    },
    {
      key: 'planName',
      title: 'Plan',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'currentValue',
      title: 'Current Value',
      render: (value, investment) => (
        <div>
          <span className="font-semibold text-green-600">{formatCurrency(value)}</span>
          <div className="text-xs text-green-600">
            +{formatCurrency(value - investment.amount)}
          </div>
        </div>
      )
    },
    {
      key: 'investmentDate',
      title: 'Start Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'maturityDate',
      title: 'Maturity',
      render: (value, investment) => (
        <div>
          <div className="text-sm">{new Date(value).toLocaleDateString()}</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress(investment.investmentDate, value)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {calculateProgress(investment.investmentDate, value)}%
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, investment) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewInvestmentDetails(investment)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <FiEye size={16} />
          </button>
          
          {investment.status === INVESTMENT_STATUS.PENDING && (
            <>
              <button
                onClick={() => handleUpdateInvestmentStatus(investment.id, INVESTMENT_STATUS.ACTIVE)}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                title="Approve"
                disabled={loading}
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => handleUpdateInvestmentStatus(investment.id, INVESTMENT_STATUS.CANCELLED)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                title="Reject"
                disabled={loading}
              >
                <FiX size={16} />
              </button>
            </>
          )}

          {investment.status === INVESTMENT_STATUS.ACTIVE && (
            <button
              onClick={() => handleUpdateInvestmentStatus(investment.id, INVESTMENT_STATUS.COMPLETED)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              title="Mark as Completed"
              disabled={loading}
            >
              <FiCheck size={16} />
            </button>
          )}
          
          <button
            onClick={() => handleDeleteInvestment(investment.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            title="Delete Investment"
            disabled={loading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  // Calculate statistics
  const totalInvestmentAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const activeInvestments = investments.filter(inv => inv.status === INVESTMENT_STATUS.ACTIVE).length;
  const completedInvestments = investments.filter(inv => inv.status === INVESTMENT_STATUS.COMPLETED).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage all investment activities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Investments</p>
              <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiTrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestmentAmount)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-green-600 text-2xl font-bold">$</span>
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeInvestments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiActivity className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>

        <Card hover className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedInvestments}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiCheck className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search investments by plan or investor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FiSearch />}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value={INVESTMENT_STATUS.ACTIVE}>Active</option>
              <option value={INVESTMENT_STATUS.PENDING}>Pending</option>
              <option value={INVESTMENT_STATUS.COMPLETED}>Completed</option>
              <option value={INVESTMENT_STATUS.CANCELLED}>Cancelled</option>
            </select>
            
            <Button variant="outline" icon={<FiFilter />}>
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Investments Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Investments ({filteredInvestments.length})
          </h2>
        </div>
        
        <Table
          columns={columns}
          data={filteredInvestments}
          hover
          striped
        />
      </Card>

      {/* Investment Details Modal */}
      <Modal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        title="Investment Details"
        size="lg"
      >
        {selectedInvestment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investor
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {getUserName(selectedInvestment.userId).charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{getUserName(selectedInvestment.userId)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Plan
                  </label>
                  <span className="font-semibold">{selectedInvestment.planName}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount
                  </label>
                  <span className="font-semibold text-lg">
                    {formatCurrency(selectedInvestment.amount)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Value
                  </label>
                  <span className="font-semibold text-green-600 text-lg">
                    {formatCurrency(selectedInvestment.currentValue)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-gray-400" size={16} />
                    <span>{new Date(selectedInvestment.investmentDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maturity Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-gray-400" size={16} />
                    <span>{new Date(selectedInvestment.maturityDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Returns
                  </label>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(selectedInvestment.expectedReturns)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  {getStatusBadge(selectedInvestment.status)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Progress
              </label>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${calculateProgress(selectedInvestment.investmentDate, selectedInvestment.maturityDate)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Start</span>
                <span>{calculateProgress(selectedInvestment.investmentDate, selectedInvestment.maturityDate)}% Complete</span>
                <span>Maturity</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Financial Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedInvestment.amount)}
                  </div>
                  <div className="text-sm text-gray-600">Principal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    +{formatCurrency(selectedInvestment.currentValue - selectedInvestment.amount)}
                  </div>
                  <div className="text-sm text-gray-600">Profit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(((selectedInvestment.currentValue - selectedInvestment.amount) / selectedInvestment.amount) * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
              </div>
            </div>

            {selectedInvestment.status === INVESTMENT_STATUS.PENDING && (
              <div className="flex space-x-4 pt-4 border-t">
                <Button
                  variant="success"
                  onClick={() => {
                    handleUpdateInvestmentStatus(selectedInvestment.id, INVESTMENT_STATUS.ACTIVE);
                    setShowInvestmentModal(false);
                  }}
                  icon={<FiCheck />}
                >
                  Approve Investment
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleUpdateInvestmentStatus(selectedInvestment.id, INVESTMENT_STATUS.CANCELLED);
                    setShowInvestmentModal(false);
                  }}
                  icon={<FiX />}
                >
                  Reject Investment
                </Button>
              </div>
            )}

            {selectedInvestment.status === INVESTMENT_STATUS.ACTIVE && (
              <div className="flex space-x-4 pt-4 border-t">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateInvestmentStatus(selectedInvestment.id, INVESTMENT_STATUS.COMPLETED);
                    setShowInvestmentModal(false);
                  }}
                  icon={<FiCheck />}
                >
                  Mark as Completed
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestmentManagement;
