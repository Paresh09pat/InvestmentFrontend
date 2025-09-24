// UserManagement page
import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiMail,
  FiPhone,
  FiDownload,
  FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { USER_VERIFICATION_STATUS, VITE_APP_API_URL } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/forms/Input';
import Modal from '../../components/common/Modal';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${VITE_APP_API_URL}/api/documents/admin/users?status=${statusFilter}`,
        { withCredentials: true }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      user.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleVerifyUser = async (userId, documentType, action) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_APP_API_URL}/api/documents/admin/verify`,
        {
          userId,
          documentType,
          action,
          rejectionReason: action === 'reject' ? rejectionReason : undefined
        },
        { withCredentials: true }
      );
      
      // Update the user in the list
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? response.data.user
          : user
      ));
      
      // Update selected user if it's the same user
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(response.data.user);
      }
      
      setRejectionReason('');
      setShowDocumentModal(false);
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = (userId, documentType) => {
    window.open(`${VITE_APP_API_URL}/api/documents/admin/document/${userId}/${documentType}`, '_blank');
  };

  const openDocumentModal = (user, documentType, action) => {
    setCurrentDocument({ userId: user._id, documentType, action });
    setShowDocumentModal(true);
    setRejectionReason('');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${VITE_APP_API_URL}/api/auth/admin/delete-user/${userId}`,
          { withCredentials: true }
        );
        
        // Remove user from the list
        setUsers(prev => prev.filter(user => user._id !== userId));
        
        // Close user modal if the deleted user was selected
        if (selectedUser && selectedUser._id === userId) {
          setShowUserModal(false);
          setSelectedUser(null);
        }
        
        toast.success('User deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        
      } catch (error) {
        console.error('Failed to delete user:', error);
        
        let errorMessage = 'Failed to delete user';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const colors = {
      [USER_VERIFICATION_STATUS.VERIFIED]: 'bg-green-100 text-green-800',
      [USER_VERIFICATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [USER_VERIFICATION_STATUS.REJECTED]: 'bg-red-100 text-red-800',
      [USER_VERIFICATION_STATUS.UNVERIFIED]: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      title: 'User',
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{value.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    { 
      key: 'createdAt', 
      title: 'Join Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'totalInvested',
      title: 'Total Invested',
      render: (value) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'currentBalance',
      title: 'Current Balance',
      render: (value) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'verificationStatus',
      title: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'documents',
      title: 'Documents',
      render: (_, user) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs">Aadhaar:</span>
            <span className={`text-xs px-1 py-0.5 rounded ${
              user.documents?.aadhaar?.status === 'verified' ? 'bg-green-100 text-green-800' :
              user.documents?.aadhaar?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              user.documents?.aadhaar?.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {user.documents?.aadhaar?.status || 'Not uploaded'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">PAN:</span>
            <span className={`text-xs px-1 py-0.5 rounded ${
              user.documents?.pan?.status === 'verified' ? 'bg-green-100 text-green-800' :
              user.documents?.pan?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              user.documents?.pan?.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {user.documents?.pan?.status || 'Not uploaded'}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewUserDetails(user)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <FiEye size={16} />
          </button>
          
          {/* Document verification actions */}
          {(user.documents?.aadhaar?.fileName || user.documents?.aadhaar?.cloudinaryUrl) && user.documents?.aadhaar?.status === 'pending' && (
            <>
              <button
                onClick={() => viewDocument(user._id, 'aadhaar')}
                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                title="View Aadhaar"
              >
                <FiDownload size={16} />
              </button>
              <button
                onClick={() => openDocumentModal(user, 'aadhaar', 'verify')}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                title="Approve Aadhaar"
                disabled={loading}
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => openDocumentModal(user, 'aadhaar', 'reject')}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                title="Reject Aadhaar"
                disabled={loading}
              >
                <FiX size={16} />
              </button>
            </>
          )}
          
          {(user.documents?.pan?.fileName || user.documents?.pan?.cloudinaryUrl) && user.documents?.pan?.status === 'pending' && (
            <>
              <button
                onClick={() => viewDocument(user._id, 'pan')}
                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                title="View PAN"
              >
                <FiDownload size={16} />
              </button>
              <button
                onClick={() => openDocumentModal(user, 'pan', 'verify')}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                title="Approve PAN"
                disabled={loading}
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => openDocumentModal(user, 'pan', 'reject')}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                title="Reject PAN"
                disabled={loading}
              >
                <FiX size={16} />
              </button>
            </>
          )}
          
          {/* Delete user button */}
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            title="Delete User"
            disabled={loading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage user accounts and verification status
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiUsers className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or email..."
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
              <option value={USER_VERIFICATION_STATUS.VERIFIED}>Verified</option>
              <option value={USER_VERIFICATION_STATUS.PENDING}>Pending</option>
              <option value={USER_VERIFICATION_STATUS.UNVERIFIED}>Unverified</option>
              <option value={USER_VERIFICATION_STATUS.REJECTED}>Rejected</option>
            </select>
            
            <Button variant="outline" icon={<FiFilter />}>
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>
        
        <Table
          columns={columns}
          data={filteredUsers}
          hover
          striped
        />
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {selectedUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                {getStatusBadge(selectedUser.verificationStatus)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-gray-400" size={16} />
                    <span>{selectedUser.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <span>{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Invested
                  </label>
                  <span className="font-semibold">
                    {formatCurrency(selectedUser.totalInvested)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Balance
                  </label>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(selectedUser.currentBalance)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documents Status
                  </label>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Aadhaar:</span>
                      <span className="text-sm">
                        {selectedUser.documents?.aadhaar?.status || 'Not uploaded'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">PAN:</span>
                      <span className="text-sm">
                        {selectedUser.documents?.pan?.status || 'Not uploaded'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document verification section */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-4">Document Verification</h4>
              
              {/* Aadhaar Card */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Aadhaar Card</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedUser.documents?.aadhaar?.status === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedUser.documents?.aadhaar?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedUser.documents?.aadhaar?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedUser.documents?.aadhaar?.status || 'Not uploaded'}
                    </span>
                    {(selectedUser.documents?.aadhaar?.fileName || selectedUser.documents?.aadhaar?.cloudinaryUrl) && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => viewDocument(selectedUser._id, 'aadhaar')}
                        icon={<FiEye />}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
                {selectedUser.documents?.aadhaar?.rejectionReason && (
                  <p className="text-sm text-red-600">
                    Rejection reason: {selectedUser.documents.aadhaar.rejectionReason}
                  </p>
                )}
                {selectedUser.documents?.aadhaar?.status === 'pending' && (
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => openDocumentModal(selectedUser, 'aadhaar', 'verify')}
                      icon={<FiCheck />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => openDocumentModal(selectedUser, 'aadhaar', 'reject')}
                      icon={<FiX />}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>

              {/* PAN Card */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">PAN Card</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedUser.documents?.pan?.status === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedUser.documents?.pan?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedUser.documents?.pan?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedUser.documents?.pan?.status || 'Not uploaded'}
                    </span>
                    {(selectedUser.documents?.pan?.fileName || selectedUser.documents?.pan?.cloudinaryUrl) && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => viewDocument(selectedUser._id, 'pan')}
                        icon={<FiEye />}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
                {selectedUser.documents?.pan?.rejectionReason && (
                  <p className="text-sm text-red-600">
                    Rejection reason: {selectedUser.documents.pan.rejectionReason}
                  </p>
                )}
                {selectedUser.documents?.pan?.status === 'pending' && (
                  <div className="flex space-x-2 mt-2">
                <Button
                  variant="success"
                      size="small"
                      onClick={() => openDocumentModal(selectedUser, 'pan', 'verify')}
                  icon={<FiCheck />}
                >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => openDocumentModal(selectedUser, 'pan', 'reject')}
                      icon={<FiX />}
                    >
                      Reject
                </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Delete User Section */}
            <div className="pt-4 border-t border-red-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FiTrash2 className="text-red-600" size={20} />
                  <span className="font-medium text-red-900">Danger Zone</span>
                </div>
                <p className="text-sm text-red-800 mb-4">
                  Deleting a user will permanently remove their account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => {
                    setShowUserModal(false);
                    handleDeleteUser(selectedUser._id);
                  }}
                  icon={<FiTrash2 />}
                  disabled={loading}
                >
                  Delete User Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Document Verification Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setRejectionReason('');
        }}
        title={`${currentDocument?.action === 'verify' ? 'Approve' : 'Reject'} ${currentDocument?.documentType?.toUpperCase()} Document`}
        size="md"
      >
        {currentDocument && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiAlertCircle className="text-blue-600" size={20} />
                <span className="font-medium text-blue-900">Document Verification</span>
              </div>
              <p className="text-sm text-blue-800">
                You are about to {currentDocument.action} the {currentDocument.documentType.toUpperCase()} document for this user.
                {currentDocument.action === 'verify' 
                  ? ' This will mark the document as verified and may update the user\'s overall verification status.'
                  : ' Please provide a reason for rejection.'
                }
              </p>
            </div>

            {currentDocument.action === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Please provide a reason for rejecting this document..."
                  required
                />
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowDocumentModal(false);
                  setRejectionReason('');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant={currentDocument.action === 'verify' ? 'success' : 'danger'}
                fullWidth
                onClick={() => handleVerifyUser(
                  currentDocument.userId,
                  currentDocument.documentType,
                  currentDocument.action
                )}
                loading={loading}
                disabled={currentDocument.action === 'reject' && !rejectionReason.trim()}
              >
                {currentDocument.action === 'verify' ? 'Approve Document' : 'Reject Document'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
