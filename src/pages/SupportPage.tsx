import React, { useState, useEffect, useCallback } from "react";
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
  Send,
  FileText,
  Headphones,
  Book,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SupportTicketModal } from "../components/support/SupportTicketModal";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isExpanded?: boolean;
}

interface SupportTicket {
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  category: string;
}

const supportCategories = [
  "Order Issues",
  "Delivery Questions",
  "Product Information",
  "Returns & Refunds",
  "Account & Billing",
  "Technical Support",
  "Other",
];

const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const [ticketData, setTicketData] = useState<SupportTicket>({
    subject: "",
    message: "",
    priority: "medium",
    category: "",
  });

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

  // Load FAQ data
  useEffect(() => {
    if (currentUser) {
      setFaqs([
        {
          id: "faq_1",
          question: "How can I track my order?",
          answer:
            'You can track your order by visiting the "My Orders" section in your dashboard. Click on any order to view detailed tracking information, including shipping updates and estimated delivery times. You will also receive email and SMS notifications (if enabled) with tracking updates.',
          isExpanded: false,
        },
        {
          id: "faq_2",
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for most items. Items must be in their original condition and packaging. Custom or personalized items cannot be returned unless defective. To initiate a return, contact our support team or visit your order details page. Return shipping costs may apply depending on the reason for return.",
          isExpanded: false,
        },
        {
          id: "faq_3",
          question: "Do you offer assembly services?",
          answer:
            "Yes, we offer professional assembly services for furniture purchases. Assembly services are available in Dubai, Abu Dhabi, and Sharjah. The service fee depends on the complexity and size of the item. You can add assembly service during checkout or contact us after purchase to arrange it.",
          isExpanded: false,
        },
        {
          id: "faq_4",
          question: "How can I change my delivery address?",
          answer:
            'You can change your delivery address in the "Addresses" section of your dashboard. If you have an active order, you can modify the delivery address within 2 hours of placing the order by contacting our support team. After this window, address changes may not be possible depending on the order status.',
          isExpanded: false,
        },
        {
          id: "faq_5",
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets. You can save your payment methods securely in your account for faster checkout. All transactions are encrypted and secure.",
          isExpanded: false,
        },
        {
          id: "faq_6",
          question: "Do you deliver outside the UAE?",
          answer:
            "Currently, we only deliver within the UAE to all seven emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Fujairah, Ras Al Khaimah, and Umm Al Quwain. We are working on expanding our delivery network to other GCC countries in the future.",
          isExpanded: false,
        },
        {
          id: "faq_7",
          question: "How long does delivery take?",
          answer:
            "Standard delivery takes 3-7 business days within the UAE. Express delivery (1-2 business days) is available for selected items and areas. Large furniture items may require 7-14 business days due to their size and assembly requirements. Delivery times may vary during peak seasons.",
          isExpanded: false,
        },
        {
          id: "faq_8",
          question: "Can I cancel my order?",
          answer:
            "You can cancel your order within 2 hours of placing it by contacting our support team. After this period, cancellation depends on the order status. If the order has already been processed or shipped, you may need to use our return policy instead.",
          isExpanded: false,
        },
      ]);
    }
  }, [currentUser]);

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
    loyaltyPoints: 2284,
    tier: "Gold",
  };

  const toggleFAQ = (faqId: string) => {
    setFaqs((prev) =>
      prev.map(
        (faq) =>
          faq.id === faqId
            ? { ...faq, isExpanded: !faq.isExpanded }
            : { ...faq, isExpanded: false } // Close other FAQs
      )
    );
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/support/tickets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        }
      );

      if (!res.ok) throw new Error(await res.json().message);
      setTicketSubmitted(true);
      setShowTicketForm(false);

      // reset
      setTicketData({
        subject: "",
        message: "",
        priority: "medium",
        category: "",
      });
      setTimeout(() => setTicketSubmitted(false), 5000);
    } catch (err) {
      console.error("ticket submit:", err);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // in SupportPage.tsx
  const handleTicketInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setTicketData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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
                Help & Support
              </h1>
              <p className="text-gray-600">
                Get help with your orders, account, and more
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
      </div>
 */}
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
              {ticketSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-green-700 font-medium">
                        Support ticket submitted successfully!
                      </p>
                      <p className="text-green-600 text-sm">
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
              <h1 className="font-serif text-2xl text-gray-900">
                Help & Support
              </h1>
              <p className="text-gray-600">
                Get help with your orders, account, and more
              </p>
            </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-gray-900">Help & Support</h3>
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="flex items-center px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors rounded-lg"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Support Ticket
                  </button>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">
                          Phone Support
                        </h4>
                        <p className="text-sm text-gray-600">
                          Speak with our customer service team
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        +971 4 123 4567
                      </p>
                      <p className="text-sm text-gray-600">
                        Mon-Fri: 9AM-6PM GST
                      </p>
                      <p className="text-sm text-gray-600">Sat: 10AM-4PM GST</p>
                      <a
                        href="tel:+97141234567"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call Now
                      </a>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">
                          Email Support
                        </h4>
                        <p className="text-sm text-gray-600">
                          Send us a detailed message
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        support@marahb.com
                      </p>
                      <p className="text-sm text-gray-600">
                        Response within 24 hours
                      </p>
                      <p className="text-sm text-gray-600">
                        Include your order number for faster service
                      </p>
                      <a
                        href="mailto:support@marahb.com"
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Send Email
                      </a>
                    </div>
                  </div>
                </div>

                {/* Live Chat Option */}
                {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">Designer Consultation Chat</h4>
                        <p className="text-sm text-gray-600">Get instant help from our interior design experts</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard/consultations"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors rounded-lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div> */}

                {/* FAQ Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Book className="w-5 h-5" />
                      Frequently Asked Questions
                    </h4>
                    <span className="text-sm text-gray-500">
                      {faqs.length} questions
                    </span>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-inset rounded-lg"
                        >
                          <p className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </p>
                          {faq.isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {faq.isExpanded && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Resources */}
                {/* <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Additional Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="#"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Shipping Guide</p>
                        <p className="text-xs text-gray-600">Delivery info & tracking</p>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Shield className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Return Policy</p>
                        <p className="text-xs text-gray-600">Terms & conditions</p>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Account Help</p>
                        <p className="text-xs text-gray-600">Profile & settings</p>
                      </div>
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal */}
      <SupportTicketModal
        visible={showTicketForm}
        onClose={() => setShowTicketForm(false)}
        ticketData={ticketData}
        onChange={handleTicketInputChange}
        onSubmit={handleTicketSubmit}
        isSubmitting={isSubmittingTicket}
        categories={supportCategories}
      />
    </div>
  );
};

export default SupportPage;
