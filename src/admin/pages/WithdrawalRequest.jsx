import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiTrendingDown,
  FiFilter,
  FiSearch,
  FiUser,
  FiCalendar,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPause,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/forms/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDateTime, formatDateForTable } from "../../utils/dateUtils";
import { toast } from "react-toastify";
import axios from "axios";
import { VITE_APP_API_URL } from "../../utils/constants";

// Transaction constants
const TRANSACTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  PROCESSING: "processing",
};

// Helper functions
const formatTransactionAmount = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const WithdrawalRequest = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load withdrawal transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_APP_API_URL}/api/admin/transaction-request`,
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        // Filter only withdrawal transactions
        const withdrawalTransactions = response.data.data.filter(
          (transaction) => transaction.type === "withdrawal"
        );
        console.log("Withdrawal transactions data:", withdrawalTransactions);
        console.log("Sample withdrawal transaction:", withdrawalTransactions[0]);
        setTransactions(withdrawalTransactions);
        setFilteredTransactions(withdrawalTransactions);
      } else {
        console.error("Invalid response format:", response.data);
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (error) {
      toast.error("Failed to load withdrawal requests");
      console.error("Failed to load withdrawal requests:", error);
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
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
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
  }, [transactions, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    loadTransactions();
  }, []);

  // Get withdrawal statistics
  const stats = {
    totalWithdrawals: filteredTransactions.length,
    totalVolume: filteredTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    ),
    pendingWithdrawals: filteredTransactions.filter((t) => t.status === "pending")
      .length,
    approvedWithdrawals: filteredTransactions.filter(
      (t) => t.status === "approved"
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  // Handle transaction view
  const handleViewTransaction = (transaction) => {
    // Navigate to transaction request details page
    window.location.href = `/admin/transaction-request/${transaction._id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Withdrawal Requests
          </h1>
          <p className="text-gray-600">
            Manage and review all withdrawal requests
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
                {stats.totalWithdrawals}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiTrendingDown className="text-orange-600" size={24} />
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
            <div className="p-3 bg-red-100 rounded-full">
              <FiDollarSign className="text-red-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approvedWithdrawals}
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
                {stats.pendingWithdrawals}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search withdrawal requests..."
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
              <option value={TRANSACTION_STATUS.COMPLETED}>Completed</option>
              <option value={TRANSACTION_STATUS.PROCESSING}>Processing</option>
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
            withdrawal requests
          </div>
          <Button variant="outline" size="small" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Withdrawals Table */}
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
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Wallet Address
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Transaction ID
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
                      <span className="font-semibold text-red-600">
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
                              : transaction.status ===
                                TRANSACTION_STATUS.COMPLETED
                              ? "text-green-600"
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
                          {formatDateForTable(transaction.createdAt).date}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDateForTable(transaction.createdAt).time}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-gray-600 max-w-xs truncate block">
                        {(() => {
                          const walletAddress = transaction.walletAddress || 
                                               transaction.txnReqId?.walletAddress || 
                                               transaction.address ||
                                               transaction.walletId ||
                                               transaction.userId?.trustWalletAddress ||
                                               transaction.user?.trustWalletAddress;
                          console.log("Withdrawal transaction wallet address check:", {
                            id: transaction._id,
                            walletAddress: transaction.walletAddress,
                            txnReqIdWalletAddress: transaction.txnReqId?.walletAddress,
                            address: transaction.address,
                            walletId: transaction.walletId,
                            userIdTrustWallet: transaction.userId?.trustWalletAddress,
                            userTrustWallet: transaction.user?.trustWalletAddress,
                            final: walletAddress
                          });
                          return walletAddress || "N/A";
                        })()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-gray-600">
                        {transaction.walletTxId || 
                         transaction.txnReqId?.walletTxId || 
                         transaction.transactionId || 
                         transaction._id}
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
            <FiTrendingDown className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No withdrawal requests found
            </h3>
            <p className="text-gray-600">
              {searchTerm ||
              statusFilter !== "all" ||
              dateFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No withdrawal requests have been submitted yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} withdrawal requests
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
    </div>
  );
};

export default WithdrawalRequest;
