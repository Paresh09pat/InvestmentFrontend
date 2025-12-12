// Investment Withdrawal page
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiInfo
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/forms/Input';
import { useAuth } from '../context/AuthContext';
import { USER_VERIFICATION_STATUS } from '../utils/constants';
import axios from 'axios';
import { VITE_APP_API_URL } from '../utils/constants';

const InvestmentWithdrawal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    reason: ''
  });

  const [userInvestment, setUserInvestment] = useState({
    totalInvested: 0,
    currentValue: 0,
    lockPeriod: 12, // 12 months
    investmentDate: '',
    maturityDate: '',
    isLocked: true,
    plans: []
  });

  const [selectedPlan, setSelectedPlan] = useState(null);


  useEffect(() => {
    if (user?.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
      navigate('/profile');
    }
    
    // Pre-populate wallet address if available
    if (user?.trustWalletAddress) {
      setFormData(prev => ({
        ...prev,
        walletAddress: user.trustWalletAddress
      }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation for amount field
    if (name === 'amount' && value) {
      const amount = parseFloat(value);
      const newErrors = { ...errors };
      
      if (amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      } else if (amount < 10) {
        newErrors.amount = 'Minimum withdrawal amount is $1,000';
      } else if (selectedPlan && amount > selectedPlan.currentValue) {
        newErrors.amount = `Amount exceeds selected plan current value: $${selectedPlan.currentValue.toLocaleString()}`;
      } else {
        delete newErrors.amount;
      }
      
      setErrors(newErrors);
    } else if (name === 'walletAddress' && value) {
      const newErrors = { ...errors };
      if (value.length < 10) {
        newErrors.walletAddress = 'Please enter a valid wallet address';
      } else {
        delete newErrors.walletAddress;
      }
      setErrors(newErrors);
    } else if (name === 'reason' && value) {
      const newErrors = { ...errors };
      if (value.length < 10) {
        newErrors.reason = 'Please provide a detailed reason (minimum 10 characters)';
      } else {
        delete newErrors.reason;
      }
      setErrors(newErrors);
    } else if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedPlan) {
      newErrors.plan = 'Please select a plan to withdraw from';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) < 10) {
      newErrors.amount = 'Minimum withdrawal amount is $10';
    } else if (selectedPlan && parseFloat(formData.amount) > selectedPlan.currentValue) {
      newErrors.amount = `Amount exceeds selected plan current value: $${selectedPlan.currentValue.toLocaleString()}`;
    }

    if (!formData.walletAddress) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (formData.walletAddress.length < 10) {
      newErrors.walletAddress = 'Please enter a valid wallet address';
    }

    if (!formData.reason) {
      newErrors.reason = 'Reason for withdrawal is required';
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'Please provide a detailed reason (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const requestData = {
        amount: parseFloat(formData.amount),
        plan: selectedPlan.name,
        walletAddress: formData.walletAddress,
        reason: formData.reason
      };

      const response = await axios.post(`${VITE_APP_API_URL}/api/investment/create`, requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Store withdrawal data for success page
        const withdrawalResult = {
          amount: parseFloat(formData.amount),
          plan: selectedPlan.name,
          walletAddress: formData.walletAddress,
          reason: formData.reason,
          withdrawalDate: new Date().toISOString(),
          timestamp: Date.now()
        };
        
        localStorage.setItem('withdrawalResult', JSON.stringify(withdrawalResult));
        
        setFormData({
          amount: '',
          walletAddress: '',
          reason: ''
        });
        
        navigate('/withdrawal-success');
      } else {
        setErrors({ general: response.data.message || 'Failed to submit withdrawal request' });
      }
      
    } catch (error) {
      console.error('Investment withdrawal error:', error);
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.status === 400) {
        setErrors({ general: 'Invalid request data. Please check your inputs.' });
      } else if (error.response?.status === 403) {
        setErrors({ general: 'You must be verified to create withdrawal requests.' });
      } else if (error.response?.status === 404) {
        setErrors({ general: 'User not found. Please try logging in again.' });
      } else {
        setErrors({ general: 'Failed to submit withdrawal request. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateDaysRemaining = () => {
    if (!userInvestment.maturityDate) return 0;
    const today = new Date();
    const maturity = new Date(userInvestment.maturityDate);
    const diffTime = maturity - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const fetchInvestmentData = async () => {
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/api/auth/portfolio`, {
        withCredentials: true
      });

      console.log("Investment withdrawal portfolio:", response?.data?.portfolio);
      
      const portfolio = response?.data?.portfolio;
      setUserInvestment({
        totalInvested: portfolio?.totalInvested || 0,
        currentValue: portfolio?.currentValue || 0,
        lockPeriod: 12,
        investmentDate: portfolio?.createdAt || new Date().toISOString(),
        maturityDate: portfolio?.maturityDate || new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        isLocked: true,
        plans: portfolio?.plans || []
      });
      
    } catch (err) {
      console.log("Error fetching investment data:", err);
      // Set dummy data for development
      setUserInvestment({
        totalInvested: 50000,
        currentValue: 55000,
        lockPeriod: 12,
        investmentDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        maturityDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        isLocked: true,
        plans: [
          {
            name: 'platinum',
            invested: 50000,
            currentValue: 55000,
            returns: 5000,
            returnRate: { min: 10, max: 15 }
          }
        ]
      });
    }
  };

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  // Validate amount when selected plan changes
  useEffect(() => {
    if (selectedPlan && formData.amount) {
      const amount = parseFloat(formData.amount);
      const newErrors = { ...errors };
      
      if (amount > selectedPlan.currentValue) {
        newErrors.amount = `Amount exceeds selected plan current value: $${selectedPlan.currentValue.toLocaleString()}`;
      } else if (amount >= 1000 && amount <= selectedPlan.currentValue) {
        delete newErrors.amount;
      }
      
      setErrors(newErrors);
    }
  }, [selectedPlan, formData.amount, errors]);

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/withdrawal')}
              icon={<FiArrowLeft />}
              className="mb-4"
            >
              Back to Withdrawal
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Investment Withdrawal Request
            </h1>
            <p className="text-gray-600">
              Request to withdraw your total investment amount before maturity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="animate-fade-in">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                    <FiDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Investment Withdrawal Form
                  </h2>
                </div>

                {/* Lock Period Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiAlertCircle className="text-yellow-600" size={20} />
                    <h4 className="font-medium text-yellow-900">Early Withdrawal Notice</h4>
                  </div>
                  <p className="text-sm text-yellow-800 mb-2">
                    You are requesting to withdraw your investment before the 12-month lock period expires.
                  </p>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>• Days remaining in lock period: <strong>{daysRemaining} days</strong></p>
                    <p>• Early withdrawal may incur penalties</p>
                    <p>• Processing time: 3-5 business days</p>
                    <p>• Admin approval required</p>
                  </div>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Investment Plan*
                    </label>
                    <div className="space-y-3">
                      {userInvestment.plans?.filter(plan => plan.invested > 0).map((plan) => (
                        <div
                          key={plan._id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedPlan?._id === plan._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                selectedPlan?._id === plan._id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedPlan?._id === plan._id && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 capitalize">
                                  {plan.name} Plan
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {plan.returnRate?.min && plan.returnRate?.max 
                                    ? `${plan.returnRate.min}% - ${plan.returnRate.max}% returns`
                                    : 'No returns specified'
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(plan.invested)}
                              </div>
                              <div className="text-sm text-gray-600">Invested</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.plan && (
                      <p className="text-red-600 text-sm mt-1">{errors.plan}</p>
                    )}
                  </div>

                  {/* Selected Plan Details */}
                  {selectedPlan && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiInfo className="text-blue-600" size={20} />
                        <h4 className="font-medium text-blue-900">Selected Plan Details</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Plan:</span>
                          <span className="font-semibold text-blue-900 ml-2 capitalize">
                            {selectedPlan.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Invested Amount:</span>
                          <span className="font-semibold text-blue-900 ml-2">
                            {formatCurrency(selectedPlan.invested)}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Current Value:</span>
                          <span className="font-semibold text-blue-900 ml-2">
                            {formatCurrency(selectedPlan.currentValue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Returns:</span>
                          <span className="font-semibold text-green-600 ml-2">
                            {formatCurrency(selectedPlan.returns)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Withdraw*
                      {selectedPlan && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {formatCurrency(selectedPlan.currentValue)})
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder={selectedPlan ? `Max: ${formatCurrency(selectedPlan.currentValue)}` : "Enter amount to withdraw"}
                        className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.amount ? 'border-red-300' : 'border-gray-300'
                        } ${!selectedPlan ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        required
                        min="1000"
                        max={selectedPlan ? selectedPlan.currentValue : userInvestment.currentValue}
                        disabled={!selectedPlan}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.amount && (
                      <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trust Wallet Address*
                    </label>
                    <div className="relative">
                      <textarea
                        name="walletAddress"
                        value={formData.walletAddress}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.walletAddress ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your registered wallet address"
                        rows={3}
                        required
                      />
                    </div>
                    {errors.walletAddress && (
                      <p className="text-red-600 text-sm mt-1">{errors.walletAddress}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.trustWalletAddress ? 
                        'Pre-filled from your profile. This must match your registered wallet address.' :
                        'This must match your registered wallet address in your profile'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Early Withdrawal*
                    </label>
                    <div className="relative">
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.reason ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Please provide a detailed reason for withdrawing your investment early (minimum 10 characters)"
                        rows={4}
                        required
                      />
                    </div>
                    {errors.reason && (
                      <p className="text-red-600 text-sm mt-1">{errors.reason}</p>
                    )}
                  </div>



                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiShield className="text-red-600" size={20} />
                      <h4 className="font-medium text-red-900">Important Notice</h4>
                    </div>
                    <p className="text-sm text-red-800 mb-2">
                      Early withdrawal requests are subject to admin approval and may incur penalties.
                    </p>
                    <ul className="text-xs text-red-700 space-y-1">
                      <li>• Your request will be reviewed within 24-48 hours</li>
                      <li>• You may be contacted for additional verification</li>
                      <li>• Penalties may apply for early withdrawal</li>
                      <li>• Processing time: 3-5 business days after approval</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                    size="large"
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    {loading ? 'Submitting Request...' : 'Submit Withdrawal Request'}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Investment Summary */}
              <Card className="animate-slide-up">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Investment Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Invested</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(userInvestment.totalInvested)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Value</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(userInvestment.currentValue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lock Period</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {userInvestment.lockPeriod} months
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days Remaining</span>
                    <span className={`text-lg font-semibold ${daysRemaining > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysRemaining} days
                    </span>
                  </div>
                </div>
              </Card>

              {/* Individual Plans */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Investment Plans
                </h3>
                
                <div className="space-y-3">
                  {userInvestment.plans?.filter(plan => plan.invested > 0).map((plan) => (
                    <div key={plan._id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {plan.name} Plan
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedPlan?._id === plan._id 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {selectedPlan?._id === plan._id ? 'Selected' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invested:</span>
                          <span className="font-medium">{formatCurrency(plan.invested)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Value:</span>
                          <span className="font-medium text-green-600">{formatCurrency(plan.currentValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Returns:</span>
                          <span className="font-medium text-green-600">{formatCurrency(plan.returns)}</span>
                        </div>
                        {plan.returnRate?.min && plan.returnRate?.max && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Return Rate:</span>
                            <span className="font-medium text-blue-600">
                              {plan.returnRate.min}% - {plan.returnRate.max}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>



              {/* Security Tips */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center space-x-2 mb-4">
                  <FiShield className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Security Tips
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                    <p className="text-sm text-gray-700">
                      Double-check your wallet address before submission
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                    <p className="text-sm text-gray-700">
                      Keep your withdrawal request details confidential
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentWithdrawal;
