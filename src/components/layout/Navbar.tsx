import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Shield,
  Package,
  Sparkles,
  LogOut,
  Loader2,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAuth } from "../../contexts/AuthContext";
import CartDrawer from "../cart/CartDrawer";
import { categoryHierarchy } from "../../data/categoryHierarchy";

/* helper: kebab-case + replace & */
const kebab = (str: string) =>
  str.replace(/&/g, "and").replace(/\s+/g, "-").toLowerCase();

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFurnitureTab, setActiveFurnitureTab] =
    useState<string>("bedroom");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, signOut } = useAuth();

  // Handle auth loading state with more conservative approach
  useEffect(() => {
    // Wait for auth to be properly initialized
    const timer = setTimeout(() => {
      setAuthInitialized(true);
    }, 1000); // Give more time for auth context to fully initialize

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only stop loading after auth is initialized and we have a clear state
    if (authInitialized) {
      if (isAuthenticated === true && user) {
        // User is definitely authenticated
        setIsAuthLoading(false);
      } else if (isAuthenticated === false && user === null) {
        // Wait a bit more to ensure this isn't a transitional state
        const timer = setTimeout(() => {
          setIsAuthLoading(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, authInitialized]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCategoryHover = (category: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setActiveCategory(category);
  };

  const handleCategoryLeave = () => {
    const timeout = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
    setHoverTimeout(timeout);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Loading spinner component
  const UserLoadingSpinner = () => (
    <div className="icon-button-minimal flex items-center space-x-1">
      <Loader2 size={18} className="animate-spin text-gray-400" />
      <span className="hidden md:block text-sm text-gray-400">Loading...</span>
    </div>
  );

  const UserDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">
          {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
        </p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <Link
        to="/dashboard"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={() => setShowUserMenu(false)}
      >
        <User className="w-4 h-4 inline mr-2" />
        Dashboard
      </Link>
      <Link
        to="/wishlist"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={() => setShowUserMenu(false)}
      >
        <Heart className="w-4 h-4 inline mr-2" />
        Wishlist ({wishlist.itemCount})
      </Link>
      <hr className="my-2" />
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        {isSigningOut ? (
          <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4 inline mr-2" />
        )}
        Sign Out
      </button>
    </div>
  );

  const MobileUserSection = () => (
    <div className="border-t border-gray-100 pt-6">
      {isAuthLoading ? (
        <div className="px-3 py-4 flex items-center justify-center">
          <Loader2 size={16} className="animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Loading user...</span>
        </div>
      ) : isAuthenticated ? (
        <div className="space-y-3">
          <div className="px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Link
            to="/dashboard"
            className="mobile-nav-item flex items-center"
            onClick={toggleMenu}
          >
            <User size={16} className="mr-2 text-gray-400" />
            Dashboard
          </Link>
          <Link
            to="/wishlist"
            className="mobile-nav-subitem flex items-center"
            onClick={toggleMenu}
          >
            <Heart size={16} className="mr-2 text-gray-400" />
            Wishlist ({wishlist.itemCount})
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              toggleMenu();
            }}
            disabled={isSigningOut}
            className="mobile-nav-subitem flex items-center w-full text-left text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <LogOut size={16} className="mr-2" />
            )}
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <Link
            to="/signin"
            className="mobile-nav-item flex items-center"
            onClick={toggleMenu}
          >
            <User size={16} className="mr-2 text-gray-400" />
            Sign In
          </Link>
          <Link
            to="/signup"
            className="mobile-nav-subitem"
            onClick={toggleMenu}
          >
            Create Account
          </Link>
        </div>
      )}
    </div>
  );

  const roomTabs = {
    "living-room": {
      title: "Living Room",
      shopAllLink: "/category/living-room",
      items: [
        "Sofas & Sectionals",
        "Armchairs & Accent Chairs",
        "Coffee Tables",
        "Side Tables",
        "Console Tables",
        "TV Units & Media Consoles",
        "Bookcases & Shelving",
        "Cabinets & Storage Units",
        "Room Dividers",
        "Nursery & Kids Furniture",
        "Chandeliers",
        "Pendant Lights",
        "Flush & Semi-Flush Mounts",
        "Wall Sconces",
        "Picture Lights",
        "Table Lamps",
        "Floor Lamps",
        "Wall Art & Paintings",
        "Mirrors",
        "Clocks",
        "Sculptures & Figurines",
        "Vases & Bowls",
        "Decorative Trays",
        "Candles & Holders",
        "Artificial Plants & Planters",
        "Cushions & Throws",
        "Rugs",
        "Curtains & Blinds",
        "Room Fragrance & Diffusers",
        "Tabletop Decor",
        "Books & Magazines",
        "Planters & Pots",
      ].map((name) => ({ name, link: `/category/living-room/${kebab(name)}` })),
    },
    bedroom: {
      title: "Bedroom",
      shopAllLink: "/category/bedroom",
      items: [
        "Side Tables",
        "Beds",
        "Nightstands",
        "Dressers & Chests",
        "Wardrobes & Closets",
        "Vanity Tables & Mirrors",
        "Table Lamps",
        "Floor Lamps",
        "Desk Lamps",
        "Wall Art & Paintings",
        "Mirrors",
        "Candles & Holders",
        "Cushions & Throws",
        "Rugs",
        "Curtains & Blinds",
        "Room Fragrance & Diffusers",
      ].map((name) => ({ name, link: `/category/bedroom/${kebab(name)}` })),
    },
    "dining-room": {
      title: "Dining Room",
      shopAllLink: "/category/dining-room",
      items: [
        "Console Tables",
        "Dining Tables",
        "Dining Chairs & Benches",
        "Bar Stools",
        "Chandeliers",
        "Pendant Lights",
        "Wall Sconces",
        "Wall Art & Paintings",
        "Mirrors",
        "Clocks",
        "Sculptures & Figurines",
        "Vases & Bowls",
        "Decorative Trays",
        "Candles & Holders",
        "Rugs",
        "Curtains & Blinds",
        "Tabletop Decor",
      ].map((name) => ({ name, link: `/category/dining-room/${kebab(name)}` })),
    },
    office: {
      title: "Office",
      shopAllLink: "/category/office",
      items: [
        "Bookcases & Shelving",
        "Cabinets & Storage Units",
        "Office Desks",
        "Office Chairs",
        "Room Dividers",
        "Track & Rail Lighting",
        "Recessed Lighting",
        "Table Lamps",
        "Desk Lamps",
        "Wall Art & Paintings",
        "Curtains & Blinds",
        "Home Office Accessories",
        "Books & Magazines",
      ].map((name) => ({ name, link: `/category/office/${kebab(name)}` })),
    },
    kitchen: {
      title: "Kitchen",
      shopAllLink: "/category/kitchen",
      items: [
        "Bar Stools",
        "Kitchen Appliances",
        "Small Appliances",
        "Pendant Lights",
        "Flush & Semi-Flush Mounts",
        "Track & Rail Lighting",
        "Recessed Lighting",
        "Decorative Trays",
      ].map((name) => ({ name, link: `/category/kitchen/${kebab(name)}` })),
    },
    entryway: {
      title: "Entryway",
      shopAllLink: "/category/entryway",
      items: [
        "Console Tables",
        "Entryway Benches & Shoe Racks",
        "Wall Sconces",
        "Wall Art & Paintings",
        "Mirrors",
        "Clocks",
        "Vases & Bowls",
        "Artificial Plants & Planters",
        "Planters & Pots",
        "Room Fragrance & Diffusers",
      ].map((name) => ({ name, link: `/category/entryway/${kebab(name)}` })),
    },
    outdoor: {
      title: "Outdoor",
      shopAllLink: "/category/outdoor",
      items: [
        "Outdoor Lighting",
        "Artificial Plants & Planters",
        "Cushions & Throws",
        "Rugs",
        "Outdoor Sofas & Lounge Chairs",
        "Outdoor Dining Tables",
        "Outdoor Dining Chairs",
        "Hammocks & Swings",
        "Daybeds & Sun Loungers",
        "Patio Umbrellas",
        "Fire Pits & Heaters",
        "Outdoor Rugs",
        "Garden Storage",
        "Planters & Pots",
        "BBQs & Grills",
        "Outdoor Cushions",
        "Outdoor Accessories & Covers",
      ].map((name) => ({ name, link: `/category/outdoor/${kebab(name)}` })),
    },
  };

  const currentTab = roomTabs[activeFurnitureTab as keyof typeof roomTabs];

  useEffect(() => {
    setActiveFurnitureTab("living-room");
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Top banner */}
        <div className="bg-black text-white py-2">
          <div className="container-custom text-center">
            <p className="text-xs font-medium tracking-wider uppercase">
              Free shipping on orders over{" "}
              <img src="/ed.png" className="w-[20px] inline-block" alt="" /> 500
            </p>
          </div>
        </div>

        {/* Main navigation */}
        <div className="py-4">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <button
                  className="p-2 text-gray-600 hover:text-black transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Logo */}
              <div className="flex-1 lg:flex-none lg:mr-8">
                <Link to="/" className="flex justify-center lg:justify-start">
                  <img
                    src="/Design sans titre.png"
                    alt="Marahb"
                    className="h-12 md:h-16 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Desktop navigation - Minimal */}
              <nav className="hidden lg:flex items-center space-x-8 flex-1">
                {/* NEW Menu - Simplifié */}
                <div
                  className="relative nav-link-minimal group"
                  onMouseEnter={() => handleCategoryHover("new")}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="cursor-pointer flex items-center">
                    <Sparkles size={14} className="mr-1.5 text-gray-400" />
                    New
                  </div>
                  {activeCategory === "new" && (
                    <div
                      className="absolute left-0 mt-6 w-80 bg-white shadow-lg border border-gray-100 z-50"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="p-8">
                        <div className="space-y-6">
                          {/* Bestsellers */}
                          <div>
                            <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wide">
                              Popular
                            </h3>
                            <div className="space-y-3">
                              <Link
                                to="/category/bestsellers"
                                className="block text-sm text-gray-600 hover:text-black transition-colors"
                              >
                                Bestsellers
                              </Link>
                              <Link
                                to="/category/new"
                                className="block text-sm text-gray-600 hover:text-black transition-colors"
                              >
                                New Arrivals
                              </Link>
                            </div>
                          </div>

                          {/* Collections */}
                          <div>
                            <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wide">
                              Collections
                            </h3>
                            <div className="space-y-3">
                              <Link
                                to="/category/living-room"
                                className="block text-sm text-gray-600 hover:text-black transition-colors"
                              >
                                Majlis Collection
                              </Link>
                              <Link
                                to="/category/summer"
                                className="block text-sm text-gray-600 hover:text-black transition-colors"
                              >
                                Summer Collection
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* FURNITURE Menu - Horizontal Tab Style */}
                <div
                  className="relative nav-link-minimal group"
                  onMouseEnter={() => handleCategoryHover("furniture")}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link to="#" className="cursor-pointer">
                    Furniture
                  </Link>
                  {activeCategory === "furniture" && (
                    <div
                      className="absolute left-0 mt-6 w-[900px] bg-white shadow-lg border border-gray-100 z-50"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {/* Horizontal tab bar */}
                      <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-8 pt-6">
                          {Object.keys(roomTabs).map((key) => (
                            <button
                              key={key}
                              onClick={() => setActiveFurnitureTab(key)}
                              className={`pb-4 text-sm font-medium transition-colors ${
                                activeFurnitureTab === key
                                  ? "text-gray-900 border-b-2 border-gray-900"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              {roomTabs[key as keyof typeof roomTabs].title}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3-column grid (identical layout) */}
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                          <h2 className="text-2xl font-medium text-gray-900">
                            {
                              roomTabs[
                                activeFurnitureTab as keyof typeof roomTabs
                              ].title
                            }
                          </h2>
                          <Link
                            to={
                              roomTabs[
                                activeFurnitureTab as keyof typeof roomTabs
                              ].shopAllLink
                            }
                            className="text-sm text-gray-600 hover:text-black transition-colors underline"
                          >
                            Shop All
                          </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-x-16 gap-y-8">
                          {roomTabs[
                            activeFurnitureTab as keyof typeof roomTabs
                          ].items.map(({ name, link }) => (
                            <div key={name}>
                              <Link
                                to={link}
                                className="block text-gray-700 hover:text-black transition-colors py-1"
                              >
                                {name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/designers" className="nav-link-minimal">
                  Designers
                </Link>

                <Link
                  to="/designer-room-styles"
                  className="nav-link-minimal flex items-center"
                >
                  Room Styles
                </Link>

                <Link
                  to="/virtual-stores"
                  className="nav-link-minimal text-nowrap"
                >
                  Virtual Stores
                </Link>

                <Link to="/about" className="nav-link-minimal">
                  About
                </Link>
              </nav>

              {/* Right side actions */}
              <div className="flex items-center space-x-2">
                {/* Updated Wishlist Link with Count */}
                <Link to="/wishlist" className="icon-button-minimal relative">
                  <Heart size={18} />
                  {wishlist.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {wishlist.itemCount > 99 ? "99+" : wishlist.itemCount}
                    </span>
                  )}
                </Link>

                {/* User Authentication with Loading State */}
                <div className="relative">
                  {isAuthLoading ? (
                    <UserLoadingSpinner />
                  ) : isAuthenticated ? (
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="icon-button-minimal flex items-center space-x-1"
                    >
                      <User size={18} />
                      {user?.user_metadata?.first_name && (
                        <span className="hidden md:block text-sm font-medium">
                          {user.user_metadata.first_name}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link to="/signin" className="icon-button-minimal">
                      <User size={18} />
                    </Link>
                  )}

                  {showUserMenu && isAuthenticated && !isAuthLoading && (
                    <UserDropdown />
                  )}
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="icon-button-minimal relative"
                >
                  <ShoppingCart size={18} />
                  {cart.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {cart.itemCount > 99 ? "99+" : cart.itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="py-6 px-4 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div
                className="mobile-nav-item flex items-center"
                onClick={toggleMenu}
              >
                <Sparkles size={16} className="mr-2 text-gray-400" />
                New
              </div>

              <div className="py-3 border-b border-gray-100">
                <h3 className="font-medium text-sm mb-3 text-gray-900 uppercase tracking-wide">
                  Categories
                </h3>
                <div className="space-y-2 pl-3">
                  <Link
                    to="#"
                    className="mobile-nav-subitem"
                    onClick={toggleMenu}
                  >
                    Furniture
                  </Link>
                  <Link
                    to="/category/furniture/office-desks"
                    className="mobile-nav-subitem"
                    onClick={toggleMenu}
                  >
                    Office Furniture
                  </Link>
                  <Link
                    to="/category/lighting"
                    className="mobile-nav-subitem"
                    onClick={toggleMenu}
                  >
                    Lighting
                  </Link>
                  <Link
                    to="/category/decor-accessories"
                    className="mobile-nav-subitem"
                    onClick={toggleMenu}
                  >
                    Decor & Accessories
                  </Link>
                  <Link
                    to="/category/outdoor"
                    className="mobile-nav-subitem"
                    onClick={toggleMenu}
                  >
                    Outdoor
                  </Link>
                </div>
              </div>

              <Link
                to="/virtual-stores"
                className="mobile-nav-item"
                onClick={toggleMenu}
              >
                Virtual Stores
              </Link>

              <Link
                to="/designer-room-styles"
                className="mobile-nav-item flex items-center"
                onClick={toggleMenu}
              >
                <Package size={16} className="mr-2 text-gray-400" />
                Room Styles
              </Link>

              <Link
                to="/designers"
                className="mobile-nav-item"
                onClick={toggleMenu}
              >
                Designers
              </Link>

              <Link
                to="/about"
                className="mobile-nav-item"
                onClick={toggleMenu}
              >
                About
              </Link>

              {/* Mobile Auth Links with Loading State */}
              <MobileUserSection />

              {/* Mobile Cart Button */}
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  toggleMenu();
                }}
                className="mobile-nav-item flex items-center w-full"
              >
                <ShoppingCart size={16} className="mr-2 text-gray-400" />
                Cart ({cart.itemCount})
              </button>

              {/* Mobile Wishlist Button */}
              <Link
                to="/wishlist"
                className="mobile-nav-item flex items-center"
                onClick={toggleMenu}
              >
                <Heart size={16} className="mr-2 text-gray-400" />
                Wishlist ({wishlist.itemCount})
              </Link>

              {/* Mobile Lead Magnet Link */}
              <div className="border-t border-gray-100 pt-6">
                <Link
                  to="/launch"
                  className="mobile-nav-subitem flex items-center"
                  onClick={toggleMenu}
                >
                  <Shield size={16} className="mr-2 text-gray-400" />
                  Lead Magnet
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
