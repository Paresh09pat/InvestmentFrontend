import { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiShield,
  FiUpload,
  FiEdit,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiDownload,
  FiEye,
  FiCamera
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { USER_VERIFICATION_STATUS, VITE_APP_API_URL } from '../utils/constants';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/forms/Input';
import DocumentUploadModal from '../components/modals/DocumentUploadModal';
import ProfilePictureUpload from '../components/modals/ProfilePictureUpload';
import axios from 'axios';

  

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [documents, setDocuments] = useState({
    aadhaar: null,
    pan: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [currentDocType, setCurrentDocType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Initialize form data when user changes or component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDocumentUpload = (file, docType) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: file
    }));
  };

  const openDocumentModal = (docType) => {
    setCurrentDocType(docType);
    setShowDocumentModal(true);
    setErrors({});
  };

  const submitDocument = async () => {
    const file = documents[currentDocType];
    if (!file) {
      toast.error('Please select a file to upload', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setUploadLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', currentDocType);

      const response = await axios.post(
        `${VITE_APP_API_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      // Update user data with the response
      await updateUserProfile(response.data.user);
      
      // Show success toast
      toast.success(`${currentDocType.toUpperCase()} document uploaded successfully!`, {
        position: "top-right",
        autoClose: 4000,
      });
      
      setShowDocumentModal(false);
      setDocuments(prev => ({
        ...prev,
        [currentDocType]: null
      }));
      
    } catch (error) {
      console.error('Document upload error:', error);
      let errorMessage = 'Failed to upload document. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const viewDocument = (docType) => {
    const document = user?.documents?.[docType];
    if (document && document.cloudinaryUrl) {
      window.open(document.cloudinaryUrl, '_blank');
    } else if (document && document.filePath) {
      window.open(`${VITE_APP_API_URL}/uploads/documents/${document.fileName}`, '_blank');
    }
  };

  const handleProfilePictureSuccess = (updatedUser) => {
    updateUserProfile(updatedUser);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation removed since email is not editable

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    }

    return newErrors;
  };

  const handleSave = async () => {    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Only send name and phone for update (email is not editable)
      const updateData = {
        name: formData.name,
        phone: formData.phone
      };
      
      // Call the updateUserProfile function and wait for it to complete
      await updateUserProfile(updateData);
      
      // Clear any existing errors and show success message
      setErrors({});
      
      // Show success toast
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Exit editing mode
      setIsEditing(false);
      
    } catch (error) {
      console.error('Profile update error:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case USER_VERIFICATION_STATUS.VERIFIED:
        return 'text-green-600 bg-green-100';
      case USER_VERIFICATION_STATUS.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case USER_VERIFICATION_STATUS.REJECTED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case USER_VERIFICATION_STATUS.VERIFIED:
        return <FiCheck className="text-green-600" />;
      case USER_VERIFICATION_STATUS.PENDING:
        return <FiAlertCircle className="text-yellow-600" />;
      case USER_VERIFICATION_STATUS.REJECTED:
        return <FiX className="text-red-600" />;
      default:
        return <FiAlertCircle className="text-gray-600" />;
    }
  };

  const getDocumentStatus = (docType) => {
    const doc = user?.documents?.[docType];
    if (!doc) return 'not_uploaded';
    return doc.status || 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and verification documents
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => {
                        setIsEditing(true);
                        setSuccessMessage('');
                        setErrors({});
                      }}
                      icon={<FiEdit />}
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || ''
                          });
                          setErrors({});
                        }}
                        icon={<FiX />}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSave}
                        loading={loading}
                        icon={<FiSave />}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<FiUser />}
                    error={errors.name}
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    icon={<FiMail />}
                    error={errors.email}
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <div className="text-sm text-gray-500 -mt-4 flex items-center gap-2">
                    <FiShield className="text-gray-400" size={14} />
                    Email address cannot be changed for security reasons
                  </div>

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<FiPhone />}
                    error={errors.phone}
                  />

                  {/* <Input
                    label="Join Date"
                    value={new Date(user?.joinDate || Date.now()).toLocaleDateString()}
                    disabled
                    icon={<FiCalendar />}
                  /> */}
                </div>
              </Card>

              {/* Document Verification */}
              <Card className="mt-8 animate-slide-up">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Document Verification
                </h2>

                <div className="space-y-6">
                  {/* Aadhaar Card */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FiShield className="text-blue-600" size={24} />
                      <div>
                        <h3 className="font-medium text-gray-900">Aadhaar Card</h3>
                        <p className="text-sm text-gray-600">
                          Upload your Aadhaar card for identity verification
                        </p>
                        {user?.documents?.aadhaar?.rejectionReason && (
                          <p className="text-sm text-red-600 mt-1">
                            Rejection reason: {user.documents.aadhaar.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getDocumentStatus('aadhaar') === 'verified' 
                          ? 'text-green-600 bg-green-100'
                          : getDocumentStatus('aadhaar') === 'pending'
                          ? 'text-yellow-600 bg-yellow-100'
                          : getDocumentStatus('aadhaar') === 'rejected'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {getDocumentStatus('aadhaar') === 'not_uploaded' 
                          ? 'Not Uploaded' 
                          : getDocumentStatus('aadhaar')
                        }
                      </span>
                      {(user?.documents?.aadhaar?.fileName || user?.documents?.aadhaar?.cloudinaryUrl) && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => viewDocument('aadhaar')}
                          icon={<FiEye />}
                          title="View Document"
                        />
                      )}
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => openDocumentModal('aadhaar')}
                        icon={<FiUpload />}
                      >
                        {getDocumentStatus('aadhaar') === 'not_uploaded' ? 'Upload' : 'Update'}
                      </Button>
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FiShield className="text-purple-600" size={24} />
                      <div>
                        <h3 className="font-medium text-gray-900">PAN Card</h3>
                        <p className="text-sm text-gray-600">
                          Upload your PAN card for income tax verification
                        </p>
                        {user?.documents?.pan?.rejectionReason && (
                          <p className="text-sm text-red-600 mt-1">
                            Rejection reason: {user.documents.pan.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getDocumentStatus('pan') === 'verified' 
                          ? 'text-green-600 bg-green-100'
                          : getDocumentStatus('pan') === 'pending'
                          ? 'text-yellow-600 bg-yellow-100'
                          : getDocumentStatus('pan') === 'rejected'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {getDocumentStatus('pan') === 'not_uploaded' 
                          ? 'Not Uploaded' 
                          : getDocumentStatus('pan')
                        }
                      </span>
                      {(user?.documents?.pan?.fileName || user?.documents?.pan?.cloudinaryUrl) && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => viewDocument('pan')}
                          icon={<FiEye />}
                          title="View Document"
                        />
                      )}
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => openDocumentModal('pan')}
                        icon={<FiUpload />}
                      >
                        {getDocumentStatus('pan') === 'not_uploaded' ? 'Upload' : 'Update'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Summary */}
            <div>
              <Card className="animate-slide-up " style={{ animationDelay: '0.2s' }}>
                <div className="text-center mb-6">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {user?.profilePicture?.cloudinaryUrl ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={user.profilePicture.cloudinaryUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowProfilePictureModal(true)}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Change profile picture"
                    >
                      <FiCamera size={12} />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Verification Status</span>
                    <div className="flex items-center space-x-2">
                      {getVerificationIcon(user?.verificationStatus)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationStatusColor(user?.verificationStatus)}`}>
                        {user?.verificationStatus || 'Unverified'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Invested</span>
                    <span className="font-semibold">
                      ₹{user?.totalInvested?.toLocaleString() || '0'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Balance</span>
                    <span className="font-semibold text-green-600">
                      ₹{user?.currentBalance?.toLocaleString() || '0'}
                    </span>
                  </div>

           
                </div>

                {user?.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiAlertCircle className="text-yellow-600" size={16} />
                      <span className="font-medium text-yellow-800">Action Required</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Complete your document verification to unlock all investment features.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Aadhaar Card:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user?.documents?.aadhaar?.status === 'verified' ? 'bg-green-100 text-green-800' :
                          user?.documents?.aadhaar?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          user?.documents?.aadhaar?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user?.documents?.aadhaar?.status || 'Not uploaded'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>PAN Card:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user?.documents?.pan?.status === 'verified' ? 'bg-green-100 text-green-800' :
                          user?.documents?.pan?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          user?.documents?.pan?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user?.documents?.pan?.status || 'Not uploaded'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setErrors({});
          setDocuments(prev => ({
            ...prev,
            [currentDocType]: null
          }));
        }}
        documentType={currentDocType}
            onFileChange={(file) => handleDocumentUpload(file, currentDocType)}
        file={documents[currentDocType]}
        onFileUpload={submitDocument}
        loading={uploadLoading}
        error={errors.document}
      />

      {/* Profile Picture Upload Modal */}
      <ProfilePictureUpload
        isOpen={showProfilePictureModal}
        onClose={() => setShowProfilePictureModal(false)}
        currentProfilePicture={user?.profilePicture?.cloudinaryUrl}
        onUploadSuccess={handleProfilePictureSuccess}
      />
    </div>
  );
};

export default Profile;
