import React from 'react';
import { useNursery } from '../context/NurseryContext';
import { ChevronDown, Store, AlertCircle, CheckCircle } from 'lucide-react';

const NurserySelector = () => {
  const { nurseries, selectedNursery, selectNursery, loading } = useNursery();

  if (loading) return <div className="animate-pulse h-10 w-48 bg-gray-200 rounded-lg"></div>;

  return (
    <div className="relative inline-block text-left w-full sm:w-64">
      <div className="group">
        <button className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-green-500 transition-all">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <Store className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Nursery</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                {selectedNursery ? selectedNursery.name : 'Select Nursery'}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 invisible group-hover:visible transition-all">
          <div className="p-1 max-h-60 overflow-y-auto">
            {nurseries.map((nursery) => (
              <button
                key={nursery.id}
                onClick={() => selectNursery(nursery)}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm rounded-lg transition-colors ${
                  selectedNursery?.id === nursery.id 
                    ? 'bg-green-50 text-green-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="font-semibold">{nursery.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[180px]">
                    {nursery.address?.addressLine1 || 'No address provided'}
                  </span>
                </div>
                {nursery.verified ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurserySelector;
