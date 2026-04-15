import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const PlantSearchDropdown = ({ selectedPlant, onSelectPlant, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch all plants on component mount
  useEffect(() => {
    fetchPlants();
  }, []);

  // Filter plants based on search term
  useEffect(() => {
    if (searchTerm && searchTerm.trim()) {
      const filtered = plants.filter(plant =>
        (plant.commonName && plant.commonName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plant.scientificName && plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plant.name && plant.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPlants(filtered.slice(0, 10)); // Show max 10 results
    } else {
      setFilteredPlants(plants.slice(0, 10)); // Show first 10 plants
    }
  }, [searchTerm, plants]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      console.log('Starting plants fetch...');
      const response = await api.get('/plants');
      console.log('Full API Response:', response); // Debug full response
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let plantsData = [];
      if (Array.isArray(response.data)) {
        console.log('Response is direct array');
        plantsData = response.data;
      } else if (response.data && response.data.content && Array.isArray(response.data.content)) {
        console.log('Response is Spring Pageable format');
        plantsData = response.data.content;
      } else if (response.data && response.data.plants && Array.isArray(response.data.plants)) {
        console.log('Response has nested plants object');
        plantsData = response.data.plants;
      } else {
        console.log('Unexpected response format, using empty array');
        plantsData = [];
      }
      
      console.log('Final plantsData:', plantsData);
      setPlants(plantsData);
      setFilteredPlants(plantsData.slice(0, 10));
    } catch (err) {
      console.error('Error fetching plants:', err);
      console.error('Error details:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleSelectPlant = (plant) => {
    onSelectPlant(plant);
    setSearchTerm(plant.name);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onSelectPlant(null);
    setSearchTerm('');
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Plant <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Search and select a plant..."
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          } ${selectedPlant ? 'bg-green-50 border-green-300' : 'bg-white'}`}
        />
        {selectedPlant && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
          >
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
              </div>
            ) : filteredPlants.length === 0 ? (
              <div className="py-4 px-4 text-center text-gray-500">
                {searchTerm.trim() ? 'No plants found' : 'No plants available'}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {filteredPlants.map((plant) => (
                  <motion.button
                    key={plant.plantId}
                    type="button"
                    onClick={() => handleSelectPlant(plant)}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center justify-between ${
                      selectedPlant?.plantId === plant.plantId ? 'bg-green-100 border-l-4 border-green-500' : ''
                    }`}
                    whileHover={{ backgroundColor: '#f0fdf4' }}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {plant.commonName || plant.scientificName || plant.name || `Plant #${plant.plantId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {plant.scientificName || plant.commonName || `ID: ${plant.plantId}`}
                      </div>
                    </div>
                    {selectedPlant?.plantId === plant.plantId && (
                      <div className="text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7l4 4" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PlantSearchDropdown;
