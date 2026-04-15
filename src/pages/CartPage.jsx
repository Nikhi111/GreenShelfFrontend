import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    cartTotal,
    isLoading, 
    error, 
    syncCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
    
  } = useCartStore();

  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [itemErrors, setItemErrors] = useState({}); // Track errors per item
  
  // ✅ Compute these directly from cartItems and cartTotal
  const totalItems = cartItems.reduce((count, item) => count + (item.quantity || item.count || 0), 0);
  const totalPrice = cartTotal || 0;
  
  // Calculate itemTotal the same way as individual cart items
  const itemTotal = cartItems.reduce((total, item) => {
    const itemQuantity = item.quantity || item.count || 0;
    const itemPrice = item.prize || item.price || 0;
    return total + (itemPrice * itemQuantity);
  }, 0);
  
  // Calculate delivery fee based on cart total (free delivery over ₹500, otherwise ₹50)
  const deliveryFee = itemTotal > 500 ? 0 : 50;
  const tax = itemTotal * 0.18;
  const grandTotal = itemTotal + deliveryFee + tax;

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Clear previous error for this item
    setItemErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[productId];
      return newErrors;
    });
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      const result = await updateQuantity(productId, newQuantity);
      
      // If update failed, show error
      if (!result.success) {
        setItemErrors(prev => ({
          ...prev,
          [productId]: result.message || 'Failed to update quantity'
        }));
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page (you can create this later)
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cart Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={syncCart}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any plants to your cart yet.</p>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            Shopping Cart ({totalItems} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
                
                <AnimatePresence>
                  {cartItems.map((item, index) => {
                    const itemQuantity = item.quantity || item.count || 0;
                    const itemPrice = item.prize || item.price || 0;
                    const itemTotal = itemPrice * itemQuantity;
                    
                    return (
                      <motion.div
                        key={item.productId || item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.productImage || `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.productName || 'Plant')}`}
                              alt={item.productName}
                              className="w-20 h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.productName || 'Plant')}`;
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.productName}</h3>
                            <p className="text-sm text-gray-600 mb-2">Nursery: {item.nurseryName || 'Unknown'}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.productId || item.id, itemQuantity - 1)}
                                    disabled={itemQuantity <= 1 || updatingItems.has(item.productId || item.id)}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  
                                  <span className="px-3 py-2 min-w-[3rem] text-center font-medium">
                                    {updatingItems.has(item.productId || item.id) ? '...' : itemQuantity}
                                  </span>
                                  
                                  <button
                                    onClick={() => handleUpdateQuantity(item.productId || item.id, itemQuantity + 1)}
                                    disabled={updatingItems.has(item.productId || item.id)}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900">
                                    ₹{itemTotal.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ₹{itemPrice.toFixed(2)} each
                                  </p>
                                </div>
                              </div>

                              {/* Error Display */}
                              {itemErrors[item.productId || item.id] && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                  {itemErrors[item.productId || item.id]}
                                </div>
                              )}

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.productId || item.id)}
                                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{itemTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                {deliveryFee > 0 && itemTotal > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{(500 - itemTotal).toFixed(2)} more for free delivery
                  </p>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
                
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>🔒 Secure Checkout</span>
                  <span>🌿 Eco-Friendly</span>
                  <span>🚚 Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;