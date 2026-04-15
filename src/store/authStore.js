import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      role: null, // 'user' | 'seller' | 'admin'
      
      // Actions
      login: async (username, password) => {
        set({ isLoading: true });
        
        try {
          const result = await authService.login(username, password);
          
          if (result.success) {
            const { token, username: userName } = result.data;
            
            // Extract clean token - remove Bearer prefix if present
            let cleanToken = token;
            if (typeof token === 'string' && token.startsWith('Bearer ')) {
              cleanToken = token.substring(7);
              console.log('🔧 Extracted clean token from Bearer prefix');
            }
            
            set({
              user: { username: userName },
              token: cleanToken,
              isAuthenticated: true,
              isLoading: false,
              role: 'user' // Default role, will be updated by initializeAuth
            });
            
            // Store clean token in localStorage for persistence
            localStorage.setItem('authToken', cleanToken);
            console.log('✅ Clean token stored:', cleanToken.substring(0, 20) + '...');
            
            // Initialize auth to get the actual role
            await get().initializeAuth();
            
            return { success: true, message: result.message };
          } else {
            set({ isLoading: false });
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return { success: false, message: 'Login failed' };
        }
      },
      
      register: async (username, password, role = 'USER') => {
        set({ isLoading: true });
        
        try {
          const result = await authService.register(username, password, role);
          
          set({ isLoading: false });
          
          if (result.success) {
            return { success: true, message: result.message, data: result.data };
          } else {
            return { success: false, message: result.message, error: result.error };
          }
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return { success: false, message: 'Registration failed' };
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
          isLoading: false
        });
        
        // Remove token from localStorage
        localStorage.removeItem('authToken');
      },
      
      updateUser: (userData) => {
        set({ user: userData });
      },
      
      // Initialize auth state from localStorage on app load
      initializeAuth: async () => {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          set({ isLoading: true });
          
          try {
            // Validate token and get user data
            const result = await authService.getCurrentUser();
            
            if (result.success) {
              const userRole = result.data.role || 'user';
              console.log('=== Auth Store Debug ===');
              console.log('Full backend response:', JSON.stringify(result.data, null, 2));
              console.log('Backend response keys:', Object.keys(result.data));
              console.log('Raw role from backend:', result.data.role);
              console.log('Type of role:', typeof result.data.role);
              console.log('Extracted role:', userRole);
              console.log('User role from backend:', userRole);
              
              set({
                user: result.data,
                token: token,
                isAuthenticated: true,
                isLoading: false,
                role: userRole
              });
              console.log('Auth state updated with role:', userRole);
              console.log('=== End Auth Store Debug ===');
            } else {
              // Token is invalid, remove it
              localStorage.removeItem('authToken');
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                role: null
              });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            localStorage.removeItem('authToken');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              role: null
            });
          }
        }
      },
      
      // Helper to get current auth state
      getAuthState: () => get(),
      
      // Check if user has specific role
      hasRole: (requiredRole) => {
        const { role, isAuthenticated } = get();
        return isAuthenticated && role === requiredRole;
      },
      
      // Check if user is authenticated
      checkAuth: () => {
        const { isAuthenticated, token } = get();
        return isAuthenticated && token;
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
