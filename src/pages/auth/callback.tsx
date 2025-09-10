import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      // Add a small delay to ensure URL parameters are fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const success = urlParams.get('success');
        const token = urlParams.get('token');
        const userId = urlParams.get('user_id');
        
        console.log('=== CALLBACK DEBUG ===');
        console.log('Full URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Parsed params:', {
          error,
          success,
          token: token ? `${token.substring(0, 20)}...` : 'missing',
          userId
        });
        console.log('======================');
        
        if (error) {
          console.log('Error in URL params:', error);
          setError(error === 'oauth_error' ? 'Authentication failed' : 'An error occurred during sign in');
          setStatus('error');
          return;
        }

        if (success === 'true' && token) {
          console.log('✅ SUCCESS: Storing token from API redirect');
          
          // Store the token in localStorage
          localStorage.setItem('access_token', token);
          
          console.log('🔄 Token stored, updating auth context...');
          // Check auth to update the context with user data
          await checkAuth();
          
          setStatus('success');
          
          // Clean up URL parameters
          window.history.replaceState({}, document.title, '/auth/callback');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            console.log('🚀 Redirecting to dashboard...');
            navigate('/dashboard');
          }, 1500);
        } else {
          // Check if we have a token in localStorage (might be from a previous attempt)
          const existingToken = localStorage.getItem('access_token');
          if (existingToken) {
            console.log('🔍 Found existing token, checking auth...');
            await checkAuth();
            
            // If auth check was successful, redirect
            setTimeout(async () => {
              const updatedToken = localStorage.getItem('access_token');
              if (updatedToken) {
                console.log('✅ Token valid, redirecting to dashboard...');
                setStatus('success');
                navigate('/dashboard');
              } else {
                console.log('❌ Token invalid');
                setError('Authentication completed but missing required data');
                setStatus('error');
              }
            }, 500);
          } else {
            console.log('❌ MISSING DATA:', { success, tokenPresent: !!token });
            setError('Authentication completed but missing required data');
            setStatus('error');
          }
        }

      } catch (err) {
        console.error('💥 Callback error:', err);
        setError('Failed to complete authentication');
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate, checkAuth]);

  const handleRetry = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
              <p className="text-gray-600">Please wait while we set up your account.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Marahb!</h2>
              <p className="text-gray-600 mb-4">Your account has been set up successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="w-full bg-stone-600 hover:bg-stone-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;