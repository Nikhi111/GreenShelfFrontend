import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Truck, Package, Shield, Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, totalItems, clearCart, syncCart } = useCartStore();
  const { createOrder, isCreatingOrder, error } = useOrderStore();
  const { isAuthenticated } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    pincode: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Sync cart only when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated, syncCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAddress = () => {
    return (
      shippingAddress.AddressLine1.trim() !== '' &&
      shippingAddress.pincode.toString().trim() !== '' &&
      shippingAddress.pincode.toString().length === 6
    );
  };

  const handleCheckout = async () => {
    if (!validateAddress()) {
      alert('Please fill in complete shipping address');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      navigate('/products');
      return;
    }

    if (cartTotal === 0) {
      alert('Cart total is 0. Please add items before checkout.');
      navigate('/products');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🛒 Starting checkout with cart:', { cartItems, cartTotal });
      console.log('🛒 Shipping address:', shippingAddress);
      
      // 🔄 Refresh cart before creating order to ensure it's not expired
      console.log('🔄 Refreshing cart before order creation...');
      const { syncCart } = useCartStore.getState();
      await syncCart();
      
      // 🔄 Get updated cart state after sync
      const updatedCartState = useCartStore.getState();
      console.log('🔄 Updated cart state:', {
        items: updatedCartState.cartItems,
        total: updatedCartState.cartTotal,
        itemCount: updatedCartState.cartItems.length
      });
      
      // 🚨 Check if cart is still valid after refresh
      if (updatedCartState.cartItems.length === 0) {
        alert('Your cart has expired or is empty. Please add items again.');
        navigate('/products');
        return;
      }
      
      if (updatedCartState.cartTotal === 0) {
        alert('Your cart total is 0 after refresh. Please add items again.');
        navigate('/products');
        return;
      }
      
      // 🛒 Create order with refreshed cart
      const result = await createOrder(shippingAddress);
      
      if (result.success) {
        console.log("✅ Order created:", result.data);
        
        // Clear cart after successful order
        await clearCart();
        
        // Store Razorpay details for payment
        localStorage.setItem("razorpayOrder", JSON.stringify({
            razorpayOrderId: result.data.razorpayOrderId,
            keyId: result.data.keyId,
            amount: result.data.amount,
            currency: result.data.currency,
            orderId: result.data.orderId
        }));
        
        // Redirect to payment page
        navigate("/payment");
      } else {
        // Log detailed error information
        console.error("❌ Order creation failed:", result);
        console.error("❌ Result success:", result.success);
        console.error("❌ Result message:", result.message);
        console.error("❌ Result error:", result.error);
        console.error("❌ Full result object:", JSON.stringify(result, null, 2));
        
        // Handle specific cart-related errors
        if (result.message?.toLowerCase().includes('empty cart') || 
            result.message?.toLowerCase().includes('cart is empty') ||
            result.message?.toLowerCase().includes('expired') ||
            result.message?.toLowerCase().includes('invalid cart')) {
          alert('Your cart has expired or is invalid. Please add items again.');
          navigate('/products');
        } else {
          // Show detailed error message
          const errorMessage = result.message || result.error || "Failed to create order. Please check console for details.";
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Handle authentication errors (expired token)
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to create order. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAddress = () => {
    const parts = [
      shippingAddress.AddressLine1,
      shippingAddress.AddressLine2,
      shippingAddress.AddressLine3
    ].filter(line => line && line.trim() !== '');
    
    return parts.join(', ');
  };

  // Calculate delivery fee based on cart total (free delivery over ₹500, otherwise ₹50)
  const deliveryFee = cartTotal > 500 ? 0 : 50;
  const tax = cartTotal * 0.18;
  const grandTotal = cartTotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some plants to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Continue Shopping
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalItems})</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cart Items Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items ({totalItems})</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={item.productId || item.id} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                      <img
                        src={item.productImage || `https://via.placeholder.com/60x60?text=${encodeURIComponent(item.productName || 'Plant')}`}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{item.productName}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || item.count}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{((item.prize || item.price) * (item.quantity || item.count)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="AddressLine1"
                    value={shippingAddress.AddressLine1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="AddressLine2"
                    value={shippingAddress.AddressLine2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 3
                  </label>
                  <input
                    type="text"
                    name="AddressLine3"
                    value={shippingAddress.AddressLine3}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Landmark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    required
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isCreatingOrder || isProcessing || !validateAddress()}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isCreatingOrder || isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Shop With Us?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2 text-green-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-green-600" />
                  <span>Quality Plants</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
