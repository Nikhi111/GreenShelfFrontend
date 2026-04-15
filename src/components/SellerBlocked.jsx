import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SellerBlocked = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-95 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-100 rounded-full animate-pulse">
            <ShieldAlert className="w-16 h-16 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Verification</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-yellow-700 mr-2" />
            <span className="font-semibold text-yellow-700">Verification Pending</span>
          </div>
          <p className="text-yellow-700">
            Your seller account is currently under verification. Our administrative team will review your application shortly.
          </p>
        </div>
        
        <p className="text-gray-600 mb-8">
          Once your account is approved, you will have full access to your seller dashboard and inventory management tools.
        </p>
        
        <button
          onClick={logout}
          className="flex items-center justify-center w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        
        <p className="mt-6 text-sm text-gray-400">
          Need help? <a href="mailto:support@greenshelf.com" className="text-green-600 hover:underline">Contact Support</a>
        </p>
      </motion.div>
    </div>
  );
};

export default SellerBlocked;
