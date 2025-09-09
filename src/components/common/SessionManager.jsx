// SessionManager component for handling session timeouts
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Button from './Button';

const SessionManager = () => {
  const { sessionExpiry, handleSessionExpiry, isAdmin } = useAuth();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!sessionExpiry) return;

    const updateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(sessionExpiry).getTime();
      const remaining = Math.max(0, expiryTime - now);
      
      setTimeRemaining(remaining);

      // Show modal when 2 minutes remaining
      if (remaining <= 2 * 60 * 1000 && remaining > 0) {
        setShowSessionModal(true);
      }

      // Auto logout when time expires
      if (remaining <= 0) {
        handleSessionExpiry();
      }
    };

    // Update immediately
    updateTimeRemaining();

    // Update every second
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiry, handleSessionExpiry]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    try {
      // Refresh the session by calling checkAuthStatus
      const { checkAuthStatus } = useAuth();
      await checkAuthStatus();
      
      setShowSessionModal(false);
      
      toast.success('Session extended successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Failed to extend session:', error);
      toast.error('Failed to extend session. Please login again.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleLogoutNow = () => {
    setShowSessionModal(false);
    handleSessionExpiry();
  };

  if (!sessionExpiry || !isAdmin) return null;

  return (
    <>
      {/* Session timeout modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        title="Session Timeout Warning"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your session will expire soon
            </h3>
            <p className="text-gray-600 mb-4">
              Your admin session will expire in <span className="font-bold text-red-600">{formatTime(timeRemaining)}</span>
            </p>
            <p className="text-sm text-gray-500">
              Would you like to extend your session or logout now?
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              fullWidth
              onClick={handleLogoutNow}
            >
              Logout Now
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleExtendSession}
            >
              Extend Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Session indicator for admin pages */}
      {/* {isAdmin && timeRemaining > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Session: {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      )} */}
    </>
  );
};

export default SessionManager;
