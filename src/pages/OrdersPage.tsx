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
  FileText
} from 'lucide-react';

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

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

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

  // Fetch orders when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderDetails = async (referenceNumber: string) => {
    setLoadingOrderDetails(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${referenceNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedOrderDetails(data.order);
        setShowOrderDetails(true);
      } else {
        console.error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  // PDF Invoice Generation Function
  const generateInvoicePDF = async (order: Order) => {
    setDownloadingInvoice(order.reference_number);
    
    try {
      // Create the invoice HTML content
      const invoiceHTML = generateInvoiceHTML(order);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();

      // Wait for the content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  // Generate Invoice HTML
  const generateInvoiceHTML = (order: Order) => {
    const subtotal = order.order_items?.reduce((sum, item) => sum + Number(item.total_price), 0) || 0;
    const shippingCost = Number(order.shipping_cost || 0);
    const totalAmount = Number(order.total_amount);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order.reference_number}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #000;
          }
          
          .company-info h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000;
          }
          
          .company-info p {
            color: #666;
            font-size: 14px;
          }
          
          .invoice-details {
            text-align: right;
          }
          
          .invoice-details h2 {
            font-size: 24px;
            color: #000;
            margin-bottom: 10px;
          }
          
          .invoice-details p {
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          
          .billing-info, .shipping-info {
            flex: 1;
            margin-right: 20px;
          }
          
          .billing-info:last-child, .shipping-info:last-child {
            margin-right: 0;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          
          .info-item {
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table th {
            background-color: #f8f9fa;
            padding: 12px 8px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
            font-weight: bold;
            font-size: 14px;
          }
          
          .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #dee2e6;
            font-size: 14px;
          }
          
          .items-table .text-right {
            text-align: right;
          }
          
          .items-table .text-center {
            text-align: center;
          }
          
          .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .summary-table {
            width: 300px;
            border-collapse: collapse;
          }
          
          .summary-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
          }
          
          .summary-table .summary-label {
            text-align: right;
            font-weight: 500;
          }
          
          .summary-table .summary-value {
            text-align: right;
            width: 120px;
          }
          
          .summary-table .total-row {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
          }
          
          .footer-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .status-delivered { background-color: #d4edda; color: #155724; }
          .status-shipped { background-color: #cce7ff; color: #0056b3; }
          .status-processing { background-color: #fff3cd; color: #856404; }
          .status-pending { background-color: #f8d7da; color: #721c24; }
          
          @media print {
            .invoice-container {
              padding: 20px;
            }
            
            body {
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="invoice-header">
            <div class="company-info">
              <h1>Your Company Name</h1>
              <p>123 Business Street</p>
              <p>Dubai, UAE</p>
              <p>contact@yourcompany.com</p>
              <p>+971 4 123 4567</p>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> ${order.reference_number}</p>
              <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
              <p><strong>Due Date:</strong> ${currentDate}</p>
              <div class="status-badge status-${order.status.toLowerCase()}">
                ${order.status}
              </div>
            </div>
          </div>

          <!-- Billing & Shipping Information -->
          <div class="billing-section">
            <div class="billing-info">
              <div class="section-title">Bill To</div>
              <div class="info-item"><strong>${order.customer_name}</strong></div>
              <div class="info-item">${order.customer_email}</div>
              ${order.customer_phone ? `<div class="info-item">${order.customer_phone}</div>` : ''}
            </div>
            
            ${order.shipping_address ? `
            <div class="shipping-info">
              <div class="section-title">Ship To</div>
              <div class="info-item"><strong>${order.shipping_address.firstName} ${order.shipping_address.lastName}</strong></div>
              <div class="info-item">${order.shipping_address.address}</div>
              ${order.shipping_address.apartment ? `<div class="info-item">${order.shipping_address.apartment}</div>` : ''}
              <div class="info-item">${order.shipping_address.city}${order.shipping_address.postalCode ? `, ${order.shipping_address.postalCode}` : ''}</div>
              <div class="info-item">${order.shipping_address.country}</div>
            </div>
            ` : ''}
          </div>

          <!-- Order Items -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items?.map(item => `
                <tr>
                  <td>
                    <strong>${item.product_name}</strong>
                    ${item.product_designer ? `<br><small>Designer: ${item.product_designer}</small>` : ''}
                    ${item.product_type ? `<br><small>Type: ${item.product_type}</small>` : ''}
                    ${item.selected_color ? `<br><small>Color: ${typeof item.selected_color === 'object' ? item.selected_color.name : item.selected_color}</small>` : ''}
                  </td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">AED ${Number(item.unit_price).toLocaleString()}</td>
                  <td class="text-right">AED ${Number(item.total_price).toLocaleString()}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div class="summary-section">
            <table class="summary-table">
              <tr>
                <td class="summary-label">Subtotal:</td>
                <td class="summary-value">AED ${subtotal.toLocaleString()}</td>
              </tr>
              ${shippingCost > 0 ? `
              <tr>
                <td class="summary-label">Shipping (${order.shipping_method || 'Standard'}):</td>
                <td class="summary-value">AED ${shippingCost.toLocaleString()}</td>
              </tr>
              ` : ''}
              <tr class="total-row">
                <td class="summary-label">Total Amount:</td>
                <td class="summary-value">AED ${totalAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Payment Information -->
          ${order.payment_method ? `
          <div style="margin-bottom: 30px;">
            <div class="section-title">Payment Information</div>
            <div class="info-item"><strong>Payment Method:</strong> ${order.payment_method}</div>
            <div class="info-item"><strong>Payment Status:</strong> Completed</div>
          </div>
          ` : ''}

          <!-- Notes -->
          ${order.notes ? `
          <div style="margin-bottom: 30px;">
            <div class="section-title">Order Notes</div>
            <div class="info-item">${order.notes}</div>
          </div>
          ` : ''}

          <!-- Footer -->
          <div class="footer-section">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice. No signature required.</p>
            <p>For any questions regarding this invoice, please contact us at support@yourcompany.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
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
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + Number(order.total_amount), 0),
    loyaltyPoints: 2284,
    tier: 'Gold'
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === orderFilter);

  const handleViewOrderDetails = (order: Order) => {
    fetchOrderDetails(order.reference_number);
  };

  // OrderDetailsModal Component
  const OrderDetailsModal = () => {
    if (!showOrderDetails || !selectedOrderDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => generateInvoicePDF(selectedOrderDetails)}
                disabled={downloadingInvoice === selectedOrderDetails.reference_number}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingInvoice === selectedOrderDetails.reference_number ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Download Invoice
              </button>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Order Header */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{selectedOrderDetails.reference_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{formatDate(selectedOrderDetails.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrderDetails.status)}`}>
                    {getStatusIcon(selectedOrderDetails.status)}
                    <span className="ml-1 capitalize">{selectedOrderDetails.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrderDetails.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
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
                        <p className="text-sm text-gray-600">by {item.product_designer}</p>
                      )}
                      {item.selected_color && (
                        <p className="text-sm text-gray-600">Color: {item.selected_color}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 
                        {Number(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold flex items-center gap-1">
                        <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 
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
                    <p>{selectedOrderDetails.shipping_address.firstName} {selectedOrderDetails.shipping_address.lastName}</p>
                    <p>{selectedOrderDetails.shipping_address.address}</p>
                    {selectedOrderDetails.shipping_address.apartment && (
                      <p>{selectedOrderDetails.shipping_address.apartment}</p>
                    )}
                    <p>{selectedOrderDetails.shipping_address.city}, {selectedOrderDetails.shipping_address.country}</p>
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
                      Shipping Cost: <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 
                      {Number(selectedOrderDetails.shipping_cost).toLocaleString()}
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
                  <img src="/ed.png" className='w-[20px] inline-block' alt="" /> 
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
              <h1 className="font-serif text-2xl text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className='mb-6'>
              <h1 className="font-serif text-2xl text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">
                      {orderFilter === 'all' 
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
                            <h4 className="font-medium text-gray-900">{order.reference_number}</h4>
                            <p className="text-sm text-gray-600">Ordered on {formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 flex items-center gap-1">
                              <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 
                              {Number(order.total_amount).toLocaleString()}
                            </p>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {order.order_items?.length || 0} item(s)
                            </span>
                            {order.order_items && order.order_items.length > 0 && (
                              <span className="text-sm text-gray-400">•</span>
                            )}
                            {order.order_items?.[0] && (
                              <span className="text-sm text-gray-600">
                                {order.order_items[0].product_name}
                                {order.order_items.length > 1 && ` +${order.order_items.length - 1} more`}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => generateInvoicePDF(order)}
                              disabled={downloadingInvoice === order.reference_number}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {downloadingInvoice === order.reference_number ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              Invoice
                            </button>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal />
    </div>
  );
};

export default OrdersPage;