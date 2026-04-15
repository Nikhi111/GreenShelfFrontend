import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthDiagnosticPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    console.log('🔍 Auth Diagnostic Page loaded');
    console.log('Current auth state:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const runAllTests = async () => {
    setIsRunningTests(true);
    const results = {};

    try {
      // Test 1: Token Format
      console.log('\n=== Running Token Format Test ===');
      const tokenFormatResult = window.directApiTest.testTokenFormat();
      results.tokenFormat = tokenFormatResult;

      // Test 2: Direct API Request
      console.log('\n=== Running Direct API Test ===');
      const apiResult = await window.directApiTest.testDirectRequest();
      results.apiTest = apiResult;

      // Test 3: Auth Store State
      console.log('\n=== Running Auth Store Test ===');
      results.authStore = {
        hasUser: !!user,
        isAuthenticated,
        username: user?.username || 'none'
      };

      // Test 4: LocalStorage Check
      console.log('\n=== Running LocalStorage Test ===');
      const lsToken = localStorage.getItem('authToken');
      results.localStorage = {
        hasToken: !!lsToken,
        tokenLength: lsToken?.length || 0,
        tokenStart: lsToken ? lsToken.substring(0, 20) : 'none',
        allKeys: Object.keys(localStorage)
      };

      setTestResults(results);
    } catch (error) {
      console.error('Diagnostic test failed:', error);
      results.error = error.message;
      setTestResults(results);
    } finally {
      setIsRunningTests(false);
    }
  };

  const clearAuthAndReset = () => {
    window.directApiTest.resetAuth();
    logout();
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 Authentication Diagnostic</h1>
          
          <div className="space-y-6">
            {/* Current State */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold mb-3">Current Auth State</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Is Authenticated:</span> 
                  <span className={`ml-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {isAuthenticated ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Has User:</span>
                  <span className={`ml-2 ${user ? 'text-green-600' : 'text-red-600'}`}>
                    {user ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Username:</span>
                  <span className="ml-2">{user?.username || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Test Controls */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h2 className="text-lg font-semibold mb-3">Diagnostic Tests</h2>
              <div className="space-y-3">
                <button
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isRunningTests ? '🔄 Running Tests...' : '🧪 Run All Tests'}
                </button>
                
                <button
                  onClick={clearAuthAndReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-3"
                >
                  🗑️ Clear Auth & Reset
                </button>
              </div>
            </div>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="border rounded-lg p-4 bg-yellow-50">
                <h2 className="text-lg font-semibold mb-3">Test Results</h2>
                <div className="space-y-4">
                  {/* Token Format Results */}
                  {testResults.tokenFormat && (
                    <div>
                      <h3 className="font-medium text-gray-900">Token Format:</h3>
                      <div className="text-sm mt-1">
                        <div>Has Token: {testResults.tokenFormat.hasToken ? '✅' : '❌'}</div>
                        <div>Valid Format: {testResults.tokenFormat.validFormat ? '✅' : '❌'}</div>
                        <div>Is Expired: {testResults.tokenFormat.isExpired ? '❌ EXPIRED' : '✅ Valid'}</div>
                      </div>
                    </div>
                  )}

                  {/* API Test Results */}
                  {testResults.apiTest && (
                    <div>
                      <h3 className="font-medium text-gray-900">API Tests:</h3>
                      <div className="text-sm mt-1 space-y-1">
                        <div>User Endpoint: {testResults.apiTest.test1?.success ? '✅' : '❌'} (Status: {testResults.apiTest.test1?.status})</div>
                        <div>No Bearer Test: {testResults.apiTest.test2?.success ? '✅' : '❌'} (Status: {testResults.apiTest.test2?.status})</div>
                        <div>Cart Endpoint: {testResults.apiTest.test3?.success ? '✅' : '❌'} (Status: {testResults.apiTest.test3?.status})</div>
                      </div>
                    </div>
                  )}

                  {/* LocalStorage Results */}
                  {testResults.localStorage && (
                    <div>
                      <h3 className="font-medium text-gray-900">Local Storage:</h3>
                      <div className="text-sm mt-1">
                        <div>Has Token: {testResults.localStorage.hasToken ? '✅' : '❌'}</div>
                        <div>Token Length: {testResults.localStorage.tokenLength}</div>
                        <div>Token Start: {testResults.localStorage.tokenStart}</div>
                        <div>All Keys: {testResults.localStorage.allKeys.join(', ')}</div>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {testResults.error && (
                    <div className="text-red-600">
                      <h3 className="font-medium">Error:</h3>
                      <div className="text-sm">{testResults.error}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h2 className="text-lg font-semibold mb-3">📋 Instructions</h2>
              <div className="text-sm space-y-2">
                <p>1. Click "Run All Tests" to diagnose authentication issues</p>
                <p>2. Check browser console for detailed logs</p>
                <p>3. Look for expired tokens or API errors</p>
                <p>4. If token is expired, use "Clear Auth & Reset" and login again</p>
                <p>5. Share console output for further assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDiagnosticPage;
