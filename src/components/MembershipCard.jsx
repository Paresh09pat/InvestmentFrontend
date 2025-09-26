import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiZap, FiCheck, FiArrowRight } from 'react-icons/fi';

const MembershipCard = ({ tier, onSelect, isSelected = false, planData }) => {  
    const {_id,name,minInvestment,maxInvestment,features,minReturnRate,maxReturnRate} = planData

  const membershipData = {
    silver: {
      name: name,
      icon: FiAward,
      color: 'from-gray-500 to-gray-700',
      hoverColor: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      minAmount: 10000,
      maxAmount: 50000,
      features: features,
      returnRate: '8-12%',
      duration: '12 months'
    },
    gold: {
      name: 'Gold',
      icon: FiStar,
      color: 'from-yellow-500 to-yellow-700',
      hoverColor: 'from-yellow-600 to-yellow-800',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      minAmount: 50000,
      maxAmount: 200000,
      features: [
        'Advanced trading strategies',
        'Priority support',
        'Weekly reports',
        'Enhanced risk management',
        'Personal account manager'
      ],
      returnRate: '12-18%',
      duration: '12 months'
    },
    platinum: {
      name: 'Platinum',
      icon: FiZap,
      color: 'from-purple-500 to-indigo-600',
      hoverColor: 'from-purple-600 to-indigo-700',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      minAmount: 200000,
      maxAmount: 1000000,
      features: [
        'Premium trading strategies',
        '24/7 dedicated support',
        'Daily reports',
        'Advanced risk management',
        'Personal account manager',
        'Exclusive market insights',
        'Custom portfolio management'
      ],
      returnRate: '18-25%',
      duration: '12 months'
    }
  };

  const data = membershipData[tier];
  const IconComponent = data.icon;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(tier)}
      className={`
        relative flex flex-col justify-between cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300
        ${isSelected 
          ? `${data.borderColor} ${data.bgColor} shadow-xl` 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <FiCheck className="text-white text-sm" />
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`
          w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${data.color} 
          flex items-center justify-center shadow-lg
        `}>
          <IconComponent className="text-white text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {minReturnRate }% - {maxReturnRate}%
        </div>
        <p className="text-sm text-gray-500 mt-1">Expected returns per annum</p>
      </div>  

      {/* Investment Range */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Investment Range</h4>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Minimum</span>
          <span className="font-semibold text-gray-900">{formatCurrency(minInvestment)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Maximum</span>
          <span className="font-semibold text-gray-900">{formatCurrency(maxInvestment)}</span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center text-sm text-gray-600"
            >
              <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Duration */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Duration:</span> {data.duration}
        </p>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold text-white
          bg-gradient-to-r ${data.color} hover:bg-gradient-to-r ${data.hoverColor}
          transition-all duration-300 flex items-center justify-center space-x-2
          shadow-lg hover:shadow-xl cursor-pointer
        `}
      >
        <span>Select {data.name}</span>
        <FiArrowRight className="text-sm" />
      </motion.button>
    </motion.div>
  );
};

export default MembershipCard;
