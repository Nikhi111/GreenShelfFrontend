import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNursery } from '../context/NurseryContext';
import SellerBlocked from './SellerBlocked';
import SellerSidebar from './SellerSidebar';
import SellerNavbar from './SellerNavbar';
import { Outlet } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SellerLayout = () => {
  const { seller, loading: authLoading } = useAuth();
  const { selectedNursery } = useNursery();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );
  }

  // 1. GLOBAL LOCK: Seller not verified
  if (seller && !seller.isApprovedSeller) {
    return <SellerBlocked />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <SellerSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar with Nursery Selector */}
        <SellerNavbar />

        {/* Feature Restriction Banner for Pending Nurseries */}
        <AnimatePresence>
          {selectedNursery && !selectedNursery.verified && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-yellow-50 border-b border-yellow-100 px-6 py-3"
            >
              <div className="flex items-center space-x-3 text-yellow-800 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span>
                  <strong>Nursery Status: Pending Verification.</strong> Some features like product management and order processing are restricted until admin approval.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
