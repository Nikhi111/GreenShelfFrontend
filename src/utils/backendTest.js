// Test backend endpoints directly to identify 403 issue
export const backendTest = {
  // Test if backend is accessible
  testBackendAccess: async () => {
    console.log('=== Backend Access Test ===');
    
    try {
      // Test 1: Public endpoint (should work)
      console.log('\n🧪 Test 1: Public endpoint');
      const publicResponse = await fetch('https://localhost:9091/api/public/home');
      console.log('Public endpoint status:', publicResponse.status);
      console.log('Public endpoint response:', await publicResponse.text());
      
      // Test 2: Login endpoint (should work)
      console.log('\n🧪 Test 2: Login endpoint');
      const loginResponse = await fetch('https://localhost:9091/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        })
      });
      console.log('Login endpoint status:', loginResponse.status);
      const loginData = await loginResponse.text();
      console.log('Login endpoint response:', loginData);
      
      // Test 3: Protected endpoint without auth (should fail with 401/403)
      console.log('\n🧪 Test 3: Protected endpoint without auth');
      const protectedResponse = await fetch('https://localhost:9091/api/user/me');
      console.log('Protected endpoint status:', protectedResponse.status);
      console.log('Protected endpoint response:', await protectedResponse.text());
      
      return {
        publicTest: publicResponse.status,
        loginTest: loginResponse.status,
        protectedTest: protectedResponse.status
      };
      
    } catch (error) {
      console.error('Backend test failed:', error);
      return null;
    }
  },

  // Test current user's token against backend
  testCurrentUserToken: async () => {
    console.log('\n=== Current User Token Test ===');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('❌ No token to test');
      return;
    }
    
    console.log('Testing token:', token.substring(0, 20) + '...');
    
    try {
      // Test with different auth header formats
      const tests = [
        {
          name: 'Bearer prefix',
          headers: { 'Authorization': `Bearer ${token}` }
        },
        {
          name: 'No prefix',
          headers: { 'Authorization': token }
        },
        {
          name: 'Lowercase bearer',
          headers: { 'authorization': `Bearer ${token}` }
        },
        {
          name: 'Token header',
          headers: { 'X-Auth-Token': token }
        }
      ];
      
      for (const test of tests) {
        console.log(`\n🧪 Testing: ${test.name}`);
        console.log('Headers:', test.headers);
        
        const response = await fetch('https://localhost:9091/api/user/me', {
          headers: {
            'Content-Type': 'application/json',
            ...test.headers
          }
        });
        
        console.log(`Status: ${response.status}`);
        console.log(`Success: ${response.ok}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          return { success: true, method: test.name, data };
        }
        
        const errorText = await response.text();
        console.log('Error:', errorText);
      }
      
      return { success: false, message: 'All auth methods failed' };
      
    } catch (error) {
      console.error('Token test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test cart endpoint specifically
  testCartEndpoint: async () => {
    console.log('\n=== Cart Endpoint Test ===');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('❌ No token for cart test');
      return;
    }
    
    try {
      const response = await fetch('https://localhost:9091/api/user/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: 1,
          count: 1
        })
      });
      
      console.log('Cart endpoint status:', response.status);
      console.log('Cart endpoint success:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Cart response data:', data);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.log('Cart error response:', errorText);
        return { success: false, status: response.status, error: errorText };
      }
      
    } catch (error) {
      console.error('Cart test failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.backendTest = backendTest;
  console.log('🔧 Backend test utilities available at window.backendTest');
  console.log('Run: window.backendTest.testBackendAccess() to test backend');
  console.log('Run: window.backendTest.testCurrentUserToken() to test token');
  console.log('Run: window.backendTest.testCartEndpoint() to test cart');
}
