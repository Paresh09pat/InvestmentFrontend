// InvestmentForm page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiTrendingUp, FiUpload, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/forms/Input';
import FileUpload from '../components/forms/FileUpload';

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

  const handleProceedToInvestment = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) < 1000) {
      alert('Please enter an amount of at least ₹1,000');
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
      investmentDate: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };
        
    // Store the result in localStorage
    localStorage.setItem('investmentResult', JSON.stringify(result));
    
    // Navigate to success page
    navigate('/investment-success');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const returns = calculateReturns();

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Make an Investment
            </h1>
            <p className="text-gray-600">
              Enter the amount you want to invest and start growing your wealth today
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Investment Form */}
            <div className="lg:col-span-2">
              <Card>
                <form onSubmit={showPaymentFields ? handleSubmitPayment : handleProceedToInvestment} className="space-y-6">
                  {/* Amount Input */}
                  <Input
                    label="Investment Amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount to invest (min ₹1,000)"
                    icon="₹"
                    required
                    readOnly={showPaymentFields}
                    className={showPaymentFields ? 'bg-gray-100' : ''}
                  />

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
                    disabled={!formData.amount || parseFloat(formData.amount) < 1000}
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
                      <span className="text-gray-600">Expected Returns (10% p.a.)</span>
                      <span className="font-medium text-green-600">{formatCurrency(returns.returns)}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between">
                      <span className="font-semibold">Total Maturity Value</span>
                      <span className="font-bold text-blue-600">{formatCurrency(returns.total)}</span>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        🎯 <strong>ROI:</strong> 10% per annum
                      </p>
                      <p className="text-sm text-blue-800 mt-1">
                        ⏰ <strong>Duration:</strong> 12 months
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
      </div>
    </div>
  );
};

export default InvestmentForm;

