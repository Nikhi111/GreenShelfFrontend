import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const role = user.role?.toUpperCase();

    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'SELLER' || role === 'VENDER') {
      navigate('/seller/dashboard');
    } else {
      // Regular user / customer
      navigate('/user/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
