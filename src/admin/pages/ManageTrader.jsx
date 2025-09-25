import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUserCheck, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye, FiAward, FiStar, FiZap, FiInfo, FiCreditCard } from 'react-icons/fi';
import TraderViewModal from '../components/TraderViewModal';
import TraderEditModal from '../components/TraderEditModal';
import axios from 'axios';
import { VITE_APP_API_URL } from '../../utils/constants';

const ManageTrader = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  // Get traders filtered by tier
  const getFilteredTraders = (tier) => {
    if (tier === 'all') {
      return traders;
    }
    return traders.filter(trader => trader.traderType === tier);
  };

  const handleViewTrader = (trader) => {
    setSelectedTrader(trader);
    setIsViewModalOpen(true);
  };

  const handleEditTrader = (trader) => {
    setSelectedTrader(trader);
    setIsEditModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTrader(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTrader(null);
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
  

  const getTraders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      if (selectedTier !== 'all') {
        params.append('traderType', selectedTier);
      }
      
      const response = await axios.get(`${VITE_APP_API_URL}/api/admin/traders?${params.toString()}`);
      
      if (response.data && response.data.traders) {
        setTraders(response.data.traders);
      }
    } catch (err) {
      console.error('Error fetching traders:', err);
      setError('Failed to fetch traders');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedTier]);

  useEffect(() => {
    getTraders();
  }, [getTraders]);

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
            <FiUserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Manage Trader</h1>
            <p className="text-sm lg:text-base text-gray-600">Manage and oversee trader activities and performance</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button 
            onClick={() => navigate('/admin/manage-trader/card-management')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer text-sm lg:text-base"
          >
            <FiCreditCard className="h-4 w-4" />
            <span>Manage Card</span>
          </button>
          <button 
            onClick={() => navigate('/admin/manage-trader/add-trader')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer text-sm lg:text-base"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Trader</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Traders</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{traders.length}</p>
            </div>
            <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
              <FiUserCheck className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Silver Traders</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-600">{traders.filter(t => t.traderType === 'silver').length}</p>
            </div>
            <div className="bg-gray-100 p-2 lg:p-3 rounded-lg">
              <FiAward className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Gold Traders</p>
              <p className="text-xl lg:text-2xl font-bold text-yellow-600">{traders.filter(t => t.traderType === 'gold').length}</p>
            </div>
            <div className="bg-yellow-100 p-2 lg:p-3 rounded-lg">
              <FiStar className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Platinum Traders</p>
              <p className="text-xl lg:text-2xl font-bold text-purple-600">{traders.filter(t => t.traderType === 'platinum').length}</p>
            </div>
            <div className="bg-purple-100 p-2 lg:p-3 rounded-lg">
              <FiZap className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search traders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm lg:text-base w-full sm:w-auto"
            >
              <option value="all">All Tiers</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>
        </div>
        {loading && (
          <div className="mt-4 text-center text-gray-600">
            Loading traders...
          </div>
        )}
        {error && (
          <div className="mt-4 text-center text-red-600">
            {error}
          </div>
        )}
      </motion.div>

      {/* Traders by Tier */}
      <div className="space-y-8">
        {selectedTier === 'all' ? (
          // Show all tiers
          Object.entries(tierConfig).map(([tierKey, config]) => {
            const traders = getFilteredTraders(tierKey);
            if (traders.length === 0) return null;
            
            const IconComponent = config.icon;
            
            return (
              <motion.div
                key={tierKey}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Tier Header */}
                <div className={`p-6 ${config.bgColor} border-b ${config.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{config.name} Traders</h3>
                        <p className="text-gray-600">{traders.length} traders in this tier</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Average Return Rate</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {(traders.reduce((sum, trader) => sum + trader.minInterstRate + trader.maxInterstRate, 0) / (traders.length * 2)).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traders Grid */}
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {traders.map((trader) => (
                      <div key={trader._id} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3 lg:mb-4">
                          <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                            {trader.profilePicture ? (
                              <img 
                                src={trader.profilePicture} 
                                alt={trader.name}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-xs lg:text-sm">{trader.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{trader.name}</h4>
                              <p className="text-xs lg:text-sm text-gray-600">{trader.experience} years experience</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0 ml-2">
                            Active
                          </span>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Min Interest Rate</span>
                            <span className="font-semibold text-green-600 text-sm lg:text-base">{trader.minInterstRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Max Interest Rate</span>
                            <span className="font-semibold text-blue-600 text-sm lg:text-base">{trader.maxInterstRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Min Investment</span>
                            <span className="font-semibold text-gray-900 text-sm lg:text-base">${trader.minInvestment}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Max Investment</span>
                            <span className="font-semibold text-gray-900 text-sm lg:text-base">${trader.maxInvestment}</span>
                          </div>
                        </div>

                        <div className="mt-3 lg:mt-4">
                          <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">{trader.description}</p>
                        </div>

                        <div className="mt-3 lg:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button 
                            onClick={() => handleViewTrader(trader)}
                            className="flex-1 py-2 px-3 text-blue-600 hover:text-blue-900 text-xs lg:text-sm font-medium cursor-pointer border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FiEye className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleEditTrader(trader)}
                            className="flex-1 py-2 px-3 text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FiEdit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 py-2 px-3 text-red-600 hover:text-red-900 text-xs lg:text-sm font-medium cursor-pointer border border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center">
                            <FiTrash2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          // Show selected tier only
          (() => {
            const traders = getFilteredTraders(selectedTier);
            const config = tierConfig[selectedTier];
            const IconComponent = config.icon;
            
            return (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Tier Header */}
                <div className={`p-6 ${config.bgColor} border-b ${config.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{config.name} Traders</h3>
                        <p className="text-gray-600">{traders.length} traders in this tier</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Average Return Rate</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {(traders.reduce((sum, trader) => sum + trader.minInterstRate + trader.maxInterstRate, 0) / (traders.length * 2)).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traders Grid */}
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {traders.map((trader) => (
                      <div key={trader._id} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3 lg:mb-4">
                          <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                            {trader.profilePicture ? (
                              <img 
                                src={trader.profilePicture} 
                                alt={trader.name}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-xs lg:text-sm">{trader.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{trader.name}</h4>
                              <p className="text-xs lg:text-sm text-gray-600">{trader.experience} years experience</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0 ml-2">
                            Active
                          </span>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Min Interest Rate</span>
                            <span className="font-semibold text-green-600 text-sm lg:text-base">{trader.minInterstRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Max Interest Rate</span>
                            <span className="font-semibold text-blue-600 text-sm lg:text-base">{trader.maxInterstRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Min Investment</span>
                            <span className="font-semibold text-gray-900 text-sm lg:text-base">${trader.minInvestment}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs lg:text-sm text-gray-600">Max Investment</span>
                            <span className="font-semibold text-gray-900 text-sm lg:text-base">${trader.maxInvestment}</span>
                          </div>
                        </div>

                        <div className="mt-3 lg:mt-4">
                          <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">{trader.description}</p>
                        </div>

                        <div className="mt-3 lg:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button 
                            onClick={() => handleViewTrader(trader)}
                            className="flex-1 py-2 px-3 text-blue-600 hover:text-blue-900 text-xs lg:text-sm font-medium cursor-pointer border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FiEye className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleEditTrader(trader)}
                            className="flex-1 py-2 px-3 text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FiEdit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 py-2 px-3 text-red-600 hover:text-red-900 text-xs lg:text-sm font-medium cursor-pointer border border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center">
                            <FiTrash2 className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()
        )}
      </div>

      {/* Trader View Modal */}
      <TraderViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        trader={selectedTrader}
        
      />

      {/* Trader Edit Modal */}
      <TraderEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        trader={selectedTrader}
        getTraders={getTraders}

      />
    </motion.div>
  );
};

export default ManageTrader;

