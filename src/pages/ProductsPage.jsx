import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/products/ProductCard';
import FiltersSidebar from '../components/products/FiltersSidebar';
import SearchBar from '../components/products/SearchBar';
import SortDropdown from '../components/products/SortDropdown';
import Loader from '../components/products/Loader';
import { productService } from '../services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    nursery: '',
    inStock: true
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart } = useCartStore();

  // Fetch products with filters and search
  const fetchProducts = useCallback(async (pageNum = 0, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pageNum,
        size: 12,
        search: searchTerm,
        category: filters.category,
        nursery: filters.nursery,
        sort: sortBy === 'popularity' ? 'name,asc' : 
              sortBy === 'price-low-high' ? 'prize,asc' :
              sortBy === 'price-high-low' ? 'prize,desc' :
              sortBy === 'newest' ? 'id,desc' :
              sortBy === 'rating' ? 'name,asc' : // TODO: Update when rating is available
              sortBy === 'name-az' ? 'name,asc' : 'name,asc'
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('Fetching products with params:', params);
      const response = await productService.getProducts(params);
      console.log('API Response:', response);
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...response.data]);
      } else {
        setProducts(response.data);
      }
      
      setHasMore(!response.last);
      setPage(response.page);
      
      console.log('Products loaded:', response.data.length, 'Total:', response.total);
      
      // Log image URLs for debugging
      response.data.forEach((product, index) => {
        console.log(`Product ${index + 1}:`, {
          id: product.id,
          name: product.name,
          productImage: product.productImage,
          nurseryName: product.nurseryName,
          prize: product.prize
        });
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, sortBy]);

  // Initial fetch
  useEffect(() => {
    fetchProducts(0, false);
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(0, false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    // You could add a toast notification here
  };

  // Infinite scroll
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(page + 1, true);
    }
  };

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Loader key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <SortDropdown 
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
              
              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 bg-green-600 text-white rounded-lg"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <FiltersSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {products.length} products found
              </p>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>

            {/* Empty State */}
            {!loading && products.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard 
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Load More Products
                </button>
              </div>
            )}

            {/* Loading More Indicator */}
            {loading && products.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
