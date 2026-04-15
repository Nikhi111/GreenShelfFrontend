import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // State
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  activeModal: null, // 'login' | 'signup' | 'cart' | 'product' | null
  isLoading: false,
  theme: 'light', // 'light' | 'dark'
  notifications: [],
  
  // Actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  
  openModal: (modalType) => set({ activeModal: modalType }),
  closeModal: () => set({ activeModal: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    }]
  })),
  
  removeNotification: (notificationId) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== notificationId)
  })),
  
  clearNotifications: () => set({ notifications: [] })
}));
