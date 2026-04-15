import React from 'react';
import { Droplets, Sun, Heart, TrendingUp, Flower2 } from 'lucide-react';

const ProductMeta = ({ product }) => {
  const metaItems = [
    {
      icon: <Droplets className="h-5 w-5" />,
      label: 'Watering Frequency',
      value: product.wateringFrequency || 'Not specified',
      color: 'text-blue-600'
    },
    {
      icon: <Droplets className="h-5 w-5" />,
      label: 'Watering Days',
      value: product.wateringDays || 'Not specified',
      color: 'text-blue-600'
    },
    {
      icon: <Sun className="h-5 w-5" />,
      label: 'Sunlight',
      value: product.sunlight || 'Not specified',
      color: 'text-yellow-600'
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: 'Care Level',
      value: product.careLevel || 'Not specified',
      color: 'text-red-600'
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Growth Rate',
      value: product.growthRate || 'Not specified',
      color: 'text-green-600'
    },
    {
      icon: <Flower2 className="h-5 w-5" />,
      label: 'Flowering Season',
      value: product.floweringSeason || 'Not specified',
      color: 'text-pink-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plant Care Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metaItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`${item.color} mt-1`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {item.label}
              </p>
              <p className="text-sm text-gray-600">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Soil Type and Hardiness Zone */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Soil Type</h3>
          <p className="text-sm text-gray-600">
            {product.soilType || 'Not specified'}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Hardiness Zone</h3>
          <p className="text-sm text-gray-600">
            {product.hardinessMin && product.hardinessMax
              ? `${product.hardinessMin} - ${product.hardinessMax}`
              : 'Not specified'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductMeta;
