import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Leaf } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

// Helper function to format image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/api/placeholder/300/200';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('https://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /api, it's probably from a different server
  if (imagePath.startsWith('/api/')) {
    return imagePath;
  }
  
  // If it's a relative path without leading slash, add backend base URL
  if (!imagePath.startsWith('/')) {
    return `https://greenshelf-sh2b.onrender.com/${imagePath}`;
  }
  
  // If it starts with / but not /api, add backend base URL
  if (imagePath.startsWith('/') && !imagePath.startsWith('/api/')) {
    return `https://greenshelf-sh2b.onrender.com${imagePath}`;
  }
  
  // Default fallback
  return imagePath;
};

const ProductCard = ({ product, viewMode = 'grid', onAddToCart }) => {
  const navigate = useNavigate();

  const handleQuickView = () => {
    // Navigate to product detail page
    navigate(`/products/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4"
      >
        {/* Image */}
        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
             onClick={handleQuickView}>
          <img 
            src={getImageUrl(product.productImage)} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/128/128';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
              <Leaf className="h-3 w-3 text-green-500" /> {product.nurseryName || 'Local Nursery'}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating || 0) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviews || 0})
                </span>
              </div>
              {product.stock > 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  In Stock
                </span>
              )}
            </div>
            <p className="text-lg font-bold text-green-600">
              ₹{product.prize?.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickView}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Details
            </button>
            <AddToCartButton 
              product={product} 
              size="small"
              showPrice={false}
              className="flex-shrink-0"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer border-2 border-green-500"
           onClick={handleQuickView}>
        <img 
          src={getImageUrl(product.productImage)} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{
            minHeight: '192px', // Ensure minimum height
            backgroundColor: '#f3f4f6' // Light background while loading
          }}
          onError={(e) => {
            console.log('Image failed to load:', getImageUrl(product.productImage));
            e.target.src = '/api/placeholder/300/200';
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', getImageUrl(product.productImage));
          }}
        />
        
        {/* Stock Badge */}
        {product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            In Stock
          </div>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Nursery */}
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <Leaf className="h-3 w-3 text-green-500" />
          {product.nurseryName || 'Local Nursery'}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating || 0) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews || 0})
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-green-600">
              ₹{product.prize?.toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton 
          product={product} 
          className="w-full group-hover:shadow-md"
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
