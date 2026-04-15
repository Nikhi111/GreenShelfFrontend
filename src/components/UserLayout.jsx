import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from './layout/Navbar';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserLayout = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Profile', icon: User, path: '/user/dashboard' },
    { name: 'My Orders', icon: Package, path: '/user/orders' },
    { name: 'Addresses', icon: MapPin, path: '/user/addresses' },
    { name: 'Wishlist', icon: Heart, path: '/user/wishlist' },
    { name: 'Settings', icon: Settings, path: '/user/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 truncate max-w-[120px]">{user?.username}</h3>
                  <p className="text-xs text-gray-500">Customer Account</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
