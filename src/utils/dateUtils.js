// Date utility functions for consistent formatting across the application

/**
 * Format date with time for display
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format date only (without time)
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format time only (without date)
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time
 */
export const formatTime = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
  
  return formatDate(dateString);
};

/**
 * Format date for table display (compact format)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {Object} Object with date and time properties
 */
export const formatDateForTable = (dateString) => {
  if (!dateString) return { date: 'N/A', time: 'N/A', relative: 'N/A' };
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { date: 'Invalid Date', time: 'Invalid Date', relative: 'Invalid Date' };
  
  return {
    date: formatDate(dateString),
    time: formatTime(dateString),
    datetime: formatDateTime(dateString),
    relative: formatRelativeTime(dateString)
  };
};

/**
 * Format date for input fields (ISO format)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} ISO date string
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

/**
 * Format date for API requests (ISO format with time)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} ISO datetime string
 */
export const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString();
};

/**
 * Format currency amount for display
 * @param {number|string} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
  if (amount === null || amount === undefined || amount === '') return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '$0.00';
  
  const defaultOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  try {
    return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(numAmount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `$${numAmount.toFixed(2)}`;
  }
};