import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check, AlertCircle, Loader } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { currentOrder } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log('✅ Razorpay script loaded');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      setPaymentError('Payment service unavailable. Please try again later.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeRazorpay = () => {
    try {
      const razorpayOrder = JSON.parse(localStorage.getItem('razorpayOrder'));
      
      if (!razorpayOrder) {
        console.error('❌ No Razorpay order found');
        setPaymentError('Order information not found. Please try again.');
        return;
      }

      console.log('🔧 Initializing Razorpay with:', razorpayOrder);

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'GreenSelf',
        description: `Order #${razorpayOrder.orderId}`,
        image: 'https://via.placeholder.com/100x100?text=GreenSelf',
        order_id: razorpayOrder.razorpayOrderId,
        handler: function (response) {
          console.log('✅ Payment successful:', response);
          
          // Payment successful
          setIsProcessing(false);
          
          // Clear stored order data
          localStorage.removeItem('razorpayOrder');
          
          // Navigate to success page
          navigate('/order-success', { 
            state: { 
              orderId: razorpayOrder.orderId,
              paymentId: response.razorpay_payment_id,
              amount: razorpayOrder.amount
            } 
          });
        },
        modal: {
          ondismiss: function () {
            console.log('❌ Payment cancelled by user');
            setIsProcessing(false);
            setPaymentError('Payment was cancelled. You can try again.');
          },
          escape: function () {
            console.log('❌ Payment modal escaped');
            setIsProcessing(false);
            setPaymentError('Payment window was closed. Please try again.');
          }
        },
        prefill: {
          contact: '',
          email: ''
        },
        theme: {
          color: '#10b981'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
      setIsProcessing(true);
      setPaymentError(null);
      
    } catch (error) {
      console.error('❌ Razorpay initialization error:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!razorpayLoaded) {
      setPaymentError('Payment service is still loading. Please wait...');
      return;
    }

    if (!currentOrder) {
      setPaymentError('Order information not found. Please try again.');
      return;
    }

    initializeRazorpay();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to find order information for payment.</p>
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-medium">#{currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{formatAmount(currentOrder.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending Payment
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {paymentError}
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !razorpayLoaded}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : !razorpayLoaded ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay {formatAmount(currentOrder.amount)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Click "Pay" button to open secure payment window</p>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Complete payment using UPI, Credit Card, Debit Card, or Net Banking</p>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>You will be redirected here after successful payment</p>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Do not refresh or close the payment window</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Payment</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <span>Razorpay Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
