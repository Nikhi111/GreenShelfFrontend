import { debugApiClient } from '../utils/apiDebug';

export const orderService = {
  // Create order from cart
  createOrder: async (address) => {
    try {
      console.log('🛒 Creating order with address:', address);
      
      const response = await debugApiClient.post('/order/create', address);
      
      console.log('📦 Order creation response:', response);
      console.log('📦 Order response data:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Handle different error types
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please login to create order',
          details: error.response?.data
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: 'BAD_REQUEST',
          message: error.response?.data?.message || 'Invalid order data or empty cart',
          details: error.response?.data
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Order creation endpoint not found',
          details: error.response?.data
        };
      } else {
        return {
          success: false,
          error: error.response?.status || 'NETWORK_ERROR',
          message: 'Failed to create order',
          details: error.response?.data
        };
      }
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      console.log('📋 Fetching user orders...');
      
      const response = await debugApiClient.get('/user/orders');
      
      console.log('📦 User orders response:', response);
      console.log('📦 Orders data:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please login to view orders'
        };
      } else {
        return {
          success: false,
          error: error.response?.status || 'NETWORK_ERROR',
          message: 'Failed to fetch orders'
        };
      }
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      console.log('🔍 Fetching order details for:', orderId);
      
      const response = await debugApiClient.get(`/user/orders/${orderId}`);
      
      console.log('📦 Order details response:', response);
      console.log('📦 Order details data:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Order details retrieved'
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please login to view order details'
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          error: 'FORBIDDEN',
          message: 'Not your order'
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Order not found'
        };
      } else {
        return {
          success: false,
          error: error.response?.status || 'NETWORK_ERROR',
          message: 'Failed to fetch order details'
        };
      }
    }
  }
};
