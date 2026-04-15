import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, Package, Plus, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const AddProductModal = ({ isOpen, onClose, nurseryId, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    prize: '',
    stock: ''
  });

  // Native debounce implementation using useEffect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get(`/seller/plants/search?name=${searchQuery}`);
        setSearchResults(response.data.content || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlant) {
      setError('Please select a plant from the catalog.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/seller/nursery/${nurseryId}/product`, {
        plantId: selectedPlant.id,
        prize: parseInt(formData.prize),
        stock: parseInt(formData.stock)
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({ prize: '', stock: '' });
      setSelectedPlant(null);
      setSearchQuery('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-green-600 text-white">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6" />
              <h2 className="text-xl font-bold">Add New Plant to Inventory</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Select Plant */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                1. Select Botanical Variety
              </label>
              
              {!selectedPlant ? (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for a plant (e.g. Rose, Neem...)"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-spin w-5 h-5" />
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {searchResults.map((plant) => (
                        <button
                          key={plant.id}
                          className="w-full text-left px-4 py-3 hover:bg-green-50 flex items-center space-x-3 transition-colors"
                          onClick={() => setSelectedPlant(plant)}
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                            {plant.commonName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{plant.commonName}</p>
                            <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {selectedPlant.commonName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-green-900">{selectedPlant.commonName}</p>
                      <p className="text-sm text-green-700">{selectedPlant.scientificName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPlant(null)}
                    className="text-xs font-bold text-green-600 hover:text-green-800 underline uppercase"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Pricing and Stock */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    2. Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="299"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    value={formData.prize}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    3. Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 px-6 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPlant}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all ${
                    (isSubmitting || !selectedPlant) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>List Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddProductModal;
