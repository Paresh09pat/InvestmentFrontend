import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiAward, 
  FiStar, 
  FiZap, 
  FiSave, 
  FiRefreshCw, 
  FiPlus, 
  FiTrash2,
  FiCreditCard,
  FiDollarSign,
  FiPercent,
  FiCalendar,
  FiCheck,
  FiX
} from 'react-icons/fi';  
import axios from 'axios';
import { VITE_APP_API_URL } from '../../utils/constants';

const CardManagement = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('silver');
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const tierConfig = {
    silver: {
      name: 'Silver',
      icon: FiAward,
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300'
    },
    gold: {
      name: 'Gold',
      icon: FiStar,
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    },
    platinum: {
      name: 'Platinum',
      icon: FiZap,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    }
  };

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

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${VITE_APP_API_URL}/api/admin/plans`);
      if (response.data && response.data.plans) {
        // Transform the plans array into the expected object structure
        const transformedData = {};
        response.data.plans.forEach(plan => {
          transformedData[plan.name] = {
            name: plan.name.charAt(0).toUpperCase() + plan.name.slice(1), // Capitalize first letter
            minAmount: plan.minInvestment,
            maxAmount: plan.maxInvestment,
            minInterestRate: plan.minReturnRate,
            maxInterestRate: plan.maxReturnRate,
            duration: plan.duration || 12,
            features: plan.features || [],
            description: plan.description || '',
            isActive: plan.isActive !== undefined ? plan.isActive : true,
            _id: plan._id
          };
        });
        setCardData(transformedData);
        toast.success('Card data loaded successfully');
      } else {
        toast.error('No card data received from server');
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
      toast.error('Failed to load card data. Please check your connection and try again.');
      // Set empty state on error
      setCardData({});
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [selectedTier]: {
        ...prev[selectedTier],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setCardData(prev => ({
        ...prev,
        [selectedTier]: {
          ...prev[selectedTier],
          features: [...prev[selectedTier].features, newFeature.trim()]
        }
      }));
      setNewFeature('');
      setHasChanges(true);
    }
  };

  const handleFeatureRemove = (index) => {
    setCardData(prev => ({
      ...prev,
      [selectedTier]: {
        ...prev[selectedTier],
        features: prev[selectedTier].features.filter((_, i) => i !== index)
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentPlan = cardData[selectedTier];
      const planId = currentPlan._id;
      
      // Transform data back to API format
      const updateData = {
        name: selectedTier,
        minInvestment: currentPlan.minAmount,
        maxInvestment: currentPlan.maxAmount,
        minReturnRate: currentPlan.minInterestRate,
        maxReturnRate: currentPlan.maxInterestRate,
        duration: currentPlan.duration,
        features: currentPlan.features,
        description: currentPlan.description,
        isActive: currentPlan.isActive
      };
      
      await axios.put(`${VITE_APP_API_URL}/api/admin/plan/${planId}`, updateData);
      toast.success(`${tierConfig[selectedTier].name} card updated successfully!`);
      setHasChanges(false);
      // Refetch data after successful update
      await fetchCardData();
    } catch (error) {
      console.error('Error saving card data:', error);
      toast.error('Failed to save card data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Are you sure you want to leave? All unsaved changes will be lost.')) {
        navigate('/admin/manage-trader');
      }
    } else {
      navigate('/admin/manage-trader');
    }
  };

  const currentConfig = tierConfig[selectedTier];
  const currentData = cardData[selectedTier] || {};
  const IconComponent = currentConfig.icon;

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 lg:p-3 rounded-lg">
              <FiCreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Manage Membership Cards</h1>
              <p className="text-sm lg:text-base text-gray-600">Configure card settings and features for all tiers</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 font-medium text-center sm:text-left">Unsaved changes</span>
          )}
          <button
            onClick={fetchCardData}
            disabled={loading}
            className="bg-gray-500 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges || !cardData[selectedTier]}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 lg:px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
          >
            {saving ? (
              <FiRefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <FiSave className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-12">
          <FiRefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
          <span className="ml-2 text-gray-600">Loading card data...</span>
        </motion.div>
      ) : Object.keys(cardData).length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-12">
          <FiCreditCard className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Card Data Available</h3>
          <p className="text-gray-600 text-center mb-6">
            Unable to load card data from the server. Please check your connection and try refreshing.
          </p>
          <button
            onClick={fetchCardData}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>Retry Loading</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Tier Selection */}
          <motion.div variants={itemVariants} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Card Tier</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              {Object.entries(tierConfig).map(([tierKey, config]) => {
                const TierIcon = config.icon;
                return (
                  <button
                    key={tierKey}
                    onClick={() => setSelectedTier(tierKey)}
                    className={`p-4 lg:p-6 rounded-lg border-2 transition-all ${
                      selectedTier === tierKey
                        ? `${config.borderColor} ${config.bgColor} shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                      <TierIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">
                      {cardData[tierKey] ? 
                        `${cardData[tierKey].minAmount?.toLocaleString() || 'N/A'} - ${cardData[tierKey].maxAmount?.toLocaleString() || 'N/A'}` : 
                        'No data available'
                      }
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Card Configuration Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Basic Settings */}
            <motion.div variants={itemVariants} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Basic Settings</h3>
              
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Name
                  </label>
                  <input
                    type="text"
                    value={currentData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiDollarSign className="inline h-4 w-4 mr-1" />
                      Min Amount ($)
                    </label>
                    <input
                      type="number"
                      value={currentData.minAmount || ''}
                      onChange={(e) => handleInputChange('minAmount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiDollarSign className="inline h-4 w-4 mr-1" />
                      Max Amount ($)
                    </label>
                    <input
                      type="number"
                      value={currentData.maxAmount || ''}
                      onChange={(e) => handleInputChange('maxAmount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPercent className="inline h-4 w-4 mr-1" />
                      Min Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentData.minInterestRate || ''}
                      onChange={(e) => handleInputChange('minInterestRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPercent className="inline h-4 w-4 mr-1" />
                      Max Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentData.maxInterestRate || ''}
                      onChange={(e) => handleInputChange('maxInterestRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="inline h-4 w-4 mr-1" />
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={currentData.duration || ''}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={currentData.isActive || false}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Card is active
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Features Management */}
            <motion.div variants={itemVariants} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Features</h3>
              
              <div className="space-y-4">
                <div className="space-y-2 lg:space-y-3 max-h-48 lg:max-h-64 overflow-y-auto">
                  {(currentData.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                      <FiCheck className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 flex-shrink-0" />
                      <span className="flex-1 text-xs lg:text-sm text-gray-700">{feature}</span>
                      <button
                        onClick={() => handleFeatureRemove(index)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      >
                        <FiTrash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleFeatureAdd()}
                  />
                  <button
                    onClick={handleFeatureAdd}
                    className="px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 text-sm lg:text-base"
                  >
                    <FiPlus className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default CardManagement;
