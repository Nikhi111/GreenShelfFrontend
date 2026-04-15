import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const NurseryCreationForm = ({ onNurseryCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    licenceNumber: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      pincode: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nursery name is required';
    }

    if (!formData.licenceNumber.trim()) {
      newErrors.licenceNumber = 'License number is required';
    }

    if (!formData.address.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }

    if (!formData.address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Handle nested address fields
    if (field.startsWith('address.')) {
      const addressField = field.substring(8); // Remove 'address.' prefix
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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
      setErrors({});

      const payload = {
        name: formData.name,
        licenceNumber: formData.licenceNumber,
        address: {
          addressLine1: formData.address.addressLine1,
          addressLine2: formData.address.addressLine2,
          addressLine3: formData.address.addressLine3,
          pincode: parseInt(formData.address.pincode)
        }
      };

      await api.post('/seller/nursery', payload);

      // Show success toast
      setToast({
        type: 'success',
        message: 'Nursery created successfully! It will be reviewed by our team.'
      });

      // Reset form
      setFormData({
        name: '',
        licenceNumber: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          pincode: ''
        }
      });

      // Notify parent component
      if (onNurseryCreated) {
        onNurseryCreated();
      }

      // Hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);

    } catch (err) {
      console.error('Error creating nursery:', err);
      
      let errorMessage = 'Failed to create nursery. Please try again.';
      
      if (err.response?.status === 400) {
        errorMessage = 'Invalid nursery data. Please check all fields and try again.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Nursery with this name already exists. Please try a different name.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to create a nursery.';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Building2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create Nursery</h2>
          <p className="text-gray-600">Set up your nursery to start adding products</p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white max-w-sm`}
        >
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nursery Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Green Valley Nursery"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.licenceNumber}
                onChange={(e) => handleInputChange('licenceNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.licenceNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="NUR-2024-001"
              />
              {errors.licenceNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.licenceNumber}</p>
              )}
            </div>
          </div>

          {/* Right Column - Address */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address.addressLine1}
                onChange={(e) => handleInputChange('address.addressLine1', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.addressLine1 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="123 Garden Street"
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address.addressLine2}
                onChange={(e) => handleInputChange('address.addressLine2', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.addressLine2 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Apartment 4B"
              />
              {errors.addressLine2 && (
                <p className="mt-1 text-sm text-red-600">{errors.addressLine2}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 3
              </label>
              <input
                type="text"
                value={formData.address.addressLine3}
                onChange={(e) => handleInputChange('address.addressLine3', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.addressLine3 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Near Main Market"
              />
              {errors.addressLine3 && (
                <p className="mt-1 text-sm text-red-600">{errors.addressLine3}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address.pincode}
                onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${
                  errors.pincode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="400001"
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Nursery...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Nursery</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NurseryCreationForm;
