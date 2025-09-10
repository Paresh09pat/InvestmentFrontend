// DocumentVerification page
import { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiCheck,
  FiX,
  FiEye,
  FiDownload,
  FiAlertCircle,
  FiClock,
  FiShield
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { USER_VERIFICATION_STATUS, VITE_APP_API_URL } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/forms/Input';
import Modal from '../../components/common/Modal';
import axios from 'axios';

const DocumentVerification = () => {
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch pending documents
  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${VITE_APP_API_URL}/api/documents/admin/pending`,
        { withCredentials: true }
      );
      setPendingDocuments(response.data.users);
    } catch (error) {
      console.error('Failed to fetch pending documents:', error);
      setError('Failed to fetch pending documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (userId, documentType, action) => {
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
      
      // Update the pending documents list
      setPendingDocuments(prev => prev.map(user => 
        user._id === userId 
          ? response.data.user
          : user
      ));
      
      setRejectionReason('');
      setShowVerificationModal(false);
      
      // Refresh the list to remove verified users
      if (action === 'verify') {
        fetchPendingDocuments();
      }
      
      const actionText = action === 'verify' ? 'approved' : 'rejected';
      toast.success(`Document ${actionText} successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
      
    } catch (error) {
      console.error('Failed to verify document:', error);
      
      let errorMessage = 'Failed to verify document';
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
  };

  const viewDocument = (userId, documentType) => {
    window.open(`${VITE_APP_API_URL}/api/documents/admin/document/${userId}/${documentType}`, '_blank');
  };

  const openVerificationModal = (user, documentType, action) => {
    setCurrentDocument({ userId: user._id, documentType, action, userName: user.name });
    setShowVerificationModal(true);
    setRejectionReason('');
  };

  const filteredDocuments = pendingDocuments.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getDocumentStatus = (docType, user) => {
    const doc = user.documents?.[docType];
    if (!doc) return 'not_uploaded';
    return doc.status || 'pending';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
      key: 'documents',
      title: 'Pending Documents',
      render: (_, user) => (
        <div className="space-y-1">
          {user.documents?.aadhaar?.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Aadhaar
              </span>
              <span className="text-xs text-gray-500">
                {new Date(user.documents.aadhaar.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {user.documents?.pan?.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                PAN
              </span>
              <span className="text-xs text-gray-500">
                {new Date(user.documents.pan.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          {(user.documents?.aadhaar?.fileName || user.documents?.aadhaar?.cloudinaryUrl) && user.documents?.aadhaar?.status === 'pending' && (
            <>
          <button
                onClick={() => viewDocument(user._id, 'aadhaar')}
                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                title="View Aadhaar"
          >
            <FiEye size={16} />
          </button>
              <button
                onClick={() => openVerificationModal(user, 'aadhaar', 'verify')}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                title="Approve Aadhaar"
                disabled={loading}
              >
                <FiCheck size={16} />
              </button>
          <button
                onClick={() => openVerificationModal(user, 'aadhaar', 'reject')}
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
                <FiEye size={16} />
              </button>
              <button
                onClick={() => openVerificationModal(user, 'pan', 'verify')}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                title="Approve PAN"
                disabled={loading}
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => openVerificationModal(user, 'pan', 'reject')}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                title="Reject PAN"
                disabled={loading}
              >
                <FiX size={16} />
              </button>
            </>
          )}
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
            Document Verification
          </h1>
          <p className="text-gray-600">
            Review and verify user documents for investment access
          </p>
      </div>

        <div className="flex items-center space-x-2">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiFileText className="text-yellow-600" size={24} />
          </div>
            <div>
            <div className="text-2xl font-bold text-gray-900">{pendingDocuments.length}</div>
            <div className="text-sm text-gray-600">Pending Documents</div>
            </div>
          </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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
            <Button 
              variant="outline" 
              onClick={fetchPendingDocuments}
              icon={<FiShield />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Pending Documents Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Document Verifications ({filteredDocuments.length})
          </h2>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pending documents</h3>
            <p className="mt-2 text-gray-600">All documents have been reviewed.</p>
          </div>
        ) : (
        <Table
          columns={columns}
          data={filteredDocuments}
          hover
          striped
        />
        )}
      </Card>

      {/* Document Verification Modal */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
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
                You are about to {currentDocument.action} the {currentDocument.documentType.toUpperCase()} document for <strong>{currentDocument.userName}</strong>.
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
                  setShowVerificationModal(false);
                  setRejectionReason('');
                  }}
                disabled={loading}
                >
                Cancel
                </Button>
                <Button
                variant={currentDocument.action === 'verify' ? 'success' : 'danger'}
                fullWidth
                onClick={() => handleVerifyDocument(
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

export default DocumentVerification;