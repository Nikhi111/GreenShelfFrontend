// Direct API test without interceptors to identify 403 issue
export const directApiTest = {
  // Test direct fetch request
  testDirectRequest: async () => {
    console.log('=== Direct API Test ===');
    
    const token = localStorage.getItem('authToken');
    console.log('Token from localStorage:', !!token);
    
    if (!token) {
      console.log('❌ No token found - cannot test authenticated request');
      return;
    }
    
    try {
      // Test 1: Direct fetch with minimal headers
      console.log('\n🧪 Test 1: Direct fetch with Bearer token');
      const response1 = await fetch('https://greenshelf-sh2b.onrender.com/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response 1 Status:', response1.status);
      console.log('Response 1 Headers:', Object.fromEntries(response1.headers.entries()));
      
      if (response1.ok) {
        const data = await response1.json();
        console.log('Response 1 Data:', data);
      } else {
        const errorText = await response1.text();
        console.log('Response 1 Error:', errorText);
      }
      
      // Test 2: Try with different header format
      console.log('\n🧪 Test 2: Try without Bearer prefix');
      const response2 = await fetch('https://greenshelf-sh2b.onrender.com/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response 2 Status:', response2.status);
      
      // Test 3: Try cart endpoint
      console.log('\n🧪 Test 3: Cart endpoint');
      const response3 = await fetch('https://greenshelf-sh2b.onrender.com/api/user/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: 1,
          count: 1
        })
      });
      
      console.log('Response 3 Status:', response3.status);
      if (!response3.ok) {
        const errorText = await response3.text();
        console.log('Response 3 Error:', errorText);
      }
      
      return {
        test1: { status: response1.status, success: response1.ok },
        test2: { status: response2.status, success: response2.ok },
        test3: { status: response3.status, success: response3.ok }
      };
      
    } catch (error) {
      console.error('Direct API test failed:', error);
      return null;
    }
  },

  // Test token format
  testTokenFormat: () => {
    console.log('\n=== Token Format Test ===');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('❌ No token to test');
      return;
    }
    
    console.log('Raw token length:', token.length);
    console.log('Token starts with Bearer:', token.startsWith('Bearer '));
    
    // Remove Bearer prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    console.log('Clean token length:', cleanToken.length);
    
    // Test JWT structure
    const parts = cleanToken.split('.');
    console.log('JWT parts count:', parts.length);
    
    if (parts.length === 3) {
      try {
        // Decode header
        const header = JSON.parse(atob(parts[0]));
        console.log('JWT Header:', header);
        
        // Decode payload
        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT Payload:', payload);
        console.log('Token Subject:', payload.sub);
        console.log('Token Issued At:', new Date(payload.iat * 1000));
        console.log('Token Expires At:', new Date(payload.exp * 1000));
        
        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < now;
        console.log('Token Expired:', isExpired);
        console.log('Time Until Expiration:', payload.exp - now, 'seconds');
        
        if (isExpired) {
          console.log('⚠️ TOKEN IS EXPIRED! This is likely causing 403 errors.');
        }
        
      } catch (error) {
        console.log('❌ Failed to decode JWT:', error);
      }
    } else {
      console.log('❌ Invalid JWT format - should have 3 parts separated by dots');
    }
    
    return {
      hasToken: !!token,
      validFormat: parts.length === 3,
      isExpired: parts.length === 3 ? (() => {
        try {
          const payload = JSON.parse(atob(parts[1]));
          return payload.exp < Math.floor(Date.now() / 1000);
        } catch {
          return true;
        }
      })() : true
    };
  },

  // Clear and reset
  resetAuth: () => {
    console.log('\n=== Resetting Auth ===');
    localStorage.removeItem('authToken');
    console.log('✅ Auth token cleared');
    console.log('🔄 Please try logging in again');
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.directApiTest = directApiTest;
  console.log('🔍 Direct API test available at window.directApiTest');
  console.log('Run: window.directApiTest.testDirectRequest() to test API');
  console.log('Run: window.directApiTest.testTokenFormat() to check token');
  console.log('Run: window.directApiTest.resetAuth() to clear auth');
}
