import { debugApiClient } from '../utils/apiDebug';

export const cartService = {
  // Add item to cart
  addToCart: async (productId, count = 1) => {
    try {
      console.log('Adding to cart:', { productId, count });
      
      const response = await debugApiClient.post('/user/cart', {
        productId: Number(productId),
        count: Number(count)
      });
      
      console.log('Add to cart response:', response.data);
      console.log('Add to cart response type:', typeof response.data);
      console.log('Add to cart response keys:', response.data ? Object.keys(response.data) : 'null');
      
      // Log specific keys to understand backend response
      if (response.data && typeof response.data === 'object') {
        console.log('🛒 Backend add to cart response keys found:');
        Object.keys(response.data).forEach(key => {
          console.log(`  - ${key}:`, typeof response.data[key], response.data[key]);
        });
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Item added to cart successfully'
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Handle different error types
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please login to add items to cart'
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Product not found'
        };
      } else {
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: error.response?.data?.message || 'Failed to add item to cart'
        };
      }
    }
  },

  // Get cart contents
  getCart: async () => {
    try {
      const response = await debugApiClient.get('/user/cart');
      
      console.log('🔍 Raw backend response:', response);
      console.log('🔍 Response data:', response.data);
      console.log('🔍 Response data type:', typeof response.data);
      console.log('🔍 Response data keys:', response.data ? Object.keys(response.data) : 'null');
      
      // Log specific keys to understand backend structure
      if (response.data && typeof response.data === 'object') {
        console.log('🔍 Backend response keys found:');
        Object.keys(response.data).forEach(key => {
          console.log(`  - ${key}:`, typeof response.data[key], response.data[key]);
        });
      }
      
      // Handle case where backend returns empty object or undefined
      let cartData = response.data;
      
      // Check if backend is returning old structure (Cart entity) vs new structure (CartResponseDto)
      if (cartData && (cartData.cartproductList || cartData.totalPrize !== undefined)) {
        console.log('⚠️ Backend is returning OLD Cart entity structure, not new DTO!');
        console.log('🔄 Transforming old structure to new format...');
        
        // Transform old Cart entity to new DTO structure
        const transformedData = {
          items: cartData.cartproductList?.map(cartProduct => ({
            productId: cartProduct.product?.id || cartProduct.productId,
            productName: cartProduct.product?.name || `Product ${cartProduct.productId}`,
            productImage: cartProduct.product?.productImage || '',
            nurseryName: cartData.product?.nursery?.name || 'Unknown',
            prize: cartProduct.product?.prize || cartProduct.prizetotal || 0,
            count: cartProduct.count || 0,
            quantity: cartProduct.count || 0,
            id: cartProduct.product?.id || cartProduct.productId
          })) || [],
          total: cartData.totalPrize || 0,
          cartId: cartData.id
        };
        
        console.log('✅ Transformed data:', transformedData);
        cartData = transformedData;
      }
      
      return {
        success: true,
        data: cartData
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return {
        success: false,
        error: error.response?.status || 'NETWORK_ERROR',
        message: 'Failed to fetch cart contents'
      };
    }
  },

  // Update item quantity
  updateQuantity: async (productId, count) => {
    try {
      const response = await debugApiClient.patch(`/user/cart/${productId}?count=${count}`);
      return {
        success: true,
        data: response.data,
        message: 'Cart updated successfully'
      };
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      
      // Extract detailed error information
      let errorMessage = 'Failed to update cart';
      let errorDetails = null;
      
      if (error.response) {
        errorDetails = error.response.data;
        
        // Handle specific error types from backend
        if (error.response.status === 500) {
          if (errorDetails?.error?.toLowerCase().includes('out of stock')) {
            errorMessage = 'This product is out of stock';
          } else if (errorDetails?.error?.toLowerCase().includes('maximum')) {
            errorMessage = 'Maximum quantity limit reached';
          } else {
            errorMessage = errorDetails?.error || 'Server error occurred';
          }
        } else if (error.response.status === 400) {
          errorMessage = errorDetails?.error || 'Invalid request';
        }
      }
      
      return {
        success: false,
        error: error.response?.status || 'NETWORK_ERROR',
        message: errorMessage,
        details: errorDetails
      };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await debugApiClient.delete(`/user/cart/${productId}`);
      return {
        success: true,
        data: response.data,
        message: 'Item removed from cart'
      };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        error: error.response?.status || 'NETWORK_ERROR',
        message: 'Failed to remove item from cart'
      };
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await debugApiClient.delete('/user/cart');
      return {
        success: true,
        data: response.data,
        message: 'Cart cleared successfully'
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        error: error.response?.status || 'NETWORK_ERROR',
        message: 'Failed to clear cart'
      };
    }
  }
};

export default cartService;
