import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPause,
  FiRefreshCw,
} from "react-icons/fi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/forms/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import TransactionViewModal from "../components/TransactionViewModal";
import { toast } from "react-toastify";
// Transaction constants
const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  INVESTMENT: "investment",
  REFUND: "refund",
  FEE: "fee",
  BONUS: "bonus",
  DIVIDEND: "dividend",
};

const TRANSACTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  PROCESSING: "processing",
};

const PAYMENT_METHODS = {
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
  CRYPTO: "crypto",
  WIRE_TRANSFER: "wire_transfer",
};

// Helper functions
const formatTransactionAmount = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatTransactionTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
  return date.toLocaleDateString();
};

import axios from "axios";
import { VITE_APP_API_URL } from "../../utils/constants";

const AdminTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  // Load transaction requests
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_APP_API_URL}/api/admin/transaction-request`,
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        setTransactions(response.data.data);
        setFilteredTransactions(response.data.data);
        // console.log("transaction requests", response.data.data);
      } else {
        console.error("Invalid response format:", response.data);
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (error) {
      toast.error("Failed to load transaction requests");
      console.error("Failed to load transaction requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          (transaction.userId?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (transaction.userId?.email || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (transaction.plan || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (transaction.type || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === typeFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (transaction) => new Date(transaction.createdAt) >= filterDate
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchTerm, statusFilter, typeFilter, dateFilter]);

  useEffect(() => {
    loadTransactions();
  }, []);

  // Get transaction request statistics
  const stats = {
    totalRequests: filteredTransactions.length,
    totalVolume: filteredTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    ),
    pendingRequests: filteredTransactions.filter((t) => t.status === "pending")
      .length,
    approvedRequests: filteredTransactions.filter(
      (t) => t.status === "approved"
    ).length,
    rejectedRequests: filteredTransactions.filter(
      (t) => t.status === "rejected"
    ).length,
    uniqueUsers: new Set(filteredTransactions.map((t) => t.userId?._id)).size,
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case TRANSACTION_STATUS.PENDING:
        return <FiClock className="text-yellow-500" size={16} />;
      case TRANSACTION_STATUS.APPROVED:
        return <FiCheckCircle className="text-green-500" size={16} />;
      case TRANSACTION_STATUS.REJECTED:
        return <FiXCircle className="text-red-500" size={16} />;
      case TRANSACTION_STATUS.COMPLETED:
        return <FiCheckCircle className="text-green-500" size={16} />;
      case TRANSACTION_STATUS.PROCESSING:
        return <FiRefreshCw className="text-blue-500" size={16} />;
      case TRANSACTION_STATUS.FAILED:
        return <FiXCircle className="text-red-500" size={16} />;
      case TRANSACTION_STATUS.CANCELLED:
        return <FiPause className="text-gray-500" size={16} />;
      default:
        return <FiAlertCircle className="text-gray-500" size={16} />;
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        return <FiTrendingUp className="text-green-500" size={16} />;
      case TRANSACTION_TYPES.WITHDRAWAL:
        return <FiTrendingDown className="text-orange-500" size={16} />;
      case TRANSACTION_TYPES.INVESTMENT:
        return <FiDollarSign className="text-blue-500" size={16} />;
      case TRANSACTION_TYPES.DIVIDEND:
        return <FiShield className="text-purple-500" size={16} />;
      case TRANSACTION_TYPES.BONUS:
        return <FiShield className="text-indigo-500" size={16} />;
      case TRANSACTION_TYPES.FEE:
        return <FiCreditCard className="text-red-500" size={16} />;
      default:
        return <FiDollarSign className="text-gray-500" size={16} />;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setDateFilter("all");
  };

  // Export transactions (placeholder)
  const handleExport = () => {
    toast.info(
      "Export functionality will be implemented with backend integration"
    );
  };

  // Handle transaction view
  const handleViewTransaction = (transaction) => {
    // Navigate to transaction request details page
    window.location.href = `/admin/transaction-request/${transaction._id}`;
  };

  // Close transaction modal
  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction Requests
          </h1>
          <p className="text-gray-600">
            View and manage all transaction requests
          </p>
        </div>
        <div className="flex space-x-3">
  
          <Button
            variant="outline"
            onClick={loadTransactions}
            icon={<FiRefreshCw />}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRequests}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTransactionAmount(stats.totalVolume)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiTrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approvedRequests}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingRequests}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search transaction requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FiSearch />}
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value={TRANSACTION_STATUS.PENDING}>Pending</option>
              <option value={TRANSACTION_STATUS.APPROVED}>Approved</option>
              <option value={TRANSACTION_STATUS.REJECTED}>Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value={TRANSACTION_TYPES.DEPOSIT}>Deposits</option>
              <option value={TRANSACTION_TYPES.WITHDRAWAL}>Withdrawals</option>
            </select>
          </div>

          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transaction requests
          </div>
          <Button variant="outline" size="small" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : currentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  WalletTxId
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.userId?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.userId?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {transaction.plan || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">
                          {transaction.type || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-green-600">
                        {formatTransactionAmount(transaction.amount || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span
                          className={`capitalize text-sm font-medium ${
                            transaction.status === TRANSACTION_STATUS.PENDING
                              ? "text-yellow-600"
                              : transaction.status ===
                                TRANSACTION_STATUS.APPROVED
                              ? "text-green-600"
                              : transaction.status ===
                                TRANSACTION_STATUS.REJECTED
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatTransactionTime(transaction.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-gray-600">
                        {transaction.walletTxId || transaction._id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="small"
                        icon={<FiEye />}
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiDollarSign className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transaction requests found
            </h3>
            <p className="text-gray-600">
              {searchTerm ||
              statusFilter !== "all" ||
              typeFilter !== "all" ||
              dateFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No transaction requests have been recorded yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} transaction requests
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="small"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="small"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction View Modal */}
      <TransactionViewModal
        isOpen={showTransactionModal}
        onClose={handleCloseTransactionModal}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default AdminTransactionHistory;
