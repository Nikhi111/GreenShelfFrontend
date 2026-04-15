import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { orderService } from '../services/orderService';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      // State
      orders: [],
      currentOrder: null,
      isLoading: false,
      isCreatingOrder: false,
      error: null,
      
      // Actions
      createOrder: async (address) => {
        set({ isCreatingOrder: true, error: null });
        try {
          const result = await orderService.createOrder(address);
          
          if (result.success) {
            console.log('✅ Order created successfully:', result.data);
            
            // Add to orders list
            set(state => ({
              orders: [result.data, ...state.orders],
              currentOrder: result.data
            }));
            
            return { success: true, data: result.data, message: result.message };
          } else {
            console.log('❌ Order creation failed:', result);
            set({ error: result.message });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Create order error:', error);
          set({ error: 'Failed to create order' });
          return { success: false, message: 'Failed to create order' };
        } finally {
          set({ isCreatingOrder: false });
        }
      },

      getUserOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await orderService.getUserOrders();
          
          if (result.success) {
            console.log('✅ Orders fetched successfully:', result.data);
            set({ 
              orders: result.data || [],
              isLoading: false 
            });
            return { success: true, data: result.data };
          } else {
            console.log('❌ Orders fetch failed:', result);
            set({ 
              error: result.message,
              isLoading: false 
            });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Fetch orders error:', error);
          set({ 
            error: 'Failed to fetch orders',
            isLoading: false 
          });
          return { success: false, message: 'Failed to fetch orders' };
        }
      },

      getOrderDetails: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
          const result = await orderService.getOrderDetails(orderId);
          
          if (result.success) {
            console.log('✅ Order details fetched successfully:', result.data);
            set({ 
              currentOrder: result.data,
              isLoading: false 
            });
            return { success: true, data: result.data };
          } else {
            console.log('❌ Order details fetch failed:', result);
            set({ 
              error: result.message,
              isLoading: false 
            });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Fetch order details error:', error);
          set({ 
            error: 'Failed to fetch order details',
            isLoading: false 
          });
          return { success: false, message: 'Failed to fetch order details' };
        }
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'order-storage',
      getStorage: () => localStorage,
    }
  )
);
