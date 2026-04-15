import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  // Size configurations
  const sizeConfig = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  // Variant configurations
  const variantConfig = {
    primary: `
      bg-green-600 text-white hover:bg-green-700 
      focus:ring-2 focus:ring-green-500 focus:ring-offset-2
      disabled:bg-gray-400 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-gray-600 text-white hover:bg-gray-700
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
      disabled:bg-gray-400 disabled:cursor-not-allowed
    `,
    outline: `
      border-2 border-green-600 text-green-600 hover:bg-green-50
      focus:ring-2 focus:ring-green-500 focus:ring-offset-2
      disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
    `
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const currentVariant = variantConfig[variant] || variantConfig.primary;

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none
        ${currentSize}
        ${currentVariant}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      
      {loading ? (
        <span>{children}</span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
