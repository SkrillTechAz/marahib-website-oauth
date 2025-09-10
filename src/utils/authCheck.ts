export const checkAuthBeforeCheckout = async (): Promise<{
  isAuthenticated: boolean;
  user?: any;
  redirectToLogin?: boolean;
}> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return {
        isAuthenticated: false,
        redirectToLogin: true,
      };
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.user,
      };
    } else {
      localStorage.removeItem('access_token');
      return {
        isAuthenticated: false,
        redirectToLogin: true,
      };
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      isAuthenticated: false,
      redirectToLogin: true,
    };
  }
};