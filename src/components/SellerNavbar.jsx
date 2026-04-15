import React from 'react';
import NurserySelector from './NurserySelector';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User, LogOut } from 'lucide-react';

const SellerNavbar = () => {
  const { seller, logout } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center space-x-8">
        <h2 className="text-xl font-bold text-gray-800 hidden md:block">Seller Dashboard</h2>
        <NurserySelector />
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden sm:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-64">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search orders, plants..." 
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-100"></div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">{seller?.username}</p>
            <p className="text-xs text-gray-500">Seller Account</p>
          </div>
          <div className="group relative">
            <button className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center border-2 border-transparent hover:border-green-500 transition-all overflow-hidden">
              <User className="w-6 h-6 text-green-600" />
            </button>
            
            {/* Simple Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 invisible group-hover:visible transition-all">
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerNavbar;
