// InvestmentWithdrawalRequestDetails page
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
  FiFileText,
  FiArchive,
} from "react-icons/fi";
import { INVESTMENT_STATUS, VITE_APP_API_URL } from "../../utils/constants";
import { formatDateForTable } from "../../utils/dateUtils";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/forms/Input";

const InvestmentWithdrawalRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactionRequest, setTransactionRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showRejectionReasonInput, setShowRejectionReasonInput] = useState(false);
  const [statusRejectionReason, setStatusRejectionReason] = useState('');

  // Function to get the appropriate back navigation
  const getBackNavigation = () => {
    return "/admin/investment-withdrawal-requests";
  };

  // Function to get the appropriate back button text
  const getBackButtonText = () => {
    return "Back to Investment Withdrawal Requests";
  };

  // API function to fetch investment withdrawal request by ID
  const fetchInvestmentWithdrawalRequestById = async (requestId, isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(
        `${VITE_APP_API_URL}/api/admin/invt-req/${requestId}`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.message === "Investment request fetched successfully") {
        setTransactionRequest(response.data.data);
        console.log("Investment withdrawal request data:", response.data.data);
      } else {
        setError(
          response.data.message || "Failed to fetch investment withdrawal request details"
        );
      }
    } catch (error) {
      console.error("Error fetching investment withdrawal request by ID:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch investment withdrawal request details"
      );
    } finally {
      if (!isRefresh) {
        setLoading(false);
      }
    }
  };

  // API function to update investment withdrawal request status
  const updateInvestmentWithdrawalRequest = async (updateData) => {
    try {
      const response = await axios.put(
        `${VITE_APP_API_URL}/api/admin/invt-req/${id}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the transaction request data immediately with the response data
        setTransactionRequest(response.data.data);
        // Clear any existing errors
        setError(null);
        return true;
      } else {
        setError(
          response.data.message || "Failed to update investment withdrawal request"
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating investment withdrawal request:", error);
      setError(
        error.response?.data?.message || "Failed to update investment withdrawal request"
      );
      return false;
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    setError(null);
    setShowRejectModal(false);

    const success = await updateInvestmentWithdrawalRequest({
      status: INVESTMENT_STATUS.REJECTED,
      rejectionReason: rejectionReason.trim(),
    });

    if (success) {
      setRejectionReason("");
      setSuccessMessage('Investment withdrawal request rejected successfully');
      // Clear success message after 2 seconds and then redirect
      setTimeout(() => {
        setSuccessMessage('');
        // Redirect to Investment Withdrawal Requests list page
        navigate('/admin/investment-withdrawal-requests');
      }, 2000);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (newStatus === transactionRequest.status) {
      setIsEditingStatus(false);
      return;
    }

    // Check if rejection reason is required
    if (newStatus === INVESTMENT_STATUS.REJECTED && !statusRejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setIsUpdatingStatus(true);
    setError(null);

    const updateData = {
      status: newStatus,
    };

    // Add rejection reason if status is rejected
    if (newStatus === INVESTMENT_STATUS.REJECTED) {
      updateData.rejectionReason = statusRejectionReason.trim();
    }

    const success = await updateInvestmentWithdrawalRequest(updateData);

    if (success) {
      setIsEditingStatus(false);
      setShowRejectionReasonInput(false);
      setStatusRejectionReason('');
      setSuccessMessage('Investment withdrawal request status updated successfully');
      // Clear success message after 2 seconds and then redirect
      setTimeout(() => {
        setSuccessMessage('');
        // Redirect to Investment Withdrawal Requests list page
        navigate('/admin/investment-withdrawal-requests');
      }, 2000);
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
    if (selectedStatus === INVESTMENT_STATUS.REJECTED) {
      setShowRejectionReasonInput(true);
    } else {
      setShowRejectionReasonInput(false);
      setStatusRejectionReason('');
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvestmentWithdrawalRequestById(id);
    }
  }, [id]);

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case INVESTMENT_STATUS.PENDING:
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          icon: <FiActivity className="text-amber-600" size={20} />,
          badge: "bg-amber-100 text-amber-800 border-amber-200",
          description: "Request is under review"
        };
      case INVESTMENT_STATUS.APPROVED:
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          icon: <FiCheck className="text-emerald-600" size={20} />,
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          description: "Request has been approved"
        };
      case INVESTMENT_STATUS.REJECTED:
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: <FiX className="text-red-600" size={20} />,
          badge: "bg-red-100 text-red-800 border-red-200",
          description: "Request has been rejected"
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: <FiAlertCircle className="text-gray-600" size={20} />,
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          description: "Unknown status"
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(getBackNavigation())}
                icon={<FiArrowLeft />}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {getBackButtonText()}
              </Button>
            </div>

            <Card className="shadow-sm border-gray-200">
              <div className="text-center py-16">
                <div className="relative">
                  <FiLoader className="mx-auto text-blue-500 mb-6 animate-spin" size={56} />
                  <div className="absolute inset-0 mx-auto w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Request Details</h3>
                <p className="text-gray-500 text-lg">Please wait while we fetch the investment withdrawal request information...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error && !successMessage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(getBackNavigation())}
                icon={<FiArrowLeft />}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {getBackButtonText()}
              </Button>
            </div>

            {/* <Card className="shadow-sm border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-red-100 rounded-full">
                      <FiX className="text-red-600" size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-800 font-semibold text-xl mb-2">Unable to Load Request</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Try Again
                      </Button>
                      <Button
                        onClick={() => navigate(getBackNavigation())}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Go Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card> */}
          </div>
        </div>
      </div>
    );
  }

  if (!transactionRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(getBackNavigation())}
                icon={<FiArrowLeft />}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {getBackButtonText()}
              </Button>
            </div>

            <Card className="shadow-sm border-gray-200">
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-6">
                  <FiAlertCircle className="text-gray-400 mx-auto" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Not Found</h3>
                <p className="text-gray-500 text-lg mb-6">
                  The investment withdrawal request you're looking for could not be found.
                </p>
                <Button
                  onClick={() => navigate(getBackNavigation())}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go Back to Requests
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transactionRequest.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(getBackNavigation())}
              icon={<FiArrowLeft />}
              size="small"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              {getBackButtonText()}
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Withdrawal Request Details</h1>
                <p className="text-gray-600">View and manage investment withdrawal request information</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Request ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border">
                  #{transactionRequest._id?.slice(-8) || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Information */}
            <Card className="animate-fade-in shadow-sm border-gray-200" data-section="user-info">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Account holder details</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiUser className="text-blue-600" size={24} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiUser className="text-gray-400" size={18} />
                        <span className="text-lg font-semibold text-gray-900">
                          {transactionRequest.userId?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiMail className="text-gray-400" size={18} />
                        <span className="text-lg font-semibold text-gray-900">
                          {transactionRequest.userId?.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </Card>

            {/* Investment Withdrawal Details */}
            <Card className="animate-fade-in shadow-sm border-gray-200" data-section="withdrawal-details">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Investment Withdrawal Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Withdrawal request information</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <FiArchive className="text-red-600" size={24} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Plan</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiTag className="text-gray-400" size={18} />
                        <span className="text-lg font-semibold text-gray-900 capitalize">
                          {transactionRequest.plan || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiDollarSign className="text-gray-400" size={18} />
                        <span className="text-lg font-semibold text-red-600">
                          ${transactionRequest.amount?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiHash className="text-gray-400" size={18} />
                        <span className="text-sm font-mono text-gray-900 break-all">
                          {transactionRequest.walletAddress || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FiActivity className="text-gray-400" size={18} />
                        <span className="text-lg font-semibold text-gray-900 capitalize">
                          {transactionRequest.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Withdrawal Reason */}
              {transactionRequest.rejectionReason && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Reason</label>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <FiFileText className="text-yellow-600 mt-1" size={18} />
                      <p className="text-gray-900">
                        {transactionRequest.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-8">
            {/* Status Card */}
            <Card className="animate-fade-in shadow-sm border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Request Status</h3>
                  <p className="text-sm text-gray-500 mt-1">Current request status</p>
                </div>
                <div className={`p-3 rounded-lg ${statusConfig.bgColor}`}>
                  {statusConfig.icon}
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.badge}`}>
                      {transactionRequest.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{statusConfig.description}</p>
                </div>

                {!isEditingStatus ? (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setIsEditingStatus(true);
                      setNewStatus(transactionRequest.status);
                    }}
                    icon={<FiEdit3 />}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Update Status
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {showRejectionReasonInput && (
                      <div>
                        <Input
                          label="Rejection Reason"
                          value={statusRejectionReason}
                          onChange={(e) => setStatusRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejection"
                          required
                          multiline
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={handleCancelStatusEdit}
                        disabled={isUpdatingStatus}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        fullWidth
                        onClick={handleStatusUpdate}
                        loading={isUpdatingStatus}
                        disabled={isUpdatingStatus}
                        icon={<FiSave />}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Timestamps */}
            <Card className="animate-fade-in shadow-sm border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Timestamps</h3>
                  <p className="text-sm text-gray-500 mt-1">Request timeline</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FiCalendar className="text-gray-600" size={24} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-medium text-gray-900">
                    {formatDateForTable(transactionRequest.createdAt).date}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateForTable(transactionRequest.createdAt).time}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {formatDateForTable(transactionRequest.updatedAt).date}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateForTable(transactionRequest.updatedAt).time}
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="p-1 bg-emerald-100 rounded-full">
                  <FiCheck className="text-emerald-600" size={16} />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="p-1 bg-red-100 rounded-full">
                  <FiX className="text-red-600" size={16} />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Investment Withdrawal Request"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <FiX className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-medium text-red-800">Confirm Rejection</h4>
              <p className="text-red-700 text-sm mt-1">
                Please provide a reason for rejecting this investment withdrawal request. This action cannot be undone.
              </p>
            </div>
          </div>

          <div>
            <Input
              label="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter detailed reason for rejection..."
              required
              multiline
              rows={4}
              className="border-red-200 focus:border-red-400 focus:ring-red-200"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
              }}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleRejectRequest}
              disabled={!rejectionReason.trim()}
              icon={<FiX />}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Reject Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvestmentWithdrawalRequestDetails;
