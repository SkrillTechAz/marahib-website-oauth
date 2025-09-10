import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Shield,
  ArrowRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import AuthCheckModal from "../AuthCheckModal";
import { designerRoomStyles } from "../../data/roomStyles";
import { designerProjects } from "../../data/designerProjects";
import { featuredProducts } from "../../data/products";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getItemDetails = (item: any) => {
    if (item.type === "room-style") {
      const roomStyle = designerRoomStyles.find(
        (rs) => rs.id === item.roomStyleId
      );
      return roomStyle;
    } else if (item.type === "designer-collection") {
      const project = designerProjects.find(
        (p) => p.id === item.designerCollectionId
      );
      return project;
    }
    return null;
  };

  const getIncludedProducts = (item: any) => {
    const details = getItemDetails(item);
    if (details && "products" in details) {
      return featuredProducts.filter((product) =>
        details.products.includes(product.id)
      );
    }
    return [];
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // If authenticated, proceed directly to checkout
    setIsCheckingOut(true);
    onClose(); // Close the drawer
    navigate("/checkout");
    setIsCheckingOut(false);
  };

  const handleAuthSuccess = () => {
    // Close the auth modal first
    setShowAuthModal(false);

    // Small delay to ensure modal closes, then proceed to checkout
    setTimeout(() => {
      onClose(); // Close the drawer
      navigate("/checkout");
    }, 100);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const parsePrice = (price: string | number): number => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      return parseFloat(price.replace(/,/g, "")) || 0;
    }
    return 0;
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] pointer-events-none"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[61] flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                <h2 className="font-serif text-xl text-gray-900">
                  Shopping Cart ({cart.itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Discover our curated furniture collections and add items to
                    your cart.
                  </p>
                  <div
                    onClick={onClose}
                    className="bg-black cursor-pointer text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide"
                  >
                    Continue Shopping
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {cart.items.map((item) => {
                    const itemDetails = getItemDetails(item);
                    const includedProducts = getIncludedProducts(item);
                    const isExpanded = expandedItems.includes(item.id);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-50 rounded-lg overflow-hidden"
                      >
                        <div className="flex gap-4 p-4">
                          <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {item.designer}
                                </p>

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
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="p-1 hover:bg-gray-100 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-1 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="font-medium text-gray-900 flex items-center justify-end gap-1">
                                  <img
                                    src="/ed.png"
                                    className="w-[1em] h-[1em]"
                                    alt=""
                                  />
                                  {formatPrice(
                                    parsePrice(item.price) * item.quantity
                                  )}
                                </p>
                                {item.originalPrice && (
                                  <p className="text-xs text-gray-500 line-through flex items-center justify-end gap-1">
                                    <img
                                      src="/ed.png"
                                      className="w-[1em] h-[1em]"
                                      alt=""
                                    />
                                    {formatPrice(
                                      parsePrice(item.originalPrice) *
                                        item.quantity
                                    )}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500">
                                  Price incl. VAT
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Product Details for individual items */}
                        {item.type === "product" && (
                          <div className="border-t border-gray-200 bg-white px-4 py-2">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span>0 (0)</span>
                              </div>
                              <span>
                                Added{" "}
                                {new Date(
                                  item.addedAt || Date.now()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Expandable Details for Complete Designs */}
                        {(item.type === "room-style" ||
                          item.type === "designer-collection") &&
                          getItemDetails(item) && (
                            <>
                              <div className="px-4 pb-2">
                                <button
                                  onClick={() => toggleItemExpansion(item.id)}
                                  className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                  <span className="font-medium">
                                    {item.type === "room-style"
                                      ? "View included furniture"
                                      : "View design details"}
                                    {getIncludedProducts(item).length > 0 &&
                                      ` (${
                                        getIncludedProducts(item).length
                                      } items)`}
                                  </span>
                                  {expandedItems.includes(item.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              <AnimatePresence>
                                {expandedItems.includes(item.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-200 bg-white"
                                  >
                                    <div className="p-4 space-y-3">
                                      {/* Features/What's Included */}
                                      {getItemDetails(item)?.features && (
                                        <div>
                                          <h5 className="font-medium text-gray-900 text-xs mb-2 uppercase tracking-wide">
                                            What's Included:
                                          </h5>
                                          <ul className="space-y-1">
                                            {getItemDetails(item)
                                              ?.features.slice(0, 4)
                                              .map(
                                                (
                                                  feature: string,
                                                  index: number
                                                ) => (
                                                  <li
                                                    key={index}
                                                    className="flex items-start text-xs text-gray-600"
                                                  >
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                                                    {feature}
                                                  </li>
                                                )
                                              )}
                                            {getItemDetails(item)?.features
                                              .length > 4 && (
                                              <li className="text-xs text-gray-500 italic">
                                                +{" "}
                                                {getItemDetails(item)?.features
                                                  .length - 4}{" "}
                                                more features
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Individual Products (for room styles) */}
                                      {getIncludedProducts(item).length > 0 && (
                                        <div>
                                          <h5 className="font-medium text-gray-900 text-xs mb-2 uppercase tracking-wide">
                                            Furniture Pieces:
                                          </h5>
                                          <div className="grid grid-cols-2 gap-2">
                                            {getIncludedProducts(item)
                                              .slice(0, 4)
                                              .map((product) => (
                                                <div
                                                  key={product.id}
                                                  className="bg-gray-50 rounded p-2"
                                                >
                                                  <div className="aspect-square bg-white rounded mb-1 overflow-hidden">
                                                    <img
                                                      src={product.images[0]}
                                                      alt={product.name}
                                                      className="w-full h-full object-contain"
                                                    />
                                                  </div>
                                                  <p className="text-xs font-medium text-gray-900 line-clamp-1">
                                                    {product.name}
                                                  </p>
                                                  <p className="text-xs text-gray-600 flex items-baseline gap-1">
                                                    <svg
                                                      className="w-[1em] h-[1em] fill-current"
                                                      viewBox="0 0 300 300"
                                                    >
                                                      <g transform="translate(0,300) scale(0.1,-0.1)">
                                                        <path d="M700 2452 c0 -2 11 -22 24 -45 47 -80 56 -143 57 -392 l1 -230 -110 0 c-99 0 -114 2 -141 23 -17 12 -32 22 -34 22 -12 0 14 -125 32 -154 37 -59 84 -81 174 -82 l79 0 1 -97 2 -97 -106 0 c-97 0 -109 2 -143 25 -20 14 -39 25 -40 25 -6 0 5 -82 15 -117 25 -81 93 -122 204 -123 l70 0 -2 -82 c-2 -46 -4 -164 -6 -263 -3 -161 -5 -185 -25 -230 -13 -27 -33 -60 -44 -72 l-21 -23 380 0 c405 0 537 8 672 41 187 46 300 108 427 234 77 76 98 104 137 185 26 52 53 120 61 150 l13 55 131 3 c129 3 130 2 163 -25 l32 -28 -6 63 c-14 130 -74 182 -212 182 l-75 0 0 100 0 100 83 0 c111 0 152 -8 182 -36 l25 -23 0 37 c0 55 -17 107 -47 142 -41 50 -72 60 -177 60 l-94 0 -22 73 c-39 128 -95 222 -195 323 -150 152 -325 233 -568 264 -72 9 -897 20 -897 12z m370 -48 c0 -3 -9 -17 -20 -31 -19 -24 -20 -41 -20 -301 l0 -276 27 -28 27 -28 481 0 c470 0 482 0 503 20 30 28 28 69 -8 181 -38 117 -77 185 -150 263 -70 73 -138 116 -249 155 -102 36 -111 44 -41 36 145 -18 333 -93 447 -179 101 -76 186 -191 233 -313 40 -105 53 -133 68 -145 7 -7 59 -15 114 -18 101 -6 101 -6 135 -44 19 -20 33 -42 30 -49 -2 -8 -36 -11 -113 -9 -148 3 -164 -11 -164 -148 0 -73 3 -83 25 -105 21 -22 33 -25 90 -25 77 0 118 -17 145 -63 11 -18 20 -35 20 -39 0 -5 -60 -8 -132 -8 -97 -1 -138 -4 -151 -14 -10 -8 -31 -49 -46 -92 -55 -157 -128 -266 -233 -353 -129 -106 -341 -185 -527 -196 -91 -6 -88 7 5 21 122 18 276 103 359 197 58 66 118 181 144 277 26 94 26 114 -1 140 -21 20 -33 20 -506 20 l-485 0 -23 -26 -24 -25 0 -278 0 -279 25 -23 c13 -13 25 -27 25 -31 0 -5 -67 -8 -150 -8 -82 0 -150 4 -150 9 0 5 8 28 17 52 14 36 17 91 21 305 4 262 4 262 -19 283 -16 15 -36 21 -70 21 -75 0 -109 11 -145 47 -57 57 -50 63 78 63 101 0 114 2 135 22 21 20 23 30 23 119 0 93 -1 98 -26 118 -21 16 -41 21 -91 21 -71 0 -112 16 -137 54 -31 48 -25 51 95 48 104 -4 112 -2 135 19 l24 22 0 232 c0 182 -3 243 -16 290 -9 33 -19 70 -21 83 l-5 22 146 0 c80 0 146 -3 146 -6z m525 -64 c28 -6 88 -30 133 -52 114 -54 196 -136 250 -250 36 -73 82 -213 82 -246 0 -9 -120 -12 -495 -12 l-495 0 0 291 0 291 238 -5 c130 -3 260 -11 287 -17z m461 -1147 c-3 -10 -12 -47 -21 -83 -30 -116 -81 -207 -165 -291 -81 -82 -155 -125 -267 -153 -76 -20 -260 -36 -415 -36 l-118 0 0 290 0 290 496 0 c467 0 495 -1 490 -17z" />
                                                        <path d="M1061 1614 c-30 -25 -31 -28 -31 -114 0 -73 3 -92 21 -114 l20 -26 504 0 504 0 20 26 c18 22 21 41 21 111 0 80 -2 86 -29 114 l-29 29 -485 0 -485 0 -31 -26z m1017 -116 l3 -98 -506 0 -505 0 0 100 0 100 503 -2 502 -3 3 -97z" />
                                                      </g>
                                                    </svg>
                                                    {typeof product.price ===
                                                    "string"
                                                      ? product.price
                                                      : formatPrice(
                                                          parsePrice(
                                                            product.price
                                                          )
                                                        )}
                                                  </p>
                                                </div>
                                              ))}
                                            {getIncludedProducts(item).length >
                                              4 && (
                                              <div className="bg-gray-100 rounded p-2 flex items-center justify-center">
                                                <span className="text-xs text-gray-600 font-medium">
                                                  +
                                                  {getIncludedProducts(item)
                                                    .length - 4}{" "}
                                                  more
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Designer Note */}
                                      {getItemDetails(item)?.designerNote && (
                                        <div className="bg-blue-50 p-3 rounded">
                                          <h5 className="font-medium text-gray-900 text-xs mb-1 uppercase tracking-wide">
                                            Designer's Note:
                                          </h5>
                                          <p className="text-xs text-gray-700 italic">
                                            "
                                            {getItemDetails(item)?.designerNote}
                                            "
                                          </p>
                                        </div>
                                      )}

                                      {/* Savings Information */}
                                      {item.originalPrice && (
                                        <div className="bg-green-50 p-3 rounded">
                                          <p className="text-xs font-medium text-green-800">
                                            You save{" "}
                                            <img
                                              src="/ed.png"
                                              className="w-[20px] inline-block"
                                              alt=""
                                            />{" "}
                                            {formatPrice(
                                              (parsePrice(item.originalPrice) -
                                                parsePrice(item.price)) *
                                                item.quantity
                                            )}
                                            with this complete design package
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Shipping Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>
                      {parsePrice(cart.subtotal) >= 500 ? (
                        "Free shipping"
                      ) : (
                        <>
                          <img
                            src="/ed.png"
                            className="w-[20px] inline-block"
                            alt=""
                          />{" "}
                          {formatPrice(parsePrice(cart.shipping))} shipping
                        </>
                      )}
                    </span>
                  </div>
                  {parsePrice(cart.subtotal) < 500 && (
                    <span className="text-gray-500">
                      <img
                        src="/ed.png"
                        className="w-[20px] inline-block"
                        alt=""
                      />{" "}
                      {formatPrice(500 - parsePrice(cart.subtotal))} more for
                      free shipping
                    </span>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (incl. VAT)</span>
                    <span className="font-medium flex items-center gap-1">
                      <img src="/ed.png" className="w-[1em] h-[1em]" alt="" />
                      {formatPrice(parsePrice(cart.subtotal))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {parsePrice(cart.shipping) === 0 ? (
                        "Free"
                      ) : (
                        <span className="flex items-center gap-1">
                          <img
                            src="/ed.png"
                            className="w-[1em] h-[1em]"
                            alt=""
                          />
                          ${formatPrice(parsePrice(cart.shipping))}
                        </span>
                      )}
                    </span>
                  </div>
                  {parsePrice(cart.discount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium flex items-center gap-1">
                        -
                        <img src="/ed.png" className="w-[1em] h-[1em]" alt="" />
                        {formatPrice(parsePrice(cart.discount))}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      <img src="/ed.png" className="w-[1em] h-[1em]" alt="" />
                      {formatPrice(parsePrice(cart.total))}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Secure checkout with 256-bit SSL encryption</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-black text-white py-4 px-6 font-medium hover:bg-gray-900 transition-all duration-300 uppercase tracking-wide flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="block w-full text-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>

          {/* Auth Modal */}
          <AuthCheckModal
            isOpen={showAuthModal}
            onClose={handleAuthClose}
            onSuccess={handleAuthSuccess}
            title="Sign in to checkout"
            subtitle="Please sign in to complete your purchase"
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
