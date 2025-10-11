// API Configuration
export const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  INVESTOR: 'investor',
  USER: 'user'
};

export const INVESTMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved', 
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const WITHDRAWAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSING: 'processing',
  COMPLETED: 'completed'
};

export const USER_VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

export const DOCUMENT_TYPES = {
  AADHAAR: 'aadhaar',
  PAN: 'pan'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const REFERRAL_TRANSACTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const REFERRAL_PLANS = {
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

export const REFERRAL_PLAN_COLORS = {
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-purple-100 text-purple-800'
};

export const REFERRAL_PLAN_NAMES = {
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  INVESTMENT_FORM: '/invest',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    INVESTMENTS: '/admin/investments',
    DOCUMENTS: '/admin/documents'
  }
};
  