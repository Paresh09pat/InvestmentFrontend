// InvestmentSuccess page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiHome, FiTrendingUp, FiClock, FiUser, FiMail, FiBell, FiArrowRight } from 'react-icons/fi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const InvestmentSuccess = () => {
  const navigate = useNavigate();
  const [investmentData, setInvestmentData] = useState(null);

  useEffect(() => {
    // Get investment data from localStorage
    const storedResult = localStorage.getItem('investmentResult');
    
    if (storedResult) {
      try {
        const data = JSON.parse(storedResult);
        setInvestmentData(data);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }, []);

  const handleGoToDashboard = () => {
    localStorage.removeItem('investmentResult');
    navigate('/dashboard');
  };

  const handleGoToInvest = () => {
    localStorage.removeItem('investmentResult');
    navigate('/invest');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Main Success Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="text-center p-8 mb-8">
            {/* Success Icon */}
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                 className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
               >
                 {/* Floating Elements */}
                 <motion.div
                   animate={{ 
                     y: [0, -10, 0],
                     rotate: [0, 5, -5, 0]
                   }}
                   transition={{ 
                     duration: 2,
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                   className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
                 />
                 <motion.div
                   animate={{ 
                     y: [0, 10, 0],
                     rotate: [0, -5, 5, 0]
                   }}
                   transition={{ 
                     duration: 2.5,
                     repeat: Infinity,
                     ease: "easeInOut",
                     delay: 0.5
                   }}
                   className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full"
                 />
                 <motion.div
                   animate={{ 
                     y: [0, -8, 0],
                     x: [0, 5, 0]
                   }}
                   transition={{ 
                     duration: 1.8,
                     repeat: Infinity,
                     ease: "easeInOut",
                     delay: 1
                   }}
                   className="absolute -top-1 -left-3 w-2 h-2 bg-blue-400 rounded-full"
                 />
                 
                 <motion.div
                   animate={{ 
                     scale: [1, 1.2, 1],
                     rotate: [0, 360]
                   }}
                   transition={{ 
                     duration: 3,
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                   className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-30"
                 />
                 <FiCheck className="text-white text-3xl relative z-10" />
               </motion.div>

            {/* Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Investment Request Submitted! 🚀
              </motion.h1>

               {/* Status Message */}
               <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 relative overflow-hidden"
               >
                 <motion.div
                   animate={{ 
                     scale: [1, 1.05, 1],
                     opacity: [0.1, 0.2, 0.1]
                   }}
                   transition={{ 
                     duration: 2,
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                   className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200"
                 />
                 <div className="relative z-10">
                   <div className="flex items-center justify-center space-x-3 mb-3">
                     <motion.div
                       animate={{ 
                         scale: [1, 1.1, 1],
                         rotate: [0, 5, -5, 0]
                       }}
                       transition={{ 
                         duration: 1.5,
                         repeat: Infinity,
                         ease: "easeInOut"
                       }}
                     >
                       <FiMail className="text-blue-600 text-xl" />
                     </motion.div>
                     <h3 className="text-xl font-semibold text-blue-800">
                       Request Sent to Admin
                     </h3>
                   </div>
                   <p className="text-blue-700 mb-4">
                     Your investment request has been successfully submitted and sent to our admin team for review.
                   </p>
                   <div className="flex items-center justify-center space-x-2 text-blue-600">
                     <motion.div
                       animate={{ 
                         scale: [1, 1.2, 1]
                       }}
                       transition={{ 
                         duration: 1,
                         repeat: Infinity,
                         ease: "easeInOut"
                       }}
                     >
                       <FiBell className="text-lg" />
                     </motion.div>
                     <span className="font-medium">You will be notified once it's approved within 45 to 60 minutes</span>
                   </div>
                 </div>
               </motion.div>

            {/* Investment Details */}
              {investmentData && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-6 mb-8"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center space-x-2">
                    <FiTrendingUp className="text-blue-600" />
                    <span>Investment Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Investment Amount</span>
                          <span className="font-bold text-lg text-gray-900">
                            {formatCurrency(investmentData.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Plan</span>
                          <span className="font-semibold text-blue-600">
                            {investmentData.plan?.name || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Trader</span>
                          <span className="font-semibold text-green-600">
                            {investmentData.trader?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                  </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Expected Returns</span>
                          <span className="font-bold text-lg text-green-600">
                            {investmentData.trader?.returnRate || '10-15%'}
                          </span>
                  </div>
                  </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Transaction ID</span>
                          <span className="font-mono text-sm text-gray-600">
                            {investmentData.walletTxId || 'N/A'}
                          </span>
                  </div>
                </div>
              </div>
              </div>
                </motion.div>
              )}

              {/* Next Steps */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
              >
                <h4 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center justify-center space-x-2">
                  <FiClock className="text-yellow-600" />
                  <span>What Happens Next?</span>
                </h4>
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <p className="text-yellow-700">Our admin team will review your investment request</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <p className="text-yellow-700">It will take <b>45 to 60 minutes</b> to verify your investment and reflect in your dashboard</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <p className="text-yellow-700">You'll receive a notification once it's approved</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                    <p className="text-yellow-700">Your investment will be processed and trading will begin after approval by admin</p>
                  </div>
                </div>
              </motion.div>

            {/* Action Buttons */}
               <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.7 }}
                 className="flex flex-col sm:flex-row gap-4 justify-center"
               >
                 <motion.div
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                   transition={{ type: "spring", stiffness: 300 }}
                 >
              <Button 
                onClick={handleGoToDashboard}
                size="large"
                     className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                     <FiHome />
                     <span>Go to Dashboard</span>
              </Button>
                 </motion.div>
              
                 <motion.div
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                   transition={{ type: "spring", stiffness: 300 }}
                 >
                   <Button
                     variant="outline"
                     onClick={handleGoToInvest}
                     size="large"
                     className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                   >
                     <FiTrendingUp />
                     <span>Make Another Investment</span>
                   </Button>
                 </motion.div>
               </motion.div>
            </Card>
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center space-x-2">
                  <FiUser className="text-blue-600" />
                  <span>Need Help?</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about your investment request, feel free to contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/help')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <FiArrowRight />
                    <span>Help Center</span>
              </Button>
                </div>
            </div>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSuccess;
