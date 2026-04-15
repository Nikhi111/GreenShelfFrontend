import React from 'react';

// Product Card Skeleton Loader
const ProductCardLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Nursery Badge */}
        <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
        
        {/* Product Name */}
        <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        
        {/* Add to Cart Button */}
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// List View Skeleton Loader
const ListCardLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
      {/* Image Skeleton */}
      <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="flex-1 flex items-center justify-between">
        <div className="flex-1">
          {/* Product Name */}
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          
          {/* Nursery */}
          <div className="h-3 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
          </div>
          
          {/* Price */}
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Skeleton Loader
const FilterSidebarLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="h-6 bg-gray-200 rounded w-16 mb-6 animate-pulse"></div>
      
      {/* Category Section */}
      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Section */}
      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
        <div className="space-y-3">
          <div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Loader Component
const Loader = ({ type = 'card' }) => {
  switch (type) {
    case 'list':
      return <ListCardLoader />;
    case 'sidebar':
      return <FilterSidebarLoader />;
    case 'card':
    default:
      return <ProductCardLoader />;
  }
};

// Page Loading Spinner
export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600">Loading amazing plants...</p>
      </div>
    </div>
  );
};

// Inline Loading Spinner
export const InlineLoader = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-green-600`}></div>
  );
};

// Search Loading Skeleton
export const SearchLoader = () => {
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      <div className="py-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-4 py-2 flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
