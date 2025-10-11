// Withdrawal Success page
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiArrowRight,
  FiHome,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const WithdrawalSuccess = () => {
  const navigate = useNavigate();
  const [withdrawalData, setWithdrawalData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('withdrawalResult');
    if (storedData) {
      setWithdrawalData(JSON.parse(storedData));
      // Clear the stored data after reading
      localStorage.removeItem('withdrawalResult');
    } else {
      // If no data found, redirect to withdrawal page
      navigate('/withdrawal');
    }
  }, [navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!withdrawalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FiCheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Withdrawal Request Submitted!
            </h1>
            <p className="text-gray-600 text-lg">
              Your investment withdrawal request has been successfully submitted and is under review.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Request Details */}
              <Card className="animate-fade-in mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                    <FiDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Withdrawal Request Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Request ID</h4>
                      <p className="text-sm text-gray-600">#{withdrawalData.timestamp}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Submission Date</h4>
                      <p className="text-sm text-gray-600">{formatDate(withdrawalData.withdrawalDate)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Amount</h4>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(withdrawalData.amount)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Plan</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {withdrawalData.plan} Plan
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Reason for Withdrawal</h4>
                    <p className="text-sm text-blue-800">{withdrawalData.reason}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Wallet Address</h4>
                    <p className="text-sm text-gray-600 font-mono break-all">
                      {withdrawalData.walletAddress}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Next Steps */}
              <Card className="animate-fade-in">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                    <FiClock className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    What Happens Next?
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review Process</h4>
                      <p className="text-sm text-gray-600">
                        Our team will review your withdrawal request within 24-48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Verification</h4>
                      <p className="text-sm text-gray-600">
                        You may be contacted for additional verification if required.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Processing</h4>
                      <p className="text-sm text-gray-600">
                        Once approved, your withdrawal will be processed within 3-5 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      <span className="text-blue-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Completion</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive a notification once the withdrawal is completed.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="animate-slide-up">
                <div className="flex items-center space-x-2 mb-4">
                  <FiPhone className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Need Help?
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Support</p>
                      <p className="text-xs text-gray-600">support@tanuinvestment.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone Support</p>
                      <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiClock className="text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Support Hours</p>
                      <p className="text-xs text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/withdrawal')}
                    icon={<FiArrowRight />}
                  >
                    View All Withdrawals
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/dashboard')}
                    icon={<FiHome />}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </Card>

              {/* Important Notice */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Important Notice
                  </h4>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Early withdrawal may incur penalties</li>
                    <li>• Processing time: 3-5 business days</li>
                    <li>• Admin approval required</li>
                    <li>• Keep your request details confidential</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSuccess;
