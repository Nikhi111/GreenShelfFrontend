import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Navbar from './components/layout/Navbar';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthDiagnosticPage from './pages/AuthDiagnosticPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import SellerVerification from './pages/admin/SellerVerification';
import NurseryVerification from './pages/admin/NurseryVerification';
import SellerLayout from './components/SellerLayout';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrders from './pages/seller/Orders';
import UserLayout from './components/UserLayout';
import DashboardRedirect from './components/DashboardRedirect';
import RecommendationPage from './pages/RecommendationPage';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC & GUEST ROUTES */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
      <Route path="/products/:id" element={<MainLayout><ProductDetailsPage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
      <Route path="/auth-diagnostic" element={<MainLayout><AuthDiagnosticPage /></MainLayout>} />
      <Route path="/ai-advisor" element={<MainLayout><RecommendationPage /></MainLayout>} />
      
      {/* 2. PROTECTED USER (CUSTOMER) ROUTES */}
      <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<div>User Profile Dashboard</div>} />
        <Route path="orders" element={<div>User Orders History</div>} />
        <Route path="addresses" element={<div>Manage Addresses</div>} />
        <Route path="wishlist" element={<div>My Wishlist</div>} />
        <Route path="settings" element={<div>Account Settings</div>} />
      </Route>

      {/* Legacy/Redirect Routes */}
      <Route path="/cart" element={<ProtectedRoute><MainLayout><CartPage /></MainLayout></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><MainLayout><CheckoutPage /></MainLayout></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><MainLayout><PaymentPage /></MainLayout></ProtectedRoute>} />
      <Route path="/order-success" element={<ProtectedRoute><MainLayout><OrderSuccessPage /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
      
      {/* 3. PROTECTED SELLER ROUTES (Verification Integrated) */}
      <Route path="/seller" element={<ProtectedRoute requiredRole="SELLER"><SellerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="nurseries" element={<div>Nursery Management</div>} />
        <Route path="analytics" element={<div>Business Analytics</div>} />
        <Route path="settings" element={<div>Store Settings</div>} />
      </Route>
      
      {/* 4. PROTECTED ADMIN ROUTES */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="seller-verification" element={<SellerVerification />} />
        <Route path="nursery-verification" element={<NurseryVerification />} />
        <Route path="products" element={<div>Master Product List</div>} />
        <Route path="users" element={<div>User Management Panel</div>} />
        <Route path="settings" element={<div>System Configuration</div>} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
