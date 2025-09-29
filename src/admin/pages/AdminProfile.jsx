// AdminProfile page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiEdit, 
  FiSave, 
  FiX,
  FiCalendar,
  FiActivity,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiTrendingUp,
  FiFileText,
  FiGrid,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiCopy,
  FiUpload,
  FiImage
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';

const AdminProfile = () => {
  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@gmail.com',
    role: 'Super Admin',
    lastLogin: new Date().toLocaleDateString(),
    permissions: ['User Management', 'Investment Management', 'Document Verification', 'System Settings'],
    joinDate: '2024-01-01',
    totalActions: 1247,
    status: 'Active'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Ad Scanner state
  const [qrImage, setQrImage] = useState(null);
  const [selectedQrFile, setSelectedQrFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Show loading if still checking admin status
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Get admin data from localStorage or context
  const getAdminData = () => {
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      try {
        const parsed = JSON.parse(adminUser);
        return {
          name: parsed.name || 'Admin User',
          email: parsed.email || 'admin@gmail.com',
          role: 'Super Admin',
          lastLogin: new Date().toLocaleDateString(),
          permissions: ['User Management', 'Investment Management', 'Document Verification', 'System Settings'],
          joinDate: '2024-01-01',
          totalActions: 1247,
          status: 'Active'
        };
      } catch (error) {
        console.error('Error parsing admin user data:', error);
      }
    }
    
    // Fallback data if no admin user found
    return {
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: 'Super Admin',
      lastLogin: new Date().toLocaleDateString(),
      permissions: ['User Management', 'Investment Management', 'Document Verification', 'System Settings'],
      joinDate: '2024-01-01',
      totalActions: 1247,
      status: 'Active'
    };
  };

  // Move getAdminData call inside useEffect to prevent infinite loop
  useEffect(() => {
    const data = getAdminData();
    setAdminData(data);
    setFormData({
      name: data.name,
      email: data.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, []); // Empty dependency array since we only want this to run once

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setFormData({
      name: adminData.name,
      email: adminData.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // QR Code functions
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedQrFile({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveQrCode = async () => {
    if (!selectedQrFile) return;
    
    setLoading(true);
    try {
      // Simulate backend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save QR code
      setQrImage(selectedQrFile.preview);
      setSelectedQrFile(null);
      setShowUpload(false);
      setSuccessMessage('QR Code saved successfully!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving QR code:', error);
      setErrors({ qrSave: 'Failed to save QR code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const removeQrImage = async () => {
    setLoading(true);
    try {
      // Simulate backend API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQrImage(null);
      setSuccessMessage('QR Code removed successfully!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error removing QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your administrative account settings and preferences</p>
          
          {/* Admin Email Info */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiMail className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-800">Admin Login Email</p>
                <p className="text-sm text-blue-700">{adminData.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Profile Card */}
            <Card className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setIsEditing(true)}
                    icon={<FiEdit />}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={handleCancel}
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
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {errors.general}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    disabled
                    icon={<FiMail />}
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>

                {isEditing && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <Input
                          label="Current Password"
                          name="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={handleChange}
                          icon={<FiShield />}
                          error={errors.currentPassword}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          label="New Password"
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleChange}
                          icon={<FiShield />}
                          error={errors.newPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          label="Confirm New Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          icon={<FiShield />}
                          error={errors.confirmPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </Card>

            {/* Admin Statistics */}
            <Card className="animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Administrative Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiActivity className="text-white" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{adminData.totalActions}</div>
                  <div className="text-sm text-blue-700">Total Actions</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCalendar className="text-white" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{adminData.joinDate}</div>
                  <div className="text-sm text-green-700">Member Since</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiShield className="text-white" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{adminData.permissions.length}</div>
                  <div className="text-sm text-purple-700">Permissions</div>
                </div>
              </div>
            </Card>

            {/* Ad Scanner Section */}
            <Card className="animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Ad Scanner</h2>
                {!qrImage && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setShowUpload(true)}
                    icon={<FiUpload />}
                  >
                    Upload QR Code
                  </Button>
                )}
              </div>

              {/* Upload Form */}
              {showUpload && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload QR Code Image</h3>
                  
                  <div className="mb-4">
                    <input
                      type="file"
                      onChange={handleQrUpload}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a QR code image that will be shown to users in the investment section
                    </p>
                  </div>

                  {/* Preview Selected QR */}
                  {selectedQrFile && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedQrFile.preview}
                          alt="QR Preview"
                          className="w-16 h-16 border border-gray-200 rounded object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600">File: {selectedQrFile.file.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {(selectedQrFile.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => {
                        setShowUpload(false);
                        setSelectedQrFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      onClick={saveQrCode}
                      loading={loading}
                      disabled={!selectedQrFile}
                    >
                      Save QR Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Current QR Code Display */}
              {qrImage && (
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <img
                      src={qrImage}
                      alt="Current QR Code"
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setShowUpload(true)}
                      icon={<FiUpload />}
                    >
                      Upload New QR
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={removeQrImage}
                      icon={<FiTrash2 />}
                    >
                      Remove QR Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!qrImage && !showUpload && (
                <div className="text-center py-12 text-gray-500">
                  <FiGrid size={64} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No QR Code Uploaded</p>
                  <p className="text-sm">Upload a QR code image to display it to users in the investment section</p>
                </div>
              )}
            </Card>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            {/* Admin Info Card */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {adminData.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{adminData.name}</h3>
                <p className="text-gray-600">{adminData.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FiShield className="w-4 h-4 mr-2" />
                    {adminData.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-green-600">{adminData.status}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-semibold">{adminData.lastLogin}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Join Date</span>
                  <span className="font-semibold">{adminData.joinDate}</span>
                </div>
              </div>
            </Card>

            {/* Permissions Card */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Permissions</h3>
              <div className="space-y-3">
                {adminData.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                                 <Button
                   variant="outline"
                   fullWidth
                   onClick={() => window.location.href = '/admin/users'}
                   icon={<FiUsers />}
                 >
                   Manage Users
                 </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = '/admin/investments'}
                  icon={<FiActivity />}
                >
                  View Investments
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = '/admin/documents'}
                  icon={<FiSettings />}
                >
                  Verify Documents
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
