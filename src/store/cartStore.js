import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cartItems: [],
      cartTotal: 0,
      isSyncing: false,
      isLoading: false,
      error: null,
      
      // Actions
      addToCart: async (product, quantity = 1) => {
        set({ isLoading: true, error: null });
        
        try {
          // Call API first
          const result = await cartService.addToCart(product.id, quantity);
          
          if (result.success) {
            // Sync cart after successful addition
            await get().syncCart();
            return { success: true, message: result.message };
          } else {
            set({ error: result.message });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Add to cart error:', error);
          set({ error: 'Failed to add item to cart' });
          return { success: false, message: 'Failed to add item to cart' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateQuantity: async (productId, count) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await cartService.updateQuantity(productId, count);
          
          if (result.success) {
            console.log('✅ Cart quantity updated successfully');
            await get().syncCart(); // Refresh cart to get updated state
            return { success: true };
          } else {
            // Handle specific error types
            let errorMessage = result.message || 'Failed to update cart quantity';
            
            if (result.message?.toLowerCase().includes('out of stock') || 
                result.message?.toLowerCase().includes('insufficient stock')) {
              errorMessage = `Only ${get().cartItems.find(item => item.id === productId)?.quantity || 0} items available in stock`;
            } else if (result.message?.toLowerCase().includes('maximum 10')) {
              errorMessage = 'Maximum 10 items allowed per product';
            }
            
            set({ error: errorMessage });
            return { success: false, message: errorMessage };
          }
        } catch (error) {
          console.error('Update quantity error:', error);
          
          // Handle different error types
          let errorMessage = 'Failed to update cart quantity';
          
          if (error.response?.status === 400) {
            const errorData = error.response.data;
            if (errorData?.error?.toLowerCase().includes('out of stock')) {
              errorMessage = 'This product is out of stock';
            } else if (errorData?.error?.toLowerCase().includes('maximum')) {
              errorMessage = 'Maximum quantity limit reached';
            } else {
              errorMessage = errorData?.error || errorMessage;
            }
          }
          
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
      
      removeFromCart: async (productId) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await cartService.removeFromCart(productId);
          
          if (result.success) {
            await get().syncCart();
            return { success: true, message: result.message };
          } else {
            set({ error: result.message });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Remove from cart error:', error);
          set({ error: 'Failed to remove item from cart' });
          return { success: false, message: 'Failed to remove item from cart' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await cartService.clearCart();
          
          if (result.success) {
            // Clear local state immediately
            set({ cartItems: [], cartTotal: 0 });
            return { success: true, message: result.message };
          } else {
            set({ error: result.message });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Clear cart error:', error);
          set({ error: 'Failed to clear cart' });
          return { success: false, message: 'Failed to clear cart' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Sync with backend
      syncCart: async () => {
        const { isSyncing } = get();
        if (isSyncing) return; // Prevent multiple simultaneous syncs
        
        set({ isSyncing: true });
        
        try {
          const result = await cartService.getCart();
          
          if (result.success && result.data) {
            const { items, total } = result.data;
            
            // Ensure we have valid arrays and numbers
            const validItems = Array.isArray(items) ? items : [];
            const validTotal = typeof total === 'number' ? total : 0;
            
            set({ 
              cartItems: validItems, 
              cartTotal: validTotal,
              error: null 
            });
          } else {
            // On error, ensure cart is empty but don't show error for normal operation
            set({ 
              cartItems: [], 
              cartTotal: 0,
              error: null  // ✅ Don't set error for normal sync failures
            });
          }
        } catch (error) {
          console.error('Sync cart error:', error);
          // On error, ensure cart is empty but don't show error for normal operation
          set({ 
            cartItems: [], 
            cartTotal: 0,
            error: null  // ✅ Don't set error for normal sync failures
          });
        } finally {
          set({ isSyncing: false });
        }
      },
      
      // Get cart item count
      getCartCount: () => {
        return get().cartItems.reduce((count, item) => count + (item.quantity || item.count || 0), 0);
      },
      
      // Check if item is in cart
      isInCart: (productId) => {
        return get().cartItems.some(item => item.id === productId || item.productId === productId);
      },
      
      // Get item quantity
      getItemQuantity: (productId) => {
        const item = get().cartItems.find(item => item.id === productId || item.productId === productId);
        return item ? (item.quantity || item.count || 0) : 0;
      }
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);