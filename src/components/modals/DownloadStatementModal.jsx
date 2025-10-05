import React, { useState } from 'react';
import {
    FiDownload,
    FiFileText,
    FiFilter,
    FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { downloadStatement } from '../../utils/downloadStatement.jsx';

const DownloadStatementModal = ({ 
  isOpen, 
  onClose, 
  transactions = [], 
  selectedTransaction = null,
  filters = {},
  onSuccess 
}) => {
  const [dateRange, setDateRange] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all');

  const isSingleDownload = Boolean(selectedTransaction);
  const downloadTitle = isSingleDownload ? 'Download Transaction Statement' : 'Download Portfolio Statement';

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      let dataToDownload;
      let downloadFilters = {};

      if (isSingleDownload) {
        dataToDownload = selectedTransaction;
      } else {
        // Apply date range filter to transactions
        let filteredTransactions = [...transactions];
        
        if (dateRange !== 'all') {
          const now = new Date();
          let startDate, endDate;
          
          switch (dateRange) {
            case 'today':
              startDate = endDate = now;
              break;
            case 'week':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              endDate = now;
              break;
            case 'month':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              endDate = now;
              break;
            case 'quarter':
              startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              endDate = now;
              break;
            case 'year':
              startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
              endDate = now;
              break;
            case 'custom':
              startDate = customDateRange.start ? new Date(customDateRange.start) : null;
              endDate = customDateRange.end ? new Date(customDateRange.end) : null;
              break;
            default:
              // No date filter
          }

          if (startDate && endDate) {
            filteredTransactions = transactions.filter(transaction => {
              const transactionDate = new Date(transaction.createdAt);
              return transactionDate >= startDate && transactionDate <= endDate;
            });
          }
        }

        // Apply status filter
        if (statusFilter !== 'all') {
          filteredTransactions = filteredTransactions.filter(transaction => 
            transaction.status === statusFilter
          );
        }

        // Apply type filter
        if (typeFilter !== 'all') {
          filteredTransactions = filteredTransactions.filter(transaction => 
            transaction.type === typeFilter
          );
        }

        dataToDownload = filteredTransactions;
        
        // Add filters to download options
        downloadFilters = {
          statusFilter,
          typeFilter,
          dateRange: dateRange === 'custom' ? `${customDateRange.start} to ${customDateRange.end}` : dateRange,
          transactionCount: filteredTransactions.length
        };
      }

      const result = await downloadStatement(
        isSingleDownload ? 'single' : 'multiple',
        dataToDownload,
        'pdf',
        downloadFilters
      );

      if (result.success) {
        toast.success(result.message);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download statement. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const getTransactionCount = () => {
    let count = transactions.length;
    
    if (statusFilter !== 'all') {
      count = transactions.filter(t => t.status === statusFilter).length;
    }
    
    if (typeFilter !== 'all') {
      count = transactions.filter(t => t.type === typeFilter).length;
    }

    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FiDownload className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">{downloadTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isDownloading}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Download Type Summary */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiFileText className="text-blue-600" />
              <span className="font-semibold text-blue-900">PDF Statement</span>
            </div>
            <p className="text-blue-800 text-sm">
              {isSingleDownload 
                ? `Downloading statement for transaction #${selectedTransaction?._id?.slice(-8)}`
                : `Downloading statements for ${getTransactionCount()} transactions`
              }
            </p>
            <p className="text-blue-600 text-xs mt-1">
              📄 Professional PDF format with detailed transaction information
            </p>
          </div>

          {/* Filters (only for multiple transactions) */}
          {!isSingleDownload && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FiFilter className="inline mr-2" />
                Filter Options
              </label>
              
              <div className="space-y-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {dateRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {dateRange === 'custom' && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="End Date"
                      />
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Status Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Type Filter</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Preview Information */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Download Preview</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Format: <span className="font-medium">PDF</span></div>
              <div>Transactions: <span className="font-medium">{getTransactionCount()}</span></div>
              {dateRange !== 'all' && (
                <div>Date Range: <span className="font-medium">{dateRange}</span></div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDownloading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || (dateRange === 'custom' && (!customDateRange.start || !customDateRange.end))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <FiDownload size={16} />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadStatementModal;