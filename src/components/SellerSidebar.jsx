import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Store, 
  BarChart3, 
  Settings,
  Leaf
} from 'lucide-react';
import { useNursery } from '../context/NurseryContext';
import { useAuth } from '../context/AuthContext';

const SellerSidebar = () => {
  const { seller } = useAuth();
  const { selectedNursery } = useNursery();
  const isPending = selectedNursery && !selectedNursery.verified;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard', restricted: false },
    { name: 'Nurseries', icon: Store, path: '/seller/nurseries', restricted: false },
    { name: 'Products', icon: Package, path: '/seller/products', restricted: true },
    { name: 'Orders', icon: ShoppingBag, path: '/seller/orders', restricted: true },
    { name: 'Analytics', icon: BarChart3, path: '/seller/analytics', restricted: true },
    { name: 'Settings', icon: Settings, path: '/seller/settings', restricted: false },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen">
      <div className="p-6 flex-1">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">GreenShelf</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.restricted && isPending ? '#' : item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${item.restricted && isPending 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : isActive 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }
              `}
              onClick={(e) => {
                if (item.restricted && isPending) {
                  e.preventDefault();
                }
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {item.restricted && isPending && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-yellow-400"></span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-50 bg-white">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Account Status</p>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${seller?.isApprovedSeller ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-semibold text-gray-700">
              {seller?.isApprovedSeller ? 'Verified Seller' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSidebar;
