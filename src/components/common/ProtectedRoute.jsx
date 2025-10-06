// ProtectedRoute component
import { Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { USER_VERIFICATION_STATUS } from '../../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireVerification = false,
  redirectTo = null 
}) => {
  const { user, isAdmin, loading, isAuthenticated } = useAuth();
  const toastShownRef = useRef(false);

  // Show verification notification when user tries to access investment pages
  useEffect(() => {
    if (requireVerification && user && user.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED && !toastShownRef.current) {
      // Create a unique key for this specific verification state
      const verificationKey = `${user._id}-${user.verificationStatus}-${user?.documents?.aadhaar?.status}-${user?.documents?.pan?.status}-${user?.trustWalletAddress}`;
      
      // Check if we've already shown a toast for this exact state
      const lastToastKey = sessionStorage.getItem('lastVerificationToast');
      if (lastToastKey === verificationKey) {
        return;
      }
      const getVerificationMessage = () => {
        const aadhaarVerified = user?.documents?.aadhaar?.status === 'verified';
        const panVerified = user?.documents?.pan?.status === 'verified';
        const walletAddressMissing = !user?.trustWalletAddress || user.trustWalletAddress.trim() === '';

        // If documents are verified but wallet address is missing
        if ((aadhaarVerified && panVerified) && walletAddressMissing) {
          return {
            message: "Your documents are verified! Please add your Trust Wallet address to complete verification and access investment features.",
            type: "warning"
          };
        }


        // If documents are verified and wallet address exists but user verification is still pending
        if ((aadhaarVerified && panVerified) && !walletAddressMissing) {
          return {
            message: "Your documents are verified and under review. Please wait for verification to access investment features.",
            type: "info"
          };
        }

        // Check individual document status
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
      
      // Mark toast as shown to prevent duplicates
      toastShownRef.current = true;
      
      // Store the verification key to prevent showing the same toast again
      sessionStorage.setItem('lastVerificationToast', verificationKey);
      
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

  // Reset toast flag when user changes or component unmounts
  useEffect(() => {
    return () => {
      toastShownRef.current = false;
    };
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if user is authenticated at all
  if (!isAuthenticated) {
    // Use custom redirect path if provided, otherwise use default based on route type
    const defaultRedirect = requireAdmin ? "/admin/login" : "/login";
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if regular user is trying to access admin routes
  if (!requireAdmin && isAdmin && !user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check document verification for investment-related routes
  if (requireVerification && user && user.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
    const aadhaarVerified = user?.documents?.aadhaar?.status === 'verified';
    const panVerified = user?.documents?.pan?.status === 'verified';
    const walletAddressMissing = !user?.trustWalletAddress || user.trustWalletAddress.trim() === '';

    // If documents are verified but wallet address is missing, redirect to profile
    if ((aadhaarVerified && panVerified) && walletAddressMissing) {
      return <Navigate to="/profile" replace />;
    }

    // If documents are verified but user verification is still pending, redirect to profile
    if (aadhaarVerified && panVerified) {
      return <Navigate to="/profile" replace />;
    }

    // For other cases, redirect to profile
    return <Navigate to="/profile" replace />;
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
