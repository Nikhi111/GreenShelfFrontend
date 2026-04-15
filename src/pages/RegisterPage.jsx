import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, CheckCircle, AlertTriangle, User, Store, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/auth/InputField';
import Button from '../components/auth/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const roles = [
    {
      value: 'USER',
      label: 'Customer',
      description: 'Buy plants and manage orders',
      icon: <User className="h-5 w-5" />,
      color: 'text-blue-600 border-blue-600'
    },
    {
      value: 'SELLER',
      label: 'Seller',
      description: 'Sell plants on GreenShelf',
      icon: <Store className="h-5 w-5" />,
      color: 'text-green-600 border-green-600'
    },
    {
      value: 'ADMIN',
      label: 'Admin',
      description: 'Manage platform',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-purple-600 border-purple-600'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitError('');
    
    try {
      await register(formData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Redirecting to login...
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
                className="bg-green-600 h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4"
          >
            <Leaf className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900"
          >
            Create your account
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-gray-600"
          >
            Join GreenShelf and start your plant journey
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">{submitError}</div>
              </motion.div>
            )}

            {/* Username Field */}
            <InputField
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              error={errors.username}
              required
              disabled={isLoading}
              autoComplete="username"
            />

            {/* Password Field */}
            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                error={errors.password}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Account Type <span className="text-red-500 ml-1">*</span>
              </label>
              
              <div className="space-y-2">
                {roles.map((role) => (
                  <motion.label
                    key={role.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.role === role.value 
                        ? `border-current ${role.color} bg-current bg-opacity-5` 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                    
                    <div className={`flex items-center gap-3 ${role.color}`}>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${formData.role === role.value 
                          ? 'border-current' 
                          : 'border-gray-300'
                        }
                      `}>
                        {formData.role === role.value && (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {role.icon}
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                        </div>
                      </div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              size="large"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500"
        >
          <p>&copy; 2024 GreenShelf. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
