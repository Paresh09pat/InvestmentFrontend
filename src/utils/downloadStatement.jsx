/**
 * Download Statement Utility Functions - React PDF
 * Provides PDF statement download functionality using @react-pdf/renderer
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#2563eb',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 5,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 8,
    color: '#1e293b',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  summaryValue: {
    color: '#64748b',
  },
  rejectionReason: {
    backgroundColor: '#fee2e2',
    padding: 10,
    border: 1,
    borderColor: '#dc2626',
    borderRadius: 4,
    marginTop: 10,
  },
  rejectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
  },
});

/**
 * Utility function to format currency
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Utility function to format date
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Generate PDF Document for Individual Transaction
 */
const TransactionPDFDocument = ({ transaction }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Investment Statement</Text>
          <Text style={styles.subtitle}>Generated on: {currentDate}</Text>
        </View>

        {/* Transaction Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Transaction ID</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Amount</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Plan</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Status</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>#{(transaction._id || '').slice(-8)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatCurrency(transaction.amount)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{(transaction.plan || '').charAt(0).toUpperCase() + (transaction.plan || '').slice(1)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{(transaction.status || '').charAt(0).toUpperCase() + (transaction.status || '').slice(1)}</Text>
              </View>
            </View>
          </View>
          
          {/* Additional transaction details */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Type</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Date</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Wallet TX ID</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Wallet Address</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{(transaction.type || '').charAt(0).toUpperCase() + (transaction.type || '').slice(1)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatDate(transaction.createdAt)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{transaction.walletTxId || 'N/A'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{(transaction.walletAddress || 'N/A').slice(0, 20) + '...'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* User Information */}
        {transaction.userId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Information</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>Name</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>Email</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>Phone</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>-</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{transaction.userId.name || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{transaction.userId.email || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{transaction.userId.phone || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Trader Information */}
        {transaction.trader && transaction.trader.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trader Information</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>Trader Name</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>Trader Type</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>Trader Email</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>-</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{transaction.trader[0].name || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{transaction.trader[0].traderType || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{transaction.trader[0].email || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Rejection Reason */}
        {transaction.rejectionReason && (
          <View style={styles.rejectionReason}>
            <Text style={styles.rejectionTitle}>Rejection Reason:</Text>
            <Text style={styles.tableCell}>{transaction.rejectionReason}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Investment Platform</Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Generate PDF Document for Multiple Transactions
 */
const MultipleTransactionsPDFDocument = ({ transactions, filters }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalInvested = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Investment Portfolio Statement</Text>
          <Text style={styles.subtitle}>Generated on: {currentDate}</Text>
        </View>

        {/* Filters */}
        {Object.keys(filters).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filters Applied:</Text>
            {Object.entries(filters).map(([key, value]) => {
              if (value && value !== 'all') {
                return (
                  <Text key={key} style={styles.tableCell}>
                    • {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                );
              }
              return null;
            })}
          </View>
        )}

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Total Transactions</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Total Investment</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Pending</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Approved</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{transactions.length}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatCurrency(totalInvested)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{pendingCount}</Text>
              </View>
              <View style={styles.tableCol}>
                <View>
                  <Text style={styles.tableCell}>{approvedCount}</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Rejected</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{rejectedCount}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>-</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>-</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Transactions</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>ID</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Amount</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Plan</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Status</Text>
              </View>
            </View>
            {transactions.map((transaction, index) => (
              <View key={transaction._id || index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>#{(transaction._id || '').slice(-8)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{formatCurrency(transaction.amount)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{(transaction.plan || '').charAt(0).toUpperCase() + (transaction.plan || '').slice(1)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{(transaction.status || '').charAt(0).toUpperCase() + (transaction.status || '').slice(1)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Investment Platform</Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Download single transaction PDF
 */
export const downloadTransactionPDF = async (transaction) => {
  try {
    const blob = await pdf(<TransactionPDFDocument transaction={transaction} />).toBlob();
    const fileName = `Transaction_Statement_${(transaction._id || '').slice(-8)}_${formatDate(transaction.createdAt).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    
    return { success: true, message: 'Statement downloaded successfully' };
  } catch (error) {
    console.error('PDF gasation error:', error);
    return { success: false, message: 'Failed to generate PDF statement' };
  }
};

/**
 * Download multiple transactions PDF
 */
export const downloadMultipleTransactionsPDF = async (transactions, filters = {}) => {
  try {
    const blob = await pdf(<MultipleTransactionsPDFDocument transactions={transactions} filters={filters} />).toBlob();
    const dateRange = filters.dateRange || 'all';
    const fileName = `Portfolio_Statement_${dateRange}_${formatDate(new Date().toISOString()).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    
    return { success: true, message: 'Portfolio statement downloaded successfully' };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, message: 'Failed to generate PDF statement' };
  }
};

/**
 * Main download function - React PDF
 */
export const downloadStatement = async (type, data, format = 'pdf', filters = {}) => {
  try {
    let result;

    if (type === 'single') {
      result = await downloadTransactionPDF(data);
    } else {
      result = await downloadMultipleTransactionsPDF(data, filters);
    }

    return result;
  } catch (error) {
    console.error('Download statement error:', error);
    return { success: false, message: 'Failed to download statement' };
  }
};