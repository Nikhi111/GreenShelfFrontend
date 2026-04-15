import { apiClient } from '../utils/api';

export const authService = {
  // Login user
  login: async (username, password) => {
    try {
      console.log('Attempting login for:', username);

      const response = await apiClient.post('/auth/login', {
        username: username.trim(),
        password: password
      });

      console.log('Login response:', response.data);

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);

      // Handle different error types
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password'
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Username and password are required'
        };
      } else if (error.code === 'NETWORK_ERROR') {
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection'
        };
      } else {
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: error.response?.data?.message || 'Login failed'
        };
      }
    }
  },

  // Register user based on role
  register: async (username, password, role = 'USER') => {
    try {
      console.log('Attempting registration for:', { username, role });

      let endpoint;
      switch (role.toUpperCase()) {
        case 'USER':
          endpoint = '/user/register';
          break;
        case 'VENDOR':
          endpoint = '/seller/register';
          break;
        case 'ADMIN':
          endpoint = '/admin/register';
          break;
        default:
          endpoint = '/user/register';
      }

      const response = await apiClient.post(endpoint, {
        username: username.trim(),
        password: password
      });

      console.log('Registration response:', response.data);

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different error types
      if (error.response?.status === 409) {
        return {
          success: false,
          error: 'USERNAME_EXISTS',
          message: 'Username already exists'
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: 'INVALID_DATA',
          message: error.response.data?.message || 'Invalid registration data'
        };
      } else if (error.code === 'NETWORK_ERROR') {
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection'
        };
      } else {
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: error.response?.data?.message || 'Registration failed'
        };
      }
    }
  },

  // Get current user info (requires token)
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/user/me');

      return {
        success: true,
        data: response.data,
        message: 'User data retrieved successfully'
      };
    } catch (error) {
      console.error('Get current user error:', error);

      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        };
      }

      return {
        success: false,
        error: 'UNKNOWN_ERROR',
        message: 'Failed to get user data'
      };
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const result = await authService.getCurrentUser();
      return result.success;
    } catch (error) {
      return false;
    }
  }
  console.log("🔥 AUTH SERVICE REGISTER CALLED");
  console.log("Endpoint:", endpoint);
};

export default authService;
