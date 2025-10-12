import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateTime, formatDateForTable } from '../../utils/dateUtils';
import { 
  FiX, 
  FiUser, 
  FiMail, 
  FiDollarSign, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPause,
  FiRefreshCw,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiShield,
  FiHash,
  FiTag,
  FiActivity
} from 'react-icons/fi';

const TransactionViewModal = ({ isOpen, onClose, transaction }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!transaction) return null;

  // Helper functions
  const formatTransactionAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatTransactionTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        icon: FiCheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      pending: {
        icon: FiClock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      },
      processing: {
        icon: FiRefreshCw,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      },
      failed: {
        icon: FiXCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      },
      cancelled: {
        icon: FiPause,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800'
      }
    };
    return configs[status] || configs.pending;
  };

  // Get type icon and color
  const getTypeConfig = (type) => {
    const configs = {
      deposit: {
        icon: FiTrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      withdrawal: {
        icon: FiTrendingDown,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      investment: {
        icon: FiDollarSign,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      dividend: {
        icon: FiShield,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      },
      bonus: {
        icon: FiShield,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
      },
      fee: {
        icon: FiCreditCard,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    };
    return configs[type] || configs.investment;
  };

  const statusConfig = getStatusConfig(transaction.status);
  const typeConfig = getTypeConfig(transaction.type);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 ${typeConfig.bgColor} border-b ${typeConfig.borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${typeConfig.bgColor} rounded-xl flex items-center justify-center border ${typeConfig.borderColor}`}>
                    <TypeIcon className={`h-8 w-8 ${typeConfig.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">{transaction.type} Transaction</h2>
                    <p className="text-gray-600">Transaction ID: {transaction._id}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <FiX className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - User & Transaction Info */}
                <div className="space-y-6">
                  {/* User Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="h-5 w-5 mr-2 text-blue-600" />
                      User Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {transaction.userId?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{transaction.userId?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">{transaction.userId?.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiDollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Transaction Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount</span>
                        <span className={`font-bold text-lg ${
                          transaction.type === 'deposit' || transaction.type === 'dividend' || transaction.type === 'bonus'
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'withdrawal' || transaction.type === 'fee' ? '-' : '+'}
                          {formatTransactionAmount(transaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type</span>
                        <span className="capitalize font-medium">{transaction.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          <span className={`capitalize font-medium ${statusConfig.textColor}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {transaction.txnReqId && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiCreditCard className="h-5 w-5 mr-2 text-purple-600" />
                        Payment Information
                      </h4>
                      <div className="space-y-3">
                        {transaction.txnReqId.plan && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Plan</span>
                            <span className="capitalize font-medium">{transaction.txnReqId.plan}</span>
                          </div>
                        )}
                        {transaction.txnReqId.walletAddress && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Wallet Address</span>
                            <span className="font-mono text-sm text-gray-900">{transaction.txnReqId.walletAddress}</span>
                          </div>
                        )}
                        {transaction.txnReqId.walletTxId && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Wallet TX ID</span>
                            <span className="font-mono text-sm text-gray-900">{transaction.txnReqId.walletTxId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Timestamps & Additional Info */}
                <div className="space-y-6">
                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiCalendar className="h-5 w-5 mr-2 text-indigo-600" />
                      Timestamps
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Created At</p>
                        <p className="font-medium text-gray-900">
                          {formatDateForTable(transaction.createdAt).date}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateForTable(transaction.createdAt).time}
                        </p>
                      </div>
                      {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
                        <div>
                          <p className="text-sm text-gray-600">Last Updated</p>
                          <p className="font-medium text-gray-900">
                            {formatDateForTable(transaction.updatedAt).date}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateForTable(transaction.updatedAt).time}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transaction Reference */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiHash className="h-5 w-5 mr-2 text-gray-600" />
                      Reference Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-900 break-all">{transaction._id}</p>
                      </div>
                      {transaction.txnReqId?.walletTxId && (
                        <div>
                          <p className="text-sm text-gray-600">Wallet Transaction ID</p>
                          <p className="font-mono text-sm text-gray-900 break-all">{transaction.txnReqId.walletTxId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Details */}
                  <div className={`rounded-lg p-4 border ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiActivity className="h-5 w-5 mr-2 text-gray-600" />
                      Status Details
                    </h4>
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                      <div>
                        <p className={`font-semibold ${statusConfig.textColor} capitalize`}>
                          {transaction.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.status === 'completed' && 'Transaction has been successfully processed'}
                          {transaction.status === 'pending' && 'Transaction is awaiting processing'}
                          {transaction.status === 'processing' && 'Transaction is currently being processed'}
                          {transaction.status === 'failed' && 'Transaction has failed to process'}
                          {transaction.status === 'cancelled' && 'Transaction has been cancelled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionViewModal;
