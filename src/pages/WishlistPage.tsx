import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Filter,
  Star,
  Eye,
  Package,
  Grid,
  List
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import AddToCartButton from '../components/cart/AddToCartButton';
import WishlistButton from '../components/cart/WishlistButton';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort items
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
        return 'Individual Products';
      case 'room-style':
        return 'Room Styles';
      case 'designer-collection':
        return 'Designer Collections';
      case 'design-look':
        return 'Design Looks';
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

  if (wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-8" />
              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                Save items you love and create your perfect space. Items in your wishlist are saved even after you close the browser.
              </p>
              <Link
                to="/"
                className="inline-flex items-center bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlist.itemCount} {wishlist.itemCount === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
              {wishlist.items.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Filter by:</span>
                </div>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                >
                  <option value="all">All Items</option>
                  <option value="product">Products</option>
                  <option value="room-style">Room Styles</option>
                  <option value="designer-collection">Designer Collections</option>
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

          {/* Wishlist Items */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  <div className="relative">
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadgeColor(item.type)}`}>
                        {getTypeDisplayName(item.type)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <WishlistButton
                        item={item}
                        variant="icon"
                        size="sm"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-8 h-8 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">{item.designer}</p>
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.name}</h3>
                      
                      {item.selectedColor && (
                        <div className="flex items-center mb-2">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300 mr-2"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-xs text-gray-600">{item.selectedColor.name}</span>
                        </div>
                      )}
                      
                      {item.rating && (
                        <div className="flex items-center mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{item.rating}</span>
                          {item.reviews && (
                            <span className="text-sm text-gray-500 ml-1">({item.reviews})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg text-gray-900">
                            <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {item.price.toLocaleString()}
                          </p>
                          {item.originalPrice && (
                            <p className="text-gray-500 line-through text-sm">
                              <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {item.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        {item.inStock === false && (
                          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Price incl. VAT</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={item.inStock === false}
                        className="flex-1 bg-black text-white py-2 px-3 text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  <div className="flex gap-6 p-6">
                    <div className="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
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

                          {item.rating && (
                            <div className="flex items-center mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">{item.rating}</span>
                              {item.reviews && (
                                <span className="text-sm text-gray-500 ml-1">({item.reviews})</span>
                              )}
                            </div>
                          )}

                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                          )}

                          <p className="text-xs text-gray-500">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3 ml-6">
                          <div className="text-right">
                            <p className="font-bold text-xl text-gray-900">
                              <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {item.price.toLocaleString()}
                            </p>
                            {item.originalPrice && (
                              <p className="text-gray-500 line-through text-sm">
                                <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {item.originalPrice.toLocaleString()}
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
                            
                            <WishlistButton
                              item={item}
                              variant="icon"
                              size="md"
                            />
                            
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
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary Section */}
          {wishlist.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 bg-gray-50 rounded-lg p-8"
            >
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="font-serif text-2xl text-gray-900 mb-4">Ready to Create Your Space?</h3>
                <p className="text-gray-600 mb-6">
                  You have {wishlist.itemCount} items saved. Move them to your cart to start building your perfect space.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      // Move all items to cart
                      wishlist.items.forEach(item => handleMoveToCart(item));
                    }}
                    className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </button>
                  
                  <Link
                    to="/"
                    className="border border-gray-300 text-gray-700 px-8 py-3 font-medium hover:bg-gray-50 transition-colors uppercase tracking-wide flex items-center justify-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;