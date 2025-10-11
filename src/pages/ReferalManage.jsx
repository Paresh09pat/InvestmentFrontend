import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiDollarSign, 
  FiCopy, 
  FiCheck, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiShare2,
  FiTrendingUp,
  FiGift
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { referralApi } from '../utils/referralApi';
import { 
  REFERRAL_TRANSACTION_STATUS, 
  REFERRAL_PLAN_COLORS, 
  REFERRAL_PLAN_NAMES 
} from '../utils/constants';
import { formatDateTime, formatCurrency } from '../utils/dateUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReferalManage = () => {
  const { user } = useAuth();
  const [referralTransactions, setReferralTransactions] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchReferralData();
    }, []);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const [transactionsResponse, statsResponse] = await Promise.all([
        referralApi.getUserReferralTransactions(),
        referralApi.getUserReferralStats()
      ]);
      
      setReferralTransactions(transactionsResponse.data || []);
      setReferralStats(statsResponse.stats);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      setError('Failed to load referral data');
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats?.referralCode || '');
      setCopiedCode(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      toast.error('Failed to copy referral code');
    }
  };

  const copyReferralLink = async () => {
    const referralLink = referralStats?.referralLink || '';
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy referral link');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case REFERRAL_TRANSACTION_STATUS.PENDING:
        return <FiClock className="text-yellow-500" />;
      case REFERRAL_TRANSACTION_STATUS.APPROVED:
        return <FiCheckCircle className="text-green-500" />;
      case REFERRAL_TRANSACTION_STATUS.REJECTED:
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case REFERRAL_TRANSACTION_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case REFERRAL_TRANSACTION_STATUS.APPROVED:
        return 'bg-green-100 text-green-800';
      case REFERRAL_TRANSACTION_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const transactionColumns = [
    {
      key: 'referrer',
      title: 'Referrer',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.referrer?.name}</div>
          <div className="text-sm text-gray-500">{row.referrer?.email}</div>
        </div>
      )
    },
    {
      key: 'referred',
      title: 'Referred User',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.referred?.name}</div>
          <div className="text-sm text-gray-500">{row.referred?.email}</div>
        </div>
      )
    },
    {
      key: 'referredPlan',
      title: 'Plan',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${REFERRAL_PLAN_COLORS[value] || 'bg-gray-100 text-gray-800'}`}>
          {REFERRAL_PLAN_NAMES[value] || value}
        </span>
      )
    },
    {
      key: 'referredDepositAmount',
      title: 'Deposit Amount',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'rewardAmount',
      title: 'Reward Amount',
      render: (value) => value ? formatCurrency(value) : '-'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (value) => formatDateTime(value)
    }
  ];

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" color="primary" text="Loading referral data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Management</h1>
          <p className="text-gray-600">Manage your referrals and track your rewards</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiUsers className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {referralStats?.overview?.totalReferrals || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiDollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Rewards</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(referralStats?.earnings?.totalRewardsEarned || 0)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiCheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Successful</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {referralStats?.overview?.successfulReferrals || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiClock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {referralStats?.overview?.pendingReferrals || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Referral Code Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Referral Code</h3>
                <FiGift className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={referralStats?.referralCode || ''}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono"
                      />
                      <Button
                        onClick={copyReferralCode}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        {copiedCode ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={referralStats?.referralLink || ''}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm"
                    />
                    <Button
                      onClick={copyReferralLink}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <FiShare2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <FiTrendingUp className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">How it works</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Share your referral link with friends. When they sign up and make their first deposit, 
                        you'll earn rewards based on their investment plan!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Referred Users Section */}
            {referralStats?.allReferredUsers && referralStats.allReferredUsers.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Referred Users</h3>
                  <span className="text-sm text-gray-500">
                    {referralStats.allReferredUsers.length} user{referralStats.allReferredUsers.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {referralStats.allReferredUsers.map((referral, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {referral.referredUser.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {referral.referredUser.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {referral.referredUser.email}
                              </p>
                              <p className="text-xs text-gray-400">
                                Joined: {formatDateTime(referral.referredUser.joinedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            referral.referralDetails.status === 'no_deposit' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : referral.referralDetails.status === 'deposited'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {referral.referralDetails.status === 'no_deposit' ? 'No Deposit' : 
                             referral.referralDetails.status === 'deposited' ? 'Deposited' : 
                             referral.referralDetails.status}
                          </div>
                          {referral.referralDetails.depositAmount && (
                            <p className="text-sm font-medium text-green-600 mt-1">
                              {formatCurrency(referral.referralDetails.depositAmount)}
                            </p>
                          )}
                          {referral.referralDetails.rewardAmount && (
                            <p className="text-sm font-medium text-blue-600">
                              Reward: {formatCurrency(referral.referralDetails.rewardAmount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Referral Transactions</h3>
              <Button
                onClick={fetchReferralData}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </div>

            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={fetchReferralData}
                  variant="outline"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div>
                <Table
                  columns={transactionColumns}
                  data={referralTransactions}
                  className="mt-4"
                />
                
                {/* Additional Details for Approved Transactions */}
                {referralTransactions.some(t => t.status === 'approved' && t.approvedAt) && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Approved Transactions</h4>
                    <div className="space-y-2">
                      {referralTransactions
                        .filter(t => t.status === 'approved' && t.approvedAt)
                        .map((transaction, index) => (
                          <div key={index} className="text-sm text-green-700">
                            <span className="font-medium">{transaction.referred?.name}</span> - 
                            Approved by <span className="font-medium">{transaction.approvedBy?.name}</span> on{' '}
                            <span className="font-medium">{formatDateTime(transaction.approvedAt)}</span>
                            {transaction.rewardAmount && (
                              <span className="ml-2 text-green-600">
                                (Reward: {formatCurrency(transaction.rewardAmount)})
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReferalManage;