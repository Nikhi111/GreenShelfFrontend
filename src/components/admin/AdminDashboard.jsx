import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, CheckCircle, Clock, TrendingUp, ShoppingCart, Package, Activity, DollarSign, AlertCircle, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalNurseries: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    recentSellers: [],
    recentNurseries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics from backend
      const statsResponse = await api.get('/admin/statistics');
      
      // Fetch recent sellers and nurseries
      const [sellersResponse, nurseriesResponse] = await Promise.all([
        api.get('/admin/sellers?page=0&size=3'),
        api.get('/admin/nurseries?page=0&size=3')
      ]);

      setStats({
        totalUsers: statsResponse.data.totalUsers || 0,
        totalSellers: statsResponse.data.totalSellers || 0,
        totalNurseries: statsResponse.data.totalNurseries || 0,
        totalProducts: statsResponse.data.totalProducts || 0,
        totalOrders: statsResponse.data.totalOrders || 0,
        totalRevenue: statsResponse.data.totalRevenue || 0,
        pendingVerifications: statsResponse.data.pendingVerifications || 0,
        recentSellers: sellersResponse.data.content || [],
        recentNurseries: nurseriesResponse.data.content || []
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick, clickable }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: clickable ? 1.02 : 1.02, y: clickable ? -4 : -2 }}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onClick={clickable ? onClick : undefined}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${
        clickable ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 mb-1">
            {title.includes('Revenue') ? formatINR(value) : value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">12% from last month</span>
        </div>
      )}
    </motion.div>
  );

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
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/seller-verification')}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-500"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Seller Verification</h3>
                  <p className="text-gray-600">Review and approve seller applications</p>
                </div>
                <div className="text-yellow-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/nursery-verification')}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-green-500"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Nursery Verification</h3>
                  <p className="text-gray-600">Review and approve nursery applications</p>
                </div>
                <div className="text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="bg-blue-500"
              trend={true}
              subtitle="Registered customers"
            />
            <StatCard
              title="Total Sellers"
              value={stats.totalSellers}
              icon={Building2}
              color="bg-purple-500"
              trend={true}
              subtitle="Active sellers"
            />
            <StatCard
              title="Total Nurseries"
              value={stats.totalNurseries}
              icon={Building2}
              color="bg-green-500"
              trend={true}
              subtitle="Verified nurseries"
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              color="bg-yellow-500"
              trend={true}
              subtitle="Available products"
            />
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="bg-orange-500"
              trend={true}
              subtitle="Completed orders"
            />
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              icon={DollarSign}
              color="bg-emerald-500"
              trend={true}
              subtitle="Lifetime revenue"
            />
            <StatCard
              title="Pending Verifications"
              value={stats.pendingVerifications}
              icon={Clock}
              color="bg-red-500"
              subtitle="Awaiting approval"
              onClick={() => navigate('/admin/seller-verification')}
              clickable={true}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sellers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Sellers
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentSellers.length > 0 ? (
                  stats.recentSellers.map((seller, index) => (
                    <div key={seller.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{seller.name}</p>
                          <p className="text-sm text-gray-500">{seller.nurseryName || 'No nursery name'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        seller.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {seller.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent sellers</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Recent Nurseries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Recent Nurseries
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentNurseries.length > 0 ? (
                  stats.recentNurseries.map((nursery, index) => (
                    <div key={nursery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{nursery.name}</p>
                          <p className="text-sm text-gray-500">{nursery.licenceNumber || 'No license'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        nursery.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {nursery.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent nurseries</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
