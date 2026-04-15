import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, Home, Package, Truck, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserOrders } = useOrderStore();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get order details from location state
    if (location.state) {
      setOrderDetails(location.state);
      console.log('🎉 Order success state:', location.state);
    } else {
      // Fallback: try to get from recent orders
      const fetchRecentOrder = async () => {
        await getUserOrders();
        const { orders } = useOrderStore.getState();
        if (orders && orders.length > 0) {
          setOrderDetails({
            orderId: orders[0].orderId,
            paymentId: 'Payment Successful',
            amount: orders[0].totalPrice
          });
        }
      };
      fetchRecentOrder();
    }
  }, [location.state, getUserOrders]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Order Details...</h2>
          <p className="text-gray-600">Please wait while we fetch your order information.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-semibold text-lg text-green-600">#{orderDetails.orderId}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium text-green-600">{orderDetails.paymentId}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-lg text-green-600">
                        {formatAmount(orderDetails.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      <span>Your order will be delivered within 3-5 business days</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      <span>You'll receive order confirmation via email</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      <span>Track your order status in My Orders</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Shopping</h3>
              <div className="space-y-3">
                <button
                  onClick={handleContinueShopping}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                
                <button
                  onClick={handleViewOrders}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                >
                  View My Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>📧 Email: support@greenself.com</p>
                <p>📞 Phone: +91-XXXXXXXXXX</p>
                <p>💬 WhatsApp: +91-XXXXXXXXXX</p>
                <p>⏰ Support Hours: 9 AM - 9 PM (Mon-Sat)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccessPage;
