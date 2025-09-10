// API Configuration
export const VITE_APP_API_URL = 'http://localhost:3000';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  INVESTOR: 'investor',
  USER: 'user'
};

export const INVESTMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
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
  