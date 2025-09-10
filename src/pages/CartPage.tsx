import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Star,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import AuthCheckModal from "../components/AuthCheckModal";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleApplyPromo = async () => {
    setIsApplyingPromo(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.toLowerCase() === "welcome10") {
        alert("Promo code applied! 10% discount added.");
      } else {
        alert("Invalid promo code. Please try again.");
      }
    }, 1000);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // If authenticated, navigate directly to checkout
    navigate("/checkout");
  };

  const handleAuthSuccess = () => {
    // Close the auth modal
    setShowAuthModal(false);

    // Small delay to ensure modal closes, then navigate to checkout
    setTimeout(() => {
      navigate("/checkout");
    }, 100);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                Discover our curated furniture collections and create your
                perfect space.
              </p>
              <Link
                to="/"
                className="inline-flex items-center bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
                  Shopping Cart
                </h1>
                <p className="text-gray-600">
                  {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in
                  your cart
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item) => {
                  const isExpanded = expandedItems.includes(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg overflow-hidden border border-gray-200"
                    >
                      <div className="flex gap-6 p-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900 text-lg line-clamp-2">
                                {item.name}
                              </h4>
                              <p className="text-gray-600">{item.designer}</p>

                              {/* Type Badge */}
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    item.type === "product"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {item.type === "product"
                                    ? "Individual Item"
                                    : "Designer Collection"}
                                </span>
                              </div>

                              {item.selectedColor && (
                                <div className="flex items-center mt-1">
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300 mr-2"
                                    style={{
                                      backgroundColor: item.selectedColor.hex,
                                    }}
                                  />
                                  <span className="text-xs text-gray-600">
                                    {item.selectedColor.name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-xl text-gray-900 flex items-center justify-end gap-1">
                                <img
                                  src="/ed.png"
                                  className="w-[1em] h-[1em]"
                                  alt=""
                                />
                                {formatPrice((item.price * item.quantity))}
                              </p>
                              {item.originalPrice && (
                                <p className="text-gray-500 line-through text-sm flex items-center justify-end gap-1">
                                  <img
                                    src="/ed.png"
                                    className="w-[1em] h-[1em]"
                                    alt=""
                                  />
                                  {(
                                    formatPrice(item.originalPrice * item.quantity)
                                  )}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Price incl. VAT
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      {item.type === "product" && (
                        <div className="border-t border-gray-100 px-6 py-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span>4.5 (12 reviews)</span>
                            </div>
                            <span>
                              Added{" "}
                              {new Date(item.addedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="font-medium text-gray-900 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal ({cart.itemCount} items)
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <img
                          src="/ed.png"
                          className="w-[16px] inline-block"
                          alt=""
                        />{" "}
                        {cart.subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {cart.shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <img
                              src="/ed.png"
                              className="w-[20px] inline-block"
                              alt=""
                            />{" "}
                            ${cart.shipping.toLocaleString()}
                          </span>
                        )}
                      </span>
                    </div>

                    {cart.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium flex items-center gap-1">
                          -
                          <img
                            src="/ed.png"
                            className="w-[20px] inline-block"
                            alt=""
                          />{" "}
                          {cart.discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="font-medium text-gray-900">
                        Total (incl. VAT)
                      </span>
                      <span className="font-bold text-xl text-gray-900 flex items-center gap-1">
                        <img
                          src="/ed.png"
                          className="w-[20px] inline-block"
                          alt=""
                        />{" "}
                        {cart.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Truck className="w-4 h-4 mr-2" />
                      <span>
                        {cart.subtotal >= 500 ? (
                          "Free shipping on this order"
                        ) : (
                          <span className="flex items-center gap-1">
                            Add{" "}
                            <img
                              src="/ed.png"
                              className="w-[20px] inline-block"
                              alt=""
                            />{" "}
                            {(500 - cart.subtotal).toLocaleString()} more for
                            free shipping
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Secure checkout with 256-bit SSL encryption</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Have a promo code?
                    </h3>
                    <div className="flex">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoCode}
                        className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 bg-black text-white py-4 px-6 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide flex items-center justify-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </button>

                  {/* Payment Methods */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 mb-2">We accept</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-10 h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div className="w-10 h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
                        MC
                      </div>
                      <div className="w-10 h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
                        AMEX
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Need Help */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="font-medium text-gray-900 mb-4">Need Help?</h3>
                  <div className="space-y-2 text-sm">
                    <Link
                      to="/shipping-delivery"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Shipping & Delivery
                    </Link>
                    <Link
                      to="/returns-exchanges"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Returns & Exchanges
                    </Link>
                    <Link
                      to="/contact"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Contact Customer Service
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthCheckModal
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        title="Sign in to checkout"
        subtitle="Please sign in to complete your purchase"
      />
    </>
  );
};

export default CartPage;
