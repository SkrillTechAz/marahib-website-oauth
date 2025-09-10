import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  product_designer?: string;
  product_type?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_color?: any;
  product_image?: string;
}

interface Order {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipping_address?: any;
  shipping_method?: string;
  shipping_cost?: number;
  payment_method?: string;
  notes?: string;
  order_items: OrderItem[];
}

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  //const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<Order | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  const isActiveRoute = (itemPath: string) => {
    if (itemPath === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(itemPath);
  };

  // Check if user is authenticated and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/signin", {
          state: { message: "Please sign in to access your dashboard." },
        });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);
        } else {
          localStorage.removeItem("access_token");
          navigate("/signin", {
            state: { message: "Session expired. Please sign in again." },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("access_token");
        navigate("/signin", {
          state: { message: "An error occurred. Please sign in again." },
        });
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch orders when orders tab is active
  /* useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]); */

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderDetails = async (referenceNumber: string) => {
    setLoadingOrderDetails(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${referenceNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedOrderDetails(data.order);
        setShowOrderDetails(true);
      } else {
        console.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

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

  // Handle sidebar item click
  /* const handleSidebarItemClick = (itemId: string) => {
    if (itemId === 'consultations') {
      navigate('/dashboard/consultations');
    } else {
      setActiveTab(itemId);
    }
  }; */

  // Mock user data for overview
  const user = {
    name: currentUser?.user_metadata?.first_name
      ? `${currentUser.user_metadata.first_name} ${
          currentUser.user_metadata.last_name || ""
        }`.trim()
      : currentUser?.email?.split("@")[0] || "User",
    email: currentUser?.email || "user@example.com",
    phone: currentUser?.user_metadata?.phone || "+971 50 123 4567",
    avatar:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    memberSince: "2023",
    totalOrders: orders.length,
    totalSpent: orders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    ),
    loyaltyPoints: 2284,
    tier: "Gold",
  };

  const wishlistItems = [
    {
      id: "wish_1",
      name: "Executive Office Desk",
      designer: "Herman Miller",
      price: 4595,
      originalPrice: 5330,
      image:
        "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=200&h=200",
      inStock: true,
    },
    {
      id: "wish_2",
      name: "Modern Table Lamp",
      designer: "Schoolhouse",
      price: 695,
      originalPrice: 915,
      image:
        "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=200&h=200",
      inStock: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === orderFilter);

  const handleViewOrderDetails = (order: Order) => {
    fetchOrderDetails(order.reference_number);
  };

  const sidebarItems = [
      { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
      { id: 'orders', label: 'My Orders', icon: Package, path: '/dashboard/orders' },
      { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
      { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/dashboard/addresses' },
      { id: 'payment', label: 'Payment Methods', icon: CreditCard, path: '/dashboard/payment' },
      { id: 'profile', label: 'Profile Settings', icon: User, path: '/dashboard/profile' },
      /* { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
      { id: 'security', label: 'Security', icon: Shield, path: '/dashboard/security' }, */
      { id: 'support', label: 'Help & Support', icon: HelpCircle, path: '/dashboard/support' },
      { id: 'consultations', label: 'Consultations Chat', icon: MessageCircle, path: '/dashboard/consultations' },
    ];

  // OrderDetailsModal Component
  const OrderDetailsModal = () => {
    if (!showOrderDetails || !selectedOrderDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <button
              onClick={() => setShowOrderDetails(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Header */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">
                    {selectedOrderDetails.reference_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedOrderDetails.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedOrderDetails.status
                    )}`}
                  >
                    {getStatusIcon(selectedOrderDetails.status)}
                    <span className="ml-1 capitalize">
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrderDetails.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      {item.product_designer && (
                        <p className="text-sm text-gray-600">
                          by {item.product_designer}
                        </p>
                      )}
                      {item.selected_color && (
                        <p className="text-sm text-gray-600">
                          Color: {item.selected_color}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <img
                          src="/ed.png"
                          className="w-[16px] inline-block"
                          alt=""
                        />
                        {Number(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold flex items-center gap-1">
                        <img
                          src="/ed.png"
                          className="w-[16px] inline-block"
                          alt=""
                        />
                        {Number(item.total_price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              {selectedOrderDetails.shipping_address && (
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {selectedOrderDetails.shipping_address.firstName}{" "}
                      {selectedOrderDetails.shipping_address.lastName}
                    </p>
                    <p>{selectedOrderDetails.shipping_address.address}</p>
                    {selectedOrderDetails.shipping_address.apartment && (
                      <p>{selectedOrderDetails.shipping_address.apartment}</p>
                    )}
                    <p>
                      {selectedOrderDetails.shipping_address.city},{" "}
                      {selectedOrderDetails.shipping_address.country}
                    </p>
                    {selectedOrderDetails.shipping_address.postalCode && (
                      <p>{selectedOrderDetails.shipping_address.postalCode}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div>
                <h3 className="font-semibold mb-2">Payment & Shipping</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {selectedOrderDetails.payment_method && (
                    <p>Payment: {selectedOrderDetails.payment_method}</p>
                  )}
                  {selectedOrderDetails.shipping_method && (
                    <p>Shipping: {selectedOrderDetails.shipping_method}</p>
                  )}
                  {selectedOrderDetails.shipping_cost && (
                    <p className="flex items-center gap-1">
                      Shipping Cost:{" "}
                      <img
                        src="/ed.png"
                        className="w-[16px] inline-block"
                        alt=""
                      />
                      {Number(
                        selectedOrderDetails.shipping_cost
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total Amount:</span>
                <span className="font-bold text-xl flex items-center gap-1">
                  <img src="/ed.png" className="w-[20px] inline-block" alt="" />
                  {Number(selectedOrderDetails.total_amount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrderDetails.notes && (
              <div>
                <h3 className="font-semibold mb-2">Order Notes</h3>
                <p className="text-gray-600">{selectedOrderDetails.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
              <h1 className="font-serif text-2xl text-gray-900">My Account</h1>
              <p className="text-gray-600">
                Manage your orders, preferences, and account settings
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
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
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
              <h1 className="font-serif text-2xl text-gray-900">My Account</h1>
              <p className="text-gray-600">
                Manage your orders, preferences, and account settings
              </p>
            </div>
            {/* Overview Tab */}

            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.totalOrders}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                        <img
                          src="/ed.png"
                          className="w-[20px] inline-block"
                          alt=""
                        />{" "}
                        {user.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Loyalty Points</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.loyaltyPoints}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {wishlistItems.length}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-gray-900">Recent Orders</h3>
                  <Link
                    to="/dashboard/orders"
                    className="text-sm text-black hover:underline flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => handleViewOrderDetails(order)}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {order.order_items?.[0]?.product_image && (
                          <img
                            src={order.order_items[0].product_image}
                            alt={order.order_items[0].product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.reference_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.order_items?.[0]?.product_name ||
                              "Order Items"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <img
                            src="/ed.png"
                            className="w-[20px] inline-block"
                            alt=""
                          />{" "}
                          {Number(order.total_amount).toLocaleString()}
                        </p>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-6">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate("/dashboard/orders")}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      Track Orders
                    </span>
                  </button>
                  <button 
                      onClick={() => navigate('/dashboard/wishlist')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-900">View Wishlist</span>
                    </button> 
                  <button 
                      onClick={() => navigate('/dashboard/support')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-900">Get Support</span>
                    </button> 
                  <button
                    onClick={() => navigate("/dashboard/consultations")}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-900">
                      Chat with Designers
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Tab */}
            {/* {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-gray-900">My Orders</h3>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-600" />
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-600">
                        {orderFilter === "all"
                          ? "You haven't placed any orders yet."
                          : `No ${orderFilter} orders found.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {order.reference_number}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Ordered on {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 flex items-center gap-1">
                                <img
                                  src="/ed.png"
                                  className="w-[16px] inline-block"
                                  alt=""
                                />
                                {Number(order.total_amount).toLocaleString()}
                              </p>
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {order.order_items?.length || 0} item(s)
                              </span>
                              {order.order_items &&
                                order.order_items.length > 0 && (
                                  <span className="text-sm text-gray-400">
                                    •
                                  </span>
                                )}
                              {order.order_items?.[0] && (
                                <span className="text-sm text-gray-600">
                                  {order.order_items[0].product_name}
                                  {order.order_items.length > 1 &&
                                    ` +${order.order_items.length - 1} more`}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                              disabled={loadingOrderDetails}
                              className="flex items-center gap-1 text-sm text-black hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loadingOrderDetails ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal />
    </div>
  );
};

export default CustomerDashboard;
