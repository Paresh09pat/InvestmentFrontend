import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiZap, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_VERIFICATION_STATUS } from '../utils/constants';

const MembershipTiers = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const membershipData = {
    silver: {
      name: 'Silver',
      icon: FiAward,
      color: 'from-gray-500 to-gray-700',
      hoverColor: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      minAmount: 10000,
      maxAmount: 50000,
      features: [
        'Basic trading strategies',
        'Email support',
        'Monthly reports',
        'Standard risk management',
        'Community access'
      ],
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else if (user?.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
      navigate('/profile');
    } else {
      navigate('/invest');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Investment Tier</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select the perfect investment plan that matches your financial goals and risk tolerance. 
            Each tier offers unique benefits and returns tailored to your investment needs.
          </p>
        </motion.div>

        {/* Membership Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {Object.entries(membershipData).map(([tier, data]) => {
            const IconComponent = data.icon;
            return (
              <motion.div
                key={tier}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative group"
              >
                {/* Popular Badge for Gold */}
                {tier === 'gold' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`
                  relative flex flex-col justify-between h-full cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300
                  bg-white hover:shadow-2xl group-hover:border-opacity-100
                  ${tier === 'gold' ? 'border-yellow-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                `}>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`
                      w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${data.color} 
                      flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300
                    `}>
                      <IconComponent className="text-white text-3xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{data.name}</h3>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {data.returnRate}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Expected returns per annum</p>
                  </div>

                  {/* Investment Range */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">Investment Range</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Minimum</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(data.minAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Maximum</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(data.maxAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">What's Included</h4>
                    <ul className="space-y-3">
                      {data.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <FiCheck className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Duration */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Duration:</span> {data.duration}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className={`
                      w-full py-4 px-6 rounded-xl font-semibold text-white
                      bg-gradient-to-r ${data.color} hover:bg-gradient-to-r ${data.hoverColor}
                      transition-all duration-300 flex items-center justify-center space-x-2
                      shadow-lg hover:shadow-xl cursor-pointer
                    `}
                  >
                    <span>Get Started</span>
                    <FiArrowRight className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Investment Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of investors who trust our platform to grow their wealth. 
              Start with any tier and upgrade as your investment grows.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>Start Investing Today</span>
              <FiArrowRight className="text-sm" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MembershipTiers;
