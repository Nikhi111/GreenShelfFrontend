import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions = [
    'Monstera Deliciosa',
    'Snake Plant',
    'Pothos',
    'Fiddle Leaf Fig',
    'Peace Lily',
    'Rubber Plant',
    'ZZ Plant',
    'Aloe Vera',
    'Spider Plant',
    'Boston Fern'
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      setIsFocused(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search for plants, herbs, succulents..."
          className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
            isFocused 
              ? 'border-green-500 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}

        {/* Loading Indicator (for future API integration) */}
        {/* {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          </div>
        )} */}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center justify-between"
              >
                <span>{suggestion}</span>
                <Search className="h-3 w-3 text-gray-400" />
              </button>
            ))}
          </div>
          
          {/* View All Results */}
          <div className="border-t border-gray-100 px-4 py-2">
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View all results for "{searchTerm}"
            </button>
          </div>
        </div>
      )}

      {/* Recent Searches (when no search term) */}
      {isFocused && !searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
          </div>
          <div className="py-1">
            {['Monstera', 'Snake Plant', 'Indoor Plants'].map((recent, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(recent)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-gray-400" />
                  <span>{recent}</span>
                </div>
                <span className="text-xs text-gray-400">Recent</span>
              </button>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={() => {
                // Clear recent searches
                console.log('Clear recent searches');
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear recent searches
            </button>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {isFocused && !searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Search Tips</h3>
          </div>
          <div className="px-4 py-3">
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Search by plant name, category, or features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Try "indoor", "low light", or "pet friendly"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Use quotes for exact phrases: "snake plant"</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
