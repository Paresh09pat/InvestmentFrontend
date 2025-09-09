// ProtectedRoute component
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { USER_VERIFICATION_STATUS } from '../../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false, requireVerification = false }) => {
  const { user, isAdmin, loading } = useAuth();

  // Show verification notification when user tries to access investment pages
  useEffect(() => {
    if (requireVerification && user && user.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
      const getVerificationMessage = () => {
        switch (user.verificationStatus) {
          case USER_VERIFICATION_STATUS.PENDING:
            return {
              message: "Your documents are under review. Please wait for verification to access investment features.",
              type: "info"
            };
          case USER_VERIFICATION_STATUS.REJECTED:
            return {
              message: "Your documents were rejected. Please upload new documents to access investment features.",
              type: "warning"
            };
          case USER_VERIFICATION_STATUS.UNVERIFIED:
          default:
            return {
              message: "Please upload and verify your documents to access investment features.",
              type: "warning"
            };
        }
      };

      const { message, type } = getVerificationMessage();
      
      if (type === 'info') {
        toast.info(message, {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.warning(message, {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [requireVerification, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!requireAdmin && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check document verification for investment-related routes
  if (requireVerification && user && user.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
