import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNursery } from '../../context/NurseryContext';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { seller } = useAuth();
  const { selectedNursery } = useNursery();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    monthlySales: 0,
    activeOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (selectedNursery?.id) {
      fetchDashboardData();
    }
  }, [selectedNursery]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Performance Data
      const performanceRes = await api.get(`/seller/nursery/${selectedNursery.id}/dashboard/product-performance`);
      const performanceData = performanceRes.data || [];

      // 2. Fetch Orders Data
      const ordersRes = await api.get(`/seller/nursery/${selectedNursery.id}/orders`);
      const ordersData = ordersRes.data || [];

      // Calculate Metrics
      const totalRev = performanceData.reduce((sum, p) => sum + (p.totalRevenue || 0), 0);
      const monthlyRev = performanceData.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0);
      
      const activeOrds = ordersData.filter(order => 
        !['DELIVERED', 'CANCELLED', 'EXPIRED'].includes(order.orderStatus)
      ).length;

      setMetrics({
        totalProducts: performanceData.length,
        monthlySales: monthlyRev,
        activeOrders: activeOrds,
        totalRevenue: totalRev
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
        name: 'Total Products', 
        value: loading ? '...' : metrics.totalProducts, 
        icon: Package, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50' 
    },
    { 
        name: 'Monthly Sales', 
        value: loading ? '...' : `₹${metrics.monthlySales.toLocaleString()}`, 
        icon: DollarSign, 
        color: 'text-green-600', 
        bg: 'bg-green-50' 
    },
    { 
        name: 'Active Orders', 
        value: loading ? '...' : metrics.activeOrders, 
        icon: ShoppingBag, 
        color: 'text-purple-600', 
        bg: 'bg-purple-50' 
    },
    { 
        name: 'Total Revenue', 
        value: loading ? '...' : `₹${metrics.totalRevenue.toLocaleString()}`, 
        icon: TrendingUp, 
        color: 'text-orange-600', 
        bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {seller?.username}!</h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening at <span className="font-semibold text-green-600">{selectedNursery?.name || 'your nursery'}</span> today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
          ) : (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          <span className="text-sm font-medium text-gray-600 italic">
            {loading ? 'Refreshing data...' : 'Store is Live'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Performance Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Visual sales charts coming soon in the next update.</p>
                </div>
            </div>
          </div>
        </div>

        {/* Nursery Quick Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nursery Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600 font-medium">Verification Status</span>
                {selectedNursery?.verified ? (
                   <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Verified</span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span>
                )}
              </div>
              
              {!selectedNursery?.verified && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    Account is currently restricted. You will be notified once our team verifies your nursery details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
