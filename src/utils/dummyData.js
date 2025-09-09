import { INVESTMENT_STATUS, USER_VERIFICATION_STATUS } from './constants';

export const dummyUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+91 9876543210',
    joinDate: '2024-01-15',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    totalInvested: 150000,
    currentBalance: 165000,
    profileImage: null,
    documents: {
      aadhaar: {
        file: null,
        fileName: 'aadhaar_john.jpg',
        status: 'verified'
      },
      pan: {
        file: null,
        fileName: 'pan_john.jpg',
        status: 'verified'
      }
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91 9876543211',
    joinDate: '2024-02-20',
    verificationStatus: USER_VERIFICATION_STATUS.PENDING,
    totalInvested: 75000,
    currentBalance: 78000,
    profileImage: null,
    documents: {
      aadhaar: {
        file: null,
        fileName: 'aadhaar_sarah.jpg',
        status: 'pending'
      },
      pan: {
        file: null,
        fileName: 'pan_sarah.jpg',
        status: 'pending'
      }
    }
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+91 9876543212',
    joinDate: '2024-03-10',
    verificationStatus: USER_VERIFICATION_STATUS.UNVERIFIED,
    totalInvested: 0,
    currentBalance: 0,
    profileImage: null,
    documents: {}
  }
];

export const dummyInvestments = [
  {
    id: 1,
    userId: 1,
    planId: 2,
    planName: 'Premium Plan',
    amount: 100000,
    investmentDate: '2024-01-20',
    maturityDate: '2024-07-20',
    status: INVESTMENT_STATUS.ACTIVE,
    expectedReturns: 12000,
    currentValue: 108000,
    monthlyReturns: 2000
  },
  {
    id: 2,
    userId: 1,
    planId: 1,
    planName: 'Basic Plan',
    amount: 50000,
    investmentDate: '2023-12-15',
    maturityDate: '2024-03-15',
    status: INVESTMENT_STATUS.COMPLETED,
    expectedReturns: 4000,
    currentValue: 54000,
    monthlyReturns: 1333
  },
  {
    id: 3,
    userId: 2,
    planId: 2,
    planName: 'Premium Plan',
    amount: 75000,
    investmentDate: '2024-02-25',
    maturityDate: '2024-08-25',
    status: INVESTMENT_STATUS.ACTIVE,
    expectedReturns: 9000,
    currentValue: 78000,
    monthlyReturns: 1500
  },
  {
    id: 4,
    userId: 3,
    planId: 1,
    planName: 'Basic Plan',
    amount: 25000,
    investmentDate: '2024-03-12',
    maturityDate: '2024-06-12',
    status: INVESTMENT_STATUS.PENDING,
    expectedReturns: 2000,
    currentValue: 25000,
    monthlyReturns: 667
  }
];

export const dummyNotifications = [
  {
    id: 1,
    title: 'Investment Completed',
    message: 'Your Basic Plan investment of ₹50,000 has matured successfully.',
    type: 'success',
    date: '2024-03-15',
    read: false
  },
  {
    id: 2,
    title: 'Document Verification Required',
    message: 'Please upload your PAN card for account verification.',
    type: 'warning',
    date: '2024-03-10',
    read: false
  },
  {
    id: 3,
    title: 'New Investment Plan Available',
    message: 'Check out our new Elite Plan with 18% returns.',
    type: 'info',
    date: '2024-03-08',
    read: true
  },
  {
    id: 4,
    title: 'Monthly Returns Credited',
    message: 'Your monthly returns of ₹8,000 have been credited to your account.',
    type: 'success',
    date: '2024-03-01',
    read: true
  },
  {
    id: 5,
    title: 'Investment Milestone',
    message: 'Congratulations! You have reached ₹1,00,000 in total investments.',
    type: 'info',
    date: '2024-02-28',
    read: true
  }
];

export const dummyDocuments = [
  {
    id: 1,
    userId: 1,
    userName: 'John Smith',
    documentType: 'aadhaar',
    fileName: 'aadhaar_john.jpg',
    uploadDate: '2024-01-16',
    status: 'verified',
    verifiedBy: 'Admin',
    verificationDate: '2024-01-17',
    filePreview: null
  },
  {
    id: 2,
    userId: 1,
    userName: 'John Smith',
    documentType: 'pan',
    fileName: 'pan_john.jpg',
    uploadDate: '2024-01-16',
    status: 'verified',
    verifiedBy: 'Admin',
    verificationDate: '2024-01-17',
    filePreview: null
  },
  {
    id: 3,
    userId: 2,
    userName: 'Sarah Johnson',
    documentType: 'aadhaar',
    fileName: 'aadhaar_sarah.jpg',
    uploadDate: '2024-02-21',
    status: 'pending',
    verifiedBy: null,
    verificationDate: null,
    filePreview: null
  },
  {
    id: 4,
    userId: 2,
    userName: 'Sarah Johnson',
    documentType: 'pan',
    fileName: 'pan_sarah.jpg',
    uploadDate: '2024-02-21',
    status: 'pending',
    verifiedBy: null,
    verificationDate: null,
    filePreview: null
  }
];

export const adminStats = {
  totalUsers: 3,
  totalInvestments: 4,
  totalInvestmentAmount: 250000,
  pendingVerifications: 2,
  activeInvestments: 2,
  completedInvestments: 1,
  monthlyGrowth: 15.5,
  totalReturns: 25000,
  pendingInvestments: 1
};
