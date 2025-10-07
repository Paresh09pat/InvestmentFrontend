// InvestmentManagement page
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiEye,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";
import { INVESTMENT_STATUS, VITE_APP_API_URL } from "../../utils/constants";
import { formatDateTime, formatDateForTable } from "../../utils/dateUtils";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Input from "../../components/forms/Input";

const InvestmentManagement = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [error, setError] = useState(null);

  // API function to fetch transaction requests
  const fetchTransactionRequests = async (
    page = 1,
    limit = 10,
    status = "",
    type = "",
    plan = ""
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status && status !== "all") params.append("status", status);
      if (type) params.append("type", type);
      if (plan) params.append("plan", plan);

      const response = await axios.get(
        `${VITE_APP_API_URL}/api/admin/transaction-request?${params}`
      );

      if (response.data.success) {
        setInvestments(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(
          response.data.message || "Failed to fetch transaction requests"
        );
      }
    } catch (error) {
      console.error("Error fetching transaction requests:", error);
      setError(
        error.response?.data?.message || "Failed to fetch transaction requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userData) => {
    if (typeof userData === "object" && userData?.name) {
      return userData.name;
    }
    return "Unknown User";
  };

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        if (searchTerm) {
          fetchTransactionRequests(
            pagination.currentPage,
            pagination.itemsPerPage,
            statusFilter,
            "",
            searchTerm
          );
        } else {
          fetchTransactionRequests(
            pagination.currentPage,
            pagination.itemsPerPage,
            statusFilter
          );
        }
      },
      searchTerm ? 500 : 0
    ); // No delay for non-search changes

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    pagination.currentPage,
    pagination.itemsPerPage,
    statusFilter,
  ]);

  // Use investments directly since filtering is done server-side
  const filteredInvestments = investments;

  const handleUpdateInvestmentStatus = async (investmentId, status) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInvestments((prev) =>
        prev.map((investment) =>
          investment.id === investmentId
            ? { ...investment, status }
            : investment
        )
      );
    } catch (err) {
      console.error("Failed to update investment status:", err);
    } finally {
      setLoading(false);
    }
  };


  const viewInvestmentDetails = (investment) => {
    navigate(`/admin/transaction-request/${investment._id}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const colors = {
      [INVESTMENT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [INVESTMENT_STATUS.APPROVED]: "bg-blue-100 text-blue-800",
      [INVESTMENT_STATUS.REJECTED]: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: "userId",
      title: "Investor",
      render: (value) => {
        const userName = getUserName(value);
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium">{userName}</span>
              {value?.email && (
                <div className="text-xs text-gray-500">{value.email}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "plan",
      title: "Plan",
      render: (value) => (
        <span className="font-medium text-gray-900">{value || "N/A"}</span>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value || 0)}</span>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Request Date",
      render: (value) => (
        <div>
          <div className="text-sm font-medium">{formatDateForTable(value).date}</div>
          <div className="text-xs text-gray-500">{formatDateForTable(value).time}</div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, investment) => (
        <button
          onClick={() => viewInvestmentDetails(investment)}
          className="w-full cursor-pointer flex items-center justify-around py-2 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          title="View Details"
        >
          <div className="flex items-center space-x-3">
            <div className="  rounded-full flex items-center justify-center">
              <FiEye className="text-blue-600" size={16} />
            </div>
            <span className="text-blue-600 font-medium">View</span>
          </div>
        </button>
      ),
    },
  ];

  // Calculate statistics
  const totalInvestmentAmount = investments.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const totalRequests = investments.length;
  const pendingRequests = investments.filter(
    (inv) => inv.status === INVESTMENT_STATUS.PENDING
  ).length;
  const activeRequests = investments.filter(
    (inv) => inv.status === INVESTMENT_STATUS.ACTIVE
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction Request Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage all transaction requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRequests}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiTrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card
          hover
          className="animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalInvestmentAmount)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-green-600 text-2xl font-bold">$</span>
            </div>
          </div>
        </Card>

        <Card
          hover
          className="animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingRequests}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiActivity className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>

        <Card
          hover
          className="animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeRequests}
              </p>
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
              placeholder="Search transaction requests by plan or investor name..."
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

              <option value={INVESTMENT_STATUS.PENDING}>Pending</option>
              <option value={INVESTMENT_STATUS.APPROVED}>Approved</option>
              <option value={INVESTMENT_STATUS.REJECTED}>Rejected</option>
              {/* <option value={INVESTMENT_STATUS.CANCELLED}>Cancelled</option> */}
            </select>

            <Button variant="outline" icon={<FiFilter />}>
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <FiX size={20} />
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Transaction Requests Table */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Requests ({pagination.totalItems})
          </h2>
          {loading && (
            <div className="flex items-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        <Table columns={columns} data={filteredInvestments} hover striped />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  fetchTransactionRequests(
                    pagination.currentPage - 1,
                    pagination.itemsPerPage,
                    statusFilter
                  )
                }
                disabled={pagination.currentPage === 1 || loading}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  fetchTransactionRequests(
                    pagination.currentPage + 1,
                    pagination.itemsPerPage,
                    statusFilter
                  )
                }
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
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

export default InvestmentManagement;
