// Utility to test and debug authentication issues
export const authTest = {
  // Test current authentication state
  testAuthState: () => {
    console.log('=== Authentication State Test ===');
    
    const token = localStorage.getItem('authToken');
    console.log('Token in localStorage:', !!token);
    
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token first 20 chars:', token.substring(0, 20));
      
      // Check JWT structure (should have 3 parts separated by dots)
      const parts = token.split('.');
      console.log('Token parts:', parts.length);
      
      if (parts.length === 3) {
        try {
          // Decode JWT payload (part 1)
          const payload = JSON.parse(atob(parts[1]));
          console.log('JWT Payload:', payload);
          console.log('JWT Expiration:', new Date(payload.exp * 1000));
          console.log('JWT Issued At:', new Date(payload.iat * 1000));
          console.log('JWT Subject:', payload.sub);
          
          // Check if token is expired
          const now = Math.floor(Date.now() / 1000);
          const isExpired = payload.exp < now;
          console.log('Token expired:', isExpired);
          
          if (isExpired) {
            console.log('⚠️ Token is expired! This could cause 403 errors.');
          }
        } catch (error) {
          console.log('❌ Failed to decode JWT:', error);
        }
      } else {
        console.log('❌ Invalid JWT format - should have 3 parts');
      }
    } else {
      console.log('❌ No token found in localStorage');
    }
    
    return {
      hasToken: !!token,
      tokenValid: token && token.split('.').length === 3,
      tokenExpired: token && (() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp < Math.floor(Date.now() / 1000);
        } catch {
          return true;
        }
      })()
    };
  },

  // Test API request manually
  testApiRequest: async () => {
    console.log('=== API Request Test ===');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('❌ Cannot test API - no token');
      return;
    }
    
    try {
      const response = await fetch('https://greenshelf-sh2b.onrender.com/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response Data:', data);
      } else {
        const errorText = await response.text();
        console.log('API Error Response:', errorText);
      }
      
      return response;
    } catch (error) {
      console.error('API Request Failed:', error);
      return null;
    }
  },

  // Clear all auth data
  clearAuth: () => {
    console.log('=== Clearing Authentication ===');
    localStorage.removeItem('authToken');
    console.log('✅ Auth token cleared');
  },

  // Set test token (for debugging)
  setTestToken: (token) => {
    console.log('=== Setting Test Token ===');
    localStorage.setItem('authToken', token);
    console.log('✅ Test token set');
  }
};

// Auto-run test when imported
if (typeof window !== 'undefined') {
  window.authTest = authTest;
  console.log('🔍 Auth test utilities available at window.authTest');
  console.log('Run: window.authTest.testAuthState() to check current auth state');
  console.log('Run: window.authTest.testApiRequest() to test API call');
}
