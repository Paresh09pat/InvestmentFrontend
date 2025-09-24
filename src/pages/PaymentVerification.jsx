// PaymentVerification page
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUpload, FiQrCode, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/forms/Input';

const PaymentVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    transactionId: '',
    paymentScreenshot: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Get investment data from location state
  const investmentData = location.state?.investmentData;

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          paymentScreenshot: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          paymentScreenshot: 'File size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        paymentScreenshot: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      setErrors(prev => ({
        ...prev,
        paymentScreenshot: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    } else if (formData.transactionId.trim().length < 8) {
      newErrors.transactionId = 'Transaction ID must be at least 8 characters';
    }

    if (!formData.paymentScreenshot) {
      newErrors.paymentScreenshot = 'Payment screenshot is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate payment verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Combine investment data with payment verification data
      const result = {
        ...investmentData,
        transactionId: formData.transactionId,
        paymentVerified: true,
        verificationDate: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      };
            
      // Store the result in localStorage
      localStorage.setItem('investmentResult', JSON.stringify(result));
      
      // Navigate to success page
      navigate('/investment-success');
    } catch (error) {
      console.error('Payment verification failed:', error);
      setErrors({ general: 'Payment verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/invest');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!investmentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 pb-8">
          <div className="max-w-2xl mx-auto px-4">
            <Card className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                No Investment Data Found
              </h1>
              <p className="text-gray-600 mb-6">
                Please go back to the investment form to proceed.
              </p>
              <Button onClick={handleBack}>
                Back to Investment Form
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                onClick={handleBack}
                icon={<FiArrowLeft />}
              >
                Back
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Verification
              </h1>
            </div>
            <p className="text-gray-600">
              Complete your payment by scanning the QR code and providing payment details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment QR Code */}
            <Card>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiQrCode className="text-blue-600" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Scan QR Code to Pay
                </h3>
                <p className="text-gray-600 mb-6">
                  Scan this QR code with your UPI app to complete the payment
                </p>
                
                {/* QR Code Placeholder */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FiQrCode className="text-gray-400 mx-auto mb-2" size={64} />
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="text-xs text-gray-400">(Admin will add actual QR)</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Amount:</span>
                      <span className="font-medium text-blue-900">
                        {formatCurrency(investmentData.principal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">UPI ID:</span>
                      <span className="font-medium text-blue-900">admin@Trdexa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Merchant:</span>
                      <span className="font-medium text-blue-900">Trdexa</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Verification Form */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Verification
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction ID */}
                <Input
                  label="Transaction ID"
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="Enter your UPI transaction ID"
                  error={errors.transactionId}
                  required
                />

                {/* Payment Screenshot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Screenshot *
                  </label>
                  
                  <div className="space-y-4">
                    {/* File Upload Button */}
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        icon={<FiUpload />}
                      >
                        Upload Screenshot
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {formData.paymentScreenshot && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <FiCheck size={16} />
                          <span className="text-sm">File uploaded</span>
                        </div>
                      )}
                    </div>

                    {/* File Requirements */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Requirements:</p>
                      <ul className="space-y-1">
                        <li>• Screenshot of successful payment</li>
                        <li>• Must show transaction ID and amount</li>
                        <li>• File size: Max 5MB</li>
                        <li>• Formats: JPG, PNG, GIF</li>
                      </ul>
                    </div>

                    {/* Error Message */}
                    {errors.paymentScreenshot && (
                      <p className="text-red-600 text-sm">{errors.paymentScreenshot}</p>
                    )}

                    {/* Image Preview */}
                    {previewImage && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img
                          src={previewImage}
                          alt="Payment screenshot preview"
                          className="max-w-full h-32 object-contain rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(investmentData.principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Returns:</span>
                      <span className="font-medium text-green-600">{formatCurrency(investmentData.returns)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(investmentData.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="large"
                  fullWidth
                  loading={loading}
                  disabled={!formData.transactionId || !formData.paymentScreenshot}
                >
                  {loading ? 'Verifying Payment...' : 'Verify Payment & Complete Investment'}
                </Button>

                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;


