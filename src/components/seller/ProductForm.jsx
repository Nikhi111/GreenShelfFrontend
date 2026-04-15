import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Package, DollarSign, Box } from 'lucide-react';
import PlantSearchDropdown from './PlantSearchDropdown';
import api from '../../utils/api';

const ProductForm = ({ nurseryId, onProductAdded }) => {
  const [formData, setFormData] = useState({
    plant: null,
    price: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plant) {
      newErrors.plant = 'Please select a plant';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePlantSelect = (plant) => {
    setFormData(prev => ({
      ...prev,
      plant
    }));

    // Clear plant error when plant is selected
    if (errors.plant) {
      setErrors(prev => ({
        ...prev,
        plant: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        plantId: formData.plant.id,
        prize: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      await api.post(`/seller/nursery/${nurseryId}/product`, payload);

      // Show success toast
      setToast({
        type: 'success',
        message: 'Product Added Successfully!'
      });

      // Reset form
      setFormData({
        plant: null,
        price: '',
        stock: ''
      });

      // Notify parent component
      if (onProductAdded) {
        onProductAdded();
      }

      // Hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);

    } catch (err) {
      console.error('Error adding product:', err);
      
      // Handle specific error scenarios
      let errorMessage = 'Failed to add product. Please try again.';
      
      if (err.response?.status === 403) {
        errorMessage = 'Access denied: You do not have permission to add products to this nursery. Please contact support if you believe this is an error.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Nursery not found. Please make sure you have a verified nursery before adding products.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid product data. Please check all fields and try again.';
      } else {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setToast({
        type: 'error',
        message: errorMessage
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      plant: null,
      price: '',
      stock: ''
    });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    >
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Package className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
          <p className="text-gray-600">Add a new plant product to your nursery</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plant Selection */}
        <PlantSearchDropdown
          selectedPlant={formData.plant}
          onSelectPlant={handlePlantSelect}
          error={errors.plant}
        />

        {/* Price and Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Price (INR) <span className="text-red-500">*</span></span>
              </div>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Box className="w-4 h-4" />
                <span>Stock Quantity <span className="text-red-500">*</span></span>
              </div>
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{loading ? 'Adding Product...' : 'Add Product'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
