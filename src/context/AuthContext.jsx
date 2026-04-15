import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile
      const userResponse = await api.get('/user/me');
      setUser(userResponse.data);
      setIsAuthenticated(true);

      // If user is a SELLER, fetch seller profile
      if (userResponse.data.role === 'SELLER' || userResponse.data.role === 'VENDER') {
        const sellerResponse = await api.get('/seller/profile');
        const sellerData = sellerResponse.data;
        
        // Normalize seller data - handle backend naming variations
        const normalizedSeller = {
          ...sellerData,
          isApprovedSeller: sellerData.verified ?? sellerData.isVerified ?? sellerData.isApprovedSeller ?? false
        };
        
        setSeller(normalizedSeller);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    await checkAuth();
    return response.data;
  };

  const register = async (userData) => {
    // Use different endpoints based on user role
    if (userData.role === 'SELLER' || userData.role === 'VENDER') {
      // Seller registration uses seller-specific endpoint
      const response = await api.post('/seller/register', userData);
      return response.data;
    } else if (userData.role === 'ADMIN') {
      // Admin registration uses admin-specific endpoint
      const response = await api.post('/admin/register', userData);
      return response.data;
    } else {
      // Regular user registration uses user endpoint
      const response = await api.post('/user/register', userData);
      return response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setSeller(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, seller, loading, isAuthenticated, login, register, logout, refreshSeller: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
