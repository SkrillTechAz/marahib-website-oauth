import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import VirtualStorePage from './pages/VirtualStorePage';
import VirtualStoresListPage from './pages/VirtualStoresListPage';
import ShopTheLookPage from './pages/ShopTheLookPage';
import DesignersPage from './pages/DesignersPage';
import DesignerDetailPage from './pages/DesignerDetailPage';
import DesignerRoomStylesPage from './pages/DesignerRoomStylesPage';
import LaunchPage from './pages/LaunchPage';
import FurniturePage from './pages/FurniturePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutUsPage from './pages/AboutUsPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ReturnsExchangesPage from './pages/ReturnsExchangesPage';
import WarrantyPage from './pages/WarrantyPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CustomerDashboard from './pages/CustomerDashboard';

// Specific category pages (if you want to keep them for special layouts)
import BedroomPage from './pages/BedroomPage';
import SofaSeatingPage from './pages/SofaSeatingPage';
import LivingRoomPage from './pages/LivingRoomPage';
import DiningRoomPage from './pages/DiningRoomPage';
import OfficePage from './pages/OfficePage';
import OutdoorPage from './pages/OutdoorPage';
import ModularPage from './pages/ModularPage';
import { AuthProvider } from './contexts/AuthContext';
import AuthCallback from './pages/auth/callback';
import NewArrivalsPage from './pages/NewArrivalsPage';
import { WishlistProvider } from './contexts/WishlistContext';
import WishlistPage from './pages/WishlistPage';
import ShippingDeliveryPage from './pages/ShippingDeliveryPage';
import CustomerConsultationsPage from './pages/CustomerConsultationsPage';
import ScrollToTop from './components/ScrollToTop';
import OrdersPage from './pages/OrdersPage';
import CustumerWishlistPage from './pages/CustumerWishlistPage';
import AddressesPage from './pages/AddressesPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import BestSellersPage from './pages/BestSellersPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <Routes>
            {/* Launch page - accessible to everyone */}
            <Route path="/launch" element={<LaunchPage />} />

            
            {/* Auth pages - only accessible when NOT authenticated */}
            <Route 
              path="/signin" 
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                  <SignInPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                  <SignUpPage />
                </ProtectedRoute>
              } 
            />
            
            
            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Public routes wrapped in Layout */}
            <Route path="/" element={<Layout />}>
            {/* Protected dashboard routes - require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/consultations" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CustomerConsultationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/orders" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/wishlist" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CustumerWishlistPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/addresses" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AddressesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/payment" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <PaymentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/support" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <SupportPage />
                </ProtectedRoute>
              } 
            />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/dashboard/consultations" element={<CustomerConsultationsPage />} />

              <Route path="/dashboard/orders" element={<OrdersPage />} />

              <Route index element={<HomePage />} />
              <Route path='/new' element={<NewArrivalsPage />} />
              <Route path="furniture" element={<FurniturePage />} />

              {/* Auth callback */}
              <Route path="auth/callback" element={<AuthCallback />} />

              {/* Category routes */}
              <Route path="category/:roomType" element={<CategoryPage />} />
              <Route path="category/:roomType/:subcategory" element={<CategoryPage />} />
              <Route path="category/bestsellers" element={<BestSellersPage />} />

              {/* Legacy/Special category routes */}
              <Route path="category/sofa-seating" element={<SofaSeatingPage />} />
              <Route path="category/modular" element={<ModularPage />} />
              <Route path="category/beds" element={<BedroomPage />} />

              {/* Product routes */}
              <Route path="product/:id" element={<ProductPage />} />

              {/* Wishlist Page - can be accessed without login but might show different content */}
              <Route path="/wishlist" element={<WishlistPage />} />
              
              {/* Cart and checkout - might want to protect checkout */}
              <Route path="cart" element={<CartPage />} />
              <Route 
                path="checkout" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="order-confirmation" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <OrderConfirmationPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Virtual stores */}
              <Route path="virtual-stores" element={<VirtualStoresListPage />} />
              <Route path="virtual-stores/:id" element={<VirtualStorePage />} />
              
              {/* Other pages */}
              <Route path="shop-the-look" element={<ShopTheLookPage />} />
              <Route path="designers" element={<DesignersPage />} />
              <Route path="designers/:id" element={<DesignerDetailPage />} />
              <Route path="designer-room-styles" element={<DesignerRoomStylesPage />} />
              
              {/* Footer pages */}
              <Route path="about" element={<AboutUsPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="shipping-delivery" element={<ShippingDeliveryPage />} />
              <Route path="returns-exchanges" element={<ReturnsExchangesPage />} />
              <Route path="warranty" element={<WarrantyPage />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;