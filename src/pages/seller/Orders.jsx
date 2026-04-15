import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/seller/OrderTable';
import { useNursery } from '../../context/NurseryContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const Orders = () => {
  const { selectedNursery } = useNursery();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedNursery) {
      fetchOrders();
    }
  }, [selectedNursery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/seller/nurseries/${selectedNursery.id}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Mock data for demo
      setOrders([
        { id: 101, customerName: 'Nikhil Shinde', customerEmail: 'nikhil@example.com', itemsCount: 3, totalAmount: 1250, status: 'Shipped' },
        { id: 102, customerName: 'Aditya Patil', customerEmail: 'aditya@example.com', itemsCount: 1, totalAmount: 450, status: 'Delivered' },
        { id: 103, customerName: 'Sagar More', customerEmail: 'sagar@example.com', itemsCount: 2, totalAmount: 890, status: 'Pending' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    console.log('View order:', order);
  };

  const handleUpdateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Nursery Orders</h1>
      </div>

      <OrderTable 
        orders={orders}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
      />
    </motion.div>
  );
};

export default Orders;
