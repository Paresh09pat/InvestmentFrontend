import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiFileText, 
  FiAward,
  FiStar,
  FiZap,
  FiTrendingUp
} from 'react-icons/fi';

const TraderViewModal = ({ isOpen, onClose, trader }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!trader) return null;

  // Normalize trader data with defaults for missing properties
  const normalizedTrader = {
    ...trader,
    tier: trader.traderType || 'silver',
    minInterestRate: trader.minInterstRate || 0,
    maxInterestRate: trader.maxInterstRate || 0,
    description: trader.description || 'No description provided.'
  };

  const getTierConfig = (tier) => {
    const configs = {
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
    return configs[tier] || configs.silver;
  };

  const tierConfig = getTierConfig(normalizedTrader.tier);
  const TierIcon = tierConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
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
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 ${tierConfig.bgColor} border-b ${tierConfig.borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${tierConfig.color} rounded-xl flex items-center justify-center`}>
                    <TierIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{normalizedTrader.name}</h2>
                    <p className="text-gray-600">{tierConfig.name} Trader</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <FiX className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile & Basic Info */}
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      {normalizedTrader.profilePicture ? (
                        <img
                          src={normalizedTrader.profilePicture}
                          alt={normalizedTrader.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                          <span className="text-white text-4xl font-bold">
                            {normalizedTrader.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mt-4">{normalizedTrader.name}</h3>
                    <p className="text-gray-600">{normalizedTrader.email}</p>
                  </div>


                  {/* Trading Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiTrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Trading Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Min Interest Rate</p>
                        <p className="text-lg font-semibold text-green-600">{normalizedTrader.minInterestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max Interest Rate</p>
                        <p className="text-lg font-semibold text-green-600">{normalizedTrader.maxInterestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Min Investment</p>
                        <p className="text-lg font-semibold text-blue-600">${normalizedTrader.minInvestment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max Investment</p>
                        <p className="text-lg font-semibold text-purple-600">${normalizedTrader.maxInvestment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Experience & Description */}
                <div className="space-y-6">
                  {/* Experience */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiBriefcase className="h-5 w-5 mr-2 text-indigo-600" />
                      Experience
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Years of Experience</span>
                        <span className="font-semibold text-gray-900">{normalizedTrader.experience} years</span>
                      </div>
                    </div>
                  </div>


                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="h-5 w-5 mr-2 text-gray-600" />
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {normalizedTrader.description}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TraderViewModal;
