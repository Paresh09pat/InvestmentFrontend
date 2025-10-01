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
  FiMail,
  FiEye,
  FiEdit3,
  FiSave,
  FiLoader,
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
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showRejectionReasonInput, setShowRejectionReasonInput] = useState(false);
  const [statusRejectionReason, setStatusRejectionReason] = useState('');

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

  // Handle status update
  const handleStatusUpdate = async () => {
    if (newStatus === transactionRequest.status) {
      setIsEditingStatus(false);
      return;
    }

    // Check if changing to rejected status and no rejection reason provided
    if (newStatus === INVESTMENT_STATUS.REJECTED && !statusRejectionReason.trim()) {
      setError("Please provide a rejection reason");
    // Check if rejection reason is required
    if (newStatus === INVESTMENT_STATUS.REJECTED && !statusUpdateReason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setIsUpdatingStatus(true);
    setError(null);

    const updateData = {
      status: newStatus,
    };

    // Include rejection reason if status is being changed to rejected
    if (newStatus === INVESTMENT_STATUS.REJECTED) {
      updateData.rejectionReason = statusRejectionReason.trim();
    // Add rejection reason if status is rejected
    if (newStatus === INVESTMENT_STATUS.REJECTED) {
      updateData.rejectionReason = statusUpdateReason.trim();
    }

    const success = await updateTransactionRequest(updateData);

    if (success) {
      setIsEditingStatus(false);
      setShowRejectionReasonInput(false);
      setStatusRejectionReason('');
      setStatusUpdateReason('');
      setSuccessMessage('Transaction status updated successfully');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    setIsUpdatingStatus(false);
  };

  // Cancel status editing
  const handleCancelStatusEdit = () => {
    setNewStatus(transactionRequest.status);
    setIsEditingStatus(false);
    setShowRejectionReasonInput(false);
    setStatusRejectionReason('');
    setError(null);
  };

  // Handle status change to show/hide rejection reason input
  const handleStatusChange = (selectedStatus) => {
    setNewStatus(selectedStatus);
    setShowRejectionReasonInput(selectedStatus === INVESTMENT_STATUS.REJECTED);
    setStatusRejectionReason('');
    setStatusUpdateReason('');
    setError(null);
  };

  // Get available status options based on current status
  const getAvailableStatusOptions = (currentStatus) => {
    const allStatuses = [
      { value: INVESTMENT_STATUS.PENDING, label: 'Pending', description: 'Transaction is awaiting processing' },
      { value: INVESTMENT_STATUS.APPROVED, label: 'Approved', description: 'Transaction has been approved' },
      { value: INVESTMENT_STATUS.REJECTED, label: 'Rejected', description: 'Transaction has been rejected' }
    ];

    // Define status flow logic - allow more flexible transitions
    const statusFlow = {
      [INVESTMENT_STATUS.PENDING]: [INVESTMENT_STATUS.APPROVED, INVESTMENT_STATUS.REJECTED],
      [INVESTMENT_STATUS.APPROVED]: [INVESTMENT_STATUS.PENDING, INVESTMENT_STATUS.REJECTED], // Can be changed back to pending or rejected
      [INVESTMENT_STATUS.REJECTED]: [INVESTMENT_STATUS.PENDING, INVESTMENT_STATUS.APPROVED] // Can be reopened to pending or approved
 
    }
    const allowedStatuses = statusFlow[currentStatus] || [];
    return allStatuses.filter(status => 
      allowedStatuses.includes(status.value) || status.value === currentStatus
    );
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

  // Reset editing state when transaction request changes
  useEffect(() => {
    if (transactionRequest) {
      setNewStatus(transactionRequest.status);
      setIsEditingStatus(false);
      setShowRejectionReasonInput(false);
      setStatusRejectionReason('');
      setStatusUpdateReason('');
    }
  }, [transactionRequest]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/investments")}
              icon={<FiArrowLeft />}
              size="small"
            >
              Back to Investments
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Request Details</h1>
          <p className="text-gray-600">View and manage transaction request information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investor Information */}
            <Card className="animate-fade-in" data-section="investor-info">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Investor Information</h2>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUser className="text-blue-600" size={20} />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl font-bold">
                    {getUserName(transactionRequest.userId)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {getUserName(transactionRequest.userId)}
                  </h3>
                  {transactionRequest.userId?.email && (
                    <div className="flex items-center space-x-2 mb-2">
                      <FiMail className="text-gray-400" size={16} />
                      <span className="text-gray-600">{transactionRequest.userId.email}</span>
                    </div>
                  )}
                  {transactionRequest.userId?.phone && (
                    <div className="flex items-center space-x-2">
                      <FiPhone className="text-gray-400" size={16} />
                      <span className="text-gray-600">{transactionRequest.userId.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Transaction Details */}
            <Card className="animate-fade-in" data-section="transaction-details">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="text-green-600" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Plan</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiTag className="text-gray-400" size={18} />
                        <span className="text-lg font-semibold text-gray-900">
                          {transactionRequest.plan || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {transactionRequest.type || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        {/* <FiDollarSign className="text-green-600" size={18} /> */}
                        <span className="text-3xl font-bold text-green-600">
                          {formatCurrency(transactionRequest.amount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiCalendar className="text-gray-400" size={18} />
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
                  </div>
                </div>

                {transactionRequest.walletTxId && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Transaction ID</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiHash className="text-gray-400" size={18} />
                        <span className="text-gray-900 font-mono text-sm break-all">
                          {transactionRequest.walletTxId}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Transaction Image */}
            {transactionRequest.transactionImage && (
              <Card className="animate-fade-in" data-section="transaction-image">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Transaction Proof</h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiImage className="text-blue-600" size={20} />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative max-w-full">
                    <img
                      src={transactionRequest.transactionImage}
                      alt="Transaction proof"
                      className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                </div>
              </Card>
            )}

          </div>

          {/* Right Column - Status and Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Status</h2>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiActivity className="text-orange-600" size={20} />
                  </div>
                  {!isEditingStatus && (
                    <button
                      onClick={() => setIsEditingStatus(true)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Status"
                    >
                      <FiEdit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {isEditingStatus ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isUpdatingStatus}
                    >
                      {getAvailableStatusOptions(transactionRequest.status).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {getAvailableStatusOptions(transactionRequest.status).find(opt => opt.value === newStatus)?.description}
                    </p>
                  </div>

                  {/* Rejection Reason Input - Show when changing to rejected status */}
                  {showRejectionReasonInput && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason *
                      </label>
                      <textarea
                        value={statusRejectionReason}
                        onChange={(e) => setStatusRejectionReason(e.target.value)}
                        placeholder="Please explain why this request is being rejected..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={isUpdatingStatus}
                      />
                      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdatingStatus || newStatus === transactionRequest.status || (newStatus === INVESTMENT_STATUS.REJECTED && !statusRejectionReason.trim())}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {isUpdatingStatus ? (
                        <>
                          <FiLoader className="h-4 w-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FiSave className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelStatusEdit}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    {getStatusBadge(transactionRequest.status)}
                  </div>

                  {/* Show rejection reason if transaction was rejected */}
                  {transactionRequest.status === INVESTMENT_STATUS.REJECTED &&
                    transactionRequest.rejectionReason && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
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
                </>
              )}
            </Card>


            {/* Assigned Traders */}
            {transactionRequest.trader &&
              Array.isArray(transactionRequest.trader) &&
              transactionRequest.trader.length > 0 && (
                <Card className="animate-fade-in" data-section="assigned-traders">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Assigned Traders</h2>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiUser className="text-purple-600" size={20} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {transactionRequest.trader.map((trader, index) => (
                      <div
                        key={trader._id || index}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {trader.name?.charAt(0) || "T"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {trader.name || "N/A"}
                          </h3>
                          {trader.email && (
                            <p className="text-gray-600 truncate">{trader.email}</p>
                          )}
                          {trader.traderType && (
                            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mt-2">
                              {trader.traderType}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Additional Information */}
            <Card className="animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Additional Information
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <span className="font-medium text-gray-700">Request ID:</span>
                  <p className="text-sm text-gray-600 font-mono break-all mt-1">
                    {transactionRequest._id}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(transactionRequest.createdAt).toLocaleString()}
                  </p>
                </div>
                {transactionRequest.updatedAt && (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(transactionRequest.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
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

  }
}
}

export default TransactionRequestDetails;