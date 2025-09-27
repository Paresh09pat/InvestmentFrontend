import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiStar, FiTrendingUp, FiUser, FiAward, FiCheck, FiX } from 'react-icons/fi';

const TraderSelection = ({ membershipTier, onTraderSelect, selectedTrader, traders = [], isLoading = false }) => {
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

  // Transform API traders data to match component format
  const transformedTraders = traders.map(trader => ({
    id: trader._id,
    name: trader.name,
    profilePic: trader.profilePicture,
    returnRate: `${trader.minInterstRate}-${trader.maxInterstRate}%`,
    experience: `${trader.experience} years`,
    description: trader.description,
    totalClients: Math.floor(Math.random() * 50) + 20, // Random for demo
    successRate: `${Math.floor(Math.random() * 10) + 85}%`, // Random for demo
    specialties: [trader.traderType.charAt(0).toUpperCase() + trader.traderType.slice(1)],
    riskLevel: trader.traderType === 'silver' ? 'Low-Medium' : trader.traderType === 'gold' ? 'Medium-High' : 'High',
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    minInvestment: trader.minInvestment,
    maxInvestment: trader.maxInvestment
  }));

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
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading traders...</p>
          </div>
        </div>
      ) : transformedTraders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {transformedTraders.map((trader, index) => (
          <motion.div
            key={trader.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`
              relative border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col min-h-[450px]
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

            {/* Card Content - Fixed Height */}
            <div className="flex flex-col h-full">
              {/* Trader Header */}
              <div className="flex items-center justify-between mb-3">
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
              <div className="flex items-center mb-3">
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
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-green-50 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">{trader.returnRate}</div>
                  <div className="text-xs text-green-700">Return Rate</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{trader.successRate}</div>
                  <div className="text-xs text-blue-700">Success Rate</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{trader.description}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-3">
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
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>{trader.totalClients} clients</span>
                <span>{trader.riskLevel}</span>
              </div>

              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>

              {/* Select Button - Always at bottom */}
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
            </div>
          </motion.div>
        ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <FiUser className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Traders Available</h3>
            <p className="text-gray-600">No traders found for the {membershipTier} tier.</p>
          </div>
        </div>
      )}

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
