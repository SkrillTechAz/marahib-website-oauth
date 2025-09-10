import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  Settings,
  CreditCard,
  MapPin,
  Bell,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  Star,
  Eye,
  Download,
  Edit,
  Plus,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  Home,
  Gift,
  HelpCircle,
  LogOut,
  ChevronRight,
  Filter,
  Search,
  X,
  MessageCircle,
  Save,
  Camera,
  Upload,
} from "lucide-react";
import { Profile, profileService } from "../services/profileService";

interface UserProfile {
  business_name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profile_image_url: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    orderUpdates: boolean;
  };
}



const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profile_image_url: "",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      orderUpdates: true,
    },
  });

  const [originalData, setOriginalData] = useState<UserProfile>(profileData);
  const [profileRow, setProfileRow] = useState<Profile | null>(null);


useEffect(() => {
  const load = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/signin', { state: { message: 'Please sign in' } });
      return;
    }

    // fetch auth user
    const authRes = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!authRes.ok) {
      localStorage.removeItem('access_token');
      navigate('/signin');
      return;
    }
    const authUser = await authRes.json();
    setCurrentUser(authUser.user);

    // fetch profile row
    const row = await profileService.getMyProfile();

    const initial: UserProfile = {
      firstName: row?.business_name?.split(' ')[0] ?? authUser.user?.user_metadata?.first_name ?? '',
      lastName:  row?.business_name?.split(' ').slice(1).join(' ') ?? authUser.user?.user_metadata?.last_name ?? '',
      email:     authUser.user?.email ?? '',
      phone:     row?.phone ?? authUser.user?.user_metadata?.phone ?? '',
      dateOfBirth: row?.dateOfBirth ?? authUser.user?.user_metadata?.date_of_birth ?? '',
      profile_image_url: row?.profile_image_url ?? authUser.user?.user_metadata?.profile_image_url ?? '',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        orderUpdates: true,
      },
    };

    setProfileData(initial);
    setOriginalData(initial);
  };

  load();
}, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("access_token");
        navigate("/signin", {
          state: { message: "You have been successfully logged out." },
        });
      } else {
        console.error("Logout failed");
        localStorage.removeItem("access_token");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("access_token");
      navigate("/signin");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/dashboard" },
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
      path: "/dashboard/orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      path: "/dashboard/wishlist",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      path: "/dashboard/addresses",
    },
    {
      id: "payment",
      label: "Payment Methods",
      icon: CreditCard,
      path: "/dashboard/payment",
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
      path: "/dashboard/profile",
    },
    /* { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
      { id: 'security', label: 'Security', icon: Shield, path: '/dashboard/security' }, */
    {
      id: "support",
      label: "Help & Support",
      icon: HelpCircle,
      path: "/dashboard/support",
    },
    {
      id: "consultations",
      label: "Consultations Chat",
      icon: MessageCircle,
      path: "/dashboard/consultations",
    },
  ];

  // Function to check if current path matches sidebar item
  const isActiveRoute = (itemPath: string) => {
    if (itemPath === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(itemPath);
  };

  // Mock user data
  const user = {
    name:
      profileData.firstName && profileData.lastName
        ? `${profileData.firstName} ${profileData.lastName}`.trim()
        : currentUser?.email?.split("@")[0] || "User",
    email: profileData.email || "user@example.com",
    phone: profileData.phone || "+971 50 123 4567",
    profile_image_url:
      profileData.profile_image_url ||
      "",
    memberSince: "2023",
    loyaltyPoints: 2284,
    tier: "Gold",
  };

  // Check if data has changed
  useEffect(() => {
    const hasChanges =
      JSON.stringify(profileData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [profileData, originalData]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name.includes("preferences.")) {
      const prefKey = name.split(".")[1] as keyof UserProfile["preferences"];
      setProfileData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === "checkbox" ? e.target.checked : value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const profileId = currentUser.id; 
      await profileService.updateProfile(profileId, {
        business_name: profileData.firstName + ' ' + profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        profile_image_url: profileData.profile_image_url,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error - show error message
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setHasUnsavedChanges(false);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          profile_image_url: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // If user is not loaded yet, show loading
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.profile_image_url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.tier} Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout"
              >
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActiveRoute(item.path)
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-medium">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-6">
              <h1 className="font-serif text-2xl text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
                  <h3 className="font-medium text-gray-900 mb-6">
                    Profile Information
                  </h3>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <img
                        src={profileData.profile_image_url}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Profile Picture
                      </h4>
                      <p className="text-sm text-gray-600">
                        Upload a new profile picture
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">Communication Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive updates about your orders and new products</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="preferences.emailNotifications"
                            checked={profileData.preferences.emailNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Get delivery updates via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="preferences.smsNotifications"
                            checked={profileData.preferences.smsNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Marketing Emails</p>
                          <p className="text-sm text-gray-600">Receive promotional offers and design inspiration</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="preferences.marketingEmails"
                            checked={profileData.preferences.marketingEmails}
                            onChange={handleInputChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Order Updates</p>
                          <p className="text-sm text-gray-600">Important notifications about order status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="preferences.orderUpdates"
                            checked={profileData.preferences.orderUpdates}
                            onChange={handleInputChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    </div>
                  </div> */}

                  <div className="mt-6 flex gap-4">
                    <button
                      type="submit"
                      disabled={!hasUnsavedChanges || isSaving}
                      className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={!hasUnsavedChanges}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>

              {/* Account Information */}
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-gray-900">{user.memberSince}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Loyalty Tier</p>
                    <p className="text-gray-900">{user.tier} Member</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Loyalty Points</p>
                    <p className="text-gray-900">{user.loyaltyPoints.toLocaleString()} points</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Account ID</p>
                    <p className="text-gray-900 font-mono text-sm">{currentUser?.id?.slice(0, 8)}...</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
