import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Truck,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Shield
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthCheckModal from '../components/AuthCheckModal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CustomCheckoutForm } from '../components/checkout-form/checkout-form';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'premium'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    country: 'UAE',
    postalCode: '',
    saveInfo: true,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddressSame: true
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    } else if (user) {
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
      }));
    }
  }, [isAuthenticated, user, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleAuthClose = () => {
    // If user closes auth modal without signing in, redirect to cart
    setShowAuthModal(false);
    navigate('/cart');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
console.log("activeStep: ", activeStep);

    if (activeStep === 'shipping') {
      setActiveStep('payment');
      window.scrollTo(0, 0);
    } else if (activeStep === 'payment') {
      setActiveStep('review');
      window.scrollTo(0, 0);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('access_token');

      const orderData = {
        items: cart.items.map(item => ({
          productId: item.id,
          name: item.name,
          designer: item.designer,
          type: item.type,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor,
          image: item.image,
        })),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        shippingMethod,
        paymentMethod,
        paymentInfo: paymentMethod === 'card' ? {
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
        } : null,
        discount: cart.discount,
        notes: '',
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Clear cart and redirect to confirmation
      clearCart();
      navigate(`/order-confirmation?order=${result.order.reference_number}`, {
        state: { order: result.order }
      });

    } catch (error) {
      console.error('Order creation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = {
    standard: 0,
    express: 50,
    premium: 150
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated - but don't show the fallback UI
  // The auth modal will handle the authentication flow
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to continue with checkout</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
        <AuthCheckModal
          isOpen={showAuthModal}
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
          title="Sign in to checkout"
          subtitle="Please sign in to complete your purchase"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <div className="text-center">
            <h1 className="font-serif text-2xl md:text-3xl text-gray-900">CHECKOUT</h1>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep === 'shipping' || activeStep === 'payment' || activeStep === 'review'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
                }`}>
                1
              </div>
              <span className={`ml-2 text-sm ${activeStep === 'shipping' || activeStep === 'payment' || activeStep === 'review'
                  ? 'text-black font-medium'
                  : 'text-gray-500'
                }`}>
                Shipping
              </span>
              <div className={`w-24 h-0.5 mx-4 ${activeStep === 'payment' || activeStep === 'review'
                  ? 'bg-black'
                  : 'bg-gray-200'
                }`} />
            </div>

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep === 'payment' || activeStep === 'review'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
                }`}>
                2
              </div>
              <span className={`ml-2 text-sm ${activeStep === 'payment' || activeStep === 'review'
                  ? 'text-black font-medium'
                  : 'text-gray-500'
                }`}>
                Payment
              </span>
              <div className={`w-24 h-0.5 mx-4 ${activeStep === 'review'
                  ? 'bg-black'
                  : 'bg-gray-200'
                }`} />
            </div>

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep === 'review'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
                }`}>
                3
              </div>
              <span className={`ml-2 text-sm ${activeStep === 'review'
                  ? 'text-black font-medium'
                  : 'text-gray-500'
                }`}>
                Review
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className={`bg-gray-50 rounded-lg overflow-hidden ${activeStep !== 'shipping' ? 'border border-gray-200' : ''}`}>
              <div
                className={`p-6 ${activeStep !== 'shipping' ? 'cursor-pointer' : ''} ${activeStep !== 'shipping' ? 'border-b border-gray-200' : ''}`}
                onClick={() => activeStep !== 'shipping' && setActiveStep('shipping')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${activeStep === 'shipping' || activeStep === 'payment' || activeStep === 'review'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}>
                      1
                    </div>
                    <h2 className="font-medium text-lg text-gray-900">Shipping Information</h2>
                  </div>
                  {activeStep !== 'shipping' && (
                    activeStep === 'payment' || activeStep === 'review' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )
                  )}
                </div>
              </div>

              {activeStep === 'shipping' && (
                <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, Suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      >
                        <option value="UAE">United Arab Emirates</option>
                        <option value="KSA">Saudi Arabia</option>
                        <option value="QAT">Qatar</option>
                        <option value="KWT">Kuwait</option>
                        <option value="BHR">Bahrain</option>
                        <option value="OMN">Oman</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        // required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        id="saveInfo"
                        name="saveInfo"
                        type="checkbox"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-black focus:ring-black bg-white border-gray-300 rounded"
                      />
                      <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
                        Save this information for next time
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Shipping Method</h3>
                    <div className="space-y-4">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer ${shippingMethod === 'standard' ? 'border-black' : 'border-gray-200'}`}
                        onClick={() => setShippingMethod('standard')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="standard"
                                name="shippingMethod"
                                checked={shippingMethod === 'standard'}
                                onChange={() => setShippingMethod('standard')}
                                className="h-4 w-4 text-black focus:ring-black bg-white border-gray-300"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">Standard Shipping</p>
                                <p className="text-sm text-gray-600">3-5 business days</p>
                              </div>
                            </div>
                          </div>
                          <div className="font-medium text-gray-900">
                            {shippingCost.standard === 0 ? 'Free' : <><img src="/ed.png" className='w-[20px] inline-block' alt="" /> {shippingCost.standard}</>}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer ${shippingMethod === 'express' ? 'border-black' : 'border-gray-200'}`}
                        onClick={() => setShippingMethod('express')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="express"
                              name="shippingMethod"
                              checked={shippingMethod === 'express'}
                              onChange={() => setShippingMethod('express')}
                              className="h-4 w-4 text-black focus:ring-black bg-white border-gray-300"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">Express Shipping</p>
                              <p className="text-sm text-gray-600">1-2 business days</p>
                            </div>
                          </div>
                          <div className="font-medium text-gray-900 flex items-center gap-1">
                            <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {shippingCost.express}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer ${shippingMethod === 'premium' ? 'border-black' : 'border-gray-200'}`}
                        onClick={() => setShippingMethod('premium')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="premium"
                              name="shippingMethod"
                              checked={shippingMethod === 'premium'}
                              onChange={() => setShippingMethod('premium')}
                              className="h-4 w-4 text-black focus:ring-black bg-white border-gray-300"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">Premium Delivery</p>
                              <p className="text-sm text-gray-600">White glove service with assembly</p>
                            </div>
                          </div>
                          <div className="font-medium text-gray-900 flex items-center gap-1">
                            <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {shippingCost.premium}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 px-6 font-medium hover:bg-gray-900 transition-all duration-300 uppercase tracking-wide flex items-center justify-center"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </form>
              )}
            </div>

            {/* Payment Information */}
            <div className={`bg-gray-50 rounded-lg overflow-hidden ${activeStep !== 'payment' ? 'border border-gray-200' : ''}`}>
              <div
                className={`p-6 ${activeStep !== 'payment' ? 'cursor-pointer' : ''} ${activeStep !== 'payment' ? 'border-b border-gray-200' : ''}`}
                onClick={() => activeStep === 'review' && setActiveStep('payment')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${activeStep === 'payment' || activeStep === 'review'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}>
                      2
                    </div>
                    <h2 className="font-medium text-lg text-gray-900">Payment Method</h2>
                  </div>
                  {activeStep !== 'payment' && (
                    activeStep === 'review' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )
                  )}
                </div>
              </div>

              {activeStep === 'payment' && (
                <Elements stripe={stripePromise}>
                  <CustomCheckoutForm amount={(cart.total + shippingCost[shippingMethod])} onPaySubmit={handleSubmit} />
                </Elements>
              )}
            </div>

            {/* Order Review */}
            <div className={`bg-gray-50 rounded-lg overflow-hidden ${activeStep !== 'review' ? 'border border-gray-200' : ''}`}>
              <div
                className={`p-6 ${activeStep !== 'review' ? 'cursor-pointer' : ''}`}
                onClick={() => activeStep === 'review' && setActiveStep('review')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${activeStep === 'review'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}>
                      3
                    </div>
                    <h2 className="font-medium text-lg text-gray-900">Review Order</h2>
                  </div>
                  {activeStep !== 'review' && (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {activeStep === 'review' && (
                <div className="p-6 border-t border-gray-200">
                  <div className="space-y-6">
                    {/* Shipping Information Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Shipping Information</h3>
                        <button
                          type="button"
                          onClick={() => setActiveStep('shipping')}
                          className="text-sm text-gray-700 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                        <p className="text-gray-700">{formData.address}</p>
                        {formData.apartment && <p className="text-gray-700">{formData.apartment}</p>}
                        <p className="text-gray-700">{formData.city}, {formData.country} {formData.postalCode}</p>
                        <p className="text-gray-700">{formData.phone}</p>
                        <p className="text-gray-700">{formData.email}</p>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-gray-900 font-medium">
                            {shippingMethod === 'standard' && 'Standard Shipping (3-5 business days)'}
                            {shippingMethod === 'express' && 'Express Shipping (1-2 business days)'}
                            {shippingMethod === 'premium' && 'Premium Delivery (White glove service)'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Payment Method</h3>
                        <button
                          type="button"
                          onClick={() => setActiveStep('payment')}
                          className="text-sm text-gray-700 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        {paymentMethod === 'card' && (
                          <div className="flex items-center">
                            <div className="w-8 h-5 bg-gray-200 rounded mr-3"></div>
                            <div>
                              <p className="font-medium text-gray-900">Credit Card</p>
                              <p className="text-gray-700">**** **** **** {formData.cardNumber.slice(-4) || '1234'}</p>
                            </div>
                          </div>
                        )}
                        {paymentMethod === 'bank' && (
                          <p className="font-medium text-gray-900">Bank Transfer</p>
                        )}
                        {paymentMethod === 'cod' && (
                          <p className="font-medium text-gray-900">Cash on Delivery</p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 bg-gray-100 rounded-lg">
                            <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                                  <p className="text-xs text-gray-600">{item.designer}</p>
                                  {item.selectedColor && (
                                    <div className="flex items-center mt-1">
                                      <div
                                        className="w-3 h-3 rounded-full border border-gray-300 mr-1"
                                        style={{ backgroundColor: item.selectedColor.hex }}
                                      />
                                      <span className="text-xs text-gray-600">{item.selectedColor.name}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[20px] inline-block' alt="" /> {(item.price * item.quantity).toLocaleString()}</p>
                                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full bg-black text-white py-4 px-6 font-medium hover:bg-gray-900 transition-all duration-300 uppercase tracking-wide flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'PLACE ORDER'
                      )}
                    </button>

                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <p>
                        By placing your order, you agree to our{' '}
                        <Link to="/terms-and-conditions" className="text-gray-900 hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy-policy" className="text-gray-900 hover:underline">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24 border border-gray-200">
              <h2 className="font-medium text-lg text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[20px] inline-block' alt="" /> {cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shippingCost[shippingMethod] === 0 ? 'Free' : <span className='flex items-center gap-1'><img src="/ed.png" className='w-[20px] inline-block' alt="" /> {shippingCost[shippingMethod]}</span>}
                  </span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span className="font-medium flex items-center gap-1">-<img src="/ed.png" className='w-[20px] inline-block' alt="" /> {cart.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-medium text-gray-900">Total (incl. VAT)</span>
                  <span className="font-bold text-xl text-gray-900  flex items-center gap-1">
                    <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {(cart.total + shippingCost[shippingMethod]).toLocaleString()}
                  </span>
                </div>
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Reward points</span>
                    <span className="font-medium">{Math.floor((cart.total + shippingCost[shippingMethod]) / 10)} Points</span>
                  </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2 text-gray-500" />
                  <span className=' flex items-center gap-1'>Free shipping on orders over <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 500</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Secure checkout with 256-bit SSL encryption</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Have a promo code?</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                  />
                  <button
                    type="button"
                    className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-gray-900 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <Link to="/shipping-delivery" className="text-gray-700 hover:underline">
                      Shipping & Delivery
                    </Link>
                  </p>
                  <p>
                    <Link to="/returns-exchanges" className="text-gray-700 hover:underline">
                      Returns & Exchanges
                    </Link>
                  </p>
                  <p>
                    <Link to="/contact" className="text-gray-700 hover:underline">
                      Contact Customer Service
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal - Only show when showAuthModal is true */}
      {showAuthModal && (
        <AuthCheckModal
          isOpen={showAuthModal}
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
          title="Sign in to checkout"
          subtitle="Please sign in to complete your purchase"
        />
      )}
    </div>
  );
};

export default CheckoutPage;