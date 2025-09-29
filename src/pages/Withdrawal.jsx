// Withdrawal page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiDollarSign, 
  FiCreditCard,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiSmartphone,
  FiCopy
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { USER_VERIFICATION_STATUS } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/forms/Input';

const Withdrawal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Withdrawal form state
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalMethod: 'bank',
    bankAccount: '',
    upiId: '',
    notes: ''
  });

  // User balance and withdrawal info
  const [userBalance, setUserBalance] = useState({
    totalBalance: 25480,
    availableBalance: 18480,
    pendingWithdrawals: 2000,
    lastWithdrawal: new Date().toLocaleDateString()
  });

  const [withdrawalMethods] = useState([
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: FiHome,
      description: 'Direct bank account transfer',
      fee: '$2.50',
      processingTime: '1-3 business days'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: FiSmartphone,
      description: 'Instant UPI payment',
      fee: 'Free',
      processingTime: 'Instant'
    }
  ]);

  const [recentWithdrawals] = useState([
    {
      id: 1,
      amount: 5000,
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-01-15',
      transactionId: 'WDL-7854-2121'
    },
    {
      id: 2,
      amount: 2500,
      method: 'UPI',
      status: 'pending',
      date: '2024-01-20',
      transactionId: 'WDL-7854-2122'
    }
  ]);

  useEffect(() => {
    // Redirect if not verified
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) < 100) {
      newErrors.amount = 'Minimum withdrawal amount is $100';
    } else if (parseFloat(formData.amount) > userBalance.availableBalance) {
      newErrors.amount = 'Amount exceeds available balance';
    }

    if (formData.withdrawalMethod === 'bank' && !formData.bankAccount) {
      newErrors.bankAccount = 'Bank account details are required';
    }

    if (formData.withdrawalMethod === 'upi' && !formData.upiId) {
      newErrors.upiId = 'UPI ID is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would call the withdrawal API
      console.log('Withdrawal request:', formData);
      
      // Reset form
      setFormData({
        amount: '',
        withdrawalMethod: 'bank',
        bankAccount: '',
        upiId: '',
        notes: ''
      });
      
      // Show success message
      alert('Withdrawal request submitted successfully! You will receive confirmation via email.');
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      setErrors({ general: 'Failed to submit withdrawal request. Please try again.' });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Withdrawal Form */}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                          Withdrawal Address*
                        </label>
                        <div className="relative">
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter wallet address"
                            rows={4}
                            required
                          />
                    </div>
                  </div>

                  {/* Amount */}
                  <Input
                    label="Withdrawal Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="500"
                    icon={<FiDollarSign />}
                    error={errors.amount}
                    required
                    min="100"
                  />

                  {/* Security Info */}
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Balance Info */}
              <Card className="animate-slide-up">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Balance
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Balance</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(userBalance.totalBalance)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available for Withdrawal</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(userBalance.availableBalance)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending Withdrawals</span>
                    <span className="text-sm text-yellow-600 font-medium">
                      {formatCurrency(userBalance.pendingWithdrawals)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Withdrawal</span>
                      <span className="text-gray-700">{userBalance.lastWithdrawal}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Withdrawals
                </h3>
                
                {recentWithdrawals.length > 0 ? (
                  <div className="space-y-3">
                    {recentWithdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(withdrawal.status)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(withdrawal.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {withdrawal.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No recent withdrawals
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    fullWidth
                    size="small"
                    onClick={() => navigate('/dashboard')}
                  >
                    View All Transactions
                  </Button>
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
