import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUpDown, TrendingUp, TrendingDown, Clock, Star } from 'lucide-react';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    {
      id: 'popularity',
      label: 'Popularity',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Most popular first'
    },
    {
      id: 'price-low-high',
      label: 'Price: Low to High',
      icon: <ArrowUpDown className="h-4 w-4 rotate-180" />,
      description: 'Lowest price first'
    },
    {
      id: 'price-high-low',
      label: 'Price: High to Low',
      icon: <ArrowUpDown className="h-4 w-4" />,
      description: 'Highest price first'
    },
    {
      id: 'newest',
      label: 'Newest',
      icon: <Clock className="h-4 w-4" />,
      description: 'Newest arrivals first'
    },
    {
      id: 'rating',
      label: 'Rating',
      icon: <Star className="h-4 w-4" />,
      description: 'Highest rated first'
    },
    {
      id: 'name-az',
      label: 'Name: A to Z',
      icon: <span className="text-xs font-bold">A-Z</span>,
      description: 'Alphabetical order'
    }
  ];

  const currentSort = sortOptions.find(option => option.id === sortBy) || sortOptions[0];

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

  const handleSortChange = (optionId) => {
    onSortChange(optionId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-green-500 hover:shadow-sm transition-all duration-200 min-w-[200px]"
      >
        <div className="flex items-center gap-2 flex-1">
          {currentSort.icon}
          <span className="text-sm font-medium text-gray-700">
            {currentSort.label}
          </span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors ${
                  sortBy === option.id ? 'bg-green-50 border-l-2 border-green-600' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                      {option.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {sortBy === option.id && (
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Additional Options */}
          <div className="px-4 py-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sort Indicator Badge */}
      {sortBy !== 'popularity' && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-600 rounded-full"></div>
      )}
    </div>
  );
};

export default SortDropdown;
