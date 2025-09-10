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
  ShoppingCart,
  Trash2,
  Grid,
  List
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const CustumerWishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Use wishlist context
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Filter and sort states
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Filter and sort wishlist items
  const filteredItems = wishlist.items.filter(item => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (selectedSort) {
      case 'newest':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'oldest':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleMoveToCart = (item: any) => {
    // Map wishlist item to cart item format
    addToCart({
      type: item.type,
      ...(item.type === 'product' && { productId: item.productId }),
      ...(item.type === 'room-style' && { roomStyleId: item.roomStyleId }),
      ...(item.type === 'designer-collection' && { designerCollectionId: item.designerCollectionId }),
      ...(item.type === 'design-look' && { lookId: item.lookId }),
      name: item.name,
      designer: item.designer,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
      selectedColor: item.selectedColor || { name: 'Default', hex: '#000000' },
      source: item.source,
      sourceDesignerId: item.sourceDesignerId
    });

    // Remove from wishlist
    removeFromWishlist(item.id);
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'product':
        return 'Product';
      case 'room-style':
        return 'Room Style';
      case 'designer-collection':
        return 'Collection';
      case 'design-look':
        return 'Design Look';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-blue-100 text-blue-700';
      case 'room-style':
        return 'bg-green-100 text-green-700';
      case 'designer-collection':
        return 'bg-purple-100 text-purple-700';
      case 'design-look':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
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
              <h1 className="font-serif text-2xl text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">Save and organize your favorite items</p>
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
              {/* Controls and Filters */}
              {wishlist.items.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Filter:</span>
                      </div>
                      <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                      >
                        <option value="all">All Items</option>
                        <option value="product">Products</option>
                        <option value="room-style">Room Styles</option>
                        <option value="designer-collection">Collections</option>
                        <option value="design-look">Design Looks</option>
                      </select>
                      
                      <select 
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className='mb-6'>
              <h1 className="font-serif text-2xl text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">Save and organize your favorite items</p>
            </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-gray-900">
                    My Wishlist ({wishlist.itemCount} {wishlist.itemCount === 1 ? 'item' : 'items'})
                  </h3>
                  {wishlist.items.length > 0 && (
                    <button 
                      onClick={handleClearAll}
                      className="text-sm text-black hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {wishlist.items.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">Start exploring and save items you love!</p>
                    <Link 
                      to="/products" 
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      Browse Products
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedItems.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                              <div className="aspect-square overflow-hidden bg-gray-50">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              
                              {/* Type Badge */}
                              <div className="absolute top-3 left-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadgeColor(item.type)}`}>
                                  {getTypeDisplayName(item.type)}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <p className="text-sm text-gray-500 mb-1">{item.designer}</p>
                              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h4>
                              
                              {item.selectedColor && (
                                <div className="flex items-center mb-2">
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300 mr-2"
                                    style={{ backgroundColor: item.selectedColor.hex }}
                                  />
                                  <span className="text-xs text-gray-600">{item.selectedColor.name}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <p className="font-bold text-lg text-black flex items-center gap-1">
                                    <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 
                                    {item.price.toLocaleString()}
                                  </p>
                                  {item.originalPrice && (
                                    <p className="text-gray-500 line-through text-sm flex items-center gap-1">
                                      <img src="/ed.png" className='w-[12px] inline-block' alt="" /> 
                                      {item.originalPrice.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full ${item.inStock !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleMoveToCart(item)}
                                  disabled={item.inStock === false}
                                  className="flex-1 bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </button>
                                <button 
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="p-2 border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                                  title="Remove from wishlist"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                                </button>
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-3">
                                Added {new Date(item.addedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedItems.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex gap-6 p-6">
                              <div className="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadgeColor(item.type)}`}>
                                        {getTypeDisplayName(item.type)}
                                      </span>
                                      {item.inStock === false && (
                                        <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                                          Out of Stock
                                        </span>
                                      )}
                                    </div>
                                    
                                    <h3 className="font-medium text-xl text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-gray-600 mb-2">{item.designer}</p>
                                    
                                    {item.selectedColor && (
                                      <div className="flex items-center mb-2">
                                        <div
                                          className="w-3 h-3 rounded-full border border-gray-300 mr-2"
                                          style={{ backgroundColor: item.selectedColor.hex }}
                                        />
                                        <span className="text-sm text-gray-600">{item.selectedColor.name}</span>
                                      </div>
                                    )}

                                    <p className="text-xs text-gray-500">
                                      Added {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                  </div>

                                  <div className="flex flex-col items-end gap-3 ml-6">
                                    <div className="text-right">
                                      <p className="font-bold text-xl text-gray-900 flex items-center gap-1">
                                        <img src="/ed.png" className='w-[20px] inline-block' alt="" /> 
                                        {item.price.toLocaleString()}
                                      </p>
                                      {item.originalPrice && (
                                        <p className="text-gray-500 line-through text-sm flex items-center gap-1">
                                          <img src="/ed.png" className='w-[20px] inline-block' alt="" /> 
                                          {item.originalPrice.toLocaleString()}
                                        </p>
                                      )}
                                      <p className="text-xs text-gray-500 mt-1">Price incl. VAT</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleMoveToCart(item)}
                                        disabled={item.inStock === false}
                                        className="bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                      >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                      </button>
                                      
                                      <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="p-2 hover:bg-red-50 rounded transition-colors text-gray-500 hover:text-red-600"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bulk Actions */}
                    {wishlist.items.length > 0 && (
                      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <h4 className="font-medium text-gray-900 mb-2">Ready to purchase?</h4>
                          <p className="text-gray-600 mb-4">
                            Add all items to your cart to continue shopping.
                          </p>
                          <button
                            onClick={() => {
                              // Move all items to cart
                              wishlist.items.forEach(item => handleMoveToCart(item));
                            }}
                            className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 mx-auto"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add All to Cart
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustumerWishlistPage;