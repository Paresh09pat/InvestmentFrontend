// Withdrawal page
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiInfo,
  FiShield
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/forms/Input';
import { useAuth } from '../context/AuthContext';
import { USER_VERIFICATION_STATUS, VITE_APP_API_URL } from '../utils/constants';

const Withdrawal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalMethod: 'bank',
    bankAccount: '',
    upiId: '',
    notes: '',
    address: ''
  });

  const [userBalance, setUserBalance] = useState({
    totalBalance: "",
    availableBalance: '',
    plans: []
  });

  const [selectedPlan, setSelectedPlan] = useState(null);

 



  useEffect(() => {
    if (user?.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedPlan) {
      newErrors.plan = 'Please select a plan to withdraw returns from';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } 
    // else if (parseFloat(formData.amount) < 100) {
    //   newErrors.amount = 'Minimum withdrawal amount is $100';
    // }
     else if (selectedPlan && selectedPlan.returns <= 0) {
      newErrors.amount = 'No positive returns available for withdrawal from this plan';
    } else if (selectedPlan && parseFloat(formData.amount) > selectedPlan.returns) {
      newErrors.amount = `Amount exceeds available returns: ${formatCurrency(selectedPlan.returns)}`;
    }

    if (!formData.address) {
      newErrors.address = 'Withdrawal address is required';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Please enter a valid wallet address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiClock className="text-blue-500" />;
      default:
        return <FiAlertCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const withdrawal = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${VITE_APP_API_URL}/api/transaction/create`, {
        amount: parseFloat(formData.amount),
        plan: selectedPlan.name,
        type: 'withdrawal',
        walletAddress: formData.address,
        trader: user?.id || user?._id
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.data.success){
        toast.success('Withdrawal request submitted successfully! You will receive confirmation via email.', {
          position: "top-right",
          autoClose: 5000,
        });
        setFormData({
          amount: '',
          withdrawalMethod: 'bank',
          bankAccount: '',
          upiId: '',
          notes: '',
          address: ''
        });
        setSelectedPlan(null);
        navigate('/dashboard');
      } else {
        const errorMessage = response.data.message || 'Failed to submit withdrawal request';
        setErrors({ general: errorMessage });
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch(err) {
      console.log("Error withdrawing:", err);
      
      let errorMessage = 'Failed to submit withdrawal request. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = err.response.data.errors;
        setErrors(serverErrors);
        errorMessage = 'Please fix the form errors';
      } else if (err.response?.status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Cannot connect to server. Please check your connection.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      }
      
      setErrors({ general: errorMessage });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }


  const fetchPortfolio = async()=>{
    try{
      const response = await axios.get(`${VITE_APP_API_URL}/api/auth/portfolio`, {
        withCredentials: true
      });

      console.log("Withdrawal portfolio:", response?.data?.portfolio);
      
      const portfolio = response?.data?.portfolio;
      setUserBalance({
        totalBalance: portfolio?.totalInvested || 0,
        availableBalance: portfolio?.totalReturns || 0,
        plans: portfolio?.plans || []
      });
      
    }
    catch(err){
      console.log("Error fetching portfolio:", err);
      
      let errorMessage = 'Failed to load portfolio data';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Cannot connect to server. Please check your connection.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  useEffect(()=>{
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              icon={<FiArrowLeft />}
              className="mb-4"
            >
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Withdraw Funds
            </h1>
            <p className="text-gray-600">
              Withdraw your investment returns to your preferred payment method
            </p>
          </div>

          {/* Investment Withdrawal Button */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <div className="flex  justify-between flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-lg">
                    <FiDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Need to Withdraw Your Investment?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Request to withdraw your total investment amount before maturity (12-month lock period)
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/investment-withdrawal')}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  size="large"
                >
                  Withdraw Investment Amount
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="animate-fade-in">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                    <FiDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Request Withdrawal
                  </h2>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={withdrawal} className="space-y-6">
                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Plan for Returns Withdrawal*
                    </label>
                    <div className="space-y-3">
                      {userBalance.plans?.filter(plan => plan.returns !== 0).map((plan) => (
                        <div
                          key={plan._id}
                          className={`border rounded-lg p-4 transition-all duration-200 ${
                            plan.returns <= 0 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                              : selectedPlan?._id === plan._id
                                ? 'border-green-500 bg-green-50 cursor-pointer'
                                : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                          }`}
                          onClick={() => plan.returns > 0 && setSelectedPlan(plan)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                plan.returns <= 0
                                  ? 'border-gray-300 bg-gray-200'
                                  : selectedPlan?._id === plan._id
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                              }`}>
                                {selectedPlan?._id === plan._id && plan.returns > 0 && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 capitalize">
                                  {plan.name} Plan
                                </h4>
                                <p className={`text-sm ${
                                  plan.returns < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  Available Returns: {formatCurrency(plan.returns)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${
                                plan.returns < 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {formatCurrency(plan.returns)}
                              </div>
                              <div className="text-sm text-gray-600">Returns</div>
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
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiInfo className="text-green-600" size={20} />
                        <h4 className="font-medium text-green-900">Selected Plan Returns</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Plan:</span>
                          <span className="font-semibold text-green-900 ml-2 capitalize">
                            {selectedPlan.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-700">Available Returns:</span>
                          <span className={`font-semibold ml-2 ${
                            selectedPlan.returns < 0 ? 'text-red-900' : 'text-green-900'
                          }`}>
                            {formatCurrency(selectedPlan.returns)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-700">Invested Amount:</span>
                          <span className="font-semibold text-green-900 ml-2">
                            {formatCurrency(selectedPlan.invested)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-700">Current Value:</span>
                          <span className="font-semibold text-green-900 ml-2">
                            {formatCurrency(selectedPlan.currentValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                          Withdrawal Address*
                        </label>
                        <div className="relative">
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              errors.address ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter wallet address"
                            rows={4}
                            required
                          />
                    </div>
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <Input
                    label="Withdrawal Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder={selectedPlan ? `Max: ${formatCurrency(selectedPlan.returns)}` : "Enter amount to withdraw"}
                    icon={<FiDollarSign />}
                    error={errors.amount}
                    required
                    min="100"
                    max={selectedPlan ? selectedPlan.returns : userBalance.availableBalance}
                    disabled={!selectedPlan}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiShield className="text-blue-600" size={20} />
                      <h4 className="font-medium text-blue-900">Security Notice</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-2">
                      All withdrawals are secured with 2FA verification and require admin approval.
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Withdrawals are processed within 24-48 hours</li>
                      <li>• A small processing fee may apply</li>
                      <li>• You'll receive email confirmation</li>
                    </ul>
                  </div>

                  <Button
                    type="button"
                    onClick={withdrawal}
                    fullWidth
                    loading={loading}
                    disabled={loading}
                    size="large"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? 'Processing...' : 'Request Withdrawal'}
                  </Button> 
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Balance Info */}
              <Card className="animate-slide-up">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Balance
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Invested</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(userBalance.totalBalance)}  
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Returns Available</span>
                    <span className={`text-lg font-semibold $ {
                      userBalance.availableBalance < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(userBalance.availableBalance)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Individual Plans Returns */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Plan Returns
                </h3>
                
                <div className="space-y-3">
                  {userBalance.plans?.filter(plan => plan.returns !== 0).map((plan) => (
                    <div key={plan._id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {plan.name} Plan
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedPlan?._id === plan._id 
                            ? 'bg-green-100 text-green-800' 
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
                          <span className={`font-medium ${
                            plan.returns < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(plan.returns)}
                          </span>
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
                  
                  {userBalance.plans?.filter(plan => plan.returns !== 0).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No returns available for withdrawal</p>
                    </div>
                  )}
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
                      Always verify wallet address before withdrawal
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                    <p className="text-sm text-gray-700">
                      Keep your withdrawal PIN secure
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                    <p className="text-sm text-gray-700">
                      Enable 2FA for additional security
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

export default Withdrawal;
