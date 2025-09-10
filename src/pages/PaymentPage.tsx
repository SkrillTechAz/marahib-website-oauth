import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Trash2,
  Lock,
  AlertCircle
} from 'lucide-react';
import { paymentService, PaymentMethod, CreatePaymentMethodData, BillingAddress } from '../services/paymentService';

// Move PaymentModal component OUTSIDE to prevent recreation
const PaymentModal: React.FC<{
  showPaymentModal: boolean;
  editingPayment: PaymentMethod | null;
  formData: any;
  formLoading: boolean;
  showCvv: boolean;
  setShowCvv: (show: boolean) => void;
  emirates: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  closePaymentModal: () => void;
}> = ({
  showPaymentModal,
  editingPayment,
  formData,
  formLoading,
  showCvv,
  setShowCvv,
  emirates,
  handleInputChange,
  handleSubmit,
  closePaymentModal
}) => {
  if (!showPaymentModal) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const getCardBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'bg-blue-100 text-blue-700';
      case 'mastercard': return 'bg-red-100 text-red-700';
      case 'amex': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {editingPayment ? 'Edit Payment Method' : 'Add New Card'}
          </h2>
          <button
            onClick={closePaymentModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Secure Payment</span>
            </div>
            <p className="text-xs text-blue-700">
              Your payment information is encrypted and secure. We never store your complete card details.
            </p>
          </div>

          {!editingPayment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
              {formData.cardNumber && (
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCardBrandColor(paymentService.detectCardBrand(formData.cardNumber))}`}>
                    {paymentService.detectCardBrand(formData.cardNumber).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Name on card"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Month *
              </label>
              <select
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Year *
              </label>
              <select
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {!editingPayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <div className="relative">
                  <input
                    type={showCvv ? "text" : "password"}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-gray-900">Billing Address</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="billingAddress.address"
                value={formData.billingAddress.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="billingAddress.city"
                  value={formData.billingAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emirate
                </label>
                <select
                  name="billingAddress.emirate"
                  value={formData.billingAddress.emirate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Emirate</option>
                  {emirates.map(emirate => (
                    <option key={emirate} value={emirate}>{emirate}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="billingAddress.postalCode"
                value={formData.billingAddress.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-black focus:ring-black mr-2"
            />
            <label className="text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={closePaymentModal}
              disabled={formLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {formLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {editingPayment ? 'Update Card' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: {
      address: '',
      city: '',
      emirate: '',
      country: 'United Arab Emirates',
      postalCode: ''
    },
    isDefault: false
  });
  const [showCvv, setShowCvv] = useState(false);

  // Check if user is authenticated and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/signin', { 
          state: { message: 'Please sign in to access your dashboard.' }
        });
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);
        } else {
          localStorage.removeItem('access_token');
          navigate('/signin', { 
            state: { message: 'Session expired. Please sign in again.' }
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('access_token');
        navigate('/signin', { 
          state: { message: 'An error occurred. Please sign in again.' }
        });
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch payment methods when user is loaded
  useEffect(() => {
    if (currentUser) {
      fetchPaymentMethods();
    }
  }, [currentUser]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPaymentMethods = await paymentService.getUserPaymentMethods();
      setPaymentMethods(fetchedPaymentMethods);
    } catch (err: any) {
      console.error('Error fetching payment methods:', err);
      setError('Failed to load payment methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('access_token');
        navigate('/signin', { 
          state: { message: 'You have been successfully logged out.' }
        });
      } else {
        console.error('Logout failed');
        localStorage.removeItem('access_token');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('access_token');
      navigate('/signin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      billingAddress: {
        address: '',
        city: '',
        emirate: '',
        country: 'United Arab Emirates',
        postalCode: ''
      },
      isDefault: false
    });
    setEditingPayment(null);
    setShowPaymentModal(false);
    setShowCvv(false);
  };

  const emirates = [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'
  ];

  const getCardBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'bg-blue-100 text-blue-700';
      case 'mastercard': return 'bg-red-100 text-red-700';
      case 'amex': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const openPaymentModal = (payment?: PaymentMethod) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        cardNumber: `•••• •••• •••• ${payment.card_last4}`,
        cardholderName: payment.cardholder_name || '',
        expiryMonth: payment.card_exp_month || '',
        expiryYear: payment.card_exp_year || '',
        cvv: '',
        billingAddress: payment.billing_address || {
          address: '',
          city: '',
          emirate: '',
          country: 'United Arab Emirates',
          postalCode: ''
        },
        isDefault: payment.is_default
      });
    } else {
      resetForm();
    }
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = paymentService.formatCardNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name.includes('billingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editingPayment) {
        // Update existing payment method (only non-sensitive fields)
        const updatedPaymentMethod = await paymentService.updatePaymentMethod({
          id: editingPayment.id,
          cardholder_name: formData.cardholderName,
          card_exp_month: formData.expiryMonth,
          card_exp_year: formData.expiryYear,
          is_default: formData.isDefault,
          billing_address: formData.billingAddress
        });

        setPaymentMethods(prev => prev.map(pm => 
          pm.id === updatedPaymentMethod.id ? updatedPaymentMethod : pm
        ));
      } else {
        // Create new payment method
        // First tokenize the card data (in a real app, this would use Stripe)
        const tokenizedCardData = await paymentService.tokenizeCard({
          cardNumber: formData.cardNumber,
          expMonth: formData.expiryMonth,
          expYear: formData.expiryYear,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName
        });

        // Create the payment method with tokenized data
        const newPaymentMethod = await paymentService.createPaymentMethod({
          ...tokenizedCardData,
          is_default: formData.isDefault,
          billing_address: formData.billingAddress
        });

        setPaymentMethods(prev => [...prev, newPaymentMethod]);
      }

      resetForm();
    } catch (err: any) {
      console.error('Error saving payment method:', err);
      setError(err.message || 'Failed to save payment method. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSetDefault = async (paymentId: string) => {
    try {
      const updatedPaymentMethod = await paymentService.setDefaultPaymentMethod(paymentId);
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        is_default: pm.id === updatedPaymentMethod.id
      })));
    } catch (err: any) {
      console.error('Error setting default payment method:', err);
      setError(err.message || 'Failed to set default payment method. Please try again.');
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      await paymentService.deletePaymentMethod(paymentId);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentId));
    } catch (err: any) {
      console.error('Error deleting payment method:', err);
      setError(err.message || 'Failed to delete payment method. Please try again.');
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
    { id: 'orders', label: 'My Orders', icon: Package, path: '/dashboard/orders' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/dashboard/addresses' },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard, path: '/dashboard/payment' },
    { id: 'profile', label: 'Profile Settings', icon: User, path: '/dashboard/profile' },
    { id: 'support', label: 'Help & Support', icon: HelpCircle, path: '/dashboard/support' },
    { id: 'consultations', label: 'Consultations Chat', icon: MessageCircle, path: '/dashboard/consultations' },
  ];

  // Function to check if current path matches sidebar item
  const isActiveRoute = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname.startsWith(itemPath);
  };

  // Mock user data
  const user = {
    name: currentUser?.user_metadata?.first_name 
      ? `${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name || ''}`.trim()
      : currentUser?.email?.split('@')[0] || 'User',
    email: currentUser?.email || 'user@example.com',
    phone: currentUser?.user_metadata?.phone || '+971 50 123 4567',
    avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    memberSince: '2023',
    loyaltyPoints: 2284,
    tier: 'Gold'
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
              <h1 className="font-serif text-2xl text-gray-900">Payment Methods</h1>
              <p className="text-gray-600">Manage your saved payment methods</p>
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
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
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
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className='mb-6'>
              <h1 className="font-serif text-2xl text-gray-900">Payment Methods</h1>
              <p className="text-gray-600">Manage your saved payment methods</p>
            </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-gray-900">
                    Payment Methods ({paymentMethods.length})
                  </h3>
                  <button 
                    onClick={() => openPaymentModal()}
                    className="flex items-center px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Card
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment methods...</p>
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-600 mb-4">Add a payment method to make checkout faster</p>
                    <button 
                      onClick={() => openPaymentModal()}
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-8 rounded flex items-center justify-center ${getCardBrandColor(method.card_brand || '')}`}>
                              <span className="text-xs font-bold uppercase">{method.card_brand || 'CARD'}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">
                                  •••• •••• •••• {method.card_last4}
                                </p>
                                {method.is_default && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                Expires {method.card_exp_month}/{method.card_exp_year}
                              </p>
                              <p className="text-sm text-gray-500">{method.cardholder_name}</p>
                              {method.billing_address && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {method.billing_address.city}, {method.billing_address.emirate}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openPaymentModal(method)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {!method.is_default && (
                              <button 
                                onClick={() => handleSetDefault(method.id)}
                                className="text-sm text-gray-600 hover:underline"
                              >
                                Set Default
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeletePayment(method.id)}
                              className="text-sm text-red-600 hover:underline ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Your payments are secure</h4>
                    <p className="text-sm text-gray-600">
                      We use industry-standard encryption to protect your payment information. 
                      Your card details are tokenized and never stored in plain text.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        showPaymentModal={showPaymentModal}
        editingPayment={editingPayment}
        formData={formData}
        formLoading={formLoading}
        showCvv={showCvv}
        setShowCvv={setShowCvv}
        emirates={emirates}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        closePaymentModal={closePaymentModal}
      />
    </div>
  );
};

export default PaymentPage;