import React from 'react';
import { Star, Leaf } from 'lucide-react';

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-4">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.name || 'Unknown Plant'}
      </h1>

      {/* Scientific Name */}
      {product.scientificName && (
        <p className="text-lg text-gray-600 italic">
          {product.scientificName}
        </p>
      )}

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-green-600">
          ₹{product.prize?.toFixed(2) || '0.00'}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">(4.5 out of 5)</span>
      </div>

      {/* Nursery */}
      <div className="flex items-center gap-2 text-gray-600">
        <Leaf className="h-4 w-4 text-green-500" />
        <span>From {product.nurseryName || 'Local Nursery'}</span>
      </div>

      {/* Short Description */}
      {product.dsc && (
        <div className="text-gray-600 leading-relaxed">
          <p>{product.dsc}</p>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-green-600">In Stock</span>
      </div>
    </div>
  );
};

export default ProductInfo;
