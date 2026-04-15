import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const AddToCartButton = ({ 
  product, 
  quantity = 1, 
  className = '',
  showPrice = true,
  size = 'medium' // small, medium, large
}) => {
  const navigate = useNavigate();
  const { addToCart, isLoading } = useCartStore();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Size configurations
  const sizeConfig = {
    small: {
      button: 'px-3 py-2 text-sm',
      icon: 'h-4 w-4'
    },
    medium: {
      button: 'px-4 py-3 text-base',
      icon: 'h-5 w-5'
    },
    large: {
      button: 'px-6 py-4 text-lg',
      icon: 'h-6 w-6'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;

  const handleAddToCart = async (e) => {
    // Prevent event propagation if needed
    if (e) {
      e.stopPropagation();
    }

    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Please login to add items to cart');
      setStatus('error');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const result = await addToCart(product, quantity);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Added to cart!');
        
        // Reset success status after 2 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to add to cart');
        
        // Handle specific errors
        if (result.error === 'UNAUTHORIZED') {
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
        
        // Reset error status after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  // Get button content based on status
  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className={`${currentSize.icon} animate-spin`} />
            <span>Adding...</span>
          </>
        );
      
      case 'success':
        return (
          <>
            <CheckCircle className={currentSize.icon} />
            <span>{message}</span>
          </>
        );
      
      case 'error':
        return (
          <>
            <AlertTriangle className={currentSize.icon} />
            <span>{message}</span>
          </>
        );
      
      default:
        return (
          <>
            <ShoppingCart className={currentSize.icon} />
            <span>
              {showPrice && `Add to Cart - ₹${product.prize?.toFixed(2) || '0.00'}`}
              {!showPrice && 'Add to Cart'}
            </span>
          </>
        );
    }
  };

  // Get button styles based on status
  const getButtonStyles = () => {
    const baseStyles = `flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ${currentSize.button} ${className}`;
    
    switch (status) {
      case 'loading':
        return `${baseStyles} bg-gray-400 text-white cursor-not-allowed`;
      
      case 'success':
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700`;
      
      case 'error':
        return `${baseStyles} bg-red-500 text-white hover:bg-red-600`;
      
      default:
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-95`;
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={status === 'idle' ? { scale: 1.02 } : {}}
        whileTap={status === 'idle' ? { scale: 0.98 } : {}}
        onClick={handleAddToCart}
        disabled={status === 'loading' || status === 'success'}
        className={getButtonStyles()}
      >
        {getButtonContent()}
      </motion.button>

      {/* Tooltip for error messages */}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg whitespace-nowrap z-10"
        >
          {message}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
          </div>
        </motion.div>
      )}

      {/* Success indicator */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-4 w-4 text-white" />
        </motion.div>
      )}
    </div>
  );
};

export default AddToCartButton;
