import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  User,
  Shield,
  Heart,
  Settings,
} from "lucide-react";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import { useAuth } from "../contexts/AuthContext";

const SignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [searchParams] = useSearchParams();

  // Handle OAuth errors from URL parameters
  useEffect(() => {
    const urlError = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (urlError) {
      console.error("🚨 OAuth Error from URL:", urlError);
      console.error("🚨 Error Description:", errorDescription);
      
      let errorMessage = "Authentication failed";
      
      switch (urlError) {
        case 'oauth_error':
          errorMessage = "OAuth authentication failed. Please try again.";
          break;
        case 'access_denied':
          errorMessage = "Access was denied. Please try signing in again.";
          break;
        case 'invalid_request':
          errorMessage = "Invalid authentication request. Please try again.";
          break;
        case 'server_error':
          errorMessage = "Server error occurred during authentication.";
          break;
        default:
          errorMessage = errorDescription || `Authentication error: ${urlError}`;
      }
      
      setError(errorMessage);
      
      // Clean up the URL by removing error parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("🔍 Starting sign in process...");
      console.log("🔍 Current origin:", window.location.origin);
      console.log("📧 Email:", formData.email);

      const result = await signIn(formData.email, formData.password);

      console.log("📦 Raw signIn result:", result);
      console.log("✅ result.success:", result?.success);
      console.log("❌ result.error:", result?.error);
      console.log("👤 result.user:", result?.user);
      console.log("🔑 result.token:", result?.token);

      // Simplified success check - just check if success is true and no error
      if (result?.success === true && !result?.error) {
        console.log("✅ Sign in successful, navigating to dashboard...");
        navigate("/dashboard");
      } else {
        const errorMessage = result?.error || "Sign in failed - unknown error";
        console.error("❌ Sign in failed:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("💥 Sign in exception:", err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdminAccess = () => {
    // Redirect to customer dashboard
    navigate("/dashboard");
  };

  const handleOAuthSuccess = () => {
    console.log("🎉 OAuth success callback triggered");
    // Clear any existing errors
    setError("");
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleOAuthError = (error: string) => {
    console.error("🚨 OAuth error callback triggered:", error);
    setError(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link to="/" className="inline-block mb-8">
              <img
                src="/Design sans titre.png"
                alt="Marahb"
                className="h-12 md:h-16 w-auto object-contain mx-auto"
              />
            </Link>
            <h2 className="font-didot text-3xl text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to your account to continue your luxury furniture journey
            </p>
          </motion.div>

          

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p className="text-red-800 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Google Sign In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GoogleSignIn
              variant="signin"
              onError={handleOAuthError}
              onSuccess={handleOAuthSuccess}
            />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign in with email
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-stone-600 hover:text-stone-800 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Right Side - Image & Features */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800)",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="font-didot text-3xl mb-6 text-white">
              Luxury Furniture Awaits
            </h3>
            <p className="text-lg mb-8 text-white/90 leading-relaxed">
              Access exclusive collections, virtual showrooms, and personalized
              design consultations.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    Personalized Experience
                  </h4>
                  <p className="text-sm text-white/80">
                    Curated recommendations based on your style
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Secure & Trusted</h4>
                  <p className="text-sm text-white/80">
                    Your data is protected with enterprise-grade security
                  </p>
                </div>
                </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    Wishlist & Favorites
                  </h4>
                  <p className="text-sm text-white/80">
                    Save and organize your favorite pieces
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;