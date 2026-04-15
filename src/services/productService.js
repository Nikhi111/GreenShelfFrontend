import { apiClient } from '../utils/api';

export const productService = {
  // Get all products with pagination
  getProducts: async (params = {}) => {
    const {
      page = 0,
      size = 12,
      search = '',
      category = '',
      nursery = '',
      sort = 'name,asc'
    } = params;

    try {
      let url = '/products/public'; // Use the actual endpoint from backend
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', page);
      queryParams.append('size', size);
      
      // Add sorting parameter
      if (sort) queryParams.append('sort', sort);

      // Handle search separately as it uses different endpoint
      if (search) {
        url = '/products/search';
        queryParams.append('keyword', search);
        queryParams.delete('sort'); // Search endpoint doesn't support sort
      }

      // Handle category filter
      if (category) {
        url = `/products/category/${category}`;
      }

      // Handle nursery filter
      if (nursery) {
        url = `/products/nursery/${nursery}`;
      }

      console.log('Making API call to:', url, 'with params:', queryParams.toString());
      const response = await apiClient.get(`${url}?${queryParams}`);
      
      // Handle Spring Boot Page response format
      return {
        data: response.data.content || [],
        total: response.data.totalElements || 0,
        page: response.data.number || 0,
        totalPages: response.data.totalPages || 0,
        size: response.data.size || size,
        first: response.data.first || true,
        last: response.data.last || true
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  // Get detailed product info with plant properties
  getProductDetails: async (productId) => {
    try {
      const response = await apiClient.get(`/products/details/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (keyword, params = {}) => {
    const { page = 0, size = 12 } = params;
    
    try {
      const response = await apiClient.get(`/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
      
      return {
        data: response.data.content || [],
        total: response.data.totalElements || 0,
        page: response.data.number || 0,
        totalPages: response.data.totalPages || 0
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const { page = 0, size = 12, sort = 'name,asc' } = params;
    
    try {
      const response = await apiClient.get(`/products/category/${category}?page=${page}&size=${size}&sort=${sort}`);
      
      return {
        data: response.data.content || [],
        total: response.data.totalElements || 0,
        page: response.data.number || 0,
        totalPages: response.data.totalPages || 0
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get products by nursery
  getProductsByNursery: async (nurseryId, params = {}) => {
    const { page = 0, size = 12, sort = 'name,asc' } = params;
    
    try {
      const response = await apiClient.get(`/products/nursery/${nurseryId}?page=${page}&size=${size}&sort=${sort}`);
      
      return {
        data: response.data.content || [],
        total: response.data.totalElements || 0,
        page: response.data.number || 0,
        totalPages: response.data.totalPages || 0
      };
    } catch (error) {
      console.error('Error fetching products by nursery:', error);
      throw error;
    }
  },

  // Get featured products (mock implementation - backend doesn't have this endpoint yet)
  getFeaturedProducts: async (limit = 8) => {
    try {
      // Use the actual endpoint from backend
      console.log('Fetching featured products from /products/public');
      const response = await apiClient.get(`/products/public?page=0&size=${limit}&sort=name,asc`);
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Mock methods for future implementation
  getTrendingProducts: async (limit = 8) => {
    // TODO: Implement when backend adds trending endpoint
    return this.getFeaturedProducts(limit);
  },

  getNewArrivals: async (limit = 8) => {
    // TODO: Implement when backend adds new arrivals endpoint
    return this.getFeaturedProducts(limit);
  },

  getCategories: async () => {
    // TODO: Implement when backend adds categories endpoint
    // For now, return common plant categories
    return [
      { id: 'indoor', name: 'Indoor Plants', count: 0 },
      { id: 'outdoor', name: 'Outdoor Plants', count: 0 },
      { id: 'succulents', name: 'Succulents', count: 0 },
      { id: 'flowering', name: 'Flowering Plants', count: 0 },
      { id: 'medicinal', name: 'Medicinal Plants', count: 0 },
      { id: 'herbs', name: 'Herbs', count: 0 }
    ];
  },

  getNurseries: async () => {
    // TODO: Implement when backend adds nurseries endpoint
    // For now, return mock data
    return [
      { id: 1, name: 'Green Valley Nursery', count: 0 },
      { id: 2, name: 'Urban Garden Center', count: 0 },
      { id: 3, name: 'Nature\'s Best', count: 0 },
      { id: 4, name: 'Plant Paradise', count: 0 }
    ];
  }
};

export default productService;
