// InvestmentForm page
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiTrendingUp, FiUpload, FiCreditCard, FiArrowLeft, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/forms/Input';
import FileUpload from '../components/forms/FileUpload';
import MembershipCard from '../components/MembershipCard';
import TraderSelection from '../components/TraderSelection';
import { toast } from 'react-toastify';
import axios from 'axios';
import { VITE_APP_API_URL } from '../utils/constants';

const InvestmentForm = () => {
  const { qr } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    walletTxId: '',
    transactionImage: null
  });

  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [currentStep, setCurrentStep] = useState('membership'); 
  const [plans, setPlans] = useState([]);
  const [traders, setTraders] = useState([]);
  const [isLoadingTraders, setIsLoadingTraders] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation for amount field with debouncing
    if (name === 'amount' && value) {
      // Clear existing timeout
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
      
      // Set new timeout for validation
      const timeout = setTimeout(() => {
        const amountError = validateAmount(value);
        setErrors(prev => ({
          ...prev,
          [name]: amountError || ''
        }));
      }, 500); // 500ms delay
      
      setValidationTimeout(timeout);
    } else if (name === 'walletTxId' && value) {
      // Real-time validation for walletTxId
      const walletTxIdError = validateWalletTxId(value);
      setErrors(prev => ({
        ...prev,
        [name]: walletTxIdError || ''
      }));
    } else if (errors[name]) {
      // Clear error when user starts typing other fields
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmountBlur = (e) => {
    const { value } = e.target;
    if (value) {
      const amountError = validateAmount(value);
      setErrors(prev => ({
        ...prev,
        amount: amountError || ''
      }));
    }
  };

  const getTraders = async (tier) => {
    console.log("tier>>", tier);
    setIsLoadingTraders(true);
    try {
      const res = await axios.get(`${VITE_APP_API_URL}/api/auth/traders?search=${tier}`);
      console.log("res>>", res.data.traders);
      setTraders(res.data.traders);
    }
    catch (err) {
      console.log(err);
      toast.error('Failed to fetch traders');
    }
    finally {
      setIsLoadingTraders(false);
    }
  }

  const handleMembershipSelect = (tier, planData) => {
    console.log("tier>>", tier);
    console.log("planData>>", planData);
    setSelectedMembership(tier);
    setSelectedPlan(planData);
    setCurrentStep('trader');
    setSelectedTrader(null);

    getTraders(tier);

    // Auto-scroll to trader selection section
    setTimeout(() => {
      const traderSection = document.getElementById('trader-selection');
      if (traderSection) {
        traderSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleTraderSelect = (trader) => {
    setSelectedTrader(trader);
  };

  const handleContinueToForm = () => {
    if (selectedTrader) {
      setCurrentStep('form');
      // Auto-scroll to form section
      setTimeout(() => {
        const formSection = document.getElementById('investment-form');
        if (formSection) {
          formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  const handleBackToMembership = () => {
    setCurrentStep('membership');
    setSelectedMembership(null);
    setSelectedPlan(null);
    setSelectedTrader(null);
  };

  const handleBackToTrader = () => {
    setCurrentStep('trader');
    // Auto-scroll to trader selection section
    setTimeout(() => {
      const traderSection = document.getElementById('trader-selection');
      if (traderSection) {
        traderSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleFileUpload = (file) => {
    // Clear previous errors
    if (errors.transactionImage) {
      setErrors(prev => ({
        ...prev,
        transactionImage: ''
      }));
    }

    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        transactionImage: 'Please upload an image file (JPG, PNG, GIF, etc.)'
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        transactionImage: 'File size must be less than 5MB'
      }));
      return;
    }

    // Validate file dimensions (optional - for very large images)
    if (file && file.size > 2 * 1024 * 1024) {
      // For files larger than 2MB, show a warning but allow
      console.warn('Large file uploaded:', file.size / 1024 / 1024, 'MB');
    }

    setFormData(prev => ({
      ...prev,
      transactionImage: file
    }));
  };

  const calculateReturns = () => {
    if (!formData.amount) return null;

    const amount = parseFloat(formData.amount);
    // Default return rate of 10% per annum
    const returnRate = 0.10;
    const expectedReturns = amount * returnRate;
    const totalValue = amount + expectedReturns;

    return {
      principal: amount,
      returns: expectedReturns,
      total: totalValue
    };
  };

  const validatePaymentFields = () => {
    const newErrors = {};

    if (!formData.walletTxId.trim()) {
      newErrors.walletTxId = 'Transaction ID is required';
    } else if (formData.walletTxId.trim().length < 10) {
      newErrors.walletTxId = 'Transaction ID must be at least 10 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.walletTxId.trim())) {
      newErrors.walletTxId = 'Transaction ID can only contain letters and numbers';
    }

    if (!formData.transactionImage) {
      newErrors.transactionImage = 'Payment screenshot is required';
    }

    return newErrors;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate amount
    const amountError = validateAmount(formData.amount);
    if (amountError) {
      newErrors.amount = amountError;
    }

    // Validate required fields
    if (!selectedPlan) {
      newErrors.plan = 'Please select a plan';
    }

    if (!selectedTrader) {
      newErrors.trader = 'Please select a trader';
    }

    // If payment fields are shown, validate them too
    if (showPaymentFields) {
      const paymentErrors = validatePaymentFields();
      Object.assign(newErrors, paymentErrors);
    }

    return newErrors;
  };

  const getMembershipLimits = () => {
    if (selectedPlan) {
      return {
        min: selectedPlan.minInvestment || 1000,
        max: selectedPlan.maxInvestment || 1000000
      };
    }
    // Fallback to default limits if no plan is selected
    return { min: 1000, max: 1000000 };
  };

  const findSuitablePlan = (amount) => {
    // Find plans that can accommodate this amount
    const suitablePlans = plans.filter(plan =>
      amount >= plan.minInvestment && amount <= plan.maxInvestment
    );

    if (suitablePlans.length > 0) {
      return suitablePlans[0]; // Return the first suitable plan
    }

    // If no plan can accommodate, find the closest one
    const sortedPlans = plans.sort((a, b) => a.minInvestment - b.minInvestment);

    if (amount < sortedPlans[0].minInvestment) {
      return sortedPlans[0]; // Suggest the lowest tier
    }

    if (amount > sortedPlans[sortedPlans.length - 1].maxInvestment) {
      return sortedPlans[sortedPlans.length - 1]; // Suggest the highest tier
    }

    return null;
  };

  const getAllPlans = async () => {
    try {
      const res = await axios.get(`${VITE_APP_API_URL}/api/auth/plans`, {
        withCredentials: true
      });
      setPlans(res.data.plans)
    }
    catch (err) {
      console.log(err);
      toast.error(err.message)
    }
  }

  useEffect(() => {
    getAllPlans()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  const validateWalletTxId = (walletTxId) => {
    if (!walletTxId.trim()) {
      return 'Transaction ID is required';
    } else if (walletTxId.trim().length < 10) {
      return 'Transaction ID must be at least 10 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(walletTxId.trim())) {
      return 'Transaction ID can only contain letters and numbers';
    }
    return null;
  };

  const validateAmount = (amount) => {
    const limits = getMembershipLimits();
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount)) {
      return 'Please enter a valid amount';
    }

    if (numAmount < limits.min) {
      const suitablePlan = findSuitablePlan(numAmount);
      if (suitablePlan) {
        return `Minimum investment for ${selectedMembership} tier is $${limits.min.toLocaleString()}. Consider switching to ${suitablePlan.name} plan ($${suitablePlan.minInvestment.toLocaleString()} - $${suitablePlan.maxInvestment.toLocaleString()})`;
      }
      return `Minimum investment for ${selectedMembership} tier is $${limits.min.toLocaleString()}`;
    }

    if (numAmount > limits.max) {
      const suitablePlan = findSuitablePlan(numAmount);
      if (suitablePlan) {
        return `Maximum investment for ${selectedMembership} tier is $${limits.max.toLocaleString()}. Consider upgrading to ${suitablePlan.name} plan ($${suitablePlan.minInvestment.toLocaleString()} - $${suitablePlan.maxInvestment.toLocaleString()})`;
      }
      return `Maximum investment for ${selectedMembership} tier is $${limits.max.toLocaleString()}`;
    }

    return null;
  };

  const handleProceedToInvestment = (e) => {
    e.preventDefault();

    // Validate form before proceeding
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before proceeding');
      return;
    }

    // Show payment fields
    setShowPaymentFields(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    createInvestReq();
  };



  const createInvestReq = async () => {
    // Validate form before submission
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      console.log("trader",selectedTrader)
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('walletTxId', formData.walletTxId);
      formDataToSend.append('type', 'deposit');
      formDataToSend.append('plan', selectedPlan.name);
      formDataToSend.append('trader', selectedTrader.id);
      
      // Add file if exists
      if (formData.transactionImage) {
        formDataToSend.append('transactionImage', formData.transactionImage);
      }

      const res = await axios.post(`${VITE_APP_API_URL}/api/transaction/create`, formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Investment request created successfully!');
        // Store the result for success page
        localStorage.setItem('investmentResult', JSON.stringify({
          ...formData,
          plan: selectedPlan,
          trader: selectedTrader,
          investmentDate: new Date().toISOString().split('T')[0],
          timestamp: Date.now()
        }));
        navigate('/investment-success');
      } else {
        toast.error(res.data.message || 'Failed to create investment request');
      }
    } catch (err) {
      console.error('Investment request error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create investment request';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const returns = calculateReturns();




  const renderMembershipSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Investment Tier
        </h1>
        <p className="text-gray-600">
          Select a membership tier that matches your investment goals and risk appetite
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <MembershipCard
            key={plan._id}
            tier={plan.name}
            onSelect={handleMembershipSelect}
            isSelected={selectedMembership === plan.name}
            planData={plan}
          />
        ))}
        {/* <MembershipCard
          tier="silver"
          onSelect={handleMembershipSelect}
          isSelected={selectedMembership === 'silver'}
        />
        <MembershipCard
          tier="gold"
          onSelect={handleMembershipSelect}
          isSelected={selectedMembership === 'gold'}
        />
        <MembershipCard
          tier="platinum"
          onSelect={handleMembershipSelect}
          isSelected={selectedMembership === 'platinum'}
        /> */}
      </div>

      {/* Trader Selection Section */}
      {selectedMembership && (
        <div id="trader-selection">
          <TraderSelection
            membershipTier={selectedMembership}
            onTraderSelect={handleTraderSelect}
            selectedTrader={selectedTrader}
            traders={traders}
            isLoading={isLoadingTraders}
          />
        </div>
      )}
    </div>
  );

  const renderInvestmentForm = () => {
    const limits = getMembershipLimits();

    return (
      <div id="investment-form" className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToTrader}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Investment Details
            </h1>
            <p className="text-gray-600">
              {selectedMembership?.charAt(0).toUpperCase() + selectedMembership?.slice(1)} tier with {selectedTrader?.name}
            </p>
          </div>
        </div>

        {/* Selected Trader Info */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              {selectedTrader?.profilePic ? (
                <img src={selectedTrader.profilePic} alt={selectedTrader.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold">{selectedTrader?.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedTrader?.name}</h3>
              <p className="text-sm text-gray-600">{selectedTrader?.experience} • {selectedTrader?.returnRate} return rate</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={showPaymentFields ? handleSubmitPayment : handleProceedToInvestment} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <Input
                    label="Investment Amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    onBlur={handleAmountBlur}
                    placeholder={`Enter amount (${limits.min.toLocaleString()} - ${limits.max.toLocaleString()})`}
                    icon="$"
                    required
                    readOnly={showPaymentFields}
                    className={showPaymentFields ? 'bg-gray-100' : ''}
                    error={errors.amount}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Investment range: ${limits.min.toLocaleString()} - ${limits.max.toLocaleString()}
                  </p>

                  {/* Plan Suggestion */}
                  {errors.amount && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">
                            💡 Plan Suggestion
                          </h4>
                          <p className="text-sm text-blue-700 mb-3">
                            {errors.amount}
                          </p>
                          {formData.amount && !isNaN(parseFloat(formData.amount)) && (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const suitablePlan = findSuitablePlan(parseFloat(formData.amount));
                                  if (suitablePlan) {
                                    handleMembershipSelect(suitablePlan.name, suitablePlan);
                                  }
                                }}
                                className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Switch to Suggested Plan
                              </button>

                              {/* Quick Plan Comparison */}
                              <div className="mt-3">
                                <p className="text-xs text-blue-600 mb-2">Available plans for your amount:</p>
                                <div className="space-y-1">
                                  {plans.map(plan => {
                                    const isSuitable = parseFloat(formData.amount) >= plan.minInvestment && parseFloat(formData.amount) <= plan.maxInvestment;
                                    const isCurrent = plan.name === selectedMembership;

                                    return (
                                      <div key={plan._id} className={`text-xs p-2 rounded border ${isSuitable
                                          ? 'bg-green-50 border-green-200 text-green-800'
                                          : isCurrent
                                            ? 'bg-gray-50 border-gray-200 text-gray-600'
                                            : 'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}>
                                        <span className="font-medium">{plan.name}</span>: ${plan.minInvestment.toLocaleString()} - ${plan.maxInvestment.toLocaleString()}
                                        {isSuitable && <span className="ml-2 text-green-600">✓ Perfect fit</span>}
                                        {isCurrent && !isSuitable && <span className="ml-2 text-gray-500">Current plan</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Verification Fields */}
                {showPaymentFields && (
                  <div className="space-y-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <FiCreditCard className="text-blue-600" size={20} />
                      <h3 className="text-lg font-semibold text-blue-800">
                        Payment Verification
                      </h3>
                    </div>

                    {/* QR Code Scanner Placeholder */}
                    <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                           <img src={qr} alt="QR Code" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-gray-500">Admin will add scanner here</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Scan the QR code to make payment
                      </p>
                    </div>

                    {/* Transaction ID */}
                    <Input
                      label="Transaction ID"
                      type="text"
                      name="walletTxId"
                      value={formData.walletTxId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID from your payment"
                      icon={<FiCreditCard />}
                      error={errors.walletTxId}
                      required
                    />

                    {/* Payment Screenshot Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Screenshot *
                      </label>
                      <FileUpload
                        onFileChange={handleFileUpload}
                        accept="image/*"
                        placeholder="Upload payment screenshot (JPG, PNG, etc.)"
                        error={errors.transactionImage}
                      />
                      {errors.transactionImage && (
                        <p className="mt-1 text-sm text-red-600">{errors.transactionImage}</p>
                      )}
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Scan the QR code to make payment</li>
                        <li>• Save the transaction ID from your payment app</li>
                        <li>• Take a screenshot of the payment confirmation</li>
                        <li>• Upload both details to complete your investment</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="large"
                  fullWidth
                  disabled={isSubmitting || !formData.amount || validateAmount(formData.amount) !== null}
                  icon={showPaymentFields ? <FiCreditCard /> : <FiTrendingUp />}
                >
                  {isSubmitting 
                    ? 'Processing...' 
                    : showPaymentFields 
                      ? 'Complete Investment' 
                      : 'Proceed to Investment'
                  }
                </Button>
              </form>
            </Card>
          </div>

          {/* Investment Summary */}
          <div>
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Investment Summary
              </h3>

              {returns ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Amount</span>
                    <span className="font-medium">{formatCurrency(returns.principal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Returns ({selectedTrader?.returnRate || '10%'} p.a.)</span>
                    <span className="font-medium text-green-600">{formatCurrency(returns.returns)}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between">
                    <span className="font-semibold">Total Maturity Value</span>
                    <span className="font-bold text-blue-600">{formatCurrency(returns.total)}</span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🎯 <strong>ROI:</strong> {selectedTrader?.returnRate || '10%'} per annum
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      ⏰ <strong>Duration:</strong> 12 months
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      👤 <strong>Trader:</strong> {selectedTrader?.name}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      📋 <strong>Plan:</strong> {selectedPlan?.name} (${limits.min.toLocaleString()} - ${limits.max.toLocaleString()})
                    </p>
                  </div>

                  {showPaymentFields && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        ✅ <strong>Payment verification required</strong>
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Please complete the payment details above
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiTrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">
                    Enter amount to see investment summary
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Listen for trader selection event
  useEffect(() => {
    const handleTraderSelected = () => {
      handleContinueToForm();
    };

    window.addEventListener('traderSelected', handleTraderSelected);
    return () => window.removeEventListener('traderSelected', handleTraderSelected);
  }, [selectedTrader]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {(currentStep === 'membership' || currentStep === 'trader') && renderMembershipSelection()}
          {currentStep === 'form' && renderInvestmentForm()}
        </div>
      </div>
    </div>
  );
};

export default InvestmentForm;

