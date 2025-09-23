import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiStar, FiTrendingUp, FiUser, FiAward, FiCheck, FiX } from 'react-icons/fi';

const TraderSelection = ({ membershipTier, onTraderSelect, selectedTrader }) => {
  const [showTraderInfo, setShowTraderInfo] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showTraderInfo) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTraderInfo]);

  // Enhanced trader data with more traders per tier
  const tradersData = {
    silver: [
      {
        id: 1,
        name: 'Rajesh Kumar',
        profilePic: null,
        returnRate: '10.5%',
        experience: '3 years',
        description: 'Specialized in conservative trading strategies with consistent returns.',
        totalClients: 45,
        successRate: '92%',
        specialties: ['Forex', 'Commodities'],
        riskLevel: 'Low-Medium',
        rating: 4.8,
        minInvestment: 10000,
        maxInvestment: 50000
      },
      {
        id: 2,
        name: 'Priya Sharma',
        profilePic: null,
        returnRate: '11.2%',
        experience: '4 years',
        description: 'Expert in technical analysis and risk management for steady growth.',
        totalClients: 38,
        successRate: '89%',
        specialties: ['CFD', 'Indices'],
        riskLevel: 'Medium',
        rating: 4.6,
        minInvestment: 10000,
        maxInvestment: 50000
      },
      {
        id: 3,
        name: 'Amit Patel',
        profilePic: null,
        returnRate: '9.8%',
        experience: '2 years',
        description: 'Focus on long-term investment strategies with minimal risk.',
        totalClients: 52,
        successRate: '94%',
        specialties: ['Forex', 'Bonds'],
        riskLevel: 'Low',
        rating: 4.9,
        minInvestment: 10000,
        maxInvestment: 50000
      },
      {
        id: 4,
        name: 'Suresh Reddy',
        profilePic: null,
        returnRate: '10.8%',
        experience: '3 years',
        description: 'Specialized in currency trading with focus on major pairs.',
        totalClients: 41,
        successRate: '91%',
        specialties: ['Forex', 'Currency'],
        riskLevel: 'Low-Medium',
        rating: 4.7,
        minInvestment: 10000,
        maxInvestment: 50000
      },
      {
        id: 5,
        name: 'Meera Joshi',
        profilePic: null,
        returnRate: '11.5%',
        experience: '4 years',
        description: 'Expert in commodity trading with emphasis on precious metals.',
        totalClients: 35,
        successRate: '93%',
        specialties: ['Commodities', 'Metals'],
        riskLevel: 'Medium',
        rating: 4.8,
        minInvestment: 10000,
        maxInvestment: 50000
      }
    ],
    gold: [
      {
        id: 6,
        name: 'Vikram Singh',
        profilePic: null,
        returnRate: '15.3%',
        experience: '6 years',
        description: 'Senior trader with expertise in advanced market analysis and portfolio optimization.',
        totalClients: 28,
        successRate: '96%',
        specialties: ['Forex', 'Crypto', 'CFD'],
        riskLevel: 'Medium-High',
        rating: 4.9,
        minInvestment: 50000,
        maxInvestment: 200000
      },
      {
        id: 7,
        name: 'Sneha Reddy',
        profilePic: null,
        returnRate: '14.7%',
        experience: '5 years',
        description: 'Specialized in cryptocurrency trading and blockchain investments.',
        totalClients: 35,
        successRate: '93%',
        specialties: ['Crypto', 'DeFi'],
        riskLevel: 'High',
        rating: 4.7,
        minInvestment: 50000,
        maxInvestment: 200000
      },
      {
        id: 8,
        name: 'Arjun Mehta',
        profilePic: null,
        returnRate: '16.1%',
        experience: '7 years',
        description: 'Expert in multi-asset trading with focus on emerging markets.',
        totalClients: 42,
        successRate: '95%',
        specialties: ['Forex', 'Commodities', 'Indices'],
        riskLevel: 'Medium-High',
        rating: 4.8,
        minInvestment: 50000,
        maxInvestment: 200000
      },
      {
        id: 9,
        name: 'Deepika Agarwal',
        profilePic: null,
        returnRate: '15.8%',
        experience: '6 years',
        description: 'Specialized in algorithmic trading and quantitative strategies.',
        totalClients: 31,
        successRate: '94%',
        specialties: ['Algorithmic', 'Quantitative'],
        riskLevel: 'High',
        rating: 4.9,
        minInvestment: 50000,
        maxInvestment: 200000
      },
      {
        id: 10,
        name: 'Rohit Gupta',
        profilePic: null,
        returnRate: '14.2%',
        experience: '5 years',
        description: 'Expert in options trading and derivatives strategies.',
        totalClients: 38,
        successRate: '92%',
        specialties: ['Options', 'Derivatives'],
        riskLevel: 'High',
        rating: 4.6,
        minInvestment: 50000,
        maxInvestment: 200000
      }
    ],
    platinum: [
      {
        id: 11,
        name: 'Dr. Ravi Krishnan',
        profilePic: null,
        returnRate: '22.4%',
        experience: '12 years',
        description: 'Chief Investment Officer with PhD in Finance. Expert in institutional trading.',
        totalClients: 15,
        successRate: '98%',
        specialties: ['All Markets', 'Hedge Funds', 'Derivatives'],
        riskLevel: 'High',
        rating: 5.0,
        minInvestment: 200000,
        maxInvestment: 1000000
      },
      {
        id: 12,
        name: 'Anita Desai',
        profilePic: null,
        returnRate: '20.8%',
        experience: '10 years',
        description: 'Former Wall Street trader specializing in high-frequency trading strategies.',
        totalClients: 18,
        successRate: '97%',
        specialties: ['Algorithmic Trading', 'Crypto', 'Forex'],
        riskLevel: 'High',
        rating: 4.9,
        minInvestment: 200000,
        maxInvestment: 1000000
      },
      {
        id: 13,
        name: 'Kiran Nair',
        profilePic: null,
        returnRate: '21.5%',
        experience: '9 years',
        description: 'Portfolio manager with expertise in alternative investments and risk arbitrage.',
        totalClients: 12,
        successRate: '99%',
        specialties: ['Private Equity', 'Real Estate', 'Commodities'],
        riskLevel: 'High',
        rating: 5.0,
        minInvestment: 200000,
        maxInvestment: 1000000
      },
      {
        id: 14,
        name: 'Prof. Sanjay Verma',
        profilePic: null,
        returnRate: '23.1%',
        experience: '15 years',
        description: 'Former Goldman Sachs trader with expertise in macro trading strategies.',
        totalClients: 8,
        successRate: '99%',
        specialties: ['Macro Trading', 'Global Markets'],
        riskLevel: 'High',
        rating: 5.0,
        minInvestment: 200000,
        maxInvestment: 1000000
      },
      {
        id: 15,
        name: 'Dr. Priya Iyer',
        profilePic: null,
        returnRate: '21.8%',
        experience: '11 years',
        description: 'Expert in quantitative finance and machine learning trading strategies.',
        totalClients: 14,
        successRate: '98%',
        specialties: ['Quantitative', 'AI Trading', 'Machine Learning'],
        riskLevel: 'High',
        rating: 4.9,
        minInvestment: 200000,
        maxInvestment: 1000000
      }
    ]
  };

  const traders = tradersData[membershipTier] || [];

  const handleTraderSelect = (trader) => {
    onTraderSelect(trader);
    
    // Auto-scroll to continue button after trader selection
    setTimeout(() => {
      const continueButton = document.getElementById('continue-button');
      if (continueButton) {
        continueButton.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 300); // Slight delay to allow for UI updates
  };

  const TraderInfoPopup = ({ trader, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">Trader Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {trader.profilePic ? (
              <img src={trader.profilePic} alt={trader.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{trader.name.charAt(0)}</span>
            )}
          </div>
          <h4 className="text-xl font-semibold text-gray-900">{trader.name}</h4>
          <p className="text-gray-600">{trader.experience} experience</p>
          <div className="flex items-center justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(trader.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({trader.rating})</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{trader.returnRate}</div>
              <div className="text-sm text-green-700">Return Rate</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{trader.successRate}</div>
              <div className="text-sm text-blue-700">Success Rate</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
            <p className="text-gray-600 text-sm">{trader.description}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">Specialties</h5>
            <div className="flex flex-wrap gap-2">
              {trader.specialties.map((specialty, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-semibold text-gray-900">{trader.totalClients}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-semibold text-gray-900">{trader.riskLevel}</div>
              <div className="text-sm text-gray-600">Risk Level</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!membershipTier) return null;

  return (
    <div className="mt-16 space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Expert Trader
        </h2>
        <p className="text-gray-600 text-lg">
          Select from our {membershipTier} tier professional traders
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </motion.div>

      {/* Traders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {traders.map((trader, index) => (
          <motion.div
            key={trader.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`
              relative border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer
              ${selectedTrader?.id === trader.id 
                ? 'border-blue-500 bg-blue-50 shadow-xl scale-105' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:scale-102'
              }
            `}
            onClick={() => handleTraderSelect(trader)}
          >
            {/* Selection indicator */}
            {selectedTrader?.id === trader.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <FiCheck className="text-white text-sm" />
              </motion.div>
            )}

            {/* Trader Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {trader.profilePic ? (
                    <img src={trader.profilePic} alt={trader.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-lg">{trader.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{trader.name}</h4>
                  <p className="text-sm text-gray-600">{trader.experience}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTraderInfo(trader);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <FiInfo className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(trader.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">({trader.rating})</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-green-600">{trader.returnRate}</div>
                <div className="text-xs text-green-700">Return Rate</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600">{trader.successRate}</div>
                <div className="text-xs text-blue-700">Success Rate</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{trader.description}</p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mb-4">
              {trader.specialties.slice(0, 2).map((specialty, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {specialty}
                </span>
              ))}
              {trader.specialties.length > 2 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  +{trader.specialties.length - 2}
                </span>
              )}
            </div>

            {/* Additional Info */}
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>{trader.totalClients} clients</span>
              <span>{trader.riskLevel}</span>
            </div>

            {/* Select Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300
                ${selectedTrader?.id === trader.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                cursor-pointer
              `}
            >
              {selectedTrader?.id === trader.id ? 'Selected' : 'Select Trader'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      {selectedTrader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.button
            id="continue-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent('traderSelected', { detail: selectedTrader });
              window.dispatchEvent(event);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            Continue with {selectedTrader.name}
          </motion.button>
        </motion.div>
      )}

      {/* Trader Info Popup */}
      <AnimatePresence>
        {showTraderInfo && (
          <TraderInfoPopup
            trader={showTraderInfo}
            onClose={() => setShowTraderInfo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TraderSelection;
