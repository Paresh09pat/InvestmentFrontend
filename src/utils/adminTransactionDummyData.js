// Dummy data for admin transaction history (frontend only)

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  REFUND: 'refund',
  FEE: 'fee',
  BONUS: 'bonus',
  DIVIDEND: 'dividend',
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PROCESSING: 'processing',
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  CRYPTO: 'crypto',
  WIRE_TRANSFER: 'wire_transfer',
};

// Generate dummy transaction data
export const generateDummyTransactions = () => {
  const transactions = [
    {
      _id: '1',
      userId: 'user_1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      type: TRANSACTION_TYPES.DEPOSIT,
      amount: 5000,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      description: 'Initial deposit for investment account',
      reference: 'DEP-001-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      metadata: {
        bankName: 'Chase Bank',
        accountLast4: '1234',
        processingFee: 0,
      },
    },
    {
      _id: '2',
      userId: 'user_2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      type: TRANSACTION_TYPES.INVESTMENT,
      amount: 2500,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
      description: 'Investment in Trader Alpha portfolio',
      reference: 'INV-002-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      metadata: {
        traderName: 'Trader Alpha',
        portfolioId: 'port_alpha_001',
        expectedReturn: 12.5,
        duration: '6 months',
      },
    },
    {
      _id: '3',
      userId: 'user_3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      type: TRANSACTION_TYPES.WITHDRAWAL,
      amount: 1200,
      currency: 'USD',
      status: TRANSACTION_STATUS.PENDING,
      paymentMethod: PAYMENT_METHODS.PAYPAL,
      description: 'Withdrawal request to PayPal account',
      reference: 'WTH-003-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      metadata: {
        paypalEmail: 'mike.johnson@example.com',
        processingFee: 25,
        estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
    },
    {
      _id: '4',
      userId: 'user_4',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      type: TRANSACTION_TYPES.DEPOSIT,
      amount: 10000,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.WIRE_TRANSFER,
      description: 'Large deposit via wire transfer',
      reference: 'DEP-004-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      metadata: {
        bankName: 'Wells Fargo',
        wireReference: 'WF-2024-001234',
        processingFee: 0,
      },
    },
    {
      _id: '5',
      userId: 'user_5',
      userName: 'David Brown',
      userEmail: 'david.brown@example.com',
      type: TRANSACTION_TYPES.INVESTMENT,
      amount: 7500,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      description: 'Investment in Trader Beta portfolio',
      reference: 'INV-005-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7.5).toISOString(),
      metadata: {
        traderName: 'Trader Beta',
        portfolioId: 'port_beta_002',
        expectedReturn: 15.2,
        duration: '12 months',
      },
    },
    {
      _id: '6',
      userId: 'user_6',
      userName: 'Lisa Davis',
      userEmail: 'lisa.davis@example.com',
      type: TRANSACTION_TYPES.WITHDRAWAL,
      amount: 800,
      currency: 'USD',
      status: TRANSACTION_STATUS.FAILED,
      paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
      description: 'Failed withdrawal attempt',
      reference: 'WTH-006-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
      metadata: {
        failureReason: 'Insufficient funds',
        cardLast4: '5678',
        processingFee: 0,
      },
    },
    {
      _id: '7',
      userId: 'user_7',
      userName: 'Robert Taylor',
      userEmail: 'robert.taylor@example.com',
      type: TRANSACTION_TYPES.DIVIDEND,
      amount: 150,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      description: 'Monthly dividend payment',
      reference: 'DIV-007-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      metadata: {
        portfolioId: 'port_alpha_001',
        dividendRate: 2.5,
        period: 'monthly',
      },
    },
    {
      _id: '8',
      userId: 'user_8',
      userName: 'Emily Chen',
      userEmail: 'emily.chen@example.com',
      type: TRANSACTION_TYPES.DEPOSIT,
      amount: 3000,
      currency: 'USD',
      status: TRANSACTION_STATUS.PROCESSING,
      paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
      description: 'Deposit via credit card',
      reference: 'DEP-008-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      metadata: {
        cardLast4: '9012',
        processingFee: 30,
        estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      },
    },
    {
      _id: '9',
      userId: 'user_9',
      userName: 'Michael Rodriguez',
      userEmail: 'michael.rodriguez@example.com',
      type: TRANSACTION_TYPES.INVESTMENT,
      amount: 15000,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.WIRE_TRANSFER,
      description: 'Large investment in Trader Gamma portfolio',
      reference: 'INV-009-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 1.25 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
      metadata: {
        traderName: 'Trader Gamma',
        portfolioId: 'port_gamma_003',
        expectedReturn: 18.7,
        duration: '18 months',
      },
    },
    {
      _id: '10',
      userId: 'user_10',
      userName: 'Amanda White',
      userEmail: 'amanda.white@example.com',
      type: TRANSACTION_TYPES.WITHDRAWAL,
      amount: 2000,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      description: 'Withdrawal to savings account',
      reference: 'WTH-010-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(),
      metadata: {
        bankName: 'Bank of America',
        accountLast4: '3456',
        processingFee: 15,
      },
    },
    {
      _id: '11',
      userId: 'user_11',
      userName: 'Kevin Lee',
      userEmail: 'kevin.lee@example.com',
      type: TRANSACTION_TYPES.BONUS,
      amount: 100,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      description: 'Welcome bonus for new user',
      reference: 'BNS-011-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      metadata: {
        bonusType: 'welcome',
        promotionCode: 'WELCOME2024',
      },
    },
    {
      _id: '12',
      userId: 'user_12',
      userName: 'Jennifer Martinez',
      userEmail: 'jennifer.martinez@example.com',
      type: TRANSACTION_TYPES.FEE,
      amount: 25,
      currency: 'USD',
      status: TRANSACTION_STATUS.COMPLETED,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      description: 'Monthly maintenance fee',
      reference: 'FEE-012-2024',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 2.5 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
      metadata: {
        feeType: 'maintenance',
        period: 'monthly',
      },
    },
  ];

  return transactions;
};

// Helper function to format transaction amount
export const formatTransactionAmount = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Helper function to format transaction time
export const formatTransactionTime = (dateString) => {
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

// Helper function to get transaction status color
export const getTransactionStatusColor = (status) => {
  const colors = {
    [TRANSACTION_STATUS.COMPLETED]: 'green',
    [TRANSACTION_STATUS.PENDING]: 'yellow',
    [TRANSACTION_STATUS.PROCESSING]: 'blue',
    [TRANSACTION_STATUS.FAILED]: 'red',
    [TRANSACTION_STATUS.CANCELLED]: 'gray',
  };

  return colors[status] || 'gray';
};

// Helper function to get transaction type color
export const getTransactionTypeColor = (type) => {
  const colors = {
    [TRANSACTION_TYPES.DEPOSIT]: 'green',
    [TRANSACTION_TYPES.WITHDRAWAL]: 'orange',
    [TRANSACTION_TYPES.INVESTMENT]: 'blue',
    [TRANSACTION_TYPES.DIVIDEND]: 'purple',
    [TRANSACTION_TYPES.BONUS]: 'indigo',
    [TRANSACTION_TYPES.FEE]: 'red',
    [TRANSACTION_TYPES.REFUND]: 'teal',
  };

  return colors[type] || 'gray';
};

// Helper function to get payment method icon
export const getPaymentMethodIcon = (method) => {
  const icons = {
    [PAYMENT_METHODS.BANK_TRANSFER]: '🏦',
    [PAYMENT_METHODS.CREDIT_CARD]: '💳',
    [PAYMENT_METHODS.PAYPAL]: '🅿️',
    [PAYMENT_METHODS.CRYPTO]: '₿',
    [PAYMENT_METHODS.WIRE_TRANSFER]: '💸',
  };

  return icons[method] || '💰';
};

// Helper function to calculate total amounts by type
export const calculateTotalsByType = (transactions) => {
  const totals = {};
  
  transactions.forEach(transaction => {
    if (!totals[transaction.type]) {
      totals[transaction.type] = 0;
    }
    totals[transaction.type] += transaction.amount;
  });

  return totals;
};

// Helper function to filter transactions by user
export const filterTransactionsByUser = (transactions, userId) => {
  return transactions.filter(transaction => transaction.userId === userId);
};

// Helper function to get transaction statistics
export const getTransactionStats = (transactions) => {
  const stats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    completedTransactions: transactions.filter(t => t.status === TRANSACTION_STATUS.COMPLETED).length,
    pendingTransactions: transactions.filter(t => t.status === TRANSACTION_STATUS.PENDING).length,
    failedTransactions: transactions.filter(t => t.status === TRANSACTION_STATUS.FAILED).length,
    uniqueUsers: new Set(transactions.map(t => t.userId)).size,
  };

  return stats;
};

