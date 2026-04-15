import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../products/Loader';
import { AlertCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: isLoading } = useAuth();

  // Role normalization helper
  const getCurrentRole = () => user?.role?.toUpperCase() || 'NONE';
  const role = getCurrentRole();

  // Show loading while auth is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  console.log('=== ProtectedRoute Debug ===');
  console.log('Required role:', requiredRole);
  console.log('Current role:', role);
  console.log('User:', user);
  console.log('Is authenticated:', isAuthenticated);
  
  // Handle multiple role names for sellers
  const hasRequiredRole = requiredRole ? 
    (Array.isArray(requiredRole) ? requiredRole.includes(role) : 
     (requiredRole === 'SELLER' && role === 'VENDER') || 
     (requiredRole === 'VENDER' && role === 'SELLER') || 
     role === requiredRole) : true;
  
  console.log('Role comparison:', role, '===', requiredRole, '?', hasRequiredRole);
  
  if (!hasRequiredRole) {
    const handleDashboardRedirect = () => {
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'SELLER' || role === 'VENDER') navigate('/seller/dashboard');
      else navigate('/user/dashboard');
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-8 px-4">
            You don't have permission to access this area. Your current role is <span className="font-bold text-gray-900">{role}</span>.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleDashboardRedirect}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Go to My Dashboard</span>
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-50">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Required Role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log('ACCESS GRANTED - Role check passed');
  console.log('=== End ProtectedRoute Debug ===');

  return children;
};

export default ProtectedRoute;
