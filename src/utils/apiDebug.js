import axios from 'axios';

// Debug API client to help identify authentication issues
export const debugApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://greenshelf-sh2b.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with detailed logging
debugApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    console.log('=== API Request Debug ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (token) {
      // Check if token already has Bearer prefix
      if (token.startsWith('Bearer ')) {
        config.headers.Authorization = token;
        console.log('Using existing Bearer token:', token.substring(0, 30) + '...');
      } else {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Bearer prefix:', `Bearer ${token.substring(0, 20)}...`);
      }
    } else {
      console.log('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with detailed logging
debugApiClient.interceptors.response.use(
  (response) => {
    console.log('=== API Response Debug ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    
    return response;
  },
  (error) => {
    console.log('=== API Error Debug ===');
    console.log('Error Status:', error.response?.status);
    console.log('Error Status Text:', error.response?.statusText);
    console.log('Error Headers:', error.response?.headers);
    console.log('Error Data:', error.response?.data);
    console.log('Error Config:', error.config);
    console.log('Full Error:', error);
    
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - removing token');
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 forbidden
    if (error.response?.status === 403) {
      console.log('403 Forbidden - Access denied');
      console.log('Possible causes:');
      console.log('1. JWT token not properly formatted');
      console.log('2. Backend security configuration issue');
      console.log('3. CORS configuration issue');
      console.log('4. Token expired but not properly handled');
      console.log('5. Backend expecting different auth header format');
      
      // Check if token exists and is properly formatted
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('Token format check:');
        console.log('- Token starts with Bearer:', token.startsWith('Bearer '));
        console.log('- Token length:', token.length);
        console.log('- Token structure:', token.split('.').length === 3 ? 'JWT format' : 'Invalid format');
        
        // Try to decode JWT to check expiration
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('- JWT Subject:', payload.sub);
            console.log('- JWT Issued At:', new Date(payload.iat * 1000));
            console.log('- JWT Expires At:', new Date(payload.exp * 1000));
            console.log('- JWT Current Time:', new Date());
            console.log('- JWT Time Until Expiration:', payload.exp - Math.floor(Date.now() / 1000), 'seconds');
            console.log('- JWT Is Expired:', payload.exp < Math.floor(Date.now() / 1000));
          }
        } catch (decodeError) {
          console.log('- JWT Decode Error:', decodeError);
        }
      }
      
      // Log the exact request that failed
      console.log('Failed Request Details:');
      console.log('- URL:', error.config?.url);
      console.log('- Method:', error.config?.method);
      console.log('- Headers:', error.config?.headers);
      console.log('- Request Body:', error.config?.data);
    }
    
    return Promise.reject(error);
  }
);

export default debugApiClient;
