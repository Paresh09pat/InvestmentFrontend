// TransactionRequestDetails page
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiCheck,
  FiX,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiTag,
  FiActivity,
  FiImage,
  FiHash,
  FiPhone,
  FiAlertCircle,
} from "react-icons/fi";
import { INVESTMENT_STATUS, VITE_APP_API_URL } from "../../utils/constants";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/forms/Input";

const TransactionRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactionRequest, setTransactionRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API function to fetch transaction request by ID
  const fetchTransactionRequestById = async (transactionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${VITE_APP_API_URL}/api/admin/transaction-request/${transactionId}`
      );

      if (response.data.success) {
        setTransactionRequest(response.data.data);
      } else {
        setError(
          response.data.message || "Failed to fetch transaction request details"
        );
      }
    } catch (error) {
      console.error("Error fetching transaction request by ID:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch transaction request details"
      );
    } finally {
      setLoading(false);
    }
  };

  // API function to update transaction request status
  const updateTransactionRequest = async (updateData) => {
    try {
      const response = await axios.put(
        `${VITE_APP_API_URL}/api/admin/update/${id}`,
        updateData
      );

      if (response.data.success) {
        setTransactionRequest(response.data.data);
        setSuccessMessage(response.data.message);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        setError(
          response.data.message || "Failed to update transaction request"
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating transaction request:", error);
      setError(
        error.response?.data?.message || "Failed to update transaction request"
      );
      return false;
    }
  };

  const handleApproveRequest = async () => {
    setActionLoading(true);
    setError(null);

    const success = await updateTransactionRequest({
      status: INVESTMENT_STATUS.APPROVED,
    });

    if (success) {
      // Navigate back to investments page after successful approval
      setTimeout(() => navigate("/admin/investments"), 1500);
    }

    setActionLoading(false);
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    setError(null);
    setShowRejectModal(false);

    const success = await updateTransactionRequest({
      status: INVESTMENT_STATUS.REJECTED,
      rejectionReason: rejectionReason.trim(),
    });

    if (success) {
      setRejectionReason("");
      // Navigate back to investments page after successful rejection
      setTimeout(() => navigate("/admin/investments"), 1500);
    }

    setActionLoading(false);
  };

  const getUserName = (userData) => {
    if (typeof userData === "object" && userData?.name) {
      return userData.name;
    }
    return "Unknown User";
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
      [INVESTMENT_STATUS.APPROVED]: "bg-green-100 text-green-800",
      [INVESTMENT_STATUS.REJECTED]: "bg-red-100 text-red-800",
      [INVESTMENT_STATUS.ACTIVE]: "bg-blue-100 text-blue-800",
      [INVESTMENT_STATUS.COMPLETED]: "bg-purple-100 text-purple-800",
      [INVESTMENT_STATUS.CANCELLED]: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  useEffect(() => {
    if (id) {
      fetchTransactionRequestById(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transaction details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/investments")}
            icon={<FiArrowLeft />}
          >
            Back to Investments
          </Button>
        </div>

        <Card>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <FiX size={24} />
              </div>
              <div>
                <h3 className="text-red-800 font-medium text-lg">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!transactionRequest) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/investments")}
            icon={<FiArrowLeft />}
          >
            Back to Investments
          </Button>
        </div>

        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Transaction request not found
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/investments")}
            icon={<FiArrowLeft />}
          >
            Back to Investments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transaction Request Details
            </h1>
            <p className="text-gray-600">
              View and manage transaction request information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investor Information */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <FiUser className="text-blue-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-900">
                Investor Information
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-medium">
                  {getUserName(transactionRequest.userId)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getUserName(transactionRequest.userId)}
                </h3>
                {transactionRequest.userId?.email && (
                  <p className="text-gray-600">
                    {transactionRequest.userId.email}
                  </p>
                )}
                {transactionRequest.userId?.phone && (
                  <p className="text-gray-600 flex items-center space-x-1">
                    <FiPhone size={14} />
                    <span>{transactionRequest.userId.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Transaction Details */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <FiDollarSign className="text-green-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-900">
                Transaction Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Plan
                </label>
                <div className="flex items-center space-x-2">
                  <FiTag className="text-gray-400" size={16} />
                  <span className="text-lg font-semibold text-gray-900">
                    {transactionRequest.plan || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-gray-400" size={16} />
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(transactionRequest.amount || 0)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {transactionRequest.type || "N/A"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Date
                </label>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-400" size={16} />
                  <span className="text-gray-900">
                    {new Date(transactionRequest.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>

              {transactionRequest.walletTxId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Transaction ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <FiHash className="text-gray-400" size={16} />
                    <span className="text-gray-900 font-mono text-sm">
                      {transactionRequest.walletTxId}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Transaction Image */}
          {transactionRequest.transactionImage && (
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <FiImage className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Transaction Proof
                </h2>
              </div>

              <div className="flex justify-center">
                <img
                  src={transactionRequest.transactionImage}
                  alt="Transaction proof"
                  className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </Card>
          )}

          {/* Assigned Traders */}
          {transactionRequest.trader &&
            Array.isArray(transactionRequest.trader) &&
            transactionRequest.trader.length > 0 && (
              <Card>
                <div className="flex items-center space-x-3 mb-4">
                  <FiUser className="text-purple-600" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assigned Traders
                  </h2>
                </div>

                <div className="space-y-4">
                  {transactionRequest.trader.map((trader, index) => (
                    <div
                      key={trader._id || index}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {trader.name?.charAt(0) || "T"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trader.name || "N/A"}
                        </h3>
                        {trader.email && (
                          <p className="text-gray-600">{trader.email}</p>
                        )}
                        {trader.traderType && (
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mt-1">
                            {trader.traderType}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <FiActivity className="text-orange-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-900">Status</h2>
            </div>

            <div className="text-center">
              {getStatusBadge(transactionRequest.status)}
            </div>

            {/* Show rejection reason if transaction was rejected */}
            {transactionRequest.status === INVESTMENT_STATUS.REJECTED &&
              transactionRequest.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FiAlertCircle className="text-red-600 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">
                        Rejection Reason:
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        {transactionRequest.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </Card>

          {/* Actions */}
          {transactionRequest.status === INVESTMENT_STATUS.PENDING && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="success"
                  onClick={handleApproveRequest}
                  icon={<FiCheck />}
                  disabled={actionLoading}
                  className="w-full"
                >
                  {actionLoading ? "Approving..." : "Approve Request"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowRejectModal(true)}
                  icon={<FiX />}
                  disabled={actionLoading}
                  className="w-full"
                >
                  Reject Request
                </Button>
              </div>
            </Card>
          )}

          {/* Show info for approved transactions */}
          {transactionRequest.status === INVESTMENT_STATUS.APPROVED && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <FiCheck className="text-green-600 mr-2" size={20} />
                  <span className="text-green-800 font-medium">
                    Transaction Approved
                  </span>
                </div>
                <p className="text-green-700 text-sm">
                  This transaction request has been approved and is now active.
                </p>
              </div>
            </Card>
          )}

          {/* Additional Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">Request ID:</span>{" "}
                {transactionRequest._id}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(transactionRequest.createdAt).toLocaleString()}
              </div>
              {transactionRequest.updatedAt && (
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(transactionRequest.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <FiCheck className="text-green-600 mr-3" size={20} />
              <div>
                <h3 className="text-green-800 font-medium">Success!</h3>
                <p className="text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason("");
          setError(null);
        }}
        title="Reject Transaction Request"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-600 mr-3" size={20} />
              <div>
                <h3 className="text-red-800 font-medium">Warning</h3>
                <p className="text-red-700 text-sm mt-1">
                  This action will reject the transaction request. Please
                  provide a reason for rejection.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <Input
              type="textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this request is being rejected..."
              rows={4}
              className="resize-none"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
                setError(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRejectRequest}
              disabled={actionLoading || !rejectionReason.trim()}
              className="flex-1"
            >
              {actionLoading ? "Rejecting..." : "Reject Request"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionRequestDetails;
