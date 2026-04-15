import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Package, 
  Settings,
  LogOut,
  ShieldCheck,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Overview', icon: BarChart3, path: '/admin/dashboard' },
    { name: 'Seller Verification', icon: ShieldCheck, path: '/admin/seller-verification' },
    { name: 'Nursery Verification', icon: Building2, path: '/admin/nursery-verification' },
    { name: 'Product Management', icon: Package, path: '/admin/products' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-gray-900 text-gray-300">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10 text-white">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">Admin Portal</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'hover:bg-gray-800 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-96">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search sellers, users, orders..." 
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 hover:text-green-600 transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
