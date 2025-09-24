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

const InvestmentForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    autoReinvest: false,
    transactionId: '',
    paymentScreenshot: null
  });

  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [currentStep, setCurrentStep] = useState('membership'); // 'membership', 'trader', 'form'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMembershipSelect = (tier) => {
    setSelectedMembership(tier);
    setCurrentStep('trader');
    setSelectedTrader(null); // Reset trader selection when changing membership
    
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
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        paymentScreenshot: 'Please upload an image file (JPG, PNG, GIF, etc.)'
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        paymentScreenshot: 'File size must be less than 5MB'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      paymentScreenshot: file
    }));

    if (errors.paymentScreenshot) {
      setErrors(prev => ({
        ...prev,
        paymentScreenshot: ''
      }));
    }
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

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }

    if (!formData.paymentScreenshot) {
      newErrors.paymentScreenshot = 'Payment screenshot is required';
    }

    return newErrors;
  };

  const getMembershipLimits = (tier) => {
    const limits = {
      silver: { min: 10000, max: 50000 },
      gold: { min: 50000, max: 200000 },
      platinum: { min: 200000, max: 1000000 }
    };
    return limits[tier] || { min: 1000, max: 1000000 };
  };

  const validateAmount = (amount, tier) => {
    const limits = getMembershipLimits(tier);
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      return 'Please enter a valid amount';
    }
    
    if (numAmount < limits.min) {
      return `Minimum investment for ${tier} tier is $${limits.min.toLocaleString()}`;
    }
    
    if (numAmount > limits.max) {
      return `Maximum investment for ${tier} tier is $${limits.max.toLocaleString()}`;
    }
    
    return null;
  };

  const handleProceedToInvestment = (e) => {
    e.preventDefault();
    
    const amountError = validateAmount(formData.amount, selectedMembership);
    if (amountError) {
      setErrors(prev => ({ ...prev, amount: amountError }));
      return;
    }

    // Show payment fields
    setShowPaymentFields(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();

    const paymentErrors = validatePaymentFields();
    if (Object.keys(paymentErrors).length > 0) {
      setErrors(paymentErrors);
      return;
    }

    const returns = calculateReturns();
    const result = {
      ...formData,
      ...returns,
      membershipTier: selectedMembership,
      selectedTrader: selectedTrader,
      investmentDate: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };
        
    // Store the result in localStorage
    localStorage.setItem('investmentResult', JSON.stringify(result));
    
    // Navigate to success page
    navigate('/investment-success');
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
        <MembershipCard
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
        />
      </div>

      {/* Trader Selection Section */}
      {selectedMembership && (
        <div id="trader-selection">
          <TraderSelection
            membershipTier={selectedMembership}
            onTraderSelect={handleTraderSelect}
            selectedTrader={selectedTrader}
          />
        </div>
      )}
    </div>
  );

  const renderInvestmentForm = () => {
    const limits = getMembershipLimits(selectedMembership);
    
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
                </div>

                  {/* Auto-reinvest checkbox */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoReinvest"
                      name="autoReinvest"
                      checked={formData.autoReinvest}
                      onChange={handleChange}
                      disabled={showPaymentFields}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <label htmlFor="autoReinvest" className="text-sm text-gray-700">
                      Auto-reinvest returns at maturity
                    </label>
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
                              <span className="text-gray-500 text-sm">QR Code Scanner</span>
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
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="Enter transaction ID from your payment"
                        icon={<FiCreditCard />}
                        error={errors.transactionId}
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
                          error={errors.paymentScreenshot}
                        />
                        {errors.paymentScreenshot && (
                          <p className="mt-1 text-sm text-red-600">{errors.paymentScreenshot}</p>
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
                  disabled={!formData.amount || validateAmount(formData.amount, selectedMembership) !== null}
                  icon={showPaymentFields ? <FiCreditCard /> : <FiTrendingUp />}
                >
                  {showPaymentFields ? 'Complete Investment' : 'Proceed to Investment'}
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

