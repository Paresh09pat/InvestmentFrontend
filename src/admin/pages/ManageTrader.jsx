import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUserCheck, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye, FiAward, FiStar, FiZap, FiInfo } from 'react-icons/fi';
import TraderViewModal from '../components/TraderViewModal';

const ManageTrader = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock trader data organized by tiers
  const tradersByTier = {
    silver: [
      {
        id: 1,
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 98765 43210',
        tier: 'silver',
        traderType: 'silver',
        minInterestRate: '8',
        maxInterestRate: '12',
        commission: '2.5',
        maxClients: '50',
        experience: '3 years',
        description: 'Experienced trader specializing in conservative investment strategies with focus on risk management and steady returns.',
        specializations: ['Forex Trading', 'Commodities', 'Risk Management'],
        profilePicture: null,
        status: 'active',
        joinDate: '2023-01-15',
        returnRate: '10.5%',
        successRate: '92%',
        totalClients: 45,
        riskLevel: 'Low-Medium'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 98765 43211',
        tier: 'silver',
        traderType: 'silver',
        minInterestRate: '9',
        maxInterestRate: '13',
        commission: '2.0',
        maxClients: '45',
        experience: '4 years',
        description: 'Skilled trader with expertise in technical analysis and market trends. Focuses on delivering consistent returns.',
        specializations: ['CFD Trading', 'Indices', 'Technical Analysis'],
        profilePicture: null,
        status: 'active',
        joinDate: '2022-11-20',
        returnRate: '11.2%',
        successRate: '89%',
        totalClients: 38,
        riskLevel: 'Medium'
      },
      {
        id: 3,
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+91 98765 43212',
        tier: 'silver',
        traderType: 'silver',
        minInterestRate: '7',
        maxInterestRate: '11',
        commission: '1.8',
        maxClients: '60',
        experience: '2 years',
        description: 'Young and dynamic trader with fresh perspective on market opportunities and innovative trading strategies.',
        specializations: ['Forex Trading', 'Bonds', 'Day Trading'],
        profilePicture: null,
        status: 'active',
        joinDate: '2023-03-10',
        returnRate: '9.8%',
        successRate: '94%',
        totalClients: 52,
        riskLevel: 'Low'
      }
    ],
    gold: [
      {
        id: 4,
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 98765 43213',
        tier: 'gold',
        traderType: 'gold',
        minInterestRate: '12',
        maxInterestRate: '18',
        commission: '3.5',
        maxClients: '30',
        experience: '6 years',
        description: 'Senior trader with extensive experience in multiple asset classes. Known for balanced approach and strong risk management.',
        specializations: ['Forex Trading', 'Cryptocurrency', 'CFD Trading', 'Portfolio Management'],
        profilePicture: null,
        status: 'active',
        joinDate: '2021-08-15',
        returnRate: '15.3%',
        successRate: '96%',
        totalClients: 28,
        riskLevel: 'Medium-High'
      },
      {
        id: 5,
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 98765 43214',
        tier: 'gold',
        traderType: 'gold',
        minInterestRate: '11',
        maxInterestRate: '17',
        commission: '3.0',
        maxClients: '35',
        experience: '5 years',
        description: 'Expert in cryptocurrency and DeFi trading with deep understanding of blockchain technology and market dynamics.',
        specializations: ['Cryptocurrency', 'DeFi', 'Blockchain', 'Digital Assets'],
        profilePicture: null,
        status: 'active',
        joinDate: '2022-02-28',
        returnRate: '14.7%',
        successRate: '93%',
        totalClients: 35,
        riskLevel: 'High'
      },
      {
        id: 6,
        name: 'Arjun Mehta',
        email: 'arjun@example.com',
        phone: '+91 98765 43215',
        tier: 'gold',
        traderType: 'gold',
        minInterestRate: '13',
        maxInterestRate: '19',
        commission: '3.2',
        maxClients: '40',
        experience: '7 years',
        description: 'Versatile trader with expertise across multiple markets. Specializes in identifying emerging opportunities.',
        specializations: ['Forex Trading', 'Commodities', 'Indices', 'Options Trading'],
        profilePicture: null,
        status: 'active',
        joinDate: '2021-12-05',
        returnRate: '16.1%',
        successRate: '95%',
        totalClients: 42,
        riskLevel: 'Medium-High'
      }
    ],
    platinum: [
      {
        id: 7,
        name: 'Dr. Ravi Krishnan',
        email: 'ravi@example.com',
        phone: '+91 98765 43216',
        tier: 'platinum',
        traderType: 'platinum',
        minInterestRate: '18',
        maxInterestRate: '25',
        commission: '5.0',
        maxClients: '15',
        experience: '12 years',
        description: 'Renowned financial expert with PhD in Economics. Manages high-value portfolios for institutional clients with exceptional track record.',
        specializations: ['All Markets', 'Hedge Funds', 'Derivatives', 'Institutional Trading', 'Risk Management'],
        profilePicture: null,
        status: 'active',
        joinDate: '2020-06-10',
        returnRate: '22.4%',
        successRate: '98%',
        totalClients: 15,
        riskLevel: 'High'
      },
      {
        id: 8,
        name: 'Anita Desai',
        email: 'anita@example.com',
        phone: '+91 98765 43217',
        tier: 'platinum',
        traderType: 'platinum',
        minInterestRate: '17',
        maxInterestRate: '24',
        commission: '4.8',
        maxClients: '18',
        experience: '10 years',
        description: 'Leading algorithmic trading specialist with advanced AI and machine learning expertise. Pioneers in automated trading systems.',
        specializations: ['Algorithmic Trading', 'Cryptocurrency', 'Forex Trading', 'AI Trading', 'Machine Learning'],
        profilePicture: null,
        status: 'active',
        joinDate: '2020-09-15',
        returnRate: '20.8%',
        successRate: '97%',
        totalClients: 18,
        riskLevel: 'High'
      },
      {
        id: 9,
        name: 'Kiran Nair',
        email: 'kiran@example.com',
        phone: '+91 98765 43218',
        tier: 'platinum',
        traderType: 'platinum',
        minInterestRate: '19',
        maxInterestRate: '26',
        commission: '5.2',
        maxClients: '12',
        experience: '9 years',
        description: 'Elite trader specializing in alternative investments and private equity. Manages exclusive portfolios for ultra-high-net-worth clients.',
        specializations: ['Private Equity', 'Real Estate', 'Commodities', 'Alternative Investments', 'Wealth Management'],
        profilePicture: null,
        status: 'active',
        joinDate: '2021-01-20',
        returnRate: '21.5%',
        successRate: '99%',
        totalClients: 12,
        riskLevel: 'High'
      }
    ]
  };

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

  const getFilteredTraders = (tier) => {
    let traders = tradersByTier[tier] || [];
    
    if (searchTerm) {
      traders = traders.filter(trader => 
        trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return traders;
  };

  const getAllTraders = () => {
    return Object.values(tradersByTier).flat();
  };

  const getFilteredAllTraders = () => {
    let traders = getAllTraders();
    
    if (searchTerm) {
      traders = traders.filter(trader => 
        trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return traders;
  };

  const handleViewTrader = (trader) => {
    setSelectedTrader(trader);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
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

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
            <FiUserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Trader</h1>
            <p className="text-gray-600">Manage and oversee trader activities and performance</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/manage-trader/add-trader')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Trader</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Traders</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Traders</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">6</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search traders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <FiFilter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
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
                        {(traders.reduce((sum, trader) => sum + parseFloat(trader.returnRate), 0) / traders.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traders Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {traders.map((trader) => (
                      <div key={trader.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{trader.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{trader.name}</h4>
                              <p className="text-sm text-gray-600">{trader.experience}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trader.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {trader.status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Return Rate</span>
                            <span className="font-semibold text-green-600">{trader.returnRate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-semibold text-blue-600">{trader.successRate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Clients</span>
                            <span className="font-semibold text-gray-900">{trader.totalClients}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Risk Level</span>
                            <span className="font-semibold text-gray-900">{trader.riskLevel}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {trader.specializations.slice(0, 2).map((specialty, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                          {trader.specializations.length > 2 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              +{trader.specializations.length - 2}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button 
                            onClick={() => handleViewTrader(trader)}
                            className="flex-1 py-2 px-3 text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FiEye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="flex-1 py-2 px-3 text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center">
                            <FiEdit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 py-2 px-3 text-red-600 hover:text-red-900 text-sm font-medium cursor-pointer border border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center">
                            <FiTrash2 className="h-4 w-4 mr-1" />
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
                        {(traders.reduce((sum, trader) => sum + parseFloat(trader.returnRate), 0) / traders.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traders Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {traders.map((trader) => (
                      <div key={trader.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{trader.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{trader.name}</h4>
                              <p className="text-sm text-gray-600">{trader.experience}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trader.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {trader.status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Return Rate</span>
                            <span className="font-semibold text-green-600">{trader.returnRate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-semibold text-blue-600">{trader.successRate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Clients</span>
                            <span className="font-semibold text-gray-900">{trader.totalClients}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Risk Level</span>
                            <span className="font-semibold text-gray-900">{trader.riskLevel}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {trader.specializations.slice(0, 2).map((specialty, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                          {trader.specializations.length > 2 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              +{trader.specializations.length - 2}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button 
                            onClick={() => handleViewTrader(trader)}
                            className="flex-1 py-2 px-3 text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <FiEye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="flex-1 py-2 px-3 text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center">
                            <FiEdit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 py-2 px-3 text-red-600 hover:text-red-900 text-sm font-medium cursor-pointer border border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center">
                            <FiTrash2 className="h-4 w-4 mr-1" />
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
    </motion.div>
  );
};

export default ManageTrader;
