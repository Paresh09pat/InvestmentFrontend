import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUserCheck, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const ManageTrader = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
            <FiUserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Trader</h1>
            <p className="text-gray-600">Manage and oversee trader activities and performance</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/manage-trader/add-trader')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Trader</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Traders</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Traders</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">6</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search traders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <FiFilter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </motion.div>

      {/* Traders Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                      <div className="text-sm text-gray-500">john.doe@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">24</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 cursor-pointer">
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 cursor-pointer">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State Message */}
      <motion.div variants={itemVariants} className="text-center py-12">
        <div className="bg-gray-100 p-8 rounded-lg">
          <FiUserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trader Management</h3>
          <p className="text-gray-600 mb-4">This page will contain trader management functionality.</p>
          <p className="text-sm text-gray-500">Features coming soon: Add, edit, view, and manage trader profiles and performance.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManageTrader;
