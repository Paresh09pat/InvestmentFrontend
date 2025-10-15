import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiXCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import Input from '../../components/forms/Input';
import {
  REFERRAL_PLAN_COLORS,
  REFERRAL_PLAN_NAMES,
  REFERRAL_TRANSACTION_STATUS
} from '../../utils/constants';
import { formatCurrency, formatDateTime } from '../../utils/dateUtils';
import { adminReferralApi } from '../../utils/referralApi';

const ReferralManagement = () => {
  const [referralTransactions, setReferralTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editRewardAmount, setEditRewardAmount] = useState('');
  const [editRewardPercentage, setEditRewardPercentage] = useState('');
  const [editRejectionReason, setEditRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchReferralTransactions();
  }, [currentPage, statusFilter]);

  const fetchReferralTransactions = async () => {
    setLoading(true);
    try {
      const response = await adminReferralApi.getAllReferralTransactions(
        currentPage,
        itemsPerPage,
        statusFilter
      );
      
      setReferralTransactions(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching referral transactions:', error);
      setError('Failed to load referral transactions');
      toast.error('Failed to load referral transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setEditStatus(transaction.status || '');
    setEditRewardAmount(transaction.rewardAmount || '');
    
    // Calculate percentage from existing reward amount and deposit amount
    if (transaction.rewardAmount && transaction.referredDepositAmount) {
      const percentage = ((transaction.rewardAmount / transaction.referredDepositAmount) * 100).toFixed(2);
      setEditRewardPercentage(percentage);
    } else {
      setEditRewardPercentage('');
    }
    
    setEditRejectionReason(transaction.rejectionReason || '');
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedTransaction) return;

    setProcessing(true);
    try {
      // Validate required fields based on status
      if (editStatus === 'approved' && (!editRewardPercentage || parseFloat(editRewardPercentage) <= 0)) {
        toast.error('Please enter a valid reward percentage for approved status');
        return;
      }
      
      if (editStatus === 'rejected' && !editRejectionReason.trim()) {
        toast.error('Please provide a rejection reason for rejected status');
        return;
      }

      // Calculate reward amount from percentage
      const calculatedRewardAmount = editStatus === 'approved' 
        ? (parseFloat(editRewardPercentage) / 100) * selectedTransaction.referredDepositAmount
        : 0;

      // Prepare update data
      const updateData = {
        status: editStatus,
        rewardAmount: calculatedRewardAmount,
        rewardPercentage: editStatus === 'approved' ? parseFloat(editRewardPercentage) : 0,
        rejectionReason: editStatus === 'rejected' ? editRejectionReason : ''
      };

      await adminReferralApi.updateReferralTransaction(selectedTransaction._id, updateData);
      toast.success('Referral transaction updated successfully');

      setShowEditModal(false);
      setSelectedTransaction(null);
      setEditStatus('');
      setEditRewardAmount('');
      setEditRewardPercentage('');
      setEditRejectionReason('');
      fetchReferralTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case REFERRAL_TRANSACTION_STATUS.PENDING:
        return <FiClock className="text-yellow-500" />;
      case REFERRAL_TRANSACTION_STATUS.APPROVED:
        return <FiCheckCircle className="text-green-500" />;
      case REFERRAL_TRANSACTION_STATUS.REJECTED:
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case REFERRAL_TRANSACTION_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case REFERRAL_TRANSACTION_STATUS.APPROVED:
        return 'bg-green-100 text-green-800';
      case REFERRAL_TRANSACTION_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = referralTransactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.referrer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referrer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referred?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referred?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const transactionColumns = [
    {
      key: 'referrer',
      title: 'Referrer',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.referrer?.name}</div>
          <div className="text-sm text-gray-500">{row.referrer?.email}</div>
        </div>
      )
    },
    {
      key: 'referred',
      title: 'Referred User',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.referred?.name}</div>
          <div className="text-sm text-gray-500">{row.referred?.email}</div>
        </div>
      )
    },
    {
      key: 'referredPlan',
      title: 'Plan',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${REFERRAL_PLAN_COLORS[value] || 'bg-gray-100 text-gray-800'}`}>
          {REFERRAL_PLAN_NAMES[value] || value}
        </span>
      )
    },
    {
      key: 'referredDepositAmount',
      title: 'Deposit Amount',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'rewardAmount',
      title: 'Reward Amount',
      render: (value) => value ? formatCurrency(value) : '-'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <FiEye size={16} />
          </button>
          {row.status !== 'approved' && (
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
              title="Edit Transaction"
            >
              <FiEdit size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading && !referralTransactions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" color="primary" text="Loading referral transactions..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Management</h1>
          <p className="text-gray-600">Manage referral transactions and rewards</p>
        </div>


        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value={REFERRAL_TRANSACTION_STATUS.PENDING}>Pending</option>
                  <option value={REFERRAL_TRANSACTION_STATUS.APPROVED}>Approved</option>
                  <option value={REFERRAL_TRANSACTION_STATUS.REJECTED}>Rejected</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  fetchReferralTransactions();
                }}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <FiRefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Referral Transactions</h3>
            <div className="text-sm text-gray-500">
              Showing {filteredTransactions.length} of {totalItems} transactions
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError('');
                  fetchReferralTransactions();
                }}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <Table
                columns={transactionColumns}
                data={filteredTransactions}
                className="mt-4"
              />
              
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Referral Transaction Details"
          size="lg"
        >
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Referrer</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{selectedTransaction.referrer?.name}</p>
                    <p className="text-sm text-gray-600">{selectedTransaction.referrer?.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Referred User</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{selectedTransaction.referred?.name}</p>
                    <p className="text-sm text-gray-600">{selectedTransaction.referred?.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Plan</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${REFERRAL_PLAN_COLORS[selectedTransaction.referredPlan] || 'bg-gray-100 text-gray-800'}`}>
                    {REFERRAL_PLAN_NAMES[selectedTransaction.referredPlan] || selectedTransaction.referredPlan}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Deposit Amount</h4>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedTransaction.referredDepositAmount)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Reward Amount</h4>
                  <p className="text-lg font-semibold text-blue-600">
                    {selectedTransaction.rewardAmount ? formatCurrency(selectedTransaction.rewardAmount) : 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Created Date</h4>
                <p className="text-gray-600">{formatDateTime(selectedTransaction.createdAt)}</p>
              </div>

              {selectedTransaction.updatedAt && selectedTransaction.updatedAt !== selectedTransaction.createdAt && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                  <p className="text-gray-600">{formatDateTime(selectedTransaction.updatedAt)}</p>
                </div>
              )}

              {selectedTransaction.approvedAt && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Approved Details</h4>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-green-800">
                      <strong>Approved by:</strong> {selectedTransaction.approvedBy?.name || 'Admin'}
                    </p>
                    <p className="text-green-800">
                      <strong>Approved on:</strong> {formatDateTime(selectedTransaction.approvedAt)}
                    </p>
                    <p className="text-green-800">
                      <strong>Reward Amount:</strong> {formatCurrency(selectedTransaction.rewardAmount)}
                    </p>
                  </div>
                </div>
              )}

              {selectedTransaction.rejectionReason && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Rejection Reason</h4>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800">{selectedTransaction.rejectionReason}</p>
                  </div>
                </div>
              )}

              {selectedTransaction.status === 'approved' && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center space-x-2">
                    <FiCheckCircle className="text-blue-600" size={16} />
                    <p className="text-blue-800 text-sm font-medium">
                      This transaction has been approved and cannot be edited.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Referral Transaction"
          size="md"
        >
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Transaction Summary</h4>
                <p className="text-sm text-gray-600">
                  <strong>Referrer:</strong> {selectedTransaction.referrer?.name} ({selectedTransaction.referrer?.email})
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Referred User:</strong> {selectedTransaction.referred?.name} ({selectedTransaction.referred?.email})
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Plan:</strong> {REFERRAL_PLAN_NAMES[selectedTransaction.referredPlan] || selectedTransaction.referredPlan}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Deposit Amount:</strong> {formatCurrency(selectedTransaction.referredDepositAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Percentage {editStatus === 'approved' && '*'}
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={editRewardPercentage}
                    onChange={(e) => setEditRewardPercentage(e.target.value)}
                    placeholder="Enter percentage"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={editStatus !== 'approved'}
                    className="flex-1"
                  />
                  <span className="text-gray-500 font-medium">%</span>
                </div>
                
                {editStatus === 'approved' && editRewardPercentage && selectedTransaction && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Calculated Reward Amount:</span>{' '}
                      {formatCurrency((parseFloat(editRewardPercentage) / 100) * selectedTransaction.referredDepositAmount)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Based on deposit amount: {formatCurrency(selectedTransaction.referredDepositAmount)}
                    </p>
                  </div>
                )}
                
                {editStatus !== 'approved' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Reward percentage is only required for approved status
                  </p>
                )}
              </div>

              {editStatus === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={editRejectionReason}
                    onChange={(e) => setEditRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  variant="primary"
                  disabled={processing}
                >
                  {processing ? 'Updating...' : 'Update Transaction'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReferralManagement;
