// Dummy data for admin notifications (frontend only)
export const ADMIN_NOTIFICATION_TYPES = {
  DOCUMENT_VERIFICATION: 'document_verification',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  USER_REGISTRATION: 'user_registration',
  INVESTMENT: 'investment',
  SECURITY: 'security',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
};

// Generate dummy admin notifications
export const generateDummyAdminNotifications = () => {
  const notifications = [
    {
      _id: '1',
      type: ADMIN_NOTIFICATION_TYPES.DOCUMENT_VERIFICATION,
      title: 'Document Verification Required',
      message: 'John Doe has submitted a passport for verification. Please review and approve.',
      userName: 'John Doe',
      userId: 'user_1',
      amount: null,
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      metadata: {
        documentType: 'passport',
        userEmail: 'john.doe@example.com',
      },
    },
    {
      _id: '2',
      type: ADMIN_NOTIFICATION_TYPES.DEPOSIT,
      title: 'New Deposit Request',
      message: 'Jane Smith has requested a deposit of $5,000 via bank transfer. Please verify and process.',
      userName: 'Jane Smith',
      userId: 'user_2',
      amount: 5000,
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      metadata: {
        paymentMethod: 'bank_transfer',
        userEmail: 'jane.smith@example.com',
      },
    },
    {
      _id: '3',
      type: ADMIN_NOTIFICATION_TYPES.WITHDRAWAL,
      title: 'New Withdrawal Request',
      message: 'Mike Johnson has requested a withdrawal of $2,500 via PayPal. Please review and process.',
      userName: 'Mike Johnson',
      userId: 'user_3',
      amount: 2500,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      metadata: {
        withdrawalMethod: 'paypal',
        userEmail: 'mike.johnson@example.com',
      },
    },
    {
      _id: '4',
      type: ADMIN_NOTIFICATION_TYPES.USER_REGISTRATION,
      title: 'New User Registration',
      message: 'Sarah Wilson has registered. Please review their profile and verification status.',
      userName: 'Sarah Wilson',
      userId: 'user_4',
      amount: null,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      metadata: {
        userEmail: 'sarah.wilson@example.com',
        registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    },
    {
      _id: '5',
      type: ADMIN_NOTIFICATION_TYPES.INVESTMENT,
      title: 'New Investment Activity',
      message: 'David Brown has made a new investment of $10,000 in Trader Alpha. Please review.',
      userName: 'David Brown',
      userId: 'user_5',
      amount: 10000,
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      metadata: {
        traderName: 'Trader Alpha',
        investmentId: 'inv_1',
        userEmail: 'david.brown@example.com',
      },
    },
    {
      _id: '6',
      type: ADMIN_NOTIFICATION_TYPES.SECURITY,
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected for user Lisa Davis. Please investigate.',
      userName: 'Lisa Davis',
      userId: 'user_6',
      amount: null,
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      metadata: {
        securityEvent: 'failed_login_attempts',
        severity: 'high',
        userEmail: 'lisa.davis@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
    },
    {
      _id: '7',
      type: ADMIN_NOTIFICATION_TYPES.DOCUMENT_VERIFICATION,
      title: 'Document Verification Required',
      message: 'Robert Taylor has submitted a driver\'s license for verification. Please review and approve.',
      userName: 'Robert Taylor',
      userId: 'user_7',
      amount: null,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      metadata: {
        documentType: 'drivers_license',
        userEmail: 'robert.taylor@example.com',
      },
    },
    {
      _id: '8',
      type: ADMIN_NOTIFICATION_TYPES.DEPOSIT,
      title: 'New Deposit Request',
      message: 'Emily Chen has requested a deposit of $3,000 via credit card. Please verify and process.',
      userName: 'Emily Chen',
      userId: 'user_8',
      amount: 3000,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      metadata: {
        paymentMethod: 'credit_card',
        userEmail: 'emily.chen@example.com',
      },
    },
    {
      _id: '9',
      type: ADMIN_NOTIFICATION_TYPES.INVESTMENT,
      title: 'New Investment Activity',
      message: 'Michael Rodriguez has made a new investment of $7,500 in Trader Beta. Please review.',
      userName: 'Michael Rodriguez',
      userId: 'user_9',
      amount: 7500,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 1.25 days ago
      metadata: {
        traderName: 'Trader Beta',
        investmentId: 'inv_2',
        userEmail: 'michael.rodriguez@example.com',
      },
    },
    {
      _id: '10',
      type: ADMIN_NOTIFICATION_TYPES.WITHDRAWAL,
      title: 'New Withdrawal Request',
      message: 'Amanda White has requested a withdrawal of $1,200 via bank transfer. Please review and process.',
      userName: 'Amanda White',
      userId: 'user_10',
      amount: 1200,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      metadata: {
        withdrawalMethod: 'bank_transfer',
        userEmail: 'amanda.white@example.com',
      },
    },
    {
      _id: '11',
      type: ADMIN_NOTIFICATION_TYPES.USER_REGISTRATION,
      title: 'New User Registration',
      message: 'Kevin Lee has registered. Please review their profile and verification status.',
      userName: 'Kevin Lee',
      userId: 'user_11',
      amount: null,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      metadata: {
        userEmail: 'kevin.lee@example.com',
        registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    },
    {
      _id: '12',
      type: ADMIN_NOTIFICATION_TYPES.SECURITY,
      title: 'Security Alert',
      message: 'Unusual activity detected for user Jennifer Martinez. Please investigate.',
      userName: 'Jennifer Martinez',
      userId: 'user_12',
      amount: null,
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 2.5 days ago
      metadata: {
        securityEvent: 'unusual_activity',
        severity: 'medium',
        userEmail: 'jennifer.martinez@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
      },
    },
  ];

  return notifications;
};

// Helper function to format notification time
export const formatNotificationTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
  return date.toLocaleDateString();
};

// Helper function to get notification priority
export const getNotificationPriority = (type) => {
  const priorities = {
    [ADMIN_NOTIFICATION_TYPES.SECURITY]: 'high',
    [ADMIN_NOTIFICATION_TYPES.WITHDRAWAL]: 'high',
    [ADMIN_NOTIFICATION_TYPES.DEPOSIT]: 'medium',
    [ADMIN_NOTIFICATION_TYPES.DOCUMENT_VERIFICATION]: 'medium',
    [ADMIN_NOTIFICATION_TYPES.INVESTMENT]: 'medium',
    [ADMIN_NOTIFICATION_TYPES.USER_REGISTRATION]: 'low',
    [ADMIN_NOTIFICATION_TYPES.INFO]: 'low',
    [ADMIN_NOTIFICATION_TYPES.SUCCESS]: 'low',
    [ADMIN_NOTIFICATION_TYPES.WARNING]: 'medium',
  };

  return priorities[type] || 'low';
};

// Helper function to get notification color
export const getNotificationColor = (type) => {
  const colors = {
    [ADMIN_NOTIFICATION_TYPES.SECURITY]: 'red',
    [ADMIN_NOTIFICATION_TYPES.WITHDRAWAL]: 'orange',
    [ADMIN_NOTIFICATION_TYPES.DEPOSIT]: 'green',
    [ADMIN_NOTIFICATION_TYPES.DOCUMENT_VERIFICATION]: 'blue',
    [ADMIN_NOTIFICATION_TYPES.INVESTMENT]: 'indigo',
    [ADMIN_NOTIFICATION_TYPES.USER_REGISTRATION]: 'purple',
    [ADMIN_NOTIFICATION_TYPES.INFO]: 'blue',
    [ADMIN_NOTIFICATION_TYPES.SUCCESS]: 'green',
    [ADMIN_NOTIFICATION_TYPES.WARNING]: 'yellow',
  };

  return colors[type] || 'gray';
};

