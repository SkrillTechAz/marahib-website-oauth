// Create this file: src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true = requires authentication, false = requires NO authentication
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard',
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();

  console.log('=== ProtectedRoute Debug ===');
  console.log('User exists:', !!user);
  console.log('User data:', user);
  console.log('Loading:', loading);
  console.log('Require auth:', requireAuth);
  console.log('Redirect to:', redirectTo);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If route requires NO authentication (like signin/signup) but user IS authenticated
  if (!requireAuth && user) {
    console.log('User is authenticated but trying to access auth page, redirecting...');
    return <Navigate to={redirectTo} replace />;
  }

  // If route requires authentication but user is NOT authenticated
  if (requireAuth && !user) {
    console.log('User not authenticated but trying to access protected page, redirecting to signin...');
    return <Navigate to="/signin" replace />;
  }

  // User can access this route
  console.log('Route access granted');
  return <>{children}</>;
};

export default ProtectedRoute;