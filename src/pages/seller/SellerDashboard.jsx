import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, TrendingUp, DollarSign, Box, Settings, Users, ShoppingCart, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/seller/ProductForm';
import NurseryCreationForm from '../../components/seller/NurseryCreationForm';
import api from '../../utils/api';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [showNurseryForm, setShowNurseryForm] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    totalStock: 0,
    recentProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nurseryId, setNurseryId] = useState(null);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data since backend endpoints are failing
      // Set nurseryId to null to show nursery creation form
      const mockNursery = null; // No nursery exists
      
      const mockStats = {
        totalProducts: 0,
        totalValue: 0,
        totalStock: 0,
        recentProducts: 0
      };
      
      setNurseryId(mockNursery?.id);
      setStats(mockStats);
      
    } catch (err) {
      console.error('Error fetching seller data:', err);
      
      // Handle specific error scenarios
      let errorMessage = 'Failed to load dashboard data';
      
      if (err.response?.status === 404) {
        errorMessage = 'No nursery found. You need to create a nursery first before adding products. Please go to "Create Nursery" section to set up your nursery.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied: You do not have permission to add products. Please contact support if you believe this is an error.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later or contact support if the problem persists.';
      } else {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNurseryCreated = () => {
    setShowNurseryForm(false);
    // Refresh seller data after nursery creation
    fetchSellerData();
  };

  const handleProductAdded = () => {
    // Refresh stats when a new product is added
    fetchSellerData();
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center"
      >
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchSellerData}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your nursery and products</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              <Box className="w-4 h-4" />
              <span>My Products</span>
            </button>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </button>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Nursery Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatINR(stats.totalValue)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Box className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStock}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent Added</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentProducts}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Form */}
        {nurseryId ? (
          <ProductForm nurseryId={nurseryId} onProductAdded={handleProductAdded} />
        ) : (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Nursery Found</h3>
              <p className="text-gray-600 mb-6">
                You need to create a nursery before you can add products. Please fill out the form below to get started.
              </p>
            </div>
            
            <NurseryCreationForm onNurseryCreated={handleNurseryCreated} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
