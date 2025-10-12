import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import {
  FiArrowLeft,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiImage,
  FiMail,
  FiPercent,
  FiPhone,
  FiSave,
  FiUserCheck,
  FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { VITE_APP_API_URL } from '../../utils/constants';

const TraderEditModal = ({ isOpen, onClose, trader, getTraders }) => {
  const [formData, setFormData] = useState({
    traderType: '',
    name: '',
    email: '',
    phone: '',
    minInvestment: '',
    maxInvestment: '',
    minInterstRate: '',
    maxInterstRate: '',
    description: '',
    experience: '',
    profilePicture: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with trader data when modal opens
  useEffect(() => {
    if (isOpen && trader) {
      setFormData({
        traderType: trader.traderType || '',
        name: trader.name || '',
        email: trader.email || '',
        phone: trader.phone || '',
        minInvestment: trader.minInvestment || '',
        maxInvestment: trader.maxInvestment || '',
        minInterstRate: trader.minInterstRate || '',
        maxInterstRate: trader.maxInterstRate || '',
        description: trader.description || '',
        experience: trader.experience || '',
        profilePicture: null // Don't pre-populate file input
      });
      setErrors({});
    }
  }, [isOpen, trader]);

  const traderTypes = [
    { value: 'silver', label: 'Silver Trader', color: 'from-gray-400 to-gray-600' },
    { value: 'gold', label: 'Gold Trader', color: 'from-yellow-400 to-yellow-600' },
    { value: 'platinum', label: 'Platinum Trader', color: 'from-purple-500 to-indigo-600' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));

      if (errors.profilePicture) {
        setErrors(prev => ({
          ...prev,
          profilePicture: ''
        }));
      }
    }
  };

  const removeProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  const resetForm = () => {
    setFormData({
      traderType: '',
      name: '',
      email: '',
      phone: '',
      minInvestment: '',
      maxInvestment: '',
      minInterstRate: '',
      maxInterstRate: '',
      description: '',
      experience: '',
      profilePicture: null
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (Object.values(formData).some(value => 
      value !== '' && value !== null && 
      !(Array.isArray(value) && value.length === 0)
    )) {
      if (window.confirm('Are you sure you want to cancel? All form data will be lost.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.traderType) newErrors.traderType = 'Trader type is required';
    if (!formData.name.trim()) newErrors.name = 'Trader name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.minInvestment) newErrors.minInvestment = 'Minimum investment is required';
    if (!formData.maxInvestment) newErrors.maxInvestment = 'Maximum investment is required';
    if (parseFloat(formData.minInvestment) >= parseFloat(formData.maxInvestment)) {
      newErrors.maxInvestment = 'Maximum amount must be greater than minimum amount';
    }
    if (!formData.minInterstRate) newErrors.minInterstRate = 'Minimum interest rate is required';
    if (!formData.maxInterstRate) newErrors.maxInterstRate = 'Maximum interest rate is required';
    if (parseFloat(formData.minInterstRate) >= parseFloat(formData.maxInterstRate)) {
      newErrors.maxInterstRate = 'Maximum rate must be greater than minimum rate';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form data fields
      Object.keys(formData).forEach(key => {
        if (key === 'profilePicture' && formData[key]) {
          // Backend expects 'picture' field name for file upload
          submitData.append('picture', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Make API call to update trader
      const response = await axios.put(
        `${VITE_APP_API_URL}/api/admin/trader/${trader._id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      // Check if trader was updated successfully
      if (response.data.trader && response.data.message) {
        toast.success(response.data.message);
        getTraders(); // Refresh the traders list
        onClose(); // Close the modal
      } else {
        throw new Error('Failed to update trader');
      }
      
    } catch (error) {
      console.error('Error updating trader:', error);
      
      if (error.response?.data?.message) {
        toast.error(`Server Error: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
        toast.error('Please fix the form errors');
      } else if (error.response?.status === 500) {
        toast.error('Internal server error. Please check the server logs and try again.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error: Cannot connect to server. Please check your connection.');
      } else {
        toast.error(`Failed to update trader: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 lg:p-3 rounded-lg">
            <FiUserCheck className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Trader</h1>
            <p className="text-sm lg:text-base text-gray-600">Update trader profile information</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FiX className="h-5 w-5 text-gray-600" />
        </button>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {/* Trader Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trader Type *
                </label>
                <select
                  name="traderType"
                  value={formData.traderType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                    errors.traderType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select trader type</option>
                  {traderTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.traderType && (
                  <p className="mt-1 text-sm text-red-600">{errors.traderType}</p>
                )}
              </div>

              {/* Trader Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trader Name *
                </label>
                <div className="relative">
                  <FiUserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter trader name"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Trading Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Trading Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">

               {/* Minimum Invest Amount */}
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Invest Amount ($) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="minInvestment"
                    value={formData.minInvestment}
                    onChange={handleInputChange}
                    placeholder="100.0"
                    step="0.1"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      errors.minInvestment ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.minInvestment && (
                  <p className="mt-1 text-sm text-red-600">{errors.minInvestment}</p>
                )}
              </div>

              {/* Maximum Invest Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Invest Amount ($) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="maxInvestment"
                    value={formData.maxInvestment}
                    onChange={handleInputChange}
                    placeholder="1000.0"
                    step="0.1"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      errors.maxInvestment ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.maxInvestment && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxInvestment}</p>
                )}
              </div>

              {/* Minimum Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Interest Rate (%) *
                </label>
                <div className="relative">
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="minInterstRate"
                    value={formData.minInterstRate}
                    onChange={handleInputChange}
                    placeholder="6.0"
                    step="0.1"
                    min="0"
                    max="100"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      errors.minInterstRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.minInterstRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.minInterstRate}</p>
                )}
              </div>

              {/* Maximum Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Interest Rate (%) *
                </label>
                <div className="relative">
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="maxInterstRate"
                    value={formData.maxInterstRate}
                    onChange={handleInputChange}
                    placeholder="7.0"
                    step="0.1"
                    min="0"
                    max="100"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      errors.maxInterstRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.maxInterstRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxInterstRate}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years) *
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="5"
                    min="0"
                    max="50"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                )}
              </div>
            </div>
          </div>

      
          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Description *
            </h2>
            <div>
              <div className="relative">
                <FiFileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the trader's expertise, trading style, and any additional information..."
                  rows={4}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm lg:text-base ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Profile Picture */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Profile Picture
            </h2>
            <div>
              {formData.profilePicture ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                    />
            <button
              type="button"
              onClick={removeProfilePicture}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
            >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formData.profilePicture.name}</p>
                    <p className="text-xs text-gray-500">
                      {(formData.profilePicture.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Click to upload profile picture
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
              {errors.profilePicture && (
                <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium text-sm lg:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 lg:px-6 py-2 lg:py-3 border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50 transition-colors cursor-pointer font-medium text-sm lg:text-base"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm lg:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white"></div>
                  <span>Updating Trader...</span>
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span>Update Trader</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TraderEditModal;
