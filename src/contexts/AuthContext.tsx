import React, { createContext, useContext, useEffect, useState } from "react";
import { redirect } from "react-router-dom";

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>;
  signUp: (
    email: string,
    password: string,
    userData: any
  ) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep environment variable but add fallback
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful, user:", data.user);
        setUser(data.user || data.data);
      } else {
        console.log("Auth check failed, removing token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔄 AuthContext: Making API call to /api/auth/login");
      console.log("🌐 API_BASE_URL:", API_BASE_URL);

      // Construct the full URL
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/auth/login` : '/api/auth/login';
      console.log("🔗 Full API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("🌐 AuthContext: API response status:", response.status);
      console.log("🌐 AuthContext: API response ok:", response.ok);

      const result = await response.json();
      console.log("📦 AuthContext: API response data:", result);

      // Check if the API request failed
      if (!response.ok) {
        console.error("❌ AuthContext: API request failed");
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: Request failed`,
        };
      }

      // Check if the API returned an error (even with 200 status)
      if (result.error) {
        console.error("❌ AuthContext: API returned error:", result.error);
        return {
          success: false,
          error: result.error,
        };
      }

      // Check if we have the required data - be flexible about field names
      const userData = result.user;
      const token = result.token || result.access_token;
      
      if (!userData || !token) {
        console.error("❌ AuthContext: Missing user or token in response");
        console.log("📊 Available result keys:", Object.keys(result));
        console.log("📊 User data:", userData);
        console.log("📊 Token:", token);
        return {
          success: false,
          error: "Invalid response from server - missing user or token",
        };
      }

      console.log("✅ AuthContext: Sign in successful");

      // Store authentication data in localStorage
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update auth context state
      setUser(userData);

      // Return success format that SignInPage expects
      return {
        success: true,
        error: null, // Explicitly null for success
        user: userData,
        token: token,
      };

    } catch (error) {
      console.error("💥 AuthContext: Network/parsing error:", error);
      console.error("💥 Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        error: `Network error: ${error.message}`,
      };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/auth/signup` : '/api/auth/signup';
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userData: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
          },
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to sign up" };
      }

      // Store token if provided
      if (data.token) {
        localStorage.setItem("access_token", data.token);
      }

      setUser(data.user);
      return {};
    } catch (error) {
      return { error: "Network error occurred" };
    }
  };

  // Google OAuth - just initiates the flow, token gets saved in callback
  const signInWithGoogle = async () => {
    try {
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/auth/google` : '/api/auth/google';
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          redirectTo: `${window.location.origin}/auth/callback`,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to initiate Google sign-in" };
      }

      if (data.url) {
        // Redirect to Google OAuth
        window.location.href = data.url;
        return {};
      } else {
        return { error: "No OAuth URL returned" };
      }
    } catch (error) {
      return { error: "Network error occurred" };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/auth/logout` : '/api/auth/logout';
        
        await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};