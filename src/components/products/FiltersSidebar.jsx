import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const FiltersSidebar = ({ filters, onFilterChange, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    nursery: true,
    availability: true
  });

  const categories = [
    { id: 'indoor', name: 'Indoor Plants', count: 45 },
    { id: 'outdoor', name: 'Outdoor Plants', count: 32 },
    { id: 'succulents', name: 'Succulents', count: 28 },
    { id: 'flowering', name: 'Flowering Plants', count: 19 },
    { id: 'medicinal', name: 'Medicinal Plants', count: 15 },
    { id: 'herbs', name: 'Herbs', count: 22 }
  ];

  const nurseries = [
    { id: '1', name: 'Green Valley Nursery', count: 38 },
    { id: '2', name: 'Urban Garden Center', count: 25 },
    { id: '3', name: 'Nature\'s Best', count: 31 },
    { id: '4', name: 'Plant Paradise', count: 19 }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    });
  };

  const handleCategoryToggle = (categoryId) => {
    const newCategory = filters.category === categoryId ? '' : categoryId;
    onFilterChange({ category: newCategory });
  };

  const handleNurseryToggle = (nurseryId) => {
    const newNursery = filters.nursery === nurseryId ? '' : nurseryId;
    onFilterChange({ nursery: newNursery });
  };

  const handleAvailabilityToggle = () => {
    onFilterChange({ inStock: !filters.inStock });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      nursery: '',
      inStock: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAllFilters}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Clear All
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="font-medium text-gray-900">Category</h3>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map(category => (
              <label 
                key={category.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category.id}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-xs text-gray-500">({category.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="font-medium text-gray-900">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Min Price</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Max Price</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(filters.maxPrice / 1000) * 100}%, #e5e7eb ${(filters.maxPrice / 1000) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹1000</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nursery Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('nursery')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="font-medium text-gray-900">Nursery</h3>
          {expandedSections.nursery ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.nursery && (
          <div className="space-y-2">
            {nurseries.map(nursery => (
              <label 
                key={nursery.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="nursery"
                    checked={filters.nursery === nursery.id}
                    onChange={() => handleNurseryToggle(nursery.id)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{nursery.name}</span>
                </div>
                <span className="text-xs text-gray-500">({nursery.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="font-medium text-gray-900">Availability</h3>
          {expandedSections.availability ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={handleAvailabilityToggle}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(filters.category || filters.nursery || filters.minPrice > 0 || filters.maxPrice < 1000) && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {categories.find(c => c.id === filters.category)?.name}
                <button
                  onClick={() => handleCategoryToggle(filters.category)}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.nursery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {nurseries.find(n => n.id === filters.nursery)?.name}
                <button
                  onClick={() => handleNurseryToggle(filters.nursery)}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                ₹{filters.minPrice} - ₹{filters.maxPrice}
                <button
                  onClick={() => onFilterChange({ minPrice: 0, maxPrice: 1000 })}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersSidebar;
