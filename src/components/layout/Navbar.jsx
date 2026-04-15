import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ShoppingCart, User, LogOut, Leaf,
  Search, Heart, Package, Settings, HelpCircle, Sparkles
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../store/cartStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCartStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = getCartCount();

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Leaf className="h-4 w-4" /> },
    { name: 'Products', href: '/products', icon: <Package className="h-4 w-4" /> },
    { name: 'AI Advisor', href: '/ai-advisor', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'About', href: '/about', icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GreenShelf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors ${
                  location.pathname === link.href ? 'text-green-600 font-medium' : ''
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <button className="p-2 text-gray-700 hover:text-green-600 transition-colors">
              <Heart className="h-6 w-6" />
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              /* Logged in user */
              <div className="relative profile-menu">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.username || 'User'}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    >
                      <button
                        onClick={handleDashboardNavigation}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Dashboard
                          {isAuthenticated && user?.role === 'ADMIN' && (
                            <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </button>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Orders
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Settings
                        </div>
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not logged in */
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search plants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <div className="space-y-2 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors ${
                        location.pathname === link.href ? 'text-green-600 bg-green-50 font-medium' : ''
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                {!isAuthenticated && (
                  <div className="space-y-2 px-4 pt-4 border-t border-gray-200">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-2 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;