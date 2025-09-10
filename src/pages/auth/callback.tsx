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
      console.log('🔄 Auth callback started');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔍 Search params:', window.location.search);
      
      let errorMessage = 'Authentication failed';
      
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const success = urlParams.get('success');
        const token = urlParams.get('token');
        const userId = urlParams.get('user_id');
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        console.log('📊 Parsed URL parameters:', {
          error,
          errorDescription,
          success,
          token: token ? `${token.substring(0, 20)}...` : null,
          accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
          userId,
          hasRefreshToken: !!refreshToken
        });
        // Handle OAuth errors
        if (error) {
          console.error('❌ OAuth error detected:', error);
          console.error('❌ Error description:', errorDescription);
          
          switch (error) {
            case 'access_denied':
              errorMessage = 'Access was denied. Please try signing in again.';
              break;
            case 'invalid_request':
              errorMessage = 'Invalid authentication request. Please try again.';
              break;
            case 'server_error':
              errorMessage = 'Server error occurred. Please try again later.';
              break;
            case 'oauth_error':
              errorMessage = errorDescription || 'OAuth authentication failed';
              break;
            default:
              errorMessage = errorDescription || `Authentication error: ${error}`;
          }
          
          setError(errorMessage);
          setStatus('error');
          
          // Clean up URL and redirect to sign-in after delay
          setTimeout(() => {
            navigate('/signin', { 
              state: { 
                error: errorMessage 
              }
            });
          }, 3000);
          return;
        }

        // Use either token or access_token parameter
        const authToken = token || accessToken;
        
        if (success === 'true' && authToken) {
          console.log('✅ OAuth success detected, storing token...');
          
          // Store tokens in localStorage
          localStorage.setItem('access_token', authToken);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          console.log('🔄 Tokens stored, updating auth context...');
          
          // Update auth context with user data
          await checkAuth();
          
          setStatus('success');
          
          // Clean up URL parameters to remove sensitive data
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Redirect to dashboard
          setTimeout(() => {
            console.log('🚀 Redirecting to dashboard...');
            navigate('/dashboard');
          }, 1000);
        } else {
          // If we get here, something went wrong
          console.error('❌ OAuth callback missing required data:', {
            success,
            hasToken: !!authToken,
            hasUserId: !!userId
          });
          
          setError('Authentication completed but missing required data. Please try signing in again.');
          setStatus('error');
          
          // Redirect to sign-in after delay
          setTimeout(() => {
            navigate('/signin', {
              state: {
                error: 'OAuth authentication incomplete. Please try again.'
              }
            });
          }, 3000);
        }
      } catch (err) {
        console.error('💥 OAuth callback exception:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to complete authentication';
        setError(errorMessage);
        setStatus('error');
        
        // Redirect to sign-in after delay
        setTimeout(() => {
          navigate('/signin', {
            state: {
              error: errorMessage
            }
          });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, checkAuth]);

  const handleRetry = () => {
    // Clear any stored tokens and redirect
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/signin');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="mb-6">
            <img 
              src="/Design sans titre.png" 
              alt="Marahb" 
              className="h-12 w-auto object-contain mx-auto"
            />
          </div>
          
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
              <p className="text-gray-600">Please wait while we complete your Google sign-in.</p>
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
              <p className="text-gray-600 mb-6">Your Google sign-in was successful!</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-stone-600 hover:bg-stone-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
                <p className="text-sm text-gray-500">Redirecting automatically...</p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Sign-in Failed</h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-stone-600 hover:bg-stone-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <p className="text-xs text-gray-500">Redirecting to sign-in page...</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;