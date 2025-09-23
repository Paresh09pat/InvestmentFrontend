// InvestmentSuccess page
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiHome } from 'react-icons/fi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const InvestmentSuccess = () => {
  const navigate = useNavigate();
  const [investmentData, setInvestmentData] = useState(null);

  useEffect(() => {
    // Simple check for investment data
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

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center p-8">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-600" size={32} />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Investment Successful! 🎉
            </h1>

            {/* Investment Details */}
            {investmentData ? (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Investment Details:</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">₹{investmentData.principal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Returns:</span>
                    <span className="font-medium text-green-600">₹{investmentData.returns?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-bold text-blue-600">₹{investmentData.total?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{investmentData.investmentDate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">Investment completed successfully!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGoToDashboard}
                size="large"
                className="flex items-center justify-center"
              >
                <FiHome className="mr-2" />
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                onClick={handleGoToInvest}
                size="large"
              >
                Make Another Investment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSuccess;
